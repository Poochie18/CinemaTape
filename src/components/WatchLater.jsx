import { useState } from 'react';
import { Film, Check, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ConfirmModal from './ConfirmModal';

export default function WatchLater({ films, onMarkAsWatched, onDelete }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  if (films.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass rounded-xl p-12 text-center">
          <Film className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No movies in watch later</h3>
          <p className="text-gray-400">
            Add movies you plan to watch using the button above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">

      {/* Movies List */}
      <div className="space-y-4">
        {films.map((film, index) => (
          <motion.div
            key={film.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-xl overflow-hidden hover:border-gray-600 transition-all"
          >
            <div className="p-4 sm:p-6">
              {/* Title and Actions Row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h4 className="text-lg sm:text-xl font-bold flex-1 break-words pr-2">{film.title}</h4>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onMarkAsWatched(film)}
                    className="p-2 sm:p-3 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 transition-all"
                    title="Mark as Watched"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(film)}
                    className="p-2 sm:p-3 rounded-lg glass-hover text-red-400 hover:text-red-300 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
              
              {/* Movie Details */}
              <div className="space-y-2">
                {film.year && (
                  <p className="text-gray-500 text-sm">{film.year}</p>
                )}
                {film.rating > 0 && (
                  <p className="text-sm text-yellow-400">★ {film.rating}/10</p>
                )}
                <p className="text-xs text-gray-500">
                  Added {format(new Date(film.addedDate), 'MMM d, yyyy')}
                </p>
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
          onDelete(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
        title="Remove from Watch Later"
        message={`Are you sure you want to remove "${deleteConfirm?.title}" from your watch later list?`}
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  );
}
