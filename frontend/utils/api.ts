import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000';

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return token;
};

export const apiGet = async (url: string) => {
  const token = await getToken();
  return axios.get(`${API_BASE_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const apiPost = async (url: string, data: any) => {
  const token = await getToken();
  return axios.post(`${API_BASE_URL}${url}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const apiPut = async (url: string, data: any) => {
  const token = await getToken();
  return axios.put(`${API_BASE_URL}${url}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const apiDelete = async (url: string) => {
  const token = await getToken();
  return axios.delete(`${API_BASE_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};