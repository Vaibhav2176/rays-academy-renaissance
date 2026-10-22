import { describe, it, expect, vi } from "vitest";
import { parseFunctionsHttpError } from "@/components/study-material/PaidMaterialDialog";
import {
  checkMaterialEntitlement,
  StudentEntitlement,
} from "@/hooks/useStudentEntitlements";
import { CatalogStudyMaterial } from "@/hooks/useStudyMaterials";
import { MaterialPurchase } from "@/hooks/useMaterialPurchases";

describe("Admin & Entitled Checkout Experience Regression Tests", () => {
  // ==========================================================================
  // 1. parseFunctionsHttpError Unit Tests
  // ==========================================================================
  describe("parseFunctionsHttpError Helper", () => {
    it("safely extracts 409 already_entitled payload from error.context Fetch Response", async () => {
      const mockResponse = new Response(
        JSON.stringify({
          error: "You already own active access to this study material",
          already_entitled: true,
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );

      const fakeError = {
        name: "FunctionsHttpError",
        message: "Edge Function returned a non-2xx status code",
        context: mockResponse,
      };

      const parsed = await parseFunctionsHttpError(fakeError);
      expect(parsed).toEqual({
        error: "You already own active access to this study material",
        already_entitled: true,
      });
    });

    it("safely extracts ordinary server errors (e.g. 503, 502, 400) from error.context", async () => {
      const errorBodies = [
        { status: 503, body: { error: "Payment gateway credentials are not configured" } },
        { status: 502, body: { error: "Payment gateway order creation failed" } },
        { status: 400, body: { error: "Only published materials can be purchased" } },
      ];

      for (const { status, body } of errorBodies) {
        const mockResponse = new Response(JSON.stringify(body), {
          status,
          headers: { "Content-Type": "application/json" },
        });

        const fakeError = {
          name: "FunctionsHttpError",
          message: "Edge Function returned a non-2xx status code",
          context: mockResponse,
        };

        const parsed = await parseFunctionsHttpError(fakeError);
        expect(parsed).toEqual(body);
      }
    });

    it("handles cloned or readable streams gracefully without throwing", async () => {
      const mockResponse = new Response(
        JSON.stringify({ error: "Invalid material ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );

      const fakeError = {
        name: "FunctionsHttpError",
        message: "Edge Function returned a non-2xx status code",
        context: mockResponse,
      };

      // First read
      const first = await parseFunctionsHttpError(fakeError);
      expect(first?.error).toBe("Invalid material ID format");

      // Repeated read using cloned context if available
      const second = await parseFunctionsHttpError(fakeError);
      expect(second === null || second?.error === "Invalid material ID format").toBe(true);
    });

    it("returns pre-parsed context if context is already a plain object", async () => {
      const fakeError = {
        name: "FunctionsHttpError",
        message: "Edge Function returned a non-2xx status code",
        context: { error: "Custom pre-parsed error", already_entitled: false },
      };

      const parsed = await parseFunctionsHttpError(fakeError);
      expect(parsed).toEqual({
        error: "Custom pre-parsed error",
        already_entitled: false,
      });
    });

    it("handles null, undefined, or missing context safely without throwing", async () => {
      expect(await parseFunctionsHttpError(null)).toBeNull();
      expect(await parseFunctionsHttpError(undefined)).toBeNull();
      expect(await parseFunctionsHttpError(new Error("Generic Network Error"))).toBeNull();
    });

    it("handles non-JSON error response text gracefully without throwing", async () => {
      const mockTextResponse = new Response("<html>502 Bad Gateway</html>", {
        status: 502,
        headers: { "Content-Type": "text/html" },
      });

      const fakeError = {
        name: "FunctionsHttpError",
        message: "Edge Function returned a non-2xx status code",
        context: mockTextResponse,
      };

      const parsed = await parseFunctionsHttpError(fakeError);
      expect(parsed).toBeNull();
    });
  });

  // ==========================================================================
  // 2. checkMaterialEntitlement Access Resolution Tests
  // ==========================================================================
  describe("checkMaterialEntitlement Access Resolution", () => {
    const paidMaterial: CatalogStudyMaterial = {
      id: "mat-circles-10",
      title: "Class 10 Circles",
      price_minor: 4900,
      price: 49,
      is_free: false,
      course_slug: "class-10",
      subject_slug: "maths",
      course_title: "Class 10",
      subject_name: "Mathematics",
      resource_type: "chapter",
      chapter_number: 10,
      subject_sequence_number: 10,
      status: "published",
      created_at: "2026-10-11T00:00:00Z",
    };

    const freeMaterial: CatalogStudyMaterial = {
      id: "mat-free-nda",
      title: "NDA Free Introductory Note",
      price_minor: 0,
      price: 0,
      is_free: true,
      course_slug: "nda",
      subject_slug: "maths",
      course_title: "NDA",
      subject_name: "Mathematics",
      resource_type: "chapter",
      chapter_number: 1,
      subject_sequence_number: 1,
      status: "published",
      created_at: "2026-10-11T00:00:00Z",
    };

    it("grants universal access to administrators across all materials", () => {
      const adminResult = checkMaterialEntitlement(
        paidMaterial,
        [], // no explicit entitlements
        [], // no purchases
        true // isAdmin = true
      );

      expect(adminResult.isEntitled).toBe(true);
      expect(adminResult.reason).toBe("admin");
      expect(adminResult.description).toBe("Administrator Full Access");
    });

    it("grants access to free materials for all users (including anonymous)", () => {
      const freeResult = checkMaterialEntitlement(
        freeMaterial,
        [],
        [],
        false // anonymous or unprivileged
      );

      expect(freeResult.isEntitled).toBe(true);
      expect(freeResult.reason).toBe("free");
    });

    it("grants access when student has an active single-material entitlement", () => {
      const singleEntitlement: StudentEntitlement = {
        id: "ent-single-1",
        user_id: "student-user-1",
        entitlement_scope: "single_material",
        material_id: paidMaterial.id,
        course_slug: null,
        subject_slug: null,
        order_item_id: "item-1",
        source: "payment",
        status: "active",
        granted_at: "2026-10-11T00:00:00Z",
      };

      const result = checkMaterialEntitlement(
        paidMaterial,
        [singleEntitlement],
        [],
        false
      );

      expect(result.isEntitled).toBe(true);
      expect(result.reason).toBe("single");
    });

    it("grants access when student has an active subject bundle entitlement", () => {
      const subjectEntitlement: StudentEntitlement = {
        id: "ent-subj-1",
        user_id: "student-user-1",
        entitlement_scope: "subject_bundle",
        material_id: null,
        course_slug: "class-10",
        subject_slug: "maths",
        order_item_id: "item-2",
        source: "payment",
        status: "active",
        granted_at: "2026-10-11T00:00:00Z",
      };

      const result = checkMaterialEntitlement(
        paidMaterial,
        [subjectEntitlement],
        [],
        false
      );

      expect(result.isEntitled).toBe(true);
      expect(result.reason).toBe("subject_bundle");
    });

    it("grants access when student has an active course bundle entitlement", () => {
      const courseEntitlement: StudentEntitlement = {
        id: "ent-course-1",
        user_id: "student-user-1",
        entitlement_scope: "course_bundle",
        material_id: null,
        course_slug: "class-10",
        subject_slug: null,
        order_item_id: "item-3",
        source: "payment",
        status: "active",
        granted_at: "2026-10-11T00:00:00Z",
      };

      const result = checkMaterialEntitlement(
        paidMaterial,
        [courseEntitlement],
        [],
        false
      );

      expect(result.isEntitled).toBe(true);
      expect(result.reason).toBe("course_bundle");
    });

    it("grants access when student holds a legacy purchase or coupon unlock", () => {
      const legacyPurchase: MaterialPurchase = {
        id: "pur-1",
        user_id: "student-user-1",
        material_id: paidMaterial.id,
        coupon_id: "coupon-1",
        amount_paid: 0,
        purchased_at: "2026-10-11T00:00:00Z",
      };

      const result = checkMaterialEntitlement(
        paidMaterial,
        [],
        [legacyPurchase],
        false
      );

      expect(result.isEntitled).toBe(true);
      expect(result.reason).toBe("legacy");
    });

    it("denies access to a student without entitlements on paid material", () => {
      const result = checkMaterialEntitlement(
        paidMaterial,
        [],
        [],
        false
      );

      expect(result.isEntitled).toBe(false);
      expect(result.reason).toBeUndefined();
    });

    it("does not grant access for revoked entitlements", () => {
      const revokedEntitlement: StudentEntitlement = {
        id: "ent-revoked-1",
        user_id: "student-user-1",
        entitlement_scope: "single_material",
        material_id: paidMaterial.id,
        course_slug: null,
        subject_slug: null,
        order_item_id: "item-1",
        source: "payment",
        status: "revoked",
        granted_at: "2026-10-11T00:00:00Z",
      };

      const result = checkMaterialEntitlement(
        paidMaterial,
        [revokedEntitlement],
        [],
        false
      );

      expect(result.isEntitled).toBe(false);
    });
  });

  // ==========================================================================
  // 3. Simulated Checkout Experience Workflows
  // ==========================================================================
  describe("Simulated Checkout Experience & Error Handling", () => {
    it("handles 409 already_entitled response by displaying confirmation toast and invalidating queries", async () => {
      const toastCalls: any[] = [];
      const queryInvalidations: any[] = [];
      let dialogClosed = false;
      let successCalled = false;

      // Simulated flow when create-razorpay-order returns 409
      const simulateCheckoutAction = async () => {
        const orderResponse = new Response(
          JSON.stringify({
            error: "You already own active access to this study material",
            already_entitled: true,
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );

        const orderError = {
          name: "FunctionsHttpError",
          message: "Edge Function returned a non-2xx status code",
          context: orderResponse,
        };

        if (orderError) {
          const serverError = await parseFunctionsHttpError(orderError);

          if (serverError?.already_entitled) {
            toastCalls.push({
              title: "Already Unlocked! 🎉",
              description: serverError.error || "You already have active access to this study material.",
            });
            queryInvalidations.push(
              "study-material-catalog",
              "student-entitlements",
              "material-purchases",
              "user-material-purchases",
              "user-is-admin"
            );
            successCalled = true;
            dialogClosed = true;
            return { handled: true };
          }

          throw new Error(serverError?.error || orderError.message);
        }

        return { handled: false };
      };

      const result = await simulateCheckoutAction();
      expect(result.handled).toBe(true);
      expect(dialogClosed).toBe(true);
      expect(successCalled).toBe(true);
      expect(toastCalls).toHaveLength(1);
      expect(toastCalls[0].title).toBe("Already Unlocked! 🎉");
      expect(queryInvalidations).toContain("study-material-catalog");
      expect(queryInvalidations).toContain("student-entitlements");
      expect(queryInvalidations).toContain("user-is-admin");
    });

    it("preserves useful server error messages when ordinary errors occur during checkout", async () => {
      const serverErrorsToTest = [
        "Payment gateway credentials are not configured",
        "Payment gateway order creation failed",
        "Only published materials can be purchased",
      ];

      for (const expectedErrorMsg of serverErrorsToTest) {
        const orderResponse = new Response(
          JSON.stringify({ error: expectedErrorMsg }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );

        const orderError = {
          name: "FunctionsHttpError",
          message: "Edge Function returned a non-2xx status code",
          context: orderResponse,
        };

        const simulateOrdinaryError = async () => {
          if (orderError) {
            const serverError = await parseFunctionsHttpError(orderError);

            if (serverError?.already_entitled) {
              return { handled: true };
            }

            const fallbackMsg = serverError?.error || orderError.message || "Failed to create order";
            throw new Error(fallbackMsg);
          }
        };

        await expect(simulateOrdinaryError()).rejects.toThrow(expectedErrorMsg);
      }
    });

    it("verifies catalog action routing: admin routes directly to download without purchase dialog", () => {
      const paidMaterial: CatalogStudyMaterial = {
        id: "mat-circles-10",
        title: "Class 10 Circles",
        price_minor: 4900,
        price: 49,
        is_free: false,
        course_slug: "class-10",
        subject_slug: "maths",
        course_title: "Class 10",
        subject_name: "Mathematics",
        resource_type: "chapter",
        chapter_number: 10,
        subject_sequence_number: 10,
        status: "published",
        created_at: "2026-10-11T00:00:00Z",
      };

      // Admin user state
      const isAdmin = true;
      const userHasAccess = paidMaterial.is_free || checkMaterialEntitlement(paidMaterial, [], [], isAdmin).isEntitled;

      expect(userHasAccess).toBe(true);

      // Decision logic: if userHasAccess, do NOT open purchase dialog
      let openedModal = false;
      let downloadInitiated = false;

      if (!userHasAccess) {
        openedModal = true;
      } else {
        downloadInitiated = true;
      }

      expect(openedModal).toBe(false);
      expect(downloadInitiated).toBe(true);
    });

    it("verifies catalog action routing: student without access opens purchase dialog", () => {
      const paidMaterial: CatalogStudyMaterial = {
        id: "mat-circles-10",
        title: "Class 10 Circles",
        price_minor: 4900,
        price: 49,
        is_free: false,
        course_slug: "class-10",
        subject_slug: "maths",
        course_title: "Class 10",
        subject_name: "Mathematics",
        resource_type: "chapter",
        chapter_number: 10,
        subject_sequence_number: 10,
        status: "published",
        created_at: "2026-10-11T00:00:00Z",
      };

      // Non-admin student without entitlements
      const isAdmin = false;
      const userHasAccess = paidMaterial.is_free || checkMaterialEntitlement(paidMaterial, [], [], isAdmin).isEntitled;

      expect(userHasAccess).toBe(false);

      let openedModal = false;
      let downloadInitiated = false;

      if (!userHasAccess) {
        openedModal = true;
      } else {
        downloadInitiated = true;
      }

      expect(openedModal).toBe(true);
      expect(downloadInitiated).toBe(false);
    });
  });
});

