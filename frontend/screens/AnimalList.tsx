import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAnimals } from '../services/animalService';
import { logout } from '../services/authService';
import { RootStackParamList } from '../navigation/StackNavigator';
import { Button, Card, IconButton } from 'react-native-paper';

type AnimalListNavigationProp = StackNavigationProp<RootStackParamList, 'AnimalForm'>;

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const navigation = useNavigation<AnimalListNavigationProp>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchAnimals);
    return unsubscribe;
  }, [navigation]);

  const fetchAnimals = async () => {
    try {
      const data: any = await getAnimals();
      setAnimals(data);
    } catch (error: any) {
      console.error('Error fetching animals:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Logged out', 'You have been logged out successfully');
      navigation.navigate('Auth' as never);
    } catch (error: any) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={animals}
        keyExtractor={(item: any) => item._id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('AnimalDetails', { animalId: item._id })}>
            <Card.Content>
              <Text style={styles.animalName}>{item.name}</Text>
            </Card.Content>
          </Card>
        )}
      />
      <Button mode="contained" onPress={() => navigation.navigate('AnimalForm' as never)} style={styles.button}>
        Add Animal
      </Button>
      <Button mode="outlined" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F6F6F6',
  },
  card: {
    marginVertical: 8,
    borderRadius: 12,
  },
  animalName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
  },
});

export default AnimalList;