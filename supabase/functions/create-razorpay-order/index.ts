import { createClient } from "npm:@supabase/supabase-js@2";
import { getFunctionEnv, isLocalEnvironment } from "../_shared/env.ts";

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
    // 1. Authenticate the caller via Bearer token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Authentication required to initiate purchase" }, 401);
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

    const purchaserUserId = authData.user.id;

    // 2. Parse request payload
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON request body" }, 400);
    }

    const rawProductId = (body.productId || body.product_id) as string | undefined;
    const rawMaterialId = (body.materialId || body.material_id) as string | undefined;
    const rawBundleType = (
      body.bundleType ||
      body.bundle_type ||
      body.purchaseType ||
      body.purchase_type
    ) as string | undefined;
    const rawCourseSlug = (body.courseSlug || body.course_slug) as string | undefined;
    const rawSubjectSlug = (body.subjectSlug || body.subject_slug) as string | undefined;

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    let targetProductId: string | null = null;
    let targetMaterialId: string | null = null;

    // 3. Resolve canonical Product from Database
    if (rawProductId && typeof rawProductId === "string") {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(rawProductId.trim())) {
        return jsonResponse({ error: "Invalid product ID format" }, 400);
      }
      targetProductId = rawProductId.trim();
    } else if (rawMaterialId && typeof rawMaterialId === "string") {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(rawMaterialId.trim())) {
        return jsonResponse({ error: "Invalid material ID format" }, 400);
      }
      targetMaterialId = rawMaterialId.trim();

      // Look up material
      const { data: mat, error: matError } = await admin
        .from("study_materials")
        .select("id, title, is_free, price_minor, status")
        .eq("id", targetMaterialId)
        .maybeSingle();

      if (matError || !mat) {
        return jsonResponse({ error: "Study material not found" }, 404);
      }

      if (mat.status !== "published") {
        return jsonResponse({ error: "Only published materials can be purchased" }, 400);
      }

      if (mat.is_free) {
        return jsonResponse({ error: "This study material is free and does not require purchase" }, 400);
      }

      // Resolve or sync linked product
      const { data: link } = await admin
        .from("product_materials")
        .select("product_id")
        .eq("material_id", targetMaterialId)
        .maybeSingle();

      if (link?.product_id) {
        targetProductId = link.product_id;
      } else {
        // Fallback: lookup by slug or create product
        const productSlug = `material-${targetMaterialId}`;
        const { data: existingProd } = await admin
          .from("products")
          .select("id")
          .eq("slug", productSlug)
          .maybeSingle();

        if (existingProd?.id) {
          targetProductId = existingProd.id;
        } else {
          const { data: newProd, error: prodErr } = await admin
            .from("products")
            .insert({
              slug: productSlug,
              title: mat.title,
              product_type: "material",
              price_minor: mat.price_minor || 4900,
              currency: "INR",
              status: "published",
            })
            .select("id")
            .single();

          if (prodErr || !newProd) {
            return jsonResponse({ error: "Failed to initialize product for material" }, 500);
          }
          targetProductId = newProd.id;
        }

        await admin.from("product_materials").upsert({
          product_id: targetProductId,
          material_id: targetMaterialId,
        });
      }
    } else if (rawBundleType === "subject_bundle" || rawBundleType === "course_bundle") {
      if (!rawCourseSlug) {
        return jsonResponse({ error: "Course slug is required for bundle purchase" }, 400);
      }
      if (rawBundleType === "subject_bundle" && !rawSubjectSlug) {
        return jsonResponse({ error: "Subject slug is required for subject bundle purchase" }, 400);
      }

      const { data: bundleProdId, error: bundleErr } = await admin.rpc(
        "get_or_create_bundle_product",
        {
          _product_type: rawBundleType,
          _course_slug: rawCourseSlug.trim(),
          _subject_slug: rawSubjectSlug ? rawSubjectSlug.trim() : null,
        }
      );

      if (bundleErr || !bundleProdId) {
        return jsonResponse({ error: "Failed to resolve bundle product: " + bundleErr?.message }, 500);
      }
      targetProductId = bundleProdId;
    } else {
      return jsonResponse({ error: "Invalid purchase request: missing product or bundle specification" }, 400);
    }

    // 4. Fetch Canonical Product details from database
    const { data: product, error: prodFetchError } = await admin
      .from("products")
      .select("*")
      .eq("id", targetProductId)
      .maybeSingle();

    if (prodFetchError || !product) {
      return jsonResponse({ error: "Product not found or invalid" }, 404);
    }

    if (product.status !== "published") {
      return jsonResponse({ error: "This product is not currently available for purchase" }, 400);
    }

    // Authoritative amount in paise from Database
    const authoritativeAmountMinor = product.price_minor;
    if (authoritativeAmountMinor <= 0) {
      return jsonResponse({ error: "Product price must be greater than zero for checkout" }, 400);
    }

    // 5. Check whether the purchaser already has active entitlement
    if (product.product_type === "material") {
      let matIdToCheck = targetMaterialId;
      if (!matIdToCheck) {
        const { data: pm } = await admin
          .from("product_materials")
          .select("material_id")
          .eq("product_id", product.id)
          .maybeSingle();
        matIdToCheck = pm?.material_id || null;
      }

      if (matIdToCheck) {
        const { data: alreadyHasAccess } = await admin.rpc("has_material_access", {
          _user_id: purchaserUserId,
          _material_id: matIdToCheck,
        });

        if (alreadyHasAccess) {
          return jsonResponse(
            {
              error: "You already own active access to this study material",
              already_entitled: true,
            },
            409
          );
        }
      }
    } else if (product.product_type === "subject_bundle") {
      const { data: existingEntitlement } = await admin
        .from("material_entitlements")
        .select("id")
        .eq("user_id", purchaserUserId)
        .eq("entitlement_scope", "subject_bundle")
        .eq("course_slug", product.course_slug)
        .eq("subject_slug", product.subject_slug)
        .eq("status", "active")
        .maybeSingle();

      if (existingEntitlement) {
        return jsonResponse(
          {
            error: "You already own active access to this subject bundle",
            already_entitled: true,
          },
          409
        );
      }
    } else if (product.product_type === "course_bundle") {
      const { data: existingEntitlement } = await admin
        .from("material_entitlements")
        .select("id")
        .eq("user_id", purchaserUserId)
        .eq("entitlement_scope", "course_bundle")
        .eq("course_slug", product.course_slug)
        .eq("status", "active")
        .maybeSingle();

      if (existingEntitlement) {
        return jsonResponse(
          {
            error: "You already own active access to this course bundle",
            already_entitled: true,
          },
          409
        );
      }
    }

    // 6. Create Local Pending Order and Order Item
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .insert({
        user_id: purchaserUserId,
        status: "pending",
        currency: product.currency || "INR",
        subtotal_minor: authoritativeAmountMinor,
        discount_minor: 0,
        total_minor: authoritativeAmountMinor,
      })
      .select()
      .single();

    if (orderErr || !order) {
      console.error("Order creation error:", orderErr);
      return jsonResponse({ error: "Failed to create local purchase order" }, 500);
    }

    const { error: itemErr } = await admin.from("order_items").insert({
      order_id: order.id,
      product_id: product.id,
      product_slug: product.slug,
      product_title: product.title,
      quantity: 1,
      unit_price_minor: authoritativeAmountMinor,
      currency: product.currency || "INR",
    });

    if (itemErr) {
      console.error("Order item creation error:", itemErr);
      return jsonResponse({ error: "Failed to record order item" }, 500);
    }

    // 7. Validate Razorpay Credentials (fail-closed: genuine Test/Live mode only)
    const rzpKeyId = getFunctionEnv("RAZORPAY_KEY_ID")?.trim();
    const rzpKeySecret = getFunctionEnv("RAZORPAY_KEY_SECRET")?.trim();

    if (!rzpKeyId || !rzpKeySecret || rzpKeyId.includes("placeholder") || rzpKeySecret.includes("placeholder")) {
      console.error("Razorpay credentials are not configured or are placeholder");
      await admin.from("orders").update({ status: "failed" }).eq("id", order.id);
      return jsonResponse({ error: "Payment gateway credentials are not configured" }, 503);
    }

    let providerOrderId: string;

    const isMockOutbound =
      isLocalEnvironment() &&
      getFunctionEnv("RAZORPAY_MOCK_OUTBOUND") === "true" &&
      rzpKeyId.startsWith("rzp_test_");

    if (isMockOutbound) {
      providerOrderId = `order_test_${order.id.replace(/-/g, "").slice(0, 14)}`;
    } else {
      try {
        const basicAuth = btoa(`${rzpKeyId}:${rzpKeySecret}`);
        const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: authoritativeAmountMinor,
            currency: product.currency || "INR",
            receipt: `rcpt_${order.id.replace(/-/g, "").slice(0, 30)}`,
            notes: {
              order_id: order.id,
              user_id: purchaserUserId,
              product_id: product.id,
            },
          }),
        });

        if (!rzpResponse.ok) {
          const errBody = await rzpResponse.text();
          console.error("Razorpay order creation failed:", errBody);
          await admin.from("orders").update({ status: "failed" }).eq("id", order.id);
          return jsonResponse({ error: "Payment gateway order creation failed" }, 502);
        }

        const rzpOrderData = await rzpResponse.json();
        providerOrderId = rzpOrderData.id;
      } catch (e) {
        console.error("Network error communicating with Razorpay:", e);
        await admin.from("orders").update({ status: "failed" }).eq("id", order.id);
        return jsonResponse({ error: "Failed to connect to payment provider" }, 502);
      }
    }

    // 8. Record Payment Attempt
    const { error: attemptErr } = await admin.from("payment_attempts").insert({
      order_id: order.id,
      provider: "razorpay",
      provider_order_id: providerOrderId,
      status: "created",
      amount_minor: authoritativeAmountMinor,
      currency: product.currency || "INR",
    });

    if (attemptErr) {
      console.error("Payment attempt creation error:", attemptErr);
    }

    // 9. Return Response to Authenticated Frontend
    return jsonResponse({
      order_id: order.id,
      razorpay_order_id: providerOrderId,
      amount: authoritativeAmountMinor,
      amount_minor: authoritativeAmountMinor,
      currency: product.currency || "INR",
      key_id: rzpKeyId,
      product_title: product.title,
    });
  } catch (error) {
    console.error("Unexpected error in create-razorpay-order:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
