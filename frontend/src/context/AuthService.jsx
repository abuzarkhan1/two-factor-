// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users';

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const initiateLogin = async (credentials) => {
  const response = await axios.post(`${API_URL}/login/initiate`, credentials);
  return response.data;
};

export const verifyOTP = async (verificationData) => {
  const response = await axios.post(`${API_URL}/login/verify`, verificationData);
  return response.data;
};