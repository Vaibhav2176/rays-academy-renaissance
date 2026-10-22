import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "http://127.0.0.1:54321";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/material-download`;

describe("Edge Function: material-download (Milestone 1B.1)", () => {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const testClassId = "44444444-4444-4444-4444-444444444441";
  const freeMaterialId = "55555555-5555-5555-5555-555555555551";
  const paidMaterialId = "55555555-5555-5555-5555-555555555552";
  const draftMaterialId = "55555555-5555-5555-5555-555555555553";

  let student1Token = "";
  let student1Id = "";
  let student2Token = "";
  let student2Id = "";

  beforeAll(async () => {
    // 1. Setup Class
    await admin.from("classes").upsert({
      id: testClassId,
      name: "Download Test Class",
      description: "Class for testing downloads",
    });

    // 2. Setup Student 1 (Entitled)
    const s1Email = `entitled_${Date.now()}@example.com`;
    const s1Pass = "TestPassword123!";
    const s1User = await admin.auth.admin.createUser({
      email: s1Email,
      password: s1Pass,
      email_confirm: true,
    });
    student1Id = s1User.data.user!.id;

    // Sign in Student 1 to get token
    const client1 = createClient(SUPABASE_URL, ANON_KEY);
    const s1Auth = await client1.auth.signInWithPassword({
      email: s1Email,
      password: s1Pass,
    });
    student1Token = s1Auth.data.session!.access_token;

    // 3. Setup Student 2 (Unentitled)
    const s2Email = `unentitled_${Date.now()}@example.com`;
    const s2Pass = "TestPassword123!";
    const s2User = await admin.auth.admin.createUser({
      email: s2Email,
      password: s2Pass,
      email_confirm: true,
    });
    student2Id = s2User.data.user!.id;

    // Sign in Student 2 to get token
    const client2 = createClient(SUPABASE_URL, ANON_KEY);
    const s2Auth = await client2.auth.signInWithPassword({
      email: s2Email,
      password: s2Pass,
    });
    student2Token = s2Auth.data.session!.access_token;

    // 4. Upload dummy PDF files to private study-materials storage bucket
    const dummyPdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]); // %PDF-1.4
    await admin.storage
      .from("study-materials")
      .upload("test/free_test.pdf", dummyPdfContent, {
        contentType: "application/pdf",
        upsert: true,
      });

    await admin.storage
      .from("study-materials")
      .upload("test/paid_test.pdf", dummyPdfContent, {
        contentType: "application/pdf",
        upsert: true,
      });

    // 5. Seed Free Material (Sequence 1 in testcourse -> free)
    await admin.from("study_materials").insert({
      id: freeMaterialId,
      class_id: testClassId,
      title: "Download Test Free Chapter",
      course_slug: "testcourse",
      subject_slug: "testsubject",
      section_name: "TestSection",
      resource_type: "chapter",
      chapter_number: 1,
      subject_sequence_number: 1,
      is_free: true,
      price_minor: 0,
      price: 0,
      status: "draft",
      review_status: "approved",
    });

    await admin.from("study_material_versions").insert({
      material_id: freeMaterialId,
      version_number: 1,
      storage_path: "test/free_test.pdf",
      original_filename: "free_test.pdf",
      mime_type: "application/pdf",
      file_size_bytes: dummyPdfContent.length,
      checksum_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      is_current: true,
      approval_status: "approved",
    });

    await admin
      .from("study_materials")
      .update({ status: "published" })
      .eq("id", freeMaterialId);

    // 6. Seed Paid Material (Sequence 102 -> paid ₹49)
    await admin.from("study_materials").insert({
      id: paidMaterialId,
      class_id: testClassId,
      title: "Download Test Paid Chapter",
      course_slug: "nda",
      subject_slug: "maths",
      section_name: "TestSection",
      resource_type: "chapter",
      chapter_number: 102,
      subject_sequence_number: 102,
      is_free: false,
      price_minor: 4900,
      price: 49,
      status: "draft",
      review_status: "approved",
    });

    await admin.from("study_material_versions").insert({
      material_id: paidMaterialId,
      version_number: 1,
      storage_path: "test/paid_test.pdf",
      original_filename: "paid_test.pdf",
      mime_type: "application/pdf",
      file_size_bytes: dummyPdfContent.length,
      checksum_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      is_current: true,
      approval_status: "approved",
    });

    await admin
      .from("study_materials")
      .update({ status: "published" })
      .eq("id", paidMaterialId);

    // 7. Seed Draft Unpublished Material
    await admin.from("study_materials").insert({
      id: draftMaterialId,
      class_id: testClassId,
      title: "Download Test Draft Chapter",
      course_slug: "nda",
      subject_slug: "maths",
      section_name: "TestSection",
      resource_type: "chapter",
      chapter_number: 103,
      subject_sequence_number: 103,
      is_free: false,
      price_minor: 4900,
      price: 49,
      status: "draft",
      review_status: "draft",
    });

    // 8. Grant active entitlement for Student 1 on Paid Material
    await admin.from("material_entitlements").insert({
      user_id: student1Id,
      entitlement_scope: "single_material",
      material_id: paidMaterialId,
      source: "payment",
      status: "active",
    });
  });

  afterAll(async () => {
    // Cleanup test data
    if (student1Id) await admin.auth.admin.deleteUser(student1Id);
    if (student2Id) await admin.auth.admin.deleteUser(student2Id);
    await admin.from("study_materials").delete().in("id", [freeMaterialId, paidMaterialId, draftMaterialId]);
    await admin.from("classes").delete().eq("id", testClassId);
    await admin.storage.from("study-materials").remove(["test/free_test.pdf", "test/paid_test.pdf"]);
  });

  const callDownload = async (
    materialId: unknown,
    token?: string
  ): Promise<{ status: number; body: Record<string, unknown> }> => {
    const headers: Record<string, string> = {
      apikey: ANON_KEY,
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ materialId }),
    });

    const body = (await res.json()) as Record<string, unknown>;
    return { status: res.status, body };
  };

  it("rejects invalid material ID formats with HTTP 400", async () => {
    const res = await callDownload("not-a-valid-uuid");
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Invalid material ID");
  });

  it("rejects non-existent materials with HTTP 404", async () => {
    const res = await callDownload("00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
    expect(res.body.error).toContain("Material not found or is not published");
  });

  it("rejects unpublished draft materials with HTTP 404", async () => {
    const res = await callDownload(draftMaterialId);
    expect(res.status).toBe(404);
    expect(res.body.error).toContain("Material not found or is not published");
  });

  it("allows anonymous download for free published material without requiring login", async () => {
    const res = await callDownload(freeMaterialId);
    expect(res.status).toBe(200);
    expect(res.body.download_url).toBeDefined();
    expect(typeof res.body.download_url).toBe("string");
    expect(res.body.download_url).toContain("/storage/v1/object/sign/study-materials/");
    expect(res.body.expires_in).toBe(60);

    // Verify storage path, internal checksums, and secrets are not leaked
    expect(res.body.storage_path).toBeUndefined();
    expect(res.body.checksum_sha256).toBeUndefined();
    expect(res.body.service_role_key).toBeUndefined();
  });

  it("rejects unauthenticated requests for paid material with HTTP 401", async () => {
    const res = await callDownload(paidMaterialId); // No token
    expect(res.status).toBe(401);
    expect(res.body.error).toContain("Authentication required");
  });

  it("rejects authenticated user without active entitlement with HTTP 403", async () => {
    const res = await callDownload(paidMaterialId, student2Token); // Student 2 has no entitlement
    expect(res.status).toBe(403);
    expect(res.body.error).toContain("You do not have access");
  });

  it("allows authenticated user with active entitlement to download paid material", async () => {
    const res = await callDownload(paidMaterialId, student1Token); // Student 1 has active entitlement
    expect(res.status).toBe(200);
    expect(res.body.download_url).toBeDefined();
    expect(typeof res.body.download_url).toBe("string");
    expect(res.body.download_url).toContain("/storage/v1/object/sign/study-materials/");
    expect(res.body.expires_in).toBe(60);

    // Verify storage path, internal checksums, and secrets are not leaked
    expect(res.body.storage_path).toBeUndefined();
    expect(res.body.checksum_sha256).toBeUndefined();
  });

  it("verifies that download event was logged in material_download_events", async () => {
    const { data: events } = await admin
      .from("material_download_events")
      .select("material_id, user_id")
      .eq("material_id", paidMaterialId)
      .eq("user_id", student1Id);

    expect(events).toBeDefined();
    expect(events!.length).toBeGreaterThan(0);
  });
});
