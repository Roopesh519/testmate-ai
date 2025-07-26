import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// ✅ Automatically attach token on each request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle token expiration globally
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.code === 'TOKEN_EXPIRED') {
      alert('Your session has expired. Please log in again.');
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
