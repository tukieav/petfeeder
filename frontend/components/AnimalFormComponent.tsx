import React from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';

interface AnimalFormProps {
  type: string;
  breed: string;
  name: string;
  birthDate: string;
  diet: string;
  chronicDiseases: string;
  setFormData: (data: Partial<AnimalFormProps>) => void;
  handleSubmit: () => void;
  message: string;
  error: any;
  buttonText: string;
}

export const AnimalFormComponent: React.FC<AnimalFormProps> = ({
    type, breed, name, birthDate, diet, chronicDiseases, setFormData, handleSubmit, message, error, buttonText
  }) => {
    const handleInputChange = (field: keyof AnimalFormProps, value: string) => {
      setFormData({ [field]: value });
    };

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Type"
          value={type}
          onChangeText={(value) => handleInputChange('type', value)}
        />
        {typeof error?.type === 'string' && <Text style={styles.errorText}>{error.type}</Text>}
        
        <TextInput
          style={styles.input}
          placeholder="Breed"
          value={breed}
          onChangeText={(value) => handleInputChange('breed', value)}
        />
        {typeof error?.breed === 'string' && <Text style={styles.errorText}>{error.breed}</Text>}
        
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(value) => handleInputChange('name', value)}
        />
        {typeof error?.name === 'string' && <Text style={styles.errorText}>{error.name}</Text>}
        
        <TextInput
          style={styles.input}
          placeholder="Birth Date (YYYY-MM-DD)"
          value={birthDate}
          onChangeText={(value) => handleInputChange('birthDate', value)}
        />
        {typeof error?.birthDate === 'string' && <Text style={styles.errorText}>{error.birthDate}</Text>}
        
        <TextInput
          style={styles.input}
          placeholder="Diet"
          value={diet}
          onChangeText={(value) => handleInputChange('diet', value)}
        />
        {typeof error?.diet === 'string' && <Text style={styles.errorText}>{error.diet}</Text>}
        
        <TextInput
          style={styles.input}
          placeholder="Chronic Diseases"
          value={chronicDiseases}
          onChangeText={(value) => handleInputChange('chronicDiseases', value)}
        />
        {typeof error?.chronicDiseases === 'string' && <Text style={styles.errorText}>{error.chronicDiseases}</Text>}
        
        <Button title={buttonText} onPress={handleSubmit} />
        {typeof message === 'string' && <Text style={styles.successText}>{message}</Text>}
        {typeof error?.general === 'string' && <Text style={styles.errorText}>{error.general}</Text>}
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