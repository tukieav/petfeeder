import { apiPost } from '../utils/api'; 
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
    const response = await apiPost(endpoint, credentials, false);

    if (!response.data.token) {
      throw new Error('No token received from server');
    }
    await storeToken(response.data.token);
};

export const logout = async () => {
  try {
    const response = await apiPost('/auth/logout', {}); 

    await AsyncStorage.removeItem('token');
    const tokenAfterLogout = await AsyncStorage.getItem('token');
  } catch (error) {
    throw new Error('Logout failed');
  }
};