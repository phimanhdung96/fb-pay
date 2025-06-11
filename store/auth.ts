import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

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
    await AsyncStorage.setItem('token', token);
    set({ isLoggedIn: true, token });
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ isLoggedIn: false, token: null });
  },
  checkAuth: async () => {
    const token = await AsyncStorage.getItem('token');
    set({ isLoggedIn: !!token, token });
  },
}));
