import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/Rays Academy LOGO.jpg';
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
  { name: 'About', path: '/about' },
  { name: 'Courses', path: '/courses', dropdown: 'courses' as const },
  { name: 'Study Material', path: '/study-material', dropdown: 'study' as const },
  { name: 'Blog', path: '/blog' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Results', path: '/results' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActiveDropdown = (key: 'courses' | 'study') =>
    key === 'courses' ? location.pathname.startsWith('/courses') : location.pathname.startsWith('/study-material');

  const dropdownItems = (key: 'courses' | 'study') =>
    key === 'courses' ? courseDropdown : studyMaterialDropdown;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-border py-2">
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src={logo} alt="Rays Academy Logo" className="w-10 h-10 object-contain rounded-md" />
            <div className="hidden sm:block">
              <h1 className="text-base lg:text-lg font-bold text-primary leading-tight">Rays Academy</h1>
              <p className="text-[10px] font-medium text-muted-foreground -mt-0.5">Excellence Since 2006</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map((link) => {
              const dropdownKey = link.dropdown;
              if (dropdownKey) {
                const isOpenD = openDropdown === dropdownKey;
                const isActive = isActiveDropdown(dropdownKey);
                const items = dropdownItems(dropdownKey);
                return (
                  <div
                    key={link.path}
                    className="relative flex items-center"
                    ref={isOpenD ? dropdownRef : undefined}
                    onMouseEnter={() => setOpenDropdown(dropdownKey)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      to={link.path}
                      className={cn(
                        'px-2.5 py-2 rounded-lg font-medium text-[13px] xl:text-sm transition-all duration-200 flex items-center gap-1',
                        isActive ? 'text-accent' : 'text-foreground hover:text-accent hover:bg-accent/5',
                      )}
                    >
                      {link.name}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenDropdown(isOpenD ? null : dropdownKey);
                        }}
                        aria-label={`Toggle ${link.name} menu`}
                        className="p-0.5 -mr-1"
                      >
                        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', isOpenD && 'rotate-180')} />
                      </button>
                    </Link>
                    <AnimatePresence>
                      {isOpenD && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-0 mt-1 w-60 bg-white shadow-xl rounded-xl border border-border overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
                        >
                          <Link
                            to={link.path}
                            className="block px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 border-b border-border transition-colors"
                          >
                            View All {link.name}
                          </Link>
                          {items.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={cn(
                                'block px-4 py-2 text-sm transition-colors',
                                location.pathname === item.path
                                  ? 'bg-accent/10 text-accent font-medium'
                                  : 'text-foreground hover:bg-muted hover:text-primary',
                              )}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-2.5 py-2 rounded-lg font-medium text-[13px] xl:text-sm transition-all duration-200',
                    location.pathname === link.path
                      ? 'text-accent'
                      : 'text-foreground hover:text-accent hover:bg-accent/5',
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-primary hover:text-accent">
                Login
              </Button>
            </Link>
            <Link to="/portal">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full px-4 shadow-md shadow-accent/25">
                Student Portal
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-foreground hover:bg-muted"
            aria-label="Toggle menu"
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
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1 bg-white rounded-lg mt-2 px-2 shadow-lg border border-border">
                {navLinks.map((link, index) => {
                  const dropdownKey = link.dropdown;
                  const isMobileOpen = mobileOpenDropdown === dropdownKey;
                  const isActive = dropdownKey ? isActiveDropdown(dropdownKey) : false;
                  return (
                    <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
                      {dropdownKey ? (
                        <div>
                          <div className={cn('flex items-center justify-between rounded-lg', isActive ? 'bg-accent/10' : 'hover:bg-muted')}>
                            <Link
                              to={link.path}
                              className={cn('flex-1 px-4 py-3 font-medium', isActive ? 'text-accent' : 'text-foreground')}
                            >
                              {link.name}
                            </Link>
                            <button
                              onClick={() => setMobileOpenDropdown(isMobileOpen ? null : dropdownKey)}
                              className="px-4 py-3 text-foreground"
                              aria-label={`Toggle ${link.name} submenu`}
                            >
                              <ChevronDown className={cn('w-4 h-4 transition-transform', isMobileOpen && 'rotate-180')} />
                            </button>
                          </div>
                          <AnimatePresence>
                            {isMobileOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pl-4 space-y-0.5 overflow-hidden"
                              >
                                {dropdownItems(dropdownKey).map((item) => (
                                  <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                      'block px-4 py-2 text-sm rounded-lg transition-colors',
                                      location.pathname === item.path ? 'bg-accent/10 text-accent font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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
                            location.pathname === link.path ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-muted',
                          )}
                        >
                          {link.name}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
                <div className="pt-3 flex flex-col gap-2 px-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full font-semibold">Login</Button>
                  </Link>
                  <Link to="/portal">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
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
