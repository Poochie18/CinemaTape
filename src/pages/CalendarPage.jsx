import { useState } from 'react';
import { isSameDay } from 'date-fns';
import Calendar from '../components/Calendar';
import DayFilms from '../components/DayFilms';
import AddMovieModal from '../components/AddMovieModal';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function CalendarPage({ 
  watchedFilms = [], 
  onAddFilm, 
  onUpdateFilm, 
  onDeleteFilm 
}) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFilm, setEditingFilm] = useState(null);

  const selectedDateFilms = selectedDate
    ? watchedFilms.filter((film) => isSameDay(new Date(film.watchDate), selectedDate))
    : [];

  const handleEdit = (film) => {
    setEditingFilm(film);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingFilm(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        watchedFilms={watchedFilms}
      />

      {selectedDate && (
        <>
          {selectedDateFilms.length > 0 ? (
            <DayFilms
              selectedDate={selectedDate}
              films={selectedDateFilms}
              onAddClick={() => setShowAddModal(true)}
              onEditFilm={handleEdit}
              onDeleteFilm={onDeleteFilm}
            />
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <h3 className="text-xl font-semibold mb-4">{t('calendar.noFilmsThisDay')}</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                {t('calendar.addFirstFilm')}
              </motion.button>
            </div>
          )}
        </>
      )}

      <AddMovieModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSave={editingFilm ? onUpdateFilm : onAddFilm}
        editingFilm={editingFilm}
        selectedDate={selectedDate}
      />
    </div>
  );
}
