import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('sbUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default API;

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Users
export const getUsers = (params) => API.get('/users', { params });
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateProfile = (data) => API.put('/users/profile', data);
export const addSkillOffer = (data) => API.post('/users/skills/offer', data);
export const addSkillWant = (data) => API.post('/users/skills/want', data);
export const deleteSkill = (type, skillId) => API.delete(`/users/skills/${type}/${skillId}`);

// Sessions
export const createSession = (data) => API.post('/sessions', data);
export const getMySessions = () => API.get('/sessions/my');
export const updateSessionStatus = (id, data) => API.put(`/sessions/${id}/status`, data);
export const cancelSession = (id) => API.delete(`/sessions/${id}`);

// Messages
export const getConversations = () => API.get('/messages/conversations');
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const sendMessage = (userId, data) => API.post(`/messages/${userId}`, data);

// Reviews
export const createReview = (data) => API.post('/reviews', data);
export const getUserReviews = (userId) => API.get(`/reviews/user/${userId}`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const toggleUserStatus = (id) => API.put(`/admin/users/${id}/toggle`);
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const verifyUser = (id) => API.put(`/admin/users/${id}/verify`);
export const getAdminSessions = () => API.get('/admin/sessions');
