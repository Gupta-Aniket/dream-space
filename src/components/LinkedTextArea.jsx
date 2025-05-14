import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Animated } from 'react-native';
import { useStarFarm } from '../context/StarFarmContext';

const LinkedTextArea = ({ placeholder, value, onChangeText, style }) => {
  const { ripple } = useStarFarm();
  const [focus, setFocus] = useState(false);
  const rippleAnimation = new Animated.Value(0);

  const onFocus = () => {
    setFocus(true);
    // ripple animation disabled for now
  };

  const onBlur = () => {
    setFocus(false);
  };

  const rippleStyle = rippleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.rippleEffect,
          { width: rippleStyle, height: rippleStyle },
        ]}
      />
      <TextInput
        style={[
          styles.textArea,
          focus && styles.focused,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.3)"
        onFocus={onFocus}
        onBlur={onBlur}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 20,
  },
  rippleEffect: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: 'white',
    zIndex: 1,
    minHeight: 120,
  },
  focused: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
});

export default LinkedTextArea;
