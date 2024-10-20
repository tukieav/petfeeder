import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AddAnimal = () => {
  const [type, setType] = useState('');
  const [breed, setBreed] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [diet, setDiet] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleAddAnimal = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post('http://localhost:3000/animals', {
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

      setMessage('Animal added successfully');
      setError('');
      navigation.goBack(); // Powrót do poprzedniego ekranu
    } catch (err: any) {
      setError(err.message || 'Error adding animal');
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Animal</Text>
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
      <Button title="Add Animal" onPress={handleAddAnimal} />
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

export default AddAnimal;