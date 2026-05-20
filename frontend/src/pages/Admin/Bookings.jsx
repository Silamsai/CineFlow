import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Search, CheckCircle, Users, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../../services';
import { formatDate } from '../../utils/formatters';

export default function AdminBookings() {
  const [search, setSearch] = useState('');

  const { data: bookingsRes, isLoading } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: () => bookingService.getAllAdmin({ limit: 100 }).then(res => res.data),
  });

  const bookings = useMemo(() => bookingsRes?.data || [], [bookingsRes]);

  const filtered = useMemo(() => {
    return bookings.filter(b =>
      b.bookingRef?.toLowerCase().includes(search.toLowerCase()) ||
      b.movieId?.title?.toLowerCase().includes(search.toLowerCase()) ||
      (b.userId?.firstName + ' ' + b.userId?.lastName).toLowerCase().includes(search.toLowerCase()) ||
      b.userId?.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [bookings, search]);

  const totalRevenue = useMemo(() => {
    return bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  }, [bookings]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-cinema-muted">
        <Loader2 className="w-10 h-10 text-cinema-red animate-spin mb-4" />
        <p className="text-sm font-semibold uppercase tracking-wider">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-cinema-off-white flex items-center gap-2"><Ticket className="w-6 h-6 text-cinema-red" /> Booking Management</h1>
        <p className="text-cinema-muted text-sm mt-1">{bookings.length} total bookings • ₹{totalRevenue.toLocaleString('en-IN')} revenue</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: Ticket },
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: CheckCircle },
          { label: 'Unique Users', value: new Set(bookings.map(b => b.userId?.email).filter(Boolean)).size, icon: Users },
        ].map(s => (
          <div key={s.label} className="bg-cinema-dark border border-cinema-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="w-4 h-4 text-cinema-red" />
              <span className="text-cinema-muted text-xs">{s.label}</span>
            </div>
            <p className="text-cinema-off-white font-bold text-xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by booking ref, movie, user..."
          className="w-full max-w-sm bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cinema-red" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Ticket className="w-12 h-12 text-cinema-border mx-auto mb-3" />
          <p className="text-cinema-muted">No bookings found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cinema-dark">
                <tr className="text-cinema-muted text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Ref</th>
                  <th className="px-4 py-3 text-left">Movie</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Seats</th>
                  <th className="px-4 py-3 text-left">Show Date</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border">
                {filtered.map((b, i) => (
                  <motion.tr key={b._id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-cinema-card/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-cinema-red text-xs">{b.bookingRef}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {b.movieId?.posterUrl && (
                          <img src={b.movieId.posterUrl} alt="" className="w-7 h-10 object-cover rounded"
                            onError={e => { e.target.style.display='none'; }} />
                        )}
                        <span className="text-cinema-off-white font-medium text-xs">{b.movieId?.title || 'Unknown Movie'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-cinema-off-white text-xs font-medium">{b.userId?.firstName} {b.userId?.lastName}</p>
                      <p className="text-cinema-muted text-[10px]">{b.userId?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-cinema-muted text-xs">
                      {b.seatsBooked?.map(s => s.seatNumber).join(', ')}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-cinema-off-white text-xs">{b.showDate ? formatDate(b.showDate) : '—'}</p>
                      <p className="text-cinema-muted text-[10px]">{b.showId?.language} • {b.showId?.format}</p>
                    </td>
                    <td className="px-4 py-3 text-cinema-red font-bold">₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 w-fit ${
                        b.bookingStatus === 'confirmed' ? 'bg-green-400/10 text-green-400' :
                        b.bookingStatus === 'cancelled' ? 'bg-red-400/10 text-red-400' : 'bg-yellow-400/10 text-yellow-400'
                      }`}>
                        <CheckCircle className="w-3 h-3" /> {b.bookingStatus}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
