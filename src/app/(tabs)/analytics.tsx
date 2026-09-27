import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnalyticsScreen() {
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    intensity:
      i % 5 === 0
        ? 'bg-blue-600'
        : i % 3 === 0
        ? 'bg-blue-400'
        : i % 2 === 0
        ? 'bg-blue-200'
        : 'bg-slate-100',
  }));

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-3 pb-4 bg-white border-b border-slate-100">
        <Text className="text-2xl font-black text-slate-900 tracking-tight">Performance Analytics</Text>
        <Text className="text-xs font-medium text-slate-500 mt-0.5">Consistency heatmap and category distribution</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="p-5">
        {/* Metric Cards */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm shadow-slate-100">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Streak</Text>
            <Text className="text-2xl font-black text-amber-500 mt-1">12 Days</Text>
            <Text className="text-[10px] font-semibold text-slate-400 mt-1">Best: 21 Days</Text>
          </View>

          <View className="flex-1 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm shadow-slate-100">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Success</Text>
            <Text className="text-2xl font-black text-blue-600 mt-1">88%</Text>
            <Text className="text-[10px] font-semibold text-emerald-600 mt-1">+4% vs last month</Text>
          </View>
        </View>

        {/* Heatmap Card */}
        <View className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm shadow-slate-100 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-bold text-slate-900">30-Day Activity Grid</Text>
            <View className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              <Text className="text-[10px] font-bold text-emerald-700">Consistent</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2 justify-between">
            {days.map((item) => (
              <View
                key={item.day}
                className={`w-7 h-7 rounded-xl items-center justify-center ${item.intensity}`}
              >
                <Text
                  className={`text-[9px] font-bold ${
                    item.intensity.includes('blue-600') || item.intensity.includes('blue-400')
                      ? 'text-white'
                      : 'text-slate-600'
                  }`}
                >
                  {item.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Focus Distribution */}
        <View className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm shadow-slate-100 mb-6">
          <Text className="text-sm font-bold text-slate-900 mb-4">Category Focus</Text>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-xs font-bold text-slate-700">Health</Text>
              <Text className="text-xs font-bold text-slate-900">42%</Text>
            </View>
            <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <View className="h-full bg-emerald-500 w-[42%]" />
            </View>
          </View>

          <View className="mb-3">
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-xs font-bold text-slate-700">Productivity</Text>
              <Text className="text-xs font-bold text-slate-900">30%</Text>
            </View>
            <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <View className="h-full bg-blue-600 w-[30%]" />
            </View>
          </View>

          <View>
            <View className="flex-row justify-between mb-1.5">
              <Text className="text-xs font-bold text-slate-700">Mindset</Text>
              <Text className="text-xs font-bold text-slate-900">28%</Text>
            </View>
            <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <View className="h-full bg-violet-500 w-[28%]" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}