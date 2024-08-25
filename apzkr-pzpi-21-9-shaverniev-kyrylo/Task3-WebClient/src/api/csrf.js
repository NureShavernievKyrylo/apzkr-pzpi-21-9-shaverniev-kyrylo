import axiosInstance from './axiosInstance';

export const fetchCsrfToken = async () => {
  const response = await axiosInstance.get('/api/csrf-token/');
  axiosInstance.defaults.headers['X-CSRFToken'] = response.data.csrfToken;
};