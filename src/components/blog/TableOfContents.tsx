import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';

interface Props {
  items: { id: string; label: string }[];
}

const TableOfContents = ({ items }: Props) => {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  const list = (
    <ul className="space-y-2 text-sm">
      {items.map((i) => (
        <li key={i.id}>
          <a
            href={`#${i.id}`}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'block border-l-2 pl-3 py-1 transition-colors',
              active === i.id
                ? 'border-accent text-accent font-semibold'
                : 'border-border text-muted-foreground hover:text-primary hover:border-primary/40',
            )}
          >
            {i.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block sticky top-24 self-start">
        <div className="p-5 rounded-2xl border border-border bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-primary">
            <List className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider">On this page</h3>
          </div>
          {list}
        </div>
      </aside>

      {/* Mobile */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-white text-left"
        >
          <span className="flex items-center gap-2 text-primary font-semibold">
            <List className="w-4 h-4" />
            Table of Contents
          </span>
          <span className="text-xs text-muted-foreground">{mobileOpen ? 'Hide' : 'Show'}</span>
        </button>
        {mobileOpen && <div className="mt-3 p-4 rounded-xl bg-white border border-border">{list}</div>}
      </div>
    </>
  );
};

export default TableOfContents;
