import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';
import { format } from 'date-fns';

interface Animal {
  _id: string;
  type: string;
  breed: string;
  name: string;
  birthDate: string;
  diet: string;
  chronicDiseases: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const getAnimalDetails = async (animalId: string): Promise<Animal> => {
    try {
      const response = await apiGet(`/animals/${animalId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Error fetching animal details: ${error.message}`);
    }
  };

  export const saveAnimal = async (data: Partial<Animal>, animalId?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const formattedBirthDate = format(new Date(data.birthDate || ''), 'yyyy-MM-dd');
      const url = animalId ? `/animals/${animalId}` : '/animals';
      const method = animalId ? apiPut : apiPost;
  
      const response = await method(url, { ...data, birthDate: formattedBirthDate });
      console.log('Saving animal data:', data); // Dodaj logowanie danych
      return { success: true, message: animalId ? 'Animal updated successfully' : 'Animal added successfully' };
    } catch (error: any) {
      throw new Error(`Error saving animal: ${error.message}`);
    }
  };

export const getAnimals = async (): Promise<Animal[]> => {
  try {
    const response = await apiGet('/animals');
    return response.data.data;
  } catch (error: any) {
    throw new Error(`Error fetching animals: ${error.message}`);
  }
};

export const deleteAnimal = async (animalId: string): Promise<{ success: boolean; message: string }> => {
  try {
    await apiDelete(`/animals/${animalId}`);
    return { success: true, message: 'Animal deleted successfully' };
  } catch (error: any) {
    throw new Error(`Error deleting animal: ${error.message}`);
  }
};