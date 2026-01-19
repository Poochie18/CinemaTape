import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Film, Calendar as CalendarIcon, Clock, Film as FilmIcon, BarChart3, LogOut, User, Languages } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';

export default function Layout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const { currentLanguage, changeLanguage } = useLanguage(user?.id);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Close dropdowns when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) {
        setShowDropdown(false);
      }
      if (!e.target.closest('.lang-menu')) {
        setShowLangDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success(t('auth.signOutSuccess'));
    navigate('/signin');
  };

  const navItems = [
    { path: '/calendar', label: t('nav.calendar'), icon: CalendarIcon },
    { path: '/watchlater', label: t('nav.later'), icon: Clock },
    { path: '/all-movies', label: t('nav.allMovies'), icon: FilmIcon },
    { path: '/statistics', label: t('nav.statistics'), icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="glass border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <NavLink to="/calendar" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Film className="w-8 h-8 text-gray-400" />
              <h1 className="text-2xl font-bold">{t('app.name')}</h1>
            </NavLink>
            
            {/* Language & User Menu */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative lang-menu">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors text-sm"
                >
                  <Languages className="w-5 h-5" />
                  <span className="hidden sm:inline uppercase">{currentLanguage}</span>
                </button>

                <AnimatePresence>
                  {showLangDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-40 bg-gray-900/95 backdrop-blur-xl rounded-lg shadow-xl border border-gray-700/50 overflow-hidden z-50"
                    >
                      <button
                        onClick={() => {
                          changeLanguage('en');
                          setShowLangDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          currentLanguage === 'en' ? 'bg-gray-800/50 text-white' : 'text-gray-300 hover:bg-gray-800/50'
                        }`}
                      >
                        <span className="text-xl">🇬🇧</span>
                        <span>English</span>
                      </button>
                      <button
                        onClick={() => {
                          changeLanguage('uk');
                          setShowLangDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          currentLanguage === 'uk' ? 'bg-gray-800/50 text-white' : 'text-gray-300 hover:bg-gray-800/50'
                        }`}
                      >
                        <span className="text-xl">🇺🇦</span>
                        <span>Українська</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative user-menu">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-lg transition-colors text-sm"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user?.user_metadata?.name || 'User'}</span>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-lg shadow-xl border border-gray-700/50 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-700/50">
                        <p className="text-sm text-gray-400 mb-1">{t('auth.signedInAs')}</p>
                        <p className="text-sm font-medium text-gray-200 truncate">{user?.user_metadata?.name || user?.email || 'User'}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleSignOut();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('auth.signOut')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 justify-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all
                  ${isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="hidden md:inline text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
