import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, Clock, Youtube, Instagram, Facebook } from 'lucide-react';
import logo from '@/assets/Rays Academy LOGO.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'All Courses', path: '/courses' },
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

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Rays Academy Logo" className="w-12 h-12 object-contain rounded-md" />
              <div>
                <h3 className="text-xl font-bold">Rays Academy</h3>
                <p className="text-xs text-primary-foreground/70">Excellence Since 2006</p>
              </div>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Trusted coaching institute in Bhopal providing quality education for Class 6–12, IIT-JEE, NEET, NDA & CUET since 2006.
            </p>
            <div className="flex gap-4">
              <a href="https://youtube.com/@shankaramulani" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/raysacademybhopal?igsh=MWtyNWQyaWVrZHoxcg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/1CCLAm1BfM/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
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
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Courses</h4>
            <ul className="space-y-3">
              {courseLinks.map((course) => (
                <li key={course.path}>
                  <Link to={course.path} className="text-primary-foreground/70 hover:text-accent transition-colors text-sm">
                    {course.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-sm">
                  Plot 2, Gufa Mandir Rd, Jain Nagar, Nayapura, Lalghati, Bhopal, MP 462030
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div className="text-sm">
                  <a href="tel:+919303333490" className="text-primary-foreground/80 hover:text-accent transition-colors block">+91 9303333490</a>
                  <a href="tel:+917987081894" className="text-primary-foreground/80 hover:text-accent transition-colors block">+91 7987081894</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <a href="mailto:raysacademybhopal@gmail.com" className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                  raysacademybhopal@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <span className="text-primary-foreground/80 text-sm">Mon - Sat: 9:00 AM - 7:00 PM</span>
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
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
