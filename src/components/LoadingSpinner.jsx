import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <Loader2 className={`${sizeClasses[size]} text-gray-400`} />
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50">
        <div className="glass rounded-xl p-8 flex flex-col items-center gap-4">
          {spinner}
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}
