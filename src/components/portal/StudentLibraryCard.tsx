import React, { useState } from 'react';
import {
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  CatalogStudyMaterial,
  downloadCatalogMaterial,
  triggerFileDownload,
} from '@/hooks/useStudyMaterials';
import { EntitlementReason } from '@/hooks/useStudentEntitlements';
import { formatMaterialTitle } from '@/components/study-material/CatalogMaterialCard';

interface StudentLibraryCardProps {
  material: CatalogStudyMaterial;
  accessReason?: EntitlementReason;
  accessDescription?: string;
}

export const StudentLibraryCard: React.FC<StudentLibraryCardProps> = ({
  material,
  accessReason = 'single',
  accessDescription = 'Unlocked Access',
}) => {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const displayTitle = formatMaterialTitle(material.title);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const { downloadUrl } = await downloadCatalogMaterial(material.id);
      triggerFileDownload(downloadUrl, material.title);
      toast({
        title: 'Download Started',
        description: `Preparing "${material.title}" for download.`,
      });
    } catch (err: any) {
      console.error('Download error:', err);
      toast({
        title: 'Download Unavailable',
        description:
          err instanceof Error
            ? err.message
            : 'Unable to download file. Please contact academy support.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const getReasonBadge = () => {
    switch (accessReason) {
      case 'course_bundle':
        return (
          <Badge className="bg-purple-600/15 text-purple-700 dark:text-purple-300 border-purple-500/30 text-xs">
            <Sparkles className="w-3 h-3 mr-1" /> Full Course Pass
          </Badge>
        );
      case 'subject_bundle':
        return (
          <Badge className="bg-blue-600/15 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs">
            <Layers className="w-3 h-3 mr-1" /> Subject Pass
          </Badge>
        );
      case 'legacy':
        return (
          <Badge className="bg-amber-600/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-xs">
            <ShieldCheck className="w-3 h-3 mr-1" /> Coupon / Enrolled
          </Badge>
        );
      case 'free':
        return (
          <Badge className="bg-green-600/15 text-green-700 dark:text-green-300 border-green-500/30 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Free Chapter
          </Badge>
        );
      default:
        return (
          <Badge className="bg-green-600/15 text-green-700 dark:text-green-300 border-green-500/30 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Purchased
          </Badge>
        );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/80 bg-card hover:bg-muted/30 transition-all duration-200 gap-3">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className="font-semibold text-sm text-foreground truncate max-w-md">
              {displayTitle}
            </h4>
            {getReasonBadge()}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {material.course_slug && (
              <span className="uppercase font-mono">{material.course_slug}</span>
            )}
            {material.subject && <span>· {material.subject}</span>}
            {material.section_name && <span>· {material.section_name}</span>}
            {material.chapter_number && <span>· Ch {material.chapter_number}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <Button
          size="sm"
          onClick={handleDownload}
          disabled={downloading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-3.5 rounded-lg shadow-sm"
        >
          {downloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StudentLibraryCard;

