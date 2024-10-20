import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from './Auth';
import AnimalList from './AnimalList';
import AddAnimal from './AddAnimal';
import AnimalDetails from './AnimalDetails';
import EditAnimal from './EditAnimal';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="AnimalList" component={AnimalList} />
        <Stack.Screen name="AddAnimal" component={AddAnimal} />
        <Stack.Screen name="AnimalDetails" component={AnimalDetails} />
        <Stack.Screen name="EditAnimal" component={EditAnimal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}