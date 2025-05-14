// src/components/StarFarm.jsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { useStarFarm } from '../context/StarFarmContext';

const { width, height } = Dimensions.get('window');

export default function StarFarm() {
  const { stars, twinkles, ripple, transitionKey, rippleAnimation } = useStarFarm();

  const animatedStars = useRef(
    stars.map(() => ({
      opacity: new Animated.Value(0),
      hue: new Animated.Value(0),
      trail: new Animated.Value(0),
    }))
  ).current;

  const animatedPositions = useRef(
    stars.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    animatedStars.forEach(({ opacity, hue }, index) => {
      const twinkleDelay = Math.random() * 5000;
      const twinkleDuration = 5000 + Math.random() * 3000;
      const pulseDuration = 8000 + Math.random() * 3000;

      const loopTwinkle = () => {
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: twinkleDuration,
            delay: twinkleDelay,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: twinkleDuration,
            useNativeDriver: false,
          }),
        ]).start(loopTwinkle);
      };

      const loopHuePulse = () => {
        Animated.sequence([
          Animated.timing(hue, {
            toValue: 1,
            duration: pulseDuration,
            useNativeDriver: false,
          }),
          Animated.timing(hue, {
            toValue: 0,
            duration: pulseDuration,
            useNativeDriver: false,
          }),
        ]).start(loopHuePulse);
      };

      loopTwinkle();
      loopHuePulse();
    });
  }, []);

  useEffect(() => {
    if (transitionKey) {
      animatedPositions.forEach(({ x, y }, i) => {
        const trail = animatedStars[i].trail;
        Animated.parallel([
          Animated.timing(trail, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
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
            Animated.timing(trail, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }),
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
        const { opacity, hue, trail } = animatedStars[index];
        const { x, y } = animatedPositions[index];
        const baseOpacity = 0.6 + star.intensity * 0.1;
        const isTwinkling = twinkles.includes(star.id);
        const size = isTwinkling ? 3.5 : 1 + star.intensity * 2;

        const rippleEffect = ripple
          ? (() => {
            const { x: rx = width / 2, y: ry = height / 2 } = ripple;
            const distance = Math.sqrt(
              Math.pow(star.x * width - rx, 2) + Math.pow(star.y * height - ry, 2)
            );
            const MAX_RADIUS = Math.sqrt(width * width + height * height);
            return rippleAnimation.interpolate({
              inputRange: [0, MAX_RADIUS],
              outputRange: [baseOpacity, baseOpacity],
            }).interpolate({
              inputRange: [Math.max(distance - 20, 0), distance, Math.min(distance + 20, MAX_RADIUS)],
              outputRange: [baseOpacity, baseOpacity * 0.5, baseOpacity],
              extrapolate: 'clamp',
            });
          })()
          : opacity;

        const hueColor = hue.interpolate({
          inputRange: [0, 1],
          outputRange: ['rgb(255,255,255)', 'rgb(200,180,255)'],
        });

        // Blurred circle effect
        const finalSize = size * 0.4; // Slight scaling for visibility
        const borderRadius = finalSize / 2;

        const trailStyle = {
          shadowColor: hueColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: finalSize * 1.5, // Makes the blur more intense
        };

        return (
          <Animated.View
            key={star.id}
            style={[
              {
                position: 'absolute',
                left: star.x * width,
                top: star.y * height,
                width: finalSize,
                height: finalSize,
                borderRadius,
                backgroundColor: hueColor,
                opacity: rippleEffect,
                transform: [{ translateX: x }, { translateY: y }],
              },
              trailStyle,
            ]}
          />
        );
      })}
    </View>
  );
}
