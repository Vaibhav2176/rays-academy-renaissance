import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/Rays Academy LOGO.jpg'
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Results', path: '/results' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg py-2'
          : 'bg-transparent py-4'
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
              src={logo}
              alt="Rays Academy Logo"
              className="w-12 h-12 object-contain rounded-md"
            />
            </div>
            <div className="hidden sm:block">
              <h1 className={cn(
                "text-xl font-bold transition-colors",
                scrolled ? "text-primary" : "text-primary-foreground"
              )}>
                Rays Academy
              </h1>
              <p className={cn(
                "text-xs font-medium -mt-0.5 transition-colors",
                scrolled ? "text-muted-foreground" : "text-primary-foreground/80"
              )}>
                Excellence Since 2006
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                  location.pathname === link.path
                    ? scrolled
                      ? 'text-accent'
                      : 'text-accent'
                    : scrolled
                      ? 'text-foreground hover:text-accent hover:bg-accent/10'
                      : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10'
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="ghost"
                className={cn(
                  'font-semibold transition-colors',
                  scrolled
                    ? 'text-primary hover:text-accent'
                    : 'text-primary-foreground hover:text-accent hover:bg-primary-foreground/10'
                )}
              >
                Login
              </Button>
            </Link>
            <Link to="/portal">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full px-6 shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all">
                Student Portal
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'lg:hidden p-2 rounded-lg transition-colors',
              scrolled
                ? 'text-foreground hover:bg-muted'
                : 'text-primary-foreground hover:bg-primary-foreground/10'
            )}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={cn(
                        'block px-4 py-3 rounded-lg font-medium transition-all',
                        location.pathname === link.path
                          ? 'bg-accent text-accent-foreground'
                          : scrolled
                            ? 'text-foreground hover:bg-muted'
                            : 'text-primary-foreground hover:bg-primary-foreground/10'
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 flex flex-col gap-2 px-4">
                  <Link to="/login">
                    <Button variant="outline" className="w-full font-semibold">
                      Login
                    </Button>
                  </Link>
                  <Link to="/portal">
                    <Button className="w-full bg-accent hover:bg-accent/90 font-semibold">
                      Student Portal
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
