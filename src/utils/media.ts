export function mediaUrl(path?: string | null) {
  if (!path) return "";
  // si ya es http/https, devuélvela tal cual
  if (/^https?:\/\//i.test(path)) return path;

  // VITE_APP_API_URL = http://localhost:3000/api  → origin = http://localhost:3000
  const api = import.meta.env.VITE_APP_API_URL || "";
  const origin = api ? new URL(api).origin : "";
  const rel = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${rel}`;
}
