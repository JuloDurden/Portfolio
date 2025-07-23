import React from 'react';
import { Link } from 'react-router-dom';
import './Error.scss';

const Error: React.FC = () => {
  return (
    <div className="error error-page">
      <div className="error__container">
        <div className="error__illustration error-illustration">
          <div className="tv-container">
            <img 
              src="/tv-snow.gif" 
              alt="TV avec effet neige"
              className="tv-gif"
            />
            <div className="tv-overlay">
              <div className="tv-text">
                <div className="tv-line" data-text="404">404</div>
              </div>
            </div>
          </div>
        </div>
        <div className="error__content error-content">
          <h1 className="error__title error-title">Oops !</h1>
          <h2 className="error__subtitle animate-fade-in-up animate-delay-200">
            On dirait que cette page n'existe pas.
          </h2>
          <p className="error__description animate-fade-in-up animate-delay-300">
            Code d'erreur : 404
          </p>
          
          <div className="error__links animate-fade-in-up animate-delay-400">
            <h3>Voici quelques liens utiles :</h3>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/about">À propos</Link></li>
              <li><Link to="/projects">Projets</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;