import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AnimalFormComponent } from '../components/AnimalFormComponent';
import { getAnimalDetails, saveAnimal } from '../services/animalService';
import { validateAnimalForm } from '../utils/validation';
import { apiGet } from '../utils/api';
import { Text } from 'react-native';
import { RootStackParamList } from '../navigation/StackNavigator';

type AnimalFormNavigationProp = StackNavigationProp<RootStackParamList, 'AnimalList'>;

interface AnimalFormRouteParams {
  animalId?: string;
}

interface FormData {
  type: string;
  breed: string;
  name: string;
  birthDate: string;
  diet: string;
  chronicDiseases: string[];
  allergies: string[];
}

interface AnimalOptions {
  types: string[];
  breeds: Record<string, string[]>;
  diets: Record<string, string[]>;
  chronicDiseases: Record<string, string[]>;
  allergies: Record<string, string[]>;
}

interface ValidationErrors {
  type?: string;
  breed?: string;
  name?: string;
  birthDate?: string;
  diet?: string;
  chronicDiseases?: string; 
  allergies?: string;       
  general?: string;
}

const AnimalForm = () => {
  const [formData, setFormData] = useState<FormData>({
    type: '',
    breed: '',
    name: '',
    birthDate: '',
    diet: '',
    chronicDiseases: [],
    allergies: [],
  });
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [animalOptions, setAnimalOptions] = useState<AnimalOptions>({
    types: [],
    breeds: {},
    diets: {},
    chronicDiseases: {},
    allergies: {},
  });

  const route = useRoute<RouteProp<{ params: AnimalFormRouteParams }, 'params'>>();
  const navigation = useNavigation<AnimalFormNavigationProp>();
  const { animalId } = route.params || {};

  useEffect(() => {
    const fetchAnimalOptions = async () => {
      try {
        const response = await apiGet('/animals/options');
        setAnimalOptions(response.data);
        console.log('Animal options:', response.data);
      } catch (err) {
        setError((prevError) => ({ ...prevError, general: 'Error fetching animal options' }));
      }
    };

    const fetchAnimalDetails = async () => {
      if (animalId) {
        try {
          const animal : any = await getAnimalDetails(animalId);
          setFormData({
            type: animal.type || '',
            breed: animal.breed || '',
            name: animal.name || '',
            birthDate: animal.birthDate || '',
            diet: animal.diet || '',
            chronicDiseases: animal.chronicDiseases || [''],
            allergies: animal.allergies || [''],
          });
        } catch (err : any) {
          setError((prevError) => ({ ...prevError, general: err.message || 'Error fetching animal details' }));
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchAnimalOptions();
    fetchAnimalDetails();
  }, [animalId]);

  const handleFormDataChange = (data: Partial<FormData>) => {
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
      formData.chronicDiseases,
      formData.allergies
    );
 
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const result = await saveAnimal(formData, animalId);
      setMessage(result.message);
      navigation.navigate('AnimalList');
    } catch (err: any) {
      if (err.message.includes('CSRF')) {
        setError((prevError) => ({ ...prevError, general: 'CSRF token validation failed. Please refresh the page and try again.' }));
      } else {
        setError((prevError) => ({ ...prevError, general: err.message || 'Error saving animal' }));
      }
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
      buttonText={animalId ? 'Save Changes' : 'Save Animal'}
      animalOptions={animalOptions}
    />
  );
};

export default AnimalForm;