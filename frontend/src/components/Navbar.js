import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  HomeIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  GlobeAltIcon
} from '@heroicons/react/outline';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsLanguageMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: t('common.home'), icon: HomeIcon },
    { path: '/dashboard', label: t('common.dashboard'), icon: ChartBarIcon, auth: true },
    { path: '/marketplace', label: t('common.marketplace'), icon: ShoppingBagIcon, auth: true },
    { path: '/residue-estimation', label: t('common.residue_estimation'), icon: SparklesIcon, auth: true },
    { path: '/environmental-impact', label: t('common.environmental_impact'), icon: GlobeAltIcon, auth: true },
    { path: '/transactions', label: t('common.transactions'), icon: CurrencyDollarIcon, auth: true },
    { path: '/profile', label: t('common.profile'), icon: UserIcon, auth: true },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <SparklesIcon className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gradient">CropResidue</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              if (item.auth && !isAuthenticated) return null;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <GlobeAltIcon className="h-4 w-4" />
                <span>{t('navigation.language')}</span>
              </button>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                        i18n.language === lang.code ? 'bg-green-50 text-green-700' : ''
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="btn-outline text-sm"
                >
                  {t('common.login')}
                </Link>
                <Link
                  to="/farmer-register"
                  className="btn-primary text-sm"
                >
                  {t('common.register')}
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {userRole === 'farmer' ? t('navigation.farmer_portal') : t('navigation.buyer_portal')}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-outline text-sm"
                >
                  {t('common.logout')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                if (item.auth && !isAuthenticated) return null;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      isActivePath(item.path)
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t pt-4 mt-4">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {t('navigation.language')}
                  </p>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center space-x-2 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                          i18n.language === lang.code ? 'bg-green-50 text-green-700' : ''
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {!isAuthenticated ? (
                  <div className="px-3 py-2 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn-outline w-full text-center"
                    >
                      {t('common.login')}
                    </Link>
                    <Link
                      to="/farmer-register"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn-primary w-full text-center"
                    >
                      {t('common.register')}
                    </Link>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    <p className="text-sm text-gray-600 mb-2">
                      {userRole === 'farmer' ? t('navigation.farmer_portal') : t('navigation.buyer_portal')}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="btn-outline w-full text-center"
                    >
                      {t('common.logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
