import React, { useState, useMemo } from 'react';
import { useSkills } from '../../hooks/useSkills';
import './Skills.scss';

interface TooltipData {
  skill: SkillData;
  x: number;
  y: number;
}

interface SkillData {
  _id: string;
  id: string;
  name: string;
  description: string;
  level: string;
  icon: string;
  categories: string[];
  isVisible: boolean;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const Skills: React.FC = () => {
  const { visibleSkills, loading, error } = useSkills();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Extraire toutes les catégories uniques depuis l'API
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    visibleSkills.forEach(skill => {
      skill.categories.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [visibleSkills]);

  // Filtrer les skills selon les catégories sélectionnées
  const filteredSkills = useMemo(() => {
    if (selectedCategories.length === 0) {
      return visibleSkills.sort((a, b) => a.order - b.order);
    }
    return visibleSkills
      .filter(skill => 
        selectedCategories.some(cat => skill.categories.includes(cat))
      )
      .sort((a, b) => a.order - b.order);
  }, [visibleSkills, selectedCategories]);

  // Gérer la sélection des catégories
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSelectedCategories([]);
  };

  // 🎨 FONCTIONS POUR LES NIVEAUX
  const getLevelClass = (level: string): string => {
    switch (level) {
      case 'Débutant': return 'beginner';
      case 'Junior': return 'junior';
      case 'Senior': return 'senior';
      default: return 'beginner';
    }
  };

  const getLevelIcon = (level: string): string => {
    switch (level) {
      case 'Débutant': return '🌱';
      case 'Junior': return '⚡';
      case 'Senior': return '🚀';
      default: return '🌱';
    }
  };

  // Fonction pour formater l'URL Cloudinary
  const getImageUrl = (iconPath: string): string => {
    if (!iconPath) return '';
    
    // Si c'est déjà une URL complète, la retourner
    if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
      return iconPath;
    }
    
    // Si c'est un path Cloudinary, construire l'URL
    if (iconPath.includes('skill-icons/')) {
      return `https://res.cloudinary.com/dudq3pjid/image/upload/${iconPath}`;
    }
    
    return iconPath;
  };

  // Tooltip functions
  const showTooltip = (skill: SkillData, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      skill,
      x: event.clientX,
      y: event.clientY
    });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  // 🔄 ÉTATS DE CHARGEMENT ET ERREUR
  if (loading) {
    return (
      <div className="skills">
        <div className="skills__loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Chargement des compétences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="skills">
        <div className="skills__error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Erreur lors du chargement : {error}</p>
        </div>
      </div>
    );
  }

  if (visibleSkills.length === 0) {
    return (
      <div className="skills">
        <div className="skills__empty">
          <i className="fas fa-tools"></i>
          <p>Aucune compétence à afficher pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="skills">
      {/* 🎯 FILTRES DYNAMIQUES DEPUIS L'API */}
      <div className="skills__filters">
        <div className="skills__categories">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`skills__category-btn ${
                selectedCategories.includes(category) ? 'active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {selectedCategories.length > 0 && (
          <button className="skills__reset-btn" onClick={resetFilters}>
            <i className="fas fa-times"></i>
            Réinitialiser
          </button>
        )}
      </div>

      {/* 🎯 GRILLE SKILLS DEPUIS L'API */}
      <div className="skills__grid">
        {filteredSkills.map((skill) => (
          <div
            key={skill._id}
            className="skills__card"
            onMouseEnter={(e) => showTooltip(skill, e)}
            onMouseLeave={hideTooltip}
          >
            <div className="skills__card-header">
              <img 
                src={getImageUrl(skill.icon)}
                alt={skill.name}
                className="skills__card-icon"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.skills__fallback-icon');
                  if (fallback) {
                    (fallback as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              <div className="skills__fallback-icon" style={{ display: 'none' }}>
                <i className="fas fa-code"></i>
              </div>
              <h3 className="skills__card-title">{skill.name}</h3>
            </div>
            
            {/* 🎨 SYSTÈME DE NIVEAU DEPUIS L'API */}
            <div className="skills__card-body">
              <div className={`skills__level-badge ${getLevelClass(skill.level)}`}>
                <span className="skills__level-icon">
                  Niveau : {getLevelIcon(skill.level)}
                </span>
                <span className="skills__level-text">
                  {skill.level}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🎯 TOOLTIP AVEC DONNÉES API */}
      {tooltip && (
        <div 
          className="skills__tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%) translateY(-100%)',
            zIndex: 1000
          }}
        >
          <div className="skills__tooltip-header">
            <img 
              src={getImageUrl(tooltip.skill.icon)} 
              alt={tooltip.skill.name}
              className="skills__tooltip-icon"
            />
            <h4 className="skills__tooltip-title">{tooltip.skill.name}</h4>
          </div>
          <p className="skills__tooltip-description">
            {tooltip.skill.description}
          </p>
          <div className="skills__tooltip-categories">
            {tooltip.skill.categories.map(cat => (
              <span key={cat} className="skills__tooltip-category">
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
