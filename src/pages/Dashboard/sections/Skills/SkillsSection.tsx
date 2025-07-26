import React, { useState, useEffect, useRef } from 'react';
import SkillForm from './SkillForm';
import Modal from '../../../../components/Modal/Modal';
import { Skill, SkillsApiResponse, SkillApiResponse, SkillFormData } from './types';
import './SkillsSection.scss';
import { API_BASE_URL, getAuthHeaders, getAuthHeadersForFormData } from '../../../../config/api';

const SkillsSection: React.FC = () => {
  // 🎯 États locaux
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🔄 Ref pour éviter les problèmes de démontage
  const mountedRef = useRef(true);
  const imageErrorRef = useRef(new Set<string>());

  // 🔄 Chargement initial - VERSION ULTRA SIMPLE
  useEffect(() => {
    let mounted = true;
    
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/skills?isVisible=true`, {
          headers: getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (mounted && data.success) {
          setSkills(data.data || []);
        } else if (mounted) {
          setError(data.message || 'Erreur de chargement');
        }
      } catch (error) {
        if (mounted) {
          setError(error.message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    load();
    
    return () => {
      mounted = false;
      mountedRef.current = false;
    };
  }, []);

  // 🖼️ Construire l'URL complète pour les images - VERSION FINALE
  const getImageUrl = (iconPath: string): string => {
    console.log('🖼️ getImageUrl INPUT:', iconPath);
    
    if (!iconPath) return '/icons/default.svg';
    if (iconPath.startsWith('http')) return iconPath;
    
    // 🔥 CORRECTION : Force HTTPS et bon format
    let cleanPath = iconPath;
    
    // Nettoie le path - enlève "uploads/skills/" si présent
    if (cleanPath.includes('uploads/skills/')) {
      cleanPath = cleanPath.replace('uploads/skills/', '');
    }
    
    // 🚀 Force le bon format d'URL
    const finalUrl = `${API_BASE_URL}/uploads/skills/${cleanPath}`;
    console.log('🖼️ getImageUrl OUTPUT:', finalUrl);
    return finalUrl;
  };

  // 📂 Charger les compétences - VERSION SIMPLE
  const loadSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/skills?isVisible=true`, {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSkills(data.data || []);
      } else {
        setError(data.message || 'Erreur de chargement');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 📂 Obtenir les catégories existantes
  const getExistingCategories = (): string[] => {
    const categories = skills.flatMap(skill => skill.categories || []);
    const uniqueCategories = [...new Set(categories)].sort();
    return uniqueCategories;
  };

  // 📊 Calculer les statistiques
  const getSkillStats = () => {
    const total = skills.length;
    const byLevel = {
      'Débutant': skills.filter(s => s.level === 'Débutant').length,
      'Junior': skills.filter(s => s.level === 'Junior').length,
      'Senior': skills.filter(s => s.level === 'Senior').length
    };
    const featured = skills.filter(s => s.featured).length;

    return { total, byLevel, featured };
  };

  // 🎨 Obtenir les infos de niveau avec couleurs
  const getLevelInfo = (level: string) => {
    const levels = {
      'Débutant': { 
        icon: '🌱', 
        className: 'level-beginner',
        color: '#ef4444', 
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)'
      },
      'Junior': { 
        icon: '⚡', 
        className: 'level-junior',
        color: '#22c55e', 
        bgColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.3)'
      },
      'Senior': { 
        icon: '🚀', 
        className: 'level-senior',
        color: '#3b82f6', 
        bgColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 0.3)'
      }
    };
    return levels[level as keyof typeof levels] || levels['Débutant'];
  };

  // ➕ Ajouter une compétence
  const handleAddSkill = () => {
    setEditingSkill(undefined);
    setIsModalOpen(true);
  };

  // ✏️ Modifier une compétence - VERSION DEBUG
  const handleEditSkill = (skill: Skill) => {
    console.log('🔧 EDIT SKILL:', { 
      id: skill._id, 
      name: skill.name,
      fullSkill: skill 
    });
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  // 🗑️ Supprimer une compétence - VERSION DEBUG
  const handleDeleteSkill = async (skill: Skill) => {
    console.log('🗑️ DELETE SKILL:', { 
      id: skill._id, 
      name: skill.name,
      fullSkill: skill 
    });
    
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${skill.name}" ?`)) {
      return;
    }

    try {
      const url = `${API_BASE_URL}/api/skills/${skill._id}`;
      console.log('🔗 DELETE URL:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data: SkillApiResponse = await response.json();

      if (data.success) {
        await loadSkills();
      } else {
        alert(`Erreur: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      alert(`Erreur lors de la suppression: ${error.message}`);
    }
  };

  // 💾 Sauvegarder une compétence - VERSION DEBUG
  const handleSaveSkill = async (skillData: SkillFormData) => {
    console.log('💾 SAVE SKILL DATA:', skillData);
    console.log('📝 EDITING SKILL:', editingSkill);
    console.log('💾 SAVE SKILL - ID:', skill._id, 'TYPE:', typeof skill._id);
    console.log('🌐 REQUEST URL:', `${API_BASE_URL}/api/skills/${skill._id}`);

    
    try {
      const formData = new FormData();
      
      const skillId = editingSkill?.id || `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      formData.append('id', skillId);
      
      formData.append('name', skillData.name.trim());
      formData.append('level', skillData.level);
      formData.append('featured', String(skillData.featured || false));
      formData.append('isVisible', String(skillData.isVisible ?? true));
      formData.append('order', String(skillData.order || 0));
      
      if (skillData.description?.trim()) {
        formData.append('description', skillData.description.trim());
      }
      
      skillData.categories.forEach((category, index) => {
        if (category.trim()) {
          formData.append(`categories[${index}]`, category.trim());
        }
      });
      
      if (skillData.icon instanceof File) {
        formData.append('icon', skillData.icon);
      } else if (typeof skillData.icon === 'string' && skillData.icon.trim()) {
        formData.append('icon', skillData.icon.trim());
      }

      const url = editingSkill 
        ? `${API_BASE_URL}/api/skills/${editingSkill._id}` 
        : `${API_BASE_URL}/api/skills`;
      const method = editingSkill ? 'PUT' : 'POST';

      console.log('🌐 REQUEST URL:', url);
      console.log('📡 REQUEST METHOD:', method);

      const response = await fetch(url, {
        method,
        headers: getAuthHeadersForFormData(),
        body: formData
      });

      const responseText = await response.text();
      let data: SkillApiResponse;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Réponse serveur invalide: ${responseText.substring(0, 200)}...`);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.message || 'Erreur serveur'}`);
      }

      if (data.success) {
        setIsModalOpen(false);
        setEditingSkill(undefined);
        
        setTimeout(() => {
          loadSkills();
        }, 300);
      } else {
        throw new Error(data.message || 'Erreur inconnue');
      }
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // 🚫 Fermer modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(undefined);
  };

  // 🖼️ Gestion des erreurs d'images
  const handleImageError = (skill: Skill, e: React.SyntheticEvent<HTMLImageElement>) => {
    const imageKey = `${skill._id}-${skill.icon}`;
    
    if (!imageErrorRef.current.has(imageKey)) {
      imageErrorRef.current.add(imageKey);
      (e.target as HTMLImageElement).src = '/icons/default.svg';
    }
  };

  const stats = getSkillStats();

  return (
    <>
      <section className="skills-section">
        <div className="skills-section__header">
          <div className="skills-section__title-group">
            <h2 className="skills-section__title">
              <span className="skills-section__icon">🛠️</span>
              Compétences Techniques
            </h2>
            <p className="skills-section__subtitle">
              Gérez vos compétences et niveaux d'expertise
            </p>
          </div>

          <button 
            onClick={handleAddSkill}
            className="skills-section__add-btn"
            disabled={isLoading}
          >
            <span className="skills-section__add-icon">➕</span>
            Ajouter une compétence
          </button>
        </div>

        {error && (
          <div className="skills-section__error">
            <span className="error-icon">❌</span>
            <span>{error}</span>
            <button onClick={loadSkills} className="retry-btn">🔄 Réessayer</button>
          </div>
        )}

        <div className="skills-section__stats">
          <div className="stat-card">
            <div className="stat-card__icon">🎯</div>
            <div className="stat-card__content">
              <span className="stat-card__label"> Total : </span>
              <span className="stat-card__number">{stats.total}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon">🚀</div>
            <div className="stat-card__content">
              <span className="stat-card__label"> Expert : </span>
              <span className="stat-card__number">{stats.byLevel['Senior']}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon">⚡</div>
            <div className="stat-card__content">
              <span className="stat-card__label"> Avancé : </span>
              <span className="stat-card__number">{stats.byLevel['Junior']}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon">⭐</div>
            <div className="stat-card__content">
              <span className="stat-card__label"> Mis en avant : </span>
              <span className="stat-card__number">{stats.featured}</span>
            </div>
          </div>
        </div>

        <div className="skills-section__content">
          {isLoading ? (
            <div className="skills-section__loading">
              <div className="loading-spinner"></div>
              <span>Chargement des compétences...</span>
            </div>
          ) : skills.length > 0 ? (
            <div className="skills-section__grid">
              {skills.map((skill) => {
                const levelInfo = getLevelInfo(skill.level);
                return (
                  <div key={skill._id} className="skill-card">
                    <div className="skill-card__header">
                      <div className="skill-card__icon-container">
                        <img 
                          src={getImageUrl(skill.icon)} 
                          alt={skill.name}
                          className="skill-card__icon"
                          onError={(e) => handleImageError(skill, e)}
                        />
                      </div>
                      
                      <div className="skill-card__actions">
                        {skill.featured && (
                          <div className="skill-card__featured-badge">⭐</div>
                        )}
                        <button
                          onClick={() => handleEditSkill(skill)}
                          className="skill-card__action-btn skill-card__action-btn--edit"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill)}
                          className="skill-card__action-btn skill-card__action-btn--delete"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="skill-card__content">
                      <h3 className="skill-card__name">{skill.name}</h3>
                      {skill.description && (
                        <p className="skill-card__description">{skill.description}</p>
                      )}

                      <div className="skill-card__footer">
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
          ) : !isLoading ? (
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
          ) : null}
        </div>
      </section>

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
