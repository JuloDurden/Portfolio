// src/components/Footer/Footer.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../Modal/Modal';
import LoginForm from '../LoginForm/LoginForm';
import './Footer.scss';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, user, login, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 💖 Gestion du clic sur le cœur
  const handleHeartClick = () => {
    if (isAuthenticated) {
      // Si connecté, afficher le menu utilisateur ou rediriger
      navigate('/dashboard');
    } else {
      // Si pas connecté, ouvrir le modal
      setShowLoginModal(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleHeartClick();
    }
  };

  // 🔐 Gestion de la connexion
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // ✅ Connexion réussie
        setShowLoginModal(false);
        navigate('/dashboard');
      } else {
        setLoginError('Email ou mot de passe incorrect.');
      }
      
    } catch (error) {
      setLoginError('Erreur de connexion. Veuillez réessayer.');
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 Fermeture du modal
  const handleCloseModal = () => {
    if (!isLoading) {
      setShowLoginModal(false);
      setLoginError('');
    }
  };

  // 📤 Déconnexion
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__content">
            <p>&copy; {currentYear} Julien Clavel | Tous droits réservés.</p>
          </div>
          
          <div className="footer__bottom">
            <p>
              Développé avec{' '}
              
              {/* 💖 Gestion de l'état connecté/déconnecté */}
              {isAuthenticated ? (
                <span className="footer__admin-section">
                  <span 
                    className="footer__heart footer__heart--admin"
                    onClick={handleHeartClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    aria-label={`Connecté en tant que ${user?.firstName} - Accéder au dashboard`}
                    title={`Connecté en tant que ${user?.firstName} ${user?.lastName}`}
                  >
                    👨‍💻
                  </span>
                  
                  {/* Menu utilisateur */}
                  <div className="footer__user-menu">
                    <button
                      className="footer__user-toggle"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      aria-label="Menu utilisateur"
                    >
                      ⚙️
                    </button>
                    
                    {showUserMenu && (
                      <div className="footer__user-dropdown">
                        <div className="footer__user-info">
                          <strong>{user?.firstName} {user?.lastName}</strong>
                          <small>{user?.email}</small>
                        </div>
                        <hr />
                        <button onClick={() => navigate('/dashboard')}>
                          📊 Dashboard
                        </button>
                        <button onClick={handleLogout} className="footer__logout">
                          🚪 Déconnexion
                        </button>
                      </div>
                    )}
                  </div>
                </span>
              ) : (
                <span 
                  className="footer__heart"
                  onClick={handleHeartClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  aria-label="Accès administration"
                  title="Connexion administrateur"
                >
                  ❤️
                </span>
              )}
              
              {' '}et React + TypeScript
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de connexion */}
      {showLoginModal && !isAuthenticated && (
        <Modal 
          title=""
          onClose={handleCloseModal}
          size="small"
          closeOnOverlay={!isLoading}
        >
          <LoginForm 
            onLogin={handleLogin}
            onClose={handleCloseModal}
            isLoading={isLoading}
            error={loginError}
          />
        </Modal>
      )}
    </>
  );
}

export default Footer;
