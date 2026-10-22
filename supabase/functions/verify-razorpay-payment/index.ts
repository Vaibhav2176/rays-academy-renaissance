import { createClient } from "npm:@supabase/supabase-js@2";
import { getFunctionEnv } from "../_shared/env.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: "Server is not configured" }, 500);
  }

  try {
    // 1. Authenticate caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Authentication required to verify payment" }, 401);
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return jsonResponse({ error: "Invalid authorization token" }, 401);
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData?.user?.id) {
      return jsonResponse({ error: "Unauthorized access token" }, 401);
    }

    const callerUserId = authData.user.id;

    // 2. Parse payload
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON request body" }, 400);
    }

    const orderId = (body.orderId || body.order_id) as string | undefined;
    const razorpayOrderId = (body.razorpayOrderId || body.razorpay_order_id) as string | undefined;
    const razorpayPaymentId = (body.razorpayPaymentId || body.razorpay_payment_id) as string | undefined;
    const razorpaySignature = (body.razorpaySignature || body.razorpay_signature) as string | undefined;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return jsonResponse(
        { error: "Missing required payment verification parameters" },
        400
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // 3. Look up order and verify ownership
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr || !order) {
      return jsonResponse({ error: "Order not found" }, 404);
    }

    // SECURITY INVARIANT: Order must belong to caller
    if (order.user_id !== callerUserId) {
      return jsonResponse(
        { error: "Unauthorized: You cannot verify an order belonging to another user" },
        403
      );
    }

    // 4. Verify Payment Attempt Association
    const { data: attempt } = await admin
      .from("payment_attempts")
      .select("*")
      .eq("order_id", orderId)
      .eq("provider_order_id", razorpayOrderId)
      .maybeSingle();

    if (!attempt) {
      return jsonResponse(
        { error: "Order does not match the provided Razorpay order ID" },
        400
      );
    }

    // 5. Cryptographic Signature Verification (fail-closed: genuine Test/Live mode only)
    const rzpSecret = getFunctionEnv("RAZORPAY_KEY_SECRET")?.trim();

    if (!rzpSecret || rzpSecret.includes("placeholder")) {
      console.error("Razorpay key secret is not configured or is placeholder");
      return jsonResponse({ error: "Payment verification gateway unconfigured" }, 503);
    }

    const payloadToSign = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = await hmacSha256Hex(rzpSecret, payloadToSign);

    if (!timingSafeEqual(expectedSignature, razorpaySignature)) {
      console.warn(`Payment signature verification failed for order ${orderId}`);
      await admin.rpc("record_failed_payment_attempt", {
        _order_id: orderId,
        _provider_order_id: razorpayOrderId,
        _provider_payment_id: razorpayPaymentId,
      });
      return jsonResponse({ error: "Invalid payment signature" }, 400);
    }

    // 6. Atomic Transaction: Finalize payment and grant durable entitlement
    const { data: finalizeData, error: finalizeError } = await admin.rpc(
      "finalize_payment_and_grant_entitlement",
      {
        _order_id: orderId,
        _provider_order_id: razorpayOrderId,
        _provider_payment_id: razorpayPaymentId,
        _amount_minor: order.total_minor,
        _currency: order.currency || "INR",
      }
    );

    if (finalizeError) {
      console.error("Payment finalization failed in DB:", finalizeError);
      return jsonResponse({ error: "Failed to finalize payment entitlement" }, 500);
    }

    return jsonResponse({
      success: true,
      message: "Payment successfully verified and study material unlocked",
      order_id: orderId,
      already_processed: finalizeData?.already_processed ?? false,
    });
  } catch (error) {
    console.error("Unexpected error in verify-razorpay-payment:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});

