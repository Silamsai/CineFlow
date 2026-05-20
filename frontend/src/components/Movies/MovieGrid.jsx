import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Flame, Filter, LayoutGrid, List, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { movieService } from '../../services';
import { LANGUAGES, GENRES, FORMATS } from '../../data/mockMovies';

const PAGE_SIZE = 12;

function MovieCardGrid({ movie, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="group cursor-pointer">
      <Link to={`/movies/${movie._id}`}>
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-cinema-card">
          <img src={movie.posterUrl} alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = `https://placehold.co/300x450/1a1a1a/E50914?text=${encodeURIComponent(movie.title)}`; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {movie.isComingSoon ? (
              <button className="w-full bg-yellow-500/20 text-yellow-500 text-xs font-bold py-2 rounded-lg cursor-default border border-yellow-500/30">Coming Soon</button>
            ) : movie.isHouseFull ? (
              <button className="w-full bg-zinc-850 text-cinema-muted text-xs font-bold py-2 rounded-lg cursor-not-allowed border border-cinema-border/50">House Full</button>
            ) : (
              <button className="w-full bg-cinema-red text-white text-xs font-bold py-2 rounded-lg">Book Tickets</button>
            )}
          </div>
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            {movie.isComingSoon && (
              <span className="bg-yellow-500 text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-[0_0_10px_rgba(234,179,8,0.7)]">
                Soon
              </span>
            )}
            {movie.isHouseFull && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.7)]">
                House Full
              </span>
            )}
            {movie.isHot && (
              <span className="bg-cinema-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-2.5 h-2.5" /> Hot
              </span>
            )}
          </div>
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {movie.format?.slice(0, 2).map(f => (
              <span key={f} className="bg-black/70 text-[9px] font-bold px-1.5 py-0.5 rounded text-cinema-off-white">{f}</span>
            ))}
          </div>
        </div>
        <div className="mt-2.5">
          <h3 className="text-cinema-off-white font-semibold text-sm leading-tight truncate group-hover:text-cinema-red transition-colors">{movie.title}</h3>
          <div className="flex items-center gap-2 mt-1">
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

function MovieCardList({ movie }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      className="card p-4 flex gap-4 hover:border-cinema-red/30 transition-all">
      <Link to={`/movies/${movie._id}`} className="flex gap-4 w-full">
        <img src={movie.posterUrl} alt={movie.title}
          className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
          onError={e => { e.target.src = `https://placehold.co/64x96/1a1a1a/E50914?text=${encodeURIComponent(movie.title[0])}`; }} />
        <div className="flex-1 min-w-0">
          <h3 className="text-cinema-off-white font-bold text-base">{movie.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-3.5 h-3.5 text-cinema-red fill-cinema-red" />
            <span className="text-cinema-off-white text-sm font-semibold">{movie.averageRating}/10</span>
            <span className="text-cinema-muted text-xs">({movie.votes || `${(movie.totalReviews / 1000).toFixed(1)}K`} votes)</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genre?.map(g => <span key={g} className="text-cinema-muted text-xs border border-cinema-border/60 px-2 py-0.5 rounded">{g}</span>)}
            <span className="text-cinema-muted text-xs border border-cinema-border/60 px-2 py-0.5 rounded">{movie.certificate}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {movie.format?.map(f => <span key={f} className="text-cinema-red text-xs border border-cinema-red/30 px-2 py-0.5 rounded">{f}</span>)}
          </div>
          <div className="mt-2 text-cinema-muted text-xs">
            {movie.language?.join(' • ')}
          </div>
        </div>
        {movie.isComingSoon ? (
          <button className="flex-shrink-0 self-center bg-yellow-500/10 text-yellow-500 text-xs font-bold px-4 py-2 rounded-lg border border-yellow-500/20 cursor-default">
            Soon
          </button>
        ) : movie.isHouseFull ? (
          <button className="flex-shrink-0 self-center bg-zinc-850 text-cinema-muted text-xs font-bold px-4 py-2 rounded-lg cursor-not-allowed border border-cinema-border/50">
            House Full
          </button>
        ) : (
          <button className="flex-shrink-0 self-center bg-cinema-red hover:bg-cinema-red-dark text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
            Book
          </button>
        )}
      </Link>
    </motion.div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active ? 'bg-cinema-red border-cinema-red text-white' : 'border-cinema-border text-cinema-muted hover:border-cinema-red/50 hover:text-cinema-off-white'
      }`}>{label}</button>
  );
}

export default function MovieGrid({ searchQuery = '' }) {
  const [activeLang, setActiveLang] = useState('All');
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeFmt, setActiveFmt] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  const { data: moviesRes, isLoading } = useQuery({
    queryKey: ['movies', page, activeLang, activeGenre, activeFmt, searchQuery],
    queryFn: () => movieService.getAll({
      page,
      limit: PAGE_SIZE,
      search: searchQuery || undefined,
      language: activeLang === 'All' ? undefined : activeLang,
      genre: activeGenre === 'All' ? undefined : activeGenre,
      format: activeFmt === 'All' ? undefined : activeFmt,
    }),
  });

  const paged = useMemo(() => moviesRes?.data?.data || [], [moviesRes]);
  const totalPages = useMemo(() => moviesRes?.data?.pages || 1, [moviesRes]);
  const totalCount = useMemo(() => moviesRes?.data?.total || 0, [moviesRes]);

  return (
    <div>
      {/* Filters */}
      <div className="bg-cinema-dark border border-cinema-border rounded-xl p-4 mb-6 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-cinema-muted flex-shrink-0" />
          <span className="text-cinema-muted text-xs font-semibold uppercase tracking-wider">Language</span>
          <div className="flex gap-2 flex-wrap">
            {LANGUAGES.map(l => <FilterPill key={l} label={l} active={activeLang === l} onClick={() => { setActiveLang(l); setPage(1); }} />)}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-cinema-muted text-xs font-semibold uppercase tracking-wider w-16">Genre</span>
          <div className="flex gap-2 flex-wrap">
            {GENRES.map(g => <FilterPill key={g} label={g} active={activeGenre === g} onClick={() => { setActiveGenre(g); setPage(1); }} />)}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-cinema-muted text-xs font-semibold uppercase tracking-wider w-16">Format</span>
          <div className="flex gap-2 flex-wrap">
            {FORMATS.map(f => <FilterPill key={f} label={f} active={activeFmt === f} onClick={() => { setActiveFmt(f); setPage(1); }} />)}
          </div>
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-cinema-muted text-sm">
          Showing <span className="text-cinema-off-white font-semibold">{totalCount}</span> movies
          {searchQuery && <> for <span className="text-cinema-red">"{searchQuery}"</span></>}
        </p>
        <div className="flex gap-1.5 p-1 bg-cinema-dark rounded-lg border border-cinema-border">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-cinema-red text-white' : 'text-cinema-muted hover:text-cinema-off-white'}`}><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-cinema-red text-white' : 'text-cinema-muted hover:text-cinema-off-white'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Grid / List */}
      {isLoading ? (
        <div className="text-center py-20 text-cinema-muted">
          <Loader2 className="w-8 h-8 text-cinema-red animate-spin mx-auto mb-3" />
          <p>Loading blockbusters...</p>
        </div>
      ) : paged.length === 0 ? (
        <div className="text-center py-20 text-cinema-muted">
          <p className="text-lg mb-2">No movies found</p>
          <button onClick={() => { setActiveLang('All'); setActiveGenre('All'); setActiveFmt('All'); }} className="text-cinema-red text-sm underline">Clear filters</button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {paged.map((m, i) => <MovieCardGrid key={m._id} movie={m} index={i} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {paged.map(m => <MovieCardList key={m._id} movie={m} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg border border-cinema-border text-cinema-muted hover:text-cinema-off-white hover:border-cinema-red disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${n === page ? 'bg-cinema-red text-white' : 'border border-cinema-border text-cinema-muted hover:text-cinema-off-white'}`}>
              {n}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg border border-cinema-border text-cinema-muted hover:text-cinema-off-white hover:border-cinema-red disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
