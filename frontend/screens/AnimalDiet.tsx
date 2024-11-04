import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper'; // Zamiast @mui/material/Button
import { useRoute, useNavigation } from '@react-navigation/native';
import { apiPost } from '../utils/api';

const AnimalDiet = () => {
  const [diet, setDiet] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { animalId } = route.params as { animalId: string };

  const fetchDiet = async () => {
    try {
      const response = await apiPost(`/animals/${animalId}/generate-diet`);
      setDiet(response.data.diet.dietPlan);
    } catch (err: any) {
      setError(err.message || 'Error generating diet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiet();
  }, [animalId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diet Plan for Animal</Text>
      <Text>{diet}</Text>
      <Button mode="contained" onPress={() => navigation.goBack()}>
        Go Back
      </Button>
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

export default AnimalDiet;