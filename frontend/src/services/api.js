import axios from 'axios';

// CRITICAL CHANGE FOR VERCEL: 
// In production (on Vercel), this defaults to the relative path '/api', 
// which Vercel's routes configuration correctly points to the serverless function (backend/server.js).
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s timeout for long-running operations like file uploads
  headers: {
    // We remove 'Content-Type': 'application/json' as a default here, 
    // as it conflicts with 'multipart/form-data' used in uploadFile, which sets its own header.
    // We only set specific headers where necessary.
  }
});

// Axios Response Interceptor
// Intercepts all API responses before they reach the UI.
// If successful → return response.data directly.
// If error → extract readable message and throw a clean error.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If the error response exists and contains a message field, use that.
    // Otherwise, fallback to error.message or a generic error.
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    
    // Create a new Error object for better stack trace tracking
    const customError = new Error(message);
    customError.response = error.response; // Optionally attach the original response for detail
    throw customError;
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
    // Path: /upload resolves to [BASE_URL]/upload (e.g., /api/upload)
    const response = await api.post('/upload', formData, {
      // NOTE: axios will automatically set the correct boundary for 'multipart/form-data'
      // You can often omit the 'Content-Type' header here, but it's fine to keep it explicit.
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        // Axios uses `progressEvent.total` for the total size
        const percentCompleted = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;

        // Callback to update upload progress in UI
        if (onProgress) onProgress(percentCompleted);
      }
    });

    return response; // response.data is extracted by the interceptor
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
  // Path: /upload resolves to /api/upload
  const response = await api.get('/upload', { params });
  return response; // response.data is extracted by the interceptor
};

export const getDocumentById = async (id) => {
  // Path: /upload/:id resolves to /api/upload/:id
  const response = await api.get(`/upload/${id}`);
  return response; // response.data is extracted by the interceptor
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
    // Filter out any empty values before sending
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
    )
  };

  // Path: /search resolves to /api/search
  const response = await api.get('/search', { params });
  return response; // response.data is extracted by the interceptor
};

export const getFilters = async () => {
  // Path: /search/filters resolves to /api/search/filters
  const response = await api.get('/search/filters');
  return response; // response.data is extracted by the interceptor
};

export const getStats = async () => {
  // Path: /search/stats resolves to /api/search/stats
  const response = await api.get('/search/stats');
  return response; // response.data is extracted by the interceptor
};

export default api;









// import axios from 'axios';

// // Axios Instance Configuration
// // Creates a reusable axios client that automatically applies:
// //  - Base API URL (from environment variables)
// //  - Default headers
// //  - Response timeout
// //
// // This centralizes all API-related settings so the entire app
// // uses one consistent configuration.

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000, // 30s timeout for long-running operations like file uploads
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Axios Response Interceptor
// // Intercepts all API responses before they reach the UI.
// // If successful → return response.data directly.
// // If error → extract readable message and throw a clean error.
// api.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     const message = error.response?.data?.message || error.message || 'An error occurred';
//     console.error('API Error:', message);
//     throw new Error(message);
//   }
// );

// // File Upload API
// // uploadFile(file, onProgress)
// // - Sends a file to backend via POST /upload
// // - Supports progress tracking via onUploadProgress
// // - Returns response.data from server
// export const uploadFile = async (file, onProgress) => {
//   const formData = new FormData();
//   formData.append('file', file);

//   try {
//     const response = await api.post('/upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//       onUploadProgress: (progressEvent) => {
//         const percentCompleted = Math.round(
//           (progressEvent.loaded * 100) / progressEvent.total
//         );

//         // Callback to update upload progress in UI
//         if (onProgress) onProgress(percentCompleted);
//       }
//     });

//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // Document APIs
// // getDocuments(params)
// // - Fetch list of uploaded documents (with optional filters)
// //
// // getDocumentById(id)
// // - Fetch a single uploaded document by ID
// export const getDocuments = async (params = {}) => {
//   const response = await api.get('/upload', { params });
//   return response.data;
// };

// export const getDocumentById = async (id) => {
//   const response = await api.get(`/upload/${id}`);
//   return response.data;
// };

// // Search APIs
// // searchDocuments(query, filters)
// // - Performs semantic/full-text search across documents
// // - Dynamically removes empty filter values before sending
// //
// // getFilters()
// // - Fetches available filter metadata (categories, teams, projects)
// //
// // getStats()
// // - Fetches high-level analytics/statistics from the backend
// export const searchDocuments = async (query, filters = {}) => {
//   const params = {
//     q: query,
//     ...Object.fromEntries(
//       Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
//     )
//   };

//   const response = await api.get('/search', { params });
//   return response.data;
// };

// export const getFilters = async () => {
//   const response = await api.get('/search/filters');
//   return response.data;
// };

// export const getStats = async () => {
//   const response = await api.get('/search/stats');
//   return response.data;
// };

// export default api;
