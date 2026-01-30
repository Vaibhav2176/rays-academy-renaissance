import { useState } from 'react';
import { Video, FileIcon, Lock, Tag, Loader2, CheckCircle } from 'lucide-react';
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

interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  material_type: string;
  price: number;
  is_free: boolean;
}

interface MaterialCardProps {
  material: StudyMaterial;
  hasAccess: boolean;
}

const MaterialCard = ({ material, hasAccess }: MaterialCardProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const redeemMutation = useRedeemCoupon();

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
      setDialogOpen(false);
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

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
        isVideo 
          ? 'bg-accent/20 text-accent' 
          : 'bg-primary/20 text-primary'
      }`}>
        {isVideo ? <Video className="w-6 h-6" /> : <FileIcon className="w-6 h-6" />}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{material.title}</h4>
        {material.description && (
          <p className="text-sm text-muted-foreground truncate">{material.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {isFree ? (
            <Badge variant="secondary" className="text-xs">Free</Badge>
          ) : (
            <Badge variant="outline" className="text-xs">₹{material.price}</Badge>
          )}
        </div>
      </div>
      
      <Badge variant={isVideo ? 'default' : 'secondary'}>
        {isVideo ? 'Video' : 'PDF'}
      </Badge>
      
      {hasAccess ? (
        <>
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Unlocked
          </Badge>
          {material.file_url && (
            <Button size="sm" variant="outline" asChild>
              <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                Open
              </a>
            </Button>
          )}
        </>
      ) : (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default">
              <Lock className="w-3 h-3 mr-1" />
              Unlock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unlock: {material.title}</DialogTitle>
              <DialogDescription>
                {isFree 
                  ? "This material is free! Enter any valid coupon code to unlock."
                  : `Price: ₹${material.price}. Enter a coupon code to get a discount or free access.`
                }
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
                Registered students receive coupon codes from Rays Academy.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MaterialCard;
