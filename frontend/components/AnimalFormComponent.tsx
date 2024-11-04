import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button, Checkbox, Menu } from 'react-native-paper';

interface AnimalFormComponentProps {
  type: string;
  breed: string;
  name: string;
  birthDate: string;
  diet: string;
  chronicDiseases: string[];
  allergies: string[];
  setFormData: (data: Partial<AnimalFormComponentProps>) => void;
  handleSubmit: () => void;
  message: string;
  error: Record<string, string>;
  buttonText: string;
  animalOptions: {
    types: string[];
    breeds: string[];
    diets: string[];
    chronicDiseases: string[];
    allergies: string[];
  };
}

const AnimalFormComponent: React.FC<AnimalFormComponentProps> = ({
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
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showBreedMenu, setShowBreedMenu] = useState(false);
  const [showDietMenu, setShowDietMenu] = useState(false);
  const [isDiseasesExpanded, setIsDiseasesExpanded] = useState(false);
  const [isAllergiesExpanded, setIsAllergiesExpanded] = useState(false);

  const toggleItem = (list: string[], item: string, key: keyof AnimalFormComponentProps) => {
    const updatedList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    setFormData({ [key]: updatedList });
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={showTypeMenu}
        onDismiss={() => setShowTypeMenu(false)}
        anchor={<TextInput label="Type" value={type} mode="outlined" onFocus={() => setShowTypeMenu(true)} style={styles.input} />}>
        {animalOptions.types.map((option) => (
          <Menu.Item key={option} onPress={() => { setFormData({ type: option }); setShowTypeMenu(false); }} title={option} />
        ))}
      </Menu>

      <Menu
        visible={showBreedMenu}
        onDismiss={() => setShowBreedMenu(false)}
        anchor={<TextInput label="Breed" value={breed} mode="outlined" onFocus={() => setShowBreedMenu(true)} style={styles.input} />}>
        {animalOptions.breeds.map((option) => (
          <Menu.Item key={option} onPress={() => { setFormData({ breed: option }); setShowBreedMenu(false); }} title={option} />
        ))}
      </Menu>

      <TextInput label="Name" value={name} onChangeText={(value) => setFormData({ name: value })} mode="outlined" style={styles.input} error={!!error.name} />

      <TextInput label="Birth Date" value={birthDate} onChangeText={(value) => setFormData({ birthDate: value })} mode="outlined" style={styles.input} error={!!error.birthDate} placeholder="YYYY-MM-DD" />

      <Menu
        visible={showDietMenu}
        onDismiss={() => setShowDietMenu(false)}
        anchor={<TextInput label="Diet" value={diet} mode="outlined" onFocus={() => setShowDietMenu(true)} style={styles.input} />}>
        {animalOptions.diets.map((option) => (
          <Menu.Item key={option} onPress={() => { setFormData({ diet: option }); setShowDietMenu(false); }} title={option} />
        ))}
      </Menu>

      <TouchableOpacity onPress={() => setIsDiseasesExpanded(!isDiseasesExpanded)}>
        <Text style={styles.sectionTitle}>
          Chronic Diseases {isDiseasesExpanded ? '▼' : '►'}
        </Text>
      </TouchableOpacity>
      {isDiseasesExpanded && animalOptions.chronicDiseases.map((disease) => (
        <View key={disease} style={styles.checkboxContainer}>
          <Checkbox status={chronicDiseases.includes(disease) ? 'checked' : 'unchecked'} onPress={() => toggleItem(chronicDiseases, disease, 'chronicDiseases')} />
          <Text>{disease}</Text>
        </View>
      ))}

      <TouchableOpacity onPress={() => setIsAllergiesExpanded(!isAllergiesExpanded)}>
        <Text style={styles.sectionTitle}>
          Allergies {isAllergiesExpanded ? '▼' : '►'}
        </Text>
      </TouchableOpacity>
      {isAllergiesExpanded && animalOptions.allergies.map((allergy) => (
        <View key={allergy} style={styles.checkboxContainer}>
          <Checkbox status={allergies.includes(allergy) ? 'checked' : 'unchecked'} onPress={() => toggleItem(allergies, allergy, 'allergies')} />
          <Text>{allergy}</Text>
        </View>
      ))}

      {message ? <Text style={styles.successMessage}>{message}</Text> : null}
      {error.general ? <Text style={styles.errorMessage}>{error.general}</Text> : null}

      <Button mode="contained" onPress={handleSubmit} style={styles.button}>{buttonText}</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  successMessage: {
    color: 'green',
    marginVertical: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginVertical: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  },
});

export default AnimalFormComponent;