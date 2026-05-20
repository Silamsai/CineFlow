import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home, Ticket, Calendar, Clock, MapPin, Film } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const booking = JSON.parse(sessionStorage.getItem('cineflow_confirmation') || 'null');

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center pt-20">
        <div>
          <p className="text-cinema-off-white text-xl mb-4">No booking found.</p>
          <button onClick={() => navigate('/movies')} className="btn-primary px-6 py-3">Browse Movies</button>
        </div>
      </div>
    );
  }

  const { ref, movie, show, selectedSeats, total, user, bookedAt } = booking;
  const bookingTime = new Date(bookedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <main className="min-h-screen bg-cinema-black pt-14 pb-16">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success animation */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-black text-cinema-off-white">Booking Confirmed!</h1>
          <p className="text-cinema-muted mt-2">Your tickets are ready. Enjoy the show!</p>
        </motion.div>

        {/* Ticket card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-cinema-dark border border-cinema-border rounded-3xl overflow-hidden shadow-card">
          
          {/* Movie header */}
          <div className="bg-cinema-red p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Film className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">Booking Confirmed</p>
              <h2 className="font-display text-xl font-bold text-white">{movie.title}</h2>
              <p className="text-white/80 text-sm">{show.format} • {show.language}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cinema-red mt-0.5" />
                <div>
                  <p className="text-cinema-muted text-xs">Theater</p>
                  <p className="text-cinema-off-white text-sm font-semibold">{show.theaterName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-cinema-red mt-0.5" />
                <div>
                  <p className="text-cinema-muted text-xs">Show Time</p>
                  <p className="text-cinema-off-white text-sm font-semibold">{show.showTime} • {show.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Ticket className="w-4 h-4 text-cinema-red mt-0.5" />
                <div>
                  <p className="text-cinema-muted text-xs">Seats</p>
                  <p className="text-cinema-off-white text-sm font-semibold">{selectedSeats.join(', ')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-cinema-red mt-0.5" />
                <div>
                  <p className="text-cinema-muted text-xs">Booked At</p>
                  <p className="text-cinema-off-white text-sm font-semibold">{bookingTime}</p>
                </div>
              </div>
            </div>

            {/* Dashed divider */}
            <div className="border-t-2 border-dashed border-cinema-border my-2" />

            {/* QR Code */}
            <div className="flex flex-col items-center py-4">
              <div className="p-4 bg-white rounded-2xl mb-3">
                <QRCodeSVG value={ref} size={140} />
              </div>
              <p className="text-cinema-muted text-xs">Booking Reference</p>
              <p className="text-cinema-red font-mono font-bold text-lg mt-1">{ref}</p>
              <p className="text-cinema-muted text-xs mt-1">Show this QR at the theater entrance</p>
            </div>

            {/* Dashed divider */}
            <div className="border-t-2 border-dashed border-cinema-border" />

            {/* Total */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-cinema-muted text-xs">Amount Paid</p>
                <p className="text-cinema-off-white font-bold text-xl">₹{total.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-cinema-muted text-xs">Email</p>
                <p className="text-cinema-off-white text-sm">{user?.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex gap-3 mt-6">
          <Link to="/my-bookings" className="flex-1 flex items-center justify-center gap-2 border border-cinema-border text-cinema-muted hover:text-cinema-off-white hover:border-cinema-red py-3 rounded-xl transition-all text-sm font-semibold">
            <Ticket className="w-4 h-4" /> My Bookings
          </Link>
          <Link to="/" className="flex-1 flex items-center justify-center gap-2 bg-cinema-red hover:bg-cinema-red-dark text-white py-3 rounded-xl transition-all text-sm font-bold">
            <Home className="w-4 h-4" /> Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
