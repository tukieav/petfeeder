import React from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import MaskInput from 'react-native-mask-input';
import MultiSelect from 'react-native-multiple-select';
import RNPickerSelect from 'react-native-picker-select';

interface AnimalFormProps {
  type: string;
  breed: string;
  name: string;
  birthDate: string;
  diet: string;
  chronicDiseases: string[];
  allergies: string[];
  setFormData: (data: Partial<AnimalFormProps>) => void;
  handleSubmit: () => void;
  message: string;
  error: {
    type?: string;
    breed?: string;
    name?: string;
    birthDate?: string;
    diet?: string;
    chronicDiseases?: string;
    allergies?: string;
    general?: string;
  };
  buttonText: string;
  animalOptions: {
    types: string[];
    breeds: { [key: string]: string[] };
    diets: { [key: string]: string[] };
    chronicDiseases: { [key: string]: string[] };
    allergies: { [key: string]: string[] };
  };
}

export const AnimalFormComponent: React.FC<AnimalFormProps> = ({
  type,
  breed,
  name,
  birthDate,
  diet,
  chronicDiseases,
  allergies,
  setFormData,
  handleSubmit,
  message,
  error,
  buttonText,
  animalOptions,
}) => {
  const handleInputChange = (field: keyof AnimalFormProps, value: any) => {
    setFormData({ [field]: value });
  };

  const filteredBreeds = animalOptions.breeds[type] || [];
  const filteredDiets = animalOptions.diets[type] || [];
  const filteredChronicDiseases = animalOptions.chronicDiseases[type] || [];
  const filteredAllergies = animalOptions.allergies[type] || [];

  return (
    <View style={styles.container}>
      <Text>Type:</Text>
      <RNPickerSelect
        value={type}
        onValueChange={(value) => handleInputChange('type', value)}
        items={animalOptions.types.map((option) => ({ label: option, value: option }))}
      />
      {error?.type && <Text style={styles.errorText}>{error.type}</Text>}

      <Text>Breed:</Text>
      <RNPickerSelect
        value={breed}
        onValueChange={(value) => handleInputChange('breed', value)}
        items={filteredBreeds.map((option) => ({ label: option, value: option }))}
      />
      {error?.breed && <Text style={styles.errorText}>{error.breed}</Text>}

      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(value) => handleInputChange('name', value)}
      />
      {error?.name && <Text style={styles.errorText}>{error.name}</Text>}

      <Text>Birth Date:</Text>
      <MaskInput
        style={styles.input}
        placeholder="Birth Date (YYYY-MM-DD)"
        value={birthDate}
        onChangeText={(masked, unmasked) => handleInputChange('birthDate', unmasked)}
        mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
      />
      {error?.birthDate && <Text style={styles.errorText}>{error.birthDate}</Text>}

      <Text>Diet:</Text>
      <RNPickerSelect
        value={diet}
        onValueChange={(value) => handleInputChange('diet', value)}
        items={filteredDiets.map((option) => ({ label: option, value: option }))}
      />
      {error?.diet && <Text style={styles.errorText}>{error.diet}</Text>}

      <RNPickerSelect
        value={chronicDiseases}
        onValueChange={(value) => handleInputChange('chronicDiseases', value)}
        items={filteredChronicDiseases.map((option) => ({ label: option, value: option }))}
      />
      {error?.chronicDiseases && <Text style={styles.errorText}>{error.chronicDiseases}</Text>}
      
      <Text>Chronic Diseases:</Text>
      <MultiSelect
        items={filteredChronicDiseases.map((option) => ({ id: option, name: option }))}
        uniqueKey="id"
        onSelectedItemsChange={(selectedItems) => handleInputChange('chronicDiseases', selectedItems)}
        selectedItems={chronicDiseases}
        selectText="Select Diseases"
        searchInputPlaceholderText="Search Diseases..."
      />
      {error?.chronicDiseases && <Text style={styles.errorText}>{error.chronicDiseases}</Text>}



      <Text>Allergies:</Text>
      <MultiSelect
        items={filteredAllergies.map((option) => ({ id: option, name: option }))}
        uniqueKey="id"
        onSelectedItemsChange={(selectedItems) => handleInputChange('allergies', selectedItems)}
        selectedItems={allergies}
        selectText="Select Allergies"
        searchInputPlaceholderText="Search Allergies..."
      />
      {error?.allergies && <Text style={styles.errorText}>{error.allergies}</Text>}

      <Button title={buttonText} onPress={handleSubmit} />
      {message && <Text style={styles.successText}>{message}</Text>}
      {error?.general && <Text style={styles.errorText}>{error.general}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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