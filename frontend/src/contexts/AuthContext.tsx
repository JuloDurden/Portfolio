import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 🏷️ Types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// 🎯 Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔧 Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 Vérifier si un token existe au démarrage
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      // Vérifier la validité du token auprès du serveur
      validateToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // ✅ Valider le token
  const validateToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setToken(token);
      } else {
        // Token invalide, on le supprime
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Erreur validation token:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Connexion
  // const login = async (email: string, password: string): Promise<boolean> => {
  //   try {
  //     setIsLoading(true);
      
  //     const response = await fetch('http://localhost:5000/api/auth/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ email, password })
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
        
  //       // Sauvegarder le token et les infos utilisateur
  //       setToken(data.token);
  //       setUser(data.user);
  //       localStorage.setItem('authToken', data.token);
        
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de la connexion:', error);
  //     return false;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock temporaire avec tes identifiants
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@julienclaveldev.com' && password === 'admin123') {
        const userData = {
          id: '1',
          firstName: 'Julien',
          lastName: 'Clavel',
          email: 'admin@julienclaveldev.com'
        };
        
        const mockToken = 'mock-jwt-token-julien-clavel';
        
        setUser(userData);
        setToken(mockToken);
        localStorage.setItem('authToken', mockToken);
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 Déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 🎣 Hook personnalisé pour utiliser le contexte
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
