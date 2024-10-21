import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000';

const getToken = async (): Promise<string> => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return token;
};

const apiRequest = async (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) => {
  const token = await getToken();
  return axios({
    method,
    url: `${API_BASE_URL}${url}`,
    data,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const apiGet = (url: string) => apiRequest('get', url);
export const apiPost = (url: string, data: any) => apiRequest('post', url, data);
export const apiPut = (url: string, data: any) => apiRequest('put', url, data);
export const apiDelete = (url: string) => apiRequest('delete', url);