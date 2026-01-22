import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Trophy, Library, Bus, FileText, Star, Sparkles, GraduationCap, Monitor, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

const Index = () => {
  const features = [
    { icon: Library, title: 'Library Facility', description: 'Well-stocked library with reference materials and books for all subjects.' },
    { icon: Bus, title: 'Van Facility', description: 'Safe and convenient transport facility for students across the city.' },
    { icon: FileText, title: 'Study Material', description: 'Comprehensive study notes and practice sheets for every subject.' },
    { icon: Trophy, title: 'Proven Results', description: 'Delivering 100% success rate consistently since 2006.' },
  ];

  const courses = [
    { title: '6th – 8th (Foundation)', description: 'All subjects – Maths, Science, English, Social Science.' },
    { title: '9th – 10th (Concept Clarity)', description: 'CBSE | ICSE | ISC | MP Board – Special focus on Science & Maths.' },
    { title: '11th – 12th (Scholar\'s Batch)', description: 'Maths | Physics | Chemistry | Biology | Applied Maths.' },
    { title: 'IIT–JEE', description: 'Complete preparation for Mains & Advanced with test series.' },
    { title: 'NEET', description: 'Full syllabus coverage with NCERT emphasis & mock tests.' },
    { title: 'NDA', description: 'Specialized coaching for NDA written & SSB interview guidance.' },
    { title: 'CUET', description: 'Crash courses & full-time coaching for Common University Entrance Test.' },
    { title: 'Olympiads', description: 'Maths, Science, and GK Olympiads for national & international levels.' },
  ];

  const highlights = [
    { icon: Users, title: 'Experienced Faculty', description: 'Learn from experts with 3 to 33+ years of teaching excellence.' },
    { icon: Sparkles, title: 'Free Trial Classes', description: 'Enjoy 5 days of free trial classes to experience our quality teaching.' },
    { icon: Monitor, title: 'AC Classrooms & CCTV', description: 'Study in modern classrooms with AC, smart panels, and surveillance.' },
    { icon: Heart, title: 'Personal Attention', description: 'Individual focus, doubt clearing sessions, and regular tests.' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://github.com/Vaibhav2176/Rays-Academy/blob/main/images/background.jpg?raw=true')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rays-blue-400/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-sm font-medium">
                <Star className="w-4 h-4 text-accent" />
                Trusted by 1000+ Students Since 2006
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Welcome to{' '}
              <span className="text-accent">Rays</span>{' '}
              <span className="text-rays-blue-400">Academy</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto font-light">
              A Place Where We Create Future for Tomorrow
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about">
                <Button size="lg" className="btn-primary text-lg px-10 py-6">
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent">
                  Join Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="section-title underline-accent inline-block">About Us</h2>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                <strong className="text-foreground">Rays Academy</strong>, established in 2006, is one of the most trusted coaching institutes in Bhopal, dedicated to providing quality education to students from classes 6th to 12th. With a legacy of <span className="text-accent font-semibold">100% result success every year</span>, we believe in nurturing young minds with discipline, dedication, and personal care.
              </p>
              <p>
                Under the guidance of our experienced director, <strong className="text-foreground">Mr. Shankar Lal Amulani</strong>—a leading Mathematics faculty with decades of teaching expertise—Rays Academy has shaped the academic journey of countless students.
              </p>
              <p>
                Apart from regular classroom sessions, we provide subject-wise study material, a well-equipped library facility, and safe van facility for student convenience.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <Card className="h-full border-l-4 border-l-primary hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute -left-40 top-20 w-80 h-80 bg-rays-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute -right-40 bottom-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              📘 Classes & Competitive Exams
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mt-4">
              From school-level subjects to national-level competitive exams, we provide expert coaching tailored for every student's success.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {courses.map((course, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className="h-full group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-card shadow-lg">
                  <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-rays-blue-600 to-accent transition-all duration-500" />
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-primary group-hover:text-accent transition-colors mb-3">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link to="/courses">
              <Button size="lg" className="btn-primary">
                View All Courses
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
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
              🌟 Our Key Features
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mt-4">
              Why students choose Rays Academy
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://github.com/Vaibhav2176/Rays-Academy/blob/main/images/main.png?raw=true"
                  alt="Rays Academy Students"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>
              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground px-6 py-4 rounded-2xl shadow-xl"
              >
                <div className="text-3xl font-bold">18+</div>
                <div className="text-sm">Years of Excellence</div>
              </motion.div>
            </motion.div>

            {/* Features Cards */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                >
                  <Card className="h-full text-center p-6 hover:shadow-xl hover:border-accent/50 transition-all duration-300 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-rays-blue-600 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-0 relative z-10">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                        <item.icon className="w-10 h-10 mx-auto text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-foreground transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm group-hover:text-primary-foreground/80 transition-colors">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-rays-blue-700 to-primary" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-accent rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-rays-blue-400 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <GraduationCap className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10">
              Join thousands of successful students who have achieved their dreams with Rays Academy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-full shadow-xl shadow-accent/30">
                  Enroll Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent rounded-full">
                  Book Free Trial
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
