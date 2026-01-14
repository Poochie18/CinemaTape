import Statistics from '../components/Statistics';

export default function StatisticsPage({ watchedFilms }) {
  if (!watchedFilms || watchedFilms.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Statistics</h2>
          <p className="text-gray-400 text-sm mt-1">Your viewing insights</p>
        </div>
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-gray-400">No movies watched yet. Start adding movies to see statistics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Statistics</h2>
        <p className="text-gray-400 text-sm mt-1">Your viewing insights</p>
      </div>
      
      <Statistics films={watchedFilms} />
    </div>
  );
}
