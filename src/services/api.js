import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const getUploadUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // If in development and API_URL is absolute (e.g. http://localhost:5000/api), 
  // point directly to the dev server to avoid vite proxy issues.
  if (import.meta.env.DEV && API_URL.startsWith('http')) {
    const baseUrl = API_URL.replace(/\/api\/?$/, '');
    return `${baseUrl}${path}`;
  }
  
  // In production, the PHP script and Hostinger will serve /uploads/ directly.
  return path;
};

// Auth
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const verifyToken = async () => {
  const token = getAuthToken();
  if (!token) throw new Error('No token found');

  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Projects
export const getProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`);
  return response.data;
};

export const getProjectBySlug = async (slug) => {
  const response = await axios.get(`${API_URL}/projects/${slug}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const token = getAuthToken();
  const response = await axios.post(`${API_URL}/projects`, projectData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/projects/${id}`, projectData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteProject = async (id) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Social Links
export const getSocialLinks = async () => {
  const response = await axios.get(`${API_URL}/social`);
  return response.data;
};

export const updateSocialLinks = async (links) => {
  const token = getAuthToken();
  const response = await axios.put(
    `${API_URL}/social`,
    { links },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Skills
export const getSkills = async () => {
  const response = await axios.get(`${API_URL}/skills`);
  return response.data;
};

export const createSkill = async (skillData) => {
  const token = getAuthToken();
  const response = await axios.post(`${API_URL}/skills`, skillData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateSkill = async (id, skillData) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/skills/${id}`, skillData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteSkill = async (id) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/skills/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Experiences
export const getExperiences = async () => {
  const response = await axios.get(`${API_URL}/experiences`);
  return response.data;
};

export const createExperience = async (expData) => {
  const token = getAuthToken();
  const response = await axios.post(`${API_URL}/experiences`, expData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateExperience = async (id, expData) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/experiences/${id}`, expData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteExperience = async (id) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/experiences/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Settings
export const getSettings = async () => {
  const response = await axios.get(`${API_URL}/settings`);
  return response.data;
};

export const updateSettings = async (settings) => {
  const token = getAuthToken();
  const response = await axios.put(
    `${API_URL}/settings`,
    { settings },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// File Upload
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const token = getAuthToken();
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  return response.data;
};

// Inbox (Messages)
export const getMessages = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await axios.post(`${API_URL}/messages`, messageData);
  return response.data;
};

export const markMessageRead = async (id) => {
  const token = getAuthToken();
  const response = await axios.put(`${API_URL}/messages/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteMessage = async (id) => {
  const token = getAuthToken();
  const response = await axios.delete(`${API_URL}/messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Analytics
export const trackPageView = async (path) => {
  const response = await axios.post(`${API_URL}/analytics/track`, { path });
  return response.data;
};

export const getAnalytics = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
