import axios from 'axios';

const accessToken = localStorage.getItem('_hw_token');

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URI,
  withCredentials: true,
  headers: {
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
  },
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('_hw_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  console.log('Request config:', config); // Debugging line
  return config;
}, function (error) {
  console.error('Request error:', error); // Debugging line
  return Promise.reject(error);
});

export default instance;
