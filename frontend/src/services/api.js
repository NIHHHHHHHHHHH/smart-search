import axios from 'axios';

// Axios Instance Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors and auto-logout on 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle unauthorized errors (expired/invalid token)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }

    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    throw new Error(message);
  }
);

// File Upload API
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) onProgress(percentCompleted);
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Document APIs
export const getDocuments = async (params = {}) => {
  const response = await api.get('/upload', { params });
  return response.data;
};

export const getDocumentById = async (id) => {
  const response = await api.get(`/upload/${id}`);
  return response.data;
};

// Search APIs
export const searchDocuments = async (query, filters = {}) => {
  const params = {
    q: query,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
    )
  };

  const response = await api.get('/search', { params });
  return response.data;
};

export const getFilters = async () => {
  const response = await api.get('/search/filters');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/search/stats');
  return response.data;
};

// Auth APIs
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response;
};

export const guestLogin = async () => {
  const response = await api.post('/auth/guest');
  return response;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response;
};

export const updateUserProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response;
};

export const changeUserPassword = async (passwords) => {
  const response = await api.put('/auth/password', passwords);
  return response;
};

export default api;