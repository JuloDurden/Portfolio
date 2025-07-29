import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../Modal/Modal';
import LoginForm from '../LoginForm/LoginForm';
import './Footer.scss';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated, user, logout, checkAuthStatus, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // 💖 Gestion du clic sur le cœur - SIMPLIFIÉE
  const handleHeartClick = async () => {
    console.log('💖 Clic sur le cœur - isAuthenticated:', isAuthenticated, 'user:', user);
    
    // Si pas de chargement en cours et utilisateur connecté
    if (!isLoading && isAuthenticated && user) {
      console.log('✅ Utilisateur connecté, redirection vers dashboard');
      navigate('/dashboard');
      return;
    }
    
    // Si en cours de chargement, attendre
    if (isLoading) {
      console.log('⏳ Chargement en cours, attente...');
      return;
    }

    // Vérifier si une session valide existe
    console.log('🔍 Vérification de la session...');
    setIsCheckingAuth(true);
    
    try {
      const isValidSession = await checkAuthStatus();
      
      if (isValidSession) {
        console.log('✅ Session valide trouvée, redirection vers dashboard');
        // Petite attente pour laisser le temps au state de se mettre à jour
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        console.log('❌ Pas de session valide, ouverture du modal');
        setShowLoginModal(true);
      }
    } catch (error) {
      console.error('💥 Erreur lors de la vérification:', error);
      setShowLoginModal(true);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleHeartClick();
    }
  };

  // 🚪 Fermeture du modal
  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  // 📤 Déconnexion
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // 🔍 Fermer le menu utilisateur si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <>
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__content">
            <p>&copy; {currentYear} Julien Clavel | Tous droits réservés.</p>
          </div>
          
          <div className="footer__bottom">
            {/* ✅ STRUCTURE CORRIGÉE - PLUS DE DIV DANS P */}
            <div className="footer__bottom-content">
              <span>Développé avec </span>
              
              {/* 💖 Gestion de l'état connecté/déconnecté */}
              {isLoading ? (
                <span className="footer__heart footer__heart--loading" title="Chargement...">
                  ⏳
                </span>
              ) : isCheckingAuth ? (
                <span className="footer__heart footer__heart--checking" title="Vérification...">
                  🔄
                </span>
              ) : (isAuthenticated && user) ? (
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
                  
                  {/* Menu utilisateur - STRUCTURE CORRIGÉE */}
                  <span className="footer__user-menu">
                    <button
                      className="footer__user-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu(!showUserMenu);
                      }}
                      aria-label="Menu utilisateur"
                    >
                      ⚙️
                    </button>
                    
                    {showUserMenu && (
                      <div className="footer__user-dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="footer__user-info">
                          <strong>{user?.firstName} {user?.lastName}</strong>
                          <br />
                          <small>{user?.email}</small>
                        </div>
                        {/* ✅ SEPARATOR CORRIGÉ - div au lieu de hr */}
                        <div className="footer__separator"></div>
                        <button onClick={() => navigate('/dashboard')}>
                          📊 Dashboard
                        </button>
                        <button onClick={handleLogout} className="footer__logout">
                          🚪 Déconnexion
                        </button>
                      </div>
                    )}
                  </span>
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
              
              <span> et React + TypeScript</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de connexion */}
      {showLoginModal && !isAuthenticated && (
        <Modal 
          title=""
          onClose={handleCloseModal}
          size="small"
          closeOnOverlay={true}
        >
          <LoginForm onClose={handleCloseModal} />
        </Modal>
      )}
    </>
  );
}

export default Footer;
