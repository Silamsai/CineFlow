import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Filter, Flame, Sparkles, Film, Tv2, Loader2, MapPin, Ticket, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { movieService } from '../services';
import { LANGUAGES, GENRES, FORMATS } from '../data/mockMovies';
import { useUIStore } from '../store';
import LiquidButton from '../components/Effects/LiquidButton';
import PerspectiveTilt from '../components/Effects/PerspectiveTilt';

// ── OTT logo imports (local SVGs — never break, no CORS issues) ──────────────
import logoNetflix from '../assets/ott/netflix.svg';
import logoJioHotstar from '../assets/ott/jiohotstar.svg';
import logoPrimeVideo from '../assets/ott/primevideo.svg';
import logoAha from '../assets/ott/aha.svg';
import logoSonyLIV from '../assets/ott/sonyliv.svg';
import logoZEE5 from '../assets/ott/zee5.svg';
import logoMXPlayer from '../assets/ott/mxplayer.svg';
import logoMubi from '../assets/ott/mubi.svg';

// ── OTT Platforms ────────────────────────────────────────────────────────────
const OTT_PLATFORMS = [
  { name: 'Netflix', tagline: 'Stream movies & series', url: 'https://www.netflix.com', accent: '#E50914', bg: 'linear-gradient(135deg,#1a0000 0%,#2d0000 100%)', logo: logoNetflix },
  { name: 'JioHotstar', tagline: 'India\'s biggest OTT', url: 'https://www.jiohotstar.com', accent: '#1DA1F2', bg: 'linear-gradient(135deg,#001a2d 0%,#002d4a 100%)', logo: logoJioHotstar },
  { name: 'Prime Video', tagline: 'Award-winning originals', url: 'https://www.primevideo.com', accent: '#00A8E0', bg: 'linear-gradient(135deg,#00111a 0%,#001e2d 100%)', logo: logoPrimeVideo },
  { name: 'Aha', tagline: 'Telugu & Tamil hits', url: 'https://www.aha.video', accent: '#FFCC00', bg: 'linear-gradient(135deg,#1a1500 0%,#2d2300 100%)', logo: logoAha },
  { name: 'SonyLIV', tagline: 'Sports, shows & films', url: 'https://www.sonyliv.com', accent: '#FF6B6B', bg: 'linear-gradient(135deg,#1a0000 0%,#2a0808 100%)', logo: logoSonyLIV },
  { name: 'ZEE5', tagline: 'Hindi & regional content', url: 'https://www.zee5.com', accent: '#9B59B6', bg: 'linear-gradient(135deg,#0d001a 0%,#1a0033 100%)', logo: logoZEE5 },
  { name: 'MX Player', tagline: 'Free movies & web series', url: 'https://www.mxplayer.in', accent: '#FF6F00', bg: 'linear-gradient(135deg,#1a0800 0%,#2d1000 100%)', logo: logoMXPlayer },
  { name: 'Mubi', tagline: 'Curated cinema', url: 'https://mubi.com', accent: '#3AF2CC', bg: 'linear-gradient(135deg,#001a16 0%,#002d26 100%)', logo: logoMubi },
];

// ── Movie Card ──────────────────────────────────────────────────────────────
function MovieCard({ movie, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative flex-shrink-0 cursor-pointer"
    >
      <Link to={`/movies/${movie._id}`}>
        {/* Poster */}
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-cinema-card">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={e => { e.target.src = `https://placehold.co/300x450/1a1a1a/E50914?text=${encodeURIComponent(movie.title)}`; }}
          />
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
            {movie.isHouseFull && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.7)]">
                House Full
              </span>
            )}
            <div className="flex gap-1.5">
              {movie.isHot && (
                <span className="bg-cinema-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5" /> Hot
                </span>
              )}
              {movie.isNew && (
                <span className="bg-black/70 text-cinema-red text-[10px] font-bold px-2 py-0.5 rounded-full border border-cinema-red">New</span>
              )}
            </div>
          </div>

          {/* Book button on hover */}
          <div className="absolute bottom-3 left-0 right-0 px-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            {movie.isHouseFull ? (
              <button className="w-full bg-zinc-850 text-cinema-muted text-xs font-bold py-2 rounded-lg cursor-not-allowed border border-cinema-border/50">
                House Full
              </button>
            ) : (
              <button className="w-full bg-cinema-red hover:bg-cinema-red-dark text-white text-xs font-bold py-2 rounded-lg transition-colors">
                Book Tickets
              </button>
            )}
          </div>

          {/* Formats */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {movie.format?.slice(0, 2).map(f => (
              <span key={f} className="bg-black/70 text-cinema-off-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">{f}</span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-2.5 px-0.5">
          <h3 className="text-cinema-off-white font-semibold text-sm leading-tight truncate group-hover:text-cinema-red transition-colors">{movie.title}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-1 bg-cinema-card border border-cinema-border rounded px-1.5 py-0.5">
              <Star className="w-3 h-3 text-cinema-red fill-cinema-red" />
              <span className="text-cinema-off-white text-xs font-bold">{movie.averageRating}/10</span>
            </div>
            <span className="text-cinema-muted text-xs">{movie.votes || `${(movie.totalReviews / 1000).toFixed(1)}K`} votes</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {movie.genre?.slice(0, 2).map(g => (
              <span key={g} className="text-cinema-muted text-[10px] border border-cinema-border/60 px-1.5 py-0.5 rounded">{g}</span>
            ))}
            <span className="text-cinema-muted text-[10px] border border-cinema-border/60 px-1.5 py-0.5 rounded">{movie.certificate}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Filter Pill ──────────────────────────────────────────────────────────────
function FilterPill({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${active ? 'bg-cinema-red border-cinema-red text-white' : 'border-cinema-border text-cinema-muted hover:border-cinema-red/50 hover:text-cinema-off-white'
        }`}>
      {label}
    </button>
  );
}

// ── Main Home Page ───────────────────────────────────────────────────────────
export default function Home() {
  const [activeLanguage, setActiveLanguage] = useState('All');
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeFormat, setActiveFormat] = useState('All');
  const { selectedCity } = useUIStore();

  const { data: moviesRes, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: () => movieService.getAll({ limit: 100 }),
  });

  const ALL_MOVIES = useMemo(() => moviesRes?.data?.data || [], [moviesRes]);

  const filtered = useMemo(() => {
    return ALL_MOVIES.filter(m => {
      if (m.isComingSoon) return false;
      const langOk = activeLanguage === 'All' || m.language?.includes(activeLanguage);
      const genreOk = activeGenre === 'All' || m.genre?.includes(activeGenre);
      const fmtOk = activeFormat === 'All' || m.format?.includes(activeFormat);
      return langOk && genreOk && fmtOk;
    });
  }, [ALL_MOVIES, activeLanguage, activeGenre, activeFormat]);

  const hotMovies = useMemo(() => ALL_MOVIES.filter(m => m.isHot && !m.isComingSoon), [ALL_MOVIES]);

  const comingSoonMovies = useMemo(() => ALL_MOVIES.filter(m => m.isComingSoon), [ALL_MOVIES]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cinema-black pt-28 flex flex-col items-center justify-center text-cinema-muted animate-pulse">
        <Loader2 className="w-10 h-10 text-cinema-red animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider uppercase">Loading CineFlow Blockbusters...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-black pt-14">

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <section className="relative h-[420px] md:h-[500px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cinema-black via-red-950/20 to-cinema-black" />
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(ellipse at 60% 50%, rgba(229,9,20,0.12) 0%, transparent 70%)' }} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-cinema-red/10 border border-cinema-red/30 text-cinema-red text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Now Showing in Theaters
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-black text-cinema-off-white mb-3">
              Book Movie Tickets
            </h1>
            <p className="text-cinema-muted text-base md:text-lg max-w-md mb-6">
              Now showing the best blockbusters in <strong className="text-cinema-off-white">{selectedCity}</strong>. Pick your seats and enjoy the show!
            </p>
            <LiquidButton size="lg" onClick={() => window.location.href = '/movies'}>
              <Play className="w-4 h-4" /> Explore All Movies <ChevronRight className="w-4 h-4" />
            </LiquidButton>
          </motion.div>
        </div>

        {/* Floating movie posters strip */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
          <div className="flex gap-3 animate-[shimmer_20s_linear_infinite]" style={{ width: 'max-content' }}>
            {[...ALL_MOVIES, ...ALL_MOVIES].map((m, i) => (
              <img key={i} src={m.posterUrl} alt="" className="h-24 w-16 object-cover rounded-t-lg opacity-30 flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>

      {/* ── OTT PLATFORMS ──────────────────────────────────────────────── */}
      <section className="bg-cinema-dark border-b border-cinema-border py-6 px-4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Tv2 className="w-5 h-5 text-cinema-red" />
            <h2 className="text-cinema-off-white font-bold text-base">Watch Online</h2>
            <span className="text-cinema-muted text-xs ml-1">— Stream on your favourite platform</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {OTT_PLATFORMS.map((ott, i) => (
              <motion.a
                key={ott.name}
                href={ott.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex-shrink-0 w-44 rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all duration-300 group cursor-pointer flex flex-col"
                style={{ background: ott.bg }}
              >
                {/* Platform Logo */}
                <div className="h-10 flex items-center mb-3">
                  <img
                    src={ott.logo}
                    alt={ott.name}
                    className="max-h-10 max-w-[120px] w-auto object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  {/* Fallback text if logo fails */}
                  <span
                    className="font-display font-black text-lg leading-none tracking-tight hidden"
                    style={{ color: ott.accent }}
                  >
                    {ott.name}
                  </span>
                </div>
                <p className="text-cinema-muted text-[11px] leading-tight mb-3 flex-1">{ott.tagline}</p>
                <div
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit"
                  style={{ background: `${ott.accent}22`, color: ott.accent }}
                >
                  <Tv2 className="w-3 h-3" /> Watch Now
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTERS ─────────────────────────────────────────────────────── */}
      <div className="sticky top-14 z-40 bg-cinema-black/95 backdrop-blur-md border-b border-cinema-border">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 space-y-2.5">
          {/* Language row */}
          <div className="flex items-center gap-3">
            <span className="text-cinema-muted text-xs font-semibold uppercase tracking-wider flex-shrink-0 w-16">Language</span>
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {LANGUAGES.map(l => <FilterPill key={l} label={l} active={activeLanguage === l} onClick={() => setActiveLanguage(l)} />)}
            </div>
          </div>
          {/* Genre row */}
          <div className="flex items-center gap-3">
            <span className="text-cinema-muted text-xs font-semibold uppercase tracking-wider flex-shrink-0 w-16">Genre</span>
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {GENRES.map(g => <FilterPill key={g} label={g} active={activeGenre === g} onClick={() => setActiveGenre(g)} />)}
            </div>
          </div>
          {/* Format row */}
          <div className="flex items-center gap-3">
            <span className="text-cinema-muted text-xs font-semibold uppercase tracking-wider flex-shrink-0 w-16">Format</span>
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {FORMATS.map(f => <FilterPill key={f} label={f} active={activeFormat === f} onClick={() => setActiveFormat(f)} />)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8 space-y-12">

        {/* ── TRENDING ────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-bold text-cinema-off-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-cinema-red" /> Trending Now
            </h2>
            <Link to="/movies" className="text-cinema-red text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {hotMovies.map((movie, i) => (
              <PerspectiveTilt key={movie._id} maxTilt={6} scale={1.01}>
                <MovieCard movie={movie} index={i} />
              </PerspectiveTilt>
            ))}
          </div>
        </section>

        {/* ── NOW SHOWING ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-bold text-cinema-off-white flex items-center gap-2">
              <Film className="w-6 h-6 text-cinema-red" /> Now Showing
              <span className="text-cinema-muted text-sm font-normal">({filtered.length} movies)</span>
            </h2>
            <Link to="/movies" className="text-cinema-red text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-cinema-muted">
              <Film className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No movies match the selected filters.</p>
              <button onClick={() => { setActiveLanguage('All'); setActiveGenre('All'); setActiveFormat('All'); }}
                className="mt-3 text-cinema-red text-sm underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((movie, i) => (
                <PerspectiveTilt key={movie._id} maxTilt={6} scale={1.01}>
                  <MovieCard movie={movie} index={i} />
                </PerspectiveTilt>
              ))}
            </div>
          )}
        </section>

        {/* ── COMING SOON ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-bold text-cinema-off-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cinema-red" /> Coming Soon
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comingSoonMovies.map((m, i) => {
              const bgColors = ['from-red-950/40', 'from-purple-950/40', 'from-blue-950/40', 'from-emerald-950/40'];
              const bgColor = bgColors[i % bgColors.length];
              return (
                <motion.div key={m._id || m.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-gradient-to-r ${bgColor} to-cinema-card border border-cinema-border rounded-2xl p-5 flex items-center gap-4 hover:border-cinema-red/50 transition-all cursor-pointer`}>
                  <div className="w-14 h-20 rounded-xl overflow-hidden bg-cinema-red/20 flex-shrink-0 border border-cinema-border/50">
                    <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" onError={e => { e.target.src = `https://placehold.co/300x450/1a1a1a/E50914?text=${encodeURIComponent(m.title)}`; }} />
                  </div>
                  <div>
                    <h3 className="text-cinema-off-white font-bold">{m.title}</h3>
                    <p className="text-cinema-muted text-xs mt-0.5">{Array.isArray(m.genre) ? m.genre.slice(0, 2).join(', ') : m.genre}</p>
                    <span className="text-cinema-red text-xs font-semibold mt-1.5 block">
                      Releasing {m.releaseDate ? new Date(m.releaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Soon'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
            {comingSoonMovies.length === 0 && (
              <div className="col-span-full text-center py-8 text-cinema-muted">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30 text-cinema-red" />
                <p className="text-sm">No Coming Soon movies marked in the admin panel.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
