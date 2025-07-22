import React, { useState, useEffect } from 'react';
import { Project } from './types';
import './ProjectForm.scss';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (project: Omit<Project, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  project, 
  onSubmit, 
  onCancel 
}) => {
  // ====================================
  // 🔄 STATE MANAGEMENT
  // ====================================
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    informations: {
      client: '',
      date: '',
      duration: '',
      team: ''
    },
    links: {
      website: '',
      github: ''
    },
    technologies: [] as string[],
    pictures: [] as string[]
  });
  
  const [newTech, setNewTech] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ====================================
  // 🔄 INITIALISATION DU FORMULAIRE
  // ====================================
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        subtitle: project.subtitle,
        description: project.description,
        informations: { ...project.informations },
        links: { ...project.links },
        technologies: [...project.technologies],
        pictures: [...project.pictures]
      });
    }
  }, [project]);

  // ====================================
  // 📝 GESTION DES INPUTS
  // ====================================
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Supprimer l'erreur si elle existe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ====================================
  // 🏷️ GESTION DES TECHNOLOGIES
  // ====================================
  const handleAddTechnology = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTech.trim()) {
      e.preventDefault();
      if (!formData.technologies.includes(newTech.trim())) {
        setFormData(prev => ({
          ...prev,
          technologies: [...prev.technologies, newTech.trim()]
        }));
      }
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  // ====================================
  // 🖼️ GESTION DES IMAGES
  // ====================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setSelectedFiles(files);

    // Créer les previews
    const urls: string[] = [];
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      urls.push(url);
    });
    setPreviewUrls(urls);
  };

  const handleRemovePreview = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    if (selectedFiles) {
      const dt = new DataTransfer();
      Array.from(selectedFiles)
        .filter((_, i) => i !== index)
        .forEach(file => dt.items.add(file));
      setSelectedFiles(dt.files);
    }
  };

  const handleRemoveExistingPicture = (pictureUrl: string) => {
    setFormData(prev => ({
      ...prev,
      pictures: prev.pictures.filter(url => url !== pictureUrl)
    }));
  };

  // ====================================
  // ✅ VALIDATION
  // ====================================
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = 'Le sous-titre est obligatoire';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (!formData.informations.client.trim()) {
      newErrors['informations.client'] = 'Le client est obligatoire';
    }

    if (!formData.informations.date.trim()) {
      newErrors['informations.date'] = 'La date est obligatoire';
    }

    if (formData.technologies.length === 0) {
      newErrors.technologies = 'Au moins une technologie est requise';
    }

    // Vérifier qu'il y a au moins une image (nouvelle ou existante)
    if (formData.pictures.length === 0 && (!selectedFiles || selectedFiles.length === 0)) {
      newErrors.pictures = 'Au moins une image est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ====================================
  // 🚀 SOUMISSION DU FORMULAIRE
  // ====================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Préparer les données pour l'API
      const projectData = {
        ...formData,
        // L'API gérera l'upload des fichiers et génèrera les URLs
        newFiles: selectedFiles ? Array.from(selectedFiles) : []
      };

      await onSubmit(projectData as any);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      // Ici tu peux ajouter une notification d'erreur
    } finally {
      setIsSubmitting(false);
    }
  };

  // ====================================
  // 🗑️ NETTOYAGE DES URLS
  // ====================================
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <form onSubmit={handleSubmit} className="project-form">
      {/* ====================================
          📋 INFORMATIONS PRINCIPALES
          ==================================== */}
      <div className="project-form__section">
        <h3 className="project-form__section-title">Informations principales</h3>
        
        <div className="project-form__row">
          <div className="project-form__field">
            <label className="project-form__label">
              Titre *
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`project-form__input ${errors.title ? 'project-form__input--error' : ''}`}
                placeholder="Mon Super Projet"
              />
              {errors.title && (
                <span className="project-form__error">{errors.title}</span>
              )}
            </label>
          </div>
          
          <div className="project-form__field">
            <label className="project-form__label">
              Sous-titre *
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className={`project-form__input ${errors.subtitle ? 'project-form__input--error' : ''}`}
                placeholder="Application web moderne"
              />
              {errors.subtitle && (
                <span className="project-form__error">{errors.subtitle}</span>
              )}
            </label>
          </div>
        </div>

        <div className="project-form__field">
          <label className="project-form__label">
            Description *
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`project-form__textarea ${errors.description ? 'project-form__input--error' : ''}`}
              placeholder="Description détaillée du projet..."
            />
            {errors.description && (
              <span className="project-form__error">{errors.description}</span>
            )}
          </label>
        </div>
      </div>

      {/* ====================================
          ℹ️ INFORMATIONS PROJET
          ==================================== */}
      <div className="project-form__section">
        <h3 className="project-form__section-title">Détails du projet</h3>
        
        <div className="project-form__row">
          <div className="project-form__field">
            <label className="project-form__label">
              Client *
              <input
                type="text"
                name="informations.client"
                value={formData.informations.client}
                onChange={handleInputChange}
                className={`project-form__input ${errors['informations.client'] ? 'project-form__input--error' : ''}`}
                placeholder="Nom du client"
              />
              {errors['informations.client'] && (
                <span className="project-form__error">{errors['informations.client']}</span>
              )}
            </label>
          </div>
          
          <div className="project-form__field">
            <label className="project-form__label">
              Date *
              <input
                type="text"
                name="informations.date"
                value={formData.informations.date}
                onChange={handleInputChange}
                className={`project-form__input ${errors['informations.date'] ? 'project-form__input--error' : ''}`}
                placeholder="2024"
              />
              {errors['informations.date'] && (
                <span className="project-form__error">{errors['informations.date']}</span>
              )}
            </label>
          </div>
        </div>

        <div className="project-form__row">
          <div className="project-form__field">
            <label className="project-form__label">
              Durée
              <input
                type="text"
                name="informations.duration"
                value={formData.informations.duration}
                onChange={handleInputChange}
                className="project-form__input"
                placeholder="3 mois"
              />
            </label>
          </div>
          
          <div className="project-form__field">
            <label className="project-form__label">
              Équipe
              <input
                type="text"
                name="informations.team"
                value={formData.informations.team}
                onChange={handleInputChange}
                className="project-form__input"
                placeholder="Solo, En équipe..."
              />
            </label>
          </div>
        </div>
      </div>

      {/* ====================================
          🔗 LIENS
          ==================================== */}
      <div className="project-form__section">
        <h3 className="project-form__section-title">Liens</h3>
        
        <div className="project-form__row">
          <div className="project-form__field">
            <label className="project-form__label">
              Site web
              <input
                type="url"
                name="links.website"
                value={formData.links.website}
                onChange={handleInputChange}
                className="project-form__input"
                placeholder="https://monprojet.com"
              />
            </label>
          </div>
          
          <div className="project-form__field">
            <label className="project-form__label">
              GitHub
              <input
                type="url"
                name="links.github"
                value={formData.links.github}
                onChange={handleInputChange}
                className="project-form__input"
                placeholder="https://github.com/user/repo"
              />
            </label>
          </div>
        </div>
      </div>

      {/* ====================================
          🏷️ TECHNOLOGIES
          ==================================== */}
      <div className="project-form__section">
        <h3 className="project-form__section-title">Technologies *</h3>
        
        <div className="project-form__field">
          <label className="project-form__label">
            Ajouter une technologie
            <input
              type="text"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={handleAddTechnology}
              className="project-form__input"
              placeholder="React, TypeScript... (Appuyez sur Entrée)"
            />
          </label>
        </div>

        <div className="project-form__tags">
          {formData.technologies.map((tech, index) => (
            <span key={index} className="project-form__tag">
              {tech}
              <button
                type="button"
                onClick={() => handleRemoveTechnology(tech)}
                className="project-form__tag-remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        
        {errors.technologies && (
          <span className="project-form__error">{errors.technologies}</span>
        )}
      </div>

      {/* ====================================
          🖼️ IMAGES
          ==================================== */}
      <div className="project-form__section">
        <h3 className="project-form__section-title">Images *</h3>
        <p className="project-form__hint">
          La première image sera utilisée comme cover (miniature + détail)
        </p>
        
        <div className="project-form__field">
          <label className="project-form__label">
            Sélectionner des images
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="project-form__file-input"
            />
          </label>
        </div>

        {/* Images existantes (mode édition) */}
        {formData.pictures.length > 0 && (
          <div className="project-form__images-section">
            <h4 className="project-form__images-title">Images actuelles</h4>
            <div className="project-form__images-grid">
              {formData.pictures.map((picture, index) => (
                <div key={index} className="project-form__image-item">
                  <img src={picture} alt={`Image ${index + 1}`} />
                  {index === 0 && (
                    <span className="project-form__cover-badge">COVER</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingPicture(picture)}
                    className="project-form__image-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nouvelles images (preview) */}
        {previewUrls.length > 0 && (
          <div className="project-form__images-section">
            <h4 className="project-form__images-title">Nouvelles images</h4>
            <div className="project-form__images-grid">
              {previewUrls.map((url, index) => (
                <div key={index} className="project-form__image-item">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  {index === 0 && formData.pictures.length === 0 && (
                    <span className="project-form__cover-badge">COVER</span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePreview(index)}
                    className="project-form__image-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {errors.pictures && (
          <span className="project-form__error">{errors.pictures}</span>
        )}
      </div>

      {/* ====================================
          🔄 ACTIONS
          ==================================== */}
      <div className="project-form__actions">
        <button
          type="button"
          onClick={onCancel}
          className="project-form__btn project-form__btn--cancel"
          disabled={isSubmitting}
        >
          Annuler
        </button>
        
        <button
          type="submit"
          className="project-form__btn project-form__btn--submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : project ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
