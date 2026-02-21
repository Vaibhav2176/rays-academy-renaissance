import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import highlightsImage from "@/assets/shankaramulani2.jpeg";

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

const Faculty = () => {
  const facultyMembers = [
    {
      name: 'Mr. Shankar Lal Amulani',
      role: 'Founder & Director',
      subject: 'Mathematics Faculty',
      experience: '30+ Years',
      image: {highlightsImage},
      description: 'The visionary behind Rays Academy, Mr. Amulani is a renowned expert in Mathematics. His guidance and passion for teaching have inspired thousands of students to achieve their academic goals.',
      isFounder: true,
    },
    {
      name: 'Rajesh Sahu',
      role: 'Head of Science Department',
      subject: 'Physics & Chemistry',
      experience: '15+ Years',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      description: 'Known for making complex scientific concepts simple, Rajesh Sir\'s dynamic teaching style inspires students to excel in Science.',
    },
    {
      name: 'Ankit Yadav',
      role: 'Senior Faculty',
      subject: 'Physics',
      experience: '10+ Years',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      description: 'Ankit Sir is passionate about physics, using real-world examples to help students understand intricate topics and solve challenging problems.',
    },
    {
      name: 'Dr. MG Ali',
      role: 'Senior Faculty',
      subject: 'Chemistry',
      experience: '20+ Years',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      description: 'With a doctorate in Chemistry, Dr. Ali brings deep academic knowledge and proven teaching methods to guide students to top scores.',
    },
    {
      name: 'Sachin Pawar',
      role: 'Faculty',
      subject: 'Biology',
      experience: '8+ Years',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
      description: 'Sachin Sir\'s engaging classes make biology come alive, ensuring students not only learn but also develop a love for the subject.',
    },
    {
      name: 'Priya Sharma',
      role: 'Faculty',
      subject: 'English',
      experience: '12+ Years',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      description: 'With expertise in English language and literature, Priya Ma\'am helps students master communication skills and excel in language examinations.',
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
              Meet Our Faculty
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Learn from the experts who are dedicated to your success
            </p>
          </motion.div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          {/* Founder Card - Featured */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[400px] lg:h-auto">
                  <img
                    src={facultyMembers[0].image}
                    alt={facultyMembers[0].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50 lg:block hidden" />
                </div>
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-accent text-accent-foreground">
                    <Award className="w-4 h-4 mr-1" />
                    Founder & Director
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                    {facultyMembers[0].name}
                  </h2>
                  <p className="text-accent font-semibold text-lg mb-2">
                    {facultyMembers[0].subject}
                  </p>
                  <p className="text-muted-foreground mb-4">
                    {facultyMembers[0].experience} of Experience
                  </p>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {facultyMembers[0].description}
                  </p>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Other Faculty Members */}
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              Our Expert Team
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mt-4">
              Passionate educators committed to excellence
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {facultyMembers.slice(1).map((faculty, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-2xl transition-all duration-500 group overflow-hidden border-0 shadow-lg">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={faculty.image}
                      alt={faculty.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-accent/90 text-accent-foreground backdrop-blur-sm">
                        {faculty.experience}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {faculty.name}
                    </h3>
                    <p className="text-accent font-semibold text-sm mb-1">
                      {faculty.subject}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      {faculty.role}
                    </p>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {faculty.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Our Faculty Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Why Learn From Us?
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { number: '50+', label: 'Combined Years Experience' },
              { number: '1000+', label: 'Students Mentored' },
              { number: '100%', label: 'Dedication' },
              { number: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm"
              >
                <div className="text-4xl font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Ready to Learn from the Best?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Rays Academy and experience the difference of quality education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="btn-primary">
                  Enroll Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline">
                  <BookOpen className="mr-2 w-5 h-5" />
                  View Courses
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Faculty;
