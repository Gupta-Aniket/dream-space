// src/components/StarFarm.jsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { useStarFarm } from '../context/StarFarmContext';

const { width, height } = Dimensions.get('window');

export default function StarFarm() {
  const { stars, twinkles, ripple, transitionKey } = useStarFarm();
  const animatedStars = useRef(
    stars.map(() => new Animated.Value(0))
  ).current;

  const animatedPositions = useRef(
    stars.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    animatedStars.forEach((opacityAnim, index) => {
      const delay = Math.random() * 3000;
      const duration = 7000 + Math.random() * 2000;

      const loopTwinkle = () => {
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.6, // * adjust the opacity
            duration,
            delay,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration,
            useNativeDriver: false,
          }),
        ]).start(loopTwinkle);
      };

      loopTwinkle();
    });
  }, []);

  useEffect(() => {
    if (transitionKey) {
      animatedPositions.forEach(({ x, y }) => {
        Animated.parallel([
          Animated.timing(x, {
            toValue: (Math.random() - 0.5) * 20,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(y, {
            toValue: (Math.random() - 0.5) * 20,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Animated.parallel([
            Animated.timing(x, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(y, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]).start();
        });
      });
    }
  }, [transitionKey]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((star, index) => {
        const isTwinkling = twinkles.includes(star.id);
        const size = isTwinkling ? 3.5 : 1 + star.intensity;
        const opacityAnim = animatedStars[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.2, 0.6 + star.intensity * 0.1],
        });

        return (
          <Animated.View
            key={star.id}
            style={{
              position: 'absolute',
              left: star.x * width,
              top: star.y * height,
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: '#FFFFFF',
              opacity: isTwinkling ? 1 : undefined,
              transform: [
                { translateX: animatedPositions[index].x },
                { translateY: animatedPositions[index].y },
              ],
              ...(!isTwinkling && { opacity: opacityAnim }),
            }}
          />
        );
      })}
    </View>
  );
}
