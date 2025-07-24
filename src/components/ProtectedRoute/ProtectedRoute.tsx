import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth(); // ← CHANGER isAuthenticated en user
  const location = useLocation();

  console.log('🔐 ProtectedRoute - USER:', user); // ← DEBUG
  console.log('⏳ ProtectedRoute - LOADING:', isLoading); // ← DEBUG

  // ⏳ Chargement en cours
  if (isLoading) {
    return (
      <div className="loading">
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  // 🔐 Pas connecté → redirection vers l'accueil
  if (!user) { // ← CHANGER !isAuthenticated en !user
    console.log('❌ ProtectedRoute - PAS CONNECTÉ, REDIRECTION VERS /'); // ← DEBUG
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log('✅ ProtectedRoute - CONNECTÉ, AFFICHAGE DASHBOARD'); // ← DEBUG
  // ✅ Connecté → affichage du contenu
  return <>{children}</>;
};

export default ProtectedRoute;
