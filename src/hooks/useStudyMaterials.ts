import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ResourceType =
  | 'chapter'
  | 'pyq'
  | 'sample_paper'
  | 'formula_sheet'
  | 'revision_notes'
  | 'important_questions'
  | 'ncert'
  | 'other';

export interface CatalogStudyMaterial {
  id: string;
  class_id: string | null;
  title: string;
  slug: string | null;
  catalog_key: string | null;
  course_slug: string | null;
  subject_slug: string | null;
  section_name: string | null;
  resource_type: ResourceType;
  chapter_number: number | null;
  subject_sequence_number: number | null;
  topic_title: string | null;
  description: string | null;
  material_type: string;
  subject: string | null;
  board_exam: string | null;
  academic_year: string | null;
  price_minor: number;
  currency: string;
  is_free: boolean;
  status: 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CatalogFilters {
  courseSlug?: string;
  subjectSlug?: string;
  sectionName?: string;
  resourceType?: string;
  isFree?: boolean;
  search?: string;
}

// Backwards-compatible interface for existing Portal components
export interface StudyMaterial {
  id: string;
  class_id: string | null;
  title: string;
  description: string | null;
  file_url: string | null;
  material_type: 'pdf' | 'video';
  subject: string | null;
  price: number;
  price_minor?: number;
  is_free: boolean;
  created_at: string;
  course_slug?: string | null;
  subject_slug?: string | null;
  section_name?: string | null;
  resource_type?: string;
  subject_sequence_number?: number | null;
}

/**
 * Public catalog hook to query published study materials.
 * Queries public.study_material_catalog with server-side security barrier.
 */
export const useStudyMaterialCatalog = (filters?: CatalogFilters) => {
  return useQuery({
    queryKey: ['study-material-catalog', filters],
    queryFn: async () => {
      let query = supabase
        .from('study_material_catalog')
        .select('*')
        .order('subject_sequence_number', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      if (filters?.courseSlug && filters.courseSlug !== 'all') {
        query = query.eq('course_slug', filters.courseSlug);
      }
      if (filters?.subjectSlug && filters.subjectSlug !== 'all') {
        query = query.eq('subject_slug', filters.subjectSlug);
      }
      if (filters?.sectionName && filters.sectionName !== 'all') {
        query = query.eq('section_name', filters.sectionName);
      }
      if (filters?.resourceType && filters.resourceType !== 'all') {
        query = query.eq('resource_type', filters.resourceType);
      }
      if (filters?.isFree !== undefined) {
        query = query.eq('is_free', filters.isFree);
      }

      const { data, error } = await query;
      if (error) throw error;

      let items = (data || []) as CatalogStudyMaterial[];

      if (filters?.search && filters.search.trim()) {
        const term = filters.search.toLowerCase().trim();
        items = items.filter(
          (item) =>
            item.title.toLowerCase().includes(term) ||
            item.description?.toLowerCase().includes(term) ||
            item.section_name?.toLowerCase().includes(term) ||
            item.subject?.toLowerCase().includes(term)
        );
      }

      return items;
    },
  });
};

/**
 * Backwards-compatible hook that queries published materials for the portal.
 */
export const useStudyMaterials = () => {
  return useQuery({
    queryKey: ['study-materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_material_catalog')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback for any legacy environments
        const fallback = await supabase
          .from('study_materials')
          .select('*')
          .order('created_at', { ascending: false });
        if (fallback.error) throw fallback.error;
        return (fallback.data || []) as StudyMaterial[];
      }

      return ((data || []) as CatalogStudyMaterial[]).map((item) => ({
        id: item.id,
        class_id: item.class_id,
        title: item.title,
        description: item.description,
        file_url: null, // Protected in storage
        material_type: (item.material_type === 'video' ? 'video' : 'pdf') as 'pdf' | 'video',
        subject: item.subject || item.subject_slug,
        price: Number(((item.price_minor || 0) / 100).toFixed(2)),
        price_minor: item.price_minor,
        is_free: item.is_free,
        created_at: item.created_at,
        course_slug: item.course_slug,
        subject_slug: item.subject_slug,
        section_name: item.section_name,
        resource_type: item.resource_type,
        subject_sequence_number: item.subject_sequence_number,
      })) as StudyMaterial[];
    },
  });
};

/**
 * Downloads a free or entitled study material via the secure material-download Edge Function.
 */
export const downloadCatalogMaterial = async (
  materialId: string
): Promise<{ downloadUrl: string; expiresIn: number }> => {
  const { data, error } = await supabase.functions.invoke('material-download', {
    body: { materialId },
  });

  if (error) {
    throw new Error(error.message || 'Failed to download study material');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  const downloadUrl = data?.download_url || data?.url;
  if (!downloadUrl) {
    throw new Error('No download URL returned by server');
  }

  return {
    downloadUrl,
    expiresIn: data.expires_in || data.expiresIn || 60,
  };
};

/**
 * Helper to trigger browser download of a signed file URL.
 */
export const triggerFileDownload = (url: string, filename?: string) => {
  const a = document.createElement('a');
  a.href = url;
  if (filename) {
    a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  }
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
