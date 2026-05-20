import api from './api';

export const movieService = {
  getAll: (params) => api.get('/movies', { params }),
  getById: (id) => api.get(`/movies/${id}`),
  getTrending: () => api.get('/movies/trending'),
  search: (q) => api.get('/movies/search', { params: { q } }),
  getReviews: (id) => api.get(`/movies/${id}/reviews`),
  addReview: (id, data) => api.post(`/movies/${id}/reviews`, data),

  // Admin
  create: (data) => api.post('/movies/admin', data),
  update: (id, data) => api.put(`/movies/admin/${id}`, data),
  delete: (id) => api.delete(`/movies/admin/${id}`),
};

export const theaterService = {
  getAll: (params) => api.get('/theaters', { params }),
  getById: (id) => api.get(`/theaters/${id}`),
  create: (data) => api.post('/theaters', data),
  update: (id, data) => api.put(`/theaters/${id}`, data),
  delete: (id) => api.delete(`/theaters/${id}`),
  addScreen: (id, data) => api.post(`/theaters/${id}/screen`, data),
};

export const showService = {
  getAll: (params) => api.get('/shows', { params }),
  getById: (id) => api.get(`/shows/${id}`),
  getSeats: (id) => api.get(`/shows/${id}/seats`),
  create: (data) => api.post('/shows', data),
  update: (id, data) => api.put(`/shows/${id}`, data),
  delete: (id) => api.delete(`/shows/${id}`),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/user/my-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
  getAllAdmin: (params) => api.get('/bookings/admin/all', { params }),
  getStats: () => api.get('/bookings/admin/stats'),
};

export const paymentService = {
  initiate: (bookingId) => api.post('/payments/initiate', { bookingId }),
  verify: (data) => api.post('/payments/verify', data),
  getAllAdmin: (params) => api.get('/payments/admin/all', { params }),
  getStats: () => api.get('/payments/admin/stats'),
  refund: (id, data) => api.post(`/payments/admin/${id}/refund`, data),
};

export const userService = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  addToWatchlist: (movieId) => api.post(`/users/me/watchlist/${movieId}`),
  removeFromWatchlist: (movieId) => api.delete(`/users/me/watchlist/${movieId}`),
  saveTheater: (theaterId) => api.post(`/users/me/theaters/${theaterId}`),
  removeTheater: (theaterId) => api.delete(`/users/me/theaters/${theaterId}`),
  getAllAdmin: (params) => api.get('/users/admin/all', { params }),
  getDetailsAdmin: (id) => api.get(`/users/admin/${id}`),
  blockUser: (id) => api.put(`/users/admin/${id}/block`),
  unblockUser: (id) => api.put(`/users/admin/${id}/unblock`),
  deleteUser: (id) => api.delete(`/users/admin/${id}`),
};

export const adminService = {
  getDashboard: () => api.get('/admin/analytics/dashboard'),
  getRevenue: (period) => api.get('/admin/analytics/revenue', { params: { period } }),
  getUserAnalytics: () => api.get('/admin/analytics/users'),
  getMovieAnalytics: () => api.get('/admin/analytics/movies'),
};
