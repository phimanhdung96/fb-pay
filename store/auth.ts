import { create } from 'zustand';
import { crossPlatformStorage } from './crossPlatformStorage';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,
  login: async (token: string) => {
    await crossPlatformStorage.setItem('token', token);
    set({ isLoggedIn: true, token });
  },
  logout: async () => {
    await crossPlatformStorage.removeItem('token');
    set({ isLoggedIn: false, token: null });
  },
  checkAuth: async () => {
    const token = await crossPlatformStorage.getItem('token');
    set({ isLoggedIn: !!token, token });
  },
}));
