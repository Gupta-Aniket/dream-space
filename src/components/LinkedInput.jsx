import React, { useState } from 'react';
import { TextInput, View, Animated, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useStarFarm } from '../context/StarFarmContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * A highly modular input component with various configuration options
 * 
 * @param {Object} props - Component properties
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {string} props.value - Current value of the input
 * @param {Function} props.onChangeText - Function to call when text changes
 * @param {string} props.inputType - Type of input: "text", "email", "phone", "password", "number", etc.
 * @param {Object} props.style - Additional styles for the container
 * @param {Object} props.inputStyle - Additional styles for the input element
 * @param {boolean} props.isPrimary - Whether this is a primary input (different styling)
 * @param {boolean} props.isError - Whether this input has an error
 * @param {string} props.errorMessage - Error message to display
 * @param {string} props.label - Label text to display above the input
 * @param {boolean} props.showRipple - Whether to show the ripple effect on focus
 * @param {Object} props.rippleConfig - Configuration for ripple animation
 * @param {Object} props.iconConfig - Configuration for any icons
 * @param {boolean} props.autoCapitalize - Whether to auto-capitalize input
 * @param {Object} props.maskConfig - Configuration for text masking
 */
const LinkedInput = ({
  // Basic props
  placeholder = '',
  value = '',
  onChangeText = () => {},
  inputType = 'text',
  
  // Styling props
  style = {},
  inputStyle = {},
  isPrimary = false,
  isError = false,
  errorMessage = '',
  label = '',
  
  // Animation props
  showRipple = true,
  rippleConfig = {
    size: 40,
    color: 'rgba(255, 255, 255, 0.3)',
    duration: 300,
  },
  
  // Icon configuration
  iconConfig = {
    show: true,
    position: 'right',
    size: 24,
    color: 'white',
    passwordToggleIcons: {
      visible: 'eye',
      hidden: 'eye-off',
    },
    custom: null, // Custom icon component
  },
  
  // Input behavior
  autoCapitalize = 'none',
  
  // Text masking
  maskConfig = {
    enabled: false,
    maskChar: '•', 
    showLastChars: 0,
  },
  
  // Additional props to pass directly to TextInput
  ...restProps
}) => {
  const { ripple } = useStarFarm();
  const [focus, setFocus] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(inputType !== 'password');
  const rippleAnimation = new Animated.Value(0);
  
  // Handle focus event
  const onFocus = () => {
    setFocus(true);
    if (showRipple) {
      Animated.timing(rippleAnimation, {
        toValue: 1,
        duration: rippleConfig.duration,
        useNativeDriver: false,
      }).start();
    }
  };

  // Handle blur event
  const onBlur = () => {
    setFocus(false);
    if (showRipple) {
      Animated.timing(rippleAnimation, {
        toValue: 0,
        duration: rippleConfig.duration,
        useNativeDriver: false,
      }).start();
    }
  };

  // Ripple effect styling
  const rippleStyle = rippleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, rippleConfig.size],
  });

  // Toggle content visibility (for password/sensitive fields)
  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  // Determine if content should be obscured
  const secureTextEntry = (inputType === 'password' && !isContentVisible) || 
                         (maskConfig.enabled && !isContentVisible);

  // Determine keyboard type based on input type
  const getKeyboardType = () => {
    switch (inputType) {
      case 'email': return 'email-address';
      case 'phone': return 'phone-pad';
      case 'number': return 'numeric';
      case 'decimal': return 'decimal-pad';
      default: return 'default';
    }
  };

  // Determine if we should show a toggle icon
  const shouldShowToggleIcon = inputType === 'password' || maskConfig.enabled;
  
  // Get the icon to display based on content visibility
  const getToggleIcon = () => {
    return isContentVisible 
      ? iconConfig.passwordToggleIcons.visible 
      : iconConfig.passwordToggleIcons.hidden;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Label if provided */}
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        focus && styles.inputContainerFocused,
        isPrimary && styles.primaryInputContainer,
        isError && styles.errorInputContainer,
      ]}>
        {/* Ripple animation */}
        {showRipple && (
          <Animated.View
            style={[
              styles.rippleEffect,
              { 
                width: rippleStyle, 
                height: rippleStyle,
                backgroundColor: rippleConfig.color,
              },
            ]}
          />
        )}
        
        {/* Left icon if configured */}
        {iconConfig.show && iconConfig.position === 'left' && iconConfig.custom && (
          <View style={styles.leftIcon}>
            {iconConfig.custom}
          </View>
        )}
        
        {/* Input field */}
        <TextInput
          style={[
            styles.input,
            focus && styles.inputFocused,
            isPrimary && styles.primaryInput,
            isError && styles.errorInput,
            iconConfig.show && iconConfig.position === 'left' && { paddingLeft: 40 },
            iconConfig.show && iconConfig.position === 'right' && shouldShowToggleIcon && { paddingRight: 40 },
            inputStyle,
          ]}
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={getKeyboardType()}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          autoCapitalize={autoCapitalize}
          {...restProps}
        />
        
        {/* Toggle icon for password/masked fields */}
        {iconConfig.show && shouldShowToggleIcon && (
          <TouchableOpacity 
            style={[
              styles.icon,
              iconConfig.position === 'right' ? styles.rightIcon : styles.leftIcon
            ]} 
            onPress={toggleContentVisibility}
          >
            <Ionicons 
              name={getToggleIcon()} 
              size={iconConfig.size} 
              color={iconConfig.color} 
            />
          </TouchableOpacity>
        )}
        
        {/* Custom right icon if provided */}
        {iconConfig.show && iconConfig.position === 'right' && iconConfig.custom && !shouldShowToggleIcon && (
          <View style={styles.rightIcon}>
            {iconConfig.custom}
          </View>
        )}
      </View>
      
      {/* Error message if provided and there's an error */}
      {isError && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginBottom: 8,
    fontSize: 14,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  primaryInputContainer: {
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  errorInputContainer: {
    borderColor: 'rgba(255, 0, 0, 0.6)',
  },
  rippleEffect: {
    position: 'absolute',
    borderRadius: 50,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  input: {
    padding: 12,
    fontSize: 16,
    color: 'white',
    zIndex: 1,
    width: '100%',
  },
  inputFocused: {
    // Additional styles for focused input
  },
  primaryInput: {
    // Additional styles for primary input
  },
  errorInput: {
    // Additional styles for input with errors
  },
  icon: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 2,
  },
  leftIcon: {
    left: 10,
  },
  rightIcon: {
    right: 10,
  },
  errorText: {
    color: 'rgba(255, 0, 0, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
});

export default LinkedInput;