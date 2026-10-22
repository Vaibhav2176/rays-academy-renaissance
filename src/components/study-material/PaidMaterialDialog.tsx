import React, { useState, useEffect } from 'react';
import {
  Lock,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  PackageCheck,
  Phone,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { WhatsAppButton, ContactButton } from '@/components/shared/CTAButtons';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

interface PaidMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materialId?: string;
  title: string;
  priceFormatted?: string;
  courseTitle?: string;
  subjectTitle?: string;
  courseSlug?: string;
  subjectSlug?: string;
  onSuccess?: () => void;
}

type PurchaseScope = 'single_material' | 'subject_bundle' | 'course_bundle';

/**
 * Safely parses the error payload from an Edge Function invocation failure.
 * When an Edge Function returns a non-2xx status code, the Supabase client
 * populates error.context with the standard Fetch Response object.
 */
export async function parseFunctionsHttpError(
  error: any
): Promise<{ error?: string; already_entitled?: boolean; [key: string]: any } | null> {
  if (!error) return null;
  try {
    if (error.context) {
      if (typeof error.context.json === 'function') {
        const cloned = error.context.clone ? error.context.clone() : error.context;
        return await cloned.json();
      }
      if (typeof error.context.text === 'function') {
        const cloned = error.context.clone ? error.context.clone() : error.context;
        const text = await cloned.text();
        return JSON.parse(text);
      }
      if (typeof error.context === 'object' && error.context !== null) {
        return error.context;
      }
    }
  } catch {
    // Gracefully handle non-JSON or already consumed streams
  }
  return null;
}

/**
 * Resolves the contact phone number for checkout:
 * 1. Prioritizes manual user contact input if provided.
 * 2. Prioritizes student's saved phone (profile.phone).
 * 3. Falls back to parent/guardian phone (profile.parent_phone) if student phone is absent.
 * 4. Falls back to empty string / none.
 */
export function resolveCheckoutContact(
  profile: { phone?: string | null; parent_phone?: string | null } | null | undefined,
  manualContact?: string
): { contact: string; source: 'student' | 'parent' | 'manual' | 'none' } {
  const manual = manualContact?.trim();
  if (manual) {
    return { contact: manual, source: 'manual' };
  }
  const studentPhone = profile?.phone?.trim();
  if (studentPhone) {
    return { contact: studentPhone, source: 'student' };
  }
  const parentPhone = profile?.parent_phone?.trim();
  if (parentPhone) {
    return { contact: parentPhone, source: 'parent' };
  }
  return { contact: '', source: 'none' };
}

export const PaidMaterialDialog: React.FC<PaidMaterialDialogProps> = ({
  open,
  onOpenChange,
  materialId,
  title,
  priceFormatted = '₹49',
  courseTitle,
  subjectTitle,
  courseSlug,
  subjectSlug,
  onSuccess,
}) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedScope, setSelectedScope] = useState<PurchaseScope>('single_material');
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');

  // Default contact sourced from profile (student phone first, then parent phone)
  useEffect(() => {
    if (open && profile) {
      const resolved = resolveCheckoutContact(profile);
      setContactNumber(resolved.contact);
    }
  }, [open, profile]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getScopePrice = (scope: PurchaseScope) => {
    switch (scope) {
      case 'subject_bundle':
        return { label: 'Subject Bundle', price: '₹499', minor: 49900 };
      case 'course_bundle':
        return { label: 'Complete Course Pass', price: '₹999', minor: 99900 };
      default:
        return { label: 'Single Chapter Note', price: priceFormatted || '₹49', minor: 4900 };
    }
  };

  const activeScopeInfo = getScopePrice(selectedScope);

  const handleInitiatePayment = async () => {
    if (!user) {
      navigate('/login', { state: { returnTo: location.pathname } });
      return;
    }

    const activeContact = resolveCheckoutContact(profile, contactNumber).contact;
    const digitsOnly = activeContact.replace(/\D/g, '');
    if (!activeContact || digitsOnly.length < 10) {
      toast({
        title: 'Contact Number Required',
        description: 'Please provide a valid 10-digit mobile number for order confirmation and SMS receipts.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);
      setProcessingStatus('Creating secure order...');

      // 1. Create order on server
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            materialId,
            purchaseType: selectedScope,
            courseSlug: courseSlug || undefined,
            subjectSlug: subjectSlug || undefined,
          },
        }
      );

      // Handle non-2xx HTTP responses from Edge Function (e.g. 409 already_entitled, 400, 500)
      if (orderError) {
        const serverError = await parseFunctionsHttpError(orderError);

        if (serverError?.already_entitled) {
          toast({
            title: 'Already Unlocked! 🎉',
            description: serverError.error || 'You already have active access to this study material.',
          });
          queryClient.invalidateQueries({ queryKey: ['study-material-catalog'] });
          queryClient.invalidateQueries({ queryKey: ['student-entitlements'] });
          queryClient.invalidateQueries({ queryKey: ['material-purchases'] });
          queryClient.invalidateQueries({ queryKey: ['user-material-purchases'] });
          queryClient.invalidateQueries({ queryKey: ['user-is-admin'] });
          onSuccess?.();
          onOpenChange(false);
          return;
        }

        const fallbackMsg = serverError?.error || orderError.message || 'Failed to create order';
        throw new Error(fallbackMsg);
      }

      if (orderData?.error) {
        // If already entitled
        if (orderData.already_entitled) {
          toast({
            title: 'Already Unlocked! 🎉',
            description: orderData.error || 'You already have active access to this study material.',
          });
          queryClient.invalidateQueries({ queryKey: ['study-material-catalog'] });
          queryClient.invalidateQueries({ queryKey: ['student-entitlements'] });
          queryClient.invalidateQueries({ queryKey: ['material-purchases'] });
          queryClient.invalidateQueries({ queryKey: ['user-material-purchases'] });
          queryClient.invalidateQueries({ queryKey: ['user-is-admin'] });
          onSuccess?.();
          onOpenChange(false);
          return;
        }
        throw new Error(orderData.error);
      }

      if (!orderData.key_id || orderData.key_id.includes('placeholder')) {
        throw new Error('Payment gateway configuration error: valid Razorpay key is required.');
      }

      setProcessingStatus('Connecting to Razorpay gateway...');

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Could not load Razorpay checkout script. Please check your internet connection.');
      }

      const rzp = new (window as any).Razorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Rays Academy Bhopal',
        description: orderData.product_title || title,
        order_id: orderData.razorpay_order_id,
        prefill: {
          name: profile?.full_name || user.user_metadata?.full_name || '',
          email: user.email || '',
          contact: activeContact,
        },
        theme: {
          color: '#1e3a8a',
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setProcessingStatus('Verifying payment signature...');
          try {
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                body: {
                  orderId: orderData.order_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
              }
            );

            if (verifyError || !verifyData?.success) {
              const vServerError = await parseFunctionsHttpError(verifyError);
              throw new Error(
                vServerError?.error || verifyData?.error || verifyError?.message || 'Payment signature verification failed'
              );
            }

            toast({
              title: 'Purchase Successful! 🎉',
              description: 'Study material unlocked! You now have permanent access.',
            });
            queryClient.invalidateQueries({ queryKey: ['study-material-catalog'] });
            queryClient.invalidateQueries({ queryKey: ['study-materials'] });
            queryClient.invalidateQueries({ queryKey: ['student-entitlements'] });
            queryClient.invalidateQueries({ queryKey: ['material-purchases'] });
            queryClient.invalidateQueries({ queryKey: ['user-material-purchases'] });
            queryClient.invalidateQueries({ queryKey: ['user-is-admin'] });
            onSuccess?.();
            onOpenChange(false);
          } catch (vErr: any) {
            console.error('Verification error:', vErr);
            toast({
              title: 'Verification Failed',
              description: vErr.message || 'Payment signature could not be verified.',
              variant: 'destructive',
            });
          } finally {
            setProcessing(false);
            setProcessingStatus('');
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setProcessingStatus('');
          },
        },
      });

      rzp.open();
    } catch (err: any) {
      console.error('Payment checkout error:', err);
      toast({
        title: 'Checkout Error',
        description: err.message || 'Unable to complete checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
      setProcessingStatus('');
    }
  };

  const whatsappMessage = `Hi Rays Academy Bhopal, I want to unlock the study material: "${title}" (${subjectTitle ? subjectTitle + ' - ' : ''}${courseTitle || ''}) for ${activeScopeInfo.price}. Please help me complete access.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-2">
            <Lock className="w-7 h-7 text-accent" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Unlock Premium Material
          </DialogTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="text-accent border-accent/30 font-semibold px-2.5 py-0.5">
              {activeScopeInfo.price}
            </Badge>
            {subjectTitle && (
              <Badge variant="secondary" className="text-xs">
                {subjectTitle}
              </Badge>
            )}
          </div>
          <DialogDescription className="pt-2 text-sm text-muted-foreground leading-relaxed">
            Instant online access to <strong className="text-foreground">{title}</strong>.
          </DialogDescription>
        </DialogHeader>

        {/* Purchase Scope Selection */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Choose Access Option
          </label>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => setSelectedScope('single_material')}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                selectedScope === 'single_material'
                  ? 'border-accent bg-accent/5 ring-1 ring-accent'
                  : 'border-border/70 hover:bg-muted/40'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="text-xs font-semibold text-foreground">Single Note</div>
                <div className="text-[11px] text-muted-foreground truncate">{title}</div>
              </div>
              <span className="text-sm font-bold text-accent shrink-0">{priceFormatted}</span>
            </button>

            {subjectSlug && (
              <button
                type="button"
                onClick={() => setSelectedScope('subject_bundle')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  selectedScope === 'subject_bundle'
                    ? 'border-accent bg-accent/5 ring-1 ring-accent'
                    : 'border-border/70 hover:bg-muted/40'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-foreground">Subject Bundle</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1">Best Value</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    All notes in {subjectTitle || subjectSlug}
                  </div>
                </div>
                <span className="text-sm font-bold text-accent shrink-0">₹499</span>
              </button>
            )}

            {courseSlug && (
              <button
                type="button"
                onClick={() => setSelectedScope('course_bundle')}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  selectedScope === 'course_bundle'
                    ? 'border-accent bg-accent/5 ring-1 ring-accent'
                    : 'border-border/70 hover:bg-muted/40'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold text-foreground">Full Course Pass</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    All subjects in {courseTitle || courseSlug}
                  </div>
                </div>
                <span className="text-sm font-bold text-accent shrink-0">₹999</span>
              </button>
            )}
          </div>
        </div>

        {/* Contact Phone for Order & SMS Receipt */}
        {user && (
          <div className="space-y-1.5 py-1.5 px-3 rounded-xl bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="checkout-contact" className="font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary" />
                Contact Phone for Order & Receipt
              </label>
              {profile?.phone?.trim() ? (
                <span className="text-[11px] text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Saved student phone
                </span>
              ) : profile?.parent_phone?.trim() ? (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-muted-foreground" /> Using parent phone
                </span>
              ) : (
                <span className="text-[11px] text-accent font-medium">
                  Enter mobile number
                </span>
              )}
            </div>
            <Input
              id="checkout-contact"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="h-8 text-xs bg-background"
              maxLength={15}
            />
            <p className="text-[10px] text-muted-foreground">
              Razorpay will send payment confirmation and receipt to this contact number.
            </p>
          </div>
        )}

        {/* Benefits List */}
        <div className="space-y-2.5 py-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/60">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <span>Instant PDF download & lifetime access</span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>Secure payment via Razorpay (UPI, Cards, NetBanking)</span>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span>Free future updates included with permanent access</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-1">
          {user ? (
            <Button
              size="default"
              onClick={handleInitiatePayment}
              disabled={processing}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-sm"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {processingStatus || 'Processing checkout...'}
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Unlock Now for {activeScopeInfo.price}
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                size="default"
                onClick={() => navigate('/login', { state: { returnTo: location.pathname } })}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Lock className="w-4 h-4 mr-2" />
                Sign In to Unlock with Razorpay
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                Signing in secures your purchase to your student account permanently.
              </p>
            </div>
          )}

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or alternate assistance
              </span>
            </div>
          </div>

          <WhatsAppButton
            size="default"
            label="Instant Help via WhatsApp"
            message={whatsappMessage}
          />
          <ContactButton size="default" label="Call / Contact Academy" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs text-muted-foreground hover:text-foreground mt-1"
          >
            <ArrowLeft className="w-3 h-3 mr-1" /> Continue Browsing Free Materials
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaidMaterialDialog;
