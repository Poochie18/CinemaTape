import { useState, useMemo } from 'react';
import WatchLater from '../components/WatchLater';
import AddMovieModal from '../components/AddMovieModal';
import MoveToWatchedModal from '../components/MoveToWatchedModal';
import { Plus, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WatchLaterPage({ 
  watchLaterFilms,
  onAddToWatchLater,
  onDeleteFromWatchLater,
  onMoveToWatched,
  onUpdateWatchLater
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [movingFilm, setMovingFilm] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [editingFilm, setEditingFilm] = useState(null);
  const [sortAscending, setSortAscending] = useState(false); // false = descending (high to low), true = ascending (low to high)

  // Sort films by rating
  const sortedFilms = useMemo(() => {
    const filmsCopy = [...watchLaterFilms];
    return filmsCopy.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return sortAscending ? ratingA - ratingB : ratingB - ratingA;
    });
  }, [watchLaterFilms, sortAscending]);

  const handleMarkAsWatched = (film) => {
    setMovingFilm(film);
    setShowMoveModal(true);
  };

  const handleMove = (filmData) => {
    onMoveToWatched(filmData);
    setShowMoveModal(false);
    setMovingFilm(null);
  };

  const handleEdit = (film) => {
    setEditingFilm(film);
    setShowAddModal(true);
  };

  const handleSave = async (filmData) => {
    if (editingFilm) {
      await onUpdateWatchLater(filmData);
      setEditingFilm(null);
    } else {
      await onAddToWatchLater(filmData);
    }
    setShowAddModal(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Later</h2>
          <p className="text-gray-400 text-sm mt-1">
            {watchLaterFilms.length} {watchLaterFilms.length === 1 ? 'film' : 'films'} in queue
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setSortAscending(!sortAscending)}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-blue-600/30 border border-blue-600/50 text-blue-400 hover:bg-blue-600/40"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortAscending ? 'Low → High' : 'High → Low'}
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Film
          </motion.button>
        </div>
      </div>

      <WatchLater
        films={sortedFilms}
        onMarkAsWatched={handleMarkAsWatched}
        onDelete={onDeleteFromWatchLater}
        onEdit={handleEdit}
      />

      {showAddModal && (
        <AddMovieModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingFilm(null);
          }}
          onSave={handleSave}
          editingFilm={editingFilm}
          isAddingToWatchLater={true}
        />
      )}

      {showMoveModal && movingFilm && (
        <MoveToWatchedModal
          isOpen={showMoveModal}
          onClose={() => {
            setShowMoveModal(false);
            setMovingFilm(null);
          }}
          onSave={handleMove}
          movie={movingFilm}
        />
      )}
    </div>
  );
}
