import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',  // Adjust the base URL if necessary
  withCredentials: true,  // Include credentials in cross-site requests
});

axiosInstance.interceptors.request.use((config) => {
  const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken.split('=')[1];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;