import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock, Eye, EyeOff, Languages } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Auth() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const changeLanguage = async (lang) => {
    await i18n.changeLanguage(lang);
    setShowLangDropdown(false);
    toast.success(lang === 'en' ? 'Language changed to English' : 'Мову змінено на українську');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              name: name.trim() || 'User',
            },
          },
        });
        if (error) throw error;
        
        // Check if email confirmation is required
        if (data?.user?.identities?.length === 0) {
          toast.error(t('auth.emailAlreadyRegistered'));
        } else if (data?.user && !data?.session) {
          toast.success(t('auth.confirmEmail'));
        } else {
          toast.success(t('auth.signUpSuccess'));
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t('auth.signInSuccess'));
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || t('auth.authFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-2 px-3 py-2 glass rounded-lg hover:bg-gray-800/50 transition-colors text-sm"
          >
            <Languages className="w-5 h-5" />
            <span className="uppercase">{i18n.language}</span>
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-40 glass rounded-lg shadow-xl border border-gray-700/50 overflow-hidden">
              <button
                onClick={() => changeLanguage('en')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  i18n.language === 'en' ? 'bg-gray-800/50 text-white' : 'text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <span className="text-xl">🇬🇧</span>
                <span>English</span>
              </button>
              <button
                onClick={() => changeLanguage('uk')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  i18n.language === 'uk' ? 'bg-gray-800/50 text-white' : 'text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                <span className="text-xl">🇺🇦</span>
                <span>Українська</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700/50 mb-4">
            <LogIn className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('app.name')}</h1>
          <p className="text-gray-400 text-sm">{t('app.tagline')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {/* Name (only for sign up) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.yourName')}
                className="input-field"
                required
                disabled={loading}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.yourEmail')}
                className="input-field pl-11"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-11 pr-11"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                {isSignUp ? t('auth.signUp') : t('auth.signIn')}
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign In/Up */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-400 hover:text-gray-300"
            disabled={loading}
          >
            {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}
