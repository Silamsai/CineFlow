import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ticket, Star, Clock, MapPin } from 'lucide-react';

export default function TheaterDoors({ movie, show, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState('closed');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const openTimer = setTimeout(() => {
      setIsOpen(true);
      setStage('opening');
    }, 300);

    const bookTimer = setTimeout(() => {
      setStage('revealed');
    }, 2500);

    const redirectTimer = setTimeout(() => {
      document.body.style.overflow = '';
      if (onClose) onClose();
      if (show?._id) {
        navigate(`/booking/${show._id}`);
      }
    }, 4000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(bookTimer);
      clearTimeout(redirectTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!movie) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        style={{
          perspective: '1200px',
        }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-cinema-black to-black" />

        {/* Stage lights */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-cinema-red/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-cinema-red/20 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-40 bg-yellow-500/10 rounded-full blur-3xl" />

        {/* Spotlight beams */}
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-cinema-red/30 via-transparent to-transparent" style={{ transform: 'skewX(-10deg)' }} />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-cinema-red/30 via-transparent to-transparent" style={{ transform: 'skewX(10deg)' }} />

        {/* Curtain top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-cinema-red to-cinema-red-dark"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-black/50" />
          {/* Curtain folds */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-8 bg-black/20"
              style={{ left: `${(i / 12) * 100}%` }}
            />
          ))}
        </motion.div>

        {/* Left Door */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-cinema-dark via-cinema-card to-cinema-dark border-r border-cinema-red/30"
          initial={{ rotateY: 0 }}
          animate={isOpen ? { rotateY: -110 } : { rotateY: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left center', backfaceVisibility: 'hidden' }}
        >
          {/* Door panel details */}
          <div className="absolute inset-4 border-2 border-cinema-red/10 rounded-2xl" />
          <div className="absolute inset-8 border border-cinema-red/5 rounded-xl" />
          {/* Door handle */}
          <div className="absolute right-12 top-1/2 w-4 h-12 rounded-full bg-gradient-to-b from-cinema-gold to-cinema-gold-dark shadow-[0_0_10px_rgba(229,9,20,0.3)]" />
          {/* Panel decorations */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-24 h-32 border border-cinema-red/10 rounded-lg" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-24 h-32 border border-cinema-red/10 rounded-lg" />
        </motion.div>

        {/* Right Door */}
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cinema-dark via-cinema-card to-cinema-dark border-l border-cinema-red/30"
          initial={{ rotateY: 0 }}
          animate={isOpen ? { rotateY: 110 } : { rotateY: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'right center', backfaceVisibility: 'hidden' }}
        >
          {/* Door panel details */}
          <div className="absolute inset-4 border-2 border-cinema-red/10 rounded-2xl" />
          <div className="absolute inset-8 border border-cinema-red/5 rounded-xl" />
          {/* Door handle */}
          <div className="absolute left-12 top-1/2 w-4 h-12 rounded-full bg-gradient-to-b from-cinema-gold to-cinema-gold-dark shadow-[0_0_10px_rgba(229,9,20,0.3)]" />
          {/* Panel decorations */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-24 h-32 border border-cinema-red/10 rounded-lg" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-24 h-32 border border-cinema-red/10 rounded-lg" />
        </motion.div>

        {/* Center content - revealed after doors open */}
        <motion.div
          className="relative z-10 text-center px-8"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            stage === 'revealed'
              ? { opacity: 1, scale: 1, y: 0 }
              : stage === 'opening'
              ? { opacity: 0.3, scale: 0.8, y: 20 }
              : { opacity: 0, scale: 0.5, y: 40 }
          }
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Glowing backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-cinema-red/10 via-transparent to-cinema-red/10 blur-3xl -z-10 scale-150" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cinema-red to-cinema-red-dark flex items-center justify-center shadow-[0_0_40px_rgba(229,9,20,0.5)]"
          >
            <Ticket className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="font-display text-5xl md:text-7xl font-black text-white mb-4 text-shadow-lg">
            {movie.title}
          </h2>

          <div className="flex items-center justify-center gap-4 text-cinema-muted mb-6 flex-wrap">
            {movie.genre?.slice(0, 2).map(g => (
              <span key={g} className="px-3 py-1 rounded-full border border-cinema-red/30 bg-cinema-red/10 text-cinema-red text-xs font-medium">{g}</span>
            ))}
            {movie.duration && (
              <span className="flex items-center gap-1.5 text-sm"><Clock className="w-4 h-4" />{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
            )}
            {movie.averageRating && (
              <span className="flex items-center gap-1.5 text-sm"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />{movie.averageRating}/10</span>
            )}
          </div>

          {show?.theaterId?.name && (
            <p className="text-cinema-muted text-sm flex items-center justify-center gap-2 mb-8">
              <MapPin className="w-4 h-4 text-cinema-red" />
              {show.theaterId.name} • {new Date(show.showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white text-sm font-semibold">Redirecting to seat selection...</span>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="mt-6 h-1 bg-white/10 rounded-full max-w-md mx-auto overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.5, delay: 0.5, ease: 'easeInOut' }}
            style={{ transformOrigin: 'left' }}
          >
            <div className="h-full bg-gradient-to-r from-cinema-red to-cinema-red-light rounded-full" />
          </motion.div>
        </motion.div>

        {/* Marquee text */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex gap-8 animate-marquee text-cinema-muted/30 text-xs uppercase tracking-[0.2em] font-semibold">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex-shrink-0">✦ Now Entering the World of Cinema ✦ Book Your Seats ✦ Experience the Magic</span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
