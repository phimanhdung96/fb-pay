import { Tabs } from 'expo-router';
import React from 'react';

interface TabItem {
  name: string;
  options?: any;
}

interface CustomTabsProps {
  tabList: TabItem[];
  [key: string]: any;
}

export function CustomTabs({ tabList, ...tabsProps }: CustomTabsProps) {
  return (
    <Tabs {...tabsProps}>
      {tabList.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={tab.options}
        />
      ))}
    </Tabs>
  );
} 