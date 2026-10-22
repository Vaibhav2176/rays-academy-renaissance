import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "http://127.0.0.1:54321";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const CREATE_ORDER_URL = `${SUPABASE_URL}/functions/v1/create-razorpay-order`;
const VERIFY_PAYMENT_URL = `${SUPABASE_URL}/functions/v1/verify-razorpay-payment`;
const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/razorpay-webhook`;
const DOWNLOAD_URL = `${SUPABASE_URL}/functions/v1/material-download`;

// Helper to compute HMAC-SHA256 hex in Node/Vitest
async function computeHmacSha256(secret: string, message: string): Promise<string> {
  const crypto = await import("crypto");
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

describe("Razorpay Integration & Durable Entitlements (Milestone 1B.4)", () => {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const testClassId = "66666666-6666-6666-6666-666666666661";
  const paidMaterialId = "77777777-7777-7777-7777-777777777771";
  const bundleMaterialId = "77777777-7777-7777-7777-777777777772";

  let buyerId = "";
  let buyerToken = "";
  let otherStudentId = "";
  let otherStudentToken = "";

  beforeAll(async () => {
    // 1. Setup Class
    await admin.from("classes").upsert({
      id: testClassId,
      name: "Razorpay Test Class",
      description: "Class for testing payment & checkout",
    });

    // 2. Setup Buyer Student
    const buyerEmail = `buyer_${Date.now()}@example.com`;
    const buyerPass = "BuyerPassword123!";
    const buyerUser = await admin.auth.admin.createUser({
      email: buyerEmail,
      password: buyerPass,
      email_confirm: true,
      user_metadata: { full_name: "Test Buyer" },
    });
    buyerId = buyerUser.data.user!.id;

    const buyerClient = createClient(SUPABASE_URL, ANON_KEY);
    const buyerAuth = await buyerClient.auth.signInWithPassword({
      email: buyerEmail,
      password: buyerPass,
    });
    buyerToken = buyerAuth.data.session!.access_token;

    // 3. Setup Other Student
    const otherEmail = `other_${Date.now()}@example.com`;
    const otherPass = "OtherPassword123!";
    const otherUser = await admin.auth.admin.createUser({
      email: otherEmail,
      password: otherPass,
      email_confirm: true,
      user_metadata: { full_name: "Other Student" },
    });
    otherStudentId = otherUser.data.user!.id;

    const otherClient = createClient(SUPABASE_URL, ANON_KEY);
    const otherAuth = await otherClient.auth.signInWithPassword({
      email: otherEmail,
      password: otherPass,
    });
    otherStudentToken = otherAuth.data.session!.access_token;

    // 4. Upload dummy PDF files to storage
    const dummyPdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
    await admin.storage.from("study-materials").upload("test/razorpay_paid.pdf", dummyPdfContent, {
      contentType: "application/pdf",
      upsert: true,
    });
    await admin.storage.from("study-materials").upload("test/razorpay_bundle.pdf", dummyPdfContent, {
      contentType: "application/pdf",
      upsert: true,
    });

    // 5. Seed Paid Material (Sequence 3 -> paid ₹49)
    await admin.from("study_materials").insert({
      id: paidMaterialId,
      class_id: testClassId,
      title: "Paid Mechanics Chapter Note",
      course_slug: "jee",
      subject_slug: "physics",
      section_name: "Mechanics",
      resource_type: "chapter",
      chapter_number: 3,
      subject_sequence_number: 3,
      is_free: false,
      price_minor: 4900,
      price: 49,
      status: "draft",
      review_status: "draft",
    });

    await admin.from("study_material_versions").insert({
      material_id: paidMaterialId,
      version_number: 1,
      storage_path: "test/razorpay_paid.pdf",
      original_filename: "razorpay_paid.pdf",
      mime_type: "application/pdf",
      file_size_bytes: 8,
      checksum_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      is_current: true,
      approval_status: "approved",
    });

    await admin
      .from("study_materials")
      .update({ review_status: "approved", status: "published" })
      .eq("id", paidMaterialId);

    // 6. Seed Bundle Material (Sequence 4 -> paid ₹49)
    await admin.from("study_materials").insert({
      id: bundleMaterialId,
      class_id: testClassId,
      title: "Paid Electromagnetism Chapter Note",
      course_slug: "jee",
      subject_slug: "physics",
      section_name: "Electromagnetism",
      resource_type: "chapter",
      chapter_number: 4,
      subject_sequence_number: 4,
      is_free: false,
      price_minor: 4900,
      price: 49,
      status: "draft",
      review_status: "draft",
    });

    await admin.from("study_material_versions").insert({
      material_id: bundleMaterialId,
      version_number: 1,
      storage_path: "test/razorpay_bundle.pdf",
      original_filename: "razorpay_bundle.pdf",
      mime_type: "application/pdf",
      file_size_bytes: 8,
      checksum_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b856",
      is_current: true,
      approval_status: "approved",
    });

    await admin
      .from("study_materials")
      .update({ review_status: "approved", status: "published" })
      .eq("id", bundleMaterialId);
  });

  afterAll(async () => {
    // Teardown
    if (buyerId) await admin.auth.admin.deleteUser(buyerId);
    if (otherStudentId) await admin.auth.admin.deleteUser(otherStudentId);
    await admin.from("study_materials").delete().in("id", [paidMaterialId, bundleMaterialId]);
    await admin.from("classes").delete().eq("id", testClassId);
    await admin.storage.from("study-materials").remove(["test/razorpay_paid.pdf", "test/razorpay_bundle.pdf"]);
  });

  // --- 1. Order Creation Tests ---
  describe("create-razorpay-order", () => {
    it("rejects unauthenticated requests with 401", async () => {
      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ materialId: paidMaterialId }),
      });

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toMatch(/Authentication required/i);
    });

    it("rejects invalid/non-existent material with 404", async () => {
      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ materialId: "00000000-0000-0000-0000-000000000000" }),
      });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toMatch(/not found/i);
    });

    it("creates a single material order with canonical price ₹49 (4900 paise)", async () => {
      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        // Attacker attempts to forge price of ₹1
        body: JSON.stringify({
          materialId: paidMaterialId,
          purchaseType: "single_material",
          price_minor: 100,
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.order_id).toBeDefined();
      expect(data.razorpay_order_id).toBeDefined();
      // Server MUST ignore attacker's price and charge canonical 4900 paise
      expect(data.amount).toBe(4900);
      expect(data.currency).toBe("INR");

      // Verify order record in DB
      const { data: dbOrder } = await admin
        .from("orders")
        .select("*")
        .eq("id", data.order_id)
        .single();

      expect(dbOrder).toBeDefined();
      expect(dbOrder.user_id).toBe(buyerId);
      expect(dbOrder.status).toBe("pending");
      expect(dbOrder.total_minor).toBe(4900);
    });

    it("creates a subject bundle order with authoritative price ₹499 (49900 paise)", async () => {
      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          purchaseType: "subject_bundle",
          courseSlug: "jee",
          subjectSlug: "physics",
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.order_id).toBeDefined();
      expect(data.amount).toBe(49900); // Canonical ₹499
      expect(data.currency).toBe("INR");
    });

    it("creates a course bundle order with authoritative price ₹999 (99900 paise)", async () => {
      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          purchaseType: "course_bundle",
          courseSlug: "jee",
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.order_id).toBeDefined();
      expect(data.amount).toBe(99900); // Canonical ₹999
      expect(data.currency).toBe("INR");
    });
  });

  // --- 2. Payment Verification & Entitlement Durability ---
  describe("verify-razorpay-payment", () => {
    it("rejects unauthenticated verification requests with 401", async () => {
      const res = await fetch(VERIFY_PAYMENT_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: "00000000-0000-0000-0000-000000000000",
          razorpayOrderId: "order_test_123",
          razorpayPaymentId: "pay_test_123",
          razorpaySignature: "dummy_unauth_signature",
        }),
      });

      expect(res.status).toBe(401);
    });

    it("rejects verification by another user (order hijacking prevention) with 403", async () => {
      // Create order for buyer
      const createRes = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId: paidMaterialId,
          purchaseType: "single_material",
        }),
      });
      const order = await createRes.json();

      // Other student attempts to verify buyer's order
      const hijackSignature = await computeHmacSha256(
        "test_razorpay_secret_123",
        `${order.razorpay_order_id}|pay_hijack_123`
      );

      const res = await fetch(VERIFY_PAYMENT_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${otherStudentToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.order_id,
          razorpayOrderId: order.razorpay_order_id,
          razorpayPaymentId: "pay_hijack_123",
          razorpaySignature: hijackSignature,
        }),
      });

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toMatch(/unauthorized/i);
    });

    it("rejects invalid or forged payment signatures with 400", async () => {
      // Create separate order to test invalid signature
      const createRes = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId: paidMaterialId,
          purchaseType: "single_material",
        }),
      });
      const orderForForgedTest = await createRes.json();

      const res = await fetch(VERIFY_PAYMENT_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderForForgedTest.order_id,
          razorpayOrderId: orderForForgedTest.razorpay_order_id,
          razorpayPaymentId: "pay_fake_999",
          razorpaySignature: "forged_malicious_signature_hash",
        }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/invalid payment signature/i);
    });

    let verifiedOrder: any;
    let verifiedPaymentId: string;

    it("successfully verifies valid payment and grants durable entitlement", async () => {
      verifiedPaymentId = `pay_legit_${Date.now()}`;

      // Create fresh pending order specifically to verify
      const createRes = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId: paidMaterialId,
          purchaseType: "single_material",
        }),
      });
      expect(createRes.status).toBe(200);
      verifiedOrder = await createRes.json();

      const validSignature = await computeHmacSha256(
        "test_razorpay_secret_123",
        `${verifiedOrder.razorpay_order_id}|${verifiedPaymentId}`
      );

      const res = await fetch(VERIFY_PAYMENT_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: verifiedOrder.order_id,
          razorpayOrderId: verifiedOrder.razorpay_order_id,
          razorpayPaymentId: verifiedPaymentId,
          razorpaySignature: validSignature,
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      // Verify order status is 'paid'
      const { data: dbOrder } = await admin
        .from("orders")
        .select("status")
        .eq("id", verifiedOrder.order_id)
        .single();
      expect(dbOrder?.status).toBe("paid");

      // Verify entitlement exists in database
      const { data: entitlements } = await admin
        .from("material_entitlements")
        .select("*")
        .eq("user_id", buyerId)
        .eq("material_id", paidMaterialId)
        .eq("status", "active");

      expect(entitlements).toHaveLength(1);
      expect(entitlements![0].source).toBe("payment");
      expect(entitlements![0].entitlement_scope).toBe("single_material");
    });

    it("verifies payment idempotency: repeat verification succeeds without creating duplicate entitlements", async () => {
      const repeatSignature = await computeHmacSha256(
        "test_razorpay_secret_123",
        `${verifiedOrder.razorpay_order_id}|${verifiedPaymentId}`
      );

      const res = await fetch(VERIFY_PAYMENT_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: verifiedOrder.order_id,
          razorpayOrderId: verifiedOrder.razorpay_order_id,
          razorpayPaymentId: verifiedPaymentId,
          razorpaySignature: repeatSignature,
        }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      // Exactly 1 entitlement must remain
      const { data: entitlements } = await admin
        .from("material_entitlements")
        .select("id")
        .eq("user_id", buyerId)
        .eq("material_id", paidMaterialId);

      expect(entitlements).toHaveLength(1);
    });

    it("prevents duplicate purchase: create-razorpay-order returns 409 when user already has active entitlement", async () => {
      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId: paidMaterialId,
          purchaseType: "single_material",
        }),
      });

      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data.already_entitled).toBe(true);
      expect(data.error).toMatch(/already own active access/i);
    });

    it("allows the entitled buyer to download the material securely via material-download", async () => {
      const res = await fetch(DOWNLOAD_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ materialId: paidMaterialId }),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.download_url).toBeDefined();
      expect(data.download_url).toContain("/storage/v1/object/sign/study-materials/");
    });

    it("prevents unentitled student from downloading the paid material", async () => {
      const res = await fetch(DOWNLOAD_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${otherStudentToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ materialId: paidMaterialId }),
      });

      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toMatch(/You do not have access to this study material/i);
    });
  });

  // --- 3. Webhook Idempotency & Reconciliation ---
  describe("razorpay-webhook", () => {
    let webhookOrderId: string;
    let webhookProviderOrderId: string;

    beforeAll(async () => {
      // Create pending order for other student on bundleMaterialId
      const res = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${otherStudentToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialId: bundleMaterialId,
          purchaseType: "single_material",
        }),
      });
      const data = await res.json();
      webhookOrderId = data.order_id;
      webhookProviderOrderId = data.razorpay_order_id;
    });

    it("rejects webhook without signature header with 400", async () => {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event: "order.paid" }),
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/missing webhook signature/i);
    });

    it("rejects webhook with invalid signature with 400", async () => {
      const payload = JSON.stringify({ event: "order.paid" });
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          "X-Razorpay-Signature": "invalid_forged_webhook_signature",
          "Content-Type": "application/json",
        },
        body: payload,
      });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/invalid webhook signature/i);
    });

    it("processes valid order.paid webhook and finalizes payment & entitlement", async () => {
      const eventId = `evt_test_${Date.now()}`;
      const payload = JSON.stringify({
        event: "order.paid",
        event_id: eventId,
        payload: {
          order: {
            entity: {
              id: webhookProviderOrderId,
              amount: 4900,
              currency: "INR",
            },
          },
          payment: {
            entity: {
              id: `pay_webhook_${Date.now()}`,
              order_id: webhookProviderOrderId,
              amount: 4900,
              currency: "INR",
              status: "captured",
            },
          },
        },
      });

      const signature = await computeHmacSha256("test_webhook_secret_123", payload);

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          "X-Razorpay-Signature": signature,
          "Content-Type": "application/json",
        },
        body: payload,
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);

      // Verify order is now paid
      const { data: dbOrder } = await admin
        .from("orders")
        .select("status")
        .eq("id", webhookOrderId)
        .single();
      expect(dbOrder?.status).toBe("paid");

      // Verify entitlement granted to otherStudent
      const { data: entitlements } = await admin
        .from("material_entitlements")
        .select("*")
        .eq("user_id", otherStudentId)
        .eq("material_id", bundleMaterialId)
        .eq("status", "active");

      expect(entitlements).toHaveLength(1);
    });

    it("handles duplicate webhook idempotently: duplicate delivery creates no duplicate entitlements", async () => {
      const eventId = `evt_dedup_${Date.now()}`;
      const payload = JSON.stringify({
        event: "order.paid",
        event_id: eventId,
        payload: {
          order: {
            entity: {
              id: webhookProviderOrderId,
              amount: 4900,
              currency: "INR",
            },
          },
          payment: {
            entity: {
              id: `pay_dedup_${Date.now()}`,
              order_id: webhookProviderOrderId,
              amount: 4900,
              currency: "INR",
              status: "captured",
            },
          },
        },
      });

      const signature = await computeHmacSha256("test_webhook_secret_123", payload);

      // First webhook post
      const res1 = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          "X-Razorpay-Signature": signature,
          "Content-Type": "application/json",
        },
        body: payload,
      });
      expect(res1.status).toBe(200);

      // Duplicate webhook delivery with exact same event ID
      const res2 = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          "X-Razorpay-Signature": signature,
          "Content-Type": "application/json",
        },
        body: payload,
      });

      expect(res2.status).toBe(200);
      const data2 = await res2.json();
      expect(data2.message).toMatch(/already processed \(idempotent\)/i);

      // Entitlements count still exactly 1
      const { data: entitlements } = await admin
        .from("material_entitlements")
        .select("id")
        .eq("user_id", otherStudentId)
        .eq("material_id", bundleMaterialId);

      expect(entitlements).toHaveLength(1);
    });

    it("delayed payment.failed event arriving for paid order does not downgrade order status", async () => {
      const eventId = `evt_delayed_fail_${Date.now()}`;
      const payload = JSON.stringify({
        event: "payment.failed",
        event_id: eventId,
        payload: {
          payment: {
            entity: {
              id: `pay_delayed_fail_${Date.now()}`,
              order_id: webhookProviderOrderId,
              amount: 4900,
              currency: "INR",
              status: "failed",
            },
          },
        },
      });

      const signature = await computeHmacSha256("test_webhook_secret_123", payload);

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          apikey: ANON_KEY,
          "X-Razorpay-Signature": signature,
          "Content-Type": "application/json",
        },
        body: payload,
      });

      expect(res.status).toBe(200);

      // Critical invariant: Order status MUST STILL be 'paid'
      const { data: dbOrder } = await admin
        .from("orders")
        .select("status")
        .eq("id", webhookOrderId)
        .single();

      expect(dbOrder?.status).toBe("paid");
    });
  });
});
