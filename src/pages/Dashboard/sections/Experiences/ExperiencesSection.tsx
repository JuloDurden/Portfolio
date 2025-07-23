import React, { useState } from 'react';
import Modal from '../../../../components/Modal/Modal';
import ExperienceForm from './ExperienceForm';
import { 
  Experience, 
  ExperienceFormData,
  ExperienceType 
} from './types';
import './ExperiencesSection.scss';

const ExperiencesSection: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 📊 Statistiques calculées
  const stats = {
    totalExperiences: experiences.filter(exp => exp.type === 'experience').length,
    totalFormations: experiences.filter(exp => exp.type === 'formation').length,
    totalCount: experiences.length,
    activeExperiences: experiences.filter(exp => exp.isCurrentlyActive).length
  };

  // 🔄 Trier les expériences par type puis par date
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

  // 📋 Grouper par type
  const formations = sortedExperiences.filter(exp => exp.type === 'formation');
  const experiencesProf = sortedExperiences.filter(exp => exp.type === 'experience');

  // 📅 Formater les dates
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

  // ➕ Ajouter une nouvelle expérience
  const handleAdd = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  // ✏️ Modifier une expérience
  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setIsModalOpen(true);
  };

  // 🗑️ Supprimer une expérience
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        setExperiences(prev => prev.filter(exp => exp.id !== id));
        // TODO: API call pour supprimer
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // 🗑️ Supprimer depuis le formulaire
  const handleFormDelete = async () => {
    if (editingExperience) {
      await handleDelete(editingExperience.id!);
      setIsModalOpen(false);
    }
  };

  // 💾 Sauvegarder (ajout/modification)
  const handleFormSubmit = async (formData: ExperienceFormData) => {
    setIsSubmitting(true);
    try {
      // 🖼️ Traitement de la photo
      let photoUrl: string | null = formData.photo || null;
      
      // Si un nouveau fichier photo a été uploadé
      if (formData.photoFile) {
        // Créer une URL temporaire pour l'aperçu (en attendant l'upload serveur)
        photoUrl = URL.createObjectURL(formData.photoFile);
        console.log('📸 Photo temporaire créée:', photoUrl);
      }

      if (editingExperience) {
        // 📝 Modification
        setExperiences(prev => 
          prev.map(exp => 
            exp.id === editingExperience.id 
              ? { 
                  ...exp,
                  title: formData.title,
                  company: formData.company,
                  location: formData.location,
                  type: formData.type,
                  startDate: formData.startDate,
                  endDate: formData.endDate,
                  isCurrentlyActive: formData.isCurrentlyActive,
                  description: formData.description,
                  technologies: formData.technologies,
                  photo: photoUrl,
                  updatedAt: new Date().toISOString()
                }
              : exp
          )
        );
        console.log('✅ Expérience modifiée avec photo:', photoUrl);
      } else {
        // ➕ Ajout
        const newExperience: Experience = {
          id: `exp_${Date.now()}`,
          title: formData.title,
          company: formData.company,
          location: formData.location,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isCurrentlyActive: formData.isCurrentlyActive,
          description: formData.description,
          technologies: formData.technologies,
          photo: photoUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setExperiences(prev => [...prev, newExperience]);
        console.log('✅ Nouvelle expérience ajoutée avec photo:', photoUrl);
      }
      
      setIsModalOpen(false);
      setEditingExperience(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🃏 Rendu d'une carte expérience - ✅ PHOTO À GAUCHE
  const renderExperienceCard = (experience: Experience) => (
    <div key={experience.id} className="experience-card">
      <div className="experience-card__header">
        <div className="experience-card__badge">
          {experience.type === 'formation' ? '🎓 FORMATION' : '💼 EXPÉRIENCE'}
          {experience.isCurrentlyActive && (
            <span className="experience-card__current">En cours</span>
          )}
        </div>
        <div className="experience-card__actions">
          <button 
            className="btn-icon btn-icon--edit"
            onClick={() => handleEdit(experience)}
            aria-label="Modifier"
            title="Modifier cette expérience"
          >
            ✏️
          </button>
          <button 
            className="btn-icon btn-icon--delete"
            onClick={() => handleDelete(experience.id!)}
            aria-label="Supprimer"
            title="Supprimer cette expérience"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* ✅ LAYOUT HORIZONTAL : PHOTO + CONTENU */}
      <div className="experience-card__body">
        {/* 🖼️ PHOTO À GAUCHE */}
        {experience.photo && (
          <div className="experience-card__photo">
            <img 
              src={experience.photo} 
              alt={`${experience.title} chez ${experience.company}`}
              onLoad={() => console.log('📸 Photo chargée:', experience.photo)}
              onError={(e) => {
                console.error('❌ Erreur chargement photo:', experience.photo);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* 📝 CONTENU À DROITE */}
        <div className="experience-card__content">
          <h3 className="experience-card__title">{experience.title}</h3>
          <p className="experience-card__company">{experience.company}</p>
          
          <div className="experience-card__meta">
            <span className="experience-card__date">
              📅 {formatDate(experience.startDate, experience.endDate, experience.isCurrentlyActive)}
            </span>
            <span className="experience-card__location">
              📍 {experience.location}
            </span>
          </div>

          {experience.description && experience.description.length > 0 && (
            <ul className="experience-card__description">
              {experience.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          )}

          {experience.technologies && experience.technologies.length > 0 && (
            <div className="experience-card__technologies">
              {experience.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section id="experiences-section" className="experiences-section">
      {/* 📊 HEADER */}
      <div className="experiences-section__header">
        <div className="experiences-section__header-content">
          <h2 className="experiences-section__title">
            💼 Expériences & Formations
          </h2>
          <p className="experiences-section__subtitle">
            Gérez votre parcours professionnel et académique
          </p>
        </div>
        
        <button 
          className="btn-primary"
          onClick={handleAdd}
          disabled={isSubmitting}
        >
          + Ajouter
        </button>
      </div>

      {/* 📈 STATS BAR */}
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
        {stats.totalCount === 0 ? (
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
          onClose={() => setIsModalOpen(false)}
          size="large"
        >
          <ExperienceForm
            experience={editingExperience || undefined}
            mode={editingExperience ? 'edit' : 'create'}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            onDelete={editingExperience ? handleFormDelete : undefined}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}
    </section>
  );
};

export default ExperiencesSection;
