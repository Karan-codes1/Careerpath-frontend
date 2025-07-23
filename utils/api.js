import axios from 'axios'

const api = axios.create({
    baseURL:'http://localhost:8080'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Now, in the frontend code , there is no need to manually pass the token on each request:

export default api


