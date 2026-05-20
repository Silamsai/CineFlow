import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Info, Monitor } from 'lucide-react';
import { showService } from '../../services';
import { useBookingStore } from '../../store';
import { formatCurrency } from '../../utils/formatters';

const SEAT_LEGEND = [
  { label: 'Available', className: 'seat-available' },
  { label: 'Selected', className: 'seat-selected' },
  { label: 'Booked', className: 'seat-booked' },
  { label: 'Premium', className: 'seat-premium' },
  { label: 'VIP', className: 'seat-vip' },
];

function SeatLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-4 my-6">
      {SEAT_LEGEND.map(({ label, className }) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`seat w-6 h-5 ${className} pointer-events-none`} />
          <span className="text-cinema-muted text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}

function SeatTooltip({ seat, pricing }) {
  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="glass px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-lg">
        <p className="text-cinema-off-white font-semibold">{seat.seatNumber}</p>
        <p className="text-cinema-gold">{formatCurrency(pricing?.[seat.category] || 0)}</p>
      </div>
      <div className="w-2 h-2 bg-white/10 rotate-45 mx-auto -mt-1" />
    </div>
  );
}

export default function SeatMap({ showId }) {
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const { selectedSeats, toggleSeat, selectedShow } = useBookingStore();

  const { data: seatData, isLoading } = useQuery({
    queryKey: ['seats', showId],
    queryFn: () => showService.getSeats(showId).then(r => r.data.data),
    enabled: !!showId,
    refetchInterval: 30000, // refresh every 30s for real-time
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-10 h-10 border-4 border-cinema-gold/30 border-t-cinema-gold rounded-full animate-spin" />
        <p className="text-cinema-muted mt-3">Loading seat map...</p>
      </div>
    );
  }

  if (!seatData) return null;

  const { seatStatus, pricing } = seatData;
  const rows = seatStatus || [];
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const getSeatCategory = (rowIdx, colIdx) => {
    const totalRows = rows.length;
    if (rowIdx < totalRows * 0.2) return 'vip';
    if (rowIdx < totalRows * 0.5) return 'premium';
    return 'standard';
  };

  const getSeatClassName = (status, category, isSelected) => {
    if (isSelected) return 'seat-selected';
    if (status === 'booked' || status === 'held') return 'seat-booked';
    if (category === 'vip') return 'seat-vip';
    if (category === 'premium') return 'seat-premium';
    return 'seat-available';
  };

  return (
    <div className="w-full">
      {/* Screen */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8"
      >
        <div className="mx-auto w-4/5 h-3 bg-gradient-to-b from-cinema-gold/60 to-transparent rounded-t-[50%]" />
        <div className="flex items-center justify-center gap-2 mt-2">
          <Monitor className="w-4 h-4 text-cinema-gold" />
          <span className="text-cinema-gold text-xs font-semibold tracking-widest uppercase">All Eyes This Way</span>
        </div>
      </motion.div>

      {/* Seat grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-max mx-auto px-4">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center gap-2 mb-1.5">
              {/* Row label */}
              <span className="text-cinema-muted text-xs w-5 text-center font-mono">{rowLabels[rowIdx]}</span>

              {/* Gap for aisle */}
              <div className="flex gap-1">
                {row.map((status, colIdx) => {
                  const seatNumber = `${rowLabels[rowIdx]}${colIdx + 1}`;
                  const category = getSeatCategory(rowIdx, colIdx);
                  const isSelected = selectedSeats.some(s => s.seatNumber === seatNumber);
                  const isBooked = status === 'booked' || status === 'held';
                  const className = getSeatClassName(status, category, isSelected);

                  // Aisle gap in middle
                  const mid = Math.floor(row.length / 2);

                  return (
                    <div key={colIdx} className="relative">
                      {colIdx === mid && <div className="w-4 inline-block" />}
                      <motion.button
                        className={`seat ${className}`}
                        whileHover={!isBooked ? { scale: 1.15 } : {}}
                        whileTap={!isBooked ? { scale: 0.95 } : {}}
                        onClick={() => {
                          if (!isBooked) {
                            toggleSeat({ seatNumber, row: rowLabels[rowIdx], col: colIdx + 1, price: pricing?.[category] || 150, category });
                          }
                        }}
                        onMouseEnter={() => setHoveredSeat({ seatNumber, category })}
                        onMouseLeave={() => setHoveredSeat(null)}
                        disabled={isBooked}
                        aria-label={`Seat ${seatNumber} - ${status}`}
                      >
                        {colIdx + 1}
                        {/* Tooltip */}
                        {hoveredSeat?.seatNumber === seatNumber && !isBooked && (
                          <SeatTooltip seat={{ seatNumber, category }} pricing={pricing} />
                        )}
                      </motion.button>
                    </div>
                  );
                })}
              </div>

              <span className="text-cinema-muted text-xs w-5 text-center font-mono">{rowLabels[rowIdx]}</span>
            </div>
          ))}
        </div>
      </div>

      <SeatLegend />

      {/* Selected summary */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 glass rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-cinema-off-white font-semibold">{selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected</p>
              <p className="text-cinema-muted text-sm">{selectedSeats.map(s => s.seatNumber).join(', ')}</p>
            </div>
            <div className="text-right">
              <p className="text-cinema-gold font-bold text-xl">
                {formatCurrency(selectedSeats.reduce((s, seat) => s + seat.price, 0))}
              </p>
              <p className="text-cinema-muted text-xs">+ taxes & fees</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
