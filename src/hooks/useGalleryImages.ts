import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GalleryImage {
  id: string;
  title: string | null;
  image_url: string;
  category: string;
  display_order: number;
}

export const useGalleryImages = () => {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as GalleryImage[];
    },
  });
};

export const useGalleryByCategory = () => {
  const { data: images, ...rest } = useGalleryImages();
  
  const groupedImages = images?.reduce((acc, image) => {
    const category = image.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(image.image_url);
    return acc;
  }, {} as Record<string, string[]>) || {};
  
  return { data: groupedImages, ...rest };
};
