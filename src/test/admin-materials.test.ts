import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "http://127.0.0.1:54321";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/admin-materials`;

describe("Edge Function: admin-materials (Milestone 1B.2)", () => {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const testClassId = "66666666-6666-6666-6666-666666666661";
  let adminUserId = "";
  let adminToken = "";
  let studentUserId = "";
  let studentToken = "";

  const createdMaterialIds: string[] = [];

  beforeAll(async () => {
    // 1. Setup Test Class
    await admin.from("classes").upsert({
      id: testClassId,
      name: "Admin Materials Test Class",
      description: "Class for testing admin workflows",
    });

    // 2. Setup Admin User
    const adminEmail = `admin_${Date.now()}@example.com`;
    const password = "AdminPassword123!";
    const adminUser = await admin.auth.admin.createUser({
      email: adminEmail,
      password,
      email_confirm: true,
    });
    adminUserId = adminUser.data.user!.id;

    // Assign 'admin' role in public.user_roles
    await admin.from("user_roles").insert({
      user_id: adminUserId,
      role: "admin",
    });

    // Sign in to obtain admin JWT token
    const clientAdmin = createClient(SUPABASE_URL, ANON_KEY);
    const adminAuth = await clientAdmin.auth.signInWithPassword({
      email: adminEmail,
      password,
    });
    adminToken = adminAuth.data.session!.access_token;

    // 3. Setup Ordinary Student User (no admin role)
    const studentEmail = `student_${Date.now()}@example.com`;
    const studentUser = await admin.auth.admin.createUser({
      email: studentEmail,
      password,
      email_confirm: true,
    });
    studentUserId = studentUser.data.user!.id;

    // Assign 'student' role
    await admin.from("user_roles").insert({
      user_id: studentUserId,
      role: "student",
    });

    // Sign in to obtain student JWT token
    const clientStudent = createClient(SUPABASE_URL, ANON_KEY);
    const studentAuth = await clientStudent.auth.signInWithPassword({
      email: studentEmail,
      password,
    });
    studentToken = studentAuth.data.session!.access_token;
  });

  afterAll(async () => {
    // Cleanup test users and materials
    if (adminUserId) await admin.auth.admin.deleteUser(adminUserId);
    if (studentUserId) await admin.auth.admin.deleteUser(studentUserId);
    if (createdMaterialIds.length > 0) {
      await admin.from("study_materials").delete().in("id", createdMaterialIds);
    }
    await admin.from("classes").delete().eq("id", testClassId);
  });

  const callAdminJson = async (
    payload: Record<string, unknown>,
    token?: string
  ): Promise<{ status: number; body: Record<string, unknown> }> => {
    const headers: Record<string, string> = {
      apikey: ANON_KEY,
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const body = (await res.json()) as Record<string, unknown>;
    return { status: res.status, body };
  };

  const callAdminMultipart = async (
    formData: FormData,
    token?: string
  ): Promise<{ status: number; body: Record<string, unknown> }> => {
    const headers: Record<string, string> = {
      apikey: ANON_KEY,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers,
      body: formData,
    });

    const body = (await res.json()) as Record<string, unknown>;
    return { status: res.status, body };
  };

  // --- 1. Authorization Tests ---
  it("rejects unauthenticated requests with HTTP 401", async () => {
    const res = await callAdminJson({ action: "list" });
    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Authentication required");
  });

  it("rejects ordinary student requests with HTTP 403", async () => {
    const res = await callAdminJson({ action: "list" }, studentToken);
    expect(res.status).toBe(403);
    expect(res.body.error).toContain("Forbidden");
  });

  it("allows authorized admin to list materials", async () => {
    const res = await callAdminJson({ action: "list" }, adminToken);
    expect(res.status).toBe(200);
    expect(res.body.materials).toBeDefined();
    expect(Array.isArray(res.body.materials)).toBe(true);
  });

  // --- 2. Metadata Creation & Sequential Pricing ---
  it("rejects metadata creation missing required fields", async () => {
    const res = await callAdminJson(
      {
        action: "save_metadata",
        metadata: { title: "Incomplete" }, // missing course_slug, subject_slug
      },
      adminToken
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("required");
  });

  it("rejects chapter materials missing subject_sequence_number", async () => {
    const res = await callAdminJson(
      {
        action: "save_metadata",
        metadata: {
          title: "Unsequenced Chapter",
          course_slug: "nda",
          subject_slug: "maths",
          resource_type: "chapter",
          subject_sequence_number: null,
        },
      },
      adminToken
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("subject_sequence_number");
  });

  it("creates draft chapter metadata with pricing governed by database rules", async () => {
    // Sequence 1 should be automatically free (price_minor = 0)
    const res1 = await callAdminJson(
      {
        action: "save_metadata",
        metadata: {
          title: "Admin Test Sequence 1",
          class_id: testClassId,
          course_slug: "admintest",
          subject_slug: "physics",
          section_name: "Mechanics",
          resource_type: "chapter",
          subject_sequence_number: 1,
        },
      },
      adminToken
    );

    expect(res1.status).toBe(200);
    const mat1 = (res1.body.material as any);
    expect(mat1.id).toBeDefined();
    expect(mat1.is_free).toBe(true);
    expect(mat1.price_minor).toBe(0);
    expect(mat1.status).toBe("draft");
    expect(mat1.review_status).toBe("draft");
    createdMaterialIds.push(mat1.id);

    // Sequence 3 should be automatically paid (price_minor = 4900)
    const res3 = await callAdminJson(
      {
        action: "save_metadata",
        metadata: {
          title: "Admin Test Sequence 3",
          class_id: testClassId,
          course_slug: "admintest",
          subject_slug: "physics",
          section_name: "Mechanics",
          resource_type: "chapter",
          subject_sequence_number: 3,
        },
      },
      adminToken
    );

    expect(res3.status).toBe(200);
    const mat3 = (res3.body.material as any);
    expect(mat3.id).toBeDefined();
    expect(mat3.is_free).toBe(false);
    expect(mat3.price_minor).toBe(4900);
    expect(mat3.status).toBe("draft");
    createdMaterialIds.push(mat3.id);
  });

  const uploadPdf = async (
    materialId: string,
    filename: string,
    bytes: Uint8Array,
    mimeType = "application/pdf",
    token?: string
  ) => {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const fileBase64 = btoa(binary);

    return await callAdminJson(
      {
        action: "upload_pdf",
        materialId,
        filename,
        fileBase64,
        mimeType,
      },
      token
    );
  };

  // --- 3. Upload Validation & SHA-256 Computation ---
  it("rejects non-PDF uploads with HTTP 400", async () => {
    const testMatId = createdMaterialIds[0];
    const textBytes = new TextEncoder().encode("Plain text file content");
    const res = await uploadPdf(testMatId, "notes.txt", textBytes, "text/plain", adminToken);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("application/pdf");
  });

  it("rejects fake PDF missing %PDF- header with HTTP 400", async () => {
    const testMatId = createdMaterialIds[0];
    const fakePdfBytes = new Uint8Array([0x4e, 0x4f, 0x54, 0x5f, 0x50, 0x44, 0x46]);
    const res = await uploadPdf(testMatId, "fake.pdf", fakePdfBytes, "application/pdf", adminToken);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("standard PDF header");
  });

  it("uploads valid PDF, computes secure SHA-256 checksum, and creates draft version", async () => {
    const testMatId = createdMaterialIds[0];
    const validPdfBytes = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, // %PDF-1.4
      0x0a, 0x25, 0xd0, 0xd4, 0xc5, 0xd8, 0x0a,
    ]);

    const res = await uploadPdf(testMatId, "valid_test.pdf", validPdfBytes, "application/pdf", adminToken);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.checksum_sha256).toBeDefined();
    expect(typeof res.body.checksum_sha256).toBe("string");
    expect((res.body.checksum_sha256 as string).length).toBe(64); // SHA-256 hex length

    const version = (res.body.version as any);
    expect(version.version_number).toBe(1);
    expect(version.approval_status).toBe("draft");
    expect(version.is_current).toBe(false);

    // Verify material transitioned to in_review
    const { data: mat } = await admin
      .from("study_materials")
      .select("review_status")
      .eq("id", testMatId)
      .single();
    expect(mat?.review_status).toBe("in_review");
  });

  // --- 4. Teacher Review & Publication Gate ---
  it("rejects publication when material is unapproved", async () => {
    const testMatId = createdMaterialIds[0];
    // Currently review_status is pending_review and version is draft (unapproved)
    const res = await callAdminJson(
      {
        action: "publish",
        materialId: testMatId,
      },
      adminToken
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Faculty review status must be approved");
  });

  it("allows teacher approval of version and promotes it to current approved", async () => {
    const testMatId = createdMaterialIds[0];
    const { data: versions } = await admin
      .from("study_material_versions")
      .select("id")
      .eq("material_id", testMatId);

    const versionId = versions![0].id;
    const res = await callAdminJson(
      {
        action: "approve_version",
        materialId: testMatId,
        versionId,
      },
      adminToken
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify in database
    const { data: updatedVer } = await admin
      .from("study_material_versions")
      .select("approval_status, is_current, approved_by")
      .eq("id", versionId)
      .single();

    expect(updatedVer?.approval_status).toBe("approved");
    expect(updatedVer?.is_current).toBe(true);
    expect(updatedVer?.approved_by).toBe(adminUserId);

    const { data: mat } = await admin
      .from("study_materials")
      .select("review_status, reviewed_by")
      .eq("id", testMatId)
      .single();

    expect(mat?.review_status).toBe("approved");
    expect(mat?.reviewed_by).toBe(adminUserId);
  });

  it("publishes material and creates single-material product with idempotent linkage", async () => {
    const testMatId = createdMaterialIds[0];
    const res = await callAdminJson(
      {
        action: "publish",
        materialId: testMatId,
      },
      adminToken
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.productId).toBeDefined();

    // Verify product in database
    const { data: prod } = await admin
      .from("products")
      .select("id, slug, product_type, price_minor, status")
      .eq("slug", `material-${testMatId}`)
      .single();

    expect(prod).toBeDefined();
    expect(prod?.product_type).toBe("material");
    expect(prod?.price_minor).toBe(0); // Sequence 1 is free
    expect(prod?.status).toBe("published");

    // Verify product_materials linkage
    const { data: link } = await admin
      .from("product_materials")
      .select("*")
      .eq("material_id", testMatId);

    expect(link).toBeDefined();
    expect(link!.length).toBe(1);
    expect(link![0].product_id).toBe(prod?.id);

    // Test Idempotency: Re-publishing must NOT duplicate products or linkages
    const resRepublish = await callAdminJson(
      {
        action: "publish",
        materialId: testMatId,
      },
      adminToken
    );

    expect(resRepublish.status).toBe(200);
    const { data: linksAfter } = await admin
      .from("product_materials")
      .select("*")
      .eq("material_id", testMatId);
    expect(linksAfter!.length).toBe(1); // Still exactly 1
  });

  // --- 5. Version Update & Rotation Preservation ---
  it("preserves Version 1 while Version 2 is uploaded and rotates atomically upon approval", async () => {
    const testMatId = createdMaterialIds[0];
    // 1. Upload Version 2
    const v2Bytes = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35, // %PDF-1.5
      0x0a, 0x25, 0xd0, 0xd4, 0xc5, 0xd8, 0x0a, 0x31, 0x32, 0x33,
    ]);
    const uploadRes = await uploadPdf(testMatId, "v2.pdf", v2Bytes, "application/pdf", adminToken);
    expect(uploadRes.status).toBe(200);
    const v2Id = (uploadRes.body.version as any).id;

    // Verify Version 1 is STILL current and approved
    const { data: v1Before } = await admin
      .from("study_material_versions")
      .select("is_current, approval_status")
      .eq("material_id", testMatId)
      .eq("version_number", 1)
      .single();

    expect(v1Before?.is_current).toBe(true);
    expect(v1Before?.approval_status).toBe("approved");

    // 2. Approve Version 2
    const approveRes = await callAdminJson(
      {
        action: "approve_version",
        materialId: testMatId,
        versionId: v2Id,
      },
      adminToken
    );
    expect(approveRes.status).toBe(200);

    // Verify Version 2 is now current, Version 1 is demoted, but both exist
    const { data: allVersions } = await admin
      .from("study_material_versions")
      .select("version_number, is_current, approval_status")
      .eq("material_id", testMatId)
      .order("version_number", { ascending: true });

    expect(allVersions!.length).toBe(2);
    expect(allVersions![0].version_number).toBe(1);
    expect(allVersions![0].is_current).toBe(false); // Demoted
    expect(allVersions![0].approval_status).toBe("approved"); // Preserved

    expect(allVersions![1].version_number).toBe(2);
    expect(allVersions![1].is_current).toBe(true); // Promoted
    expect(allVersions![1].approval_status).toBe("approved");
  });
});
