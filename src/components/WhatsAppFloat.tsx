import { motion } from 'framer-motion';

const WhatsAppFloat = () => {
  const phoneNumber = '917024057876';
  const url = `https://wa.me/${phoneNumber}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl transition-colors duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.img
        src="/whatsapp.svg"
        alt="WhatsApp"
        className="w-7 h-7"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4 }}
      />
      <span className="font-semibold text-sm hidden sm:inline">Chat on WhatsApp</span>
    </motion.a>
  );
};

export default WhatsAppFloat;
