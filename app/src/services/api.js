import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMessages = async () => {
  const response = await apiClient.get('/messages');
  return response.data;
};

export const searchMessages = async (query) => {
  const response = await apiClient.get(`/messages/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const sendMessage = async (username, message) => {
  const response = await apiClient.post('/messages', { username, message });
  return response.data;
};

export const sendMessageWithImage = async (formData) => {
  const response = await apiClient.post('/messages/with-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await apiClient.delete(`/messages/${id}`);
  return response.data;
};

export const getBaseUrl = () => API_BASE_URL;
