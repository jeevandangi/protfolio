import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const ErrorDisplay = ({ 
  message = 'Something went wrong', 
  onRetry = null,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-red-400 text-6xl mb-4"
      >
        <FaExclamationTriangle />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-red-300 text-xl font-semibold mb-2"
      >
        Oops! Something went wrong
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 text-center max-w-md mb-6"
      >
        {message}
      </motion.p>
      
      {showRetry && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onRetry || (() => window.location.reload())}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRedo className="text-sm" />
          Try Again
        </motion.button>
      )}
    </div>
  );
};

export default ErrorDisplay;
