import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import LoginForm from '../LoginForm/LoginForm';
import './Footer.scss';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleHeartClick = () => {
    setShowLoginModal(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleHeartClick();
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      // Simulation d'authentification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Vérification des identifiants (à remplacer par ta logique)
      if (email === 'admin@julienclaveldev.com' && password === 'admin123') {
        // Succès - ici tu peux rediriger vers ton admin
        console.log('Connexion réussie ! Bienvenue dans l\'espace admin !');
        alert('Connexion réussie ! Bienvenue dans l\'espace admin !');
        setShowLoginModal(false);
      } else {
        setLoginError('Email ou mot de passe incorrect.');
      }
      
    } catch (error) {
      setLoginError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setShowLoginModal(false);
      setLoginError('');
    }
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
              <span 
                className="footer__heart"
                onClick={handleHeartClick}
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                aria-label="Accès administration"
              >
                ❤️
              </span>
              {' '}et React + TypeScript
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de connexion */}
      {showLoginModal && (
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
