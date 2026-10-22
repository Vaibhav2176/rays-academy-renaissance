import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import {
  checkMaterialEntitlement,
  StudentEntitlement,
} from "../hooks/useStudentEntitlements";
import { CatalogStudyMaterial } from "../hooks/useStudyMaterials";
import { MaterialPurchase } from "../hooks/useMaterialPurchases";

const SUPABASE_URL = "http://127.0.0.1:54321";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const DOWNLOAD_URL = `${SUPABASE_URL}/functions/v1/material-download`;

describe("Student Portal & Entitlement Integration (Milestone 1B.5)", () => {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const anon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false },
  });

  const testClassId = "99999999-9999-9999-9999-999999999990";
  const freeMatId = "99999999-9999-9999-9999-999999999991";
  const paidMat1Id = "99999999-9999-9999-9999-999999999992";
  const paidMat2Id = "99999999-9999-9999-9999-999999999993";
  const legacyMatId = "99999999-9999-9999-9999-999999999994";

  let studentAId = "";
  let studentAToken = "";
  let studentBId = "";
  let studentBToken = "";

  const dummyPdfBytes = new TextEncoder().encode("%PDF-1.4\nPortal entitlement test pdf\n%%EOF");

  beforeAll(async () => {
    // 1. Setup Class
    await admin.from("classes").upsert({
      id: testClassId,
      name: "Portal Test Class",
      description: "Class for testing portal entitlements & library",
    });

    // 2. Setup Students A and B
    const studentAEmail = `portal_student_a_${Date.now()}@example.com`;
    const studentBEmail = `portal_student_b_${Date.now()}@example.com`;
    const password = "StudentPassword123!";

    const userA = await admin.auth.admin.createUser({
      email: studentAEmail,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: "Portal Student A" },
    });
    studentAId = userA.data.user!.id;

    const userB = await admin.auth.admin.createUser({
      email: studentBEmail,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: "Portal Student B" },
    });
    studentBId = userB.data.user!.id;

    // Login Student A
    const clientA = createClient(SUPABASE_URL, ANON_KEY);
    const authA = await clientA.auth.signInWithPassword({
      email: studentAEmail,
      password: password,
    });
    studentAToken = authA.data.session!.access_token;

    // Login Student B
    const clientB = createClient(SUPABASE_URL, ANON_KEY);
    const authB = await clientB.auth.signInWithPassword({
      email: studentBEmail,
      password: password,
    });
    studentBToken = authB.data.session!.access_token;

    // 3. Ensure bucket and upload dummy PDFs for each material
    await admin.storage.createBucket("study-materials", {
      public: false,
      fileSizeLimit: 52428800,
      allowedMimeTypes: ["application/pdf"],
    });

    const materialIds = [freeMatId, paidMat1Id, paidMat2Id, legacyMatId];
    for (const mId of materialIds) {
      await admin.storage
        .from("study-materials")
        .upload(`materials/portal-${mId}.pdf`, dummyPdfBytes, {
          contentType: "application/pdf",
          upsert: true,
        });
    }

    // 4. Create Materials using proper lifecycle (draft -> version approved -> published)
    const materialsToCreate = [
      {
        id: freeMatId,
        title: "Portal Free Topic - Physics 1",
        course_slug: "portal-neet",
        subject_slug: "physics",
        section_name: "Mechanics",
        resource_type: "chapter",
        chapter_number: 1,
        subject_sequence_number: 1,
        is_free: true,
        price: 0,
        price_minor: 0,
      },
      {
        id: paidMat1Id,
        title: "Portal Paid Topic - Physics 3",
        course_slug: "portal-neet",
        subject_slug: "physics",
        section_name: "Mechanics",
        resource_type: "chapter",
        chapter_number: 3,
        subject_sequence_number: 3,
        is_free: false,
        price: 99,
        price_minor: 9900,
      },
      {
        id: paidMat2Id,
        title: "Portal Paid Topic - Chemistry 3",
        course_slug: "portal-neet",
        subject_slug: "chemistry",
        section_name: "Physical",
        resource_type: "chapter",
        chapter_number: 3,
        subject_sequence_number: 3,
        is_free: false,
        price: 99,
        price_minor: 9900,
      },
      {
        id: legacyMatId,
        title: "Portal Legacy Topic - Physics 4",
        course_slug: "portal-neet",
        subject_slug: "physics",
        section_name: "Mechanics",
        resource_type: "chapter",
        chapter_number: 4,
        subject_sequence_number: 4,
        is_free: false,
        price: 49,
        price_minor: 4900,
      },
    ];

    for (const m of materialsToCreate) {
      // Step A: Upsert material in draft
      const { error: smErr } = await admin.from("study_materials").upsert({
        id: m.id,
        class_id: testClassId,
        title: m.title,
        material_type: "pdf",
        course_slug: m.course_slug,
        subject_slug: m.subject_slug,
        section_name: m.section_name,
        resource_type: m.resource_type,
        chapter_number: m.chapter_number,
        subject_sequence_number: m.subject_sequence_number,
        is_free: m.is_free,
        price: m.price,
        price_minor: m.price_minor,
        status: "draft",
        review_status: "approved",
      });
      if (smErr) {
        console.error("smErr inserting", m.id, smErr);
      }

      // Step B: Upsert approved version with unique storage path
      const { error: svErr } = await admin.from("study_material_versions").upsert(
        {
          material_id: m.id,
          version_number: 1,
          storage_path: `materials/portal-${m.id}.pdf`,
          original_filename: `portal-${m.id}.pdf`,
          mime_type: "application/pdf",
          file_size_bytes: dummyPdfBytes.length,
          checksum_sha256: `portaltestsha256_${m.id}`,
          is_current: true,
          approval_status: "approved",
        },
        { onConflict: "material_id,version_number" }
      );
      if (svErr) {
        console.error("svErr inserting version for", m.id, svErr);
      }

      // Step C: Update status to published
      const { error: pubErr } = await admin
        .from("study_materials")
        .update({ status: "published" })
        .eq("id", m.id);
      if (pubErr) {
        console.error("pubErr publishing", m.id, pubErr);
      }
    }
  });

  afterAll(async () => {
    if (studentAId) await admin.auth.admin.deleteUser(studentAId);
    if (studentBId) await admin.auth.admin.deleteUser(studentBId);
  });

  describe("1. Entitlement Resolution Engine (checkMaterialEntitlement)", () => {
    const sampleCatalogMat: CatalogStudyMaterial = {
      id: paidMat1Id,
      title: "Physics Ch 3",
      description: "Sample",
      resource_type: "chapter",
      price_minor: 9900,
      is_free: false,
      is_published: true,
      course_slug: "portal-neet",
      course_title: "NEET Comprehensive",
      subject_slug: "physics",
      subject_name: "Physics",
      section_name: "Mechanics",
      chapter_number: 3,
      subject_sequence_number: 3,
      pyq_year: null,
      exam_sub_type: null,
      current_version_number: 1,
      current_version_file_size: 1024,
      current_version_approved_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    it("identifies free material as entitled with reason 'free'", () => {
      const freeMat: CatalogStudyMaterial = {
        ...sampleCatalogMat,
        id: freeMatId,
        is_free: true,
      };
      const result = checkMaterialEntitlement(freeMat, [], []);
      expect(result.isEntitled).toBe(true);
      expect(result.reason).toBe("free");
      expect(result.description).toBe("Free Chapter Note");
    });

    it("grants access when user has a single_material active entitlement", () => {
      const singleEntitlement: StudentEntitlement = {
        id: "ent-1",
        user_id: studentAId,
        entitlement_scope: "single_material",
        material_id: paidMat1Id,
        course_slug: null,
        subject_slug: null,
        order_item_id: null,
        status: "active",
        source: "payment",
        granted_at: new Date().toISOString(),
      };
      const result = checkMaterialEntitlement(sampleCatalogMat, [singleEntitlement], []);
      expect(result.isEntitled).toBe(true);
      expect(result.reason).toBe("single");
      expect(result.description).toBe("Single Note Access");
    });

    it("grants access when user has a subject_bundle entitlement for that subject", () => {
      const subjectEntitlement: StudentEntitlement = {
        id: "ent-2",
        user_id: studentAId,
        entitlement_scope: "subject_bundle",
        material_id: null,
        course_slug: "portal-neet",
        subject_slug: "physics",
        order_item_id: null,
        status: "active",
        source: "payment",
        granted_at: new Date().toISOString(),
      };
      const result = checkMaterialEntitlement(sampleCatalogMat, [subjectEntitlement], []);
      expect(result.isEntitled).toBe(true);
      expect(result.reason).toBe("subject_bundle");
      expect(result.description).toBe("Subject Pass (PHYSICS)");
    });

    it("does NOT grant access when user has a subject_bundle for a different subject", () => {
      const chemistryEntitlement: StudentEntitlement = {
        id: "ent-3",
        user_id: studentAId,
        entitlement_scope: "subject_bundle",
        material_id: null,
        course_slug: "portal-neet",
        subject_slug: "chemistry",
        order_item_id: null,
        status: "active",
        source: "payment",
        granted_at: new Date().toISOString(),
      };
      const result = checkMaterialEntitlement(sampleCatalogMat, [chemistryEntitlement], []);
      expect(result.isEntitled).toBe(false);
      expect(result.reason).toBeUndefined();
    });

    it("grants access when user has a course_bundle entitlement for that course", () => {
      const courseEntitlement: StudentEntitlement = {
        id: "ent-4",
        user_id: studentAId,
        entitlement_scope: "course_bundle",
        material_id: null,
        course_slug: "portal-neet",
        subject_slug: null,
        order_item_id: null,
        status: "active",
        source: "payment",
        granted_at: new Date().toISOString(),
      };
      const result = checkMaterialEntitlement(sampleCatalogMat, [courseEntitlement], []);
      expect(result.isEntitled).toBe(true);
      expect(result.reason).toBe("course_bundle");
      expect(result.description).toBe("Full Course Pass (PORTAL-NEET)");
    });

    it("grants access when user has a legacy purchase record in user_material_purchases", () => {
      const legacyPurchase: MaterialPurchase = {
        id: "leg-1",
        user_id: studentAId,
        material_id: paidMat1Id,
        amount_paid: 49,
        purchased_at: new Date().toISOString(),
      };
      const result = checkMaterialEntitlement(sampleCatalogMat, [], [legacyPurchase]);
      expect(result.isEntitled).toBe(true);
      expect(result.reason).toBe("legacy");
      expect(result.description).toBe("Legacy / Coupon Access");
    });

    it("denies access when entitlement is not active", () => {
      const revokedEntitlement: StudentEntitlement = {
        id: "ent-5",
        user_id: studentAId,
        entitlement_scope: "single_material",
        material_id: paidMat1Id,
        course_slug: null,
        subject_slug: null,
        order_item_id: null,
        status: "revoked",
        source: "payment",
        granted_at: new Date().toISOString(),
      };
      const result = checkMaterialEntitlement(sampleCatalogMat, [revokedEntitlement], []);
      expect(result.isEntitled).toBe(false);
      expect(result.reason).toBeUndefined();
    });
  });

  describe("2. Database Trigger & Legacy Sync (user_material_purchases -> material_entitlements)", () => {
    it("automatically syncs legacy purchase insert into material_entitlements", async () => {
      // Insert legacy purchase for Student A on legacyMatId
      const { data: inserted, error: insertErr } = await admin
        .from("user_material_purchases")
        .insert({
          user_id: studentAId,
          material_id: legacyMatId,
          amount_paid: 0,
        })
        .select()
        .single();

      expect(insertErr).toBeNull();
      expect(inserted).toBeDefined();

      // Check if material_entitlements was populated via database trigger
      const { data: entRow, error: entErr } = await admin
        .from("material_entitlements")
        .select("*")
        .eq("user_id", studentAId)
        .eq("material_id", legacyMatId)
        .maybeSingle();

      expect(entErr).toBeNull();
      expect(entRow).toBeDefined();
      expect(entRow?.source).toBe("legacy_migration");
      expect(entRow?.entitlement_scope).toBe("single_material");
      expect(entRow?.status).toBe("active");

      // Verify PostgreSQL function public.has_material_access returns true
      const { data: hasAccess, error: accessErr } = await admin.rpc(
        "has_material_access",
        {
          _user_id: studentAId,
          _material_id: legacyMatId,
        }
      );
      expect(accessErr).toBeNull();
      expect(hasAccess).toBe(true);
    });
  });

  describe("3. Download Authorization via material-download Edge Function", () => {
    it("allows Student A to download legacy unlocked material", async () => {
      const res = await fetch(DOWNLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${studentAToken}`,
        },
        body: JSON.stringify({ materialId: legacyMatId }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.download_url || body.url).toBeDefined();
      expect(body.download_url || body.url).toContain("study-materials");
      expect(body.download_url || body.url).toContain("token=");
    });

    it("rejects Student B attempting to download legacy material without entitlement", async () => {
      const res = await fetch(DOWNLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${studentBToken}`,
        },
        body: JSON.stringify({ materialId: legacyMatId }),
      });

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error).toContain("do not have access");
    });

    it("allows any student (even unauthenticated) to download published free material", async () => {
      const res = await fetch(DOWNLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ materialId: freeMatId }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.download_url || body.url).toBeDefined();
    });

    it("allows Student B to download after acquiring a subject bundle entitlement", async () => {
      // Grant subject bundle for Physics to Student B
      await admin.from("material_entitlements").insert({
        user_id: studentBId,
        entitlement_scope: "subject_bundle",
        course_slug: "portal-neet",
        subject_slug: "physics",
        status: "active",
        source: "admin_grant",
      });

      // Now Student B can download Physics Paid Topic (paidMat1Id)
      const res = await fetch(DOWNLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${studentBToken}`,
        },
        body: JSON.stringify({ materialId: paidMat1Id }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.download_url || body.url).toBeDefined();

      // But Student B CANNOT download Chemistry Paid Topic (paidMat2Id)
      const chemRes = await fetch(DOWNLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${studentBToken}`,
        },
        body: JSON.stringify({ materialId: paidMat2Id }),
      });

      expect(chemRes.status).toBe(403);
    });
  });

  describe("4. Orders & Purchase History Cross-Student RLS Isolation", () => {
    let orderAId = "";
    let orderBId = "";

    beforeAll(async () => {
      // Create Order for Student A
      const { data: oA } = await admin
        .from("orders")
        .insert({
          user_id: studentAId,
          subtotal_minor: 9900,
          total_minor: 9900,
          currency: "INR",
          status: "paid",
        })
        .select()
        .single();
      orderAId = oA!.id;

      // Create Order for Student B
      const { data: oB } = await admin
        .from("orders")
        .insert({
          user_id: studentBId,
          subtotal_minor: 49900,
          total_minor: 49900,
          currency: "INR",
          status: "paid",
        })
        .select()
        .single();
      orderBId = oB!.id;
    });

    it("Student A client can read their own order but NOT Student B's order", async () => {
      const clientA = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${studentAToken}` } },
      });

      const { data: orders, error } = await clientA
        .from("orders")
        .select("id, user_id, status, total_minor");

      expect(error).toBeNull();
      expect(orders).toBeDefined();
      expect(orders?.some((o) => o.id === orderAId)).toBe(true);
      expect(orders?.some((o) => o.id === orderBId)).toBe(false);
      orders?.forEach((o) => {
        expect(o.user_id).toBe(studentAId);
      });
    });

    it("Student B client can read their own order but NOT Student A's order", async () => {
      const clientB = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${studentBToken}` } },
      });

      const { data: orders, error } = await clientB
        .from("orders")
        .select("id, user_id, status, total_minor");

      expect(error).toBeNull();
      expect(orders).toBeDefined();
      expect(orders?.some((o) => o.id === orderBId)).toBe(true);
      expect(orders?.some((o) => o.id === orderAId)).toBe(false);
      orders?.forEach((o) => {
        expect(o.user_id).toBe(studentBId);
      });
    });

    it("Anonymous client cannot read any orders from the database", async () => {
      const { data: orders, error } = await anon.from("orders").select("id");
      expect(error).toBeNull();
      expect(orders).toEqual([]);
    });
  });
});
