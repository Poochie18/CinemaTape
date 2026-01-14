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
import AllMoviesPage from './pages/AllMoviesPage';
import StatisticsPage from './pages/StatisticsPage';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { films: watchedFilmsData, loading: watchedLoading, refetch: refetchWatched } = useWatchedFilms(user?.id);
  const { films: watchLaterData, loading: watchLaterLoading, refetch: refetchWatchLater } = useWatchLater(user?.id);

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

  // Add watched film
  const handleAddFilm = async (filmData) => {
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
      await refetchWatched();
      toast.success('Movie added successfully');
    } catch (error) {
      toast.error('Error adding movie');
      console.error(error);
    }
  };

  // Update watched film
  const handleUpdateFilm = async (filmData) => {
    try {
      const { error } = await supabase.from('watched_films').update({
        title: filmData.title,
        year: filmData.year,
        watch_date: filmData.watchDate,
        rating: filmData.rating,
        note: filmData.note,
        poster: filmData.poster
      }).eq('id', filmData.id);

      if (error) throw error;
      await refetchWatched();
      toast.success('Movie updated');
    } catch (error) {
      toast.error('Error updating movie');
      console.error(error);
    }
  };

  // Delete watched film
  const handleDeleteFilm = async (id) => {
    try {
      const { error } = await supabase.from('watched_films').delete().eq('id', id);
      if (error) throw error;
      await refetchWatched();
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
      await refetchWatchLater();
      toast.success('Added to watch later');
    } catch (error) {
      toast.error('Error adding to watch later');
      console.error(error);
    }
  };

  // Delete from watch later
  const handleDeleteFromWatchLater = async (id) => {
    try {
      const { error } = await supabase.from('watch_later').delete().eq('id', id);
      if (error) throw error;
      await refetchWatchLater();
      toast.success('Removed from watch later');
    } catch (error) {
      toast.error('Error removing from watch later');
      console.error(error);
    }
  };

  // Move from watch later to watched
  const handleMoveToWatched = async (filmData) => {
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

      const { error: deleteError } = await supabase.from('watch_later').delete().eq('id', filmData.id);
      if (deleteError) throw deleteError;

      await refetchWatched();
      await refetchWatchLater();
      toast.success('Moved to watched');
    } catch (error) {
      toast.error('Error moving to watched');
      console.error(error);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <BrowserRouter basename="/CinemaTape">
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

      <Routes>
        {/* Public Routes */}
        <Route 
          path="/signin" 
          element={!user ? <SignIn /> : <Navigate to="/calendar" replace />} 
        />

        {/* Protected Routes */}
        {user ? (
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/calendar" replace />} />
            <Route 
              path="/calendar" 
              element={
                <CalendarPage
                  watchedFilms={watchedFilms}
                  onAddFilm={handleAddFilm}
                  onUpdateFilm={handleUpdateFilm}
                  onDeleteFilm={handleDeleteFilm}
                />
              } 
            />
            <Route 
              path="/watchlater" 
              element={
                <WatchLaterPage
                  watchLaterFilms={watchLaterFilms}
                  onAddToWatchLater={handleAddToWatchLater}
                  onDeleteFromWatchLater={handleDeleteFromWatchLater}
                  onMoveToWatched={handleMoveToWatched}
                />
              } 
            />
            <Route 
              path="/all-movies" 
              element={
                <AllMoviesPage 
                  watchedFilms={watchedFilms}
                  onEditFilm={handleUpdateFilm}
                  onDeleteFilm={handleDeleteFilm}
                />
              } 
            />
            <Route 
              path="/statistics" 
              element={<StatisticsPage watchedFilms={watchedFilms} />} 
            />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/signin" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
