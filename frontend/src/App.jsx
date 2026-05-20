import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import { PageLoader } from './components/Common/LoadingSpinner';
import { MOCK_MOVIES } from './data/mockMovies';
import { useUIStore } from './store';

import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminMoviesPage from './pages/Admin/Movies';
import AdminTheatersPage from './pages/Admin/Theaters';
import AdminBookingsPage from './pages/Admin/Bookings';
import AdminUsersPage from './pages/Admin/Users';
import AdminLayout from './layouts/AdminLayout';
import { About, Careers, Press, Blog, Help, Contact, Refunds, Privacy } from './pages/StaticPages';

// ── Admin auth via localStorage & Context ───────────────────────────────────
function AdminRoute({ children }) {
  const { user, isLoaded, isSignedIn } = useAuthContext();
  const isAdminLocal = localStorage.getItem('cineflow_admin') === 'true';
  
  if (!isLoaded) return <PageLoader />;
  if (!isAdminLocal || !isSignedIn || !user?.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

// ── User route ─────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuthContext();
  if (!isLoaded) return <PageLoader />;
  if (!isSignedIn) {
    // Redirect to home — AuthModal will open when they try to book
    return <Navigate to="/" replace />;
  }
  return children;
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-cinema-black">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-8xl font-black text-cinema-red mb-4">404</h1>
      <p className="text-cinema-off-white text-2xl mb-2">Scene Not Found</p>
      <p className="text-cinema-muted mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary px-8 py-3">Back to Home</a>
    </div>
  );
}

export default function App() {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return (
    <Routes>
      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="movies"   element={<AdminMoviesPage />} />
        <Route path="theaters" element={<AdminTheatersPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="users"    element={<AdminUsersPage />} />
        <Route path="payments" element={<AdminBookingsPage />} />
      </Route>

      {/* Public */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/movies" element={<PublicLayout><Movies /></PublicLayout>} />
      <Route path="/movies/:id" element={<PublicLayout><MovieDetail /></PublicLayout>} />
      <Route path="/booking/:showId" element={<PublicLayout><ProtectedRoute><Booking /></ProtectedRoute></PublicLayout>} />
      <Route path="/payment/:bookingId" element={<PublicLayout><ProtectedRoute><Payment /></ProtectedRoute></PublicLayout>} />
      <Route path="/booking-confirmation/:bookingId" element={<PublicLayout><ProtectedRoute><BookingConfirmation /></ProtectedRoute></PublicLayout>} />
      <Route path="/my-bookings" element={<PublicLayout><ProtectedRoute><MyBookings /></ProtectedRoute></PublicLayout>} />
      <Route path="/profile" element={<PublicLayout><ProtectedRoute><Profile /></ProtectedRoute></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
      <Route path="/press" element={<PublicLayout><Press /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/help" element={<PublicLayout><Help /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/refunds" element={<PublicLayout><Refunds /></PublicLayout>} />
      <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}
