/**
 * Streakly Design System Tokens
 * Primary brand: Blue · Surfaces: White / Light neutral
 * No inline styles elsewhere — consume these tokens via NativeWind classes or typed constants.
 */

export const colors = {
  brand: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  success: {
    light: '#D1FAE5',
    DEFAULT: '#10B981',
    dark: '#059669',
  },
  warning: {
    light: '#FEF3C7',
    DEFAULT: '#F59E0B',
    dark: '#D97706',
  },
  danger: {
    light: '#FEE2E2',
    DEFAULT: '#EF4444',
    dark: '#DC2626',
  },
  category: {
    health: '#10B981',
    mindset: '#8B5CF6',
    productivity: '#3B82F6',
    finance: '#F59E0B',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

export const typography = {
  display: 'text-3xl font-bold tracking-tight',
  h1: 'text-2xl font-bold tracking-tight',
  h2: 'text-xl font-semibold',
  h3: 'text-lg font-semibold',
  body: 'text-base font-normal',
  bodyMedium: 'text-base font-medium',
  caption: 'text-sm font-normal',
  captionMedium: 'text-sm font-medium',
  micro: 'text-xs font-medium',
  stat: 'text-4xl font-bold tracking-tighter',
  statSm: 'text-2xl font-bold tracking-tight',
} as const;

export const shadows = {
  sm: 'shadow-sm shadow-slate-200/50',
  md: 'shadow-md shadow-slate-200/60',
  lg: 'shadow-lg shadow-slate-300/40',
} as const;