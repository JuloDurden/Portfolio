import React, { useState, useMemo } from 'react';
import skillsData from '../../data/skills.json';
import './Skills.scss';

interface Skill {
  id: string;
  name: string;
  description: string;
  level: 'Débutant' | 'Junior' | 'Senior'; // ✅ CHANGÉ
  icon: string;
  categories: string[];
}

interface TooltipData {
  skill: Skill;
  x: number;
  y: number;
}

const Skills: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Extraire toutes les catégories uniques
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    (skillsData.skills as Skill[]).forEach(skill => {
      skill.categories.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, []);

  // Filtrer les skills selon les catégories sélectionnées
  const filteredSkills = useMemo(() => {
    if (selectedCategories.length === 0) {
      return skillsData.skills as Skill[];
    }
    return (skillsData.skills as Skill[]).filter(skill =>
      selectedCategories.some(cat => skill.categories.includes(cat))
    );
  }, [selectedCategories]);

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

  // 🎨 NOUVELLES FONCTIONS POUR LES NIVEAUX
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

  // Tooltip functions
  const showTooltip = (skill: Skill, event: React.MouseEvent) => {
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

  return (
    <div className="skills">
      {/* 🎯 FILTRES ULTRA-COMPACTS - MAX 3 LIGNES */}
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

      {/* 🎯 GRILLE SKILLS AVEC NOUVEAUX NIVEAUX */}
      <div className="skills__grid">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="skills__card"
            onMouseEnter={(e) => showTooltip(skill, e)}
            onMouseLeave={hideTooltip}
          >
            <div className="skills__card-header">
              <img 
                src={skill.icon}
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
              <div className="skills__fallback-icon">
                <i className={`fab fa-${skill.icon}`}></i>
              </div>
              <h3 className="skills__card-title">{skill.name}</h3>
            </div>
            
            {/* 🎨 NOUVEAU SYSTÈME DE NIVEAU */}
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

      {/* 🎯 TOOLTIP MODIFIÉ */}
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
              src={tooltip.skill.icon} 
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
