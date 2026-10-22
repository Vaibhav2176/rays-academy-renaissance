import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "http://127.0.0.1:54321";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

describe("Public Catalog Integration & Browsing (Milestone 1B.3)", () => {
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const anon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false },
  });

  const testClassId = "66666666-6666-6666-6666-666666666660";
  const ch1MaterialId = "66666666-6666-6666-6666-666666666661";
  const ch2MaterialId = "66666666-6666-6666-6666-666666666662";
  const ch3MaterialId = "66666666-6666-6666-6666-666666666663";
  const pyqMaterialId = "66666666-6666-6666-6666-666666666664";
  const draftMaterialId = "66666666-6666-6666-6666-666666666665";

  const dummyPdfBytes = new TextEncoder().encode("%PDF-1.4\nCatalog test pdf content\n%%EOF");

  beforeAll(async () => {
    // 1. Setup Class
    await admin.from("classes").upsert({
      id: testClassId,
      name: "Catalog Test Class NDA",
      description: "Class for testing public catalog",
    });

    // Ensure bucket exists
    await admin.storage.createBucket("study-materials", {
      public: false,
      fileSizeLimit: 52428800,
      allowedMimeTypes: ["application/pdf"],
    });

    // Upload dummy PDF for ch1
    await admin.storage
      .from("study-materials")
      .upload("materials/catalog-test-ch1.pdf", dummyPdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    // 2. Setup Chapter 1 (Seq 1 -> Free, Published)
    await admin.from("study_materials").upsert({
      id: ch1MaterialId,
      class_id: testClassId,
      title: "NDA Maths - Topic 1 (Sets & Relations)",
      course_slug: "nda",
      subject_slug: "maths",
      section_name: "Algebra",
      resource_type: "chapter",
      chapter_number: 1,
      subject_sequence_number: 1,
      status: "draft",
      review_status: "approved",
    });

    await admin.from("study_material_versions").upsert({
      material_id: ch1MaterialId,
      version_number: 1,
      storage_path: "materials/catalog-test-ch1.pdf",
      original_filename: "topic1-sets.pdf",
      mime_type: "application/pdf",
      file_size_bytes: dummyPdfBytes.length,
      checksum_sha256: "testsha256ch1",
      is_current: true,
      approval_status: "approved",
    });

    await admin
      .from("study_materials")
      .update({ status: "published" })
      .eq("id", ch1MaterialId);

    // 3. Setup Chapter 2 (Seq 2 -> Free, Published)
    await admin.from("study_materials").upsert({
      id: ch2MaterialId,
      class_id: testClassId,
      title: "NDA Maths - Topic 2 (Venn Diagrams)",
      course_slug: "nda",
      subject_slug: "maths",
      section_name: "Algebra",
      resource_type: "chapter",
      chapter_number: 2,
      subject_sequence_number: 2,
      status: "draft",
      review_status: "approved",
    });

    await admin.from("study_material_versions").upsert({
      material_id: ch2MaterialId,
      version_number: 1,
      storage_path: "materials/catalog-test-ch2.pdf",
      original_filename: "topic2-venn.pdf",
      mime_type: "application/pdf",
      file_size_bytes: dummyPdfBytes.length,
      checksum_sha256: "testsha256ch2",
      is_current: true,
      approval_status: "approved",
    });

    await admin
      .from("study_materials")
      .update({ status: "published" })
      .eq("id", ch2MaterialId);

    // 4. Setup Chapter 3 (Seq 3 -> Paid ₹49, Published)
    await admin.from("study_materials").upsert({
      id: ch3MaterialId,
      class_id: testClassId,
      title: "NDA Maths - Topic 3 (Trigonometric Ratios)",
      course_slug: "nda",
      subject_slug: "maths",
      section_name: "Trigonometry",
      resource_type: "chapter",
      chapter_number: 3,
      subject_sequence_number: 3,
      status: "draft",
      review_status: "approved",
    });

    await admin.from("study_material_versions").upsert({
      material_id: ch3MaterialId,
      version_number: 1,
      storage_path: "materials/catalog-test-ch3.pdf",
      original_filename: "topic3-trig.pdf",
      mime_type: "application/pdf",
      file_size_bytes: dummyPdfBytes.length,
      checksum_sha256: "testsha256ch3",
      is_current: true,
      approval_status: "approved",
    });

    await admin
      .from("study_materials")
      .update({ status: "published" })
      .eq("id", ch3MaterialId);

    // 5. Setup Non-Chapter: PYQ (resource_type: pyq, Free, Published)
    await admin.from("study_materials").upsert({
      id: pyqMaterialId,
      class_id: testClassId,
      title: "NDA 2024 Maths Solved Paper 1",
      course_slug: "nda",
      subject_slug: "maths",
      resource_type: "pyq",
      is_free: true,
      price_minor: 0,
      status: "draft",
      review_status: "approved",
    });

    await admin.from("study_material_versions").upsert({
      material_id: pyqMaterialId,
      version_number: 1,
      storage_path: "materials/catalog-test-pyq.pdf",
      original_filename: "nda-2024-pyq.pdf",
      mime_type: "application/pdf",
      file_size_bytes: dummyPdfBytes.length,
      checksum_sha256: "testsha256pyq",
      is_current: true,
      approval_status: "approved",
    });

    await admin
      .from("study_materials")
      .update({ status: "published" })
      .eq("id", pyqMaterialId);

    // 6. Setup Draft Unapproved Material (status: draft)
    await admin.from("study_materials").upsert({
      id: draftMaterialId,
      class_id: testClassId,
      title: "Secret Unapproved Draft Note",
      course_slug: "nda",
      subject_slug: "maths",
      resource_type: "chapter",
      chapter_number: 4,
      subject_sequence_number: 4,
      status: "draft",
      review_status: "draft",
    });
  });

  afterAll(async () => {
    // Cleanup test data
    await admin
      .from("study_materials")
      .delete()
      .in("id", [
        ch1MaterialId,
        ch2MaterialId,
        ch3MaterialId,
        pyqMaterialId,
        draftMaterialId,
      ]);
  });

  it("1. Public / anonymous clients can query study_material_catalog successfully", async () => {
    const { data, error } = await anon
      .from("study_material_catalog")
      .select("*")
      .eq("course_slug", "nda");

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data!.length).toBeGreaterThanOrEqual(4);
  });

  it("2. Catalog view and underlying table enforce server-side security and never expose draft materials", async () => {
    const { data: viewData, error: viewError } = await anon
      .from("study_material_catalog")
      .select("id, title, status")
      .eq("id", draftMaterialId);

    expect(viewError).toBeNull();
    // Draft material must NOT appear in the public catalog view
    expect(viewData).toHaveLength(0);

    // Direct table query on public.study_materials must also return 0 rows for non-admin
    const { data: tableData, error: tableError } = await anon
      .from("study_materials")
      .select("id, title, status")
      .eq("id", draftMaterialId);

    expect(tableError).toBeNull();
    expect(tableData).toHaveLength(0);
  });

  it("3. Catalog view never exposes storage_path or checksum_sha256 columns", async () => {
    const { data } = await anon
      .from("study_material_catalog")
      .select("*")
      .eq("id", ch1MaterialId)
      .single();

    expect(data).toBeDefined();
    expect((data as any).storage_path).toBeUndefined();
    expect((data as any).file_url).toBeUndefined();
    expect((data as any).checksum_sha256).toBeUndefined();
  });

  it("4. Sequential pricing rule: Topic 1 and Topic 2 are free (is_free = true, price_minor = 0)", async () => {
    const { data: ch1 } = await anon
      .from("study_material_catalog")
      .select("id, subject_sequence_number, is_free, price_minor")
      .eq("id", ch1MaterialId)
      .single();

    const { data: ch2 } = await anon
      .from("study_material_catalog")
      .select("id, subject_sequence_number, is_free, price_minor")
      .eq("id", ch2MaterialId)
      .single();

    expect(ch1!.subject_sequence_number).toBe(1);
    expect(ch1!.is_free).toBe(true);
    expect(ch1!.price_minor).toBe(0);

    expect(ch2!.subject_sequence_number).toBe(2);
    expect(ch2!.is_free).toBe(true);
    expect(ch2!.price_minor).toBe(0);
  });

  it("5. Sequential pricing rule: Topic 3 is paid ₹49 (is_free = false, price_minor = 4900)", async () => {
    const { data: ch3 } = await anon
      .from("study_material_catalog")
      .select("id, subject_sequence_number, is_free, price_minor")
      .eq("id", ch3MaterialId)
      .single();

    expect(ch3!.subject_sequence_number).toBe(3);
    expect(ch3!.is_free).toBe(false);
    expect(ch3!.price_minor).toBe(4900);
  });

  it("6. Filters catalog by course_slug and subject_slug correctly", async () => {
    const { data, error } = await anon
      .from("study_material_catalog")
      .select("id, course_slug, subject_slug")
      .eq("course_slug", "nda")
      .eq("subject_slug", "maths");

    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThanOrEqual(4);
    data!.forEach((item) => {
      expect(item.course_slug).toBe("nda");
      expect(item.subject_slug).toBe("maths");
    });
  });

  it("7. Filters catalog by section_name correctly", async () => {
    const { data, error } = await anon
      .from("study_material_catalog")
      .select("id, section_name")
      .eq("course_slug", "nda")
      .eq("section_name", "Algebra");

    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThanOrEqual(2);
    data!.forEach((item) => {
      expect(item.section_name).toBe("Algebra");
    });
  });

  it("8. Keeps non-chapter resources (PYQs) distinct from chapter sequences", async () => {
    const { data, error } = await anon
      .from("study_material_catalog")
      .select("id, resource_type, subject_sequence_number, is_free")
      .eq("id", pyqMaterialId)
      .single();

    expect(error).toBeNull();
    expect(data!.resource_type).toBe("pyq");
    // PYQs do not mandate subject_sequence_number
    expect(data!.is_free).toBe(true);
  });

  it("9. Connects free download to material-download Edge Function and receives signed URL", async () => {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/material-download`, {
      method: "POST",
      headers: {
        apikey: ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ materialId: ch1MaterialId }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.download_url).toBeDefined();
    expect(body.download_url).toContain("study-materials/materials/catalog-test-ch1.pdf");
    expect(body.expires_in).toBe(60);
  });

  it("10. Rejects anonymous download for paid material with HTTP 401", async () => {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/material-download`, {
      method: "POST",
      headers: {
        apikey: ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ materialId: ch3MaterialId }),
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain("Authentication required");
  });

  it("11. Rejects download for unpublished/draft material with HTTP 404", async () => {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/material-download`, {
      method: "POST",
      headers: {
        apikey: ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ materialId: draftMaterialId }),
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain("Material not found or is not published");
  });
});

