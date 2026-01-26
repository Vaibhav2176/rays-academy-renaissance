import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export const useAnnouncements = () => {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as Announcement[];
    },
  });
};
