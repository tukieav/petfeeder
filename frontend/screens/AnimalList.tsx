import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAnimals } from '../services/animalService';
import { logout } from '../services/authService';
import { RootStackParamList } from '../navigation/StackNavigator';

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
          <TouchableOpacity onPress={() => {
            navigation.navigate('AnimalDetails', { animalId: item._id });
          }}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Animal" onPress={() => navigation.navigate('AnimalForm' as never)} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default AnimalList;