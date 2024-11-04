const ENV : any = process.env.NODE_ENV || 'development';

const CONFIG : any = {
  development: {
    API_BASE_URL: 'http://192.168.1.96:3000',
  },
  production: {
    API_BASE_URL: 'https://api.yourproductionurl.com',
  },
};

export const { API_BASE_URL } = CONFIG[ENV];