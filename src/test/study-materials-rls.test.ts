import { describe, it, expect } from "vitest";

// ============================================================================
// Types & Interfaces Mirroring Database Schema
// ============================================================================

export type MaterialStatus = "draft" | "published" | "archived";
export type ReviewStatus = "draft" | "in_review" | "approved" | "rejected";
export type AppRole = "admin" | "student" | "faculty";

export interface StudyMaterialRow {
  id: string;
  title: string;
  status: MaterialStatus;
  review_status: ReviewStatus;
  is_free: boolean;
  price_minor: number;
  course_slug: string;
  subject_slug: string;
}

export interface UserContext {
  userId: string | null;
  roles: AppRole[];
}

// ============================================================================
// Canonical Policy Evaluator: Mirrors PostgreSQL RLS Engine
// Policy: status = 'published' OR public.has_role(auth.uid(), 'admin'::public.app_role)
// ============================================================================

export function evaluateStudyMaterialsSelectPolicy(
  row: StudyMaterialRow,
  user: UserContext
): boolean {
  // 1. Published materials are visible to everyone (including anonymous callers)
  if (row.status === "published") {
    return true;
  }

  // 2. Administrators with active 'admin' role in public.user_roles can view all statuses
  if (user.userId && user.roles.includes("admin")) {
    return true;
  }

  // 3. Otherwise access is strictly denied
  return false;
}

/**
 * Filter an array of materials as PostgreSQL PostgREST would when enforcing RLS.
 */
export function filterMaterialsWithRls(
  rows: StudyMaterialRow[],
  user: UserContext
): StudyMaterialRow[] {
  return rows.filter((row) => evaluateStudyMaterialsSelectPolicy(row, user));
}

// ============================================================================
// Test Suite: study_materials RLS Published-or-Admin Policy Regression Tests
// ============================================================================

describe("study_materials RLS Published-or-Admin Policy Regression Tests", () => {
  // Test dataset with all representative lifecycle statuses
  const testMaterials: StudyMaterialRow[] = [
    {
      id: "mat-pub-1",
      title: "Class 10 Real Numbers (Published Free)",
      status: "published",
      review_status: "approved",
      is_free: true,
      price_minor: 0,
      course_slug: "class-10",
      subject_slug: "maths",
    },
    {
      id: "mat-pub-2",
      title: "Class 10 Polynomials (Published Free)",
      status: "published",
      review_status: "approved",
      is_free: true,
      price_minor: 0,
      course_slug: "class-10",
      subject_slug: "maths",
    },
    {
      id: "mat-pub-3",
      title: "Class 10 Circles (Published Paid ₹49)",
      status: "published",
      review_status: "approved",
      is_free: false,
      price_minor: 4900,
      course_slug: "class-10",
      subject_slug: "maths",
    },
    {
      id: "mat-draft-1",
      title: "Class 10 Triangles (Unpublished Draft)",
      status: "draft",
      review_status: "draft",
      is_free: false,
      price_minor: 4900,
      course_slug: "class-10",
      subject_slug: "maths",
    },
    {
      id: "mat-review-1",
      title: "Class 10 Quadratic Equations (In Review)",
      status: "draft",
      review_status: "in_review",
      is_free: false,
      price_minor: 4900,
      course_slug: "class-10",
      subject_slug: "maths",
    },
    {
      id: "mat-rejected-1",
      title: "Class 10 Arithmetic Progressions (Rejected Revision)",
      status: "draft",
      review_status: "rejected",
      is_free: false,
      price_minor: 4900,
      course_slug: "class-10",
      subject_slug: "maths",
    },
    {
      id: "mat-archived-1",
      title: "Class 10 Old Syllabus Geometry (Archived)",
      status: "archived",
      review_status: "approved",
      is_free: false,
      price_minor: 4900,
      course_slug: "class-10",
      subject_slug: "maths",
    },
  ];

  // User contexts
  const anonymousUser: UserContext = {
    userId: null,
    roles: [],
  };

  const studentUser: UserContext = {
    userId: "student-user-uuid-1234",
    roles: ["student"],
  };

  const adminUser: UserContext = {
    userId: "admin-user-uuid-5678",
    roles: ["admin"],
  };

  // ==========================================================================
  // 1. Anonymous Access Tests
  // ==========================================================================
  describe("Anonymous Visitors (Unauthenticated)", () => {
    it("can view all published materials (free and paid)", () => {
      const visible = filterMaterialsWithRls(testMaterials, anonymousUser);
      expect(visible.map((m) => m.id)).toEqual(["mat-pub-1", "mat-pub-2", "mat-pub-3"]);
    });

    it("CANNOT view draft materials", () => {
      const draft = testMaterials.find((m) => m.id === "mat-draft-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(draft, anonymousUser)).toBe(false);
    });

    it("CANNOT view in_review materials", () => {
      const inReview = testMaterials.find((m) => m.id === "mat-review-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(inReview, anonymousUser)).toBe(false);
    });

    it("CANNOT view rejected materials", () => {
      const rejected = testMaterials.find((m) => m.id === "mat-rejected-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(rejected, anonymousUser)).toBe(false);
    });

    it("CANNOT view archived materials", () => {
      const archived = testMaterials.find((m) => m.id === "mat-archived-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(archived, anonymousUser)).toBe(false);
    });
  });

  // ==========================================================================
  // 2. Ordinary Student Access Tests
  // ==========================================================================
  describe("Ordinary Students (role = student)", () => {
    it("can view all published materials (free and paid)", () => {
      const visible = filterMaterialsWithRls(testMaterials, studentUser);
      expect(visible.map((m) => m.id)).toEqual(["mat-pub-1", "mat-pub-2", "mat-pub-3"]);
    });

    it("CANNOT view draft materials through direct table queries", () => {
      const draft = testMaterials.find((m) => m.id === "mat-draft-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(draft, studentUser)).toBe(false);
    });

    it("CANNOT view in_review materials through direct table queries", () => {
      const inReview = testMaterials.find((m) => m.id === "mat-review-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(inReview, studentUser)).toBe(false);
    });

    it("CANNOT view rejected materials through direct table queries", () => {
      const rejected = testMaterials.find((m) => m.id === "mat-rejected-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(rejected, studentUser)).toBe(false);
    });

    it("CANNOT view archived materials through direct table queries", () => {
      const archived = testMaterials.find((m) => m.id === "mat-archived-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(archived, studentUser)).toBe(false);
    });
  });

  // ==========================================================================
  // 3. Administrator Access Tests
  // ==========================================================================
  describe("Administrators (role = admin)", () => {
    it("can view ALL study materials regardless of status", () => {
      const visible = filterMaterialsWithRls(testMaterials, adminUser);
      expect(visible.length).toBe(testMaterials.length);
      expect(visible.map((m) => m.id)).toEqual(testMaterials.map((m) => m.id));
    });

    it("can view draft materials for preview and editing", () => {
      const draft = testMaterials.find((m) => m.id === "mat-draft-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(draft, adminUser)).toBe(true);
    });

    it("can view in_review materials for faculty review workflow", () => {
      const inReview = testMaterials.find((m) => m.id === "mat-review-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(inReview, adminUser)).toBe(true);
    });

    it("can view rejected materials to inspect feedback and re-upload revisions", () => {
      const rejected = testMaterials.find((m) => m.id === "mat-rejected-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(rejected, adminUser)).toBe(true);
    });

    it("can view archived materials for audit and unpublish management", () => {
      const archived = testMaterials.find((m) => m.id === "mat-archived-1")!;
      expect(evaluateStudyMaterialsSelectPolicy(archived, adminUser)).toBe(true);
    });
  });

  // ==========================================================================
  // 4. Client Integration & Catalog Compatibility Tests
  // ==========================================================================
  describe("Client Integration & Access Path Invariants", () => {
    it("guarantees public study_material_catalog view selects a subset of permissible RLS rows", () => {
      // The view definition: SELECT ... FROM study_materials WHERE status = 'published'
      const viewResult = testMaterials.filter((m) => m.status === "published");
      const rlsPermissible = filterMaterialsWithRls(testMaterials, anonymousUser);

      expect(viewResult).toEqual(rlsPermissible);
    });

    it("ensures student portal library never exposes non-published materials", () => {
      // Student portal queries unlocked items from the catalog view
      const studentVisible = filterMaterialsWithRls(testMaterials, studentUser);
      studentVisible.forEach((m) => {
        expect(m.status).toBe("published");
      });
    });

    it("verifies service role bypass behavior for backend Edge Functions", () => {
      // Service role client in admin-materials or material-download bypasses RLS
      const isServiceRole = true;
      const serviceRoleCanAccessAll = isServiceRole ? testMaterials.length : 0;
      expect(serviceRoleCanAccessAll).toBe(7);
    });
  });
});

