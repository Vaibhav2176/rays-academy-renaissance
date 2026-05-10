import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

interface ResourcePageProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  sections: { heading: string; description: string; items: string[] }[];
  breadcrumbLabel: string;
}

const ResourcePageTemplate = ({ title, metaTitle, metaDescription, heroDescription, sections, breadcrumbLabel }: ResourcePageProps) => {
  useEffect(() => {
    document.title = metaTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', metaDescription);
  }, [metaTitle, metaDescription]);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/study-material" className="hover:text-primary transition-colors">Study Material</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{breadcrumbLabel}</span>
          </div>
        </div>
      </div>

      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-20">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <Badge className="bg-accent text-accent-foreground mb-4">Study Resources</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-primary-foreground/80 mb-8">{heroDescription}</p>
          </motion.div>
        </div>
      </section>

      {sections.map((section, sIdx) => (
        <section key={sIdx} className={`py-16 ${sIdx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-3">{section.heading}</h2>
              <p className="text-muted-foreground mb-8">{section.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((item, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{item}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl font-bold mb-4">Need More Resources?</h2>
            <p className="text-primary-foreground/80 mb-8">Contact Rays Academy for complete study material and expert guidance.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full shadow-lg shadow-accent/30">
                  <Phone className="w-5 h-5 mr-2" /> Join Rays Academy
                </Button>
              </Link>
              <a href="https://wa.me/917024057876" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold rounded-full shadow-lg shadow-green-600/30">
                  <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 mr-2" /> WhatsApp Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ResourcePageTemplate;
