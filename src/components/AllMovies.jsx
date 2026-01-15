import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import StarRating from './StarRating';
import ConfirmModal from './ConfirmModal';

export default function AllMovies({ films, onEditFilm, onDeleteFilm }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <>
      <div className="space-y-4">
        {films.map((film, index) => (
          <motion.div
            key={film.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="glass rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-4 sm:p-6 relative">
              {/* Action buttons - top right */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={() => onEditFilm(film)}
                  className="p-2 sm:p-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 transition-all"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(film)}
                  className="p-2 sm:p-3 rounded-lg glass-hover text-red-400 hover:text-red-300 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-3 pr-16 sm:pr-20">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-1 break-words">{film.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
                      {film.year && <span>{film.year}</span>}
                      <span>•</span>
                      <span>{format(new Date(film.watchDate), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  {film.rating > 0 && (
                    <div className="flex items-center gap-3">
                      <StarRating rating={film.rating} readonly size="sm" />
                      <span className="text-yellow-400 font-bold text-sm sm:text-base">{film.rating}/10</span>
                    </div>
                  )}

                {/* Note */}
                {film.note && (
                  <div className="glass rounded-lg p-3">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap break-words line-clamp-2">{film.note}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          onDeleteFilm(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
        title="Delete Movie"
        message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
