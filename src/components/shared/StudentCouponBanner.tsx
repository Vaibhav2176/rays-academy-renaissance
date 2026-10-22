import React from 'react';
import { Sparkles, Phone, MessageCircle, HelpCircle } from 'lucide-react';
import { WhatsAppButton, ContactButton } from './CTAButtons';

interface StudentCouponBannerProps {
  className?: string;
  compact?: boolean;
}

export const StudentCouponBanner: React.FC<StudentCouponBannerProps> = ({
  className = '',
  compact = false,
}) => {
  if (compact) {
    return (
      <div
        className={`p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            <strong className="text-primary font-semibold">Student Assistance:</strong> Rays Academy students may be eligible for complimentary study materials. Contact the institute to receive your student coupon code and learn how to redeem it.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <WhatsAppButton
            size="sm"
            label="Get Coupon"
            message="Hi Rays Academy, I am an enrolled student. Please share guidance and coupon code for complimentary study materials."
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 md:p-5 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-primary/5 to-muted/40 text-foreground shadow-sm ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm md:text-base text-foreground mb-1">
              Complimentary Access for Enrolled Students
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Rays Academy students may be eligible for complimentary study materials. Contact the institute to receive your student coupon code and learn how to redeem it.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
          <WhatsAppButton
            size="sm"
            label="Inquire via WhatsApp"
            message="Hi Rays Academy, I am an enrolled student. Please share guidance and coupon code for complimentary study materials."
          />
          <ContactButton size="sm" label="Contact Institute" />
        </div>
      </div>
    </div>
  );
};

export default StudentCouponBanner;

