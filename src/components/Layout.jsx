import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Film, Calendar as CalendarIcon, Clock, Film as FilmIcon, BarChart3, LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/signin');
  };

  const navItems = [
    { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
    { path: '/watchlater', label: 'Later', icon: Clock },
    { path: '/all-movies', label: 'All Movies', icon: FilmIcon },
    { path: '/statistics', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="glass border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-gray-400" />
              <h1 className="text-2xl font-bold">CinemaTape</h1>
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
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 sm:gap-2 justify-center overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0
                  ${isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }
                `}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm md:text-base">{item.label}</span>
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
