import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setAccessToken: (token) => {
        if (typeof window !== 'undefined') localStorage.setItem('accessToken', token);
        set({ accessToken: token });
      },

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') localStorage.setItem('accessToken', token);
        set({ user, accessToken: token, isAuthenticated: true });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'taskflow-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
