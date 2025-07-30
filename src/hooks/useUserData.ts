import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

// 🎯 Interface pour les données Biography ÉTENDUE
export interface BiographyData {
  profilePicture?: string;
  fullName: string;
  age: number;
  currentJob: string;
  hobbies: string[];
  biography: {
    introduction: string;
    journey: string;
    goals: string;
  };
  // 🆕 NOUVELLES PROPRIÉTÉS POUR PERSONAL DATA
  email: string;
  dateOfBirth: string;
  githubUrl: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
  // 🆕 GARDER LES DONNÉES BRUTES POUR COMPATIBILITÉ
  rawData?: any;
}

// 🎯 Interface pour les données brutes de l'API ÉTENDUE
interface UserApiResponse {
  success: boolean;
  data: {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    githubUrl: string;
    profilePicture?: string;
    currentJob: string;
    hobbies: string[];
    introductionParagraph: string;
    journeyParagraph: string;
    goalsParagraph: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

// 🔐 Interface pour le changement de mot de passe
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 🔐 Interface pour la réponse du changement de mot de passe
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const useUserData = () => {
  const [biographyData, setBiographyData] = useState<BiographyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🎯 CALCUL DE L'ÂGE
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // 🌟 FORMATAGE URL POUR CLOUDINARY/RAILWAY
  const formatProfilePictureUrl = (profilePicture: string): string => {
    if (!profilePicture) {
      console.log('🔍 Pas de profilePicture fournie');
      return '';
    }
    
    console.log('🔍 Formatage profilePicture:', profilePicture);
    
    // ✅ Si déjà une URL complète (Cloudinary ou autre)
    if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
      console.log('✅ URL déjà complète (Cloudinary?):', profilePicture);
      return profilePicture;
    }
    
    // 🔧 Si c'est un chemin relatif depuis uploads/ (Railway)
    if (profilePicture.startsWith('uploads/')) {
      const fullUrl = `${API_BASE_URL}/${profilePicture}`;
      console.log('🔧 URL Railway générée:', fullUrl);
      return fullUrl;
    }
    
    // 🔧 Si c'est juste un nom de fichier (fallback Railway)
    const fallbackUrl = `${API_BASE_URL}/uploads/avatars/${profilePicture}`;
    console.log('🔧 URL Railway fallback générée:', fallbackUrl);
    return fallbackUrl;
  };

  // 🎯 FORMATAGE DES DONNÉES UTILISATEUR
  const formatBiographyData = (userData: any): BiographyData => {
    console.log('🔍 RAW USER DATA dans formatBiographyData:', userData);
    
    // 📸 FORMATAGE INTELLIGENT DE L'AVATAR
    const formattedProfilePicture = formatProfilePictureUrl(userData.profilePicture);
    console.log('📸 Avatar formaté final:', formattedProfilePicture);
    
    return {
      // 📸 DONNÉES DE PROFIL - URL INTELLIGENTE
      profilePicture: formattedProfilePicture || undefined,
      fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
      age: calculateAge(userData.dateOfBirth),
      currentJob: userData.currentJob || 'Développeur Web',
      hobbies: userData.hobbies || [],
      
      // 📝 BIOGRAPHIE
      biography: {
        introduction: userData.introductionParagraph || '',
        journey: userData.journeyParagraph || '',
        goals: userData.goalsParagraph || ''
      },
      
      // 🆕 DONNÉES PERSONNELLES
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      dateOfBirth: userData.dateOfBirth || '',
      githubUrl: userData.githubUrl || '',
      
      // 📅 MÉTADONNÉES
      createdAt: userData.createdAt || '',
      updatedAt: userData.updatedAt || '',
      
      // 🗃️ DONNÉES BRUTES COMPLÈTES
      rawData: userData
    };
  };

  // 🎯 FETCH USER DATA
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching user data from:', `${API_BASE_URL}/api/user`);
      
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result: UserApiResponse = await response.json();
      console.log('✅ User data received:', result);

      if (result.success && result.data) {        
        // 🎯 FORMATAGE DES DONNÉES COMPLÈTES
        const formattedData = formatBiographyData(result.data);

        console.log('🎯 Formatted biography data COMPLET:', formattedData);
        console.log('🔍 Vérification des champs critiques:', {
          email: `"${formattedData.email}"`,
          dateOfBirth: `"${formattedData.dateOfBirth}"`,
          githubUrl: `"${formattedData.githubUrl}"`,
          profilePicture: `"${formattedData.profilePicture}"`,
          rawData: formattedData.rawData ? 'PRÉSENT' : 'ABSENT'
        });
        
        setBiographyData(formattedData);
      } else {
        throw new Error('Format de réponse invalide');
      }

    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // 🔐 CHANGEMENT DE MOT DE PASSE - VERSION CORRIGÉE
  const changePassword = async (passwordData: ChangePasswordData): Promise<ChangePasswordResponse> => {
    try {
      console.log('🔐 Tentative de changement de mot de passe');
      
      // 🛡️ VALIDATIONS CÔTÉ CLIENT RENFORCÉES
      if (!passwordData.currentPassword?.trim()) {
        throw new Error('Le mot de passe actuel est requis');
      }

      if (!passwordData.newPassword?.trim()) {
        throw new Error('Le nouveau mot de passe est requis');
      }

      if (!passwordData.confirmPassword?.trim()) {
        throw new Error('La confirmation du mot de passe est requise');
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      }

      if (passwordData.newPassword === passwordData.currentPassword) {
        throw new Error('Le nouveau mot de passe doit être différent de l\'ancien');
      }

      // 🔑 RÉCUPÉRATION DU TOKEN
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Vous devez être connecté pour changer votre mot de passe');
      }

      console.log('📡 Envoi de la requête de changement de mot de passe...');

      // 🚀 REQUÊTE API
      const response = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();

      // 🔍 GESTION DES ERREURS HTTP
      if (!response.ok) {
        console.error('❌ Erreur HTTP:', response.status, result);
        throw new Error(result.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Mot de passe changé avec succès:', result);
      
      return {
        success: true,
        message: result.message || 'Mot de passe changé avec succès'
      };

    } catch (err) {
      console.error('❌ Erreur changement mot de passe:', err);
      
      // 🔄 RETOUR D'ERREUR STRUCTURÉ
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Erreur inconnue lors du changement de mot de passe'
      };
    }
  };

  // 🎯 FETCH AU MOUNT
  useEffect(() => {
    fetchUserData();
  }, []);

  return {
    biographyData,
    loading,
    error,
    refetch: fetchUserData,
    changePassword
  };
};
