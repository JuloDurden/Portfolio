import React from 'react';
import './Biography.scss';
import { useUserData } from '../../hooks/useUserData';
import DefaultProfilePicture from './img/julien-clavel.webp';

const Biography: React.FC = () => {
  const { biographyData, loading, error } = useUserData();

  // 🔄 LOADING STATE
  if (loading) {
    return (
      <div className="biography">
        <div className="biography__loading">
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    console.error('Biography error:', error);
    return (
      <div className="biography">
        <div className="biography__error">
          <p>Erreur lors du chargement des données</p>
          <p className="biography__error-details">{error}</p>
        </div>
      </div>
    );
  }

  // 📄 PAS DE DONNÉES
  if (!biographyData) {
    return (
      <div className="biography">
        <div className="biography__no-data">
          <p>Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="biography">
      <div className="biography__content">
        
        {/* 📸 PROFILE SECTION (GAUCHE) - CADRE UNIQUE */}
        <div className="biography__profile">
          <div className="biography__photo">
            <img 
              src={biographyData.profilePicture || DefaultProfilePicture} 
              alt={`${biographyData.fullName} - ${biographyData.currentJob}`}
              loading="lazy"
              onError={(e) => {
                console.warn('Profile picture failed to load, using default');
                (e.target as HTMLImageElement).src = DefaultProfilePicture;
              }}
            />
          </div>
          
          <div className="biography__basic-info">
            <h3 className="biography__name">{biographyData.fullName}</h3>
            <p className="biography__age">{biographyData.age} ans</p>
            <p className="biography__role">{biographyData.currentJob}</p>
          </div>

          {/* 🎯 SECTION HOBBIES DYNAMIQUE */}
          {biographyData.hobbies.length > 0 && (
            <div className="biography__hobbies">
              <h4 className="biography__hobbies-title">🎯 Mes passions</h4>
              <div className="biography__hobbies-list">
                {biographyData.hobbies.map((hobby, index) => (
                  <div key={index} className="biography__hobby">
                    <span className="biography__hobby-icon">•</span>
                    <span className="biography__hobby-text">{hobby}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 📝 BIOGRAPHIE DÉTAILLÉE (DROITE) - CADRE UNIQUE */}
        <div className="biography__details">
          <h4 className="biography__section-title">Qui suis-je ?</h4>
          
          {/* 🎯 INTRODUCTION */}
          {biographyData.biography.introduction && (
            <p className="biography__text">
              {biographyData.biography.introduction}
            </p>
          )}
          
          {/* 🎯 PARCOURS */}
          {biographyData.biography.journey && (
            <p className="biography__text">
              {biographyData.biography.journey}
            </p>
          )}
          
          {/* 🎯 OBJECTIFS */}
          {biographyData.biography.goals && (
            <p className="biography__text">
              {biographyData.biography.goals}
            </p>
          )}
          
          {/* 🎯 FALLBACK SI AUCUNE BIOGRAPHIE */}
          {!biographyData.biography.introduction && 
           !biographyData.biography.journey && 
           !biographyData.biography.goals && (
            <p className="biography__text">
              Biographie en cours de rédaction...
            </p>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Biography;
