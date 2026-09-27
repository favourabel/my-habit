export type HabitCategory = 'health' | 'mindset' | 'productivity' | 'finance';

export type HabitFrequencyType = 'daily' | 'specific_days' | 'times_per_week';

export type HabitType = 'boolean' | 'quantitative';

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sun–Sat

export type HabitUnit =
  | 'times'
  | 'glasses'
  | 'minutes'
  | 'pages'
  | 'km'
  | 'reps'
  | 'dollars'
  | 'custom';

export type HabitStatus = 'active' | 'paused' | 'archived';

export interface HabitFrequency {
  type: HabitFrequencyType;
  /** Required when type === 'specific_days' */
  days?: WeekDay[];
  /** Required when type === 'times_per_week' */
  timesPerWeek?: number;
}

export interface HabitCompletion {
  date: string; // YYYY-MM-DD
  value: number; // 1 for boolean, N for quantitative
  completedAt: string; // ISO
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  type: HabitType;
  target: number; // 1 for boolean
  unit: HabitUnit;
  customUnitLabel?: string;
  frequency: HabitFrequency;
  reminderEnabled: boolean;
  reminderTime?: string; // HH:mm
  status: HabitStatus;
  currentStreak: number;
  bestStreak: number;
  completions: HabitCompletion[];
  startDate: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
  /** Client-only derived fields (safe to recompute) */
  completedToday?: boolean;
  todayValue?: number;
}

export interface HabitTemplate {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  type: HabitType;
  target: number;
  unit: HabitUnit;
  frequency: HabitFrequency;
  icon: string;
}

export interface CreateHabitInput {
  name: string;
  description?: string;
  category: HabitCategory;
  type: HabitType;
  target: number;
  unit: HabitUnit;
  customUnitLabel?: string;
  frequency: HabitFrequency;
  reminderEnabled: boolean;
  reminderTime?: string;
  startDate?: string;
}

export interface UpdateHabitInput extends Partial<CreateHabitInput> {
  status?: HabitStatus;
}

export interface DailyProgress {
  date: string;
  total: number;
  completed: number;
  percentage: number;
}

export interface AnalyticsSummary {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completionRate: number; // 0–100
  categoryBreakdown: Record<HabitCategory, number>;
  heatmap: { date: string; count: number }[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}