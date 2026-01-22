import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Atom, Calculator, Brain, Target, Shield, GraduationCap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Courses = () => {
  const schoolCourses = [
    {
      title: '6th – 8th (Foundation Batch)',
      icon: BookOpen,
      description: 'Building strong fundamentals for future success',
      subjects: ['Mathematics', 'Science', 'English', 'Social Science'],
      features: ['Concept clarity', 'Regular assessments', 'Activity-based learning'],
      badge: 'Foundation',
    },
    {
      title: '9th – 10th (Concept Clarity)',
      icon: Calculator,
      description: 'Board exam preparation with special focus',
      subjects: ['Mathematics', 'Science', 'English', 'Social Science'],
      features: ['CBSE/ICSE/MP Board', 'Board exam focus', 'Practice papers'],
      badge: 'Board Prep',
    },
    {
      title: '11th – 12th (Scholar\'s Batch)',
      icon: Atom,
      description: 'Advanced learning for higher studies',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Applied Maths'],
      features: ['Stream-wise batches', 'Practical sessions', 'Career guidance'],
      badge: 'Advanced',
    },
  ];

  const competitiveExams = [
    {
      title: 'IIT-JEE',
      icon: Target,
      description: 'Complete preparation for engineering aspirants',
      details: 'JEE Main & Advanced preparation with comprehensive test series, doubt clearing, and problem-solving techniques.',
      features: ['Mains + Advanced', 'Daily practice', 'Mock tests'],
      badge: 'Engineering',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'NEET',
      icon: Brain,
      description: 'Medical entrance exam coaching',
      details: 'Full syllabus coverage with NCERT emphasis, biology focus, and extensive mock tests.',
      features: ['NCERT based', 'Biology focus', 'Medical guidance'],
      badge: 'Medical',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'NDA',
      icon: Shield,
      description: 'Defense services preparation',
      details: 'Specialized coaching for NDA written exam along with SSB interview preparation and guidance.',
      features: ['Written + SSB', 'Physical training', 'Personality development'],
      badge: 'Defense',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'CUET',
      icon: GraduationCap,
      description: 'University entrance preparation',
      details: 'Crash courses and full-time coaching for Common University Entrance Test.',
      features: ['All streams', 'Crash courses', 'Full-time batch'],
      badge: 'University',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-rays-blue-700 to-primary" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rays-blue-400/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6">
              Our Courses
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              From school-level subjects to competitive exam preparation, we've got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* School Courses Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              📚 School Programs
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mt-4">
              Comprehensive coaching for CBSE, ICSE, ISC, and MP Board students
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {schoolCourses.map((course, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-2xl transition-all duration-500 group overflow-hidden border-0 shadow-lg">
                  <div className="h-2 w-full bg-gradient-to-r from-primary to-accent" />
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <course.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        {course.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Subjects:</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.subjects.map((subject, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {course.features.map((feature, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Competitive Exams Section */}
      <section className="py-24 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              🎯 Competitive Exams
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mt-4">
              Expert coaching for national-level entrance examinations
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {competitiveExams.map((exam, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-2xl transition-all duration-500 group overflow-hidden border-0 shadow-lg">
                  <div className={`h-2 w-full bg-gradient-to-r ${exam.color}`} />
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${exam.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <exam.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {exam.title}
                          </h3>
                          <Badge className={`bg-gradient-to-r ${exam.color} text-white border-0`}>
                            {exam.badge}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {exam.details}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {exam.features.map((feature, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Olympiads Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-rays-blue-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary-foreground"
            >
              <Badge className="bg-accent text-accent-foreground mb-4">Special Program</Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                🏆 Olympiad Preparation
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-6">
                Prepare for national and international Olympiads in Mathematics, Science, and General Knowledge.
              </p>
              <ul className="space-y-3 mb-8">
                {['Math Olympiad (IMO, RMO)', 'Science Olympiad (NSO, ISO)', 'GK & English Olympiads', 'Expert problem-solving techniques'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                  Enquire Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Target, label: 'Focused Training' },
                { icon: Clock, label: 'Flexible Timing' },
                { icon: BookOpen, label: 'Study Material' },
                { icon: GraduationCap, label: 'Expert Guidance' },
              ].map((item, i) => (
                <div key={i} className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <item.icon className="w-10 h-10 text-accent mx-auto mb-3" />
                  <span className="text-primary-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Not Sure Which Course is Right for You?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get in touch with us for personalized guidance and free counseling session.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="btn-primary">
                  Contact Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/faculty">
                <Button size="lg" variant="outline">
                  Meet Our Faculty
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
