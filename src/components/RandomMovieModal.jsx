import { X, Calendar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function RandomMovieModal({ 
  isOpen, 
  onClose, 
  movie
}) {
  const { t } = useTranslation();

  if (!isOpen || !movie) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-2xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div className="flex-1 pr-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                {t('watchLater.randomMovie')}
              </h2>
              <p className="text-sm text-gray-400">
                {t('watchLater.randomMovieDesc')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg glass-hover flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Movie Card */}
          <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700/50">
            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 break-words">
              {movie.title}
            </h3>

            {/* Details Grid */}
            <div className="space-y-3">
              {movie.year && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">{t('addMovie.year')}</div>
                    <div className="text-base sm:text-lg font-semibold">{movie.year}</div>
                  </div>
                </div>
              )}

              {movie.rating > 0 && (
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">{t('addMovie.priority')}</div>
                    <div className="text-base sm:text-lg font-semibold text-yellow-400">
                      {movie.rating}/10
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
