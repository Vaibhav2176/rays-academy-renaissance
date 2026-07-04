import { useState } from 'react';
import { Link, Facebook, Twitter, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  url: string;
  title: string;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M20.52 3.48A11.94 11.94 0 0 0 12.03 0C5.4 0 .06 5.34.06 11.98a11.9 11.9 0 0 0 1.62 6L0 24l6.18-1.62a11.98 11.98 0 0 0 5.85 1.49h.01c6.62 0 11.96-5.34 11.96-11.98a11.9 11.9 0 0 0-3.48-8.41Zm-8.49 18.4h-.01a9.94 9.94 0 0 1-5.06-1.39l-.36-.21-3.67.96.98-3.58-.24-.37a9.9 9.9 0 0 1-1.52-5.31C2.15 6.5 6.58 2.06 12.04 2.06c2.65 0 5.14 1.03 7.01 2.9a9.85 9.85 0 0 1 2.9 7.02c0 5.47-4.44 9.9-9.92 9.9Z" />
  </svg>
);

const ShareButtons = ({ url, title }: Props) => {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const links = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${enc(title + ' — ' + url)}`, icon: <WhatsAppIcon /> },
    { name: 'X / Twitter', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`, icon: <Twitter className="w-4 h-4" /> },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, icon: <Facebook className="w-4 h-4" /> },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, icon: <Share2 className="w-4 h-4" /> },
  ];

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-muted-foreground mr-1">Share:</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.name}`}
          className="w-9 h-9 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground text-primary flex items-center justify-center transition-colors"
        >
          {l.icon}
        </a>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={copy}
        className="ml-1 gap-1.5"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
        {copied ? 'Copied' : 'Copy link'}
      </Button>
    </div>
  );
};

export default ShareButtons;
