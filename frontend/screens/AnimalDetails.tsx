import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAnimalDetails, deleteAnimal } from '../services/animalService';

type RootStackParamList = {
  AnimalList: undefined;
  AnimalDetails: { animalId: string, updated?: boolean };
  AnimalForm: { animalId: string };
};

type EditAnimalNavigationProp = StackNavigationProp<RootStackParamList, 'AnimalForm'>;

const AnimalDetails = () => {
  const [animal, setAnimal] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation<EditAnimalNavigationProp>();
  const { animalId } = route.params as { animalId: string };

  const fetchAnimalDetails = async () => {
    try {
      const animalData = await getAnimalDetails(animalId);
      setAnimal(animalData);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error fetching animal details');
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAnimalDetails();
    });

    return unsubscribe;
  }, [navigation, animalId]);

  const handleDelete = async () => {
    try {
      const result = await deleteAnimal(animalId);
      Alert.alert('Success', result.message);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Error deleting animal');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!animal) {
    return <Text>No animal data available</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{animal.name}</Text>
      <Text>Type: {animal.type}</Text>
      <Text>Breed: {animal.breed}</Text>
      <Text>Birth Date: {animal.birthDate}</Text>
      <Text>Diet: {animal.diet}</Text>
      <Text>Chronic Diseases: {animal.chronicDiseases}</Text>
      <Button title="Edit Animal" onPress={() => navigation.navigate('AnimalForm', { animalId })} />
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