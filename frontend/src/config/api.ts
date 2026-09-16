const apiUrl = import.meta.env.VITE_API_URL?.trim();

if (!apiUrl) {
  throw new Error('VITE_API_URL must be set. Use /api for same-origin/proxied deployments or https://your-api-host/api for split deployments.');
}

export const API_URL = apiUrl.replace(/\/$/, '');

export function apiPath(path: string) {
  return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
}