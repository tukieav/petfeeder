import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiGet } from '../utils/api';


const EditAnimal = () => {
  const [type, setType] = useState('');
  const [breed, setBreed] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [diet, setDiet] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { animalId } = route.params as { animalId: string };

  useEffect(() => {
    const fetchAnimalDetails = async () => {
      try {
        const response = await apiGet(`/animals/${animalId}`);
        const animal = response.data;
        setType(animal.type);
        setBreed(animal.breed);
        setName(animal.name);
        setBirthDate(animal.birthDate);
        setDiet(animal.diet);
        setChronicDiseases(animal.chronicDiseases);
      } catch (err: any) {
        setError(err.message || 'Error fetching animal details');
      }
    };

    fetchAnimalDetails();
  }, [animalId]);

  const handleEditAnimal = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.put(`http://localhost:3000/animals/${animalId}`, {
        type,
        breed,
        name,
        birthDate,
        diet,
        chronicDiseases,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Animal updated successfully');
      setError('');
      navigation.goBack(); // Powrót do poprzedniego ekranu
    } catch (err: any) {
      setError(err.message || 'Error updating animal');
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Animal</Text>
      <TextInput
        style={styles.input}
        placeholder="Type"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Breed"
        value={breed}
        onChangeText={setBreed}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Birth Date (YYYY-MM-DD)"
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Diet"
        value={diet}
        onChangeText={setDiet}
      />
      <TextInput
        style={styles.input}
        placeholder="Chronic Diseases"
        value={chronicDiseases}
        onChangeText={setChronicDiseases}
      />
      <Button title="Save Changes" onPress={handleEditAnimal} />
      {message ? <Text style={styles.successText}>{message}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  successText: {
    color: 'green',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default EditAnimal;