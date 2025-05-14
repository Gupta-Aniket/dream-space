import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useStarFarm } from '../context/StarFarmContext';

const LinkedButton = ({ title, onPress, style, primary, loading = false }) => {
  const { ripple } = useStarFarm();
  const rippleAnimation = new Animated.Value(0);

  // Trigger ripple effect on press in
  const handlePressIn = () => {
    if (ripple) {
      Animated.timing(rippleAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  // Reset ripple effect on press out
  const handlePressOut = () => {
    Animated.timing(rippleAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const rippleStyle = rippleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60],
  });

  return (
    <View style={[styles.buttonContainer, style]}>
      <Animated.View
        style={[
          styles.rippleEffect,
          { width: rippleStyle, height: rippleStyle },
        ]}
      />
      <TouchableOpacity
        style={[styles.button, primary && styles.primaryButton]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading} // Disable while loading
        activeOpacity={loading ? 1 : 0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={[styles.buttonText, primary && styles.primaryText]}>
                 {title}     
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'relative',
  },
  rippleEffect: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButton: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryText: {
    color: 'white',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default LinkedButton;

