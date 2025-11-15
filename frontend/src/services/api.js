import axios from 'axios';

// Axios Instance Configuration
// Creates a reusable axios client that automatically applies:
//  - Base API URL (from environment variables)
//  - Default headers
//  - Response timeout
//
// This centralizes all API-related settings so the entire app
// uses one consistent configuration.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s timeout for long-running operations like file uploads
  headers: {
    'Content-Type': 'application/json'
  }
});

// Axios Response Interceptor
// Intercepts all API responses before they reach the UI.
// If successful → return response.data directly.
// If error → extract readable message and throw a clean error.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    throw new Error(message);
  }
);

// File Upload API
// uploadFile(file, onProgress)
// - Sends a file to backend via POST /upload
// - Supports progress tracking via onUploadProgress
// - Returns response.data from server
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

        // Callback to update upload progress in UI
        if (onProgress) onProgress(percentCompleted);
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Document APIs
// getDocuments(params)
// - Fetch list of uploaded documents (with optional filters)
//
// getDocumentById(id)
// - Fetch a single uploaded document by ID
export const getDocuments = async (params = {}) => {
  const response = await api.get('/upload', { params });
  return response.data;
};

export const getDocumentById = async (id) => {
  const response = await api.get(`/upload/${id}`);
  return response.data;
};

// Search APIs
// searchDocuments(query, filters)
// - Performs semantic/full-text search across documents
// - Dynamically removes empty filter values before sending
//
// getFilters()
// - Fetches available filter metadata (categories, teams, projects)
//
// getStats()
// - Fetches high-level analytics/statistics from the backend
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

export default api;
