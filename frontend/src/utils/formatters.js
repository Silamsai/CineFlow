export const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

export const formatDate = (date, options = {}) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', ...options });

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

export const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const formatRating = (rating) => parseFloat(rating).toFixed(1);

export const truncate = (str, n = 150) => str?.length > n ? str.slice(0, n) + '...' : str;

export const slugify = (str) => str?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

export const getInitials = (firstName = '', lastName = '') =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';

export const calcBookingTotals = (seats) => {
  const subtotal = seats.reduce((s, seat) => s + seat.price, 0);
  const convenience = Math.round(subtotal * 0.05);
  const taxes = Math.round(subtotal * 0.18);
  return { subtotal, convenience, taxes, total: subtotal + convenience + taxes };
};
