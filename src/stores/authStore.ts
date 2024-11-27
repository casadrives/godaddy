import { create } from 'zustand';
import { authService } from '@/services/authService';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const result = await authService.login(email, password);
      set({ 
        user: result.user, 
        isAuthenticated: true,
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
