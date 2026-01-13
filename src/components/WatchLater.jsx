import { Film, Check, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function WatchLater({ films, onMarkAsWatched, onDelete, onAddClick }) {
  if (films.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass rounded-xl p-12 text-center">
          <Film className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No movies in watch later</h3>
          <p className="text-gray-400 mb-6">
            Add movies you plan to watch
          </p>
          <button onClick={onAddClick} className="btn-primary">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Movie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Watch Later</h2>
          <p className="text-sm sm:text-base text-gray-400">
            {films.length} {films.length === 1 ? 'movie' : 'movies'} to watch
          </p>
        </div>
        <button onClick={onAddClick} className="btn-primary w-full sm:w-auto">
          <Plus className="w-5 h-5 inline mr-2" />
          Add Movie
        </button>
      </div>

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
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Movie Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg sm:text-xl font-bold mb-2">{film.title}</h4>
                  {film.year && (
                    <p className="text-gray-500 text-sm mb-2">{film.year}</p>
                  )}
                  {film.rating > 0 && (
                    <p className="text-sm text-yellow-400 mb-2">★ {film.rating}/10</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Added {format(new Date(film.addedDate), 'MMM d, yyyy')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onMarkAsWatched(film)}
                    className="p-3 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-600/50 transition-all"
                    title="Mark as Watched"
                  >
                    <Check className="w-5 h-5 text-green-500" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${film.title}" from watch later?`)) {
                        onDelete(film.id);
                      }
                    }}
                    className="p-3 rounded-lg glass-hover text-red-400 hover:text-red-300 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
