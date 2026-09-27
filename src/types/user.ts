export type ThemeMode = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserPreferences {
  theme: ThemeMode;
  notificationsEnabled: boolean;
  weekStartsOn: 0 | 1; // Sun | Mon
  hapticsEnabled: boolean;
}