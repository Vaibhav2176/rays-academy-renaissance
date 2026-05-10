import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Phone, MessageCircle, Lock, Unlock, Star, CheckCircle, Lightbulb, Clock, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

interface Subject {
  name: string;
  chapters: { name: string; isFree: boolean }[];
  icon?: string;
}

interface StudyMaterialPageTemplateProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  syllabusOverview: string;
  subjects: Subject[];
  importantTopics: string[];
  examTips: string[];
  faqs: { question: string; answer: string }[];
  localSeoKeywords: string[];
  pricePerChapter?: number;
  fullSubjectPrice?: number;
  breadcrumbLabel: string;
}

const StudyMaterialPageTemplate = ({
  title,
  metaTitle,
  metaDescription,
  heroDescription,
  syllabusOverview,
  subjects,
  importantTopics,
  examTips,
  faqs,
  localSeoKeywords,
  pricePerChapter = 50,
  fullSubjectPrice = 500,
  breadcrumbLabel,
}: StudyMaterialPageTemplateProps) => {
  useEffect(() => {
    document.title = metaTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', metaDescription);
    else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = metaDescription;
      document.head.appendChild(meta);
    }
  }, [metaTitle, metaDescription]);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
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
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <Badge className="bg-accent text-accent-foreground mb-4">📚 Study Material</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-primary-foreground/80 mb-8">{heroDescription}</p>
            <div className="flex flex-wrap gap-4">
              <a href="#subjects">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full shadow-lg shadow-accent/30">
                  <BookOpen className="w-5 h-5 mr-2" /> Explore Material
                </Button>
              </a>
              <a href="https://wa.me/917024057876" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold rounded-full shadow-lg shadow-green-600/30">
                  <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 mr-2" /> WhatsApp Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Syllabus Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Syllabus Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{syllabusOverview}</p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="p-6 text-center">
                  <Unlock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-1">Free Chapters</h3>
                  <p className="text-sm text-muted-foreground">First 2 chapters of every subject are completely free</p>
                  <Badge className="mt-3 bg-green-600 text-white">FREE</Badge>
                </CardContent>
              </Card>
              <Card className="border-accent/30 bg-accent/5">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-1">Per Chapter</h3>
                  <p className="text-sm text-muted-foreground">Unlock individual chapters as needed</p>
                  <p className="text-2xl font-bold text-accent mt-3">₹{pricePerChapter}</p>
                </CardContent>
              </Card>
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-1">Full Subject</h3>
                  <p className="text-sm text-muted-foreground">Get complete access to all chapters</p>
                  <p className="text-2xl font-bold text-primary mt-3">₹{fullSubjectPrice}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subject-wise Study Material */}
      <section id="subjects" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Subject-wise Study Material</h2>
            <p className="text-muted-foreground">Click on any subject to explore chapter-wise content</p>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            <Accordion type="multiple" className="space-y-4">
              {subjects.map((subject, idx) => (
                <motion.div key={subject.name} {...fadeInUp} transition={{ delay: idx * 0.1 }}>
                  <AccordionItem value={subject.name} className="border rounded-xl overflow-hidden shadow-sm">
                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">{subject.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">({subject.chapters.length} chapters)</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-2">
                        {subject.chapters.map((ch, cIdx) => (
                          <div key={cIdx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-muted-foreground w-8">Ch {cIdx + 1}</span>
                              <span className="text-sm text-foreground">{ch.name}</span>
                            </div>
                            {ch.isFree ? (
                              <Badge className="bg-green-600 text-white text-xs">FREE</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs border-accent text-accent">
                                <Lock className="w-3 h-3 mr-1" /> ₹{pricePerChapter}
                              </Badge>
                            )}
                          </div>
                        ))}
                        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-sm text-muted-foreground">
                            <Star className="w-4 h-4 inline text-primary mr-1" />
                            Get full access to all {subject.chapters.length} chapters of {subject.name} for just <strong className="text-primary">₹{fullSubjectPrice}</strong>
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Important Topics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Important Topics & Questions</h2>
            <p className="text-muted-foreground">High-weightage topics for exam preparation</p>
          </motion.div>
          <motion.div {...stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {importantTopics.map((topic, idx) => (
              <motion.div key={idx} {...fadeInUp}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{topic}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Exam Tips */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Exam Preparation Tips</h2>
            <p className="text-muted-foreground">Expert strategies for exam success</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {examTips.map((tip, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }}>
                <div className="flex items-start gap-4 p-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    {idx % 3 === 0 ? <Lightbulb className="w-5 h-5 text-accent" /> : idx % 3 === 1 ? <Clock className="w-5 h-5 text-accent" /> : <Target className="w-5 h-5 text-accent" />}
                  </div>
                  <p className="text-sm text-foreground">{tip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Rays Academy */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Why Rays Academy Study Material?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Award, title: 'Expert Faculty', desc: 'Prepared by teachers with 3–33+ years of experience' },
              { icon: BookOpen, title: 'Chapter-wise', desc: 'Structured material covering every topic in detail' },
              { icon: Target, title: 'Exam-Oriented', desc: 'Focused on board & competitive exam patterns' },
              { icon: Lightbulb, title: 'Concept Clarity', desc: 'Clear explanations with solved examples' },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }}>
                <Card className="text-center hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Local SEO */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              {localSeoKeywords.join(' • ')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Frequently Asked Questions</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left text-sm font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Preparation?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join Rays Academy and get access to expert-prepared study material, personal mentoring, and proven results.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full shadow-lg">
                  Join Rays Academy
                </Button>
              </Link>
              <a href="https://wa.me/919303333490" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg">
                  <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 mr-2" /> WhatsApp Us
                </Button>
              </a>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full">
                  <Phone className="w-5 h-5 mr-2" /> Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StudyMaterialPageTemplate;
