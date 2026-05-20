import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Ticket, DollarSign, Film, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { adminService, paymentService } from '../../services';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PageLoader } from '../../components/Common/LoadingSpinner';

function KPICard({ label, value, icon: Icon, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-cinema-muted text-sm">{label}</p>
        <p className="text-cinema-off-white font-bold text-2xl font-display">{value}</p>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: dashData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboard().then(r => r.data.data),
  });
  const { data: revenueData } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => adminService.getRevenue(30).then(r => r.data.data),
  });
  const { data: movieData } = useQuery({
    queryKey: ['admin-movies'],
    queryFn: () => adminService.getMovieAnalytics().then(r => r.data.data),
  });

  if (isLoading) return <PageLoader />;
  const d = dashData || {};
  const timeline = revenueData || [];
  const topMovies = (movieData || []).slice(0, 5);

  const kpis = [
    { label: 'Total Revenue', value: formatCurrency(d.totalRevenue || 0), icon: DollarSign, color: 'bg-cinema-gold/20 text-cinema-gold', delay: 0 },
    { label: 'Total Bookings', value: (d.totalBookings || 0).toLocaleString(), icon: Ticket, color: 'bg-cinema-red/20 text-cinema-red', delay: 0.1 },
    { label: 'Total Users', value: (d.totalUsers || 0).toLocaleString(), icon: Users, color: 'bg-blue-500/20 text-blue-400', delay: 0.2 },
    { label: 'Top Movie', value: topMovies[0]?.movie?.title?.slice(0, 12) || 'N/A', icon: Film, color: 'bg-purple-500/20 text-purple-400', delay: 0.3 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="section-title text-2xl">Admin Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map(k => <KPICard key={k.label} {...k} />)}
      </div>

      {/* Revenue chart */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-cinema-off-white mb-5 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cinema-gold" /> Revenue (Last 30 Days)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={timeline}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="_id" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }} labelStyle={{ color: '#F5F5F5' }} formatter={v => [formatCurrency(v), 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top movies */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-cinema-off-white mb-5 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-cinema-gold" /> Top Movies by Revenue
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topMovies} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="movie.title" width={100} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }} formatter={v => [formatCurrency(v), 'Revenue']} />
            <Bar dataKey="revenue" fill="#D4AF37" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent bookings */}
      {d.recentBookings?.length > 0 && (
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-cinema-off-white mb-5">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-cinema-muted text-xs uppercase tracking-wider border-b border-cinema-border">
                  <th className="pb-3 text-left">Movie</th>
                  <th className="pb-3 text-left">Theater</th>
                  <th className="pb-3 text-left">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border">
                {d.recentBookings.map(b => (
                  <tr key={b._id} className="hover:bg-cinema-card/50 transition-colors">
                    <td className="py-3 text-cinema-off-white">{b.movieId?.title}</td>
                    <td className="py-3 text-cinema-muted">{b.theaterId?.name}</td>
                    <td className="py-3 text-cinema-muted">{formatDate(b.showDate)}</td>
                    <td className="py-3 text-cinema-gold font-semibold text-right">{formatCurrency(b.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
