import React, { useState } from 'react';
import Modal from '../../../../components/Modal/Modal';
import ExperienceForm from './ExperienceForm';
import useExperiences from '../../../../hooks/useExperiences';
import { 
  Experience, 
  ExperienceFormData
} from './types';
import './ExperiencesSection.scss';

const ExperiencesSection: React.FC = () => {
  // ====================================
  // 🪝 HOOK PERSONNALISÉ
  // ====================================
  const {
    experiences,
    loading,
    error,
    stats,
    createExperience,
    updateExperience,
    deleteExperience,
    clearError
  } = useExperiences();

  // ====================================
  // 🔄 ÉTATS LOCAUX
  // ====================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ====================================
  // 🔄 TRI ET GROUPEMENT
  // ====================================
  const sortedExperiences = [...experiences].sort((a, b) => {
    // D'abord par type (formations puis expériences)
    if (a.type !== b.type) {
      return a.type === 'formation' ? -1 : 1;
    }
    // Puis par date (plus récent en premier)
    const dateA = new Date(a.endDate || a.startDate);
    const dateB = new Date(b.endDate || b.startDate);
    return dateB.getTime() - dateA.getTime();
  });

  const formations = sortedExperiences.filter(exp => exp.type === 'formation');
  const experiencesProf = sortedExperiences.filter(exp => exp.type === 'experience');

  // ====================================
  // 📅 FORMATAGE DES DATES
  // ====================================
  const formatDate = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = new Date(startDate).toLocaleDateString('fr-FR', {
      month: 'short',
      year: 'numeric'
    });
    
    if (isCurrent) {
      return `${start} - Présent`;
    }
    
    if (endDate) {
      const end = new Date(endDate).toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric'
      });
      return `${start} - ${end}`;
    }
    
    return start;
  };

  // ====================================
  // 🎯 GESTIONNAIRES D'ÉVÉNEMENTS
  // ====================================

  // ➕ Ajouter une nouvelle expérience
  const handleAdd = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
    clearError();
  };

  // ✏️ Modifier une expérience
  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setIsModalOpen(true);
    clearError();
  };

  // 🗑️ Supprimer une expérience
  const handleDelete = async (experience: Experience) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${experience.title}" ?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteExperience(experience.id);
      console.log('✅ Expérience supprimée avec succès');
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📝 Soumission du formulaire
  const handleFormSubmit = async (formData: ExperienceFormData) => {
    setIsSubmitting(true);
    
    try {
      if (editingExperience) {
        // Mode édition
        await updateExperience(editingExperience.id, formData);
        console.log('✅ Expérience modifiée avec succès');
      } else {
        // Mode création
        await createExperience(formData);
        console.log('✅ Expérience créée avec succès');
      }
      
      // Fermer le modal
      setIsModalOpen(false);
      setEditingExperience(null);
      
    } catch (error) {
      console.error('❌ Erreur soumission:', error);
      // L'erreur est gérée par le hook, pas besoin de faire plus ici
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🗑️ Suppression depuis le formulaire
  const handleFormDelete = async () => {
    if (!editingExperience) return;
    
    await handleDelete(editingExperience);
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  // ====================================
  // 🎨 RENDU D'UNE CARTE D'EXPÉRIENCE
  // ====================================
  const renderExperienceCard = (experience: Experience) => {

    return (
      <div key={experience.id} className="experience-card">
        <div className="experience-card__body">
          {/* 🖼️ PHOTO À GAUCHE */}
          {experience.photo && (
            <div className="experience-card__photo">
              <img src={experience.photo} alt={`${experience.company}`} />
            </div>
          )}

          {/* 📝 CONTENU À DROITE */}
          <div className="experience-card__content">
            {/* ⚙️ ACTIONS */}
            <div className="experience-card__actions">
              <button 
                className="btn-icon btn-icon--edit" 
                onClick={() => handleEdit(experience)}
                title="Modifier"
              >
                ✏️
              </button>
              <button 
                className="btn-icon btn-icon--delete" 
                onClick={() => handleDelete(experience)}
                title="Supprimer"
              >
                🗑️
              </button>
            </div>

            {/* 📋 HEADER */}
            <div className="experience-card__header">
              <h3 className="experience-card__title">
                {experience.title}
              </h3>
              
              {/* 🏢 ENTREPRISE */}
              <div className="experience-card__company">
                {experience.company}
              </div>
              
              {/* 📍 LIEU (en dessous) */}
              {experience.location && (
                <div className="experience-card__location">
                  📍 {experience.location}
                </div>
              )}
            </div>

            {/* 📅 META INFOS */}
            <div className="experience-card__meta">
              <div className="experience-card__period">
                {formatDate(experience.startDate, experience.endDate, experience.isCurrentlyActive)}
              </div>
            </div>

            {/* 📝 DESCRIPTIONS - CORRIGÉES */}
            {experience.description && experience.description.length > 0 && (
              <div className="experience-card__description">
                <ul>
                  {experience.description.map((desc, index) => (
                    <li key={index}>{desc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 🔧 TECHNOLOGIES - CORRIGÉES */}
            {experience.technologies && experience.technologies.length > 0 && (
              <div className="experience-card__technologies">
                {experience.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ====================================
  // 🎨 RENDU PRINCIPAL
  // ====================================
  return (
    <section className="experiences-section" id='experiences-section'>
      {/* 📊 EN-TÊTE */}
      <div className="experiences-section__header">
        <div className="section-title">
          <h2>💼 Expériences & Formations</h2>
          <p>Gérez votre parcours professionnel et académique</p>
        </div>
        
        <button 
          className="btn-primary"
          onClick={handleAdd}
          disabled={loading}
        >
          + Ajouter une expérience
        </button>
      </div>

      {/* ⚠️ GESTION DES ERREURS */}
      {error && (
        <div className="alert alert--error">
          <span className="alert__icon">⚠️</span>
          <span className="alert__message">{error}</span>
          <button className="alert__close" onClick={clearError}>×</button>
        </div>
      )}

      {/* ⏳ LOADING */}
      {loading && !isModalOpen && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Chargement des expériences...</p>
        </div>
      )}

      {/* 📊 STATISTIQUES */}
      {stats.totalCount > 0 && (
        <div className="experiences-section__stats">
          <div className="stat-card">
            <span className="stat-card__value">{stats.totalFormations}</span>
            <span className="stat-card__label">Formations</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{stats.totalExperiences}</span>
            <span className="stat-card__label">Expériences</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{stats.activeExperiences}</span>
            <span className="stat-card__label">En cours</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{stats.totalCount}</span>
            <span className="stat-card__label">Total</span>
          </div>
        </div>
      )}

      {/* 📋 CONTENU */}
      <div className="experiences-section__content">
        {stats.totalCount === 0 && !loading ? (
          <div className="experiences-section__empty">
            <div className="empty-state">
              <div className="empty-state__icon">💼</div>
              <h3>Aucune expérience ajoutée</h3>
              <p>Commencez par ajouter votre première expérience ou formation</p>
              <button className="btn-secondary" onClick={handleAdd}>
                + Ajouter une expérience
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 🎓 FORMATIONS */}
            {formations.length > 0 && (
              <div className="experiences-group">
                <h3 className="experiences-group__title">
                  🎓 Formations ({formations.length})
                </h3>
                <div className="experiences-list">
                  {formations.map(renderExperienceCard)}
                </div>
              </div>
            )}

            {/* 💼 EXPÉRIENCES PROFESSIONNELLES */}
            {experiencesProf.length > 0 && (
              <div className="experiences-group">
                <h3 className="experiences-group__title">
                  💼 Expériences Professionnelles ({experiencesProf.length})
                </h3>
                <div className="experiences-list">
                  {experiencesProf.map(renderExperienceCard)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 🔄 MODAL POUR AJOUT/MODIFICATION */}
      {isModalOpen && (
        <Modal
          title={editingExperience ? 'Modifier l\'expérience' : 'Ajouter une expérience/formation'}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExperience(null);
            clearError();
          }}
          size="large"
        >
          <ExperienceForm
            experience={editingExperience || undefined}
            mode={editingExperience ? 'edit' : 'create'}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingExperience(null);
              clearError();
            }}
            onDelete={editingExperience ? handleFormDelete : undefined}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}
    </section>
  );
};

export default ExperiencesSection;
