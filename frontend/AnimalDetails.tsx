import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Definiowanie typów dla nawigacji
type RootStackParamList = {
    AnimalList: undefined;
    AnimalDetails: { animalId: string };
    EditAnimal: { animalId: string };
};

type EditAnimalNavigationProp = StackNavigationProp<RootStackParamList, 'EditAnimal'>;

const AnimalDetails = () => {
  const [animal, setAnimal] = useState<any>(null);
  const [error, setError] = useState('');
  const route = useRoute();
  const navigation = useNavigation<EditAnimalNavigationProp>();
  const { animalId } = route.params as { animalId: string };

  const fetchAnimalDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`http://localhost:3000/animals/${animalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnimal(response.data);
    } catch (err: any) {
      setError(err.message || 'Error fetching animal details');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAnimalDetails(); 
    });

    return unsubscribe; 
  }, [navigation]);

  useEffect(() => {
    fetchAnimalDetails(); 
  }, [animalId]);

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.delete(`http://localhost:3000/animals/${animalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Animal deleted successfully');
      navigation.goBack(); // Powrót do listy zwierząt
    } catch (err: any) {
      setError(err.message || 'Error deleting animal');
    }
  };

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!animal) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{animal.name}</Text>
      <Text>Type: {animal.type}</Text>
      <Text>Breed: {animal.breed}</Text>
      <Text>Birth Date: {animal.birthDate}</Text>
      <Text>Diet: {animal.diet}</Text>
      <Text>Chronic Diseases: {animal.chronicDiseases}</Text>
      <Button title="Edit Animal" onPress={() => navigation.navigate('EditAnimal', { animalId })} />
      <Button title="Delete Animal" onPress={handleDelete} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AnimalDetails;