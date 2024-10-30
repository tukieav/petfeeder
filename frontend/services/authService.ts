import { apiPost, apiGet } from '../utils/api'; 
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

  // Pobierz token CSRF
  const csrfResponse = await apiGet('/auth/csrf-token', false);
  const csrfToken = csrfResponse.data.csrfToken;

  // Logowanie tokenu CSRF
  console.log('CSRF Token received:', csrfToken);

  // Wyślij żądanie logowania z tokenem CSRF
  const response = await apiPost(endpoint, credentials, false, { 'X-CSRF-Token': csrfToken });
  console.log('CSRF Token sent:', csrfToken);

  if (!response.data.token) {
    throw new Error('No token received from server');
  }
  await storeToken(response.data.token);
};

export const logout = async () => {
  try {
    // Pobierz token CSRF
    const csrfResponse = await apiGet('/auth/csrf-token', false);
    const csrfToken = csrfResponse.data.csrfToken;

    // Wyślij żądanie wylogowania z tokenem CSRF
    const response = await apiPost('/auth/logout', {}, false, { 'X-CSRF-Token': csrfToken });
    
    // Usuń token z pamięci
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error('Logout failed');
  }
};