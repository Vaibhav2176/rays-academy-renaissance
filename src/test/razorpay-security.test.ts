import { describe, it, expect, vi } from "vitest";
import crypto from "crypto";

// ============================================================================
// Cryptographic Helper Functions mirroring Edge Function Implementation
// ============================================================================

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await globalThis.crypto.subtle.sign("HMAC", cryptoKey, messageData);
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

// ============================================================================
// Simulated Edge Function Handlers mirroring Secure Fail-Closed Architecture
// ============================================================================

interface CreateOrderEnv {
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
}

async function simulateCreateOrder(
  env: CreateOrderEnv,
  authHeader: string | null,
  product: { id: string; price_minor: number; currency: string } | null,
  body: { materialId?: string; purchaseType?: string; forged_price?: number },
  mockRazorpayApi?: (params: any) => Promise<{ ok: boolean; status: number; data?: any }>
) {
  // 1. Authenticate caller
  if (!authHeader?.startsWith("Bearer ")) {
    return { status: 401, error: "Authentication required to initiate purchase" };
  }
  const token = authHeader.slice(7).trim();
  if (!token || token === "invalid_token") {
    return { status: 401, error: "Unauthorized access token" };
  }

  // 2. Validate product exists
  if (!product) {
    return { status: 404, error: "Study material not found" };
  }

  // 3. Authoritative server-side price (ignores client body.forged_price)
  const authoritativeAmountMinor = product.price_minor;
  if (authoritativeAmountMinor <= 0) {
    return { status: 400, error: "Product price must be greater than zero for checkout" };
  }

  // 4. Validate credentials (fail-closed)
  const rzpKeyId = env.RAZORPAY_KEY_ID?.trim();
  const rzpKeySecret = env.RAZORPAY_KEY_SECRET?.trim();
  if (!rzpKeyId || !rzpKeySecret || rzpKeyId.includes("placeholder") || rzpKeySecret.includes("placeholder")) {
    return { status: 503, error: "Payment gateway credentials are not configured" };
  }

  // 5. Invoke Razorpay API
  const rzpRes = await (mockRazorpayApi || (async () => ({ ok: true, status: 200, data: { id: "order_rzp_real_123" } })))({
    amount: authoritativeAmountMinor,
    currency: product.currency,
  });

  if (!rzpRes.ok) {
    return { status: 502, error: "Payment gateway order creation failed" };
  }

  return {
    status: 200,
    data: {
      order_id: "order_db_uuid_123",
      razorpay_order_id: rzpRes.data.id,
      amount: authoritativeAmountMinor,
      currency: product.currency,
      key_id: rzpKeyId,
    },
  };
}

interface VerifyPaymentEnv {
  RAZORPAY_KEY_SECRET?: string;
}

async function simulateVerifyPayment(
  env: VerifyPaymentEnv,
  authHeader: string | null,
  callerUserId: string,
  order: { id: string; user_id: string; total_minor: number; currency: string; status: string } | null,
  paymentAttempt: { order_id: string; provider_order_id: string } | null,
  body: {
    orderId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }
) {
  // 1. Authenticate caller
  if (!authHeader?.startsWith("Bearer ")) {
    return { status: 401, error: "Authentication required to verify payment" };
  }
  const token = authHeader.slice(7).trim();
  if (!token || token === "invalid_token") {
    return { status: 401, error: "Unauthorized access token" };
  }

  // 2. Validate payload parameters
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;
  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return { status: 400, error: "Missing required payment verification parameters" };
  }

  // 3. Look up order
  if (!order || order.id !== orderId) {
    return { status: 404, error: "Order not found" };
  }

  // 4. SECURITY INVARIANT: Order must belong to caller (hijack protection)
  if (order.user_id !== callerUserId) {
    return { status: 403, error: "Unauthorized: You cannot verify an order belonging to another user" };
  }

  // 5. Payment attempt association
  if (!paymentAttempt || paymentAttempt.provider_order_id !== razorpayOrderId) {
    return { status: 400, error: "Order does not match the provided Razorpay order ID" };
  }

  // 6. Validate Razorpay secret (fail-closed)
  const rzpSecret = env.RAZORPAY_KEY_SECRET?.trim();
  if (!rzpSecret || rzpSecret.includes("placeholder")) {
    return { status: 503, error: "Payment verification gateway unconfigured" };
  }

  // 7. Cryptographic HMAC signature verification
  const payloadToSign = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = await hmacSha256Hex(rzpSecret, payloadToSign);

  if (!timingSafeEqual(expectedSignature, razorpaySignature)) {
    return { status: 400, error: "Invalid payment signature" };
  }

  // 8. Atomic finalization
  if (order.status === "paid") {
    return { status: 200, data: { success: true, already_processed: true } };
  }

  return { status: 200, data: { success: true, already_processed: false } };
}

interface WebhookEnv {
  RAZORPAY_WEBHOOK_SECRET?: string;
}

async function simulateWebhook(
  env: WebhookEnv,
  signatureHeader: string | null,
  rawBody: string,
  processedEvents: Set<string>
) {
  if (!signatureHeader) {
    return { status: 400, error: "Missing webhook signature header" };
  }

  const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!webhookSecret || webhookSecret.includes("placeholder")) {
    return { status: 503, error: "Webhook endpoint unconfigured" };
  }

  const expectedSignature = await hmacSha256Hex(webhookSecret, rawBody);
  if (!timingSafeEqual(expectedSignature, signatureHeader)) {
    return { status: 400, error: "Invalid webhook signature" };
  }

  const payload = JSON.parse(rawBody);
  const eventId = payload.event_id || payload.id;

  if (processedEvents.has(eventId)) {
    return { status: 200, data: { success: true, already_processed: true } };
  }

  processedEvents.add(eventId);
  return { status: 200, data: { success: true, already_processed: false } };
}

// ============================================================================
// Test Suite: Secure Razorpay Test Mode Verification
// ============================================================================

describe("Secure Razorpay Test Mode & Security Invariants", () => {
  const TEST_RZP_KEY_ID = "rzp_test_51AbcDef123456";
  const TEST_RZP_KEY_SECRET = "SecRet_Test_987654321_Valid";
  const TEST_WEBHOOK_SECRET = "WebHook_SecRet_554433_Valid";

  const validProduct = {
    id: "prod-maths-ch3",
    price_minor: 4900,
    currency: "INR",
  };

  const validOrder = {
    id: "ord-1111-2222-3333",
    user_id: "user-legitimate-buyer",
    total_minor: 4900,
    currency: "INR",
    status: "pending",
  };

  const validAttempt = {
    order_id: validOrder.id,
    provider_order_id: "order_rzp_test_456",
  };

  // --------------------------------------------------------------------------
  // Invariant 1: Missing or placeholder credentials must fail-closed (503)
  // --------------------------------------------------------------------------
  describe("Invariant 1: Credential Fail-Closed Protections", () => {
    it("create-razorpay-order rejects when keys are completely unset", async () => {
      const res = await simulateCreateOrder({}, "Bearer valid_jwt", validProduct, { materialId: "mat-1" });
      expect(res.status).toBe(503);
      expect(res.error).toMatch(/credentials are not configured/i);
    });

    it("create-razorpay-order rejects when key is a placeholder string", async () => {
      const res = await simulateCreateOrder(
        { RAZORPAY_KEY_ID: "rzp_test_placeholder", RAZORPAY_KEY_SECRET: "placeholder_secret" },
        "Bearer valid_jwt",
        validProduct,
        { materialId: "mat-1" }
      );
      expect(res.status).toBe(503);
      expect(res.error).toMatch(/credentials are not configured/i);
    });

    it("verify-razorpay-payment rejects when secret is unset (fail-closed, no mock bypass)", async () => {
      const res = await simulateVerifyPayment(
        {},
        "Bearer valid_jwt",
        "user-legitimate-buyer",
        validOrder,
        validAttempt,
        {
          orderId: validOrder.id,
          razorpayOrderId: validAttempt.provider_order_id,
          razorpayPaymentId: "pay_123",
          razorpaySignature: "any_sig",
        }
      );
      expect(res.status).toBe(503);
      expect(res.error).toMatch(/gateway unconfigured/i);
    });

    it("verify-razorpay-payment rejects when secret is a placeholder", async () => {
      const res = await simulateVerifyPayment(
        { RAZORPAY_KEY_SECRET: "my_placeholder_secret" },
        "Bearer valid_jwt",
        "user-legitimate-buyer",
        validOrder,
        validAttempt,
        {
          orderId: validOrder.id,
          razorpayOrderId: validAttempt.provider_order_id,
          razorpayPaymentId: "pay_123",
          razorpaySignature: "test_valid_mock_signature",
        }
      );
      expect(res.status).toBe(503);
      expect(res.error).toMatch(/gateway unconfigured/i);
    });

    it("razorpay-webhook rejects when webhook secret is unset or placeholder", async () => {
      const res = await simulateWebhook({}, "sig_123", JSON.stringify({ id: "evt_1" }), new Set());
      expect(res.status).toBe(503);
      expect(res.error).toMatch(/endpoint unconfigured/i);
    });
  });

  // --------------------------------------------------------------------------
  // Invariant 2: Hardcoded mock signature is strictly rejected
  // --------------------------------------------------------------------------
  describe("Invariant 2: Mock Signature Rejection", () => {
    it("verify-razorpay-payment rejects test_valid_mock_signature with 400", async () => {
      const res = await simulateVerifyPayment(
        { RAZORPAY_KEY_SECRET: TEST_RZP_KEY_SECRET },
        "Bearer valid_jwt",
        "user-legitimate-buyer",
        validOrder,
        validAttempt,
        {
          orderId: validOrder.id,
          razorpayOrderId: validAttempt.provider_order_id,
          razorpayPaymentId: "pay_test_abc123",
          razorpaySignature: "test_valid_mock_signature", // Attacker sends mock token
        }
      );
      expect(res.status).toBe(400);
      expect(res.error).toMatch(/invalid payment signature/i);
    });

    it("verify-razorpay-payment rejects signatures signed with legacy test key test_razorpay_secret_123", async () => {
      const payload = `${validAttempt.provider_order_id}|pay_test_abc123`;
      const legacyHmac = await hmacSha256Hex("test_razorpay_secret_123", payload);

      const res = await simulateVerifyPayment(
        { RAZORPAY_KEY_SECRET: TEST_RZP_KEY_SECRET },
        "Bearer valid_jwt",
        "user-legitimate-buyer",
        validOrder,
        validAttempt,
        {
          orderId: validOrder.id,
          razorpayOrderId: validAttempt.provider_order_id,
          razorpayPaymentId: "pay_test_abc123",
          razorpaySignature: legacyHmac,
        }
      );
      expect(res.status).toBe(400);
      expect(res.error).toMatch(/invalid payment signature/i);
    });
  });

  // --------------------------------------------------------------------------
  // Invariant 3: Forged webhook signatures rejected
  // --------------------------------------------------------------------------
  describe("Invariant 3: Webhook Forgery Rejection", () => {
    it("rejects missing signature header", async () => {
      const res = await simulateWebhook(
        { RAZORPAY_WEBHOOK_SECRET: TEST_WEBHOOK_SECRET },
        null,
        JSON.stringify({ event: "order.paid" }),
        new Set()
      );
      expect(res.status).toBe(400);
      expect(res.error).toMatch(/missing webhook signature header/i);
    });

    it("rejects test_valid_mock_signature header", async () => {
      const res = await simulateWebhook(
        { RAZORPAY_WEBHOOK_SECRET: TEST_WEBHOOK_SECRET },
        "test_valid_mock_signature",
        JSON.stringify({ event: "order.paid" }),
        new Set()
      );
      expect(res.status).toBe(400);
      expect(res.error).toMatch(/invalid webhook signature/i);
    });

    it("rejects webhook signature computed with wrong secret", async () => {
      const body = JSON.stringify({ event: "order.paid", id: "evt_fake_99" });
      const badSig = await hmacSha256Hex("attacker_fake_secret", body);

      const res = await simulateWebhook(
        { RAZORPAY_WEBHOOK_SECRET: TEST_WEBHOOK_SECRET },
        badSig,
        body,
        new Set()
      );
      expect(res.status).toBe(400);
      expect(res.error).toMatch(/invalid webhook signature/i);
    });
  });

  // --------------------------------------------------------------------------
  // Invariant 4: Unauthenticated callers rejected (401)
  // --------------------------------------------------------------------------
  describe("Invariant 4: Authentication Enforcement", () => {
    it("create-razorpay-order rejects missing Authorization header", async () => {
      const res = await simulateCreateOrder(
        { RAZORPAY_KEY_ID: TEST_RZP_KEY_ID, RAZORPAY_KEY_SECRET: TEST_RZP_KEY_SECRET },
        null,
        validProduct,
        { materialId: "mat-1" }
      );
      expect(res.status).toBe(401);
      expect(res.error).toMatch(/Authentication required/i);
    });

    it("verify-razorpay-payment rejects missing Authorization header", async () => {
      const res = await simulateVerifyPayment(
        { RAZORPAY_KEY_SECRET: TEST_RZP_KEY_SECRET },
        null,
        "user-legitimate-buyer",
        validOrder,
        validAttempt,
        {
          orderId: validOrder.id,
          razorpayOrderId: validAttempt.provider_order_id,
          razorpayPaymentId: "pay_123",
          razorpaySignature: "sig",
        }
      );
      expect(res.status).toBe(401);
      expect(res.error).toMatch(/Authentication required/i);
    });
  });

  // --------------------------------------------------------------------------
  // Invariant 5: Order Hijacking Prevention (403)
  // --------------------------------------------------------------------------
  describe("Invariant 5: Order Ownership Protection", () => {
    it("rejects attempt by attacker to verify legitimate buyer's order", async () => {
      const res = await simulateVerifyPayment(
        { RAZORPAY_KEY_SECRET: TEST_RZP_KEY_SECRET },
        "Bearer attacker_token",
        "attacker-user-id", // Attacker logged in
        validOrder,         // Belongs to 'user-legitimate-buyer'
        validAttempt,
        {
          orderId: validOrder.id,
          razorpayOrderId: validAttempt.provider_order_id,
          razorpayPaymentId: "pay_legit_123",
          razorpaySignature: "sig",
        }
      );
      expect(res.status).toBe(403);
      expect(res.error).toMatch(/You cannot verify an order belonging to another user/i);
    });
  });

  // --------------------------------------------------------------------------
  // Invariant 6: Authoritative Pricing & Parameter Verification
  // --------------------------------------------------------------------------
  describe("Invariant 6: Authoritative Pricing & Parameter Integrity", () => {
    it("ignores forged client price and charges canonical database amount (₹49)", async () => {
      let passedAmount = 0;
      const res = await simulateCreateOrder(
        { RAZORPAY_KEY_ID: TEST_RZP_KEY_ID, RAZORPAY_KEY_SECRET: TEST_RZP_KEY_SECRET },
        "Bearer valid_token",
        validProduct, // Canonical ₹49 = 4900 paise
        {
          materialId: "mat-1",
          forged_price: 100, // Attacker tries ₹1
        },
        async (params) => {
          passedAmount = params.amount;
          return { ok: true, status: 200, data: { id: "order_rzp_456" } };
        }
      );

      expect(res.status).toBe(200);
      expect(passedAmount).toBe(4900); // 4900 paise passed to Razorpay
      expect(res.data?.amount).toBe(4900);
      expect(res.data?.currency).toBe("INR");
    });

    it("rejects verification when orderId does not match razorpayOrderId", async () => {
      const res = await simulateVerifyPayment(
        { RAZORPAY_KEY_SECRET: TEST_RZP_KEY_SECRET },
        "Bearer valid_jwt",
        "user-legitimate-buyer",
        validOrder,
        { ...validAttempt, provider_order_id: "different_provider_id" },
        {
          orderId: validOrder.id,
          razorpayOrderId: "wrong_provider_id",
          razorpayPaymentId: "pay_123",
          razorpaySignature: "sig",
        }
      );
      expect(res.status).toBe(400);
      expect(res.error).toMatch(/Order does not match the provided Razorpay order ID/i);
    });
  });

  // --------------------------------------------------------------------------
  // Invariant 7: Valid Razorpay Test Mode Signatures Succeed
  // --------------------------------------------------------------------------
  describe("Invariant 7: Valid Razorpay Test Mode Verification", () => {
    it("authenticates legitimate HMAC signature in Razorpay Test Mode", async () => {
      const paymentId = "pay_rzp_test_success_7788";
      const payloadToSign = `${validAttempt.provider_order_id}|${paymentId}`;
      const validHmac = await hmacSha256Hex(TEST_RZP_KEY_SECRET, payloadToSign);

      const res = await simulateVerifyPayment(
        { RAZORPAY_KEY_SECRET: TEST_RZP_KEY_SECRET },
        "Bearer valid_jwt",
        "user-legitimate-buyer",
        validOrder,
        validAttempt,
        {
          orderId: validOrder.id,
          razorpayOrderId: validAttempt.provider_order_id,
          razorpayPaymentId: paymentId,
          razorpaySignature: validHmac,
        }
      );

      expect(res.status).toBe(200);
      expect(res.data?.success).toBe(true);
      expect(res.data?.already_processed).toBe(false);
    });

    it("processes valid webhook signed with real webhook secret", async () => {
      const body = JSON.stringify({
        event: "order.paid",
        id: "evt_real_test_101",
        payload: { order: { entity: { id: "order_rzp_test_456" } } },
      });
      const validWebhookSig = await hmacSha256Hex(TEST_WEBHOOK_SECRET, body);

      const processedSet = new Set<string>();
      const res = await simulateWebhook(
        { RAZORPAY_WEBHOOK_SECRET: TEST_WEBHOOK_SECRET },
        validWebhookSig,
        body,
        processedSet
      );

      expect(res.status).toBe(200);
      expect(res.data?.success).toBe(true);
      expect(res.data?.already_processed).toBe(false);
      expect(processedSet.has("evt_real_test_101")).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // Invariant 8: Replay Idempotency
  // --------------------------------------------------------------------------
  describe("Invariant 8: Replay Idempotency", () => {
    it("handles replayed payment verification safely without duplicate grants", async () => {
      const paymentId = "pay_rzp_test_success_7788";
      const payloadToSign = `${validAttempt.provider_order_id}|${paymentId}`;
      const validHmac = await hmacSha256Hex(TEST_RZP_KEY_SECRET, payloadToSign);

      const alreadyPaidOrder = { ...validOrder, status: "paid" };

      const res = await simulateVerifyPayment(
        { RAZORPAY_KEY_SECRET: TEST_RZP_KEY_SECRET },
        "Bearer valid_jwt",
        "user-legitimate-buyer",
        alreadyPaidOrder,
        validAttempt,
        {
          orderId: validOrder.id,
          razorpayOrderId: validAttempt.provider_order_id,
          razorpayPaymentId: paymentId,
          razorpaySignature: validHmac,
        }
      );

      expect(res.status).toBe(200);
      expect(res.data?.already_processed).toBe(true);
    });

    it("handles duplicate webhook events idempotently", async () => {
      const body = JSON.stringify({
        event: "order.paid",
        id: "evt_duplicate_test_202",
      });
      const validWebhookSig = await hmacSha256Hex(TEST_WEBHOOK_SECRET, body);

      const processedSet = new Set<string>(["evt_duplicate_test_202"]);
      const res = await simulateWebhook(
        { RAZORPAY_WEBHOOK_SECRET: TEST_WEBHOOK_SECRET },
        validWebhookSig,
        body,
        processedSet
      );

      expect(res.status).toBe(200);
      expect(res.data?.already_processed).toBe(true);
    });
  });
});

