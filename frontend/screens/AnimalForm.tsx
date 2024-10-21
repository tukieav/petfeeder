import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Import typów nawigacji
import { AnimalFormComponent } from '../components/AnimalFormComponent';
import { getAnimalDetails, saveAnimal } from '../services/animalService';
import { validateAnimalForm } from '../utils/validation';
import { Text } from 'react-native';
import { RootStackParamList } from '../navigation/StackNavigator'; // Import typów z nawigacji

type AnimalFormRouteParams = {
  animalId?: string;
};

const AnimalForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    breed: '',
    name: '',
    birthDate: '',
    diet: '',
    chronicDiseases: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Typowanie nawigacji i trasy
  const route = useRoute<RouteProp<{ params: AnimalFormRouteParams }, 'params'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'AnimalDetails'>>();  
  const { animalId } = route.params || {};

  useEffect(() => {
    if (animalId) {
      getAnimalDetails(animalId)
        .then((animal: any) => {
          console.log('Fetched animal data:', animal);
          setFormData({
            type: animal.type || '',
            breed: animal.breed || '',
            name: animal.name || '',
            birthDate: animal.birthDate || '',
            diet: animal.diet || '',
            chronicDiseases: animal.chronicDiseases || '',
          });
          setLoading(false);
        })
        .catch((err: any) => {
          setError(err.message || 'Error fetching animal details');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [animalId]);

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateAnimalForm(
      formData.type,
      formData.breed,
      formData.name,
      formData.birthDate,
      formData.diet,
      formData.chronicDiseases
    );
  
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors); 
      return; 
    }
  
    try {
      const result = await saveAnimal(formData, animalId);
      setMessage(result.message);
      navigation.navigate('AnimalDetails', { animalId: animalId || '', updated: true }); 
    } catch (err: any) {
      setError(err.message || 'Error saving animal');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <AnimalFormComponent
      {...formData}
      setFormData={handleFormDataChange}
      handleSubmit={handleSubmit}
      message={message}
      error={error}
      buttonText={animalId ? 'Save Changes' : 'Add Animal'}
    />
  );
};

export default AnimalForm;