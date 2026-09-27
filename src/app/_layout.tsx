import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F8FAFC' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="habits/create"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen name="habits/templates" options={{ presentation: 'modal' }} />
        <Stack.Screen name="habits/[id]" />
        <Stack.Screen name="habits/[id]/edit" />
        <Stack.Screen name="habits/archived" />
        <Stack.Screen name="settings/appearance" />
        <Stack.Screen name="settings/notifications" />
        <Stack.Screen name="settings/privacy" />
        <Stack.Screen name="settings/data" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="onboarding/index" />
      </Stack>
    </>
  );
}