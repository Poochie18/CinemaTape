import { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Trash2, Edit2, Plus } from 'lucide-react';
import StarRating from './StarRating';
import ConfirmModal from './ConfirmModal';

export default function DayFilms({ selectedDate, films, onAddClick, onDeleteFilm, onEditFilm }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  if (!selectedDate) {
    return (
      <div className="glass rounded-xl p-8 sm:p-12 text-center">
        <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-600 mb-4" />
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Select a day</h3>
        <p className="text-sm sm:text-base text-gray-400">
          Click on a day in the calendar to view movies
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-xl sm:text-2xl font-bold">
          {format(selectedDate, 'd MMMM yyyy')}
        </h3>
        <button onClick={onAddClick} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" />
          <span>Add Movie</span>
        </button>
      </div>

      {/* Films List */}
      {films.length === 0 ? (
        <div className="glass rounded-xl p-6 sm:p-8 text-center">
          <p className="text-sm sm:text-base text-gray-400 mb-4">
            No movies watched on this day
          </p>
          <button onClick={onAddClick} className="btn-secondary w-full sm:w-auto">
            Add first movie
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {films.map((film, index) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-4 sm:p-6 relative">
                {/* Action buttons - top right */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => onEditFilm(film)}
                    className="p-2 rounded-lg glass-hover transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(film)}
                    className="p-2 rounded-lg glass-hover text-red-400 hover:text-red-300 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-3 pr-20">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-1">{film.title}</h4>
                    {film.year && (
                      <p className="text-gray-500 text-sm">{film.year}</p>
                    )}
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
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{film.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
    </div>
  );
}
