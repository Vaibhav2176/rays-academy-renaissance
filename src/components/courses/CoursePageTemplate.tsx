import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import SEO from '@/components/shared/SEO';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight, Phone, CheckCircle2, BookOpen, Clock,
  MapPin, Trophy, Sparkles, FileText, Star, GraduationCap,
} from 'lucide-react';
import CourseEnquiryForm from './CourseEnquiryForm';
import { getFacultyForSubjects, SubjectKey } from '@/data/facultyData';
import { getStudyMaterialPath } from '@/lib/courseLinks';
import RelatedResources from '@/components/shared/RelatedResources';

interface SyllabusItem {
  heading: string;
  description?: string;
  topics: string[];
}

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
  syllabus: SyllabusItem[];
  /** Keys from SubjectKey union — used to auto-filter shared faculty data */
  facultySubjects: SubjectKey[];
  achievements?: string[];
  defaultCourse: string;
  gradientClass?: string;
  /** Canonical path for this course page (always the /courses/<slug> form). */
  canonicalPath?: string;
}

/* ─── Animation Variants ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = (delay = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
});

/* Subject colour palette – cycles through so more than 3 subjects still look great */
const subjectPalette = [
  {
    bar: 'from-blue-500 to-blue-700',
    icon: 'bg-blue-500/10 text-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    ring: 'hover:ring-blue-300',
  },
  {
    bar: 'from-emerald-500 to-emerald-700',
    icon: 'bg-emerald-500/10 text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    ring: 'hover:ring-emerald-300',
  },
  {
    bar: 'from-violet-500 to-violet-700',
    icon: 'bg-violet-500/10 text-violet-600',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
    ring: 'hover:ring-violet-300',
  },
  {
    bar: 'from-orange-500 to-orange-700',
    icon: 'bg-orange-500/10 text-orange-600',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
    ring: 'hover:ring-orange-300',
  },
  {
    bar: 'from-pink-500 to-pink-700',
    icon: 'bg-pink-500/10 text-pink-600',
    badge: 'bg-pink-50 text-pink-700 border-pink-200',
    dot: 'bg-pink-500',
    ring: 'hover:ring-pink-300',
  },
];

/** Default subject description if none provided in data */
const defaultSubjectDescription = (heading: string) =>
  `Master all essential concepts and problem-solving techniques in ${heading} with structured lessons and regular practice.`;

const achievementIcons = [Trophy, Star, GraduationCap, Sparkles, Trophy, Star];

const CoursePageTemplate = ({
  title, seoTitle, metaDescription, heroDescription, badge,
  whyChoose, subjects, duration, batchTimings, mode,
  syllabus, facultySubjects, achievements, defaultCourse,
  gradientClass = 'from-primary via-rays-blue-700 to-primary',
  canonicalPath,
}: CoursePageProps) => {

  const courseFaculty = getFacultyForSubjects(facultySubjects);
  const { pathname } = useLocation();
  const canonical = canonicalPath ?? pathname;

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description: metaDescription,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Rays Academy',
      sameAs: 'https://www.raysacademybhopal.in/',
    },
  };

  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in ${defaultCourse} at Rays Academy.`);

  return (
    <div className="overflow-hidden">
      <SEO title={seoTitle} description={metaDescription} canonical={canonical} jsonLd={courseSchema} />

      {/* ─── Hero ─── */}
      <section className="relative min-h-[58vh] flex items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center pt-24 pb-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger(0.15)}
          >
            <motion.div variants={fadeInUp}>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-5 text-sm px-4 py-1.5">
                {badge}
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            >
              {heroDescription}
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            >
              <a href="#enquiry-form">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 rounded-full font-semibold shadow-xl shadow-black/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 px-8"
                >
                  Enroll Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <a href="tel:+919303333490">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/70 text-white hover:bg-white hover:text-primary bg-white/10 backdrop-blur-sm rounded-full font-semibold transition-all duration-300 hover:scale-105 px-8"
                >
                  <Phone className="w-5 h-5 mr-2" /> Call Now
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Why Choose ─── */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="section-title">Why Choose Rays Academy?</h2>
            <p className="section-subtitle mt-3">What makes our {defaultCourse} program stand out</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger(0.07)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
          >
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                variants={i % 2 === 0 ? fadeInLeft : fadeInRight}
                whileHover={{ scale: 1.02, translateY: -2 }}
                className="flex items-start gap-3 p-5 rounded-xl bg-card shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 cursor-default"
              >
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground text-sm leading-relaxed font-medium">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Course Details ─── */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="section-title">Course Details</h2>
            <p className="section-subtitle mt-3">Everything you need to know about this program</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger(0.1)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { icon: BookOpen, label: 'Subjects', value: subjects.join(', '), color: 'bg-blue-500/10 text-blue-600' },
              { icon: Clock, label: 'Duration', value: duration, color: 'bg-emerald-500/10 text-emerald-600' },
              { icon: GraduationCap, label: 'Batch Timings', value: batchTimings, color: 'bg-violet-500/10 text-violet-600' },
              { icon: MapPin, label: 'Mode', value: mode, color: 'bg-orange-500/10 text-orange-600' },
            ].map((d, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ scale: 1.04, translateY: -4 }}
              >
                <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-7">
                    <div className={`w-14 h-14 rounded-2xl ${d.color} flex items-center justify-center mx-auto mb-4`}>
                      <d.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2 text-base">{d.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{d.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Syllabus Overview ─── */}
      <section className="py-24 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="section-title">📚 Syllabus Overview</h2>
            <p className="section-subtitle mt-3">
              Comprehensive topic-by-topic coverage designed for exam success
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger(0.12)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {syllabus.map((s, i) => {
              const palette = subjectPalette[i % subjectPalette.length];
              const description = s.description || defaultSubjectDescription(s.heading);
              return (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  whileHover={{ scale: 1.03, translateY: -6 }}
                  className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 ring-2 ring-transparent ${palette.ring} hover:ring-2 bg-card`}
                >
                  {/* Coloured top bar */}
                  <div className={`h-2 w-full bg-gradient-to-r ${palette.bar}`} />

                  {/* Icon + Subject header */}
                  <div className={`px-6 pt-6 pb-4 border-b border-border/40`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${palette.icon}`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground leading-tight">{s.heading}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium inline-block mt-0.5 ${palette.badge}`}>
                          {s.topics.length} Topics
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </div>

                  {/* Topics list */}
                  <div className="px-6 py-5">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Key Topics Covered
                    </p>
                    <ul className="space-y-2.5">
                      {s.topics.map((t, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-foreground/80">
                          <div className={`w-2 h-2 rounded-full ${palette.dot} mt-1.5 shrink-0`} />
                          <span className="leading-relaxed font-medium">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Study Material ─── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeInUp}
          >
            <Card className="border-0 shadow-xl max-w-4xl mx-auto overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary" />
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-foreground mb-2">📖 {defaultCourse} Study Material</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Access chapter-wise notes, important questions, sample papers and previous year questions for {defaultCourse} — prepared by Rays Academy faculty. First 2 chapters of every subject are completely free.
                    </p>
                  </div>
                  <Link to={getStudyMaterialPath(defaultCourse)}>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full whitespace-nowrap hover:scale-105 hover:shadow-lg transition-all duration-300">
                      <BookOpen className="w-4 h-4 mr-2" /> View Study Material
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ─── Related Resources ─── */}
      <RelatedResources
        heading={`Related Resources for ${defaultCourse}`}
        resources={[
          { title: `${defaultCourse} Study Material`, description: 'Chapter-wise notes, free + premium content.', href: getStudyMaterialPath(defaultCourse) },
          { title: 'Previous Year Questions', description: 'Solved PYQs across boards & entrance exams.', href: '/study-material/previous-year-questions' },
          { title: 'Sample Papers', description: 'Latest pattern sample papers for practice.', href: '/study-material/sample-papers' },
        ]}
      />

      {/* ─── Faculty ─── */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="section-title">👨‍🏫 Our Expert Faculty</h2>
            <p className="section-subtitle mt-3">Learn from the best educators in Bhopal</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger(0.1)}
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              courseFaculty.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-3xl mx-auto'
            } gap-8 max-w-5xl mx-auto`}
          >
            {courseFaculty.map((f) => (
              <motion.div
                key={f.id}
                variants={scaleIn}
                whileHover={f.comingSoon ? {} : { scale: 1.03, translateY: -6 }}
              >
                {f.comingSoon ? (
                  /* ── Coming Soon Placeholder Card ── */
                  <Card className="h-full border-2 border-dashed border-primary/20 shadow-sm bg-gradient-to-br from-secondary/40 to-background group overflow-hidden">
                    {/* Placeholder photo area */}
                    <div className="relative h-60 bg-gradient-to-br from-primary/5 to-secondary/50 flex flex-col items-center justify-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                        <GraduationCap className="w-10 h-10 text-primary/40" />
                      </div>
                      <Badge className="bg-amber-500/15 text-amber-700 border border-amber-400/40 text-xs font-semibold">
                        🔔 Coming Soon
                      </Badge>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg font-bold text-foreground/70 mb-0.5">{f.subject} Faculty</h3>
                      <p className="text-primary/60 font-semibold text-sm mb-1">{f.subject}</p>
                      <p className="text-muted-foreground text-xs mb-3 italic">Position to be filled soon</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                    </CardContent>
                  </Card>
                ) : (
                  /* ── Regular Faculty Card ── */
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                    {/* Photo */}
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={f.image}
                        alt={f.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                      {/* Experience badge on photo */}
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-accent text-white text-xs font-semibold shadow-lg">
                          {f.experience}
                        </Badge>
                      </div>
                      {/* Founder badge */}
                      {f.isFounder && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary text-white text-xs font-semibold shadow-lg">
                            Founder
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors duration-300">
                        {f.name}
                      </h3>
                      <p className="text-accent font-semibold text-sm mb-1">{f.subject}</p>
                      <p className="text-muted-foreground text-xs mb-3">{f.role}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{f.description}</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Link to="/faculty">
              <Button variant="outline" className="rounded-full font-semibold border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 px-8 py-2.5">
                Meet All Faculty <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Results & Achievements ─── */}
      {achievements && achievements.length > 0 && (
        <section className="py-24 bg-gradient-to-r from-primary to-rays-blue-700 relative overflow-hidden">
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger(0.12)}
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                  🏆 Results & Achievements
                </h2>
                <p className="text-white/75 mb-12 max-w-xl mx-auto text-base">
                  Our students consistently deliver outstanding results year after year
                </p>
              </motion.div>

              <div className={`grid grid-cols-1 sm:grid-cols-2 ${achievements.length % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-3xl mx-auto'} gap-6 max-w-4xl mx-auto mb-10`}>
                {achievements.map((a, i) => {
                  const Icon = achievementIcons[i % achievementIcons.length];
                  return (
                    <motion.div
                      key={i}
                      variants={scaleIn}
                      whileHover={{ scale: 1.05, translateY: -4 }}
                      className="bg-white/15 backdrop-blur-sm rounded-2xl p-7 border border-white/20 hover:bg-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-300 group cursor-default"
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-white font-semibold text-base leading-relaxed">{a}</p>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div variants={fadeInUp}>
                <Link to="/results">
                  {/* HIGH CONTRAST button - white solid so it's always readable */}
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100 font-bold rounded-full px-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    View Full Results <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── Enquiry Form ─── */}
      <section id="enquiry-form" className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            className="text-center mb-8"
          >
            <h2 className="section-title">📝 Enroll Now</h2>
            <p className="section-subtitle mt-3">Fill in the form below and we'll get back to you shortly</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <CourseEnquiryForm defaultCourse={defaultCourse} />
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 bg-gradient-to-r from-primary via-rays-blue-700 to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-10 w-40 h-40 bg-accent rounded-full blur-2xl" />
          <div className="absolute bottom-5 right-10 w-60 h-60 bg-rays-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger(0.15)}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/80 mb-10 max-w-xl mx-auto">
              Join Rays Academy and take the first step towards academic excellence.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+919303333490">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white rounded-full font-bold shadow-lg shadow-accent/30 hover:scale-105 hover:shadow-xl transition-all duration-300 px-8"
                >
                  <Phone className="w-5 h-5 mr-2" /> Call Now
                </Button>
              </a>
              <a href={`https://wa.me/919303333490?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 px-8"
                >
                  <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 mr-2" /> WhatsApp Us
                </Button>
              </a>
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 px-8"
                >
                  Contact Us <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CoursePageTemplate;
