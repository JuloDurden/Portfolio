import React from 'react';
import './Biography.scss';
import ProfilePicture from './img/julien-clavel.webp'

const Biography: React.FC = () => {
  // 🎯 CALCUL DE L'ÂGE AUTOMATIQUE
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const age = calculateAge('1982-12-02');

  return (
    <div className="biography">
      <div className="biography__content">
        
        {/* 📸 PROFILE SECTION (GAUCHE) - CADRE UNIQUE */}
        <div className="biography__profile">
          <div className="biography__photo">
            <img 
              src={ ProfilePicture } 
              alt="Julien Clavel - Développeur Web"
              loading="lazy"
            />
          </div>
          
          <div className="biography__basic-info">
            <h3 className="biography__name">Julien Clavel</h3>
            <p className="biography__age">{age} ans</p>
            <p className="biography__role">Développeur Web</p>
          </div>
        </div>
        
        {/* 📝 BIOGRAPHIE DÉTAILLÉE (DROITE) - CADRE UNIQUE */}
        <div className="biography__details">
          <h4 className="biography__section-title">Qui suis-je ?</h4>
          
          <p className="biography__text">
            Passionné depuis toujours par l'informatique, j'ai toujours cherché à décortiquer et comprendre tout ce que je vois dans un écran d'ordinateur. Mon parcours atypique m'a permis d'acquérir une expérience solide de travail au cœur de nombreuses équipes de toutes tailles.
          </p>
          
          <p className="biography__text">
            Aujourd'hui Développeur web, je me spécialise dans la création d'applications web modernes et performantes. J'aime transformer des idées complexes en solutions digitales élégantes et fonctionnelles. Mon approche combine créativité, rigueur technique et attention particulière à l'expérience utilisateur pour créer des projets qui marquent et qui durent.
          </p>
          
          <p className="biography__text">
            Mes compétences organisationnelles et mon souci du détail sont mes atouts clés. Je prends en charge des projets de toutes tailles et contribue à leur développement pour améliorer leur qualité et leur efficacité. Toujours en veille technologique, je m'efforce de rester à la pointe des dernières innovations.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Biography;
