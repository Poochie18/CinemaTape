import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}

export function useWatchedFilms(userId) {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setFilms([]);
      setLoading(false);
      return;
    }

    fetchFilms();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('watched_films')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'watched_films',
        filter: `user_id=eq.${userId}`
      }, fetchFilms)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchFilms = async () => {
    const { data, error } = await supabase
      .from('watched_films')
      .select('*')
      .eq('user_id', userId)
      .order('watch_date', { ascending: false });

    if (!error) {
      setFilms(data || []);
    }
    setLoading(false);
  };

  return { films, loading, refetch: fetchFilms };
}

export function useWatchLater(userId) {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setFilms([]);
      setLoading(false);
      return;
    }

    fetchFilms();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('watch_later')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'watch_later',
        filter: `user_id=eq.${userId}`
      }, fetchFilms)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchFilms = async () => {
    const { data, error } = await supabase
      .from('watch_later')
      .select('*')
      .eq('user_id', userId)
      .order('added_date', { ascending: false });

    if (!error) {
      setFilms(data || []);
    }
    setLoading(false);
  };

  return { films, loading, refetch: fetchFilms };
}
