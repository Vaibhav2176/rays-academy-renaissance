import { useState } from 'react';
import { Video, FileIcon, Lock, Tag, Loader2, CheckCircle, Download, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRedeemCoupon } from '@/hooks/useMaterialPurchases';
import { downloadCatalogMaterial, triggerFileDownload } from '@/hooks/useStudyMaterials';
import PaidMaterialDialog from '@/components/study-material/PaidMaterialDialog';

interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  material_type: string;
  price: number;
  price_minor?: number;
  is_free: boolean;
  course_slug?: string | null;
  subject_slug?: string | null;
  subject?: string | null;
}

interface MaterialCardProps {
  material: StudyMaterial;
  hasAccess: boolean;
}

const MaterialCard = ({ material, hasAccess }: MaterialCardProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [paidModalOpen, setPaidModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const redeemMutation = useRedeemCoupon();

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const { downloadUrl } = await downloadCatalogMaterial(material.id);
      triggerFileDownload(downloadUrl, material.title);
      toast({
        title: "Download Started",
        description: `Downloading "${material.title}".`,
      });
    } catch (err: any) {
      console.error('Download error:', err);
      toast({
        title: "Download Unavailable",
        description: err instanceof Error ? err.message : "Unable to download material",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter Coupon Code",
        description: "Please enter a valid coupon code.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await redeemMutation.mutateAsync({
        code: couponCode,
        materialId: material.id,
      });
      
      toast({
        title: "Success!",
        description: result.discount === 100 
          ? "You now have free access to this material!" 
          : `Coupon applied! You saved ${result.discount}%`,
      });
      setCouponDialogOpen(false);
      setCouponCode('');
    } catch (error) {
      toast({
        title: "Failed to Redeem",
        description: error instanceof Error ? error.message : "Invalid coupon code",
        variant: "destructive",
      });
    }
  };

  const isVideo = material.material_type === 'video';
  const isFree = material.is_free || material.price === 0;
  const formattedPrice = `₹${material.price || (material.price_minor ? material.price_minor / 100 : 49)}`;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/70 hover:bg-muted/30 transition-all">
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            isVideo 
              ? 'bg-accent/20 text-accent' 
              : 'bg-primary/20 text-primary'
          }`}>
            {isVideo ? <Video className="w-5 h-5" /> : <FileIcon className="w-5 h-5" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-foreground truncate">{material.title}</h4>
            {material.description && (
              <p className="text-xs text-muted-foreground truncate">{material.description}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              {isFree ? (
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 dark:text-green-300">Free</Badge>
              ) : (
                <Badge variant="outline" className="text-xs font-semibold">{formattedPrice}</Badge>
              )}
              {material.subject && (
                <Badge variant="outline" className="text-xs text-muted-foreground">{material.subject}</Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          {hasAccess ? (
            <>
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Unlocked
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                disabled={downloading}
                className="h-8 px-3 text-xs"
              >
                {downloading ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                )}
                Download
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPaidModalOpen(true)}
                className="h-8 px-3 text-xs text-accent border-accent/40 hover:bg-accent hover:text-accent-foreground"
              >
                <Lock className="w-3 h-3 mr-1" /> Unlock
              </Button>

              <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-muted-foreground">
                    <Tag className="w-3 h-3 mr-1" /> Coupon
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply Coupon: {material.title}</DialogTitle>
                    <DialogDescription>
                      Enter your academy voucher or coupon code to unlock this material.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter coupon code (e.g., RAYS2024)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="pl-10 uppercase"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleRedeemCoupon} 
                      className="w-full"
                      disabled={redeemMutation.isPending}
                    >
                      {redeemMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        'Apply Coupon & Unlock'
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Students registered at Rays Academy receive coupon codes from faculty.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      <PaidMaterialDialog
        open={paidModalOpen}
        onOpenChange={setPaidModalOpen}
        materialId={material.id}
        title={material.title}
        priceFormatted={formattedPrice}
        courseSlug={material.course_slug || undefined}
        subjectSlug={material.subject_slug || undefined}
        subjectTitle={material.subject || undefined}
      />
    </>
  );
};

export default MaterialCard;
