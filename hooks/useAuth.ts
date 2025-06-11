import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';

export function useAuth() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isLoggedIn };
}
