// src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: any | null;
  role: 'user' | 'driver' | 'admin' | null;
  token: string | null;
  setAuth: (user: any, role: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  token: null,
  setAuth: (user, role, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    set({ user, role: role as any, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ user: null, role: null, token: null });
  },
}));