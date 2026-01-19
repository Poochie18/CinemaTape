import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import Modal from './Modal';
import StarRating from './StarRating';
import { useTranslation } from 'react-i18next';

export default function AddMovieModal({ isOpen, onClose, onSave, selectedDate = null, editingFilm = null, isAddingToWatchLater = false }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [watchDate, setWatchDate] = useState(format(selectedDate || new Date(), 'yyyy-MM-dd'));
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');

  // Load initial data when editing
  useEffect(() => {
    if (editingFilm) {
      setTitle(editingFilm.title || '');
      setYear(editingFilm.year?.toString() || '');
      // For watch later films, watchDate might not exist
      if (editingFilm.watchDate) {
        setWatchDate(format(new Date(editingFilm.watchDate), 'yyyy-MM-dd'));
      } else {
        setWatchDate(format(selectedDate || new Date(), 'yyyy-MM-dd'));
      }
      setRating(editingFilm.rating || 0);
      setNote(editingFilm.note || '');
    } else {
      setTitle('');
      setYear('');
      setWatchDate(format(selectedDate || new Date(), 'yyyy-MM-dd'));
      setRating(0);
      setNote('');
    }
  }, [editingFilm, selectedDate, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) return;

    const filmData = {
      title: title.trim(),
      year: year ? parseInt(year) : null,
      rating,
      poster: null,
    };

    if (!isAddingToWatchLater) {
      filmData.watchDate = new Date(watchDate).toISOString();
      filmData.note = note.trim();
    }

    if (editingFilm) {
      filmData.id = editingFilm.id;
    }

    await onSave(filmData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isAddingToWatchLater ? t('addMovie.addToLater') : (editingFilm ? t('addMovie.editMovie') : t('addMovie.addMovie'))} size="md">
      <div className="space-y-6">
        {/* Movie Title */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('addMovie.movieTitle')} {t('addMovie.required')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('addMovie.movieTitlePlaceholder')}
            className="input-field"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('addMovie.year')}</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2024"
            className="input-field"
            min="1900"
            max="2100"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {isAddingToWatchLater ? t('addMovie.priority') : t('addMovie.rating')}
          </label>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <StarRating rating={rating} onRatingChange={setRating} />
            <span className="text-xl sm:text-2xl font-bold text-yellow-400">{rating}/10</span>
          </div>
        </div>

        {/* Watch Date - only for watched films */}
        {!isAddingToWatchLater && (
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
        )}

        {/* Note - only for watched films */}
        {!isAddingToWatchLater && (
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('addMovie.notes')}
            </label>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              placeholder={t('addMovie.notesPlaceholder')}
              className="input-field resize-none"
              rows={1}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary w-full sm:w-auto">
            {t('addMovie.cancel')}
          </button>
          <button 
            onClick={handleSave} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!title.trim()}
          >
            <Save className="w-5 h-5" />
            {t('addMovie.save')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
