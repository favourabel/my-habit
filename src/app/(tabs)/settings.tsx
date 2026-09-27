import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { config } from '../../constants/config';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-3 pb-4 bg-white border-b border-slate-100">
        <Text className="text-2xl font-black text-slate-900 tracking-tight">Account & Settings</Text>
        <Text className="text-xs font-medium text-slate-500 mt-0.5">{config.appName} SaaS · v{config.appVersion}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="p-5">
        {/* User Card */}
        <View className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm shadow-slate-100 flex-row items-center mb-6">
          <View className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 items-center justify-center mr-3">
            <Text className="text-base font-black text-blue-600">ST</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-900">SaaS Founder</Text>
            <Text className="text-xs text-slate-500">pro.builder@streakly.app</Text>
          </View>
          <View className="bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            <Text className="text-[10px] font-extrabold text-blue-600 uppercase">PRO PLAN</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Preferences
        </Text>
        <View className="rounded-3xl bg-white border border-slate-200/80 shadow-sm shadow-slate-100 overflow-hidden mb-6">
          {['Appearance & Dark Theme', 'Daily Push Reminders', 'Sound & Haptic Feedback'].map((item, index) => (
            <TouchableOpacity key={item} className={`p-4 flex-row items-center justify-between ${index !== 2 ? 'border-b border-slate-100' : ''}`}>
              <Text className="text-sm font-bold text-slate-800">{item}</Text>
              <Text className="text-slate-300 font-bold">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Data & Export */}
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Data & Privacy
        </Text>
        <View className="rounded-3xl bg-white border border-slate-200/80 shadow-sm shadow-slate-100 overflow-hidden mb-6">
          {['Export Habits (JSON)', 'Export Logs (CSV)', 'Cloud Sync Status'].map((item, index) => (
            <TouchableOpacity key={item} className={`p-4 flex-row items-center justify-between ${index !== 2 ? 'border-b border-slate-100' : ''}`}>
              <Text className="text-sm font-bold text-slate-800">{item}</Text>
              <Text className="text-blue-600 font-bold text-xs">Export</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}