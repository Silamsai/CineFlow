import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar, Clock, MapPin, CheckCircle, Film, ChevronDown, ChevronUp, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuthContext } from '../context/AuthContext';

function BookingCard({ booking }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, movie, show, selectedSeats, total, bookedAt } = booking;
  const bookingTime = new Date(bookedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      className="bg-cinema-dark border border-cinema-border rounded-2xl overflow-hidden hover:border-cinema-red/40 transition-all">
      <div className="flex gap-4 p-4">
        {/* Poster */}
        <img src={movie?.posterUrl} alt={movie?.title}
          className="w-16 h-24 object-cover rounded-xl flex-shrink-0"
          onError={e => { e.target.src = `https://placehold.co/64x96/1a1a1a/E50914?text=${movie?.title?.[0] || 'M'}`; }} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-cinema-off-white text-base leading-tight">{movie?.title}</h3>
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 flex-shrink-0">
              <CheckCircle className="w-3 h-3" /> Confirmed
            </span>
          </div>
          <div className="space-y-1 mt-2 text-xs text-cinema-muted">
            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cinema-red" />{show?.theaterName}</p>
            <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-cinema-red" />{show?.showTime} • {show?.format} • {show?.language}</p>
            <p className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5 text-cinema-red" />{selectedSeats?.join(', ')}</p>
            <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-cinema-red" />Booked on {bookingTime}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-cinema-red font-bold">₹{total?.toLocaleString('en-IN')}</span>
            <button onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-cinema-muted hover:text-cinema-off-white text-xs transition-colors">
              <QrCode className="w-3.5 h-3.5" />
              {expanded ? 'Hide Ticket' : 'View Ticket'}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded QR ticket */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t-2 border-dashed border-cinema-border overflow-hidden">
            <div className="flex flex-col items-center py-5 px-4 bg-cinema-black/40">
              <div className="p-3 bg-white rounded-xl mb-2">
                <QRCodeSVG value={ref} size={120} />
              </div>
              <p className="text-cinema-muted text-xs mt-1">Booking Ref</p>
              <p className="text-cinema-red font-mono font-bold text-sm">{ref}</p>
              <p className="text-cinema-muted text-xs mt-1">Show this QR code at the theater entrance</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MyBookings() {
  const { user, isSignedIn } = useAuthContext();
  const navigate = useNavigate();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <Ticket className="w-16 h-16 text-cinema-border mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-cinema-off-white mb-2">Sign In Required</h2>
        <p className="text-cinema-muted mb-6">Please sign in to view your bookings.</p>
        <Link to="/" className="btn-primary px-6 py-3">Go to Home</Link>
      </div>
    );
  }

  // Read bookings from localStorage
  const bookings = JSON.parse(localStorage.getItem(`cineflow_bookings_${user?.id}`) || '[]');

  return (
    <main className="min-h-screen bg-cinema-black pt-14 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-cinema-off-white">My Bookings</h1>
          <p className="text-cinema-muted mt-1">{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</p>
        </motion.div>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-cinema-card border border-cinema-border flex items-center justify-center mx-auto mb-4">
              <Film className="w-10 h-10 text-cinema-border" />
            </div>
            <h3 className="text-cinema-off-white font-bold text-xl mb-2">No Bookings Yet</h3>
            <p className="text-cinema-muted mb-6">Book your first ticket and enjoy the cinema experience!</p>
            <Link to="/movies" className="bg-cinema-red hover:bg-cinema-red-dark text-white font-bold px-8 py-3 rounded-xl transition-all inline-block">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => (
              <BookingCard key={booking.ref || i} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
