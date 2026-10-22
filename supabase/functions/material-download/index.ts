import { createClient } from "npm:@supabase/supabase-js@2";

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
    console.error("Missing required Supabase environment variables");
    return jsonResponse({ error: "Server is not configured" }, 500);
  }

  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON request body" }, 400);
    }

    const materialId = typeof body?.materialId === "string" ? body.materialId.trim() : "";
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!materialId || !uuidRegex.test(materialId)) {
      return jsonResponse({ error: "Invalid material ID" }, 400);
    }

    // 1. Identify requesting user if authorization header is provided
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      if (token) {
        const authClient = createClient(supabaseUrl, anonKey, {
          auth: { persistSession: false },
        });
        const { data: userData, error: userError } = await authClient.auth.getUser(token);
        if (!userError && userData?.user?.id) {
          userId = userData.user.id;
        }
      }
    }

    // 2. Fetch published material using admin client
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: material, error: materialError } = await admin
      .from("study_materials")
      .select("id, is_free, status, course_slug, subject_slug")
      .eq("id", materialId)
      .eq("status", "published")
      .maybeSingle();

    if (materialError) {
      console.error("Database error looking up material:", materialError.message);
      return jsonResponse({ error: "Failed to look up material" }, 500);
    }

    if (!material) {
      return jsonResponse({ error: "Material not found or is not published" }, 404);
    }

    // 3. Authorization check
    if (material.is_free) {
      // Free materials can be downloaded without login
    } else {
      // Paid material: require authenticated user
      if (!userId) {
        return jsonResponse(
          { error: "Authentication required to download paid materials" },
          401
        );
      }

      // Verify entitlement using canonical database security function
      const { data: hasAccess, error: accessError } = await admin.rpc(
        "has_material_access",
        {
          _user_id: userId,
          _material_id: materialId,
        }
      );

      if (accessError) {
        console.error("Error evaluating material entitlement:", accessError.message);
        return jsonResponse({ error: "Unable to verify material entitlement" }, 500);
      }

      if (!hasAccess) {
        return jsonResponse(
          { error: "You do not have access to this study material" },
          403
        );
      }
    }

    // 4. Resolve current approved PDF version from database
    const { data: version, error: versionError } = await admin
      .from("study_material_versions")
      .select("id, storage_path, original_filename")
      .eq("material_id", materialId)
      .eq("is_current", true)
      .eq("approval_status", "approved")
      .maybeSingle();

    if (versionError) {
      console.error("Database error looking up material version:", versionError.message);
      return jsonResponse({ error: "Failed to look up material version" }, 500);
    }

    if (!version || !version.storage_path) {
      return jsonResponse(
        { error: "Approved PDF file is not available for this material" },
        404
      );
    }

    // 5. Generate short-lived signed URL (60 seconds expiry)
    const downloadFilename = version.original_filename || "study-material.pdf";
    const { data: signedData, error: signedError } = await admin.storage
      .from("study-materials")
      .createSignedUrl(version.storage_path, 60, {
        download: downloadFilename,
      });

    if (signedError || !signedData?.signedUrl) {
      console.error("Storage error creating signed URL:", signedError?.message);
      return jsonResponse({ error: "Failed to generate download URL" }, 500);
    }

    // 6. Record download event
    const referrer = req.headers.get("referer");
    let referrerHost: string | null = null;
    if (referrer) {
      try {
        referrerHost = new URL(referrer).hostname.slice(0, 255);
      } catch {
        // Omit invalid referrer
      }
    }

    const { error: logError } = await admin.from("material_download_events").insert({
      material_id: materialId,
      user_id: userId,
      referrer_host: referrerHost,
    });

    if (logError) {
      console.warn("Could not log material download event:", logError.message);
    }

    return jsonResponse({
      download_url: signedData.signedUrl,
      url: signedData.signedUrl,
      expires_in: 60,
      expiresIn: 60,
    });
  } catch (error) {
    console.error("Unexpected error in material-download:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
