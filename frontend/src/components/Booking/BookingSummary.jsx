import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Film, Ticket, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate, formatTime, calcBookingTotals } from '../../utils/formatters';
import { useBookingStore } from '../../store';

export default function BookingSummary({ onProceed, isLoading }) {
  const { selectedMovie, selectedShow, selectedTheater, selectedSeats } = useBookingStore();
  const { subtotal, convenience, taxes, total } = calcBookingTotals(selectedSeats);

  if (!selectedMovie || !selectedShow) return null;

  const rows = [
    { label: 'Subtotal', value: formatCurrency(subtotal) },
    { label: 'Convenience Fee (5%)', value: formatCurrency(convenience) },
    { label: 'GST (18%)', value: formatCurrency(taxes) },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-5 sticky top-24">
      <h3 className="font-display text-lg font-bold text-cinema-off-white mb-5 flex items-center gap-2">
        <Ticket className="w-5 h-5 text-cinema-gold" />
        Booking Summary
      </h3>

      {/* Movie */}
      <div className="flex gap-3 mb-4 pb-4 border-b border-cinema-border">
        <img
          src={selectedMovie.posterUrl || `https://placehold.co/60x90/1a1a1a/D4AF37?text=Movie`}
          alt={selectedMovie.title}
          className="w-14 h-20 object-cover rounded-lg flex-shrink-0"
        />
        <div>
          <h4 className="text-cinema-off-white font-semibold text-sm">{selectedMovie.title}</h4>
          <div className="space-y-1 mt-2">
            <p className="text-cinema-muted text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(selectedShow.showTime)}</p>
            <p className="text-cinema-muted text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(selectedShow.showTime)}</p>
            <p className="text-cinema-muted text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedTheater?.name}, {selectedTheater?.city}</p>
            <p className="text-cinema-muted text-xs flex items-center gap-1"><Film className="w-3 h-3" />{selectedShow.format} • {selectedShow.language}</p>
          </div>
        </div>
      </div>

      {/* Seats */}
      {selectedSeats.length > 0 && (
        <div className="mb-4 pb-4 border-b border-cinema-border">
          <p className="text-cinema-gold text-xs font-semibold uppercase tracking-wider mb-2">Selected Seats</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedSeats.map(s => (
              <span key={s.seatNumber} className="text-xs bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/30 px-2 py-0.5 rounded-full font-mono">
                {s.seatNumber} <span className="opacity-60">({s.category})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Price breakdown */}
      <div className="space-y-2 mb-4 pb-4 border-b border-cinema-border">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-cinema-muted">{label}</span>
            <span className="text-cinema-off-white">{value}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-cinema-off-white font-bold">Total Amount</span>
        <span className="text-cinema-gold font-bold text-xl">{formatCurrency(total)}</span>
      </div>

      <button
        onClick={onProceed}
        disabled={selectedSeats.length === 0 || isLoading}
        className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-cinema-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <>Proceed to Payment <ChevronRight className="w-5 h-5" /></>
        )}
      </button>

      <p className="text-cinema-muted text-xs text-center mt-3 flex items-center justify-center gap-1">
        🔒 Seats held for 5 minutes after selection
      </p>
    </motion.div>
  );
}
