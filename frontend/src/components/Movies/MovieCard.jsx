import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Play, Ticket, Heart } from 'lucide-react';
import { formatDuration, formatRating } from '../../utils/formatters';

const GENRE_COLORS = {
  Action: 'bg-red-500/20 text-red-400 border-red-500/30',
  Comedy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Drama: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Horror: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Sci-Fi': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Romance: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Thriller: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function MovieCard({ movie, index = 0, view = 'grid' }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const genreColor = movie.genre?.[0]
    ? (GENRE_COLORS[movie.genre[0]] || GENRE_COLORS.default)
    : GENRE_COLORS.default;

  const fallbackPoster = `https://placehold.co/300x450/1a1a1a/D4AF37?text=${encodeURIComponent(movie.title || 'Movie')}`;

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="card flex gap-4 p-4 hover:border-cinema-gold/30"
      >
        <Link to={`/movies/${movie._id}`} className="flex-shrink-0">
          <img
            src={imgError ? fallbackPoster : (movie.posterUrl || fallbackPoster)}
            alt={movie.title}
            onError={() => setImgError(true)}
            className="w-20 h-28 object-cover rounded-lg"
          />
        </Link>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <Link to={`/movies/${movie._id}`}>
              <h3 className="font-display font-semibold text-cinema-off-white hover:text-cinema-gold transition-colors truncate">{movie.title}</h3>
            </Link>
            <div className="flex items-center gap-3 mt-1 text-sm text-cinema-muted">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-cinema-gold fill-cinema-gold" />{formatRating(movie.averageRating)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDuration(movie.duration)}</span>
              <span>{movie.certificate}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {movie.genre?.slice(0, 3).map(g => (
                <span key={g} className={`text-xs px-2 py-0.5 rounded-full border ${genreColor}`}>{g}</span>
              ))}
            </div>
          </div>
          <Link to={`/movies/${movie._id}`} className="btn-primary text-xs px-4 py-2 self-start mt-2">Book Now</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="card group cursor-pointer"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <motion.img
          src={imgError ? fallbackPoster : (movie.posterUrl || fallbackPoster)}
          alt={movie.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-transparent to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 glass px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-cinema-gold fill-cinema-gold" />
          <span className="text-cinema-off-white text-xs font-semibold">{formatRating(movie.averageRating)}</span>
        </div>

        {/* Certificate */}
        <div className="absolute top-3 left-3 bg-cinema-dark/80 text-cinema-muted text-xs px-2 py-1 rounded border border-cinema-border">
          {movie.certificate}
        </div>

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-cinema-black/70 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          {movie.trailerUrl && (
            <a
              href={movie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-cinema-red transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="w-5 h-5 text-white fill-white" />
            </a>
          )}
          <Link
            to={`/movies/${movie._id}`}
            className="w-11 h-11 rounded-full bg-cinema-gold/20 backdrop-blur flex items-center justify-center hover:bg-cinema-gold transition-colors group/btn"
          >
            <Ticket className="w-5 h-5 text-cinema-gold group-hover/btn:text-cinema-black" />
          </Link>
        </motion.div>

        {/* Trending badge */}
        {movie.isTrending && (
          <div className="absolute bottom-3 left-3 bg-cinema-red text-white text-xs px-2 py-0.5 rounded font-semibold tracking-wide">
            🔥 TRENDING
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <Link to={`/movies/${movie._id}`}>
          <h3 className="font-display font-semibold text-cinema-off-white group-hover:text-cinema-gold transition-colors duration-200 truncate text-base">
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-cinema-muted">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(movie.duration)}</span>
          <span className="flex flex-wrap gap-1">
            {movie.genre?.slice(0, 2).map(g => (
              <span key={g} className={`px-1.5 py-0.5 rounded border ${genreColor}`}>{g}</span>
            ))}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {movie.format?.slice(0, 3).map(f => (
            <span key={f} className="text-xs bg-cinema-dark text-cinema-muted px-2 py-0.5 rounded border border-cinema-border">{f}</span>
          ))}
        </div>
        <Link to={`/movies/${movie._id}`} className="btn-primary w-full mt-4 text-sm py-2.5 flex items-center justify-center gap-2">
          <Ticket className="w-4 h-4" />
          Book Now
        </Link>
      </div>
    </motion.div>
  );
}
