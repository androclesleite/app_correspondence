import axios from 'axios';
import type { AuthResponse, User, Package, Store } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
  },

  me: async (): Promise<{ user: User }> => {
    const response = await api.get('/me');
    return response.data;
  },
};

// Packages API
export const packagesApi = {
  list: async (params?: { status?: string; store_id?: number }) => {
    const response = await api.get('/packages', { params });
    return response.data;
  },

  create: async (packageData: Partial<Package>) => {
    const response = await api.post('/packages', packageData);
    return response.data;
  },

  show: async (id: number): Promise<Package> => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },

  collect: async (id: number, data: FormData) => {
    const response = await api.post(`/packages/${id}/collect`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  markAsReturned: async (id: number) => {
    const response = await api.patch(`/packages/${id}/return`);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  },
};

// Stores API
export const storesApi = {
  list: async (): Promise<Store[]> => {
    const response = await api.get('/stores');
    return response.data;
  },

  show: async (id: number): Promise<Store> => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },
};