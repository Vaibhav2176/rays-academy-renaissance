import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '@/data/blog/types';
import { cn } from '@/lib/utils';

const FaqSection = ({ items }: { items: FAQ[] }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-24 mt-10">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {items.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className="border border-border rounded-xl bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left p-4 md:p-5 hover:bg-muted/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-primary">{item.q}</span>
                <ChevronDown className={cn('w-5 h-5 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 md:px-5 pb-5 text-[15px] leading-relaxed text-foreground/85">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
