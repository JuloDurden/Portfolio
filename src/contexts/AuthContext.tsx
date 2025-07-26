import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { API_BASE_URL } from '../config/api';

// 🔐 Types TypeScript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// 🎯 Création du Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🚀 Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔐 Fonction de connexion
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    console.log('🎯 LOGIN APPELÉ:', { email, password }); // ← AJOUTER
    
    try {
      console.log('📡 REQUÊTE VERS:', `${API_BASE_URL}/api/auth/login`); // ← AJOUTER
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 RÉPONSE STATUS:', response.status); // ← AJOUTER
      console.log('📥 RÉPONSE OK:', response.ok); // ← AJOUTER

      if (response.ok) {
        const result = await response.json();
        console.log('✅ DONNÉES REÇUES:', result); // ← AJOUTER
        const { user, token } = result.data;
        
        localStorage.setItem('token', token);
        setUser(user);
        console.log('🎉 USER SET:', user); // ← AJOUTER
      } else {
        const errorData = await response.json();
        console.error('❌ ERREUR RESPONSE:', errorData); // ← AJOUTER
        throw new Error(errorData.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('💥 ERREUR CATCH:', error); // ← AJOUTER
      throw error;
    }
  }, []);


  // 🚪 Fonction de déconnexion
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // 🔍 Validation du token au chargement
  const validateToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result.data.user); // ← CORRECTION : ajouter .data
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur validation token:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🎯 Effect pour valider le token au montage
  useEffect(() => {
    validateToken();
  }, [validateToken]);

  // 📦 Valeur du contexte
  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
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
