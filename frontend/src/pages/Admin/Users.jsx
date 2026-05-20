import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Ticket, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services';

export default function AdminUsers() {
  const [search, setSearch] = useState('');

  const { data: usersRes, isLoading } = useQuery({
    queryKey: ['adminUsers', search],
    queryFn: () => userService.getAllAdmin({ search: search || undefined, limit: 100 }).then(res => res.data),
  });

  const users = useMemo(() => usersRes?.data || [], [usersRes]);
  const totalCount = useMemo(() => usersRes?.total || 0, [usersRes]);

  const activeBookers = useMemo(() => users.filter(u => u.bookingCount > 0).length, [users]);
  const totalSpent = useMemo(() => users.reduce((s, u) => s + (u.totalSpent || 0), 0), [users]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-cinema-muted">
        <Loader2 className="w-10 h-10 text-cinema-red animate-spin mb-4" />
        <p className="text-sm font-semibold uppercase tracking-wider">Loading user database...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-cinema-off-white flex items-center gap-2"><Users className="w-6 h-6 text-cinema-red" /> User Management</h1>
        <p className="text-cinema-muted text-sm mt-1">{totalCount} registered users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Users', value: totalCount },
          { label: 'Active Bookers', value: activeBookers },
          { label: 'Total Revenue', value: `₹${totalSpent.toLocaleString('en-IN')}` },
        ].map(s => (
          <div key={s.label} className="bg-cinema-dark border border-cinema-border rounded-xl p-4">
            <p className="text-cinema-muted text-xs mb-1">{s.label}</p>
            <p className="text-cinema-off-white font-bold text-xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..."
          className="w-full max-w-sm bg-cinema-black border border-cinema-border text-cinema-off-white placeholder-cinema-muted rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cinema-red" />
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-cinema-border mx-auto mb-3" />
          <p className="text-cinema-muted">No users found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cinema-dark">
              <tr className="text-cinema-muted text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Bookings</th>
                <th className="px-4 py-3 text-left">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cinema-border">
              {users.map((u, i) => (
                <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-cinema-card/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cinema-red/20 flex items-center justify-center text-cinema-red font-bold text-sm flex-shrink-0">
                        {u.firstName?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-cinema-off-white font-medium">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cinema-muted">{u.email}</td>
                  <td className="px-4 py-3 text-cinema-muted text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-cinema-off-white">
                      <Ticket className="w-3.5 h-3.5 text-cinema-red" /> {u.bookingCount || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-cinema-red font-bold">₹{(u.totalSpent || 0).toLocaleString('en-IN')}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
