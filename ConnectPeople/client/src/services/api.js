import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000/api' });

// Add JWT token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export async function signup(name, email, password) {
  const res = await API.post('/auth/signup', { name, email, password });
  return res.data;
}

export async function login(email, password) {
  const res = await API.post('/auth/login', { email, password });
  if (res.data.token) {
    localStorage.setItem('tt_token', res.data.token);
    localStorage.setItem('tt_user', JSON.stringify(res.data.user));
  }
  return res.data;
}

export async function verifyEmail(token) {
  const res = await API.post('/auth/verify-email', { token });
  return res.data;
}

export async function logout() {
  localStorage.removeItem('tt_token');
  localStorage.removeItem('tt_user');
}

export async function fetchTopics(category, tags) {
  const params = {};
  if (category) params.category = category;
  if (tags && tags.length) params.tags = tags.join(',');
  const res = await API.get('/topics', { params });
  return res.data;
}

export async function createTopic(payload) {
  const res = await API.post('/topics', payload);
  return res.data;
}

export async function joinTopic(topicId) {
  const res = await API.post(`/join/${topicId}`);
  return res.data;
}

export async function fetchMessages(topicId) {
  const res = await API.get(`/chat/${topicId}/messages`);
  return res.data;
}

export default API;
