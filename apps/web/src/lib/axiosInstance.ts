import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    typeof window === 'undefined'
      ? undefined
      : window.localStorage.getItem('bookcompass.accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
