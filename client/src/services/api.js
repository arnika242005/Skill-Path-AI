const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include', // sends the httpOnly cookie automatically
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

export const authAPI = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/users/me'),
};

export const userAPI = {
  getSavedRoadmaps: () => request('/users/roadmaps'),
};

export const assessmentAPI = {
  submit: (answers) => request('/assessments', { method: 'POST', body: JSON.stringify({ answers }) }),
};

export const recommendationAPI = {
  getRoadmap: (payload) => request('/recommendations/roadmap', { method: 'POST', body: JSON.stringify(payload) }),
};

export const progressAPI = {
  save: (payload) => request('/progress', { method: 'POST', body: JSON.stringify(payload) }),
  updateStep: (payload) => request('/progress/step', { method: 'PATCH', body: JSON.stringify(payload) }),
  getById: (id) => request(`/progress/${id}`),
};

export const pdfAPI = {
  downloadRoadmap: async (title, roadmap) => {
    const res = await fetch(`${API_URL}/pdf/roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, roadmap }),
    });
    if (!res.ok) throw new Error('Failed to generate PDF');
    return res.blob();
  },
};