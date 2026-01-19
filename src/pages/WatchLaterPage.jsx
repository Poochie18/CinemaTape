import { useState, useMemo } from 'react';
import WatchLater from '../components/WatchLater';
import AddMovieModal from '../components/AddMovieModal';
import MoveToWatchedModal from '../components/MoveToWatchedModal';
import { Plus, SortAsc } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function WatchLaterPage({ 
  watchLaterFilms,
  onAddToWatchLater,
  onDeleteFromWatchLater,
  onMoveToWatched,
  onUpdateWatchLater
}) {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [movingFilm, setMovingFilm] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [editingFilm, setEditingFilm] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // rating, title, year
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc

  const handleSortClick = (field) => {
    if (sortBy === field) {
      // Toggle direction if clicking same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field - default to desc for rating/year, asc for title
      setSortBy(field);
      setSortDirection(field === 'title' ? 'asc' : 'desc');
    }
  };

  // Sort films
  const sortedFilms = useMemo(() => {
    const filmsCopy = [...watchLaterFilms];
    filmsCopy.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'rating':
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'year':
          comparison = (b.year || 0) - (a.year || 0);
          break;
        default:
          return 0;
      }
      return sortDirection === 'asc' ? -comparison : comparison;
    });
    return filmsCopy;
  }, [watchLaterFilms, sortBy, sortDirection]);

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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">{t('watchLater.title')}</h2>
        <p className="text-gray-400 text-sm mt-1">
          {watchLaterFilms.length} {watchLaterFilms.length === 1 ? t('watchLater.film') : t('watchLater.films')} {t('watchLater.filmsInQueue')}
        </p>
      </div>

      {/* Sort Buttons */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <SortAsc className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">{t('allMovies.sortBy')}:</span>
          <button
            onClick={() => handleSortClick('rating')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'rating'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {t('allMovies.rating')} {sortBy === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortClick('title')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'title'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {t('allMovies.movieTitle')} {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortClick('year')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {t('addMovie.year')} {sortBy === 'year' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Date and Add Film Button */}
      {watchLaterFilms.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-xl sm:text-2xl font-bold">
            {new Date().toLocaleDateString(t('app.locale'), { day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            {t('watchLater.addFilm')}
          </motion.button>
        </div>
      )}

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
