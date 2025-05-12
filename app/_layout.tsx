import { Slot } from 'expo-router';
import { StarFarmProvider } from '../src/context/StarFarmContext';

export default function RootLayout() {
  return (
    <StarFarmProvider>
      <Slot />
    </StarFarmProvider>
  );
}
