// src/components/DreamDropletInput.jsx
import React, { useState, useRef } from 'react';
import { TextInput, View, StyleSheet, Animated, Easing } from 'react-native';

export default function DreamDropletInput({ 
  value, 
  onChangeText, 
  placeholder,
  colors = ['#9C27B0', '#673AB7', '#3F51B5'] 
}) {
  const [splash] = useState(new Animated.Value(0));
  const [droplets, setDroplets] = useState([]);
  const inputRef = useRef(null);

  const handleTyping = (text) => {
    // Create droplet animation
    const newDroplet = {
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      scale: new Animated.Value(0),
      opacity: new Animated.Value(1)
    };

    setDroplets(prev => [...prev, newDroplet]);

    // Animate droplet
    Animated.parallel([
      Animated.timing(newDroplet.scale, {
        toValue: 1,
        duration: 500,
        easing: Easing.elastic(1),
        useNativeDriver: true
      }),
      Animated.timing(newDroplet.opacity, {
        toValue: 0,
        duration: 1000,
        delay: 500,
        useNativeDriver: true
      })
    ]).start(() => {
      setDroplets(prev => prev.filter(d => d !== newDroplet));
    });

    // Original splash animation
    Animated.sequence([
      Animated.timing(splash, { toValue: 1, duration: 150, useNativeDriver: false }),
      Animated.timing(splash, { toValue: 0, duration: 150, useNativeDriver: false }),
    ]).start();

    onChangeText(text);
  };

  const dropletSize = splash.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  return (
    <View style={styles.container}>
      {droplets.map((droplet, index) => (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            width: 15,
            height: 15,
            borderRadius: 7.5,
            backgroundColor: droplet.color,
            left: droplet.x,
            top: droplet.y,
            opacity: droplet.opacity,
            transform: [{ scale: droplet.scale }],
          }}
        />
      ))}
      <TextInput
        ref={inputRef}
        style={[styles.input, { 
          borderColor: colors[1],
          backgroundColor: `${colors[2]}20` // Subtle background with alpha
        }]}
        value={value}
        onChangeText={handleTyping}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
      <Animated.View
        style={[
          styles.droplet,
          {
            width: dropletSize,
            height: dropletSize,
            opacity: splash,
            backgroundColor: colors[0],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
  },
  droplet: {
    borderRadius: 50,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});