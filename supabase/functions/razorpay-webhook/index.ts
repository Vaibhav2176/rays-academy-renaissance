import { createClient } from "npm:@supabase/supabase-js@2";
import { getFunctionEnv } from "../_shared/env.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Server is not configured" }, 500);
  }

  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("X-Razorpay-Signature") ||
      req.headers.get("x-razorpay-signature");

    if (!signature) {
      return jsonResponse({ error: "Missing webhook signature header" }, 400);
    }

    // 1. Verify Webhook Signature against Raw Body (fail-closed: genuine Test/Live mode only)
    const webhookSecret = getFunctionEnv("RAZORPAY_WEBHOOK_SECRET")?.trim();

    if (!webhookSecret || webhookSecret.includes("placeholder")) {
      console.error("Razorpay webhook secret is not configured or is placeholder");
      return jsonResponse({ error: "Webhook endpoint unconfigured" }, 503);
    }

    const expectedSignature = await hmacSha256Hex(webhookSecret, rawBody);
    if (!timingSafeEqual(expectedSignature, signature)) {
      console.warn("Invalid webhook signature received");
      return jsonResponse({ error: "Invalid webhook signature" }, 400);
    }

    // 2. Parse Webhook Event JSON
    let payload: Record<string, any>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return jsonResponse({ error: "Invalid JSON webhook payload" }, 400);
    }

    const eventId = (payload.event_id || payload.id || `evt_${Date.now()}`) as string;
    const eventType = (payload.event || "unknown") as string;

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // 3. Deduplication: Check if this event was already processed
    const { data: existingEvent } = await admin
      .from("payment_webhook_events")
      .select("processing_status")
      .eq("provider", "razorpay")
      .eq("provider_event_id", eventId)
      .maybeSingle();

    if (existingEvent?.processing_status === "processed") {
      return jsonResponse({
        success: true,
        message: "Webhook event already processed (idempotent)",
        event_id: eventId,
      });
    }

    // Upsert event as received
    await admin.from("payment_webhook_events").upsert(
      {
        provider: "razorpay",
        provider_event_id: eventId,
        event_type: eventType,
        processing_status: "received",
        payload: payload,
      },
      { onConflict: "provider,provider_event_id" }
    );

    // 4. Handle Specific Event Types
    if (eventType === "order.paid" || eventType === "payment.captured") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      const providerOrderId = orderEntity?.id || paymentEntity?.order_id;
      const providerPaymentId = paymentEntity?.id || `pay_${eventId}`;
      const amount = paymentEntity?.amount || orderEntity?.amount;
      const currency = paymentEntity?.currency || orderEntity?.currency || "INR";

      if (providerOrderId) {
        // Find local order through payment_attempts
        const { data: attempt } = await admin
          .from("payment_attempts")
          .select("order_id, amount_minor, currency")
          .eq("provider_order_id", providerOrderId)
          .maybeSingle();

        if (attempt) {
          const effectiveAmount = amount || attempt.amount_minor;
          const effectiveCurrency = currency || attempt.currency || "INR";

          const { error: finalErr } = await admin.rpc(
            "finalize_payment_and_grant_entitlement",
            {
              _order_id: attempt.order_id,
              _provider_order_id: providerOrderId,
              _provider_payment_id: providerPaymentId,
              _amount_minor: effectiveAmount,
              _currency: effectiveCurrency,
            }
          );

          if (finalErr) {
            console.error("Webhook payment finalization error:", finalErr);
            await admin
              .from("payment_webhook_events")
              .update({
                processing_status: "failed",
                error_message: finalErr.message,
              })
              .eq("provider", "razorpay")
              .eq("provider_event_id", eventId);

            return jsonResponse({ error: "Failed to finalize payment" }, 500);
          }
        }
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const providerOrderId = paymentEntity?.order_id;
      const providerPaymentId = paymentEntity?.id;

      if (providerOrderId) {
        const { data: attempt } = await admin
          .from("payment_attempts")
          .select("order_id")
          .eq("provider_order_id", providerOrderId)
          .maybeSingle();

        if (attempt) {
          await admin.rpc("record_failed_payment_attempt", {
            _order_id: attempt.order_id,
            _provider_order_id: providerOrderId,
            _provider_payment_id: providerPaymentId,
          });
        }
      }
    }

    // Mark event as processed
    await admin
      .from("payment_webhook_events")
      .update({
        processing_status: "processed",
        processed_at: new Date().toISOString(),
      })
      .eq("provider", "razorpay")
      .eq("provider_event_id", eventId);

    return jsonResponse({
      success: true,
      message: `Webhook event ${eventType} successfully processed`,
      event_id: eventId,
    });
  } catch (error) {
    console.error("Unexpected error in razorpay-webhook:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});

