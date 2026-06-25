import axios from 'axios';
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const flowerService = {
  getAllFlowers: async () => {
    const response = await api.get('/flowers');
    return response.data;
  },
  getFlowerDetail: async (englishName) => {
    const response = await api.get(`/flowers/${englishName}`);
    return response.data;
  },

  analyzePlantImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;