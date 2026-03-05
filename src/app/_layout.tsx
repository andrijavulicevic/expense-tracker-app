import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

import { useResolvedColorScheme } from '@/hooks/use-theme';
import { useStore } from '@/store/useStore';

export default function RootLayout() {
  const colorScheme = useResolvedColorScheme();
  const hasOnboarded = useStore((s) => s.settings.hasOnboarded);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const inOnboarding = segments[0] === 'onboarding';

      if (!hasOnboarded && !inOnboarding) {
        router.replace('/onboarding');
      } else if (hasOnboarded && inOnboarding) {
        router.replace('/(tabs)');
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [hasOnboarded, segments, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-expense"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
