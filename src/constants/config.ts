/**
 * Central config. Swap EXPO_PUBLIC_API_URL in .env for real backend.
 * Never put secrets here.
 */
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
  apiTimeout: 15000,
  useMockApi: process.env.EXPO_PUBLIC_USE_MOCK !== 'false', // default mock ON
  appName: 'Streakly',
  appVersion: '1.0.0',
} as const;