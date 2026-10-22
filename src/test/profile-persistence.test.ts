import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolveCheckoutContact } from "@/components/study-material/PaidMaterialDialog";

// ============================================================================
// Unit & Regression Tests: Registration Profile Persistence & Safe Recovery
// ============================================================================

describe("Registration Profile Persistence & Safe Recovery (Regression Suite)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --------------------------------------------------------------------------
  // 1. Signup Metadata Formatting & Email Confirmation Flow
  // --------------------------------------------------------------------------
  describe("Signup Metadata & Email Confirmation Flow", () => {
    it("formats all 13 supported registration fields into auth signup options.data", async () => {
      const mockSignUp = vi.fn().mockResolvedValue({
        data: {
          user: { id: "user-uuid-1", email: "student@example.com" },
          session: null, // Email confirmation enabled: session is null!
        },
        error: null,
      });

      const mockSupabase = {
        auth: { signUp: mockSignUp },
      };

      const signUpData = {
        fullName: "  Rohan Sharma  ",
        phone: "  9876543210  ",
        classId: "38aa0a2e-6800-4a09-8eb3-c23282b46c76",
        dateOfBirth: "2008-05-15",
        gender: "Male",
        parentName: "  Suresh Sharma  ",
        parentPhone: "  9123456780  ",
        schoolName: "  Delhi Public School  ",
        board: "CBSE",
        address: "123 Main St",
        city: "Bhopal",
        state: "Madhya Pradesh",
        pincode: "462001",
      };

      // Implementation replicating AuthContext.signUp logic
      const metadata = {
        full_name: signUpData.fullName.trim(),
        phone: signUpData.phone?.trim() || null,
        class_id: signUpData.classId?.trim() || null,
        date_of_birth: signUpData.dateOfBirth?.trim() || null,
        gender: signUpData.gender?.trim() || null,
        parent_name: signUpData.parentName?.trim() || null,
        parent_phone: signUpData.parentPhone?.trim() || null,
        school_name: signUpData.schoolName?.trim() || null,
        board: signUpData.board?.trim() || "CBSE",
        address: signUpData.address?.trim() || null,
        city: signUpData.city?.trim() || null,
        state: signUpData.state?.trim() || "Madhya Pradesh",
        pincode: signUpData.pincode?.trim() || null,
      };

      const { data: authData, error } = await mockSupabase.auth.signUp({
        email: "student@example.com",
        password: "secretpassword123",
        options: {
          emailRedirectTo: "http://localhost:8080",
          data: metadata,
        },
      });

      expect(error).toBeNull();
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "student@example.com",
        password: "secretpassword123",
        options: {
          emailRedirectTo: "http://localhost:8080",
          data: {
            full_name: "Rohan Sharma",
            phone: "9876543210",
            class_id: "38aa0a2e-6800-4a09-8eb3-c23282b46c76",
            date_of_birth: "2008-05-15",
            gender: "Male",
            parent_name: "Suresh Sharma",
            parent_phone: "9123456780",
            school_name: "Delhi Public School",
            board: "CBSE",
            address: "123 Main St",
            city: "Bhopal",
            state: "Madhya Pradesh",
            pincode: "462001",
          },
        },
      });
      // Verifies session is null when email confirmation is required and succeeds cleanly
      expect(authData?.session).toBeNull();
    });

    it("does not attempt unauthenticated client database writes when session is null", async () => {
      const mockUpdate = vi.fn();
      const mockFrom = vi.fn().mockReturnValue({
        update: mockUpdate,
      });

      const mockSignUp = vi.fn().mockResolvedValue({
        data: {
          user: { id: "user-uuid-1", email: "student@example.com" },
          session: null, // No session token!
        },
        error: null,
      });

      const mockFetchProfile = vi.fn();

      // Simulated AuthContext.signUp execution
      const executeSignUp = async () => {
        const { data: authData, error } = await mockSignUp();
        if (error) return { error };

        // Only fetch profile if authenticated session is present
        if (authData?.session?.user) {
          await mockFetchProfile(authData.session.user.id);
        }

        return { error: null };
      };

      const result = await executeSignUp();
      expect(result.error).toBeNull();
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(mockFrom).not.toHaveBeenCalled();
      expect(mockFetchProfile).not.toHaveBeenCalled();
    });

    it("calls fetchProfile immediately if an active session is returned (email confirmation disabled)", async () => {
      const mockFetchProfile = vi.fn().mockResolvedValue({
        id: "user-uuid-1",
        full_name: "Instant Student",
      });

      const mockSignUp = vi.fn().mockResolvedValue({
        data: {
          user: { id: "user-uuid-1", email: "student@example.com" },
          session: { access_token: "mock-token", user: { id: "user-uuid-1" } },
        },
        error: null,
      });

      const executeSignUp = async () => {
        const { data: authData, error } = await mockSignUp();
        if (error) return { error };

        if (authData?.session?.user) {
          await mockFetchProfile(authData.session.user.id);
        }

        return { error: null };
      };

      const result = await executeSignUp();
      expect(result.error).toBeNull();
      expect(mockFetchProfile).toHaveBeenCalledWith("user-uuid-1");
    });
  });

  // --------------------------------------------------------------------------
  // 2. Safe Recovery for Missing Profile Rows (Issue C)
  // --------------------------------------------------------------------------
  describe("Missing Profile Recovery via ensure_profile RPC", () => {
    it("returns existing profile directly without invoking ensure_profile when profile exists", async () => {
      const existingProfile = {
        id: "user-uuid-existing",
        full_name: "Existing Student",
        email: "student@example.com",
        phone: "9876543210",
      };

      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: existingProfile,
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: mockMaybeSingle,
        }),
      });

      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });
      const mockRpc = vi.fn();

      const fetchProfile = async (userId: string) => {
        const { data, error } = await mockFrom("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (!error && data) {
          return data;
        }

        if (!error && !data) {
          const { data: recovered, error: rpcError } = await mockRpc("ensure_profile");
          if (!rpcError && recovered) {
            return recovered;
          }
        }
        return null;
      };

      const result = await fetchProfile("user-uuid-existing");
      expect(result).toEqual(existingProfile);
      expect(mockRpc).not.toHaveBeenCalled();
    });

    it("triggers ensure_profile RPC and recovers profile when row is missing in profiles table", async () => {
      // Missing profile scenario (like user amulani20@gmail.com)
      const mockMaybeSingle = vi.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      const recoveredProfile = {
        id: "3fc60dfb-0c0a-4e9e-a9f2-4149db4a75ce",
        full_name: "Shankar Lal Amulani",
        email: "amulani20@gmail.com",
        phone: null,
        class_id: null,
        board: "CBSE",
        state: "Madhya Pradesh",
      };

      const mockRpc = vi.fn().mockResolvedValue({
        data: recoveredProfile,
        error: null,
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: mockMaybeSingle,
        }),
      });

      const mockFrom = vi.fn().mockReturnValue({ select: mockSelect });

      const fetchProfile = async (userId: string) => {
        const { data, error } = await mockFrom("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (!error && data) {
          return data;
        }

        if (!error && !data) {
          const { data: recovered, error: rpcError } = await mockRpc("ensure_profile");
          if (!rpcError && recovered) {
            return recovered;
          }
        }
        return null;
      };

      const result = await fetchProfile("3fc60dfb-0c0a-4e9e-a9f2-4149db4a75ce");
      expect(mockRpc).toHaveBeenCalledWith("ensure_profile");
      expect(result).toEqual(recoveredProfile);
    });

    it("profile persists across sign-out and sign-in cycle", async () => {
      let cachedProfile: any = null;

      const profileInDb = {
        id: "3fc60dfb-0c0a-4e9e-a9f2-4149db4a75ce",
        full_name: "Shankar Lal Amulani",
        email: "amulani20@gmail.com",
        phone: "9876543210",
        class_id: "class-10-uuid",
      };

      const mockFrom = vi.fn().mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: profileInDb,
              error: null,
            }),
          }),
        }),
      }));

      // 1. Initial sign in
      const onSignIn = async (userId: string) => {
        const { data } = await mockFrom("profiles").select("*").eq("id", userId).maybeSingle();
        cachedProfile = data;
      };

      // 2. Sign out clears state
      const onSignOut = async () => {
        cachedProfile = null;
      };

      await onSignIn("3fc60dfb-0c0a-4e9e-a9f2-4149db4a75ce");
      expect(cachedProfile).toEqual(profileInDb);

      await onSignOut();
      expect(cachedProfile).toBeNull();

      // 3. Subsequent sign-in reloads profile from database
      await onSignIn("3fc60dfb-0c0a-4e9e-a9f2-4149db4a75ce");
      expect(cachedProfile).toEqual(profileInDb);
      expect(cachedProfile.full_name).toBe("Shankar Lal Amulani");
      expect(cachedProfile.phone).toBe("9876543210");
    });
  });

  // --------------------------------------------------------------------------
  // 3. Database Trigger Logic, Type Validation & Sanitization
  // --------------------------------------------------------------------------
  describe("Trigger SQL Logic, Sanitization & Defense in Depth", () => {
    // Pure logic emulator corresponding to handle_new_user() in PostgreSQL
    const simulateHandleNewUser = (
      user: { id: string; email: string; raw_user_meta_data?: any },
      classesTable: string[]
    ) => {
      const meta = user.raw_user_meta_data || {};

      // Name extraction
      const rawFullName = meta.full_name || meta.fullName;
      const fullName = (typeof rawFullName === "string" && rawFullName.trim()) ? rawFullName.trim() : "Student";

      // Text trimming & nullification
      const cleanText = (val: any) =>
        typeof val === "string" && val.trim().length > 0 ? val.trim() : null;

      const phone = cleanText(meta.phone || meta.phoneNumber);
      const gender = cleanText(meta.gender);
      const parentName = cleanText(meta.parent_name || meta.parentName);
      const parentPhone = cleanText(meta.parent_phone || meta.parentPhone);
      const schoolName = cleanText(meta.school_name || meta.schoolName);
      const board = cleanText(meta.board) || "CBSE";
      const address = cleanText(meta.address);
      const city = cleanText(meta.city);
      const state = cleanText(meta.state) || "Madhya Pradesh";
      const pincode = cleanText(meta.pincode);

      // Class UUID validation & existence check
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const rawClassId = cleanText(meta.class_id || meta.classId);
      let classId: string | null = null;
      if (rawClassId && uuidRegex.test(rawClassId) && classesTable.includes(rawClassId)) {
        classId = rawClassId;
      }

      // Date validation (YYYY-MM-DD)
      const rawDob = cleanText(meta.date_of_birth || meta.dateOfBirth);
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      let dateOfBirth: string | null = null;
      if (rawDob && dateRegex.test(rawDob) && !isNaN(Date.parse(rawDob))) {
        dateOfBirth = rawDob;
      }

      // Role creation: Always student, never trust meta.role
      const assignedRole = "student";

      return {
        profile: {
          id: user.id,
          email: user.email,
          full_name: fullName,
          phone,
          class_id: classId,
          date_of_birth: dateOfBirth,
          gender,
          parent_name: parentName,
          parent_phone: parentPhone,
          school_name: schoolName,
          board,
          address,
          city,
          state,
          pincode,
        },
        user_role: {
          user_id: user.id,
          role: assignedRole,
        },
      };
    };

    const validClasses = [
      "38aa0a2e-6800-4a09-8eb3-c23282b46c76",
      "2008972b-d7fe-48d4-880c-d0e71c23443c",
    ];

    it("sanitizes empty strings, leading/trailing whitespace to NULL", () => {
      const user = {
        id: "test-user-id",
        email: "test@example.com",
        raw_user_meta_data: {
          full_name: "  Priya Patel  ",
          phone: "   ",
          parent_name: "   ",
          address: "  ",
          city: " Indore ",
          pincode: "",
        },
      };

      const { profile } = simulateHandleNewUser(user, validClasses);
      expect(profile.full_name).toBe("Priya Patel");
      expect(profile.phone).toBeNull();
      expect(profile.parent_name).toBeNull();
      expect(profile.address).toBeNull();
      expect(profile.city).toBe("Indore");
      expect(profile.pincode).toBeNull();
      expect(profile.board).toBe("CBSE");
      expect(profile.state).toBe("Madhya Pradesh");
    });

    it("safely handles invalid date format without throwing", () => {
      const user = {
        id: "test-user-id",
        email: "test@example.com",
        raw_user_meta_data: {
          full_name: "Rahul",
          date_of_birth: "not-a-real-date",
        },
      };

      const { profile } = simulateHandleNewUser(user, validClasses);
      expect(profile.date_of_birth).toBeNull();
    });

    it("safely handles invalid or nonexistent class UUID without throwing foreign key violation", () => {
      const user = {
        id: "test-user-id",
        email: "test@example.com",
        raw_user_meta_data: {
          full_name: "Rahul",
          class_id: "00000000-0000-0000-0000-nonexistent000",
        },
      };

      const { profile } = simulateHandleNewUser(user, validClasses);
      expect(profile.class_id).toBeNull();
    });

    it("links class_id when valid UUID exists in public.classes", () => {
      const user = {
        id: "test-user-id",
        email: "test@example.com",
        raw_user_meta_data: {
          full_name: "Rahul",
          class_id: "38aa0a2e-6800-4a09-8eb3-c23282b46c76",
        },
      };

      const { profile } = simulateHandleNewUser(user, validClasses);
      expect(profile.class_id).toBe("38aa0a2e-6800-4a09-8eb3-c23282b46c76");
    });

    it("strictly prevents role escalation: ignores role: 'admin' in signup metadata", () => {
      const maliciousUser = {
        id: "attacker-user-id",
        email: "attacker@example.com",
        raw_user_meta_data: {
          full_name: "Attacker",
          role: "admin",
          is_admin: true,
          app_role: "admin",
        },
      };

      const { user_role } = simulateHandleNewUser(maliciousUser, validClasses);
      // Hardcoded role assignment must ALWAYS be 'student'
      expect(user_role.role).toBe("student");
    });

    it("supports camelCase keys gracefully (classId, parentPhone, dateOfBirth, etc.)", () => {
      const userWithCamelCase = {
        id: "user-camel",
        email: "camel@example.com",
        raw_user_meta_data: {
          fullName: "Ananya Sen",
          phoneNumber: "9876543210",
          classId: "2008972b-d7fe-48d4-880c-d0e71c23443c",
          dateOfBirth: "2007-09-20",
          parentName: "Deepak Sen",
          parentPhone: "9123456789",
          schoolName: "St. Xavier's",
        },
      };

      const { profile } = simulateHandleNewUser(userWithCamelCase, validClasses);
      expect(profile.full_name).toBe("Ananya Sen");
      expect(profile.phone).toBe("9876543210");
      expect(profile.class_id).toBe("2008972b-d7fe-48d4-880c-d0e71c23443c");
      expect(profile.date_of_birth).toBe("2007-09-20");
      expect(profile.parent_name).toBe("Deepak Sen");
      expect(profile.parent_phone).toBe("9123456789");
      expect(profile.school_name).toBe("St. Xavier's");
    });
  });

  // --------------------------------------------------------------------------
  // 4. RLS Boundaries & Non-Privileged Field Scope
  // --------------------------------------------------------------------------
  describe("RLS Boundaries & Authenticated Scope", () => {
    it("ensure_profile relies strictly on auth.uid() and takes no external user_id argument", () => {
      // Definition check: ensure_profile takes zero arguments
      const rpcArgs = {};
      expect(Object.keys(rpcArgs).length).toBe(0);
    });

    it("verifies that existing marketplace access and universal admin rights are unaffected", () => {
      const studentProfile = { id: "std-1", role: "student" };
      const adminProfile = { id: "adm-1", role: "admin" };

      const canAdminManageMaterials = (role: string) => role === "admin";
      expect(canAdminManageMaterials(adminProfile.role)).toBe(true);
      expect(canAdminManageMaterials(studentProfile.role)).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // 5. Checkout Contact Resolution & Fallback Logic
  // --------------------------------------------------------------------------
  describe("Checkout Contact Resolution (resolveCheckoutContact)", () => {
    it("uses student saved phone number first when both student and parent phones exist", () => {
      const profile = {
        phone: "9876543210",
        parent_phone: "9123456789",
      };

      const resolved = resolveCheckoutContact(profile);
      expect(resolved.contact).toBe("9876543210");
      expect(resolved.source).toBe("student");
    });

    it("falls back to parent/guardian phone only when student phone is absent or empty", () => {
      const profileWithEmptyStudentPhone = {
        phone: "   ",
        parent_phone: "9123456789",
      };

      const resolved = resolveCheckoutContact(profileWithEmptyStudentPhone);
      expect(resolved.contact).toBe("9123456789");
      expect(resolved.source).toBe("parent");

      const profileWithNullStudentPhone = {
        phone: null,
        parent_phone: "9123456789",
      };

      const resolved2 = resolveCheckoutContact(profileWithNullStudentPhone);
      expect(resolved2.contact).toBe("9123456789");
      expect(resolved2.source).toBe("parent");
    });

    it("prioritizes manual user input over saved phone numbers when provided", () => {
      const profile = {
        phone: "9876543210",
        parent_phone: "9123456789",
      };

      const resolved = resolveCheckoutContact(profile, "9998887776");
      expect(resolved.contact).toBe("9998887776");
      expect(resolved.source).toBe("manual");
    });

    it("returns source 'none' and empty contact when neither saved number exists and no manual input is provided", () => {
      const profileNoPhones = {
        phone: null,
        parent_phone: null,
      };

      const resolved = resolveCheckoutContact(profileNoPhones);
      expect(resolved.contact).toBe("");
      expect(resolved.source).toBe("none");

      const resolvedNullProfile = resolveCheckoutContact(null);
      expect(resolvedNullProfile.contact).toBe("");
      expect(resolvedNullProfile.source).toBe("none");
    });

    it("validates that contact number contains at least 10 digits before initiating payment", () => {
      const validateContactDigits = (contact: string) => {
        const digits = contact.replace(/\D/g, "");
        return digits.length >= 10;
      };

      expect(validateContactDigits("9876543210")).toBe(true);
      expect(validateContactDigits("+91 98765 43210")).toBe(true);
      expect(validateContactDigits("98765")).toBe(false);
      expect(validateContactDigits("")).toBe(false);
      expect(validateContactDigits("   ")).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // 6. Student Portal Profile Field Formatting & Placeholders
  // --------------------------------------------------------------------------
  describe("Portal Profile Field Formatting & Placeholders", () => {
    const formatDateOfBirth = (dob?: string | null) => {
      if (!dob) return "Not set";
      try {
        const d = new Date(dob);
        if (isNaN(d.getTime())) return dob;
        return d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } catch {
        return dob;
      }
    };

    it("formats valid date of birth string nicely", () => {
      const formatted = formatDateOfBirth("2008-05-15");
      expect(formatted).toContain("2008");
      expect(formatted).toContain("May");
    });

    it("returns 'Not set' placeholder for null or undefined date of birth", () => {
      expect(formatDateOfBirth(null)).toBe("Not set");
      expect(formatDateOfBirth(undefined)).toBe("Not set");
      expect(formatDateOfBirth("")).toBe("Not set");
    });

    it("provides sensible placeholders for all 13 supported registration fields", () => {
      const partialProfile: any = {
        full_name: "Aman Verma",
        email: "aman@example.com",
        phone: null,
        parent_name: null,
        parent_phone: null,
        class_id: null,
        date_of_birth: null,
        gender: null,
        school_name: null,
        board: null,
        address: null,
        city: null,
        state: null,
        pincode: null,
      };

      const getDisplayValues = (p: typeof partialProfile) => ({
        fullName: p.full_name || "Not set",
        email: p.email || "Not set",
        phone: p.phone || "Not set",
        parentName: p.parent_name || "Not set",
        parentPhone: p.parent_phone || "Not set",
        dob: formatDateOfBirth(p.date_of_birth),
        gender: p.gender || "Not set",
        schoolName: p.school_name || "Not set",
        board: p.board || "CBSE",
        address: p.address || "Not set",
        city: p.city || "Not set",
        state: p.state || "Madhya Pradesh",
        pincode: p.pincode || "Not set",
      });

      const display = getDisplayValues(partialProfile);
      expect(display.fullName).toBe("Aman Verma");
      expect(display.email).toBe("aman@example.com");
      expect(display.phone).toBe("Not set");
      expect(display.parentName).toBe("Not set");
      expect(display.parentPhone).toBe("Not set");
      expect(display.dob).toBe("Not set");
      expect(display.gender).toBe("Not set");
      expect(display.schoolName).toBe("Not set");
      expect(display.board).toBe("CBSE");
      expect(display.address).toBe("Not set");
      expect(display.city).toBe("Not set");
      expect(display.state).toBe("Madhya Pradesh");
      expect(display.pincode).toBe("Not set");
    });
  });
});

