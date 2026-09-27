import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabitStore } from '../../store/habitStore';
import { CATEGORY_META } from '../../constants/categories';
import type { HabitCategory } from '../../types/habit';

export default function HabitsScreen() {
  const habits = useHabitStore((s) => s.habits);
  const archiveHabit = useHabitStore((s) => s.archiveHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('active');

  const displayedHabits = habits.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'archived') return matchesSearch && h.status === 'archived';
    return matchesSearch && h.status === 'active';
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-3 pb-4 bg-white border-b border-slate-100 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-black text-slate-900 tracking-tight">Habit Library</Text>
          <Text className="text-xs font-medium text-slate-500 mt-0.5">Manage and configure your daily routines</Text>
        </View>
        <TouchableOpacity className="bg-blue-600 px-4 py-2.5 rounded-2xl shadow-md shadow-blue-500/20">
          <Text className="text-white text-xs font-bold">+ New Habit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="p-5">
        {/* Search Bar */}
        <View className="mb-4 bg-white border border-slate-200/80 rounded-2xl px-4 py-3 flex-row items-center shadow-sm shadow-slate-100">
          <TextInput
            className="flex-1 text-sm font-medium text-slate-900 placeholder:text-slate-400"
            placeholder="Search habits by name..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Tab Filter Toggles */}
        <View className="flex-row bg-slate-200/60 p-1 rounded-2xl mb-5">
          <TouchableOpacity
            onPress={() => setFilter('active')}
            className={`flex-1 py-2 rounded-xl items-center ${filter === 'active' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`text-xs font-bold ${filter === 'active' ? 'text-slate-900' : 'text-slate-500'}`}>
              Active ({habits.filter((h) => h.status === 'active').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('archived')}
            className={`flex-1 py-2 rounded-xl items-center ${filter === 'archived' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text className={`text-xs font-bold ${filter === 'archived' ? 'text-slate-900' : 'text-slate-500'}`}>
              Archived ({habits.filter((h) => h.status === 'archived').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Habits List */}
        {displayedHabits.length === 0 ? (
          <View className="p-8 items-center justify-center bg-white rounded-3xl border border-slate-200/80 my-4">
            <Text className="text-base font-bold text-slate-900 mb-1">No Habits Found</Text>
            <Text className="text-xs text-slate-500 text-center">
              {search ? 'Try searching for something else.' : 'Create your first habit to start building consistency.'}
            </Text>
          </View>
        ) : (
          displayedHabits.map((h) => {
            const meta = CATEGORY_META[h.category as HabitCategory] || CATEGORY_META.productivity;

            return (
              <View
                key={h.id}
                className="mb-3.5 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-100"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-1 mr-2">
                    <Text className="text-base font-bold text-slate-900">{h.name}</Text>
                    <Text className="text-xs text-slate-500 mt-0.5">{h.description || 'Daily habit'}</Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-xs font-black text-amber-500">{h.currentStreak}d streak</Text>
                    <Text className="text-[10px] text-slate-400 font-medium">Best: {h.bestStreak}d</Text>
                  </View>
                </View>

                {/* Footer Metadata & Actions */}
                <View className="pt-3 border-t border-slate-100 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${meta.bgClass} ${meta.textClass} mr-2`}>
                      {meta.label}
                    </Text>
                    <Text className="text-[11px] font-medium text-slate-500 capitalize">
                      {h.frequency.type.replace('_', ' ')}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={() => archiveHabit(h.id)}
                      className="bg-slate-100 px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-[11px] font-bold text-slate-600">
                        {h.status === 'archived' ? 'Restore' : 'Archive'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => deleteHabit(h.id)}
                      className="bg-red-50 px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-[11px] font-bold text-red-600">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}