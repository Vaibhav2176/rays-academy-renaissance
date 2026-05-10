import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const WHATSAPP_NUMBER = '917024057876';

interface BaseProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  label?: string;
}

/**
 * Solid green WhatsApp CTA — text + icon always visible (no hover-only contrast).
 */
export const WhatsAppButton = ({
  className,
  size = 'lg',
  label = 'WhatsApp Us',
  message,
}: BaseProps & { message?: string }) => {
  const url = message
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Button
        size={size}
        className={cn(
          'bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold rounded-full shadow-lg shadow-green-600/30 hover:shadow-xl hover:scale-105 transition-all duration-300 px-6',
          className,
        )}
      >
        <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 mr-2" />
        {label}
      </Button>
    </a>
  );
};

/**
 * Solid red Contact CTA — high contrast, readable without hover.
 */
export const ContactButton = ({
  className,
  size = 'lg',
  label = 'Contact Us',
}: BaseProps) => (
  <Link to="/contact">
    <Button
      size={size}
      className={cn(
        'bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full shadow-lg shadow-accent/30 hover:shadow-xl hover:scale-105 transition-all duration-300 px-6',
        className,
      )}
    >
      <Phone className="w-5 h-5 mr-2" />
      {label}
    </Button>
  </Link>
);
