import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading...', size = 'large' }) => {
  const sizeClasses = {
    small: 'h-16 w-16',
    medium: 'h-24 w-24', 
    large: 'h-32 w-32'
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        className={`${sizeClasses[size]} border-2 border-cyan-400 border-t-transparent rounded-full mx-auto`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="mt-4 text-cyan-300 text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
