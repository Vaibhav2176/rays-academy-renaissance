import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, CheckCircle2, Lightbulb, Target, Clock, Sparkles, GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ContactButton, WhatsAppButton } from '@/components/shared/CTAButtons';
import DownloadButton from '@/components/shared/DownloadPlaceholderDialog';
import SEO from '@/components/shared/SEO';

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.07 } },
  viewport: { once: true },
};

export interface ResourceSection {
  heading: string;
  description: string;
  /** Either plain strings (rendered as info cards) or downloadable items (rendered as DownloadButton cards) */
  items: string[];
  downloadable?: boolean;
}

export interface RichResourcePageProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  canonical?: string;
  breadcrumbLabel: string;
  heroDescription: string;
  /** 2–3 paragraphs of SEO intro copy under the hero */
  introParagraphs: string[];
  benefits?: { icon?: React.ComponentType<{ className?: string }>; title: string; desc: string }[];
  sections: ResourceSection[];
  preparationStrategy?: { title: string; desc: string }[];
  tips?: string[];
  faqs?: { question: string; answer: string }[];
  related?: { title: string; description: string; href: string }[];
  officialLinks?: { name: string; url: string }[];
}

const defaultBenefits = [
  { icon: Target, title: 'Understand Exam Pattern', desc: 'See exactly what types of questions are asked and how marks are distributed.' },
  { icon: Clock, title: 'Build Speed & Accuracy', desc: 'Time-bound practice trains you to attempt the full paper within the exam window.' },
  { icon: Lightbulb, title: 'Spot High-Weightage Topics', desc: 'Repeated chapters and concepts become obvious — so you revise smarter.' },
  { icon: Sparkles, title: 'Boost Confidence', desc: 'Walk into the exam hall having already solved papers in real conditions.' },
];

const RichResourcePageTemplate = ({
  title,
  metaTitle,
  metaDescription,
  canonical,
  breadcrumbLabel,
  heroDescription,
  introParagraphs,
  benefits = defaultBenefits,
  sections,
  preparationStrategy,
  tips,
  faqs,
  related,
  officialLinks,
}: RichResourcePageProps) => {
  const faqLd = faqs && faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://raysacademy.lovable.app/' },
      { '@type': 'ListItem', position: 2, name: 'Study Material', item: 'https://raysacademy.lovable.app/study-material' },
      { '@type': 'ListItem', position: 3, name: breadcrumbLabel },
    ],
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={metaTitle}
        description={metaDescription}
        canonical={canonical}
        jsonLd={faqLd ? [breadcrumbLd, faqLd] : breadcrumbLd}
      />

      {/* Breadcrumb */}
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

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-16 md:py-20 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <Badge className="bg-accent text-accent-foreground mb-4">Study Resources</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
            <p className="text-lg text-primary-foreground/85 mb-8">{heroDescription}</p>
            <div className="flex flex-wrap gap-3">
              <ContactButton label="Talk to a Mentor" />
              <WhatsAppButton />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro paragraphs */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto prose-style">
            {introParagraphs.map((p, i) => (
              <p key={i} className="text-base md:text-[17px] text-foreground/85 leading-relaxed mb-5">{p}</p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Why these resources matter</h2>
            <p className="text-muted-foreground">Solving and revising the right material is the single biggest difference between average and top scorers.</p>
          </motion.div>
          <motion.div {...stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {benefits.map((b, i) => {
              const Icon = b.icon || Target;
              return (
                <motion.div key={i} variants={{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } }}>
                  <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/60">
                    <CardContent className="p-6">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Downloadable / info sections */}
      {sections.map((section, sIdx) => (
        <section key={sIdx} className={`py-14 ${sIdx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2">{section.heading}</h2>
              <p className="text-muted-foreground mb-7 max-w-3xl">{section.description}</p>
              <motion.div {...stagger} className={section.downloadable !== false ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-3'}>
                {section.items.map((item, idx) => (
                  <motion.div key={idx} variants={{ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 } }}>
                    {section.downloadable !== false ? (
                      <DownloadButton variant="card" resourceName={item}>{item}</DownloadButton>
                    ) : (
                      <Card className="hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-4 flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{item}</span>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* Preparation strategy */}
      {preparationStrategy && preparationStrategy.length > 0 && (
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="text-center mb-10 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Recommended Preparation Strategy</h2>
              <p className="text-muted-foreground">Follow this sequence to extract maximum value from these resources.</p>
            </motion.div>
            <div className="max-w-4xl mx-auto space-y-4">
              {preparationStrategy.map((s, i) => (
                <motion.div key={i} {...fadeInUp} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tips */}
      {tips && tips.length > 0 && (
        <section className="py-14 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Quick Tips from Rays Academy Faculty</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tips.map((t, i) => (
                  <motion.div key={i} {...fadeInUp} transition={{ duration: 0.4, delay: i * 0.04 }}
                    className="flex items-start gap-3 bg-background rounded-xl p-4 border border-border/60">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground leading-relaxed">{t}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related */}
      {related && related.length > 0 && (
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Related Resources</h2>
              <p className="text-muted-foreground text-sm">Explore more from Rays Academy to strengthen your preparation</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {related.map((r, i) => (
                <motion.div key={i} {...fadeInUp} transition={{ duration: 0.4, delay: i * 0.05 }}>
                  <Link to={r.href}>
                    <Card className="h-full border border-border/60 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center gap-1">
                          {r.title} <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                        </h3>
                        <p className="text-sm text-muted-foreground">{r.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Official links */}
      {officialLinks && officialLinks.length > 0 && (
        <section className="py-10 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl font-bold text-foreground mb-3">Official Resources</h2>
              <p className="text-sm text-muted-foreground mb-5">Trusted external links for syllabus, notifications and official material</p>
              <div className="flex flex-wrap justify-center gap-2">
                {officialLinks.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary text-sm font-medium transition-colors">
                    {r.name} <ChevronRight className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="py-14 bg-background">
          <div className="container mx-auto px-4">
            <motion.div {...fadeInUp} className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
            </motion.div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-xl px-4 bg-background">
                    <AccordionTrigger className="text-left text-sm font-semibold">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-14 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Need More Personalised Help?</h2>
            <p className="text-primary-foreground/85 mb-7 max-w-xl mx-auto">
              Join Rays Academy Bhopal for expert guidance, complete chapter-wise material, doubt sessions and proven results since 2006.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <ContactButton label="Join Rays Academy" />
              <WhatsAppButton />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RichResourcePageTemplate;
