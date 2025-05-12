// src/context/StarFarmContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const StarFarmContext = createContext();

export const useStarFarm = () => useContext(StarFarmContext);

export const StarFarmProvider = ({ children }) => {
  const STAR_COUNT = 100;
  const starsRef = useRef(generateStars(STAR_COUNT)); // constant positions
  const [twinkles, setTwinkles] = useState([]); // array of star ids
  const [ripple, setRipple] = useState(null); // { timestamp }

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

  const triggerRipple = () => {
    setRipple({ timestamp: Date.now() });
    triggerTwinkle(5); // Twinkle during ripple as well
  };

  const value = {
    stars: starsRef.current,
    twinkles,
    ripple,
    triggerRipple,
    triggerTwinkle,
  };

  return (
    <StarFarmContext.Provider value={value}>
      {children}
    </StarFarmContext.Provider>
  );
};
