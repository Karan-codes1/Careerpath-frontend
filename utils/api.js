import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true // 🧠 this allows browser to send cookies (if this not done then we have to manually send cookie in every req)
  // like axios.get('/profile', { withCredentials: true });
});

export default api


// This is not the main branch