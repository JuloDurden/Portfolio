import React, { useState, useEffect } from 'react';
import SkillForm from './SkillForm';
import Modal from '../../../../components/Modal/Modal';
import { Skill } from './types';
import './SkillsSection.scss';

// 🎯 TYPE MODIFIÉ POUR LES 3 NIVEAUX
type SkillLevel = 'Débutant' | 'Junior' | 'Senior';

interface ModifiedSkill extends Omit<Skill, 'level'> {
  level: SkillLevel;
}

const SkillsSection: React.FC = () => {
  // 🎯 États locaux
  const [skills, setSkills] = useState<ModifiedSkill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<ModifiedSkill | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Chargement initial des compétences
  useEffect(() => {
    loadSkills();
  }, []);

  // 📂 Charger les compétences
  const loadSkills = async () => {
    try {
      setIsLoading(true);
      
      // 🎭 MOCK temporaire avec nouveaux niveaux
      const mockSkills: ModifiedSkill[] = [
        {
          id: '1',
          name: 'React',
          description: 'Bibliothèque JavaScript pour créer des interfaces utilisateur',
          level: 'Senior',
          icon: '/icons/react.svg',
          categories: ['Frontend', 'JavaScript']
        },
        {
          id: '2',
          name: 'TypeScript',
          description: 'Superset typé de JavaScript',
          level: 'Senior',
          icon: '/icons/typescript.svg',
          categories: ['Frontend', 'Backend', 'JavaScript']
        },
        {
          id: '3',
          name: 'Node.js',
          description: 'Runtime JavaScript côté serveur',
          level: 'Junior',
          icon: '/icons/nodejs.svg',
          categories: ['Backend', 'JavaScript']
        },
        {
          id: '4',
          name: 'Python',
          description: 'Langage de programmation polyvalent',
          level: 'Débutant',
          icon: '/icons/python.svg',
          categories: ['Backend', 'Data Science']
        }
      ];
      
      setSkills(mockSkills);
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 📂 Obtenir les catégories existantes
  const getExistingCategories = (): string[] => {
    const categories = skills.flatMap(skill => skill.categories || []);
    return Array.from(new Set(categories));
  };

  // ➕ Ouvrir la modale d'ajout
  const handleAddSkill = () => {
    console.log('🚀 Ouverture modal ajout');
    setEditingSkill(undefined);
    setIsModalOpen(true);
  };

  // ✏️ Ouvrir la modale d'édition
  const handleEditSkill = (skill: ModifiedSkill) => {
    console.log('✏️ Ouverture modal édition:', skill.name);
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  // 🚪 Fermer la modale
  const handleCloseModal = () => {
    console.log('🚪 Fermeture modal');
    setIsModalOpen(false);
    setEditingSkill(undefined);
  };

  // 💾 Sauvegarder une compétence
  const handleSaveSkill = async (skillData: Omit<ModifiedSkill, 'id'>) => {
    try {
      console.log('💾 Sauvegarde:', skillData);
      
      if (editingSkill) {
        // ✏️ Modification
        const updatedSkill = { ...editingSkill, ...skillData };
        setSkills(prev => prev.map(skill => 
          skill.id === editingSkill.id ? updatedSkill : skill
        ));
      } else {
        // ➕ Ajout
        const newSkill: ModifiedSkill = {
          id: Date.now().toString(),
          ...skillData
        };
        setSkills(prev => [...prev, newSkill]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // 🗑️ Supprimer une compétence
  const handleDeleteSkill = async (skillId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      try {
        setSkills(prev => prev.filter(skill => skill.id !== skillId));
        console.log('🗑️ Compétence supprimée:', skillId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // 🎨 NOUVELLES FONCTIONS POUR LES NIVEAUX
  const getLevelInfo = (level: SkillLevel) => {
    switch (level) {
      case 'Débutant':
        return {
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          icon: '🌱',
          className: 'beginner'
        };
      case 'Junior':
        return {
          color: '#22c55e',
          bgColor: 'rgba(34, 197, 94, 0.1)',
          borderColor: 'rgba(34, 197, 94, 0.3)',
          icon: '⚡',
          className: 'junior'
        };
      case 'Senior':
        return {
          color: '#3b82f6',
          bgColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          icon: '🚀',
          className: 'senior'
        };
    }
  };

  // 📊 Calculer les statistiques
  const getStats = () => {
    const levelCounts = skills.reduce((acc, skill) => {
      acc[skill.level] = (acc[skill.level] || 0) + 1;
      return acc;
    }, {} as Record<SkillLevel, number>);

    return {
      total: skills.length,
      categories: getExistingCategories().length,
      beginners: levelCounts['Débutant'] || 0,
      juniors: levelCounts['Junior'] || 0,
      seniors: levelCounts['Senior'] || 0
    };
  };

  const stats = getStats();

  // 🔄 Loading
  if (isLoading) {
    return (
      <section className="skills-section">
        <div className="skills-section__header">
          <div className="skills-section__title-group">
            <h2 className="skills-section__title">🛠️ Compétences</h2>
          </div>
        </div>
        <div className="skills-section__content">
          <div className="skills-section__loading">
            <div className="skills-section__spinner"></div>
            <p>Chargement des compétences...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* 🛠️ SECTION SKILLS */}
      <section id="skills-section" className="skills-section">
        {/* HEADER */}
        <div className="skills-section__header">
          <div className="skills-section__title-group">
            <h2 className="skills-section__title">
              🛠️ Compétences Techniques
            </h2>
            <p className="skills-section__description">
              Gérez vos compétences et votre niveau d'expertise
            </p>
          </div>
          
          <div className="skills-section__actions">
            <button 
              onClick={handleAddSkill}
              className="skills-section__add-btn"
            >
              ➕ Ajouter une compétence
            </button>
          </div>
        </div>

        {/* STATUS BAR AMÉLIORÉE */}
        <div className="skills-section__status">
          <div className="skills-section__status-item">
            <span className="skills-section__status-label">Total :</span>
            <span className="skills-section__status-value">{stats.total} compétences</span>
          </div>
          <div className="skills-section__status-item">
            <span className="skills-section__status-label">Catégories :</span>
            <span className="skills-section__status-value">{stats.categories}</span>
          </div>
          <div className="skills-section__status-item">
            <span className="skills-section__status-label">🌱 Débutant :</span>
            <span className="skills-section__status-value">{stats.beginners}</span>
          </div>
          <div className="skills-section__status-item">
            <span className="skills-section__status-label">⚡ Junior :</span>
            <span className="skills-section__status-value">{stats.juniors}</span>
          </div>
          <div className="skills-section__status-item">
            <span className="skills-section__status-label">🚀 Senior :</span>
            <span className="skills-section__status-value">{stats.seniors}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="skills-section__content">
          {skills.length > 0 ? (
            <div className="skills-grid">
              {skills.map((skill) => {
                const levelInfo = getLevelInfo(skill.level);
                
                return (
                  <div key={skill.id} className="skill-card">
                    
                    {/* Header avec icône et actions */}
                    <div className="skill-card__header">
                      <div className="skill-card__icon">
                        {skill.icon ? (
                          <img src={skill.icon} alt={skill.name} />
                        ) : (
                          <span className="skill-card__icon-placeholder">
                            {skill.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="skill-card__actions">
                        <button
                          onClick={() => handleEditSkill(skill)}
                          className="skill-card__action-btn skill-card__action-btn--edit"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="skill-card__action-btn skill-card__action-btn--delete"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="skill-card__content">
                      <h3 className="skill-card__name">{skill.name}</h3>
                      {skill.description && (
                        <p className="skill-card__description">{skill.description}</p>
                      )}

                      {/* ✅ NOUVEAU SYSTÈME DE NIVEAU - BADGE */}
                      <div className="skill-card__level">
                        <div className="skill-card__level-badge-container">
                          <div 
                            className={`skill-card__level-badge ${levelInfo.className}`}
                            style={{
                              backgroundColor: levelInfo.bgColor,
                              color: levelInfo.color,
                              borderColor: levelInfo.borderColor
                            }}
                          >
                            <span className="skill-card__level-icon">{levelInfo.icon}</span>
                            <span className="skill-card__level-text">{skill.level}</span>
                          </div>
                        </div>
                      </div>

                      {skill.categories && skill.categories.length > 0 && (
                        <div className="skill-card__categories">
                          {skill.categories.map((category, index) => (
                            <span key={index} className="skill-card__category-tag">
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="skills-section__empty">
              <div className="skills-section__empty-icon">🛠️</div>
              <h3 className="skills-section__empty-title">Aucune compétence</h3>
              <p className="skills-section__empty-text">
                Commencez par ajouter votre première compétence
              </p>
              <button 
                onClick={handleAddSkill}
                className="skills-section__add-btn skills-section__add-btn--primary"
              >
                ➕ Ajouter ma première compétence
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 🚨 MODAL */}
      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          title={editingSkill ? 'Modifier la compétence' : 'Ajouter une compétence'}
          size="medium"
        >
          <SkillForm
            skill={editingSkill}
            existingCategories={getExistingCategories()}
            onSubmit={handleSaveSkill}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </>
  );
};

export default SkillsSection;
