import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CatalogStudyMaterial } from './useStudyMaterials';

import { useMaterialPurchases, MaterialPurchase } from './useMaterialPurchases';

export interface StudentEntitlement {
  id: string;
  user_id: string;
  entitlement_scope: 'single_material' | 'subject_bundle' | 'course_bundle';
  material_id: string | null;
  course_slug: string | null;
  subject_slug: string | null;
  order_item_id: string | null;
  source: 'payment' | 'admin_grant' | 'legacy_migration';
  status: 'active' | 'revoked';
  granted_at: string;
}

export interface StudentOrderItem {
  id: string;
  product_title: string;
  product_slug: string;
  quantity: number;
  unit_price_minor: number;
  currency: string;
}

export interface StudentPaymentAttempt {
  id: string;
  provider: string;
  provider_order_id: string | null;
  provider_payment_id: string | null;
  status: string;
  amount_minor: number;
  created_at: string;
}

export interface StudentOrder {
  id: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  currency: string;
  total_minor: number;
  created_at: string;
  paid_at: string | null;
  order_items: StudentOrderItem[];
  payment_attempts: StudentPaymentAttempt[];
}

export type EntitlementReason =
  | 'single'
  | 'subject_bundle'
  | 'course_bundle'
  | 'legacy'
  | 'free'
  | 'admin';

export interface EntitlementCheckResult {
  isEntitled: boolean;
  reason?: EntitlementReason;
  description?: string;
}

/**
 * Hook to retrieve all active entitlements for the authenticated student.
 */
export const useStudentEntitlements = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-entitlements', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('material_entitlements')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('granted_at', { ascending: false });

      if (error) throw error;
      return (data || []) as StudentEntitlement[];
    },
    enabled: !!user,
  });
};

/**
 * Hook to retrieve purchase/order history for the authenticated student.
 */
export const useStudentOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          currency,
          total_minor,
          created_at,
          paid_at,
          order_items (
            id,
            product_title,
            product_slug,
            quantity,
            unit_price_minor,
            currency
          ),
          payment_attempts (
            id,
            provider,
            provider_order_id,
            provider_payment_id,
            status,
            amount_minor,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as StudentOrder[];
    },
    enabled: !!user,
  });
};

/**
 * Hook to check whether the authenticated user has the 'admin' role.
 */
export const useIsAdmin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-is-admin', user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) return false;
      return !!data;
    },
    enabled: !!user,
  });
};

/**
 * Checks whether a student or administrator has access to a given study material based on
 * admin role, single entitlement, subject bundle, course bundle, legacy purchase, or free status.
 */
export const checkMaterialEntitlement = (
  material: {
    id?: string;
    is_free?: boolean;
    course_slug?: string | null;
    subject_slug?: string | null;
  },
  entitlements: StudentEntitlement[] = [],
  legacyPurchases: { material_id: string }[] = [],
  isAdmin: boolean = false,
  options?: { forLibraryOnly?: boolean }
): EntitlementCheckResult => {
  // 1. Direct single-material entitlement (paid purchase or unlocked free chapter)
  if (material.id) {
    const singleEntitlement = entitlements.find(
      (e) =>
        e.status === 'active' &&
        e.entitlement_scope === 'single_material' &&
        e.material_id === material.id
    );
    if (singleEntitlement) {
      return {
        isEntitled: true,
        reason: 'single',
        description: 'Single Note Access',
      };
    }
  }

  // 2. Subject bundle entitlement
  if (material.course_slug && material.subject_slug) {
    const subjectEntitlement = entitlements.find(
      (e) =>
        e.status === 'active' &&
        e.entitlement_scope === 'subject_bundle' &&
        e.course_slug === material.course_slug &&
        e.subject_slug === material.subject_slug
    );
    if (subjectEntitlement) {
      return {
        isEntitled: true,
        reason: 'subject_bundle',
        description: `Subject Pass (${material.subject_slug.toUpperCase()})`,
      };
    }
  }

  // 3. Course bundle entitlement
  if (material.course_slug) {
    const courseEntitlement = entitlements.find(
      (e) =>
        e.status === 'active' &&
        e.entitlement_scope === 'course_bundle' &&
        e.course_slug === material.course_slug
    );
    if (courseEntitlement) {
      return {
        isEntitled: true,
        reason: 'course_bundle',
        description: `Full Course Pass (${material.course_slug.toUpperCase()})`,
      };
    }
  }

  // 4. Legacy purchase / coupon compatibility
  if (material.id) {
    const legacy = legacyPurchases.find((p) => p.material_id === material.id);
    if (legacy) {
      return {
        isEntitled: true,
        reason: 'legacy',
        description: 'Legacy / Coupon Access',
      };
    }
  }

  // 5. Administrators have universal preview & download access across all materials
  if (isAdmin) {
    return {
      isEntitled: true,
      reason: 'admin',
      description: 'Administrator Full Access',
    };
  }

  // 6. Free materials: available to download, but only in personal library if student unlocked it
  if (material.is_free) {
    if (options?.forLibraryOnly) {
      return {
        isEntitled: false,
        reason: 'free',
        description: 'Free Chapter (Not Yet Added to Library)',
      };
    }
    return {
      isEntitled: true,
      reason: 'free',
      description: 'Free Chapter Note',
    };
  }

  return { isEntitled: false };
};

/**
 * Idempotently records an unlocked free chapter in the student's personal library.
 */
export async function unlockFreeMaterial(
  materialId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_material_purchases')
      .upsert(
        {
          user_id: userId,
          material_id: materialId,
          amount_paid: 0,
        },
        { onConflict: 'user_id,material_id' }
      );

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Error unlocking free material:', err);
    return { success: false, error: err.message || 'Failed to unlock material' };
  }
}

/**
 * Unified hook combining authentication, admin role, student entitlements,
 * and legacy purchases to determine user access to study materials.
 */
export const useUserMaterialAccess = () => {
  const { user } = useAuth();
  const { data: isAdmin = false, isLoading: adminLoading } = useIsAdmin();
  const { data: entitlements = [], isLoading: entitlementsLoading } = useStudentEntitlements();
  const { data: purchases = [], isLoading: purchasesLoading } = useMaterialPurchases();

  const checkAccess = (material: {
    id?: string;
    is_free?: boolean;
    course_slug?: string | null;
    subject_slug?: string | null;
  }): EntitlementCheckResult => {
    return checkMaterialEntitlement(material, entitlements, purchases, isAdmin);
  };

  const hasAccess = (material: {
    id?: string;
    is_free?: boolean;
    course_slug?: string | null;
    subject_slug?: string | null;
  }): boolean => {
    return checkAccess(material).isEntitled;
  };

  return {
    user,
    isAdmin,
    entitlements,
    purchases,
    hasAccess,
    checkAccess,
    isLoading: adminLoading || entitlementsLoading || purchasesLoading,
  };
};

