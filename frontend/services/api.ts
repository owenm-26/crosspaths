// frontend/services/api.ts
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

console.log('🌐 Connecting to API:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----- registration api -----
export const registerUser = async (data: any) => {
  return api.post("/users", data)
};

// export axios instance for other future requests
export default api;
