import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Phone, CheckCircle2, BookOpen, Clock, Users, MapPin, Trophy, Sparkles, FileText } from 'lucide-react';
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
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
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

  const achievementIcons = [Trophy, Sparkles, Trophy, Sparkles, Trophy, Sparkles];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rays-blue-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="bg-accent text-accent-foreground mb-4 text-sm">{badge}</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6">{title}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">{heroDescription}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="#enquiry-form">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full font-semibold shadow-lg">
                  Enroll Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="tel:+919303333490">
                <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent rounded-full font-semibold">
                  <Phone className="w-5 h-5 mr-2" /> Call Now
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="section-title">Why Choose Rays Academy?</h2>
            <p className="section-subtitle mt-3">What makes our {defaultCourse} program stand out</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {whyChoose.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex items-start gap-3 p-5 rounded-xl bg-card shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-border/50"
              >
                <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-foreground text-sm leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Details */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="section-title">Course Details</h2>
            <p className="section-subtitle mt-3">Everything you need to know about this program</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: BookOpen, label: 'Subjects', value: subjects.join(', '), color: 'bg-blue-500/10 text-blue-600' },
              { icon: Clock, label: 'Duration', value: duration, color: 'bg-green-500/10 text-green-600' },
              { icon: Users, label: 'Batch Timings', value: batchTimings, color: 'bg-purple-500/10 text-purple-600' },
              { icon: MapPin, label: 'Mode', value: mode, color: 'bg-orange-500/10 text-orange-600' },
            ].map((d, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl ${d.color} flex items-center justify-center mx-auto mb-4`}>
                      <d.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{d.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{d.value}</p>
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
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="section-title">📚 Syllabus Overview</h2>
            <p className="section-subtitle mt-3">Comprehensive coverage of all important topics</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {syllabus.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="h-1.5 w-full bg-gradient-to-r from-primary to-accent" />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg text-primary">{s.heading}</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {s.topics.map((t, j) => (
                        <li key={j} className="text-sm text-muted-foreground flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                          <span className="leading-relaxed">{t}</span>
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

      {/* Study Material */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp}>
            <Card className="border-0 shadow-lg max-w-4xl mx-auto overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-foreground mb-2">📖 Study Material & Resources</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Access comprehensive study notes, practice papers, and curated resources for {defaultCourse} on our student portal. Stay ahead with regularly updated materials.
                    </p>
                  </div>
                  <Link to="/portal">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full whitespace-nowrap">
                      <BookOpen className="w-4 h-4 mr-2" /> Explore Materials
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="section-title">👨‍🏫 Our Expert Faculty</h2>
            <p className="section-subtitle mt-3">Learn from the best educators in Bhopal</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {faculty.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">{f.name}</h3>
                    <Badge className="mt-2 bg-accent/10 text-accent border-accent/20">{f.subject}</Badge>
                    <p className="text-xs text-muted-foreground mt-3">{f.experience}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeInUp} className="text-center mt-8">
            <Link to="/faculty">
              <Button variant="outline" className="rounded-full font-semibold">
                View All Faculty <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-primary to-rays-blue-700">
          <div className="container mx-auto px-4 text-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">🏆 Results & Achievements</h2>
              <p className="text-primary-foreground/70 mb-10 max-w-xl mx-auto">Our students consistently deliver outstanding results</p>
            </motion.div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${achievements.length % 2 === 0 ? '' : 'lg:grid-cols-3'} gap-6 max-w-4xl mx-auto`}>
              {achievements.map((a, i) => {
                const Icon = achievementIcons[i % achievementIcons.length];
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-primary-foreground/15 transition-colors duration-300 group"
                  >
                    <Icon className="w-8 h-8 text-accent mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-primary-foreground font-medium leading-relaxed">{a}</p>
                  </motion.div>
                );
              })}
            </div>
            <motion.div {...fadeInUp} className="mt-8">
              <Link to="/results">
                <Button variant="outline" className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  View Full Results <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Enquiry Form */}
      <section id="enquiry-form" className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-4">
            <h2 className="section-title">📝 Enroll Now</h2>
            <p className="section-subtitle mt-3">Fill in the form below and we'll get back to you shortly</p>
          </motion.div>
          <motion.div {...fadeInUp}>
            <CourseEnquiryForm defaultCourse={defaultCourse} />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary via-rays-blue-700 to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-10 w-40 h-40 bg-accent rounded-full blur-2xl" />
          <div className="absolute bottom-5 right-10 w-60 h-60 bg-rays-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Join Rays Academy and take the first step towards academic excellence.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+919303333490">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full font-semibold shadow-lg shadow-accent/30">
                  <Phone className="w-5 h-5 mr-2" /> Call Now
                </Button>
              </a>
              <a href={`https://wa.me/919303333490?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow-lg">
                  <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 mr-2" /> WhatsApp Us
                </Button>
              </a>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent rounded-full font-semibold">
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
