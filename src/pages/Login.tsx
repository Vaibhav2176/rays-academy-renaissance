import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-rays-blue-700 to-primary relative overflow-hidden pt-20">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-rays-blue-400/20 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="w-9 h-9 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-1">
              Sign in to your Rays Academy account
            </p>
          </div>

          {/* Coming Soon Message */}
          <div className="bg-accent/10 rounded-2xl p-6 text-center mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              🚀 Coming Soon!
            </h2>
            <p className="text-muted-foreground text-sm">
              Student login portal is under development. We're working hard to bring you a seamless experience.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-4">
              For immediate assistance, please contact us:
            </p>
            <Link to="/contact">
              <Button className="w-full btn-primary">
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
