import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/Rays Academy LOGO.jpg'
import { Menu, X, ChevronDown } from 'lucide-react';

const courseDropdown = [
  { name: 'Class 6–8', path: '/courses/class-6-8' },
  { name: 'Class 9', path: '/courses/class-9' },
  { name: 'Class 10', path: '/courses/class-10' },
  { name: 'Class 11', path: '/courses/class-11' },
  { name: 'Class 12', path: '/courses/class-12' },
  { name: 'IIT-JEE', path: '/courses/iit-jee' },
  { name: 'NEET', path: '/courses/neet' },
  { name: 'NDA', path: '/courses/nda' },
  { name: 'CUET', path: '/courses/cuet' },
];

const studyMaterialDropdown = [
  { name: 'Class 6–8', path: '/study-material/class-6-8' },
  { name: 'Class 9', path: '/study-material/class-9' },
  { name: 'Class 10', path: '/study-material/class-10' },
  { name: 'Class 11', path: '/study-material/class-11' },
  { name: 'Class 12', path: '/study-material/class-12' },
  { name: 'IIT-JEE', path: '/study-material/iit-jee' },
  { name: 'NEET', path: '/study-material/neet' },
  { name: 'NDA', path: '/study-material/nda' },
  { name: 'CUET', path: '/study-material/cuet' },
  { name: 'Sample Papers', path: '/study-material/sample-papers' },
  { name: 'PYQs', path: '/study-material/previous-year-questions' },
  { name: 'Formula Sheets', path: '/study-material/formula-sheets' },
  { name: 'NCERT Books', path: '/study-material/ncert/class-10' },
];

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Courses', path: '/courses', dropdown: 'courses' as const },
  { name: 'Study Material', path: '/study-material', dropdown: 'study' as const },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Results', path: '/results' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setCoursesOpen(false);
    setMobileCoursesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCoursesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCoursesActive = location.pathname.startsWith('/courses');

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={logo} alt="Rays Academy Logo" className="w-12 h-12 object-contain rounded-md" />
            </div>
            <div className="hidden sm:block">
              <h1 className={cn("text-xl font-bold transition-colors", scrolled ? "text-primary" : "text-primary-foreground")}>
                Rays Academy
              </h1>
              <p className={cn("text-xs font-medium -mt-0.5 transition-colors", scrolled ? "text-muted-foreground" : "text-primary-foreground/80")}>
                Excellence Since 2006
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div key={link.path} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setCoursesOpen(!coursesOpen)}
                    onMouseEnter={() => setCoursesOpen(true)}
                    className={cn(
                      'relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-1',
                      isCoursesActive
                        ? 'text-accent'
                        : scrolled
                          ? 'text-foreground hover:text-accent hover:bg-accent/10'
                          : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10'
                    )}
                  >
                    {link.name}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", coursesOpen && "rotate-180")} />
                    {isCoursesActive && (
                      <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent rounded-full" />
                    )}
                  </button>
                  <AnimatePresence>
                    {coursesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        onMouseLeave={() => setCoursesOpen(false)}
                        className="absolute top-full left-0 mt-1 w-56 bg-background/95 backdrop-blur-md shadow-xl rounded-xl border border-border overflow-hidden z-50"
                      >
                        <Link
                          to="/courses"
                          className="block px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 border-b border-border transition-colors"
                        >
                          All Courses
                        </Link>
                        {courseDropdown.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                              "block px-4 py-2.5 text-sm transition-colors",
                              location.pathname === item.path
                                ? "bg-accent/10 text-accent font-medium"
                                : "text-foreground hover:bg-muted hover:text-primary"
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                    location.pathname === link.path
                      ? 'text-accent'
                      : scrolled
                        ? 'text-foreground hover:text-accent hover:bg-accent/10'
                        : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10'
                  )}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className={cn('font-semibold transition-colors', scrolled ? 'text-primary hover:text-accent' : 'text-primary-foreground hover:text-accent hover:bg-primary-foreground/10')}>
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
            className={cn('lg:hidden p-2 rounded-lg transition-colors', scrolled ? 'text-foreground hover:bg-muted' : 'text-primary-foreground hover:bg-primary-foreground/10')}
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
              <div className="py-4 space-y-1 bg-background/95 backdrop-blur-md rounded-lg mt-2 px-2 shadow-lg">
                {navLinks.map((link, index) => (
                  <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                    {link.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all',
                            isCoursesActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted'
                          )}
                        >
                          {link.name}
                          <ChevronDown className={cn("w-4 h-4 transition-transform", mobileCoursesOpen && "rotate-180")} />
                        </button>
                        <AnimatePresence>
                          {mobileCoursesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-0.5 overflow-hidden"
                            >
                              <Link to="/courses" className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-muted rounded-lg">
                                All Courses
                              </Link>
                              {courseDropdown.map((item) => (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  className={cn(
                                    "block px-4 py-2 text-sm rounded-lg transition-colors",
                                    location.pathname === item.path ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                  )}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={link.path}
                        className={cn(
                          'block px-4 py-3 rounded-lg font-medium transition-all',
                          location.pathname === link.path ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted'
                        )}
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
                <div className="pt-4 flex flex-col gap-2 px-4">
                  <Link to="/login">
                    <Button variant="outline" className="w-full font-semibold">Login</Button>
                  </Link>
                  <Link to="/portal">
                    <Button className="w-full bg-accent hover:bg-accent/90 font-semibold">Student Portal</Button>
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
