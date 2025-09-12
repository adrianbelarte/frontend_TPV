// src/config/api.ts
import axios from "axios";

const base = import.meta.env.VITE_APP_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: `${base}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
