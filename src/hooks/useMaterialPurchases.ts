import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MaterialPurchase {
  id: string;
  user_id: string;
  material_id: string;
  coupon_id: string | null;
  amount_paid: number;
  purchased_at: string;
}

export const useMaterialPurchases = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['material-purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_material_purchases')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as MaterialPurchase[];
    },
    enabled: !!user,
  });
};

export const useRedeemCoupon = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ code, materialId }: { code: string; materialId: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase.rpc('redeem_coupon', {
        _code: code.toUpperCase().trim(),
        _material_id: materialId,
        _user_id: user.id,
      });
      
      if (error) throw error;
      
      const result = data as { success: boolean; error?: string; discount?: number; amount_paid?: number };
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to redeem coupon');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['material-purchases'] });
    },
  });
};
