import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useStarFarm } from '../context/StarFarmContext';

export default function LinkedButton({ title, onPress, style }) {
  const { triggerRipple } = useStarFarm();

  const handlePress = () => {
    triggerRipple();
    onPress?.();
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    backgroundColor: '#673AB7',
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
