import axios, { AxiosError } from "axios";

const raw = import.meta.env.VITE_APP_API_URL || "http://127.0.0.1:3000";
const base = raw.replace(/\/+$/, "");
const apiBase = base.toLowerCase().endsWith("/api") ? base : `${base}/api`;

export const api = axios.create({
  baseURL: apiBase,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- ESPERA ACTIVA HASTA /health ----------
let apiReadyPromise: Promise<void> | null = null;

export function waitForApiReady(timeoutMs = 12000) {
  if (!apiReadyPromise) {
    apiReadyPromise = (async () => {
      const deadline = Date.now() + timeoutMs;
      while (true) {
        try {
          // usa axios directo para no entrar en el propio interceptor
          await axios.get(`${apiBase.replace(/\/$/, "")}/health`, { timeout: 800 });
          return; // listo
        } catch {
          if (Date.now() > deadline) throw new Error("API no disponible");
          await new Promise((r) => setTimeout(r, 250));
        }
      }
    })();
  }
  return apiReadyPromise;
}

// Bloquea TODAS las peticiones hasta que el backend responda a /health
api.interceptors.request.use(async (config) => {
  await waitForApiReady(15000);
  return config;
});

// Reintentos suaves si aun así hay ECONNREFUSED de red
api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const cfg: any = error.config || {};
  if (!cfg || cfg.__retryCount >= 3) throw error;

  const isNetworkError =
    error.code === "ECONNABORTED" ||
    (error.message && /Network Error|ECONNREFUSED|ERR_CONNECTION_REFUSED/i.test(error.message)) ||
    (!error.response && !!error.request);

  if (!isNetworkError) throw error;

  cfg.__retryCount = (cfg.__retryCount || 0) + 1;
  const delay = 250 * 2 ** (cfg.__retryCount - 1); // 250, 500, 1000ms
  await new Promise((r) => setTimeout(r, delay));
  return api(cfg);
});

console.log("[API baseURL]", api.defaults.baseURL);
