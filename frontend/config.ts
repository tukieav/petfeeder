import Constants from 'expo-constants';

const ENV = Constants.manifest?.extra?.API_BASE_URL || 'development';

const CONFIG: Record<string, { API_BASE_URL: string }> = {
  development: {
    API_BASE_URL: 'http://localhost:3000',
  },
  production: {
    API_BASE_URL: ENV,
  },
};

export const { API_BASE_URL } = CONFIG[ENV];