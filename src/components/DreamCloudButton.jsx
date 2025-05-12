// src/components/DreamCloudButton.jsx
import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Animated, View } from 'react-native';

export default function DreamCloudButton({ 
  title, 
  onPress, 
  style = {},
  colors = ['#9C27B0', '#673AB7', '#3F51B5'] 
}) {
  const scale = new Animated.Value(1);
  const [sparkles, setSparkles] = useState([]);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
    createSparkles();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const createSparkles = () => {
    const newSparkles = Array.from({ length: 5 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: new Animated.Value(1),
      scale: new Animated.Value(0.5),
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    setSparkles(newSparkles);

    newSparkles.forEach((sparkle) => {
      Animated.parallel([
        Animated.timing(sparkle.opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkle.scale, {
          toValue: 2,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSparkles([]);
      });
    });
  };

  return (
    <View style={styles.container}>
      {sparkles.map((sparkle, index) => (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: sparkle.color,
            left: sparkle.x,
            top: sparkle.y,
            opacity: sparkle.opacity,
            transform: [{ scale: sparkle.scale }],
          }}
        />
      ))}
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        <TouchableOpacity
          style={[styles.button, { 
            backgroundColor: colors[0],
            shadowColor: colors[1]
          }]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
        >
          <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  button: {
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
