import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, Film, Play, ChevronLeft, Heart, Loader2, Ticket, AlertTriangle, MapPin, Globe } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { movieService, showService } from '../services';
import { useAuthContext } from '../context/AuthContext';
import { useUIStore } from '../store';
import toast from 'react-hot-toast';

function formatDuration(min) {
  const h = Math.floor(min / 60), m = min % 60;
  return `${h}h ${m}m`;
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSignedIn, updateUser } = useAuthContext();
  const { selectedCity } = useUIStore();
  const [showAuthHint, setShowAuthHint] = useState(false);
  const [activeShowLang, setActiveShowLang] = useState('All');
  const [activeShowFormat, setActiveShowFormat] = useState('All');

  const { data: movieRes, isLoading: movieLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieService.getById(id),
    enabled: !!id,
  });

  const { data: showsRes, isLoading: showsLoading } = useQuery({
    queryKey: ['movieShows', id],
    queryFn: () => showService.getAll({ movieId: id }),
    enabled: !!id,
  });

  const movie = movieRes?.data?.data;
  const shows = showsRes?.data?.data || [];

  // Reset filters when movie or city changes
  useEffect(() => {
    setActiveShowLang('All');
    setActiveShowFormat('All');
  }, [id, selectedCity]);

  // Shows in the selected city
  const cityShows = useMemo(() => {
    return shows.filter(s => !s.theaterId?.city || s.theaterId.city.toLowerCase() === selectedCity.toLowerCase());
  }, [shows, selectedCity]);

  const availableLangs = useMemo(() => {
    const langs = new Set();
    cityShows.forEach(s => { if (s.language) langs.add(s.language); });
    return Array.from(langs);
  }, [cityShows]);

  const availableFormats = useMemo(() => {
    const fmts = new Set();
    cityShows.forEach(s => { if (s.format) fmts.add(s.format); });
    return Array.from(fmts);
  }, [cityShows]);

  const filteredShows = useMemo(() => {
    return cityShows.filter(s => {
      const langOk = activeShowLang === 'All' || s.language === activeShowLang;
      const fmtOk = activeShowFormat === 'All' || s.format === activeShowFormat;
      return langOk && fmtOk;
    });
  }, [cityShows, activeShowLang, activeShowFormat]);

  const { data: recommendRes } = useQuery({
    queryKey: ['recommendMovies', movie?.genre],
    queryFn: () => movieService.getAll({ limit: 12 }),
    enabled: !!movie,
  });

  const recommended = (recommendRes?.data?.data || []).filter(m => m._id !== id).slice(0, 6);

  if (movieLoading || showsLoading) {
    return (
      <div className="min-h-screen bg-cinema-black pt-28 flex flex-col items-center justify-center text-cinema-muted">
        <Loader2 className="w-10 h-10 text-cinema-red animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider uppercase">Loading Movie Details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <Film className="w-16 h-16 text-cinema-red mx-auto mb-4 opacity-50" />
        <h1 className="font-display text-3xl font-bold text-cinema-off-white mb-2">Movie Not Found</h1>
        <p className="text-cinema-muted mb-6">This movie doesn't exist in our system.</p>
        <Link to="/movies" className="btn-primary px-6 py-3">Browse Movies</Link>
      </div>
    );
  }

  const handleBookShow = (show) => {
    if (!isSignedIn) { setShowAuthHint(true); return; }
    // Store booking session
    sessionStorage.setItem('cineflow_booking', JSON.stringify({
      movie: {
        _id: movie._id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        genre: movie.genre,
        duration: movie.duration,
      },
      show: {
        _id: show._id,
        showTime: show.showTime,
        format: show.format,
        language: show.language,
        theaterId: {
          name: show.theaterId?.name,
          city: show.theaterId?.city,
        },
        pricing: show.pricing,
      },
    }));
    navigate(`/booking/${show._id}`);
  };

  const isFavoriteMovie = user?.favoriteMovies?.some(m => m.id === movie._id);

  const toggleFavoriteMovie = () => {
    if (!isSignedIn) { toast.error('Please sign in to save favorites'); return; }
    let favs = user.favoriteMovies || [];
    if (isFavoriteMovie) {
      favs = favs.filter(m => m.id !== movie._id);
      toast.success('Removed from favorites');
    } else {
      favs = [...favs, { id: movie._id, title: movie.title, poster: movie.posterUrl, genre: movie.genre?.join(', ') }];
      toast.success('Added to favorites!');
    }
    updateUser({ favoriteMovies: favs });
  };

  const toggleFavoriteActor = (actorName) => {
    if (!isSignedIn) { toast.error('Please sign in to save favorites'); return; }
    let favs = user.favoriteActors || [];
    const isFav = favs.some(a => a.name === actorName);
    if (isFav) {
      favs = favs.filter(a => a.name !== actorName);
      toast.success(`Removed ${actorName}`);
    } else {
      favs = [...favs, { name: actorName }];
      toast.success(`Liked ${actorName}!`);
    }
    updateUser({ favoriteActors: favs });
  };

  return (
    <main className="pt-14 pb-16 min-h-screen bg-cinema-black">
      {/* Hero banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={movie.posterUrl.replace('300/450', '1200/400')} alt={movie.title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = `https://placehold.co/1200x400/1a0000/E50914?text=${encodeURIComponent(movie.title)}`; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/60 to-cinema-black/20" />
        <Link to="/movies" className="absolute top-5 left-5 glass px-3 py-1.5 rounded-lg text-sm text-cinema-off-white flex items-center gap-1 hover:border-cinema-red/50 transition-all">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl overflow-hidden shadow-card border border-cinema-border max-w-xs mx-auto lg:max-w-none">
              <img src={movie.posterUrl} alt={movie.title} className="w-full aspect-[2/3] object-cover"
                onError={e => { e.target.src = `https://placehold.co/300x450/1a1a1a/E50914?text=${encodeURIComponent(movie.title)}`; }} />
            </motion.div>
            <button className="btn-outline w-full max-w-xs mx-auto lg:max-w-none mt-3 flex items-center justify-center gap-2 text-sm">
              <Play className="w-4 h-4 fill-current" /> Watch Trailer
            </button>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-cinema-red text-xs font-semibold uppercase tracking-widest">{movie.certificate} • {movie.language?.join(' / ')}</span>
                  <h1 className="font-display text-3xl md:text-4xl font-black text-cinema-off-white mt-1">{movie.title}</h1>
                </div>
                <button 
                  onClick={toggleFavoriteMovie}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all flex-shrink-0
                    ${isFavoriteMovie 
                      ? 'border-cinema-red text-cinema-red bg-cinema-red/10 shadow-[0_0_15px_rgba(229,9,20,0.4)]' 
                      : 'border-cinema-border text-cinema-muted hover:text-cinema-red hover:border-cinema-red hover:bg-cinema-red/5'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavoriteMovie ? 'fill-cinema-red' : ''}`} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-cinema-muted">
                {!movie.isComingSoon && (
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-cinema-red fill-cinema-red" />
                    <span className="text-cinema-off-white font-semibold">{movie.averageRating}</span>/10 ({movie.votes || `${(movie.totalReviews / 1000).toFixed(1)}K`} votes)
                  </span>
                )}
                {movie.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{formatDuration(movie.duration)}</span>}
                <span className="flex items-center gap-1.5 font-medium text-cinema-off-white">
                  <Calendar className="w-4 h-4 text-cinema-red" />
                  {movie.isComingSoon 
                    ? `Releasing ${new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` 
                    : new Date(movie.releaseDate).getFullYear() || 2024}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre?.map(g => <span key={g} className="px-3 py-1 rounded-full border border-cinema-red/30 bg-cinema-red/10 text-cinema-red text-xs font-medium">{g}</span>)}
                {movie.format?.map(f => <span key={f} className="px-3 py-1 rounded-full border border-cinema-border bg-cinema-card text-cinema-muted text-xs">{f}</span>)}
              </div>

              {movie.description && (
                <div className="mb-5">
                  <h2 className="text-cinema-red text-xs font-semibold uppercase tracking-wider mb-2">Synopsis</h2>
                  <p className="text-cinema-muted leading-relaxed">{movie.description}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {movie.director && <div><h2 className="text-cinema-red text-xs font-semibold uppercase tracking-wider mb-1">Director</h2><p className="text-cinema-off-white text-sm">{movie.director}</p></div>}
                {movie.cast?.length > 0 && (
                  <div>
                    <h2 className="text-cinema-red text-xs font-semibold uppercase tracking-wider mb-2">Cast</h2>
                    <div className="flex flex-wrap gap-2">
                      {movie.cast.map(actor => {
                        const isFav = user?.favoriteActors?.some(a => a.name === actor);
                        return (
                          <div key={actor} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cinema-border/50 bg-cinema-dark/50 hover:border-cinema-red/30 transition-colors">
                            <span className="text-cinema-off-white text-sm">{actor}</span>
                            <button onClick={() => toggleFavoriteActor(actor)} className="ml-1 text-cinema-muted hover:text-cinema-red transition-colors">
                              <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-cinema-red fill-cinema-red' : ''}`} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Auth hint */}
              {showAuthHint && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-cinema-red/10 border border-cinema-red/40 rounded-xl p-4 mb-4 text-sm text-cinema-off-white">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-cinema-red flex-shrink-0" />
                    <span>Please <strong className="text-cinema-red">Sign In</strong> or <strong className="text-cinema-red">Sign Up</strong> to book tickets. Use the buttons in the top-right navbar.</span>
                  </div>
                </motion.div>
              )}

              {/* Shows */}
              <div className="bg-cinema-dark border border-cinema-border rounded-2xl p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-cinema-border/50">
                  <div>
                    <h2 className="font-display text-lg font-bold text-cinema-off-white flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-cinema-red" />
                      <span>Book Tickets</span>
                    </h2>
                    <p className="text-xs text-cinema-muted flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-cinema-red" /> Shows in <strong className="text-cinema-off-white">{selectedCity}</strong> (Change in header)
                    </p>
                  </div>
                </div>

                {/* Filters */}
                {cityShows.length > 0 && (
                  <div className="space-y-3 mb-5 bg-cinema-black/40 p-3.5 rounded-xl border border-cinema-border/30">
                    {/* Language Filters */}
                    {availableLangs.length > 1 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-cinema-muted font-medium w-16">Language:</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button onClick={() => setActiveShowLang('All')}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${activeShowLang === 'All' ? 'bg-cinema-red border-cinema-red text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]' : 'border-cinema-border text-cinema-muted hover:text-cinema-off-white'}`}>
                            All
                          </button>
                          {availableLangs.map(lang => (
                            <button key={lang} onClick={() => setActiveShowLang(lang)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${activeShowLang === lang ? 'bg-cinema-red border-cinema-red text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]' : 'border-cinema-border text-cinema-muted hover:text-cinema-off-white'}`}>
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Format Filters */}
                    {availableFormats.length > 1 && (
                      <div className="flex items-center gap-2 flex-wrap border-t border-cinema-border/20 pt-2.5">
                        <span className="text-xs text-cinema-muted font-medium w-16">Format:</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button onClick={() => setActiveShowFormat('All')}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${activeShowFormat === 'All' ? 'bg-cinema-red border-cinema-red text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]' : 'border-cinema-border text-cinema-muted hover:text-cinema-off-white'}`}>
                            All
                          </button>
                          {availableFormats.map(fmt => (
                            <button key={fmt} onClick={() => setActiveShowFormat(fmt)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${activeShowFormat === fmt ? 'bg-cinema-red border-cinema-red text-white shadow-[0_0_10px_rgba(229,9,20,0.3)]' : 'border-cinema-border text-cinema-muted hover:text-cinema-off-white'}`}>
                              {fmt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {movie.isComingSoon ? (
                  <div className="text-center py-8 bg-cinema-black/40 rounded-xl border border-cinema-border/50">
                    <Calendar className="w-8 h-8 text-yellow-500 mx-auto mb-2.5 opacity-80" />
                    <p className="text-cinema-off-white text-sm font-semibold">Coming Soon to Theaters</p>
                    <p className="text-xs text-cinema-muted mt-1 max-w-md mx-auto px-4 leading-relaxed">
                      This movie is scheduled to release on <strong className="text-cinema-off-white">{new Date(movie.releaseDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>. Ticket bookings will open closer to the release date!
                    </p>
                  </div>
                ) : shows.length === 0 ? (
                  <p className="text-cinema-muted text-sm text-center py-4">No shows available today.</p>
                ) : cityShows.length === 0 ? (
                  <div className="text-center py-6">
                    <MapPin className="w-8 h-8 text-cinema-red mx-auto mb-2 opacity-50" />
                    <p className="text-cinema-muted text-sm">No shows available in <span className="text-cinema-off-white font-semibold">{selectedCity}</span> today.</p>
                    <p className="text-xs text-cinema-muted mt-1">Please select another city in the top navigation bar to see shows.</p>
                  </div>
                ) : filteredShows.length === 0 ? (
                  <p className="text-cinema-muted text-sm text-center py-4">No shows match the selected language or format filters.</p>
                ) : (
                  <div className="space-y-3">
                    {filteredShows.map(show => (
                      <div key={show._id} className="border border-cinema-border rounded-xl p-4 hover:border-cinema-red/40 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-cinema-off-white font-semibold text-sm">{show.theaterId?.name}</p>
                            <p className="text-cinema-muted text-xs mt-0.5">{show.format} • {show.language}</p>
                          </div>
                          {movie.isHouseFull || show.availableSeats === 0 ? (
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold text-red-500 bg-red-500/10 uppercase tracking-wider animate-pulse">
                              House Full
                            </span>
                          ) : (
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${show.availableSeats < 10 ? 'text-red-400 bg-red-400/10' : show.availableSeats < 50 ? 'text-yellow-400 bg-yellow-400/10' : 'text-green-400 bg-green-400/10'}`}>
                              {show.availableSeats} seats left
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-cinema-muted text-xs">
                            ₹{show.pricing?.standard} – ₹{show.pricing?.vip}
                          </div>
                          {movie.isHouseFull || show.availableSeats === 0 ? (
                            <button disabled
                              className="bg-zinc-850 text-cinema-muted font-bold text-sm px-5 py-2 rounded-lg cursor-not-allowed border border-cinema-border/50">
                              Sold Out
                            </button>
                          ) : (
                            <button onClick={() => handleBookShow(show)}
                              className="bg-cinema-red hover:bg-cinema-red-dark text-white font-bold text-sm px-5 py-2 rounded-lg transition-all flex items-center gap-2 animate-pulse-subtle">
                              {new Date(show.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related movies */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold text-cinema-off-white mb-5">More Like This</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {recommended.map(m => (
              <Link key={m._id} to={`/movies/${m._id}`} className="group">
                <div className="rounded-xl overflow-hidden aspect-[2/3] bg-cinema-card">
                  <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = `https://placehold.co/300x450/1a1a1a/E50914?text=${encodeURIComponent(m.title[0])}`; }} />
                </div>
                <p className="text-cinema-off-white text-xs font-medium mt-2 truncate group-hover:text-cinema-red transition-colors">{m.title}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
