import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AnimalFormComponent } from '../components/AnimalFormComponent';
import { getAnimalDetails, saveAnimal } from '../services/animalService';

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
  const route = useRoute<RouteProp<{ params: AnimalFormRouteParams }, 'params'>>();
  const navigation = useNavigation();
  const { animalId } = route.params || {};

  useEffect(() => {
    if (animalId) {
      getAnimalDetails(animalId)
        .then((animal : any) => setFormData(animal))
        .catch((err : any) => setError(err.message || 'Error fetching animal details'));
    }
  }, [animalId]);

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const handleSubmit = async () => {
    try {
      const result = await saveAnimal(formData, animalId);
      setMessage(result.message);
      navigation.goBack();
    } catch (err : any) {
      setError(err.message || 'Error saving animal');
    }
  };

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