import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { API_BASE_URL } from '../config/api';

// 🔐 Types TypeScript - FLEXIBLE pour id ET _id
interface User {
  _id?: string; // MongoDB format
  id?: string;  // API login format
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  githubUrl?: string;
  profilePicture?: string;
  currentJob?: string;
  introductionParagraph?: string;
  journeyParagraph?: string;
  goalsParagraph?: string;
  hobbies?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  checkAuthStatus: () => Promise<boolean>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// 🎯 Fonction utilitaire pour valider un utilisateur
const isValidUser = (userData: any): boolean => {
  return userData && (userData._id || userData.id) && userData.firstName && userData.email;
};

// 🎯 Fonction utilitaire pour normaliser l'utilisateur
const normalizeUser = (userData: any): User => {
  return {
    ...userData,
    // S'assurer qu'on a toujours un id même si l'API retourne _id ou vice versa
    _id: userData._id || userData.id,
    id: userData.id || userData._id
  };
};

// 🎯 Création du Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🚀 Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🎯 État d'authentification calculé
  const isAuthenticated = !!user;

  // 🔍 Validation du token - CORRIGÉE avec gestion flexible id/_id
  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('🔍 Pas de token trouvé');
        return false;
      }

      console.log('🔍 Validation du token...');
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📥 Réponse /me - Status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('📦 Réponse complète /me:', result);
        
        // 🎯 EXTRACTION AVEC GESTION FLEXIBLE
        let userData = null;
        
        if (result.success && result.data) {
          userData = result.data;
          console.log('✅ Utilisateur trouvé dans result.data (success: true)');
        } else if (result.data?.user) {
          userData = result.data.user;
          console.log('✅ Utilisateur trouvé dans result.data.user');
        } else if (result.user) {
          userData = result.user;
          console.log('✅ Utilisateur trouvé dans result.user');
        } else if (result.data) {
          userData = result.data;
          console.log('✅ Utilisateur trouvé dans result.data');
        } else {
          userData = result;
          console.log('✅ Utilisateur trouvé dans result');
        }
        
        console.log('👤 Données utilisateur extraites:', userData);
        
        // ✅ VÉRIFICATION FLEXIBLE (id OU _id)
        if (isValidUser(userData)) {
          const normalizedUser = normalizeUser(userData);
          setUser(normalizedUser);
          console.log('✅ Token valide, utilisateur connecté:', normalizedUser);
          return true;
        } else {
          console.log('❌ Données utilisateur incomplètes - ni _id ni id trouvé');
          localStorage.removeItem('token');
          setUser(null);
          return false;
        }
      } else {
        console.log('❌ Token invalide, nettoyage...');
        localStorage.removeItem('token');
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('💥 Erreur validation token:', error);
      localStorage.removeItem('token');
      setUser(null);
      return false;
    }
  }, []);

  // 🔐 Fonction de connexion - CORRIGÉE avec gestion flexible id/_id
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    console.log('🎯 LOGIN APPELÉ:', { email });
    
    try {
      console.log('📡 REQUÊTE VERS:', `${API_BASE_URL}/api/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 RÉPONSE LOGIN - Status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('📦 DONNÉES LOGIN COMPLÈTES:', result);
        
        // 🎯 EXTRACTION AVEC GESTION FLEXIBLE
        let userData = null;
        let token = null;
        
        // Extraire le token
        if (result.data?.token) {
          token = result.data.token;
        } else if (result.token) {
          token = result.token;
        }
        
        // Extraire l'utilisateur
        if (result.success && result.data?.user) {
          userData = result.data.user;
        } else if (result.data?.user) {
          userData = result.data.user;
        } else if (result.user) {
          userData = result.user;
        } else if (result.data && (result.data._id || result.data.id)) {
          userData = result.data;
        }
        
        console.log('🔑 Token extrait:', token ? 'Présent' : 'Absent');
        console.log('👤 User extrait:', userData);
        
        // ✅ VÉRIFICATION FLEXIBLE (id OU _id)
        if (token && isValidUser(userData)) {
          localStorage.setItem('token', token);
          const normalizedUser = normalizeUser(userData);
          setUser(normalizedUser);
          console.log('🎉 USER SET:', normalizedUser);
          return true;
        } else {
          console.log('❌ Données de connexion incomplètes');
          console.log('- Token présent:', !!token);
          console.log('- User valide:', isValidUser(userData));
          console.log('- User data:', userData);
          throw new Error('Données de connexion incomplètes');
        }
      } else {
        const errorData = await response.json();
        console.error('❌ ERREUR LOGIN:', errorData);
        throw new Error(errorData.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('💥 ERREUR LOGIN:', error);
      return false;
    }
  }, []);

  // 🚪 Fonction de déconnexion
  const logout = useCallback(() => {
    console.log('🚪 DÉCONNEXION...');
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // 🔍 Check Auth Status (pour vérifications ponctuelles)
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    console.log('🔄 Vérification du statut d\'authentification...');
    return await validateToken();
  }, [validateToken]);

  // 🎯 Effect pour valider le token au montage
  useEffect(() => {
    console.log('🚀 INITIALISATION AuthProvider...');
    let isMounted = true;
    
    const initAuth = async () => {
      await validateToken();
      if (isMounted) {
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    return () => {
      isMounted = false;
    };
  }, [validateToken]);

  // 📦 Valeur du contexte
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 🎪 Hook personnalisé
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
