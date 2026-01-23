import { useState, useMemo } from 'react';
import WatchLater from '../components/WatchLater';
import AddMovieModal from '../components/AddMovieModal';
import MoveToWatchedModal from '../components/MoveToWatchedModal';
import RandomMovieModal from '../components/RandomMovieModal';
import { Plus, SortAsc, Search, Shuffle } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, title, year
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [randomFilm, setRandomFilm] = useState(null);

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

  // Sort and filter films
  const filteredAndSortedFilms = useMemo(() => {
    let films = [...watchLaterFilms];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      films = films.filter(film => 
        film.title.toLowerCase().includes(query) ||
        film.year?.toString().includes(query)
      );
    }

    // Sort
    films.sort((a, b) => {
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

    return films;
  }, [watchLaterFilms, searchQuery, sortBy, sortDirection]);

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

  const handleRandomFilm = () => {
    if (watchLaterFilms.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * watchLaterFilms.length);
    setRandomFilm(watchLaterFilms[randomIndex]);
    setShowRandomModal(true);
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

      {/* Search and Sort */}
      <div className="glass rounded-xl p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('allMovies.search')}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>

        {/* Sort Buttons */}
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
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRandomFilm}
              className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Shuffle className="w-5 h-5" />
              {t('watchLater.randomFilm')}
            </motion.button>
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
        </div>
      )}

      <WatchLater
        films={filteredAndSortedFilms}
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

      {showRandomModal && randomFilm && (
        <RandomMovieModal
          isOpen={showRandomModal}
          onClose={() => {
            setShowRandomModal(false);
            setRandomFilm(null);
          }}
          movie={randomFilm}
        />
      )}
    </div>
  );
}
