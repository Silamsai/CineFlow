import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Film, Building2, Ticket, Users, CreditCard, X, ChevronRight } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import Logo from '../components/Common/Logo';

const ADMIN_LINKS = [
  { label: 'Dashboard',  path: '/admin',          icon: LayoutDashboard },
  { label: 'Movies',     path: '/admin/movies',   icon: Film },
  { label: 'Theaters',   path: '/admin/theaters', icon: Building2 },
  { label: 'Bookings',   path: '/admin/bookings', icon: Ticket },
  { label: 'Users',      path: '/admin/users',    icon: Users },
  { label: 'Payments',   path: '/admin/payments', icon: CreditCard },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('cineflow_admin');
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-cinema-black">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        className="fixed left-0 top-0 h-full bg-cinema-dark border-r border-cinema-border z-40 flex flex-col overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center justify-center px-4 py-5 border-b border-cinema-border h-16 flex-shrink-0">
          <Link to="/" className="flex items-center justify-center w-full">
            <Logo height={collapsed ? 24 : 32} className="transition-all duration-300 object-contain" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {ADMIN_LINKS.map(({ label, path, icon: Icon }) => {
            const active = pathname === path || (path !== '/admin' && pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  active ? 'bg-cinema-gold/15 text-cinema-gold' : 'text-cinema-muted hover:text-cinema-off-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-cinema-gold' : ''}`} />
                {!collapsed && <span className="text-sm font-medium">{label}</span>}
                {!collapsed && active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User + collapse */}
        <div className="border-t border-cinema-border p-3 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-7 h-7 rounded-full bg-cinema-gold/20 flex items-center justify-center text-cinema-gold text-xs font-bold">
                {user?.firstName?.[0] || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-cinema-off-white text-xs font-semibold truncate">{user?.firstName}</p>
                <p className="text-cinema-muted text-xs">Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 text-cinema-muted hover:text-cinema-red hover:bg-cinema-red/10 rounded-lg transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-full flex items-center gap-2 px-3 py-2 text-cinema-muted hover:text-cinema-red hover:bg-cinema-red/10 rounded-lg transition-all text-sm"
          >
            <X className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main
        className="flex-1 transition-all duration-300 p-8"
        style={{ marginLeft: collapsed ? 72 : 240 }}
      >
        <Outlet />
      </main>
    </div>
  );
}
