import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Booking store
export const useBookingStore = create(persist(
  (set, get) => ({
    selectedMovie: null,
    selectedShow: null,
    selectedTheater: null,
    selectedSeats: [],
    bookingStep: 1, // 1:theater, 2:seats, 3:payment, 4:confirm
    currentBooking: null,

    setSelectedMovie: (movie) => set({ selectedMovie: movie }),
    setSelectedShow: (show) => set({ selectedShow: show }),
    setSelectedTheater: (theater) => set({ selectedTheater: theater }),
    toggleSeat: (seat) => {
      const { selectedSeats } = get();
      const exists = selectedSeats.find(s => s.seatNumber === seat.seatNumber);
      if (exists) {
        set({ selectedSeats: selectedSeats.filter(s => s.seatNumber !== seat.seatNumber) });
      } else {
        if (selectedSeats.length >= 10) return; // max 10 seats
        set({ selectedSeats: [...selectedSeats, seat] });
      }
    },
    clearSeats: () => set({ selectedSeats: [] }),
    setBookingStep: (step) => set({ bookingStep: step }),
    setCurrentBooking: (booking) => set({ currentBooking: booking }),
    resetBooking: () => set({ selectedSeats: [], bookingStep: 1, currentBooking: null }),

    getTotalPrice: () => {
      const { selectedSeats } = get();
      return selectedSeats.reduce((sum, s) => sum + s.price, 0);
    },
  }),
  { name: 'cineflow-booking' }
));

// UI store
export const useUIStore = create(persist(
  (set) => ({
    isSearchOpen: false,
    isMobileMenuOpen: false,
    activeModal: null,
    theme: 'dark',
    selectedCity: 'Mumbai',
    hasSelectedCity: false,

    setSearchOpen: (open) => set({ isSearchOpen: open }),
    setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    openModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: null }),
    toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    setSelectedCity: (city) => set({ selectedCity: city, hasSelectedCity: true }),
  }),
  {
    name: 'cineflow-ui',
    partialize: (state) => ({ theme: state.theme, selectedCity: state.selectedCity, hasSelectedCity: state.hasSelectedCity }),
  }
));
