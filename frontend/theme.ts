import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6750A4',
    accent: '#03DAC6',
    background: '#F6F6F6',
    surface: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSurface: '#1C1B1F',
    error: '#B3261E',
    onError: '#FFFFFF',
  },
  roundness: 12,
  fonts: {
    ...DefaultTheme.fonts, // Ensure compatibility with MD3Typescale
  },
  animation: {
    scale: 1.0,
  },
};