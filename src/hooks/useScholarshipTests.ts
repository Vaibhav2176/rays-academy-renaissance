import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ScholarshipTest {
  id: string;
  class_id: string | null;
  title: string;
  description: string | null;
  duration_minutes: number;
  test_type: 'online' | 'offline';
  is_active: boolean;
  test_date: string | null;
  created_at: string;
}

export interface TestRegistration {
  id: string;
  student_id: string;
  test_id: string;
  registered_at: string;
}

export const useScholarshipTests = () => {
  return useQuery({
    queryKey: ['scholarship-tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scholarship_tests')
        .select('*')
        .eq('is_active', true)
        .order('test_date', { ascending: true });
      
      if (error) throw error;
      return data as ScholarshipTest[];
    },
  });
};

export const useTestRegistrations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['test-registrations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('test_registrations')
        .select('*')
        .eq('student_id', user.id);
      
      if (error) throw error;
      return data as TestRegistration[];
    },
    enabled: !!user,
  });
};

export const useRegisterForTest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (testId: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('test_registrations')
        .insert({ student_id: user.id, test_id: testId })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['test-registrations'] });
    },
  });
};
