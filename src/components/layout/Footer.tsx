import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, Clock, Youtube, Instagram, Facebook, Twitter } from 'lucide-react';
import logo from '@/assets/Rays Academy LOGO.jpg'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img
              src={logo}
              alt="Rays Academy Logo"
              className="w-12 h-12 object-contain rounded-md"
            />
              <div>
                <h3 className="text-xl font-bold">Rays Academy</h3>
                <p className="text-xs text-primary-foreground/70">Excellence Since 2006</p>
              </div>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Providing quality education for over 18 years, helping students achieve success in academics and beyond. Trusted by thousands of families in Bhopal.
            </p>
            <div className="flex gap-4">
              <a
                href="https://youtube.com/@shankaramulani"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Our Courses', path: '/courses' },
                { name: 'Faculty', path: '/faculty' },
                { name: 'Results', path: '/results' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
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
              {[
                'Classes 6th - 8th',
                'Classes 9th - 10th',
                'Classes 11th - 12th',
                'IIT-JEE Preparation',
                'NEET Preparation',
                'NDA Coaching',
                'CUET Preparation',
              ].map((course) => (
                <li key={course}>
                  <span className="text-primary-foreground/70 text-sm">{course}</span>
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
                  <a href="tel:+919303333490" className="text-primary-foreground/80 hover:text-accent transition-colors block">
                    +91 9303333490
                  </a>
                  <a href="tel:+917987081894" className="text-primary-foreground/80 hover:text-accent transition-colors block">
                    +91 7987081894
                  </a>
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
                <span className="text-primary-foreground/80 text-sm">
                  Mon - Sat: 9:00 AM - 7:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {currentYear} Rays Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
