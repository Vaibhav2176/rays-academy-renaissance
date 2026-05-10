import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface RelatedResource {
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

interface Props {
  heading?: string;
  subheading?: string;
  resources: RelatedResource[];
}

const RelatedResources = ({
  heading = 'Related Resources',
  subheading = 'Explore more from Rays Academy',
  resources,
}: Props) => (
  <section className="py-16 bg-gradient-to-b from-background to-muted/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{heading}</h2>
        <p className="text-muted-foreground">{subheading}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {resources.map((r, i) => {
          const inner = (
            <Card className="h-full border border-border/60 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/15 flex items-center justify-center mb-4 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{r.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </CardContent>
            </Card>
          );
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              {r.external ? (
                <a href={r.href} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                <Link to={r.href}>{inner}</Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default RelatedResources;
