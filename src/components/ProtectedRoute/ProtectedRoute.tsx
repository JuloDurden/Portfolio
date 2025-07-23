import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // ⏳ Chargement en cours
  if (isLoading) {
    return (
      <div className="loading">
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  // 🔐 Pas connecté → redirection vers l'accueil
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // ✅ Connecté → affichage du contenu
  return <>{children}</>;
};

export default ProtectedRoute;
