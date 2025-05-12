// src/context/StarFarmContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const StarFarmContext = createContext();

export const useStarFarm = () => useContext(StarFarmContext);

export const StarFarmProvider = ({ children }) => {
  const [stars, setStars] = useState(generateStars(100)); // 100 stars by default
  const [ripple, setRipple] = useState(null); // { x, y, timestamp }
  const [twinkles, setTwinkles] = useState([]);

  function generateStars(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random(),
      y: Math.random(),
      intensity: Math.floor(Math.random() * 4) + 1, // 1 to 4
    }));
  }

  const triggerRipple = () => {
    setRipple({ timestamp: Date.now() });
  };

  const triggerTwinkle = () => {
    const newTwinkles = Array.from({ length: 3 }, () => Math.floor(Math.random() * stars.length));
    setTwinkles(newTwinkles);
    setTimeout(() => setTwinkles([]), 300); // Reset after 300ms
  };

  return (
    <StarFarmContext.Provider value={{ stars, ripple, twinkles, triggerRipple, triggerTwinkle }}>
      {children}
    </StarFarmContext.Provider>
  );
};
