import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from '../screens/Auth';
import AnimalList from '../screens/AnimalList';
import AnimalForm from '../screens/AnimalForm';
import AnimalDetails from '../screens/AnimalDetails';
import AnimalDiet from '../screens/AnimalDiet';


type RootStackParamList = {
  Auth: undefined;
  AnimalList: undefined;
  AnimalForm: { animalId?: string };
  AnimalDetails: { animalId: string; updated?: boolean };
  AnimalDiet: undefined;
};

export type { RootStackParamList };

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => (
  <Stack.Navigator initialRouteName="Auth">
    <Stack.Screen name="Auth" component={Auth} />
    <Stack.Screen name="AnimalList" component={AnimalList} />
    <Stack.Screen name="AnimalForm" component={AnimalForm} />
    <Stack.Screen name="AnimalDetails" component={AnimalDetails} />
    <Stack.Screen name="AnimalDiet" component={AnimalDiet} />
  </Stack.Navigator>
);

export default StackNavigator;