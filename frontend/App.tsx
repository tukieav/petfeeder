import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
}