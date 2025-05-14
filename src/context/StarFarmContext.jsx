// src/context/StarFarmContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const StarFarmContext = createContext();

export const useStarFarm = () => useContext(StarFarmContext);

export const StarFarmProvider = ({ children }) => {
  const STAR_COUNT = 100;
  const starsRef = useRef(generateStars(STAR_COUNT)); // constant positions
  const [twinkles, setTwinkles] = useState([]); // array of star ids
  const [ripple, setRipple] = useState(null); // { timestamp }
  const [transitionKey, setTransitionKey] = useState(null); // For transition animations

  function generateStars(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random(),
      y: Math.random(),
      intensity: Math.floor(Math.random() * 4) + 1, // 1 to 4
    }));
  }

  const triggerTwinkle = (count = 3) => {
    const ids = [];
    for (let i = 0; i < count; i++) {
      ids.push(Math.floor(Math.random() * starsRef.current.length));
    }
    setTwinkles(ids);
    setTimeout(() => setTwinkles([]), 300);
  };


  const rippleAnimation = useRef(new Animated.Value(0)).current;

const triggerRipple = (x, y) => {
  setRipple({ x, y });

  rippleAnimation.setValue(0);
  Animated.timing(rippleAnimation, {
    toValue: 1,
    duration: 1200, // longer for smooth wave
    useNativeDriver: false,
  }).start(() => {
    setRipple(null); // Reset ripple after completion
  });
};

  const value = {
    stars: starsRef.current,
    twinkles,
    ripple,
    transitionKey,
    triggerRipple,
    triggerTwinkle,
    setTransitionKey,
    rippleAnimation,
  };

  return (
    <StarFarmContext.Provider value={value}>
      {children}
    </StarFarmContext.Provider>
  );
};
