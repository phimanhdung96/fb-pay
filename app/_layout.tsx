import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, RefreshControl, ScrollView } from 'react-native';
import 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { isLoggedIn, isReady, refreshing, refreshAuth } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Helper: kiểm tra có đang ở màn login không
  const isLoginScreen = segments[0] === '(auth)' && segments[1] === 'login';
  // Helper: kiểm tra có đang ở màn home (sau khi login) không

  useEffect(() => {
    if (!loaded || isLoggedIn === null || !isReady) return;
    // Nếu đã login và đang ở màn login thì chuyển sang home
    if (isLoggedIn === true && segments[0] === '(auth)') {
      router.replace('/(tabs)');
      return;
    }
    // Nếu chưa login và không ở màn login thì chuyển về login
    if (isLoggedIn === false && !isLoginScreen) {
      router.replace('/(auth)/login');
      return;
    }
  }, [isLoggedIn, router, loaded, segments, isReady, isLoginScreen]);

  if (!loaded || !isReady || (isLoggedIn === false && !isLoginScreen)) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                if (Platform.OS !== 'web') {
                  try {
                    await Updates.reloadAsync();
                  } catch (e) {
                    refreshAuth();
                  }
                } else {
                  window.location.reload();
                }
              }}
              colors={[colorScheme === 'dark' ? '#fff' : '#1877F2']}
              tintColor={colorScheme === 'dark' ? '#fff' : '#1877F2'}
            />
          }
        >
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#1877F2'} style={{ marginBottom: 16 }} />
          <ThemedText type="subtitle">Đang kiểm tra đăng nhập...</ThemedText>
          <StatusBar style="auto" />
        </ScrollView>
      </ThemeProvider>
    );
  }

  // Nếu đã login, luôn cho phép kéo để reload ở mọi trang (kể cả HomeScreen)
  if (isLoggedIn && segments[0] === '(tabs)') {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ScrollView
          contentContainerStyle={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                if (Platform.OS !== 'web') {
                  try {
                    await Updates.reloadAsync();
                  } catch (e) {
                    refreshAuth();
                  }
                } else {
                  window.location.reload();
                }
              }}
              colors={[colorScheme === 'dark' ? '#fff' : '#1877F2']}
              tintColor={colorScheme === 'dark' ? '#fff' : '#1877F2'}
            />
          }
        >
          {/* Render layout chính như cũ */}
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ScrollView>
      </ThemeProvider>
    );
  }

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
