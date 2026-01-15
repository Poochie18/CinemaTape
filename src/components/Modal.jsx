import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children, title, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`glass rounded-2xl ${sizeClasses[size]} w-full max-h-[90vh] flex flex-col relative overflow-hidden`}
            >
              {/* Header */}
              {title && (
                <div className="sticky top-0 glass border-b border-gray-700/50 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl z-10">
                  <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-3 sm:p-6 overflow-y-auto">
                {children}
              </div>
            </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
