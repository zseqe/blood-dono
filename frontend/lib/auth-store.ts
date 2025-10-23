import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  hospitalId: string | null;
  hospitalName: string | null;
  setAuth: (token: string, hospitalId: string, hospitalName: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      hospitalId: null,
      hospitalName: null,
      setAuth: (token, hospitalId, hospitalName) => set({ token, hospitalId, hospitalName }),
      clearAuth: () => set({ token: null, hospitalId: null, hospitalName: null }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'lifelink-auth',
    }
  )
);
