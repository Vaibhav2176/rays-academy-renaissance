import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, GraduationCap, Users, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import rsatBanner from '@/assets/rsat.jpeg';

const REGISTRATION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSebAm-yx-Xa6QucJcI9Uq_BIRVOxvF1hFvRnPALf8Srg-bMTQ/viewform';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const RSAT = () => {
  const highlights = [
    { icon: Award, title: 'Up to 50% Scholarship', description: 'Avail scholarships up to 50% on tuition fees for all classes.' },
    { icon: Users, title: 'Classes 6th to 12th', description: 'Open for students from Class 6th to 8th and 9th to 12th.' },
    { icon: Calendar, title: '10th March 2026', description: 'Test scheduled on 10th March 2026 at 4:00 PM.' },
    { icon: BookOpen, title: 'Limited Seats', description: 'Register early as seats are limited for this scholarship test.' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-primary via-rays-blue-700 to-primary overflow-hidden">
        <div className="absolute top-10 left-10 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-rays-blue-400/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-6">
                <GraduationCap className="w-4 h-4" />
                Scholarship Test 2026
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
                RSAT
                <span className="block text-accent text-2xl md:text-3xl mt-2">
                  Rays Scholarship Admission Test
                </span>
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-4">
                Unlock your potential with Rays Academy's scholarship test. Get up to <strong className="text-accent">50% scholarship</strong> on tuition fees for all classes.
              </p>
              <div className="flex items-center gap-6 text-primary-foreground/90 mb-8 text-sm">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" /> 10th March 2026</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent" /> 4:00 PM</span>
              </div>
              <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-full shadow-xl shadow-accent/30">
                  Register Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <img
                src={rsatBanner}
                alt="RSAT Banner"
                className="w-full max-w-md rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <motion.h2
            {...fadeInUp}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-center mb-12"
          >
            Why Take <span className="text-accent">RSAT</span>?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full text-center p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-t-accent">
                  <CardContent className="p-0">
                    <item.icon className="w-10 h-10 mx-auto text-accent mb-4" />
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary via-rays-blue-700 to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-accent rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-rays-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Don't Miss This Opportunity!
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Limited seats available. Register now and secure your chance at up to 50% scholarship.
            </p>
            <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-6 rounded-full shadow-xl shadow-accent/30">
                Fill Registration Form
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RSAT;
