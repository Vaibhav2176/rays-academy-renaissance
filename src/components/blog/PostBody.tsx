import { Link } from 'react-router-dom';
import type { Section } from '@/data/blog/types';
import { Lightbulb, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  info: Info,
  tip: Lightbulb,
  warning: AlertTriangle,
};

const calloutStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  tip: 'bg-amber-50 border-amber-200 text-amber-900',
  warning: 'bg-rose-50 border-rose-200 text-rose-900',
};

const PostBody = ({ sections }: { sections: Section[] }) => {
  return (
    <div className="prose-blog space-y-5">
      {sections.map((s, i) => {
        switch (s.type) {
          case 'p':
            return (
              <p key={i} className="text-[15.5px] leading-[1.8] text-foreground/90">
                {s.text}
              </p>
            );
          case 'h2':
            return (
              <h2 id={s.id} key={i} className="scroll-mt-24 text-2xl md:text-3xl font-bold text-primary pt-4 mt-4 border-t border-border">
                {s.text}
              </h2>
            );
          case 'h3':
            return <h3 key={i} className="text-xl font-bold text-primary mt-2">{s.text}</h3>;
          case 'ul':
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 marker:text-accent">
                {s.items.map((it, j) => (
                  <li key={j} className="text-[15px] leading-relaxed text-foreground/90">{it}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="list-decimal pl-6 space-y-2 marker:text-accent marker:font-bold">
                {s.items.map((it, j) => (
                  <li key={j} className="text-[15px] leading-relaxed text-foreground/90">{it}</li>
                ))}
              </ol>
            );
          case 'quote':
            return (
              <blockquote key={i} className="border-l-4 border-accent bg-muted/50 pl-5 py-3 pr-4 rounded-r-lg italic text-primary/90">
                <p className="text-[15px] leading-relaxed">"{s.text}"</p>
                {s.author && <footer className="text-xs mt-2 not-italic text-muted-foreground">— {s.author}</footer>}
              </blockquote>
            );
          case 'callout': {
            const variant = s.variant ?? 'info';
            const Icon = iconMap[variant];
            return (
              <div key={i} className={cn('flex gap-3 p-4 rounded-xl border', calloutStyles[variant])}>
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  {s.title && <p className="font-bold mb-1">{s.title}</p>}
                  <p>{s.text}</p>
                </div>
              </div>
            );
          }
          case 'cta':
            return (
              <div key={i} className="my-6 p-6 rounded-2xl bg-gradient-to-r from-primary to-blue-800 text-white shadow-lg">
                <h4 className="text-lg font-bold mb-1">{s.title}</h4>
                <p className="text-sm text-white/85 mb-4">{s.text}</p>
                <Link
                  to={s.href}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  {s.label} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default PostBody;
