import { apiPost } from '../utils/api'; // Import funkcji z api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token: string) => {
  await AsyncStorage.setItem('token', token);
};

export const getToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return token;
};

export const handleAuthRequest = async (isRegister: boolean, credentials: { username: string; password: string }) => {
  const endpoint = isRegister ? '/auth/register' : '/auth/login';
  const response = await apiPost(endpoint, credentials); 
  await storeToken(response.data.token);
};

export const logout = async () => {
  try {
    const response = await apiPost('/auth/logout', {}); 
    console.log('Logout response:', response.data);

    await AsyncStorage.removeItem('token');
    const tokenAfterLogout = await AsyncStorage.getItem('token');
    console.log('Token after logout:', tokenAfterLogout);
    } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Logout failed');
    }
    };