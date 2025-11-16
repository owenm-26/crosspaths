// frontend/services/api.ts
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

console.log('🌐 Connecting to API:', API_URL);

const instance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default instance