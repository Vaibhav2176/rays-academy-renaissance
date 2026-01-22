import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Library, Microscope, Lightbulb, FileText, Clock, Bus, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

const About = () => {
  const services = [
    { icon: FileText, title: 'Comprehensive Study Material', description: 'Our expertly curated study notes and practice sheets are designed to cover the entire syllabus and help students master every topic.' },
    { icon: Users, title: 'Doubt Clearing Sessions', description: 'Dedicated one-on-one and group sessions to address all student queries and ensure no concept is left unclear.' },
    { icon: Lightbulb, title: 'Interactive Classrooms', description: 'Our classrooms feature smart panels and are designed to facilitate interactive and engaging learning experiences.' },
    { icon: Clock, title: 'Regular Mock Tests', description: 'Weekly and monthly tests to track progress, identify weak areas, and build exam-readiness and time management skills.' },
    { icon: Library, title: 'Library Facility', description: 'Access to a well-stocked library with a vast collection of reference books and study resources for all subjects.' },
    { icon: Bus, title: 'Van Facility', description: 'Safe and convenient transportation service available for students across the city, ensuring a hassle-free commute.' },
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
              About Us
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Our Story of Dedication, Excellence, and Success
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="section-title underline-accent inline-block mb-8">Our Story</h2>
              
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Rays Academy was not just founded, it was built on a foundation of passion and a clear vision. Our journey began in <strong className="text-foreground">2006</strong>, when our founder, <strong className="text-foreground">Mr. Shankar Lal Amulani</strong>, a veteran Mathematics faculty with decades of teaching expertise, decided to create a learning space that went beyond traditional coaching.
                </p>
                <p>
                  For years, Mr. Amulani's dedication and results-oriented approach have shaped the academic journeys of countless students. He instills not just subject knowledge but also discipline, critical thinking, and problem-solving skills. Under his leadership, Rays Academy has consistently delivered a <span className="text-accent font-semibold">100% success rate</span>.
                </p>
                <p>
                  Our story is one of continuous growth, built on the trust of students and parents alike. We believe in personal attention, consistent support, and a commitment to excellence that prepares students for success not just in exams, but in life.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://github.com/Vaibhav2176/Rays-Academy/blob/main/images/director.jpg?raw=true"
                  alt="Mr. Shankar Lal Amulani - Director"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-primary-foreground">
                  <h3 className="text-2xl font-bold">Mr. Shankar Lal Amulani</h3>
                  <p className="text-primary-foreground/80">Founder & Director</p>
                </div>
              </div>
              
              {/* Stats Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground px-6 py-4 rounded-2xl shadow-xl"
              >
                <div className="text-3xl font-bold">30+</div>
                <div className="text-sm">Years Experience</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '18+', label: 'Years of Excellence' },
              { number: '1000+', label: 'Students Taught' },
              { number: '100%', label: 'Success Rate' },
              { number: '50+', label: 'Expert Faculty' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
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
              Our Services
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mt-4">
              We provide a supportive learning ecosystem designed for your success.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-accent transition-all duration-500" />
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <service.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-rays-blue-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-6">
              Want to Know More About Our Faculty?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Meet our experienced team of educators who are dedicated to your success.
            </p>
            <Link to="/faculty">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-full">
                Meet Our Faculty
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
