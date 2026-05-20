export const MOVIE_GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western'];
export const MOVIE_FORMATS = ['2D', '3D', 'IMAX', '4DX'];
export const MOVIE_LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi'];
export const CERTIFICATES = ['U', 'UA', 'A', 'S'];
export const SORT_OPTIONS = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Top Rated', value: '-rating' },
  { label: 'Most Popular', value: '-totalReviews' },
  { label: 'Release Date', value: '-releaseDate' },
];
export const BOOKING_STEPS = ['Theater', 'Seats', 'Payment', 'Confirmation'];
export const SEAT_CATEGORIES = { standard: { label: 'Standard', color: 'green' }, premium: { label: 'Premium', color: 'blue' }, vip: { label: 'VIP', color: 'purple' } };
export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '₹', description: 'GPay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', description: 'Visa, Mastercard, Amex' },
  { id: 'wallet', label: 'Digital Wallet', icon: '👛', description: 'Paytm, Amazon Pay' },
  { id: 'net_banking', label: 'Net Banking', icon: '🏦', description: 'All major banks' },
];
export const CONVENIENCE_FEE_PERCENT = 0.05;
export const TAX_PERCENT = 0.18;
