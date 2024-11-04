import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAnimalDetails, deleteAnimal } from '../services/animalService';
import { apiGet, apiPost } from '../utils/api';

type RootStackParamList = {
  AnimalList: undefined;
  AnimalDetails: { animalId: string; updated?: boolean };
  AnimalForm: { animalId: string };
};

type EditAnimalNavigationProp = StackNavigationProp<RootStackParamList, 'AnimalForm'>;

const AnimalDetails = () => {
  const [animal, setAnimal] = useState<any>(null);
  const [diet, setDiet] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    Morning: false,
    Afternoon: false,
    Evening: false,
  });

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

  const fetchLastDiet = async () => {
    try {
      const response = await apiGet(`/animals/${animalId}/diet`);
      setDiet(response.data.dietPlan);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setDiet('No diet generated yet');
      } else {
        setError(err.message || 'Error fetching diet');
      }
    }
  };

  const handleGenerateDiet = async () => {
    try {
      const csrfResponse = await apiGet('/auth/csrf-token', false);
      const csrfToken = csrfResponse.data.csrfToken;

      const response = await apiPost(`/animals/${animalId}/generate-diet`, {}, true, { 'X-CSRF-Token': csrfToken });
      setDiet(response.data.diet.dietPlan);
      Alert.alert('Success', 'Diet generated successfully');
    } catch (err: any) {
      setError(err.message || 'Error generating diet');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAnimalDetails();
      fetchLastDiet();
    });

    return unsubscribe;
  }, [navigation, animalId]);

  const handleDelete = async () => {
    try {
      const csrfResponse = await apiGet('/auth/csrf-token', false);
      const csrfToken = csrfResponse.data.csrfToken;

      const result = await deleteAnimal(animalId, { 'X-CSRF-Token': csrfToken });
      Alert.alert('Success', result.message);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Error deleting animal');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderDietSection = (title: string, meal: any) => {
    if (!meal) return null;

    return (
      <Card style={styles.mealCard}>
        <TouchableOpacity onPress={() => toggleSection(title)}>
          <Text style={styles.mealTitle}>
            {title} {expandedSections[title] ? '▼' : '►'}
          </Text>
        </TouchableOpacity>
        {expandedSections[title] && (
          <Card.Content>
            <Text>Name of food: {meal.name_of_food}</Text>
            <Text>Calories: {meal.calories}</Text>
            <Text>Protein: {meal.macro.protein}</Text>
            <Text>Fat: {meal.macro.fat}</Text>
            <Text>Fiber: {meal.macro.fiber}</Text>

            <Text style={styles.microTitle}>Micro Ingredients:</Text>
            {meal.micro && Object.keys(meal.micro).length > 0 ? (
              Object.entries(meal.micro).map(([key, value], index) => (
                <Text key={index}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}</Text>
              ))
            ) : (
              <Text>No micro ingredients available</Text>
            )}

            <Text style={styles.stepsTitle}>Steps to prepare:</Text>
            {Array.isArray(meal.steps_to_do) ? (
              meal.steps_to_do.map((step: string, index: number) => (
                <Text key={index} style={styles.step}>{`${index + 1}. ${step}`}</Text>
              ))
            ) : (
              <Text>No steps available</Text>
            )}
          </Card.Content>
        )}
      </Card>
    );
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{animal.name}</Text>
        <Text>Type: {animal.type}</Text>
        <Text>Breed: {animal.breed}</Text>
        <Text>Birth Date: {animal.birthDate}</Text>
        <Text>Chronic Diseases: {Array.isArray(animal.chronicDiseases) ? animal.chronicDiseases.join(', ') : animal.chronicDiseases}</Text>

        <Text style={styles.dietTitle}>Last Generated Diet:</Text>
        {typeof diet === 'object' && diet ? (
          <>
            {renderDietSection('Morning', diet.morning)}
            {renderDietSection('Afternoon', diet.afternoon)}
            {renderDietSection('Evening', diet.evening)}
          </>
        ) : (
          <Text>{diet || 'No diet generated yet'}</Text>
        )}

        <Button mode="contained" onPress={handleGenerateDiet} style={styles.actionButton}>
          Generate Diet
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('AnimalForm', { animalId })} style={styles.actionButton}>
          Edit Animal
        </Button>
        <Button mode="contained" onPress={handleDelete} style={styles.actionButton}>
          Delete Animal
        </Button>
        <Button mode="text" onPress={() => navigation.goBack()} style={styles.goBackButton}>
          Go Back
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dietTitle: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: 'bold',
  },
  mealCard: {
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  microTitle: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  stepsTitle: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  step: {
    paddingLeft: 5,
    marginBottom: 2,
  },
  actionButton: {
    marginTop: 12,
    borderRadius: 8,
  },
  goBackButton: {
    marginTop: 12,
  },
});

export default AnimalDetails;