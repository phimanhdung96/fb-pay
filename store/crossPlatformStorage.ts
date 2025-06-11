import { Storage } from 'expo-storage';
import { Platform } from 'react-native';

export const crossPlatformStorage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await Storage.setItem({ key, value });
    }
  },
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await Storage.getItem({ key });
    }
  },
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await Storage.removeItem({ key });
    }
  },
};
