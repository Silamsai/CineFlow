import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Info, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { showService } from '../services';

const ROWS = ['A','B','C','D','E','F','G','H','I','J'];
const COLS = 12;

function getSeatTier(row) {
  if (['A','B'].includes(row)) return 'vip';
  if (['C','D','E'].includes(row)) return 'premium';
  return 'standard';
}

const TIER_COLORS = {
  vip: { base: 'bg-purple-900/40 border-purple-500/50 text-purple-300', selected: 'bg-purple-500 border-purple-400 text-white', label: 'VIP' },
  premium: { base: 'bg-blue-900/40 border-blue-500/50 text-blue-300', selected: 'bg-blue-500 border-blue-400 text-white', label: 'Premium' },
  standard: { base: 'bg-cinema-card border-green-500/40 text-green-400', selected: 'bg-green-500 border-green-400 text-white', label: 'Standard' },
};

export default function Booking() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const { data: showRes, isLoading } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => showService.getById(showId),
    enabled: !!showId,
  });

  const foundShow = showRes?.data?.data;
  const foundMovie = foundShow?.movieId;
  const foundTheater = foundShow?.theaterId;

  const getSeatStatus = (seatId) => {
    if (!foundShow?.seatStatus) return 'available';
    const row = seatId[0];
    const colStr = seatId.substring(1);
    const rowIndex = ROWS.indexOf(row);
    const colIndex = parseInt(colStr) - 1;
    if (rowIndex === -1 || colIndex < 0 || !foundShow.seatStatus[rowIndex]) return 'available';
    return foundShow.seatStatus[rowIndex][colIndex] || 'available';
  };

  const toggleSeat = (seatId) => {
    if (getSeatStatus(seatId) !== 'available') return;
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : prev.length >= 10 ? prev : [...prev, seatId]
    );
  };

  const total = useMemo(() => {
    if (!foundShow?.pricing) return 0;
    return selectedSeats.reduce((sum, seatId) => {
      const row = seatId[0];
      const tier = getSeatTier(row);
      return sum + (foundShow.pricing[tier] || 0);
    }, 0);
  }, [selectedSeats, foundShow]);

  const handleProceed = () => {
    if (!selectedSeats.length || !foundShow || !foundMovie) return;
    sessionStorage.setItem('cineflow_booking', JSON.stringify({
      movie: {
        _id: foundMovie._id,
        title: foundMovie.title,
        posterUrl: foundMovie.posterUrl,
        genre: foundMovie.genre,
        duration: foundMovie.duration,
      },
      show: {
        _id: foundShow._id,
        showTime: foundShow.showTime,
        format: foundShow.format,
        language: foundShow.language,
        theaterId: {
          name: foundTheater?.name,
          city: foundTheater?.city,
        },
        pricing: foundShow.pricing,
      },
      selectedSeats,
      total,
    }));
    navigate(`/payment/${foundShow._id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cinema-black pt-28 flex flex-col items-center justify-center text-cinema-muted">
        <Loader2 className="w-10 h-10 text-cinema-red animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider uppercase">Loading Seat Layout...</p>
      </div>
    );
  }

  if (!foundShow || !foundMovie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center pt-20">
        <div>
          <p className="text-cinema-off-white text-xl mb-4">Show not found or session expired.</p>
          <button onClick={() => navigate('/movies')} className="btn-primary px-6 py-3">Browse Movies</button>
        </div>
      </div>
    );
  }

  const formattedTime = new Date(foundShow.showTime).toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main className="min-h-screen bg-cinema-black pt-14 pb-10">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg border border-cinema-border text-cinema-muted hover:text-cinema-off-white hover:border-cinema-red transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-cinema-off-white">{foundMovie.title}</h1>
            <p className="text-cinema-muted text-sm">{foundTheater?.name} • {formattedTime} • {foundShow.format} • {foundShow.language}</p>
          </div>
        </div>

        {/* Screen */}
        <div className="text-center mb-8">
          <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-cinema-red/60 to-transparent rounded-full mb-1" />
          <p className="text-cinema-muted text-xs uppercase tracking-widest">Screen this way</p>
        </div>

        {/* Seat Map */}
        <div className="overflow-x-auto">
          <div className="min-w-[580px] space-y-2 mb-6">
            {ROWS.map(row => {
              const tier = getSeatTier(row);
              return (
                <div key={row} className="flex items-center gap-2">
                  <span className="text-cinema-muted text-xs w-6 text-center font-mono">{row}</span>
                  <div className="flex gap-1.5 flex-1 justify-center">
                    {Array.from({ length: COLS }, (_, i) => {
                      const seatId = `${row}${i + 1}`;
                      const status = getSeatStatus(seatId);
                      const isBooked = status === 'booked' || status === 'held' || status === 'blocked';
                      const isSelected = selectedSeats.includes(seatId);
                      return (
                        <button key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          disabled={isBooked}
                          title={seatId}
                          className={`w-8 h-7 rounded-t-lg text-[10px] font-bold border transition-all duration-150 flex-shrink-0 ${
                            isBooked ? 'bg-cinema-border border-gray-700 text-gray-600 cursor-not-allowed' :
                            isSelected ? TIER_COLORS[tier].selected + ' scale-110' :
                            TIER_COLORS[tier].base + ' hover:scale-110'
                          }`}>
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-cinema-muted text-xs w-6 text-center font-mono">{row}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend + Pricing */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-cinema-dark border border-cinema-border rounded-xl p-4">
            <h3 className="text-cinema-muted text-xs font-semibold uppercase tracking-wider mb-3">Legend</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2"><div className="w-6 h-5 rounded-t-md bg-cinema-card border border-green-500/40" /><span className="text-cinema-muted text-xs">Available</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-5 rounded-t-md bg-green-500" /><span className="text-cinema-muted text-xs">Selected</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-5 rounded-t-md bg-cinema-border" /><span className="text-cinema-muted text-xs">Booked / Held</span></div>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="flex items-center gap-2"><div className="w-6 h-5 rounded-t-md bg-purple-900/40 border border-purple-500/50" /><span className="text-cinema-muted text-xs">VIP (A-B)</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-5 rounded-t-md bg-blue-900/40 border border-blue-500/50" /><span className="text-cinema-muted text-xs">Premium (C-E)</span></div>
              <div className="flex items-center gap-2"><div className="w-6 h-5 rounded-t-md bg-cinema-card border border-green-500/40" /><span className="text-cinema-muted text-xs">Standard (F-J)</span></div>
            </div>
          </div>
          <div className="bg-cinema-dark border border-cinema-border rounded-xl p-4">
            <h3 className="text-cinema-muted text-xs font-semibold uppercase tracking-wider mb-3">Pricing</h3>
            <div className="space-y-2">
              {Object.entries(foundShow.pricing).map(([tier, price]) => (
                <div key={tier} className="flex justify-between text-sm">
                  <span className="text-cinema-muted capitalize">{tier} (Rows {tier === 'vip' ? 'A-B' : tier === 'premium' ? 'C-E' : 'F-J'})</span>
                  <span className="text-cinema-off-white font-bold">₹{price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking summary sticky bar */}
        <div className="sticky bottom-4 bg-cinema-dark border border-cinema-border rounded-2xl p-4 flex items-center justify-between shadow-card">
          <div>
            {selectedSeats.length > 0 ? (
              <>
                <p className="text-cinema-off-white font-semibold">{selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected</p>
                <p className="text-cinema-muted text-sm">{selectedSeats.join(', ')}</p>
              </>
            ) : (
              <p className="text-cinema-muted text-sm flex items-center gap-1"><Info className="w-4 h-4" /> Select up to 10 seats</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {selectedSeats.length > 0 && (
              <div className="text-right">
                <p className="text-cinema-muted text-xs">Total</p>
                <p className="text-cinema-red font-bold text-xl">₹{total}</p>
              </div>
            )}
            <button onClick={handleProceed} disabled={!selectedSeats.length}
              className="bg-cinema-red hover:bg-cinema-red-dark text-white font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
