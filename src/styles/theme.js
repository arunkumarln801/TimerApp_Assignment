import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('healthfix');

  const themes = {
    healthfix: {
      name: 'healthfix',
      background: '#F5F5F5', // Light gray background
      card: '#FFFFFF', // White cards
      text: '#333333', // Dark gray text
      textSecondary: '#666666', // Lighter gray for secondary text
      accent: '#00A699', // Healthfix teal
    },
    dark: {
      name: 'dark',
      background: '#121212', // Dark background
      card: '#1E1E1E', // Darker card background
      text: '#E0E0E0', // Light gray text
      textSecondary: '#B0B0B0', // Medium gray for secondary text
      accent: '#26A69A', // Slightly lighter teal for contrast
    },
    light: {
      name: 'light',
      background: '#FFFFFF', // White background
      card: '#F0F0F0', // Light gray cards
      text: '#000000', // Black text
      textSecondary: '#555555', // Dark gray for secondary text
      accent: '#4CAF50', // Green accent for light theme
    },
  };

  const value = { theme: themes[theme], setTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);