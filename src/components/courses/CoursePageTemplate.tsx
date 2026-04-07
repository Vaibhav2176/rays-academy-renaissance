import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Phone, MessageCircle, CheckCircle2, BookOpen, Clock, Users, MapPin } from 'lucide-react';
import CourseEnquiryForm from './CourseEnquiryForm';

interface CoursePageProps {
  title: string;
  seoTitle: string;
  metaDescription: string;
  heroDescription: string;
  badge: string;
  whyChoose: string[];
  subjects: string[];
  duration: string;
  batchTimings: string;
  mode: string;
  syllabus: { heading: string; topics: string[] }[];
  faculty: { name: string; subject: string; experience: string }[];
  achievements?: string[];
  defaultCourse: string;
  gradientClass?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const CoursePageTemplate = ({
  title, seoTitle, metaDescription, heroDescription, badge,
  whyChoose, subjects, duration, batchTimings, mode,
  syllabus, faculty, achievements, defaultCourse, gradientClass = 'from-primary via-rays-blue-700 to-primary',
}: CoursePageProps) => {

  useEffect(() => {
    document.title = seoTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', metaDescription);
    else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = metaDescription;
      document.head.appendChild(m);
    }
  }, [seoTitle, metaDescription]);

  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in ${defaultCourse} at Rays Academy.`);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className={`relative min-h-[55vh] flex items-center justify-center overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rays-blue-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="bg-accent text-accent-foreground mb-4 text-sm">{badge}</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6">{title}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto">{heroDescription}</p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <motion.h2 {...fadeInUp} className="section-title text-center mb-12">Why Choose This Course?</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {whyChoose.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.h2 {...fadeInUp} className="section-title text-center mb-12">Course Details</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: BookOpen, label: 'Subjects', value: subjects.join(', ') },
              { icon: Clock, label: 'Duration', value: duration },
              { icon: Users, label: 'Batch Timings', value: batchTimings },
              { icon: MapPin, label: 'Mode', value: mode },
            ].map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <d.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{d.label}</h3>
                    <p className="text-sm text-muted-foreground">{d.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4">
          <motion.h2 {...fadeInUp} className="section-title text-center mb-12">Syllabus Overview</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {syllabus.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-primary mb-3">{s.heading}</h3>
                    <ul className="space-y-1.5">
                      {s.topics.map((t, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Study Material Link */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <p className="text-muted-foreground mb-4">Access study materials for this course on our student portal.</p>
            <Link to="/portal">
              <Button variant="outline" className="font-semibold">
                <BookOpen className="w-4 h-4 mr-2" /> Go to Study Materials
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.h2 {...fadeInUp} className="section-title text-center mb-12">Our Faculty</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {faculty.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground">{f.name}</h3>
                    <p className="text-sm text-accent font-medium">{f.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{f.experience}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-primary to-rays-blue-700">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 {...fadeInUp} className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-10">Results & Achievements</motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {achievements.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5">
                  <p className="text-primary-foreground font-medium">{a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enquiry Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2 {...fadeInUp} className="section-title text-center mb-4">Enroll Now</motion.h2>
          <p className="text-center text-muted-foreground mb-10">Fill in the form below and we'll get back to you shortly.</p>
          <CourseEnquiryForm defaultCourse={defaultCourse} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-accent to-accent/80">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-display font-bold text-accent-foreground mb-6">Ready to Start Your Journey?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+919009051740">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold">
                  <Phone className="w-5 h-5 mr-2" /> Call Now
                </Button>
              </a>
              <a href={`https://wa.me/919009051740?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10 rounded-full font-semibold">
                  <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp Us
                </Button>
              </a>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10 rounded-full font-semibold">
                  Contact Us <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CoursePageTemplate;
