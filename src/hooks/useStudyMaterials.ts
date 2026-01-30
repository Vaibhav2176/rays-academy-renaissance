import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StudyMaterial {
  id: string;
  class_id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  material_type: 'pdf' | 'video';
  subject: string | null;
  price: number;
  is_free: boolean;
  created_at: string;
}

export const useStudyMaterials = () => {
  return useQuery({
    queryKey: ['study-materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as StudyMaterial[];
    },
  });
};
