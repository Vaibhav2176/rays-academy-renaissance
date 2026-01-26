import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const useContactInquiry = () => {
  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([data]);
      
      if (error) throw error;
      return { success: true };
    },
  });
};
