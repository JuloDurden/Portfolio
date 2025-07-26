// ✅ Force Railway si localhost pas dispo
const isDev = import.meta.env.DEV;
const railwayURL = 'https://backend-portfolio-production-39a1.up.railway.app';
const localURL = 'http://localhost:5000';

export const API_BASE_URL = isDev 
  ? railwayURL // 🎯 Force Railway en dev pour l'instant
  : ((process.env as any).REACT_APP_API_URL || railwayURL);

console.log('🚀 API_BASE_URL Final:', API_BASE_URL);

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
