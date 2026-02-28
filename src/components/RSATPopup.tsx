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
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-[320px] sm:w-[380px] rounded-2xl overflow-hidden shadow-2xl bg-white"
            initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 5 }}
            transition={{ type: 'spring', damping: 18, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glowing border effect */}
            <motion.div
              className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-accent via-primary to-accent z-[-1]"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            />

            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <a href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                <img
                  src={rsatBanner}
                  alt="RSAT - Rays Scholarship Admission Test"
                  className="w-full h-auto cursor-pointer"
                />
              </a>
            </motion.div>

            <motion.div
              className="p-3 text-center bg-white"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.a
                href={REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-6 py-2.5 rounded-full transition-colors text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register Now →
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RSATPopup;
