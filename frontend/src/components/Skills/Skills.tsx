import React, { useState, useMemo } from 'react';
import skillsData from '../../data/skills.json';
import './Skills.scss';

interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
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
    skillsData.skills.forEach(skill => {
      skill.categories.forEach(cat => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, []);

  // Filtrer les skills selon les catégories sélectionnées
  const filteredSkills = useMemo(() => {
    if (selectedCategories.length === 0) {
      return skillsData.skills;
    }
    return skillsData.skills.filter(skill =>
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

  // 🚀 CORRECTION 1 : TOOLTIP AVEC pageX/pageY (suit le scroll)
  const showTooltip = (skill: Skill, event: React.MouseEvent) => {
    setTooltip({
      skill,
      x: event.pageX, // ← pageX au lieu de clientX
      y: event.pageY  // ← pageY au lieu de clientY
    });
  };

  const updateTooltip = (event: React.MouseEvent) => {
    if (tooltip) {
      setTooltip(prev => prev ? {
        ...prev,
        x: event.pageX, // ← pageX inclut le scroll
        y: event.pageY  // ← pageY inclut le scroll
      } : null);
    }
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
              className={`skills__category-btn ${
                selectedCategories.includes(category) ? 'active' : ''
              }`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Reset button - apparaît seulement si filtres actifs */}
        {selectedCategories.length > 0 && (
          <button 
            className="skills__reset-btn"
            onClick={resetFilters}
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* 🎯 GRILLE DES SKILLS */}
      <div className="skills__grid">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="skills__card"
            onMouseEnter={(e) => showTooltip(skill, e)}
            onMouseMove={updateTooltip}
            onMouseLeave={hideTooltip}
          >
            <div className="skills__card-header">
              <img 
                src={skill.icon} 
                alt={skill.name}
                className="skills__icon"
                loading="lazy" // ← Optimisation performance
              />
              <h3 className="skills__name">{skill.name}</h3>
            </div>
            
            <div className="skills__progress-container">
              <div className="skills__progress-bar">
                <div
                  className="skills__progress-fill"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <span className="skills__level">{skill.level}%</span>
            </div>
            
            <div className="skills__categories-tags">
              {skill.categories.map((category) => (
                <span key={category} className="skills__category-tag">
                  {category}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🎯 TOOLTIP SUIVEUR DE CURSEUR CORRIGÉ */}
      {tooltip && (
        <div
          className="skills__tooltip"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y - 10,
          }}
        >
          <div className="skills__tooltip-header">
            <img 
              src={tooltip.skill.icon} 
              alt={tooltip.skill.name}
              className="skills__tooltip-icon"
              loading="lazy"
            />
            <h4 className="skills__tooltip-title">{tooltip.skill.name}</h4>
          </div>
          
          <p className="skills__tooltip-description">
            {tooltip.skill.description}
          </p>
          
          <div className="skills__tooltip-categories">
            {tooltip.skill.categories.map((category) => (
              <span key={category} className="skills__tooltip-category">
                {category}
              </span>
            ))}
          </div>
          
          <div className="skills__tooltip-level">
            Niveau : <strong>{tooltip.skill.level}%</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
