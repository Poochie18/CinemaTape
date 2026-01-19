import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import Modal from './Modal';
import StarRating from './StarRating';
import { useTranslation } from 'react-i18next';

export default function MoveToWatchedModal({ isOpen, onClose, onSave, movie }) {
  const { t } = useTranslation();
  const [watchDate, setWatchDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState(movie?.note || '');

  const handleSave = async () => {
    await onSave({
      id: movie.id,
      title: movie.title,
      year: movie.year || null,
      watchDate: new Date(watchDate).toISOString(),
      rating,
      note: note.trim(),
      poster: null,
    });
    onClose();
  };

  if (!movie) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('watchLater.markAsWatched')} size="md">
      <div className="space-y-6">
        {/* Movie Info */}
        <div className="glass rounded-lg p-4">
          <h3 className="text-lg font-bold mb-1">{movie.title}</h3>
          {movie.year && <p className="text-gray-500 text-sm">{movie.year}</p>}
        </div>

        {/* Watch Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <CalendarIcon className="w-4 h-4 inline mr-2" />
            {t('addMovie.watchDate')}
          </label>
          <input
            type="date"
            value={watchDate}
            onChange={(e) => setWatchDate(e.target.value)}
            className="input-field"
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('addMovie.rating')}
          </label>
          <div className="flex items-center gap-4">
            <StarRating rating={rating} onRatingChange={setRating} />
            <span className="text-2xl font-bold text-yellow-400">{rating}/10</span>
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('addMovie.notes')}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('addMovie.notesPlaceholder')}
            className="input-field min-h-32 resize-none"
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary w-full sm:w-auto">
            {t('addMovie.cancel')}
          </button>
          <button 
            onClick={handleSave} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Save className="w-5 h-5" />
            {t('moveToWatched.move')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
