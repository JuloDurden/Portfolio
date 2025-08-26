// ✅ Force Railway si localhost pas dispo
const isDev = import.meta.env.DEV;
const railwayURL = 'https://backend-portfolio-1-nh0s.onrender.com';
const localURL = 'http://localhost:5000'; // 🎯 Port 5000 OK

export const API_BASE_URL = isDev 
  ? railwayURL // 🎯 Force Railway en dev pour l'instant
  : ((process.env as any).REACT_APP_API_URL || railwayURL);

// 🔑 FONCTION MANQUANTE - getToken
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// 🔑 Helpers token supplémentaires
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// 🎯 Headers par défaut
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// 🎯 Headers pour FormData
export const getAuthHeadersForFormData = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// 🔒 Check si authentifié
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && token.length > 0;
};
