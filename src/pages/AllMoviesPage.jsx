import { useState, useMemo } from 'react';
import { Search, SortAsc, Film as FilmIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import AllMovies from '../components/AllMovies';
import AddMovieModal from '../components/AddMovieModal';

export default function AllMoviesPage({ 
  watchedFilms,
  onEditFilm,
  onDeleteFilm
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, title, year
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc
  const [editingFilm, setEditingFilm] = useState(null);

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

  const filteredAndSortedFilms = useMemo(() => {
    let films = [...watchedFilms];

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
  }, [watchedFilms, searchQuery, sortBy, sortDirection]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">All Movies</h2>
        <p className="text-gray-400 text-sm mt-1">
          {watchedFilms.length} {watchedFilms.length === 1 ? 'movie' : 'movies'} watched
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
            placeholder="Search by title or year..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <SortAsc className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">Sort by:</span>
          <button
            onClick={() => handleSortClick('rating')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'rating'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Rating {sortBy === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortClick('title')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'title'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Title {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortClick('year')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Year {sortBy === 'year' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Movies List */}
      {filteredAndSortedFilms.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <FilmIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? 'No movies found' : 'No movies watched yet'}
          </h3>
          <p className="text-gray-400">
            {searchQuery ? 'Try a different search term' : 'Start adding movies to see them here'}
          </p>
        </div>
      ) : (
        <AllMovies
          films={filteredAndSortedFilms}
          onEditFilm={setEditingFilm}
          onDeleteFilm={onDeleteFilm}
        />
      )}

      {/* Edit Modal */}
      <AddMovieModal
        isOpen={!!editingFilm}
        onClose={() => setEditingFilm(null)}
        onSave={async (filmData) => {
          await onEditFilm(filmData);
          setEditingFilm(null);
        }}
        editFilm={editingFilm}
      />
    </div>
  );
}
