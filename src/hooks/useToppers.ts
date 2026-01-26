import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Topper {
  id: string;
  name: string;
  exam: string;
  rank: string;
  score: string;
  year: number;
  image_url: string | null;
  is_featured: boolean;
}

export interface YearlyResult {
  id: string;
  year: number;
  total_students: number;
  above_90_percent: number;
  above_95_percent: number;
  district_toppers: number;
}

export const useToppers = (featured?: boolean) => {
  return useQuery({
    queryKey: ['toppers', featured],
    queryFn: async () => {
      let query = supabase
        .from('toppers')
        .select('*')
        .order('year', { ascending: false });
      
      if (featured) {
        query = query.eq('is_featured', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Topper[];
    },
  });
};

export const useYearlyResults = () => {
  return useQuery({
    queryKey: ['yearly-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('yearly_results')
        .select('*')
        .order('year', { ascending: false });
      
      if (error) throw error;
      return data as YearlyResult[];
    },
  });
};
