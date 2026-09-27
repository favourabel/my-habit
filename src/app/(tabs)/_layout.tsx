import { Tabs } from 'expo-router';
import { Text, View, Platform } from 'react-native';

function TabIcon({
  label,
  focused,
  glyph,
}: {
  label: string;
  focused: boolean;
  glyph: string;
}) {
  return (
    <View className="items-center justify-center pt-1 min-w-[64px]">
      <Text className={`text-lg transition-all ${focused ? 'scale-110 opacity-100' : 'opacity-40'}`}>
        {glyph}
      </Text>
      <Text
        className={`text-[10px] mt-1 font-bold tracking-tight ${
          focused ? 'text-blue-600' : 'text-slate-400'
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <View className="flex-1 bg-slate-100 justify-center items-center">
      {/* Mobile Screen Container Frame for Web — Light Neutral Theme */}
      <View className="w-full max-w-md h-full bg-slate-50 border-x border-slate-200/80 shadow-sm overflow-hidden">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopColor: '#F1F5F9',
              borderTopWidth: 1,
              height: Platform.OS === 'web' ? 65 : 70,
              paddingBottom: Platform.OS === 'web' ? 10 : 20,
              elevation: 0,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Today',
              tabBarIcon: ({ focused }) => (
                <TabIcon label="Today" glyph="⚡" focused={focused} />
              ),
            }}
          />
          <Tabs.Screen
            name="habits"
            options={{
              title: 'Habits',
              tabBarIcon: ({ focused }) => (
                <TabIcon label="Habits" glyph="🎯" focused={focused} />
              ),
            }}
          />
          <Tabs.Screen
            name="analytics"
            options={{
              title: 'Analytics',
              tabBarIcon: ({ focused }) => (
                <TabIcon label="Analytics" glyph="📈" focused={focused} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ focused }) => (
                <TabIcon label="Settings" glyph="⚙️" focused={focused} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}