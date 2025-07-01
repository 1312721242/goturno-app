// import axios from 'axios';

// const axiosCliente = axios.create({
//   baseURL: process.env.EXPO_PUBLIC_API_URL, // ✅ Correcto
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Token opcional (en móvil sería mejor usar SecureStore)
// axiosCliente.interceptors.request.use(config => {
//   const token = localStorage.getItem('token'); // ⚠️ Solo funciona en web
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosCliente;

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const axiosCliente = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token en cada request
axiosCliente.interceptors.request.use(
  async (config) => {
    let token;

    if (Platform.OS === 'web') {
      token = localStorage.getItem('token');
    } else {
      token = await SecureStore.getItemAsync('token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosCliente;


