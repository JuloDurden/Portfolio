import { 
  BackendUserData, 
  FrontendUserData,
  transformToFrontend,
  transformPersonalDataToBackend,
  transformAboutDataToBackend 
} from './userHelpers';
import { PersonalData } from './pages/Dashboard/sections/PersonalData/types';
import { AboutData } from './pages/Dashboard/sections/About/types';
import { API_BASE_URL } from './config/api';


// 🎯 TYPES DE RÉPONSES
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface UpdateResponse {
  success: boolean;
  message: string;
}

// 🎯 ERROR HANDLER
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleApiError = async (response: Response): Promise<never> => {
  const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
  throw new ApiError(response.status, errorData.message || 'Erreur API');
};

// 🎯 FETCH WRAPPER
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 🔥 RÉCUPÉRER LE TOKEN
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // 🚨 AJOUTER LE TOKEN ICI !
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Erreur réseau: ${error instanceof Error ? error.message : 'Inconnue'}`);
  }
};

// 🎯 SERVICE FUNCTIONS

/**
 * 📊 Récupérer les données utilisateur
 */
export const getUserData = async (): Promise<FrontendUserData> => {
  try {
    const response = await apiRequest<ApiResponse<BackendUserData>>('/api/user');
    
    console.log('🔍 Réponse API getUserData:', response);
    console.log('🔍 response.data:', response.data);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Impossible de récupérer les données');
    }

    return transformToFrontend(response.data);
  } catch (error) {
    console.error('❌ Erreur getUserData:', error);
    throw error;
  }
};


/**
 * 👤 Mettre à jour les données personnelles
 */
export const updatePersonalData = async (personalData: PersonalData): Promise<UpdateResponse> => {
  try {
    const backendData = transformPersonalDataToBackend(personalData);
    
    const response = await apiRequest<UpdateResponse>('/api/user/personal', {
      method: 'PUT',
      body: JSON.stringify({ personalData: backendData }),
    });

    return response;
  } catch (error) {
    console.error('❌ Erreur updatePersonalData:', error);
    throw error;
  }
};

/**
 * 📝 Mettre à jour la section About
 */
export const updateAboutData = async (aboutData: AboutData): Promise<UpdateResponse> => {
  try {
    const backendData = transformAboutDataToBackend(aboutData);
    
    const response = await apiRequest<UpdateResponse>('/api/user/about', {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });

    return response;
  } catch (error) {
    console.error('❌ Erreur updateAboutData:', error);
    throw error;
  }
};

/**
 * 📸 Upload avatar (ProfilePicture)
 */
export const uploadAvatar = async (file: File) => {
  console.log('📸 Upload avatar...');
  
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await fetch(`${API_BASE_URL}/api/user/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });
  
  const data = await response.json();
  
  // 🎯 VÉRIFIER LE SUCCESS DANS LA RÉPONSE
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Erreur upload avatar');
  }
  
  console.log('✅ Avatar uploadé:', data);
  return data;
};


/**
 * 🗑️ Supprimer avatar
 */
export const deleteAvatar = async (): Promise<UpdateResponse> => {
  try {
    const response = await apiRequest<UpdateResponse>('/api/user/avatar', {
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    console.error('❌ Erreur deleteAvatar:', error);
    throw error;
  }
};

export default {
  getUserData,
  updatePersonalData,
  updateAboutData,
  uploadAvatar,
  deleteAvatar,
};
