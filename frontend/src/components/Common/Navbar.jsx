import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, MapPin, ChevronDown, Globe, LogOut, User, Ticket, Sun, Moon } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useUIStore } from '../../store';
import { CITIES, LANGUAGES } from '../../data/mockMovies';
import AuthModal from './AuthModal';
import Logo from './Logo';

function CityModal({ onClose, onSelect, current, canClose = true }) {
  const [search, setSearch] = useState('');
  const filtered = CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-start justify-center pt-16 px-4"
      onClick={() => { if (canClose) onClose(); }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-cinema-dark border border-cinema-border rounded-2xl w-full max-w-md p-5 shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-cinema-off-white">Select City</h3>
          {canClose && (
            <button onClick={onClose} className="text-cinema-muted hover:text-cinema-off-white"><X className="w-5 h-5" /></button>
          )}
        </div>
        <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search city..." className="w-full bg-cinema-black border border-cinema-border rounded-lg px-4 py-2.5 text-cinema-off-white text-sm placeholder-cinema-muted focus:outline-none focus:border-cinema-red mb-4" />
        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
          {filtered.map(city => (
            <button key={city} onClick={() => { onSelect(city); if (onClose) onClose(); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${city === current ? 'bg-cinema-red text-white' : 'bg-cinema-black text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card'}`}>
              {city}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState('All');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, tab: 'login' });

  const { isSignedIn, user, logout } = useAuthContext();
  const { isMobileMenuOpen, setMobileMenuOpen, theme, toggleTheme, selectedCity, setSelectedCity, hasSelectedCity } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const langRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    if (!hasSelectedCity) {
      setShowCityModal(true);
    }
  }, [hasSelectedCity]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const close = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLangMenu(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <AuthModal isOpen={authModal.open} defaultTab={authModal.tab} onClose={() => setAuthModal({ open: false, tab: 'login' })} />
      <AnimatePresence>{showCityModal && <CityModal current={selectedCity} onClose={() => setShowCityModal(false)} onSelect={setSelectedCity} canClose={hasSelectedCity} />}</AnimatePresence>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cinema-black/98 backdrop-blur-md shadow-lg' : 'bg-cinema-black'} border-b border-cinema-border`}>
        <div className="max-w-screen-2xl mx-auto px-4 flex items-center h-14 gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center mr-2 flex-shrink-0" aria-label="Go to home">
            <Logo className="h-8 w-auto" />
          </Link>

          {/* City selector */}
          <button onClick={() => setShowCityModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card transition-all flex-shrink-0">
            <MapPin className="w-4 h-4 text-cinema-red" />
            <span className="font-medium">{selectedCity}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-muted" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for movies, theaters..."
                className="w-full bg-cinema-card border border-cinema-border rounded-lg pl-9 pr-4 py-2 text-sm text-cinema-off-white placeholder-cinema-muted focus:outline-none focus:border-cinema-red transition-colors" />
            </div>
          </form>

          {/* Language */}
          <div ref={langRef} className="relative hidden md:block flex-shrink-0">
            <button onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card transition-all">
              <Globe className="w-4 h-4" /><span>{selectedLang}</span><ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showLangMenu && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 top-full mt-1 bg-cinema-dark border border-cinema-border rounded-xl shadow-2xl p-2 min-w-[140px] z-50">
                  {LANGUAGES.map(lang => (
                    <button key={lang} onClick={() => { setSelectedLang(lang); setShowLangMenu(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${lang === selectedLang ? 'bg-cinema-red text-white' : 'text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card'}`}>
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            <Link to="/movies" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${location.pathname === '/movies' ? 'text-cinema-red bg-cinema-red/10' : 'text-cinema-muted hover:text-cinema-off-white'}`}>Movies</Link>
            {isSignedIn && <Link to="/my-bookings" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${location.pathname === '/my-bookings' ? 'text-cinema-red bg-cinema-red/10' : 'text-cinema-muted hover:text-cinema-off-white'}`}>My Bookings</Link>}
          </div>

          {/* Theme & Auth */}
          <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card transition-all flex-shrink-0"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {isSignedIn ? (
              <div ref={userRef} className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-cinema-card border border-cinema-border hover:border-cinema-red/50 transition-all">
                  {user?.profileImage || user?.picture ? (
                    <img src={user.profileImage || user.picture} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-cinema-red flex items-center justify-center text-white text-xs font-bold">
                      {user?.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-cinema-off-white text-sm font-medium hidden sm:block">{user?.firstName}</span>
                  <ChevronDown className="w-3 h-3 text-cinema-muted" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 top-full mt-1 bg-cinema-dark border border-cinema-border rounded-xl shadow-2xl p-2 min-w-[180px] z-50">
                      <div className="px-3 py-2 border-b border-cinema-border mb-1">
                        <p className="text-cinema-off-white text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                        <p className="text-cinema-muted text-xs truncate">{user?.email}</p>
                      </div>
                      <Link to="/my-bookings" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card transition-all">
                        <Ticket className="w-4 h-4" /> My Bookings
                      </Link>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card transition-all">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-cinema-red hover:bg-cinema-red/10 transition-all mt-1 border-t border-cinema-border pt-2">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setAuthModal({ open: true, tab: 'login' })}
                  className="px-4 py-1.5 text-sm font-semibold text-cinema-off-white border border-cinema-border rounded-lg hover:border-cinema-red/50 hover:text-cinema-red transition-all hidden sm:block">
                  Sign In
                </button>
                <button onClick={() => setAuthModal({ open: true, tab: 'signup' })}
                  className="px-4 py-1.5 text-sm font-bold bg-cinema-red hover:bg-cinema-red-dark text-white rounded-lg transition-all">
                  Sign Up
                </button>
              </div>
            )}
            <button className="lg:hidden p-1.5 text-cinema-muted" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-cinema-dark border-t border-cinema-border overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                <button onClick={() => setShowCityModal(true)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card">
                  <MapPin className="w-4 h-4 text-cinema-red" /><span className="text-sm">{selectedCity}</span>
                </button>
                <Link to="/movies" className="block px-3 py-2.5 rounded-lg text-sm text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card">Movies</Link>
                {isSignedIn && <Link to="/my-bookings" className="block px-3 py-2.5 rounded-lg text-sm text-cinema-muted hover:text-cinema-off-white hover:bg-cinema-card">My Bookings</Link>}
                {!isSignedIn && (
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => { setAuthModal({ open: true, tab: 'login' }); setMobileMenuOpen(false); }}
                      className="flex-1 py-2 border border-cinema-border text-cinema-muted rounded-lg text-sm">Sign In</button>
                    <button onClick={() => { setAuthModal({ open: true, tab: 'signup' }); setMobileMenuOpen(false); }}
                      className="flex-1 py-2 bg-cinema-red text-white rounded-lg text-sm font-bold">Sign Up</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
