import { create } from 'zustand';
import * as Haptics from 'expo-haptics';
import { habitService } from '../services/habit.service';
import type {
  AnalyticsSummary,
  CreateHabitInput,
  Habit,
  HabitTemplate,
  UpdateHabitInput,
} from '../types/habit';
import { usePreferencesStore } from './preferencesStore';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

interface HabitState {
  habits: Habit[];
  archived: Habit[];
  templates: HabitTemplate[];
  analytics: AnalyticsSummary | null;
  status: LoadState;
  error: string | null;

  fetchHabits: () => Promise<void>;
  fetchArchived: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  createHabit: (input: CreateHabitInput) => Promise<Habit>;
  updateHabit: (id: string, input: UpdateHabitInput) => Promise<void>;
  archiveHabit: (id: string) => Promise<void>;
  restoreHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;

  toggleBooleanHabit: (id: string) => Promise<void>;
  setQuantitativeValue: (id: string, value: number) => Promise<void>;
  incrementQuantitative: (id: string) => Promise<void>;
  decrementQuantitative: (id: string) => Promise<void>;
}

function todayProgress(habits: Habit[]) {
  const active = habits.filter((h) => h.status === 'active');
  const completed = active.filter((h) => h.completedToday).length;
  const total = active.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

export const selectTodayProgress = (s: HabitState) => todayProgress(s.habits);

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  archived: [],
  templates: [],
  analytics: null,
  status: 'idle',
  error: null,

  fetchHabits: async () => {
    set({ status: 'loading', error: null });
    try {
      const habits = await habitService.getHabits();
      set({ habits, status: 'success' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load habits';
      set({ status: 'error', error: message });
    }
  },

  fetchArchived: async () => {
    try {
      const archived = await habitService.getArchivedHabits();
      set({ archived });
    } catch {
      /* non-blocking */
    }
  },

  fetchTemplates: async () => {
    try {
      const templates = await habitService.getTemplates();
      set({ templates });
    } catch {
      /* non-blocking */
    }
  },

  fetchAnalytics: async () => {
    try {
      const analytics = await habitService.getAnalytics();
      set({ analytics });
    } catch {
      /* non-blocking */
    }
  },

  createHabit: async (input) => {
    const habit = await habitService.createHabit(input);
    set({ habits: [habit, ...get().habits] });
    return habit;
  },

  updateHabit: async (id, input) => {
    const updated = await habitService.updateHabit(id, input);
    set({ habits: get().habits.map((h) => (h.id === id ? updated : h)) });
  },

  archiveHabit: async (id) => {
    await habitService.archiveHabit(id);
    const habit = get().habits.find((h) => h.id === id);
    set({
      habits: get().habits.filter((h) => h.id !== id),
      archived: habit
        ? [{ ...habit, status: 'archived' }, ...get().archived]
        : get().archived,
    });
  },

  restoreHabit: async (id) => {
    await habitService.restoreHabit(id);
    const habit = get().archived.find((h) => h.id === id);
    set({
      archived: get().archived.filter((h) => h.id !== id),
      habits: habit ? [{ ...habit, status: 'active' }, ...get().habits] : get().habits,
    });
  },

  deleteHabit: async (id) => {
    await habitService.deleteHabit(id);
    set({
      habits: get().habits.filter((h) => h.id !== id),
      archived: get().archived.filter((h) => h.id !== id),
    });
  },

  toggleBooleanHabit: async (id) => {
    const habit = get().habits.find((h) => h.id === id);
    if (!habit || habit.type !== 'boolean') return;

    const nextValue = habit.completedToday ? 0 : 1;

    set({
      habits: get().habits.map((h) =>
        h.id === id
          ? {
              ...h,
              todayValue: nextValue,
              completedToday: nextValue >= 1,
              currentStreak: nextValue >= 1 ? h.currentStreak + (h.completedToday ? 0 : 1) : Math.max(0, h.currentStreak - 1),
            }
          : h
      ),
    });

    if (usePreferencesStore.getState().hapticsEnabled) {
      await Haptics.impactAsync(
        nextValue >= 1 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
      );
    }

    try {
      const synced = await habitService.logCompletion(id, nextValue);
      set({ habits: get().habits.map((h) => (h.id === id ? synced : h)) });
    } catch {
      await get().fetchHabits();
    }
  },

  setQuantitativeValue: async (id, value) => {
    const habit = get().habits.find((h) => h.id === id);
    if (!habit || habit.type !== 'quantitative') return;

    const capped = Math.max(0, Math.min(value, habit.target * 3));
    const completedToday = capped >= habit.target;

    set({
      habits: get().habits.map((h) =>
        h.id === id ? { ...h, todayValue: capped, completedToday } : h
      ),
    });

    try {
      const synced = await habitService.logCompletion(id, capped);
      set({ habits: get().habits.map((h) => (h.id === id ? synced : h)) });
    } catch {
      await get().fetchHabits();
    }
  },

  incrementQuantitative: async (id) => {
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;
    const next = (habit.todayValue ?? 0) + 1;
    if (usePreferencesStore.getState().hapticsEnabled && next >= habit.target) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (usePreferencesStore.getState().hapticsEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await get().setQuantitativeValue(id, next);
  },

  decrementQuantitative: async (id) => {
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;
    await get().setQuantitativeValue(id, Math.max(0, (habit.todayValue ?? 0) - 1));
  },
}));
