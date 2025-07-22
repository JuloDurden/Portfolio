import React, { useState, useEffect } from 'react';
import SkillForm from './SkillForm';
import Modal from '../../../../components/Modal/Modal';
import { Skill } from './types';
import './SkillsSection.scss';

const SkillsSection: React.FC = () => {
  // 🎯 États locaux
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Chargement initial des compétences
  useEffect(() => {
    loadSkills();
  }, []);

  // 📂 Charger les compétences
  const loadSkills = async () => {
    try {
      setIsLoading(true);
      
      // 🎭 MOCK temporaire
      const mockSkills: Skill[] = [
        {
          id: '1',
          name: 'React',
          description: 'Bibliothèque JavaScript pour créer des interfaces utilisateur',
          level: 90,
          icon: '/icons/react.svg',
          categories: ['Frontend', 'JavaScript']
        },
        {
          id: '2',
          name: 'TypeScript',
          description: 'Superset typé de JavaScript',
          level: 85,
          icon: '/icons/typescript.svg',
          categories: ['Frontend', 'Backend', 'JavaScript']
        },
        {
          id: '3',
          name: 'Node.js',
          description: 'Runtime JavaScript côté serveur',
          level: 80,
          icon: '/icons/nodejs.svg',
          categories: ['Backend', 'JavaScript']
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
  const handleEditSkill = (skill: Skill) => {
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
  const handleSaveSkill = async (skillData: Omit<Skill, 'id'>) => {
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
        const newSkill: Skill = {
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

  // 🎨 Couleur selon le niveau
  const getLevelColor = (level: number): string => {
    if (level >= 80) return '#22c55e'; // Vert
    if (level >= 60) return '#3b82f6'; // Bleu
    if (level >= 40) return '#f59e0b'; // Orange
    return '#ef4444'; // Rouge
  };

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

        {/* STATUS BAR */}
        <div className="skills-section__status">
          <div className="skills-section__status-item">
            <span className="skills-section__status-label">Total :</span>
            <span className="skills-section__status-value">{skills.length} compétences</span>
          </div>
          <div className="skills-section__status-item">
            <span className="skills-section__status-label">Catégories :</span>
            <span className="skills-section__status-value">{getExistingCategories().length}</span>
          </div>
          <div className="skills-section__status-item">
            <span className="skills-section__status-label">Niveau moyen :</span>
            <span className="skills-section__status-value">
              {skills.length > 0 ? Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length) : 0}%
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="skills-section__content">
          {skills.length > 0 ? (
            <div className="skills-grid">
              {skills.map((skill) => (
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

                    <div className="skill-card__level">
                      <div className="skill-card__level-label">
                        <span>Niveau</span>
                        <span className="skill-card__level-value">{skill.level}%</span>
                      </div>
                      <div className="skill-card__level-bar">
                        <div 
                          className="skill-card__level-progress"
                          style={{ 
                            width: `${skill.level}%`,
                            backgroundColor: getLevelColor(skill.level)
                          }}
                        />
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
              ))}
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
