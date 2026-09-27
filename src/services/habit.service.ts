import { config } from '../constants/config';
import { apiClient } from './api';
import { mockHabits, mockTemplates } from './mock/mockHabits';
import type {
  AnalyticsSummary,
  ApiResponse,
  CreateHabitInput,
  Habit,
  HabitTemplate,
  UpdateHabitInput,
} from '../types/habit';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let db: Habit[] = [...mockHabits];

function deriveTodayFields(habit: Habit): Habit {
  const today = new Date().toISOString().slice(0, 10);
  const entry = habit.completions.find((c) => c.date === today);
  const todayValue = entry?.value ?? 0;
  const completedToday =
    habit.type === 'boolean' ? todayValue >= 1 : todayValue >= habit.target;
  return { ...habit, todayValue, completedToday };
}

class HabitService {
  async getHabits(): Promise<Habit[]> {
    if (config.useMockApi) {
      await delay();
      return db.filter((h) => h.status !== 'archived').map(deriveTodayFields);
    }
    const res = await apiClient.get<ApiResponse<Habit[]>>('/habits');
    return res.data;
  }

  async getArchivedHabits(): Promise<Habit[]> {
    if (config.useMockApi) {
      await delay();
      return db.filter((h) => h.status === 'archived').map(deriveTodayFields);
    }
    const res = await apiClient.get<ApiResponse<Habit[]>>('/habits?status=archived');
    return res.data;
  }

  async getHabitById(id: string): Promise<Habit | null> {
    if (config.useMockApi) {
      await delay(200);
      const found = db.find((h) => h.id === id);
      return found ? deriveTodayFields(found) : null;
    }
    const res = await apiClient.get<ApiResponse<Habit>>(`/habits/${id}`);
    return res.data;
  }

  async createHabit(input: CreateHabitInput): Promise<Habit> {
    if (config.useMockApi) {
      await delay();
      const now = new Date().toISOString();
      const habit: Habit = {
        id: `h_${Date.now()}`,
        ...input,
        target: input.target ?? 1,
        unit: input.unit ?? 'times',
        reminderEnabled: input.reminderEnabled ?? false,
        status: 'active',
        currentStreak: 0,
        bestStreak: 0,
        completions: [],
        startDate: input.startDate ?? now.slice(0, 10),
        createdAt: now,
        updatedAt: now,
        completedToday: false,
        todayValue: 0,
      };
      db = [habit, ...db];
      return habit;
    }
    const res = await apiClient.post<ApiResponse<Habit>>('/habits', input);
    return res.data;
  }

  async updateHabit(id: string, input: UpdateHabitInput): Promise<Habit> {
    if (config.useMockApi) {
      await delay(200);
      db = db.map((h) =>
        h.id === id ? { ...h, ...input, updatedAt: new Date().toISOString() } : h
      );
      const updated = db.find((h) => h.id === id)!;
      return deriveTodayFields(updated);
    }
    const res = await apiClient.patch<ApiResponse<Habit>>(`/habits/${id}`, input);
    return res.data;
  }

  async archiveHabit(id: string): Promise<void> {
    await this.updateHabit(id, { status: 'archived' });
  }

  async restoreHabit(id: string): Promise<void> {
    await this.updateHabit(id, { status: 'active' });
  }

  async deleteHabit(id: string): Promise<void> {
    if (config.useMockApi) {
      await delay(200);
      db = db.filter((h) => h.id !== id);
      return;
    }
    await apiClient.delete(`/habits/${id}`);
  }

  async logCompletion(id: string, value: number): Promise<Habit> {
    if (config.useMockApi) {
      await delay(150);
      const today = new Date().toISOString().slice(0, 10);
      const now = new Date().toISOString();

      db = db.map((h) => {
        if (h.id !== id) return h;
        const other = h.completions.filter((c) => c.date !== today);
        const capped = Math.max(0, value);
        const completions =
          capped === 0 ? other : [...other, { date: today, value: capped, completedAt: now }];

        const hitTarget =
          h.type === 'boolean' ? capped >= 1 : capped >= h.target;
        let currentStreak = h.currentStreak;
        if (hitTarget) {
          currentStreak = h.currentStreak + (h.completedToday ? 0 : 1);
        } else if (h.completedToday && !hitTarget) {
          currentStreak = Math.max(0, h.currentStreak - 1);
        }
        const bestStreak = Math.max(h.bestStreak, currentStreak);

        return {
          ...h,
          completions,
          currentStreak,
          bestStreak,
          updatedAt: now,
        };
      });

      return deriveTodayFields(db.find((h) => h.id === id)!);
    }
    const res = await apiClient.post<ApiResponse<Habit>>(`/habits/${id}/completions`, {
      value,
    });
    return res.data;
  }

  async getTemplates(): Promise<HabitTemplate[]> {
    if (config.useMockApi) {
      await delay(200);
      return mockTemplates;
    }
    const res = await apiClient.get<ApiResponse<HabitTemplate[]>>('/habits/templates');
    return res.data;
  }

  async getAnalytics(): Promise<AnalyticsSummary> {
    if (config.useMockApi) {
      await delay();
      const active = db.filter((h) => h.status === 'active');
      const totalCompletions = active.reduce((s, h) => s + h.completions.length, 0);
      const currentStreak = Math.max(0, ...active.map((h) => h.currentStreak), 0);
      const bestStreak = Math.max(0, ...active.map((h) => h.bestStreak), 0);

      const categoryBreakdown = {
        health: 0,
        mindset: 0,
        productivity: 0,
        finance: 0,
      } as Record<string, number>;
      active.forEach((h) => {
        categoryBreakdown[h.category] += h.completions.length;
      });

      const heatmap: { date: string; count: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const date = d.toISOString().slice(0, 10);
        const count = active.reduce(
          (s, h) => s + (h.completions.some((c) => c.date === date) ? 1 : 0),
          0
        );
        heatmap.push({ date, count });
      }

      const possible = active.length * 30 || 1;
      const completionRate = Math.round((totalCompletions / possible) * 100);

      return {
        currentStreak,
        bestStreak,
        totalCompletions,
        completionRate: Math.min(100, completionRate),
        categoryBreakdown: categoryBreakdown as AnalyticsSummary['categoryBreakdown'],
        heatmap,
      };
    }
    const res = await apiClient.get<ApiResponse<AnalyticsSummary>>('/analytics/summary');
    return res.data;
  }
}

export const habitService = new HabitService();
