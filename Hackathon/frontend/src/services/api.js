import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions

// Stories
export const getMatchedStories = () => api.get('/stories/matched');
export const getAllStories = () => api.get('/stories/all');

// Pathway
export const getPathway = (userId) => api.get(`/pathway/${userId}`);
export const overridePathway = (pathwayId, data) => api.put(`/pathway/${pathwayId}/override`, data);

// Mentors
export const getMatchedMentors = () => api.get('/mentors/match');
export const getAllMentors = () => api.get('/mentors/all');

// Courses
export const getRecommendedCourses = (userId) => api.get(`/courses/recommended/${userId}`);
export const getCourse = (courseId) => api.get(`/courses/${courseId}`);
export const getAllCourses = () => api.get('/courses');

// Progress
export const getProgress = (userId, courseId) => api.get(`/progress/${userId}/${courseId}`);
export const startCourse = (userId, courseId) => api.post('/progress/start', { userId, courseId });
export const updateProgress = (userId, courseId, lessonId) =>
  api.put('/progress/update', { userId, courseId, lessonId });
export const getUserProgress = (userId) => api.get(`/progress/user/${userId}`);

// Certifications
export const generateCertification = (userId, courseId) =>
  api.post('/certifications/generate', { userId, courseId });
export const getUserCertifications = (userId) => api.get(`/certifications/user/${userId}`);
export const getCertification = (certificationId) => api.get(`/certifications/${certificationId}`);

// Networking
export const getSimilarUsers = () => api.get('/networking/similar');

// Chat
export const getChatHistory = (sessionId) => api.get(`/chat/history/${sessionId}`);
export const saveSubcategories = (assessmentId, selectedSubcategories) =>
  api.post('/chat/save-subcategories', { assessmentId, selectedSubcategories });

export default api;
