import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

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
  const response = await axios.post(`${API_BASE_URL}${endpoint}`, credentials);
  await storeToken(response.data.token);
};

export const logout = async () => {
    try {
      const token = await getToken();
      console.log('Token during logout:', token);
  
      const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Logout response:', response.data);
  
      await AsyncStorage.removeItem('token');
      const tokenAfterLogout = await AsyncStorage.getItem('token');
      console.log('Token after logout:', tokenAfterLogout); // Should be null
    } catch (error) {
      console.error('Error during logout:', error);
      throw new Error('Logout failed');
    }
  };