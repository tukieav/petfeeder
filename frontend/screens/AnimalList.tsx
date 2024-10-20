import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  AnimalDetails: { animalId: string };
  AddAnimal: undefined;
  EditAnimal: { animalId: string }; 
};

type AnimalDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'AnimalDetails'>;
type AddAnimalNavigationProp = StackNavigationProp<RootStackParamList, 'AddAnimal'>;

interface Animal {
  _id: string;
  name: string;
  type: string;
  breed: string;
}

const AnimalList = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const navigation = useNavigation<AnimalDetailsNavigationProp>();

  // Funkcja do pobierania listy zwierząt
  const fetchAnimals = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      console.log('Token:', token);
  
      const response = await axios.get('http://localhost:3000/animals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched animals:', response.data);
      setAnimals(response.data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Screen focused, fetching animals...');
      fetchAnimals();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
        <FlatList
        data={animals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('AnimalDetails', { animalId: item._id })}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Animal" onPress={() => navigation.navigate('AddAnimal')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default AnimalList;