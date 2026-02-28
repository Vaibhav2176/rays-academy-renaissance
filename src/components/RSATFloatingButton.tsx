import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const RSATFloatingButton = () => {
  return (
    <Link to="/rsat">
      <motion.div
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full pl-4 pr-5 py-3 shadow-lg hover:shadow-xl cursor-pointer transition-colors"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
        >
          <GraduationCap className="w-6 h-6" />
        </motion.div>
        <span className="font-bold text-sm hidden sm:inline">Register for RSAT</span>
        <span className="font-bold text-sm sm:hidden">RSAT</span>
        <motion.span
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </Link>
  );
};

export default RSATFloatingButton;
