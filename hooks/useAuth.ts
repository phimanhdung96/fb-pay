import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';

export function useAuth() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const token = useAuthStore((state) => state.token);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await checkAuth();
      } catch (e) {
        console.log('checkAuth error:', e);
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [checkAuth]);

  return { isLoggedIn, isReady, token };
}
