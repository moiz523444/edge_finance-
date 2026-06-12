import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import 'react-native-reanimated';

const BACKGROUND = '#0a0f1c';

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: BACKGROUND,
    card: '#111827',
    text: '#FFFFFF',
    border: 'rgba(255,255,255,0.08)',
  },
};

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

import { FormDataProvider } from '../context/FormDataContext';

export default function RootLayout() {
  useEffect(() => {
    // Force the root background to match the theme
    SystemUI.setBackgroundColorAsync(BACKGROUND);
  }, []);

  return (
    <FormDataProvider>
      <ThemeProvider value={CustomDarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="otp" />
          <Stack.Screen name="terms" />
          <Stack.Screen name="privacy" />
          <Stack.Screen name="success" />
          <Stack.Screen name="nafath" />
          <Stack.Screen name="resend-nafath" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </FormDataProvider>
  );
}
