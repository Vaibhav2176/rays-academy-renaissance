import { Sparkles } from 'lucide-react';

const KeyTakeaways = ({ items }: { items: string[] }) => (
  <section id="key-takeaways" className="scroll-mt-24 my-8 p-6 rounded-2xl bg-gradient-to-br from-secondary to-blue-50 border border-primary/10">
    <div className="flex items-center gap-2 mb-4">
      <Sparkles className="w-5 h-5 text-accent" />
      <h2 className="text-xl md:text-2xl font-bold text-primary">Key Takeaways</h2>
    </div>
    <ul className="space-y-2.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-1.5 w-2 h-2 rounded-full bg-accent shrink-0" />
          <span className="text-[15px] leading-relaxed text-foreground/90">{t}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default KeyTakeaways;
