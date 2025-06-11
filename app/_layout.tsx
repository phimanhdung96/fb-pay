import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments();
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
    // Wait for the navigation container to be ready
    const timeout = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);


  useEffect(() => {
    if (!loaded || isLoggedIn === null || !isReady) return;

    if (
      isLoggedIn === false &&
      !(segments[0] === '(auth)' && segments[1] === 'login')
    ) {
      router.replace('/(auth)/login');
    }
    else if (
      isLoggedIn === true && segments[0] === '(auth)'
    ) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, router, loaded, segments, isReady]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
