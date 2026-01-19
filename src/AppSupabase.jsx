import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { useWatchedFilms, useWatchLater } from './hooks/useSupabase';
import Layout from './components/Layout';
import SignIn from './pages/SignIn';
import CalendarPage from './pages/CalendarPage';
import WatchLaterPage from './pages/WatchLaterPage';
import StatisticsPage from './pages/StatisticsPage';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { films: watchedFilmsData, loading: watchedLoading } = useWatchedFilms(user?.id);
  const { films: watchLaterData, loading: watchLaterLoading } = useWatchLater(user?.id);

  // Check auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Convert Supabase data format to match local format
  const watchedFilms = watchedFilmsData.map(film => ({
    id: film.id,
    title: film.title,
    year: film.year,
    watchDate: film.watch_date,
    rating: film.rating,
    note: film.note,
    poster: film.poster
  }));

  const watchLaterFilms = watchLaterData.map(film => ({
    id: film.id,
    title: film.title,
    year: film.year,
    rating: film.rating,
    addedDate: film.added_date
  }));

  // Get films for selected date
  const selectedDateFilms = selectedDate
    ? watchedFilms.filter((film) => isSameDay(new Date(film.watchDate), selectedDate))
    : [];

  // Sign out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  // Add watched film
  const handleAddWatchedFilm = async (filmData) => {
    try {
      const { error } = await supabase.from('watched_films').insert({
        user_id: user.id,
        title: filmData.title,
        year: filmData.year,
        watch_date: filmData.watchDate,
        rating: filmData.rating,
        note: filmData.note,
        poster: filmData.poster
      });

      if (error) throw error;
      toast.success('Movie added successfully');
    } catch (error) {
      toast.error('Error adding movie');
      console.error(error);
    }
  };

  // Update watched film
  const handleUpdateWatchedFilm = async (id, filmData) => {
    try {
      const { error } = await supabase.from('watched_films').update({
        title: filmData.title,
        year: filmData.year,
        watch_date: filmData.watchDate,
        rating: filmData.rating,
        note: filmData.note,
        poster: filmData.poster
      }).eq('id', id);

      if (error) throw error;
      toast.success('Movie updated');
    } catch (error) {
      toast.error('Error updating movie');
      console.error(error);
    }
  };

  // Delete watched film
  const handleDeleteWatchedFilm = async (id) => {
    try {
      const { error } = await supabase.from('watched_films').delete().eq('id', id);
      if (error) throw error;
      toast.success('Movie deleted');
    } catch (error) {
      toast.error('Error deleting movie');
      console.error(error);
    }
  };

  // Add to watch later
  const handleAddToWatchLater = async (filmData) => {
    try {
      const { error } = await supabase.from('watch_later').insert({
        user_id: user.id,
        title: filmData.title,
        year: filmData.year,
        rating: filmData.rating
      });

      if (error) throw error;
      toast.success('Added to watch later');
    } catch (error) {
      toast.error('Error adding to watch later');
      console.error(error);
    }
  };

  // Delete from watch later
  const handleDeleteWatchLater = async (id) => {
    try {
      const { error } = await supabase.from('watch_later').delete().eq('id', id);
      if (error) throw error;
      toast.success('Removed from watch later');
    } catch (error) {
      toast.error('Error removing from watch later');
      console.error(error);
    }
  };

  // Mark as watched (move from watch later to watched)
  const handleMarkAsWatched = async (filmData) => {
    try {
      const { error: insertError } = await supabase.from('watched_films').insert({
        user_id: user.id,
        title: filmData.title,
        year: filmData.year,
        watch_date: filmData.watchDate,
        rating: filmData.rating,
        note: filmData.note,
        poster: filmData.poster
      });

      if (insertError) throw insertError;

      const { error: deleteError } = await supabase.from('watch_later').delete().eq('id', movingFilm.id);
      if (deleteError) throw deleteError;

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

  if (loading || watchedLoading || watchLaterLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen pb-20">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
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
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-gray-400" />
              <h1 className="text-2xl font-bold">CinemaTape</h1>
            </div>
            
            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
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
