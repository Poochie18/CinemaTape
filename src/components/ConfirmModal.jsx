import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) {
  const { t } = useTranslation();
  
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass rounded-2xl max-w-md w-full p-6 relative"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold mb-2">{title}</h2>

              {/* Message */}
              <p className="text-gray-400 mb-6">{message}</p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 glass-hover rounded-lg font-medium transition-all"
                >
                  {cancelText || t('confirmModal.cancel')}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-all"
                >
                  {confirmText || t('confirmModal.delete')}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
