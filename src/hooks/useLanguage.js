import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export function useLanguage(userId) {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  // Load language preference from database
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadLanguagePreference = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('language')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
          throw error;
        }

        if (data?.language) {
          await i18n.changeLanguage(data.language);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLanguagePreference();
  }, [userId, i18n]);

  const changeLanguage = async (language) => {
    if (!userId) {
      // If no user, just change language in browser
      await i18n.changeLanguage(language);
      return;
    }

    try {
      // Change language in i18n
      await i18n.changeLanguage(language);

      // Save to database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          language: language,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast.success(
        language === 'en' ? 'Language changed to English' : 'Мову змінено на українську',
        { duration: 2000 }
      );
    } catch (error) {
      console.error('Error saving language preference:', error);
      toast.error('Failed to save language preference');
    }
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    loading
  };
}
