import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Film, Calendar as CalendarIcon, BarChart3, Plus, Clock } from 'lucide-react';
import { isSameDay } from 'date-fns';
import { db } from './db';
import Calendar from './components/Calendar';
import DayFilms from './components/DayFilms';
import Statistics from './components/Statistics';
import WatchLater from './components/WatchLater';
import AddMovieModal from './components/AddMovieModal';
import MoveToWatchedModal from './components/MoveToWatchedModal';
import { motion } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('calendar'); // calendar, watchLater, stats
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFilm, setEditingFilm] = useState(null);
  const [isAddingToWatchLater, setIsAddingToWatchLater] = useState(false);
  const [movingFilm, setMovingFilm] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

  // Load data from IndexedDB
  const watchedFilms = useLiveQuery(() => db.watchedFilms.toArray()) || [];
  const watchLaterFilms = useLiveQuery(() => db.watchLater.toArray()) || [];

  // Get films for selected date
  const selectedDateFilms = selectedDate
    ? watchedFilms.filter((film) => isSameDay(new Date(film.watchDate), selectedDate))
    : [];

  // Add watched film
  const handleAddWatchedFilm = async (filmData) => {
    try {
      await db.watchedFilms.add(filmData);
      toast.success('Movie added successfully');
    } catch (error) {
      toast.error('Error adding movie');
      console.error(error);
    }
  };

  // Update watched film
  const handleUpdateWatchedFilm = async (id, filmData) => {
    try {
      await db.watchedFilms.update(id, filmData);
      toast.success('Movie updated');
    } catch (error) {
      toast.error('Error updating movie');
      console.error(error);
    }
  };

  // Delete watched film
  const handleDeleteWatchedFilm = async (id) => {
    try {
      await db.watchedFilms.delete(id);
      toast.success('Movie deleted');
    } catch (error) {
      toast.error('Error deleting movie');
      console.error(error);
    }
  };

  // Add to watch later
  const handleAddToWatchLater = async (filmData) => {
    try {
      await db.watchLater.add({
        title: filmData.title,
        year: filmData.year,
        rating: filmData.rating,
        addedDate: new Date().toISOString()
      });
      toast.success('Added to watch later');
    } catch (error) {
      toast.error('Error adding to watch later');
      console.error(error);
    }
  };

  // Delete from watch later
  const handleDeleteWatchLater = async (id) => {
    try {
      await db.watchLater.delete(id);
      toast.success('Removed from watch later');
    } catch (error) {
      toast.error('Error removing from watch later');
      console.error(error);
    }
  };

  // Mark as watched (move from watch later to watched)
  const handleMarkAsWatched = async (filmData) => {
    try {
      await db.watchedFilms.add(filmData);
      await db.watchLater.delete(movingFilm.id);
      toast.success('Moved to watched');
      setMovingFilm(null);
      setShowMoveModal(false);
    } catch (error) {
      toast.error('Error moving to watched');
      console.error(error);
    }
  };

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'watchLater', label: 'Watch Later', icon: Clock },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen pb-20">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f3f4f6',
            border: '1px solid #374151',
          },
        }}
      />

      {/* Header */}
      <header className="glass border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center mb-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-gray-400" />
              <h1 className="text-2xl font-bold">CinemaTape</h1>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-2 justify-center flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-gray-700 text-white'
                    : 'glass-hover'
                  }
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm sm:text-base">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'calendar' && (
          <div className="space-y-8">
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              watchedFilms={watchedFilms}
            />
            {selectedDate && (
              <DayFilms
                selectedDate={selectedDate}
                films={selectedDateFilms}
                onAddClick={() => setShowAddModal(true)}
                onDeleteFilm={handleDeleteWatchedFilm}
                onEditFilm={(film) => {
                  setEditingFilm(film);
                  setShowAddModal(true);
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'watchLater' && (
          <WatchLater
            films={watchLaterFilms}
            onMarkAsWatched={(film) => {
              setMovingFilm(film);
              setShowMoveModal(true);
            }}
            onDelete={handleDeleteWatchLater}
            onAddClick={() => {
              setIsAddingToWatchLater(true);
              setShowAddModal(true);
            }}
          />
        )}

        {activeTab === 'stats' && <Statistics watchedFilms={watchedFilms} />}
      </main>

      {/* Floating Add Button */}
      {(activeTab === 'calendar' || activeTab === 'watchLater') && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsAddingToWatchLater(activeTab === 'watchLater');
            setShowAddModal(true);
          }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gray-700 hover:bg-gray-600 rounded-full shadow-2xl flex items-center justify-center z-30 transition-colors"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      )}

      {/* Modals */}
      <AddMovieModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingFilm(null);
          setIsAddingToWatchLater(false);
        }}
        onSave={(filmData) => {
          if (editingFilm) {
            handleUpdateWatchedFilm(editingFilm.id, filmData);
            setEditingFilm(null);
          } else if (isAddingToWatchLater) {
            handleAddToWatchLater(filmData);
            setIsAddingToWatchLater(false);
          } else {
            handleAddWatchedFilm(filmData);
          }
        }}
        defaultDate={selectedDate || new Date()}
        initialMovie={editingFilm}
        isEditing={!!editingFilm}
        isAddingToWatchLater={isAddingToWatchLater}
      />

      <MoveToWatchedModal
        isOpen={showMoveModal}
        onClose={() => {
          setShowMoveModal(false);
          setMovingFilm(null);
        }}
        onSave={handleMarkAsWatched}
        movie={movingFilm}
      />
    </div>
  );
}

export default App;
