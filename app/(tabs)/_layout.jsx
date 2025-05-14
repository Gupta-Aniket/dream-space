import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

// Screens
import LogScreen from './index';
import ObservatoryScreen from './observatory';
import AnalyticsScreen from './analytics';
import ProfileScreen from './profile';

// Icons (SVGs)
import MoonStarIcon from '../../assets/icons/moon-star.svg';
import TelescopeIcon from '../../assets/icons/telescope.svg';
import ChartPieIcon from '../../assets/icons/chart-pie.svg';
import UserIcon from '../../assets/icons/circle-user-round.svg';

const TABS = [
  { key: 'log', component: LogScreen, icon: MoonStarIcon },
  { key: 'observatory', component: ObservatoryScreen, icon: TelescopeIcon },
  { key: 'analytics', component: AnalyticsScreen, icon: ChartPieIcon },
  { key: 'profile', component: ProfileScreen, icon: UserIcon },
];

export default function CustomTabsLayout() {
  const [activeTab, setActiveTab] = useState('log');

  const renderActiveScreen = () => {
    const active = TABS.find((tab) => tab.key === activeTab);
    const ScreenComponent = active.component;
    return <ScreenComponent />;
  };

  return (
    <View style={styles.container}>
      {/* Main screen placeholder */}
      <View style={styles.screen}>{renderActiveScreen()}</View>

      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map(({ key, icon: Icon }) => {
          const focused = key === activeTab;
          return (
            <TouchableOpacity
              key={key}
              style={styles.tabItem}
              onPress={() => setActiveTab(key)}
              activeOpacity={0.8}
            >
              <Icon
                width={28}
                height={28}
                color={focused ? '#ffffff' : '#888888'}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 30,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
