import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('🔐 ProtectedRoute - USER:', user);
  console.log('⏳ ProtectedRoute - LOADING:', isLoading);
  console.log('🔑 ProtectedRoute - AUTHENTICATED:', isAuthenticated);

  // ⏳ Chargement en cours
  if (isLoading) {
    return (
      <div className="loading" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '1.2rem'
      }}>
        <p>⏳ Vérification de l'authentification...</p>
      </div>
    );
  }

  // 🔐 Pas connecté OU pas d'utilisateur → redirection vers l'accueil
  if (!isAuthenticated || !user) {
    console.log('❌ ProtectedRoute - PAS CONNECTÉ, REDIRECTION VERS /');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log('✅ ProtectedRoute - CONNECTÉ, AFFICHAGE DASHBOARD');
  // ✅ Connecté → affichage du contenu
  return <>{children}</>;
};

export default ProtectedRoute;
