import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Calendar, FileText, Bell, ArrowRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Portal = () => {
  const features = [
    { icon: BookOpen, title: 'Study Materials', description: 'Access your course materials and notes' },
    { icon: Calendar, title: 'Class Schedule', description: 'View your upcoming classes and tests' },
    { icon: FileText, title: 'Test Results', description: 'Check your performance and progress' },
    { icon: Bell, title: 'Announcements', description: 'Stay updated with latest news' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-rays-blue-700 to-primary relative overflow-hidden pt-24 pb-12">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-rays-blue-400/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-rays-blue-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
            Student Portal
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Your one-stop destination for all academic resources
          </p>
        </motion.div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">🎓</div>
              <CardTitle className="text-3xl font-display">Portal Coming Soon!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-lg mb-6">
                We're building an amazing student portal with all the features you need. Stay tuned for updates!
              </p>
              <div className="bg-accent/10 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4">What to expect:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{feature.title}</h4>
                        <p className="text-muted-foreground text-xs">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="btn-primary">
                    Contact for Access
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { number: '1000+', label: 'Active Students' },
            { number: '50+', label: 'Expert Faculty' },
            { number: '100%', label: 'Success Rate' },
            { number: '18+', label: 'Years Experience' },
          ].map((stat, index) => (
            <Card key={index} className="bg-primary-foreground/10 border-0 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">{stat.number}</div>
                <div className="text-primary-foreground/80 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Portal;
