import { useAuthStore } from '@/store/auth';
import { useCallback, useEffect, useState } from 'react';

export function useAuth(alwaysRefresh = false) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const token = useAuthStore((state) => state.token);
  const [isReady, setIsReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refreshAuth = useCallback(async () => {
    setRefreshing(true);
    try {
      await checkAuth();
    } catch (e) {
      console.log('checkAuth error:', e);
    } finally {
      setIsReady(true);
      setRefreshing(false);
    }
  }, [checkAuth]);

  useEffect(() => {
    if (alwaysRefresh) {
      refreshAuth();
    } else {
      refreshAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkAuth, alwaysRefresh]);

  return { isLoggedIn, isReady, token, refreshing, refreshAuth };
}
