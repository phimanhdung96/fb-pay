import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { isLoggedIn, isReady } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Helper: kiểm tra có đang ở màn login không
  const isLoginScreen = segments[0] === '(auth)' && segments[1] === 'login';

  useEffect(() => {
    if (!loaded || isLoggedIn === null || !isReady) return;
    if (isLoggedIn === false && !isLoginScreen) {
      router.replace('/(auth)/login');
      return;
    }
    if (isLoggedIn === true && segments[0] === '(auth)') {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, router, loaded, segments, isReady, isLoginScreen]);



  if (!loaded || !isReady || (isLoggedIn === false && !isLoginScreen)) {
    console.log('RootLayout loading...');
    
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#1877F2'} style={{ marginBottom: 16 }} />
          <ThemedText type="subtitle">Đang kiểm tra đăng nhập...</ThemedText>
          <StatusBar style="auto" />
        </ThemedView>
      </ThemeProvider>
    );
  }
console.log('RootLayout rendered with segments:')
  // Nếu đã sẵn sàng và không cần điều hướng, hiển thị layout chính

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
