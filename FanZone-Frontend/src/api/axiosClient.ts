
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
