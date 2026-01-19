import Statistics from '../components/Statistics';
import { useTranslation } from 'react-i18next';

export default function StatisticsPage({ watchedFilms }) {
  const { t } = useTranslation();

  if (!watchedFilms || watchedFilms.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">{t('statistics.title')}</h2>
          <p className="text-gray-400 text-sm mt-1">{t('statistics.subtitle')}</p>
        </div>
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-gray-400">{t('statistics.noMoviesYet')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('statistics.title')}</h2>
        <p className="text-gray-400 text-sm mt-1">{t('statistics.subtitle')}</p>
      </div>
      
      <Statistics films={watchedFilms} />
    </div>
  );
}
