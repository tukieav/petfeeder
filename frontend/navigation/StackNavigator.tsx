import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from '../screens/Auth';
import AnimalList from '../screens/AnimalList';
import AddAnimal from '../screens/AddAnimal';
import AnimalDetails from '../screens/AnimalDetails';
import EditAnimal from '../screens/EditAnimal';

const Stack = createStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator initialRouteName="Auth">
    <Stack.Screen name="Auth" component={Auth} />
    <Stack.Screen name="AnimalList" component={AnimalList} />
    <Stack.Screen name="AddAnimal" component={AddAnimal} />
    <Stack.Screen name="AnimalDetails" component={AnimalDetails} />
    <Stack.Screen name="EditAnimal" component={EditAnimal} />
  </Stack.Navigator>
);

export default StackNavigator;