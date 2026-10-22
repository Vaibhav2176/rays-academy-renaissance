import React, { useState } from 'react';
import {
  FileText,
  Download,
  Lock,
  Unlock,
  Sparkles,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  CatalogStudyMaterial,
  downloadCatalogMaterial,
  triggerFileDownload,
} from '@/hooks/useStudyMaterials';
import { useUserMaterialAccess, unlockFreeMaterial } from '@/hooks/useStudentEntitlements';
import { useAuth } from '@/contexts/AuthContext';
import PaidMaterialDialog from './PaidMaterialDialog';

export function formatMaterialTitle(title: string): string {
  if (!title) return 'Study Material';
  let clean = title.replace(/\.(pdf|doc|docx|ppt|pptx)$/i, '');
  if (clean.includes('_') && !clean.includes(' ')) {
    clean = clean.replace(/_/g, ' ');
  }
  return clean.trim();
}

interface CatalogMaterialCardProps {
  material: CatalogStudyMaterial;
  compact?: boolean;
}

export const CatalogMaterialCard: React.FC<CatalogMaterialCardProps> = ({
  material,
  compact = false,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasAccess } = useUserMaterialAccess();
  const [downloading, setDownloading] = useState(false);
  const [paidModalOpen, setPaidModalOpen] = useState(false);

  const displayTitle = formatMaterialTitle(material.title);
  const userHasAccess = material.is_free || hasAccess(material);

  const handleDownload = async () => {
    if (!userHasAccess) {
      setPaidModalOpen(true);
      return;
    }

    try {
      setDownloading(true);
      if (material.is_free && user) {
        unlockFreeMaterial(material.id, user.id).catch(() => {});
      }
      const { downloadUrl } = await downloadCatalogMaterial(material.id);
      triggerFileDownload(downloadUrl, material.title);
      toast({
        title: 'Download started!',
        description: `Starting download for "${displayTitle}".`,
      });
    } catch (err) {
      console.error('Download error:', err);
      toast({
        title: 'Download unavailable',
        description:
          err instanceof Error
            ? err.message
            : 'Unable to download file. Please try again shortly or contact support.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const formattedPrice = `₹${((material.price_minor || 0) / 100).toFixed(0)}`;

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'chapter':
        return 'Chapter Note';
      case 'pyq':
        return 'PYQ';
      case 'sample_paper':
        return 'Sample Paper';
      case 'formula_sheet':
        return 'Formula Sheet';
      case 'revision_notes':
        return 'Revision Notes';
      case 'important_questions':
        return 'Important Questions';
      default:
        return 'Study Note';
    }
  };

  if (compact) {
    return (
      <>
        <div className="flex items-center justify-between p-3.5 rounded-xl border bg-card hover:bg-muted/40 transition-all duration-200">
          <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-foreground truncate">
                  {displayTitle}
                </span>
                {material.section_name && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 text-muted-foreground">
                    {material.section_name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                {material.subject_sequence_number && (
                  <span>#{material.subject_sequence_number}</span>
                )}
                {material.chapter_number && (
                  <span>· Ch {material.chapter_number}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {material.is_free ? (
              <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs">
                FREE
              </Badge>
            ) : userHasAccess ? (
              <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs">
                UNLOCKED
              </Badge>
            ) : (
              <Badge variant="outline" className="text-accent border-accent/40 text-xs font-semibold">
                <Lock className="w-3 h-3 mr-1" /> {formattedPrice}
              </Badge>
            )}

            {userHasAccess ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                disabled={downloading}
                className="h-8 px-2.5 text-xs text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground"
              >
                {downloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 mr-1" />
                )}
                PDF
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPaidModalOpen(true)}
                className="h-8 px-2.5 text-xs text-accent border-accent/30 hover:bg-accent hover:text-accent-foreground"
              >
                <Lock className="w-3.5 h-3.5 mr-1" /> Unlock
              </Button>
            )}
          </div>
        </div>

        <PaidMaterialDialog
          open={paidModalOpen}
          onOpenChange={setPaidModalOpen}
          materialId={material.id}
          title={material.title}
          priceFormatted={formattedPrice}
          courseTitle={material.course_slug || undefined}
          subjectTitle={material.subject || material.subject_slug || undefined}
          courseSlug={material.course_slug || undefined}
          subjectSlug={material.subject_slug || undefined}
        />
      </>
    );
  }

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-border flex flex-col justify-between">
        <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="text-xs uppercase font-mono tracking-wider">
                  {material.course_slug || 'General'}
                </Badge>
                {material.subject && (
                  <Badge variant="outline" className="text-xs text-primary border-primary/30">
                    {material.subject}
                  </Badge>
                )}
                {material.section_name && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    <Layers className="w-3 h-3 mr-1" />
                    {material.section_name}
                  </Badge>
                )}
              </div>

              {material.is_free ? (
                <Badge className="bg-green-600 hover:bg-green-700 text-white shrink-0">
                  <Unlock className="w-3 h-3 mr-1" /> FREE
                </Badge>
              ) : userHasAccess ? (
                <Badge className="bg-green-600 hover:bg-green-700 text-white shrink-0">
                  <Unlock className="w-3 h-3 mr-1" /> UNLOCKED
                </Badge>
              ) : (
                <Badge variant="outline" className="text-accent border-accent/40 shrink-0 font-semibold">
                  <Lock className="w-3 h-3 mr-1" /> {formattedPrice}
                </Badge>
              )}
            </div>

            <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {displayTitle}
            </h3>

            {material.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {material.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1 text-primary/70" />
                {getResourceTypeLabel(material.resource_type)}
              </span>
              {material.subject_sequence_number && (
                <span>· #{material.subject_sequence_number}</span>
              )}
              {material.chapter_number && (
                <span>· Chapter {material.chapter_number}</span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-border/60">
            {userHasAccess ? (
              <Button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 rounded-lg shadow-sm"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparing download...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setPaidModalOpen(true)}
                className="w-full text-accent border-accent/40 hover:bg-accent hover:text-accent-foreground font-semibold text-xs h-9 rounded-lg"
              >
                <Lock className="w-4 h-4 mr-2" /> Unlock for {formattedPrice}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <PaidMaterialDialog
        open={paidModalOpen}
        onOpenChange={setPaidModalOpen}
        materialId={material.id}
        title={material.title}
        priceFormatted={formattedPrice}
        courseTitle={material.course_slug || undefined}
        subjectTitle={material.subject || material.subject_slug || undefined}
        courseSlug={material.course_slug || undefined}
        subjectSlug={material.subject_slug || undefined}
      />
    </>
  );
};

export default CatalogMaterialCard;

