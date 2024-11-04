import React from 'react';
import { NavigationContainer, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './theme';
import StackNavigator from './navigation/StackNavigator';

const CombinedTheme = {
  ...NavigationDefaultTheme,
  ...theme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...theme.colors,
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={CombinedTheme}>
        <StackNavigator />
      </NavigationContainer>
  </PaperProvider>
  );
};

export default App;