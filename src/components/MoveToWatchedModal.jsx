import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import Modal from './Modal';
import StarRating from './StarRating';

export default function MoveToWatchedModal({ isOpen, onClose, onSave, movie }) {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Mark as Watched" size="md">
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
            Watch Date
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
            Rating (0-10)
          </label>
          <div className="flex items-center gap-4">
            <StarRating rating={rating} onRatingChange={setRating} />
            <span className="text-2xl font-bold text-yellow-400">{rating}/10</span>
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes & Thoughts
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Your thoughts about the movie..."
            className="input-field min-h-32 resize-none"
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Save className="w-5 h-5" />
            Save as Watched
          </button>
        </div>
      </div>
    </Modal>
  );
}
