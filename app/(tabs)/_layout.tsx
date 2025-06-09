import React from 'react';
import { Platform } from 'react-native';

import { CustomTabs } from '@/components/CustomTabs';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const tabList = [
    {
      name: 'index',
      options: {
        title: 'Home',
        tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="house.fill" color={color} />,
      },
    },
    {
      name: 'explore',
      options: {
        title: 'Explore',
        tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
      },
    },
  ];

  return (
    <CustomTabs
      tabList={tabList}
      screenOptions={{
        tabBarActiveTintColor: Colors['light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: { height: 55 },
        }),
      }}
    />
  );
}
