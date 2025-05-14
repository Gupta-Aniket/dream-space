import { Slot } from 'expo-router';
import { StarFarmProvider } from '../src/context/StarFarmContext';
import { StatusBar } from 'expo-status-bar';
import { useEffect,  } from 'react';
import { Appearance, View } from 'react-native';
import StarFarm from '../src/components/StarFarm';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';

export default function RootLayout() {
  useEffect(() => {
    Appearance.setColorScheme('dark');
  }, []);

  return (
    // <ThemeProvider value={DarkTheme}>
    <StarFarmProvider>
      <View style={{ flex: 1 }}>
      <StarFarm/>
      <Slot />
      </View>
    </StarFarmProvider>
// </ThemeProvider>
  );
}
