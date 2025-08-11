import axios from 'axios';

// Prefer explicit env var. Otherwise, when the app is served by the backend
// under the same domain, use a relative API path so it works over the internet
// via a single public URL. In production without explicit env, default to
// relative /api instead of localhost so Vercel can work with a reverse-proxy
// backend or future integration.
const resolveBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    // Use same-origin base; callers include '/api/...'
    return window.location.origin;
  }
  // Final fallback for non-browser contexts
  return '';
};

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: false,
});


