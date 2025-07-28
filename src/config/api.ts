export const API_URL = import.meta.env.VITE_APP_API_URL;

export const api = (path: string) => `${API_URL}${path}`;
