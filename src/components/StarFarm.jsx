import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useStarFarm } from '../context/StarFarmContext';

const { width, height } = Dimensions.get('window');

export default function StarFarm() {
  const { stars, twinkles, ripple } = useStarFarm();

  return (
    <View style={StyleSheet.absoluteFill}>
      {stars.map(star => {
        const isTwinkling = twinkles.includes(star.id);
        const size = isTwinkling ? 4 : 1.5 + star.intensity;
        return (
          <View
            key={star.id}
            style={{
              position: 'absolute',
              left: star.x * width,
              top: star.y * height,
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: '#FFFFFF',
              opacity: 0.3 + 0.2 * star.intensity,
              shadowColor: '#fff',
              shadowOpacity: isTwinkling ? 0.9 : 0,
              shadowRadius: isTwinkling ? 5 : 0,
            }}
          />
        );
      })}
    </View>
  );
}
