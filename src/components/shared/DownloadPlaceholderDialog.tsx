import { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WhatsAppButton, ContactButton } from './CTAButtons';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  label?: string;
  className?: string;
  variant?: 'card' | 'pill' | 'inline';
  resourceName?: string;
  children?: ReactNode;
}

/**
 * Download CTA that opens a "PDF coming soon" placeholder modal.
 * Use anywhere we'd otherwise link to a real PDF.
 */
export const DownloadButton = ({
  label = 'Download PDF',
  className,
  variant = 'pill',
  resourceName,
  children,
}: DownloadButtonProps) => {
  const [open, setOpen] = useState(false);

  const trigger =
    variant === 'card' ? (
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'group w-full text-left p-4 rounded-xl border border-border bg-background hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3',
          className,
        )}
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center shrink-0 transition-colors">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {children || label}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Download className="w-3 h-3" /> PDF · Free download
          </p>
        </div>
      </button>
    ) : variant === 'inline' ? (
      <button
        onClick={() => setOpen(true)}
        className={cn('text-sm font-medium text-primary hover:text-accent inline-flex items-center gap-1 transition-colors', className)}
      >
        <Download className="w-4 h-4" /> {children || label}
      </button>
    ) : (
      <Button
        onClick={() => setOpen(true)}
        className={cn(
          'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-md hover:shadow-lg transition-all',
          className,
        )}
      >
        <Download className="w-4 h-4 mr-2" /> {children || label}
      </Button>
    );

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-3">
              <FileText className="w-8 h-8 text-accent" />
            </div>
            <DialogTitle className="text-center text-xl">PDF coming very soon</DialogTitle>
            <DialogDescription className="text-center pt-2">
              {resourceName ? <>The PDF for <strong>{resourceName}</strong> is being prepared.</> : 'This PDF is being prepared by our faculty.'}{' '}
              We will upload the study material here very soon. Meanwhile, talk to our team for direct access.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-2">
            <WhatsAppButton
              size="default"
              label="Request on WhatsApp"
              message={resourceName ? `Hi Rays Academy, please share the PDF for "${resourceName}".` : 'Hi Rays Academy, please share the requested study material PDF.'}
            />
            <ContactButton size="default" label="Contact Us" />
            <Link to="/study-material" className="text-sm text-muted-foreground hover:text-primary text-center inline-flex items-center justify-center gap-1 mt-1">
              <ArrowLeft className="w-3 h-3" /> Back to all resources
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DownloadButton;
