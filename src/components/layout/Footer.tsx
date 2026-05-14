import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, Clock, Youtube, Instagram, Facebook } from 'lucide-react';
import logo from '@/assets/Rays Academy LOGO.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'All Courses', path: '/courses' },
    { name: 'Study Material', path: '/study-material' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Results', path: '/results' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const courseLinks = [
    { name: 'Class 6–8 Foundation', path: '/courses/class-6-8' },
    { name: 'Class 9', path: '/courses/class-9' },
    { name: 'Class 10 Boards', path: '/courses/class-10' },
    { name: 'Class 11 PCM/PCB', path: '/courses/class-11' },
    { name: 'Class 12 Boards', path: '/courses/class-12' },
    { name: 'IIT-JEE Coaching', path: '/courses/iit-jee' },
    { name: 'NEET Coaching', path: '/courses/neet' },
    { name: 'NDA Coaching', path: '/courses/nda' },
    { name: 'CUET Coaching', path: '/courses/cuet' },
  ];

  const resourceLinks = [
    { name: 'All Study Material', path: '/study-material' },
    { name: 'Class 10 Notes', path: '/study-material/class-10' },
    { name: 'Class 12 Notes', path: '/study-material/class-12' },
    { name: 'JEE Material', path: '/study-material/iit-jee' },
    { name: 'NEET Material', path: '/study-material/neet' },
    { name: 'Sample Papers', path: '/study-material/sample-papers' },
    { name: 'Previous Year Questions', path: '/study-material/previous-year-questions' },
    { name: 'Formula Sheets', path: '/study-material/formula-sheets' },
    { name: 'NCERT Books', path: '/study-material/ncert/class-10' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-3 space-y-5 min-w-0">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Rays Academy Logo" className="w-12 h-12 object-contain rounded-md shrink-0" />
              <div className="min-w-0">
                <h3 className="text-lg font-bold leading-tight">Rays Academy</h3>
                <p className="text-[11px] text-primary-foreground/70">Excellence Since 2006</p>
              </div>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Trusted coaching institute in Bhopal providing quality education for Class 6–12, IIT-JEE, NEET, NDA & CUET since 2006.
            </p>
            <div className="flex gap-3">
              <a href="https://youtube.com/@shankaramulani" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/raysacademybhopal?igsh=MWtyNWQyaWVrZHoxcg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/share/1CCLAm1BfM/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 min-w-0">
            <h4 className="text-base font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div className="lg:col-span-3 min-w-0">
            <h4 className="text-base font-semibold mb-4">Our Courses</h4>
            <ul className="space-y-2">
              {courseLinks.map((course) => (
                <li key={course.path}>
                  <Link to={course.path} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2 min-w-0">
            <h4 className="text-base font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((r) => (
                <li key={r.path}>
                  <Link to={r.path} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 min-w-0">
            <h4 className="text-base font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-xs leading-relaxed break-words">
                  Plot 2, Gufa Mandir Rd, Lalghati, Bhopal, MP 462030
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="text-xs min-w-0">
                  <a href="tel:+919303333490" className="text-primary-foreground/80 hover:text-accent transition-colors block">+91 93033 33490</a>
                  <a href="tel:+917987081894" className="text-primary-foreground/80 hover:text-accent transition-colors block">+91 79870 81894</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <a href="mailto:raysacademybhopal@gmail.com" className="text-primary-foreground/80 hover:text-accent transition-colors text-xs break-all">
                  raysacademybhopal@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-xs">Mon – Sat: 9 AM – 7 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">© {currentYear} Rays Academy. All rights reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
