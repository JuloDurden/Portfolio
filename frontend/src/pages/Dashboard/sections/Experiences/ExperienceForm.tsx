import React, { useState, useEffect } from 'react';
import { 
  Experience, 
  ExperienceFormProps, 
  ExperienceFormData,
  ExperienceFormErrors 
} from './types';
import './ExperienceForm.scss';
import ExperiencePhotoUpload from './ExperiencePhotoUpload';

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experience,
  mode,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false
}) => {
  // ====================================
  // 🔄 ÉTATS DU FORMULAIRE
  // ====================================
  const [formData, setFormData] = useState<ExperienceFormData>({
    type: 'experience',
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrentlyActive: false,
    description: [''],
    technologies: [],
    photo: null,
    photoFile: null
  });

  const [newTechnology, setNewTechnology] = useState('');
  const [errors, setErrors] = useState<ExperienceFormErrors>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // ====================================
  // 📥 CHARGER LES DONNÉES EN MODE ÉDITION
  // ====================================
  useEffect(() => {
    if (experience && mode === 'edit') {
      setFormData({
        type: experience.type,
        title: experience.title,
        company: experience.company,
        location: experience.location,
        startDate: experience.startDate,
        endDate: experience.endDate || '',
        isCurrentlyActive: experience.isCurrentlyActive,
        description: experience.description.length > 0 ? experience.description : [''],
        technologies: experience.technologies,
        photo: experience.photo || null,
        photoFile: null
      });

      // Prévisualisation de la photo existante
      if (experience.photo) {
        setPhotoPreview(experience.photo);
      }
    }
  }, [experience, mode]);

  // ====================================
  // ✅ VALIDATION DU FORMULAIRE
  // ====================================
  const validateForm = (): boolean => {
    const newErrors: ExperienceFormErrors = {};

    // Champs obligatoires
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.company.trim()) {
      newErrors.company = `${formData.type === 'formation' ? 'L\'école/organisme' : 'L\'entreprise'} est requise`;
    }
    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Le lieu est requis';
    }

    // Dates
    if (!formData.isCurrentlyActive && !formData.endDate) {
      newErrors.endDate = 'La date de fin est requise';
    }
    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
    }

    // Description (au moins une non vide)
    const validDescriptions = formData.description.filter(desc => desc.trim() !== '');
    if (validDescriptions.length === 0) {
      newErrors.description = 'Au moins une description est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====================================
  // 📝 GESTION DES CHAMPS
  // ====================================
  const updateField = <K extends keyof ExperienceFormData>(
    field: K, 
    value: ExperienceFormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Nettoyer l'erreur du champ modifié
    if (errors[field as keyof ExperienceFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // ====================================
  // 📋 GESTION DES DESCRIPTIONS
  // ====================================
  const addDescriptionItem = () => {
    updateField('description', [...formData.description, '']);
  };

  const updateDescriptionItem = (index: number, value: string) => {
    const newDescriptions = formData.description.map((item, i) => 
      i === index ? value : item
    );
    updateField('description', newDescriptions);
  };

  const removeDescriptionItem = (index: number) => {
    if (formData.description.length > 1) {
      const newDescriptions = formData.description.filter((_, i) => i !== index);
      updateField('description', newDescriptions);
    }
  };

  // ====================================
  // 🏷️ GESTION DES TECHNOLOGIES
  // ====================================
  const addTechnology = () => {
    const tech = newTechnology.trim();
    if (tech && !formData.technologies.includes(tech)) {
      updateField('technologies', [...formData.technologies, tech]);
      setNewTechnology('');
    }
  };

  const removeTechnology = (techToRemove: string) => {
    const newTechnologies = formData.technologies.filter(tech => tech !== techToRemove);
    updateField('technologies', newTechnologies);
  };

  const handleTechnologyKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  // ====================================
  // 📤 SOUMISSION DU FORMULAIRE
  // ====================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;

    // Nettoyer les données avant envoi
    const cleanedData: ExperienceFormData = {
      ...formData,
      title: formData.title.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
      endDate: formData.isCurrentlyActive ? null : formData.endDate,
      description: formData.description.filter(desc => desc.trim() !== '')
    };

    try {
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors(prev => ({ 
        ...prev, 
        general: 'Erreur lors de la sauvegarde. Veuillez réessayer.' 
      }));
    }
  };

  // ====================================
  // 🗑️ SUPPRESSION
  // ====================================
  const handleDelete = async () => {
    if (onDelete && window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await onDelete();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setErrors(prev => ({ 
          ...prev, 
          general: 'Erreur lors de la suppression. Veuillez réessayer.' 
        }));
      }
    }
  };

  return (
    <form className="experience-form" onSubmit={handleSubmit}>
      
      {/* ⚠️ ERREUR GÉNÉRALE */}
      {errors.general && (
        <div className="form-error-general">
          {errors.general}
        </div>
      )}

      {/* 📋 TYPE D'EXPÉRIENCE */}
      <div className="form-group">
        <label className="form-label">Type *</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              value="experience"
              checked={formData.type === 'experience'}
              onChange={(e) => updateField('type', e.target.value as 'experience')}
              disabled={isSubmitting}
            />
            <span className="radio-label">💼 Expérience professionnelle</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              value="formation"
              checked={formData.type === 'formation'}
              onChange={(e) => updateField('type', e.target.value as 'formation')}
              disabled={isSubmitting}
            />
            <span className="radio-label">🎓 Formation</span>
          </label>
        </div>
      </div>

      {/* 🖼️ PHOTO */}
      <div className="form-group">
        <label className="form-label">Photo (optionnelle)</label>
        <ExperiencePhotoUpload
          currentPhoto={photoPreview}
          onPhotoChange={(file) => {
            if (file) {
              // Validation du fichier
              if (file.size > 5 * 1024 * 1024) { // 5MB max
                setErrors(prev => ({ ...prev, photo: 'L\'image ne peut pas dépasser 5MB' }));
                return;
              }
              
              if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, photo: 'Seules les images sont acceptées' }));
                return;
              }

              setFormData(prev => ({ ...prev, photoFile: file }));
              const reader = new FileReader();
              reader.onload = (e) => setPhotoPreview(e.target?.result as string);
              reader.readAsDataURL(file);
            }
            setErrors(prev => ({ ...prev, photo: undefined }));
          }}
          onPhotoRemove={() => {
            setFormData(prev => ({ ...prev, photoFile: null, photo: null }));
            setPhotoPreview(null);
          }}
          disabled={isSubmitting}
          error={errors.photo}
        />
      </div>

      {/* 📝 TITRE */}
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          {formData.type === 'formation' ? 'Diplôme/Formation' : 'Poste'} *
        </label>
        <input
          id="title"
          type="text"
          className={`form-input ${errors.title ? 'form-input--error' : ''}`}
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder={formData.type === 'formation' ? 'Ex: Master en Informatique' : 'Ex: Développeur Frontend'}
          disabled={isSubmitting}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      {/* 🏢 ENTREPRISE/ÉCOLE */}
      <div className="form-group">
        <label className="form-label" htmlFor="company">
          {formData.type === 'formation' ? 'École/Organisme' : 'Entreprise'} *
        </label>
        <input
          id="company"
          type="text"
          className={`form-input ${errors.company ? 'form-input--error' : ''}`}
          value={formData.company}
          onChange={(e) => updateField('company', e.target.value)}
          placeholder={formData.type === 'formation' ? 'Ex: Université de Paris' : 'Ex: Google France'}
          disabled={isSubmitting}
        />
        {errors.company && <span className="error-message">{errors.company}</span>}
      </div>

      {/* 📅 DATES */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="startDate">Date de début *</label>
          <input
            id="startDate"
            type="date"
            className={`form-input ${errors.startDate ? 'form-input--error' : ''}`}
            value={formData.startDate}
            onChange={(e) => updateField('startDate', e.target.value)}
            disabled={isSubmitting}
          />
          {errors.startDate && <span className="error-message">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="endDate">Date de fin</label>
          <input
            id="endDate"
            type="date"
            className={`form-input ${errors.endDate ? 'form-input--error' : ''}`}
            value={formData.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            disabled={formData.isCurrentlyActive || isSubmitting}
          />
          {errors.endDate && <span className="error-message">{errors.endDate}</span>}
        </div>
      </div>

      {/* ⏰ EN COURS */}
      <div className="form-group">
        <label className="checkbox-option">
          <input
            type="checkbox"
            checked={formData.isCurrentlyActive}
            onChange={(e) => {
              updateField('isCurrentlyActive', e.target.checked);
              if (e.target.checked) {
                updateField('endDate', '');
              }
            }}
            disabled={isSubmitting}
          />
          <span className="checkbox-label">En cours</span>
        </label>
      </div>

      {/* 📍 LIEU */}
      <div className="form-group">
        <label className="form-label" htmlFor="location">Lieu *</label>
        <input
          id="location"
          type="text"
          className={`form-input ${errors.location ? 'form-input--error' : ''}`}
          value={formData.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="Ex: Paris, France ou Remote"
          disabled={isSubmitting}
        />
        {errors.location && <span className="error-message">{errors.location}</span>}
      </div>

      {/* 📝 DESCRIPTION */}
      <div className="form-group">
        <label className="form-label">Description *</label>
        <div className="description-list">
          {formData.description.map((item, index) => (
            <div key={index} className="description-item">
              <textarea
                className="form-textarea"
                value={item}
                onChange={(e) => updateDescriptionItem(index, e.target.value)}
                placeholder="Décrivez vos missions, apprentissages..."
                rows={2}
                disabled={isSubmitting}
              />
              {formData.description.length > 1 && (
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeDescriptionItem(index)}
                  disabled={isSubmitting}
                  aria-label="Supprimer"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn-add-item"
            onClick={addDescriptionItem}
            disabled={isSubmitting}
          >
            + Ajouter un point
          </button>
        </div>
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      {/* 🏷️ TECHNOLOGIES */}
      <div className="form-group">
        <label className="form-label">Technologies/Compétences</label>
        
        {formData.technologies.length > 0 && (
          <div className="technologies-list">
            {formData.technologies.map((tech, index) => (
              <span key={index} className="tech-tag">
                {tech}
                <button
                  type="button"
                  className="tech-remove"
                  onClick={() => removeTechnology(tech)}
                  disabled={isSubmitting}
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="technology-input">
          <input
            type="text"
            className="form-input"
            value={newTechnology}
            onChange={(e) => setNewTechnology(e.target.value)}
            onKeyPress={handleTechnologyKeyPress}
            placeholder="Tapez une technologie et appuyez sur Entrée"
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="btn-add"
            onClick={addTechnology}
            disabled={!newTechnology.trim() || isSubmitting}
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* 🔄 BOUTONS D'ACTION */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </button>
        
        {mode === 'edit' && onDelete && (
          <button
            type="button"
            className="btn-danger"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            🗑️ Supprimer
          </button>
        )}
        
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              {mode === 'edit' ? 'Modification...' : 'Ajout...'}
            </>
          ) : (
            mode === 'edit' ? 'Modifier' : 'Ajouter'
          )}
        </button>
      </div>

    </form>
  );
};

export default ExperienceForm;
