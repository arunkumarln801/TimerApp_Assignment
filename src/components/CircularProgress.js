import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme';

const CircularProgress = ({ progress, text }) => {
  const { theme } = useTheme();
  const rotate = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(rotate, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const circumference = 2 * Math.PI * (80 / 2 - 10);
  const strokeDashoffset = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.circle}>
      <Animated.View
        style={[
          styles.container,
          { borderColor: theme.accent },
          { borderDashOffset: strokeDashoffset, borderDashArray: circumference },
        ]}
      />
      <Text style={[styles.text, { color: theme.text }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    borderWidth: 10,
    height: 80,
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
    width: 80,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CircularProgress;