import { useMemo } from 'react';
import { format, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth, startOfMonth, endOfMonth } from 'date-fns';
import { Film, Star, Calendar, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Statistics({ watchedFilms }) {
  const stats = useMemo(() => {
    if (watchedFilms.length === 0) return null;

    const currentYear = new Date().getFullYear();
    const filmsThisYear = watchedFilms.filter(
      (film) => new Date(film.watchDate).getFullYear() === currentYear
    );

    // Average rating
    const ratedFilms = watchedFilms.filter((f) => f.rating > 0);
    const avgRating = ratedFilms.length > 0
      ? (ratedFilms.reduce((sum, f) => sum + f.rating, 0) / ratedFilms.length).toFixed(1)
      : 0;

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

    // Monthly stats for current year
    const months = eachMonthOfInterval({
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
    });

    const monthlyStats = months.map((month) => {
      const filmsInMonth = watchedFilms.filter((film) =>
        isSameMonth(new Date(film.watchDate), month)
      );
      return {
        month: format(month, 'LLLL'),
        count: filmsInMonth.length,
      };
    });

    return {
      total: watchedFilms.length,
      thisYear: filmsThisYear.length,
      avgRating,
      bestRated,
      mostActiveDay,
      monthlyStats,
    };
  }, [watchedFilms]);

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
          <div className="text-3xl font-bold mb-1">{stats.avgRating}</div>
          <div className="text-sm text-gray-400">Average Rating</div>
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
        <h3 className="text-xl font-bold mb-6">Movies by Month ({new Date().getFullYear()})</h3>
        <div className="space-y-4">
          {stats.monthlyStats.map((month, index) => {
            const maxCount = Math.max(...stats.monthlyStats.map(m => m.count), 1);
            const percentage = (month.count / maxCount) * 100;
            return (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-300 capitalize font-medium">
                  {month.month.substring(0, 3)}
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="flex-1 h-10 bg-gray-800/50 rounded-lg overflow-hidden relative border border-gray-700/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-end px-3 relative"
                      style={{
                        boxShadow: month.count > 0 ? '0 0 10px rgba(156, 163, 175, 0.3)' : 'none'
                      }}
                    >
                      {month.count > 0 && (
                        <span className="text-sm font-bold text-white">{month.count}</span>
                      )}
                    </motion.div>
                  </div>
                  <div className="w-10 text-right">
                    {month.count > 0 && (
                      <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
                    )}
                  </div>
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
