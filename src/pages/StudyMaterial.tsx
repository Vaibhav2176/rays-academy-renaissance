import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Download, Award, Star, Users, Target, Lightbulb, Phone, MessageCircle, GraduationCap, ChevronRight, Sparkles, Calculator, FlaskConical, BookMarked, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const StudyMaterial = () => {
  useEffect(() => {
    document.title = 'Free & Premium Study Material for Classes 6–12, IIT-JEE, NEET, NDA & CUET | Rays Academy Bhopal';
    const desc = document.querySelector('meta[name="description"]');
    const content = 'Download free and premium study material, notes, sample papers, formula sheets & PYQs for Classes 6–12, IIT-JEE, NEET, NDA & CUET by Rays Academy Bhopal.';
    if (desc) desc.setAttribute('content', content);
    else { const m = document.createElement('meta'); m.name = 'description'; m.content = content; document.head.appendChild(m); }
  }, []);

  const classCards = [
    { title: 'Classes 6–8', desc: 'Foundation study material for Maths, Science, English & SST', path: '/study-material/class-6-8', icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Class 9', desc: 'CBSE, ICSE & MP Board chapter-wise notes', path: '/study-material/class-9', icon: BookMarked, color: 'bg-indigo-500' },
    { title: 'Class 10', desc: 'Board exam focused study material with PYQs', path: '/study-material/class-10', icon: GraduationCap, color: 'bg-purple-500' },
    { title: 'Class 11', desc: 'PCM/PCB study material for boards & entrance', path: '/study-material/class-11', icon: FlaskConical, color: 'bg-teal-500' },
    { title: 'Class 12', desc: 'Board + competitive exam preparation notes', path: '/study-material/class-12', icon: Award, color: 'bg-orange-500' },
    { title: 'IIT-JEE', desc: 'JEE Main & Advanced preparation material', path: '/study-material/iit-jee', icon: Calculator, color: 'bg-red-500' },
    { title: 'NEET', desc: 'Medical entrance exam study material', path: '/study-material/neet', icon: Target, color: 'bg-green-500' },
    { title: 'NDA', desc: 'NDA written exam preparation material', path: '/study-material/nda', icon: Star, color: 'bg-amber-600' },
    { title: 'CUET', desc: 'CUET exam preparation study material', path: '/study-material/cuet', icon: Globe, color: 'bg-cyan-600' },
  ];

  const resources = [
    { title: 'Previous Year Questions', desc: 'Solved PYQs for boards & entrance exams', path: '/study-material/previous-year-questions', icon: FileText },
    { title: 'Sample Papers', desc: 'Practice with model question papers', path: '/study-material/sample-papers', icon: BookMarked },
    { title: 'Formula Sheets', desc: 'Quick revision formula sheets for all subjects', path: '/study-material/formula-sheets', icon: Calculator },
    { title: 'Important Questions', desc: 'High-weightage questions for exam prep', path: '/study-material/important-questions', icon: Star },
    { title: 'Revision Notes', desc: 'Concise chapter-wise revision notes', path: '/study-material/revision-notes', icon: Sparkles },
  ];

  const ncertClasses = [
    { title: 'Class 6 NCERT', path: '/study-material/ncert/class-6' },
    { title: 'Class 7 NCERT', path: '/study-material/ncert/class-7' },
    { title: 'Class 8 NCERT', path: '/study-material/ncert/class-8' },
    { title: 'Class 9 NCERT', path: '/study-material/ncert/class-9' },
    { title: 'Class 10 NCERT', path: '/study-material/ncert/class-10' },
    { title: 'Class 11 NCERT', path: '/study-material/ncert/class-11' },
    { title: 'Class 12 NCERT', path: '/study-material/ncert/class-12' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
            <Badge className="bg-accent text-accent-foreground mb-4">📚 Study Material Hub</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Free & Premium Study Material for Classes 6–12 and Competitive Exams
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Expert-prepared, chapter-wise study notes, sample papers, formula sheets & previous year questions by Rays Academy Bhopal's experienced faculty.
            </p>
            <a href="#courses">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full shadow-lg">
                <BookOpen className="w-5 h-5 mr-2" /> Explore Material
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Course/Class Cards */}
      <section id="courses" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Study Material by Class & Exam</h2>
            <p className="text-muted-foreground">Choose your class or competitive exam to access chapter-wise study material</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {classCards.map((card, idx) => (
              <motion.div key={card.path} {...fadeInUp} transition={{ delay: idx * 0.05 }}>
                <Link to={card.path} className="block h-full">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-border">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{card.desc}</p>
                      <span className="text-sm font-medium text-primary flex items-center gap-1">
                        Explore <ChevronRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Resources */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Important Resources</h2>
            <p className="text-muted-foreground">Quick access to essential exam preparation resources</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {resources.map((res, idx) => (
              <motion.div key={res.path} {...fadeInUp} transition={{ delay: idx * 0.05 }}>
                <Link to={res.path} className="block h-full">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group">
                    <CardContent className="p-5">
                      <res.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                      <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{res.title}</h3>
                      <p className="text-xs text-muted-foreground">{res.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NCERT Books */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Free NCERT Books Download</h2>
            <p className="text-muted-foreground">Access NCERT textbooks organized class-wise</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {ncertClasses.map((item, idx) => (
              <motion.div key={item.path} {...fadeInUp} transition={{ delay: idx * 0.05 }}>
                <Link to={item.path}>
                  <Button variant="outline" className="rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all">
                    <Download className="w-4 h-4 mr-2" /> {item.title}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Study Material */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Why Our Study Material is the Best</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, title: 'Expert Faculty Prepared', desc: 'Created by teachers with 3–33+ years of experience who understand exam patterns deeply.' },
              { icon: BookOpen, title: 'Structured Chapter-wise', desc: 'Every topic covered systematically with theory, solved examples, and practice problems.' },
              { icon: Target, title: 'Exam-Oriented Content', desc: 'Focused on high-weightage topics, previous year patterns, and scoring strategies.' },
              { icon: Lightbulb, title: 'Concept Clarity First', desc: 'Clear explanations with diagrams, flowcharts, and step-by-step solutions.' },
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp} transition={{ delay: idx * 0.1 }}>
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
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

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Get Full Access to All Study Material</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join Rays Academy for expert guidance, comprehensive study material, and proven results since 2006.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ContactButton label="Join Rays Academy" />
              <WhatsAppButton />
              <ContactButton label="Contact Us" className="bg-white !text-primary hover:bg-gray-100 shadow-white/20" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StudyMaterial;
