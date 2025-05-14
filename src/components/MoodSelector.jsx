// File: src/components/MoodSelector.jsx
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Pressable } from 'react-native';

const moodOptions = [
  { label: 'Tired', image: require('../../assets/images/moon1.png') },
  { label: 'Low', image: require('../../assets/images/moon2.png') },
  { label: 'Neutral', image: require('../../assets/images/moon3.png') },
  { label: 'High', image: require('../../assets/images/moon4.png') },
  { label: 'Very Energetic', image: require('../../assets/images/moon5.png') },
];

export default function MoodSelector({ onSelect, defaultMood }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Set default selection from `defaultMood` label
  useEffect(() => {
    if (defaultMood) {
      const defaultIndex = moodOptions.findIndex(
        (mood) => mood.label === defaultMood
      );
      if (defaultIndex !== -1) setSelectedIndex(defaultIndex);
    }
  }, [defaultMood]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    if (onSelect) onSelect(moodOptions[index].label);
  };

  return (
    <View style={styles.container}>
      {moodOptions.map((mood, index) => (
        <Pressable key={index} onPress={() => handleSelect(index)}>
          <Image
            source={mood.image}
            style={[
              styles.moon,
              selectedIndex === index && styles.selected,
            ]}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  moon: {
    width: 60,
    height: 60,
    opacity: 0.6,
  },
  selected: {
    opacity: 1,
    transform: [{ scale: 1.2 }],
  },
});
