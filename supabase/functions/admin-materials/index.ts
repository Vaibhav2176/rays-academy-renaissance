import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: "Server is not configured" }, 500);
  }

  try {
    // 1. Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const token = authHeader.slice(7).trim();
    const authClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
    });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !authData?.user?.id) {
      return jsonResponse({ error: "Invalid or expired authentication token" }, 401);
    }

    const user = authData.user;
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // 2. Authorize admin / faculty role
    const { data: roleData, error: roleError } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      return jsonResponse(
        { error: "Forbidden: Administrator or Faculty privileges required" },
        403
      );
    }

    // 3. Handle GET / List
    if (req.method === "GET") {
      return await handleList(admin);
    }

    // 4. Handle POST actions (Multipart or JSON)
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      return await handleMultipartUpload(req, admin, user.id);
    }

    let payload: Record<string, unknown>;
    try {
      payload = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400);
    }

    const action = typeof payload?.action === "string" ? payload.action : "";

    switch (action) {
      case "list":
        return await handleList(admin);

      case "save_metadata":
        return await handleSaveMetadata(payload, admin, user.id);

      case "upload_pdf":
        return await handleBase64Upload(payload, admin, user.id);

      case "approve_version":
        return await handleApproveVersion(payload, admin, user.id);

      case "reject_version":
        return await handleRejectVersion(payload, admin, user.id);

      case "publish":
        return await handlePublish(payload, admin, user.id);

      case "archive":
        return await handleArchive(payload, admin, user.id);

      default:
        return jsonResponse({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (error) {
    console.error("Error in admin-materials handler:", error);
    const message = error instanceof Error
      ? error.message
      : (typeof error === "object" && error !== null && "message" in error)
        ? String((error as any).message)
        : "Internal server error";
    return jsonResponse({ error: message }, 500);
  }
});

/** Shared PDF validation, hashing, storage upload, and version creation */
async function processPdfBuffer(
  buffer: ArrayBuffer,
  filename: string,
  materialId: string,
  admin: any,
  userId: string
) {
  const bytes = new Uint8Array(buffer);

  // 1. File size limit: 50 MB
  const maxBytes = 50 * 1024 * 1024;
  if (bytes.length > maxBytes) {
    return jsonResponse({ error: "File exceeds maximum size limit of 50 MB" }, 400);
  }

  if (bytes.length === 0) {
    return jsonResponse({ error: "File cannot be empty" }, 400);
  }

  // 2. Magic bytes validation (%PDF-)
  const pdfHeader = new TextDecoder().decode(bytes.slice(0, 5));
  if (pdfHeader !== "%PDF-") {
    return jsonResponse({ error: "Invalid PDF format: file missing standard PDF header (%PDF-)" }, 400);
  }

  // 3. Compute SHA-256 Checksum
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const checksumHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  // 4. Verify material exists
  const { data: material, error: matErr } = await admin
    .from("study_materials")
    .select("id, status, review_status")
    .eq("id", materialId)
    .maybeSingle();

  if (matErr || !material) {
    return jsonResponse({ error: "Study material not found" }, 404);
  }

  // 5. Next version number
  const { data: existingVersions, error: verErr } = await admin
    .from("study_material_versions")
    .select("version_number")
    .eq("material_id", materialId)
    .order("version_number", { ascending: false })
    .limit(1);

  if (verErr) throw verErr;

  const nextVersion = (existingVersions?.[0]?.version_number || 0) + 1;
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_") || "document.pdf";
  const storagePath = `materials/${materialId}/v${nextVersion}/${sanitizedFilename}`;

  // 6. Upload to private Storage bucket
  const { error: uploadErr } = await admin.storage
    .from("study-materials")
    .upload(storagePath, bytes, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadErr) {
    console.error("Storage upload failed:", uploadErr.message);
    return jsonResponse({ error: `Storage upload failed: ${uploadErr.message}` }, 500);
  }

  // 7. Insert into study_material_versions (starts as draft, not current)
  const { data: newVersion, error: insertVerErr } = await admin
    .from("study_material_versions")
    .insert({
      material_id: materialId,
      version_number: nextVersion,
      storage_path: storagePath,
      original_filename: filename,
      mime_type: "application/pdf",
      file_size_bytes: bytes.length,
      checksum_sha256: checksumHex,
      is_current: false,
      approval_status: "draft",
      created_by: userId,
    })
    .select("*")
    .single();

  if (insertVerErr) {
    await admin.storage.from("study-materials").remove([storagePath]);
    throw insertVerErr;
  }

  // 8. Mark material review_status as in_review if it was draft
  if (material.review_status === "draft") {
    const { error: reviewErr } = await admin
      .from("study_materials")
      .update({ review_status: "in_review" })
      .eq("id", materialId);

    if (reviewErr) {
      console.error("Failed to update material review status:", reviewErr.message);
    }
  }

  return jsonResponse({
    success: true,
    version: newVersion,
    checksum_sha256: checksumHex,
  });
}

/** Multipart upload of PDF revision */
async function handleMultipartUpload(req: Request, admin: any, userId: string) {
  const formData = await req.formData();
  const file = formData.get("file");
  const materialId = formData.get("materialId");

  if (typeof materialId !== "string" || !materialId.trim()) {
    return jsonResponse({ error: "materialId is required" }, 400);
  }

  if (!(file instanceof File)) {
    return jsonResponse({ error: "PDF file is required" }, 400);
  }

  if (file.type && file.type !== "application/pdf") {
    return jsonResponse({ error: "Only application/pdf files are permitted" }, 400);
  }

  const buffer = await file.arrayBuffer();
  return await processPdfBuffer(buffer, file.name, materialId, admin, userId);
}

/** Base64 upload of PDF revision (supports programmatic / headless environments) */
async function handleBase64Upload(payload: Record<string, unknown>, admin: any, userId: string) {
  const materialId = typeof payload?.materialId === "string" ? payload.materialId.trim() : "";
  const filename = typeof payload?.filename === "string" ? payload.filename.trim() : "document.pdf";
  const fileBase64 = typeof payload?.fileBase64 === "string" ? payload.fileBase64.trim() : "";
  const mimeType = typeof payload?.mimeType === "string" ? payload.mimeType.trim() : "application/pdf";

  if (!materialId) {
    return jsonResponse({ error: "materialId is required" }, 400);
  }

  if (!fileBase64) {
    return jsonResponse({ error: "fileBase64 is required" }, 400);
  }

  if (mimeType !== "application/pdf") {
    return jsonResponse({ error: "Only application/pdf files are permitted" }, 400);
  }

  let buffer: ArrayBuffer;
  try {
    const binaryString = atob(fileBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    buffer = bytes.buffer;
  } catch {
    return jsonResponse({ error: "Invalid base64 encoding" }, 400);
  }

  return await processPdfBuffer(buffer, filename, materialId, admin, userId);
}

/** List all materials with version history and product links */
async function handleList(admin: any) {
  const { data: materials, error: matErr } = await admin
    .from("study_materials")
    .select(`
      *,
      classes:class_id(id, name)
    `)
    .order("created_at", { ascending: false });

  if (matErr) throw matErr;

  const { data: versions, error: verErr } = await admin
    .from("study_material_versions")
    .select("*")
    .order("version_number", { ascending: false });

  if (verErr) throw verErr;

  const { data: products, error: prodErr } = await admin
    .from("product_materials")
    .select("material_id, product_id, products(*)");

  if (prodErr) throw prodErr;

  const versionMap = new Map<string, any[]>();
  for (const v of versions || []) {
    if (!versionMap.has(v.material_id)) {
      versionMap.set(v.material_id, []);
    }
    versionMap.get(v.material_id)!.push(v);
  }

  const productMap = new Map<string, any>();
  for (const p of products || []) {
    productMap.set(p.material_id, p.products);
  }

  const enriched = (materials || []).map((m: any) => ({
    ...m,
    versions: versionMap.get(m.id) || [],
    product: productMap.get(m.id) || null,
  }));

  return jsonResponse({ materials: enriched });
}

/** Create or update study material metadata */
async function handleSaveMetadata(payload: Record<string, unknown>, admin: any, userId: string) {
  const metadata = payload?.metadata as Record<string, unknown> | undefined;
  if (!metadata || typeof metadata !== "object") {
    return jsonResponse({ error: "Missing metadata object" }, 400);
  }

  const id = typeof metadata.id === "string" ? metadata.id.trim() : null;
  const title = typeof metadata.title === "string" ? metadata.title.trim() : "";
  const classId = typeof metadata.class_id === "string" ? metadata.class_id.trim() : "";
  const courseSlug = typeof metadata.course_slug === "string" ? metadata.course_slug.trim().toLowerCase() : "";
  const subjectSlug = typeof metadata.subject_slug === "string" ? metadata.subject_slug.trim().toLowerCase() : "";
  const sectionName = typeof metadata.section_name === "string" ? metadata.section_name.trim() : null;
  const resourceType = typeof metadata.resource_type === "string" ? metadata.resource_type.trim() : "chapter";
  const chapterNumber = metadata.chapter_number !== null && metadata.chapter_number !== undefined && metadata.chapter_number !== ""
    ? Number(metadata.chapter_number)
    : null;
  const subjectSequenceNumber = metadata.subject_sequence_number !== null && metadata.subject_sequence_number !== undefined && metadata.subject_sequence_number !== ""
    ? Number(metadata.subject_sequence_number)
    : null;
  const description = typeof metadata.description === "string" ? metadata.description.trim() : null;
  const boardExam = typeof metadata.board_exam === "string" ? metadata.board_exam.trim() : null;
  const academicYear = typeof metadata.academic_year === "string" ? metadata.academic_year.trim() : null;

  if (!title || !courseSlug || !subjectSlug) {
    return jsonResponse({ error: "Title, course_slug, and subject_slug are required" }, 400);
  }

  if (resourceType === "chapter") {
    if (subjectSequenceNumber === null || !Number.isInteger(subjectSequenceNumber) || subjectSequenceNumber < 1) {
      return jsonResponse({ error: "Chapter materials require a valid subject_sequence_number (positive integer)" }, 400);
    }
  }

  const rowData: Record<string, unknown> = {
    title,
    course_slug: courseSlug,
    subject_slug: subjectSlug,
    section_name: sectionName,
    resource_type: resourceType,
    chapter_number: chapterNumber,
    subject_sequence_number: subjectSequenceNumber,
    description,
    board_exam: boardExam,
    academic_year: academicYear,
    material_type: "pdf",
  };

  // Resolve class_id: if not provided by client, map from course_slug or fallback
  let resolvedClassId = classId;
  if (!resolvedClassId) {
    const courseToClassMap: Record<string, string> = {
      nda: "NDA",
      neet: "NEET",
      "iit-jee": "IIT-JEE",
      jee: "IIT-JEE",
      cuet: "CUET",
      "class-10": "Class 10",
      "class-11": "Class 11",
      "class-12": "Class 12",
      "class-9": "Class 9",
      "class-8": "Class 8",
      "class-7": "Class 7",
      "class-6": "Class 6",
    };

    const targetClassName = courseToClassMap[courseSlug];
    if (targetClassName) {
      const { data: matchedClass } = await admin
        .from("classes")
        .select("id")
        .eq("name", targetClassName)
        .maybeSingle();
      if (matchedClass?.id) {
        resolvedClassId = matchedClass.id;
      }
    }

    if (!resolvedClassId) {
      const { data: ilikeClass } = await admin
        .from("classes")
        .select("id")
        .or(`name.ilike.%${courseSlug}%,name.ilike.%${courseSlug.replace(/-/g, " ")}%`)
        .limit(1)
        .maybeSingle();
      if (ilikeClass?.id) {
        resolvedClassId = ilikeClass.id;
      }
    }

    if (!resolvedClassId) {
      const { data: fallbackClass } = await admin
        .from("classes")
        .select("id")
        .limit(1)
        .maybeSingle();
      resolvedClassId = fallbackClass?.id || "";
    }
  }

  if (resolvedClassId) {
    rowData.class_id = resolvedClassId;
  }

  if (id) {
    const { data: updated, error: updateErr } = await admin
      .from("study_materials")
      .update(rowData)
      .eq("id", id)
      .select("id, is_free, price_minor, price, status, review_status")
      .single();

    if (updateErr) {
      console.error("Error updating study material metadata:", updateErr);
      return jsonResponse({ error: updateErr.message }, 400);
    }
    return jsonResponse({ success: true, material: updated });
  } else {
    rowData.status = "draft";
    rowData.review_status = "draft";

    const { data: inserted, error: insertErr } = await admin
      .from("study_materials")
      .insert(rowData)
      .select("id, is_free, price_minor, price, status, review_status")
      .single();

    if (insertErr) {
      console.error("Error inserting study material metadata:", insertErr);
      return jsonResponse({ error: insertErr.message }, 400);
    }
    return jsonResponse({ success: true, material: inserted });
  }
}

/** Faculty/Teacher Review: Approve a version and set it as current */
async function handleApproveVersion(payload: Record<string, unknown>, admin: any, userId: string) {
  const materialId = typeof payload?.materialId === "string" ? payload.materialId.trim() : "";
  const versionId = typeof payload?.versionId === "string" ? payload.versionId.trim() : "";

  if (!materialId || !versionId) {
    return jsonResponse({ error: "materialId and versionId are required" }, 400);
  }

  const { data: targetVersion, error: targetErr } = await admin
    .from("study_material_versions")
    .select("id, material_id, approval_status, is_current")
    .eq("id", versionId)
    .eq("material_id", materialId)
    .maybeSingle();

  if (targetErr || !targetVersion) {
    return jsonResponse({ error: "Version not found for this material" }, 404);
  }

  // 1. Mark version as approved
  const { error: appErr } = await admin
    .from("study_material_versions")
    .update({
      approval_status: "approved",
      approved_by: userId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", versionId);

  if (appErr) throw appErr;

  // 2. Perform atomic rotation if another version is current
  const { data: currentVersion } = await admin
    .from("study_material_versions")
    .select("id")
    .eq("material_id", materialId)
    .eq("is_current", true)
    .maybeSingle();

  if (currentVersion && currentVersion.id !== versionId) {
    // Demote old current version
    const { error: demoteErr } = await admin
      .from("study_material_versions")
      .update({ is_current: false })
      .eq("id", currentVersion.id);

    if (demoteErr) throw demoteErr;
  }

  // Set target version as current
  const { error: promoteErr } = await admin
    .from("study_material_versions")
    .update({ is_current: true })
    .eq("id", versionId);

  if (promoteErr) throw promoteErr;

  // 3. Mark material review_status as approved
  const { error: matUpdateErr } = await admin
    .from("study_materials")
    .update({
      review_status: "approved",
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", materialId);

  if (matUpdateErr) throw matUpdateErr;

  return jsonResponse({ success: true, materialId, versionId });
}

/** Reject a draft or review version */
async function handleRejectVersion(payload: Record<string, unknown>, admin: any, userId: string) {
  const materialId = typeof payload?.materialId === "string" ? payload.materialId.trim() : "";
  const versionId = typeof payload?.versionId === "string" ? payload.versionId.trim() : "";

  if (!materialId || !versionId) {
    return jsonResponse({ error: "materialId and versionId are required" }, 400);
  }

  const { error: rejErr } = await admin
    .from("study_material_versions")
    .update({ approval_status: "rejected" })
    .eq("id", versionId)
    .eq("material_id", materialId);

  if (rejErr) throw rejErr;

  await admin
    .from("study_materials")
    .update({ review_status: "rejected", reviewed_by: userId, reviewed_at: new Date().toISOString() })
    .eq("id", materialId);

  return jsonResponse({ success: true });
}

/** Publish an approved material and idempotently synchronize product & linkage */
async function handlePublish(payload: Record<string, unknown>, admin: any, userId: string) {
  const materialId = typeof payload?.materialId === "string" ? payload.materialId.trim() : "";
  if (!materialId) {
    return jsonResponse({ error: "materialId is required" }, 400);
  }

  // 1. Fetch material
  const { data: material, error: matErr } = await admin
    .from("study_materials")
    .select("id, title, description, course_slug, subject_slug, is_free, price_minor, status, review_status")
    .eq("id", materialId)
    .maybeSingle();

  if (matErr || !material) {
    return jsonResponse({ error: "Study material not found" }, 404);
  }

  // 2. Publication Gate Verification
  if (material.review_status !== "approved") {
    return jsonResponse({ error: "Cannot publish: Faculty review status must be approved" }, 400);
  }

  const { data: approvedCurrentVersion, error: verErr } = await admin
    .from("study_material_versions")
    .select("id")
    .eq("material_id", materialId)
    .eq("is_current", true)
    .eq("approval_status", "approved")
    .maybeSingle();

  if (verErr || !approvedCurrentVersion) {
    return jsonResponse({ error: "Cannot publish: Material requires an approved current PDF version" }, 400);
  }

  // 3. Transition material status to published
  const { error: pubErr } = await admin
    .from("study_materials")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      archived_at: null,
    })
    .eq("id", materialId);

  if (pubErr) throw pubErr;

  // 4. Idempotently create or update single-material product in products
  const productSlug = `material-${materialId}`;
  const priceMinor = material.is_free ? 0 : Number(material.price_minor || 4900);

  const { data: product, error: prodErr } = await admin
    .from("products")
    .upsert(
      {
        slug: productSlug,
        title: material.title,
        description: material.description,
        product_type: "material",
        course_slug: material.course_slug,
        subject_slug: material.subject_slug,
        price_minor: priceMinor,
        currency: "INR",
        status: "published",
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (prodErr) throw prodErr;

  // 5. Idempotently link product_materials
  const { error: linkErr } = await admin
    .from("product_materials")
    .upsert(
      {
        product_id: product.id,
        material_id: materialId,
      },
      { onConflict: "product_id,material_id" }
    );

  if (linkErr) throw linkErr;

  return jsonResponse({
    success: true,
    materialId,
    productId: product.id,
    productSlug,
  });
}

/** Archive/Unpublish material and linked product */
async function handleArchive(payload: Record<string, unknown>, admin: any, userId: string) {
  const materialId = typeof payload?.materialId === "string" ? payload.materialId.trim() : "";
  if (!materialId) {
    return jsonResponse({ error: "materialId is required" }, 400);
  }

  const { error: matErr } = await admin
    .from("study_materials")
    .update({
      status: "archived",
      archived_at: new Date().toISOString(),
    })
    .eq("id", materialId);

  if (matErr) throw matErr;

  const productSlug = `material-${materialId}`;
  await admin
    .from("products")
    .update({ status: "archived" })
    .eq("slug", productSlug);

  return jsonResponse({ success: true, materialId });
}
