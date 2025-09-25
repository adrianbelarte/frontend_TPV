// src/config/api.ts
import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: `${base}/api`,        // <-- aquí añadimos /api
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Debug útil: confirma a dónde apunta en runtime
console.log("[API baseURL]", api.defaults.baseURL);
