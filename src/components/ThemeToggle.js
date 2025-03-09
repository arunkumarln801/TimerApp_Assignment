import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../styles/theme';

const ThemeToggle = ({ onToggle }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={onToggle}>
      <Text style={styles.text}>Switch to {theme.name === 'healthfix' ? 'Dark' : theme.name === 'dark' ? 'Light' : 'Healthfix'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { borderRadius: 8, padding: 8 },
  // eslint-disable-next-line react-native/no-color-literals
  text: { color: '#FFF', fontSize: 14 },
});

export default ThemeToggle;