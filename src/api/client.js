import axios from 'axios';

// Prefer explicit env var. Otherwise, when the app is served by the backend
// under the same domain, use a relative API path so it works over the internet
// via a single public URL.
const resolveBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:4000';
};

export const api = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: false,
});


