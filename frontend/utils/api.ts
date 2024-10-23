import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config'; 

const getToken = async (): Promise<string> => {

  const token = await AsyncStorage.getItem('token');
  
  if (!token) throw new Error('No token found');
  return token;
};

const apiRequest = async (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any, requireToken: boolean = true) => {
    let token = null;
    if (requireToken) {
        token = await getToken();
        console.log('Using token in request:', token);
    }
    
    return axios({
      method,
      url: `${API_BASE_URL}${url}`, 
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
};

export const apiGet = (url: string, requireToken: boolean = true) => apiRequest('get', url, undefined, requireToken);
export const apiPost = (url: string, data: any, requireToken: boolean = true) => apiRequest('post', url, data, requireToken);
export const apiPut = (url: string, data: any, requireToken: boolean = true) => apiRequest('put', url, data, requireToken);
export const apiDelete = (url: string, requireToken: boolean = true) => apiRequest('delete', url, undefined, requireToken);