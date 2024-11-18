import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'company' | 'driver' | 'user' | null;
    name: string;
  } | null;
  isAuthenticated: boolean;
  setUser: (user: UserState['user']) => void;
  logout: () => void;
}

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface BookingState {
  currentBooking: {
    pickupLocation: string;
    dropoffLocation: string;
    date: string;
    passengers: number;
  } | null;
  setCurrentBooking: (booking: BookingState['currentBooking']) => void;
  clearCurrentBooking: () => void;
}

export const useStore = create<UserState & UIState & BookingState>()(
  persist(
    (set) => ({
      // User state
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // UI state
      isSidebarOpen: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Booking state
      currentBooking: null,
      setCurrentBooking: (booking) => set({ currentBooking: booking }),
      clearCurrentBooking: () => set({ currentBooking: null }),
    }),
    {
      name: 'casadrives-storage',
      partialize: (state) => ({
        user: state.user,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);
