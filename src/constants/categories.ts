import type { HabitCategory } from '@/types/habit';

export const CATEGORY_META: Record<
  HabitCategory,
  { label: string; emoji: string; bgClass: string; textClass: string; dotClass: string }
> = {
  health: {
    label: 'Health',
    emoji: '',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    dotClass: 'bg-emerald-500',
  },
  mindset: {
    label: 'Mindset',
    emoji: '',
    bgClass: 'bg-violet-50',
    textClass: 'text-violet-700',
    dotClass: 'bg-violet-500',
  },
  productivity: {
    label: 'Productivity',
    emoji: '',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    dotClass: 'bg-blue-500',
  },
  finance: {
    label: 'Finance',
    emoji: '',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    dotClass: 'bg-amber-500',
  },
};

export const CATEGORY_LIST = Object.entries(CATEGORY_META).map(([key, meta]) => ({
  key: key as HabitCategory,
  ...meta,
}));