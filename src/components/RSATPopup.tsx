import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import rsatBanner from '@/assets/rsat.jpeg';

const REGISTRATION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSebAm-yx-Xa6QucJcI9Uq_BIRVOxvF1hFvRnPALf8Srg-bMTQ/viewform';

const RSATPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('rsat-popup-dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('rsat-popup-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
              <img
                src={rsatBanner}
                alt="RSAT - Rays Scholarship Admission Test"
                className="w-full h-auto cursor-pointer"
              />
            </a>

            <div className="bg-white p-4 text-center">
              <a
                href={REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-full transition-colors text-sm"
              >
                Register Now →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RSATPopup;
