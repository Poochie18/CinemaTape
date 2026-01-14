import { useMemo, useState } from 'react';
import { format, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth, startOfMonth, endOfMonth } from 'date-fns';
import { Film, Star, Calendar, TrendingUp, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Statistics({ films = [] }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const availableYears = useMemo(() => {
    if (!films || films.length === 0) return [new Date().getFullYear()];
    const years = films.map(f => new Date(f.watchDate).getFullYear());
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    return uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear()];
  }, [films]);

  const stats = useMemo(() => {
    if (!films || films.length === 0) return null;

    const watchedFilms = films;
    const currentYear = new Date().getFullYear();
    const filmsThisYear = watchedFilms.filter(
      (film) => new Date(film.watchDate).getFullYear() === currentYear
    );

    const filmsSelectedYear = watchedFilms.filter(
      (film) => new Date(film.watchDate).getFullYear() === selectedYear
    );

    // Average rating
    const ratedFilms = watchedFilms.filter((f) => f.rating > 0);
    const avgRating = ratedFilms.length > 0
      ? (ratedFilms.reduce((sum, f) => sum + f.rating, 0) / ratedFilms.length).toFixed(1)
      : 0;
    const ratedCount = ratedFilms.length;

    // Best rated
    const bestRated = [...watchedFilms]
      .filter((f) => f.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    // Most active day
    const daysCounts = {};
    watchedFilms.forEach((film) => {
      const date = format(new Date(film.watchDate), 'yyyy-MM-dd');
      daysCounts[date] = (daysCounts[date] || 0) + 1;
    });
    const mostActiveDay = Object.entries(daysCounts).sort((a, b) => b[1] - a[1])[0];

    // Monthly stats for selected year
    const months = eachMonthOfInterval({
      start: startOfYear(new Date(selectedYear, 0, 1)),
      end: endOfYear(new Date(selectedYear, 0, 1)),
    });

    const monthlyStats = months.map((month) => {
      const filmsInMonth = filmsSelectedYear.filter((film) =>
        isSameMonth(new Date(film.watchDate), month)
      );
      return {
        month: format(month, 'MMM'),
        count: filmsInMonth.length,
      };
    });

    return {
      total: watchedFilms.length,
      thisYear: filmsThisYear.length,
      selectedYearCount: filmsSelectedYear.length,
      avgRating,
      ratedCount,
      bestRated,
      mostActiveDay,
      monthlyStats,
    };
  }, [films, selectedYear]);

  if (!stats) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="glass rounded-xl p-12 text-center">
          <TrendingUp className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No statistics data</h3>
          <p className="text-gray-400">
            Start adding watched movies to see statistics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4 sm:px-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Statistics</h2>
        <p className="text-sm sm:text-base text-gray-400">Your cinematic habits and achievements</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 text-center"
        >
          <Film className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <div className="text-3xl font-bold mb-1">{stats.total}</div>
          <div className="text-sm text-gray-400">Total Movies</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 text-center"
        >
          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <div className="text-3xl font-bold mb-1">{stats.thisYear}</div>
          <div className="text-sm text-gray-400">This Year</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 text-center"
        >
          <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
          <div className="text-3xl font-bold mb-1">
            {stats.avgRating > 0 ? stats.avgRating : '-'}
          </div>
          <div className="text-sm text-gray-400">
            Average Rating
            {stats.ratedCount > 0 && (
              <span className="block text-xs mt-1">({stats.ratedCount} rated)</span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6 text-center"
        >
          <Award className="w-8 h-8 mx-auto mb-2 text-green-400" />
          <div className="text-3xl font-bold mb-1">{stats.mostActiveDay?.[1] || 0}</div>
          <div className="text-sm text-gray-400">Most in a Day</div>
        </motion.div>
      </div>

      {/* Monthly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-xl p-6"
      >
        {/* Year Selector */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            Movies by Month
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const currentIndex = availableYears.indexOf(selectedYear);
                if (currentIndex < availableYears.length - 1) {
                  setSelectedYear(availableYears[currentIndex + 1]);
                }
              }}
              disabled={availableYears.indexOf(selectedYear) === availableYears.length - 1}
              className="p-2 glass-hover rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold px-4">{selectedYear}</span>
            <button
              onClick={() => {
                const currentIndex = availableYears.indexOf(selectedYear);
                if (currentIndex > 0) {
                  setSelectedYear(availableYears[currentIndex - 1]);
                }
              }}
              disabled={availableYears.indexOf(selectedYear) === 0}
              className="p-2 glass-hover rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {stats.monthlyStats.map((month, index) => {
            const maxCount = Math.max(...stats.monthlyStats.map(m => m.count), 1);
            const percentage = (month.count / maxCount) * 100;
            return (
              <div key={month.month} className="flex items-center gap-3">
                <div className="w-12 text-sm text-gray-400 font-medium text-right">
                  {month.month}
                </div>
                <div className="flex-1 h-8 bg-gray-800/30 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.1 + index * 0.03, duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-600/80 to-blue-500/80 flex items-center justify-end px-3"
                  >
                    {month.count > 0 && (
                      <span className="text-sm font-semibold text-white drop-shadow-lg">{month.count}</span>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Best Rated */}
      {stats.bestRated.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">Top 5 by Rating</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {stats.bestRated.map((film, index) => (
              <div key={film.id} className="relative group">
                <div className="aspect-[2/3] rounded-lg overflow-hidden glass-hover">
                  {film.poster ? (
                    <img src={film.poster} alt={film.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-xs text-center px-2">{film.title}</span>
                    </div>
                  )}
                  {/* Rating badge */}
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black font-bold text-sm px-2 py-1 rounded-lg">
                    {film.rating}
                  </div>
                  {/* Rank badge */}
                  <div className="absolute top-2 left-2 bg-gray-700 text-white font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                <h4 className="text-sm font-semibold mt-2 line-clamp-2">{film.title}</h4>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Most Active Day */}
      {stats.mostActiveDay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-xl p-6 text-center"
        >
          <Award className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
          <h3 className="text-xl font-bold mb-2">Most Active Day</h3>
          <p className="text-gray-400">
            <span className="text-2xl font-bold text-gray-300">
              {format(new Date(stats.mostActiveDay[0]), 'd MMMM yyyy')}
            </span>
            <br />
            Watched {stats.mostActiveDay[1]} {stats.mostActiveDay[1] === 1 ? 'movie' : 'movies'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
