/**
 * Admin Store — all admin edits saved to localStorage,
 * merged over mock data so every page sees the updates instantly.
 */
import { MOCK_MOVIES, MOCK_SHOWS } from './mockMovies';

const KEYS = {
  overrides:  'cf_movie_overrides',   // { [movieId]: partialMovie }
  deleted:    'cf_movies_deleted',    // string[]
  added:      'cf_movies_added',      // Movie[]
  theaters:   'cf_theaters',          // Theater[]
};

// ── Movies ──────────────────────────────────────────────────────────────────
export function getMovies() {
  const overrides = JSON.parse(localStorage.getItem(KEYS.overrides) || '{}');
  const deleted   = JSON.parse(localStorage.getItem(KEYS.deleted)   || '[]');
  const added     = JSON.parse(localStorage.getItem(KEYS.added)     || '[]');

  const base = MOCK_MOVIES
    .filter(m => !deleted.includes(m._id))
    .map(m => ({ ...m, ...(overrides[m._id] || {}) }));

  return [...base, ...added];
}

export function updateMovie(id, patch) {
  const overrides = JSON.parse(localStorage.getItem(KEYS.overrides) || '{}');
  overrides[id] = { ...(overrides[id] || {}), ...patch };
  localStorage.setItem(KEYS.overrides, JSON.stringify(overrides));

  // Also patch added list if needed
  const added = JSON.parse(localStorage.getItem(KEYS.added) || '[]');
  const idx = added.findIndex(m => m._id === id);
  if (idx !== -1) { added[idx] = { ...added[idx], ...patch }; localStorage.setItem(KEYS.added, JSON.stringify(added)); }
}

export function addMovie(data) {
  const added = JSON.parse(localStorage.getItem(KEYS.added) || '[]');
  const newMovie = {
    _id: `adm_${Date.now()}`,
    averageRating: 0,
    totalReviews: 0,
    votes: '0',
    isNew: true,
    isHot: false,
    format: ['2D'],
    language: ['Hindi'],
    genre: [],
    certificate: 'U/A',
    ...data,
  };
  added.push(newMovie);
  localStorage.setItem(KEYS.added, JSON.stringify(added));
  return newMovie;
}

export function deleteMovie(id) {
  if (id.startsWith('adm_')) {
    const added = JSON.parse(localStorage.getItem(KEYS.added) || '[]');
    localStorage.setItem(KEYS.added, JSON.stringify(added.filter(m => m._id !== id)));
  } else {
    const deleted = JSON.parse(localStorage.getItem(KEYS.deleted) || '[]');
    if (!deleted.includes(id)) deleted.push(id);
    localStorage.setItem(KEYS.deleted, JSON.stringify(deleted));
  }
}

// ── Theaters ─────────────────────────────────────────────────────────────────
const DEFAULT_THEATERS = [
  { _id: 't1', name: 'PVR IMAX Infiniti', city: 'Mumbai', address: 'Infiniti Mall, Andheri West', screens: 8, formats: ['2D', 'IMAX', '4DX'], status: 'active' },
  { _id: 't2', name: 'INOX Megaplex', city: 'Mumbai', address: 'R-City Mall, Ghatkopar', screens: 10, formats: ['2D', '3D', '4DX'], status: 'active' },
  { _id: 't3', name: 'Cinepolis VIP', city: 'Mumbai', address: 'Fun Republic, Andheri', screens: 6, formats: ['2D', 'IMAX'], status: 'active' },
  { _id: 't4', name: 'PVR Juhu', city: 'Mumbai', address: 'Juhu', screens: 5, formats: ['2D', '3D'], status: 'active' },
];

export function getTheaters() {
  const stored = localStorage.getItem(KEYS.theaters);
  return stored ? JSON.parse(stored) : DEFAULT_THEATERS;
}

export function saveTheaters(list) {
  localStorage.setItem(KEYS.theaters, JSON.stringify(list));
}

// ── Bookings (from all user localStorage) ────────────────────────────────────
export function getAllBookings() {
  const users = JSON.parse(localStorage.getItem('cineflow_users') || '[]');
  const all = [];
  users.forEach(u => {
    const key = `cineflow_bookings_${u.id}`;
    const bks = JSON.parse(localStorage.getItem(key) || '[]');
    bks.forEach(b => all.push({ ...b, userName: `${u.firstName} ${u.lastName}`, userEmail: u.email }));
  });
  // Also check current anonymous session
  return all.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
}

// ── Users ─────────────────────────────────────────────────────────────────────
export function getAllUsers() {
  return JSON.parse(localStorage.getItem('cineflow_users') || '[]').map(u => {
    const { password: _, ...safe } = u;
    const bookings = JSON.parse(localStorage.getItem(`cineflow_bookings_${u.id}`) || '[]');
    return { ...safe, bookingCount: bookings.length, totalSpent: bookings.reduce((s, b) => s + (b.total || 0), 0) };
  });
}

// ── Dashboard stats ───────────────────────────────────────────────────────────
export function getDashboardStats() {
  const bookings = getAllBookings();
  const users    = getAllUsers();
  const movies   = getMovies();
  const theaters = getTheaters();
  const revenue  = bookings.reduce((s, b) => s + (b.total || 0), 0);
  return { bookings: bookings.length, users: users.length, movies: movies.length, theaters: theaters.length, revenue };
}
