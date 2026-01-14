import { useState } from 'react';
import WatchLater from '../components/WatchLater';
import AddMovieModal from '../components/AddMovieModal';
import MoveToWatchedModal from '../components/MoveToWatchedModal';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WatchLaterPage({ 
  watchLaterFilms,
  onAddToWatchLater,
  onDeleteFromWatchLater,
  onMoveToWatched
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [movingFilm, setMovingFilm] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const handleMarkAsWatched = (film) => {
    setMovingFilm(film);
    setShowMoveModal(true);
  };

  const handleMove = (filmData) => {
    onMoveToWatched(filmData);
    setShowMoveModal(false);
    setMovingFilm(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Later</h2>
          <p className="text-gray-400 text-sm mt-1">
            {watchLaterFilms.length} {watchLaterFilms.length === 1 ? 'film' : 'films'} in queue
          </p>
        </div>
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

      <WatchLater
        films={watchLaterFilms}
        onMarkAsWatched={handleMarkAsWatched}
        onDelete={onDeleteFromWatchLater}
      />

      {showAddModal && (
        <AddMovieModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={onAddToWatchLater}
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
