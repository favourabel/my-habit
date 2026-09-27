import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabitStore } from '../../store/habitStore';
import { greetingForNow, formatDisplayDate } from '../../utils/date';
import { CATEGORY_META } from '../../constants/categories';
import type { HabitCategory } from '../../types/habit';

export default function TodayScreen() {
  const habits = useHabitStore((s) => s.habits);
  const status = useHabitStore((s) => s.status);
  const fetchHabits = useHabitStore((s) => s.fetchHabits);
  const toggleBooleanHabit = useHabitStore((s) => s.toggleBooleanHabit);
  const incrementQuantitative = useHabitStore((s) => s.incrementQuantitative);
  const decrementQuantitative = useHabitStore((s) => s.decrementQuantitative);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchHabits();
  }, []);

  const activeHabits = habits.filter((h) => h.status === 'active');
  const filteredHabits =
    selectedCategory === 'all'
      ? activeHabits
      : activeHabits.filter((h) => h.category === selectedCategory);

  const completedCount = activeHabits.filter((h) => h.completedToday).length;
  const totalCount = activeHabits.length;
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-3 pb-4 bg-white border-b border-slate-100 flex-row items-center justify-between">
        <View>
          <Text className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            {formatDisplayDate()}
          </Text>
          <Text className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
            {greetingForNow()}
          </Text>
        </View>
        <View className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-100 items-center justify-center shadow-sm">
          <Text className="text-sm font-black text-blue-600">ST</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Daily Progress Banner */}
        <View className="m-5 p-5 rounded-3xl bg-blue-600 shadow-xl shadow-blue-500/20">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
                Daily Completion
              </Text>
              <Text className="text-3xl font-black text-white mt-1">
                {completedCount} <Text className="text-lg font-medium text-blue-200">/ {totalCount}</Text>
              </Text>
            </View>
            <View className="h-14 w-14 rounded-2xl bg-white/15 border border-white/30 items-center justify-center backdrop-blur-md">
              <Text className="text-lg font-black text-white">{percentage}%</Text>
            </View>
          </View>

          {/* Progress Track */}
          <View className="h-2.5 w-full bg-blue-900/30 rounded-full overflow-hidden mb-3">
            <View
              className="h-full bg-white rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-medium text-blue-100">
              {percentage === 100 ? 'All tasks completed' : `${totalCount - completedCount} habits left today`}
            </Text>
            <View className="bg-white/20 px-2.5 py-1 rounded-full">
              <Text className="text-[10px] font-bold text-white">12 Day Streak</Text>
            </View>
          </View>
        </View>

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-4">
          <TouchableOpacity
            onPress={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl border mr-2 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 border-slate-900'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                selectedCategory === 'all' ? 'text-white' : 'text-slate-600'
              }`}
            >
              All Habits
            </Text>
          </TouchableOpacity>

          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-2xl border mr-2 flex-row items-center ${
                selectedCategory === key
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  selectedCategory === key ? 'text-white' : 'text-slate-600'
                }`}
              >
                {meta.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tasks List */}
        <View className="px-5">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
            {status === 'loading' ? 'Syncing tasks...' : 'Today Tasks'}
          </Text>

          {filteredHabits.map((h) => {
            const meta = CATEGORY_META[h.category as HabitCategory] || CATEGORY_META.productivity;

            return (
              <View
                key={h.id}
                className={`mb-3 p-4 rounded-2xl border ${
                  h.completedToday
                    ? 'bg-slate-100/80 border-slate-200/60'
                    : 'bg-white border-slate-200/80 shadow-sm shadow-slate-100'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-3">
                    <Text
                      className={`text-base font-bold ${
                        h.completedToday ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {h.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Text className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${meta.bgClass} ${meta.textClass} mr-2`}>
                        {meta.label}
                      </Text>
                      <Text className="text-xs font-semibold text-slate-500">
                        {h.currentStreak}d streak
                      </Text>
                    </View>
                  </View>

                  {/* Actions */}
                  {h.type === 'boolean' ? (
                    <TouchableOpacity
                      onPress={() => toggleBooleanHabit(h.id)}
                      className={`w-10 h-10 rounded-xl border items-center justify-center ${
                        h.completedToday
                          ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-500/30'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {h.completedToday && <Text className="text-white font-black text-sm">✓</Text>}
                    </TouchableOpacity>
                  ) : (
                    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                      <TouchableOpacity
                        onPress={() => decrementQuantitative(h.id)}
                        className="w-7 h-7 bg-white rounded-lg border border-slate-200 items-center justify-center"
                      >
                        <Text className="text-slate-700 font-black text-xs">-</Text>
                      </TouchableOpacity>

                      <Text className="text-xs font-bold text-slate-900 px-2.5">
                        {h.todayValue || 0}/{h.target}
                      </Text>

                      <TouchableOpacity
                        onPress={() => incrementQuantitative(h.id)}
                        className="w-7 h-7 bg-blue-600 rounded-lg items-center justify-center"
                      >
                        <Text className="text-white font-black text-xs">+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}