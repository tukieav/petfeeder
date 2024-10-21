import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return { Authorization: `Bearer ${token}` };
};

export const getAnimalDetails = async (animalId: string): Promise<Animal> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<ApiResponse<Animal>> = await axios.get(`http://localhost:3000/animals/${animalId}`, {
      headers,
    });
    console.log('Response from server:', response.data);
    return response.data.data;
  } catch (error : any) {
    throw new Error(`Error fetching animal details: ${error.message}`);
  }
};

export const saveAnimal = async (data: Partial<Animal>, animalId?: string): Promise<{ success: boolean; message: string }> => {
  try {
    const headers = await getAuthHeaders();
    const formattedBirthDate = format(new Date(data.birthDate || ''), 'yyyy-MM-dd');
    const url = animalId ? `http://localhost:3000/animals/${animalId}` : 'http://localhost:3000/animals';
    const method = animalId ? 'put' : 'post';

    const response: AxiosResponse<ApiResponse<Animal>> = await axios({
      method,
      url,
      data: { ...data, birthDate: formattedBirthDate },
      headers,
    });

    return { success: true, message: animalId ? 'Animal updated successfully' : 'Animal added successfully' };
  } catch (error : any) {
    throw new Error(`Error saving animal: ${error.message}`);
  }
};

export const getAnimals = async (): Promise<Animal[]> => {
  try {
    const headers = await getAuthHeaders();
    const response: AxiosResponse<ApiResponse<Animal[]>> = await axios.get('http://localhost:3000/animals', {
      headers,
    });
    return response.data.data;
  } catch (error : any) {
    throw new Error(`Error fetching animals: ${error.message}`);
  }
};

export const deleteAnimal = async (animalId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const headers = await getAuthHeaders();
    await axios.delete(`http://localhost:3000/animals/${animalId}`, {
      headers,
    });
    return { success: true, message: 'Animal deleted successfully' };
  } catch (error: any) {
    throw new Error(`Error deleting animal: ${error.message}`);
  }
};