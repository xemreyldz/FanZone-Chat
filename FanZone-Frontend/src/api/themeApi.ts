import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Kullanıcının tema modunu getir
export const fetchUserThemeMode = async (userId: number): Promise<'dark' | 'light'> => {
  const response = await axios.get<{ mode: 'dark' | 'light' }>(`${API_BASE_URL}/users/${userId}/mode`);
  return response.data.mode;
};

// Kullanıcının tema modunu güncelle
export const updateUserThemeMode = async (userId: number, mode: 'dark' | 'light'): Promise<void> => {
  await axios.put(`${API_BASE_URL}/users/${userId}/mode`, { mode });
};
