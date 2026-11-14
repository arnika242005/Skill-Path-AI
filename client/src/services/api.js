import { firestoreService } from "./firestoreService";

// Graceful resolution for env variables whether named VITE_API_BASE_URL or VITE_API_URL
const rawBase =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const cleanBase = rawBase.replace(/\/+$/, "");
export const API_URL = cleanBase.endsWith("/api") ? cleanBase : `${cleanBase}/api`;

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Server error (${res.status})`);
  }

  return data;
};

// AI services running on the backend
export const assessmentAPI = {
  submit: (answers) =>
    request("/assessments", {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
};

export const recommendationAPI = {
  getRoadmap: (payload) =>
    request("/recommendations/roadmap", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getStepHelp: (payload) =>
    request("/recommendations/step-help", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getPitchKit: (payload) =>
    request("/recommendations/pitch-kit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const pdfAPI = {
  downloadRoadmap: async (title, roadmap) => {
    const res = await fetch(`${API_URL}/pdf/roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, roadmap }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate PDF");
    }

    return res.blob();
  },
};

export const healthAPI = {
  check: () => request("/health"),
};

// Unified progress & database API powered by Firebase Firestore
export const progressAPI = {
  save: async ({ userId, opportunity, roadmap }) => {
    const saved = await firestoreService.saveRoadmap(userId, opportunity, roadmap);
    return { progress: saved };
  },

  updateStep: async ({ progressId, stepIndex, done, roadmap }) => {
    const updated = await firestoreService.updateStep(progressId, stepIndex, done, roadmap);
    return { progress: updated };
  },

  getById: async (id) => {
    const progress = await firestoreService.getRoadmapById(id);
    return { progress };
  },

  getUserRoadmaps: async (userId) => {
    const roadmaps = await firestoreService.getUserRoadmaps(userId);
    return { roadmaps };
  },

  delete: async (id) => {
    await firestoreService.deleteRoadmap(id);
    return { success: true };
  },
};
