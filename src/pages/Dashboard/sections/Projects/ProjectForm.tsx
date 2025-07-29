import React, { useState, useEffect } from 'react';
import { Project, ProjectFormData } from './types';
import './ProjectForm.scss';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectFormData, coverFile?: File, pictureFiles?: File[]) => Promise<void>;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  project, 
  onSubmit, 
  onCancel 
}) => {
  // 📋 Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    subtitle: '',
    description: '',
    competences: [],
    informations: {
      client: '',
      date: new Date().toISOString().split('T')[0]
    },
    links: {
      website: '',
      github: ''
    },
    technologies: [],
    category: '',
    featured: false
  });

  // 🖼️ Files state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pictureFiles, setPictureFiles] = useState<File[]>([]);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [picturesPreviews, setPicturesPreviews] = useState<string[]>([]);

  // 📝 Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTech, setTempTech] = useState('');
  const [tempCompetence, setTempCompetence] = useState('');

  // 🔄 Load project data if editing
  useEffect(() => {
    console.log('🔄 ProjectForm useEffect - project:', project);
    
    if (project) {
      setFormData({
        title: project.title || '',
        subtitle: project.subtitle || '',
        description: project.description || '',
        competences: project.competences || [],
        informations: {
          client: project.informations?.client || '',
          date: project.informations?.date || new Date().toISOString().split('T')[0]
        },
        links: {
          website: project.links?.website || '',
          github: project.links?.github || ''
        },
        technologies: project.technologies || [],
        category: project.category || '',
        featured: project.featured || false
      });
      
      // 🔥 CORRECTION ICI - GESTION SÉCURISÉE DU COVER
      let coverUrl = '';
      
      if (project.cover) {
        if (typeof project.cover === 'string') {
          // Cover est une string simple
          coverUrl = project.cover;
        } else if (typeof project.cover === 'object') {
          // Cover est un objet avec small/large
          if (project.cover.small) {
            coverUrl = project.cover.small;
          } else if (project.cover.large) {
            coverUrl = project.cover.large;
          }
        }
      }
      
      console.log('🖼️ Cover URL final pour preview:', coverUrl);
      setCoverPreview(coverUrl);
    } else {
      // 🔄 Reset form for new project
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        competences: [],
        informations: {
          client: '',
          date: new Date().toISOString().split('T')[0]
        },
        links: {
          website: '',
          github: ''
        },
        technologies: [],
        category: '',
        featured: false
      });
      setCoverPreview('');
      setPicturesPreviews([]);
      setCoverFile(null);
      setPictureFiles([]);
    }
  }, [project]);

  // 🖼️ HANDLE COVER FILE
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        alert('Le fichier cover ne peut pas dépasser 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Le cover doit être une image');
        return;
      }

      setCoverFile(file);
      
      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🖼️ HANDLE PICTURES FILES
  const handlePicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 10) {
      alert('Maximum 10 images supplémentaires autorisées');
      return;
    }

    // Validation
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} dépasse 5MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} n'est pas une image`);
        return false;
      }
      return true;
    });

    setPictureFiles(validFiles);
    
    // Previews
    const previews: string[] = [];
    let loadedCount = 0;
    
    if (validFiles.length === 0) {
      setPicturesPreviews([]);
      return;
    }
    
    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews[index] = e.target?.result as string;
        loadedCount++;
        if (loadedCount === validFiles.length) {
          setPicturesPreviews([...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 📝 HANDLE INPUT CHANGE
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProjectFormData],
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  // 🏷️ ADD TECHNOLOGY
  const addTechnology = () => {
    if (tempTech.trim() && !formData.technologies.includes(tempTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tempTech.trim()]
      }));
      setTempTech('');
    }
  };

  // 🗑️ REMOVE TECHNOLOGY
  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  // 💡 ADD COMPETENCE
  const addCompetence = () => {
    if (tempCompetence.trim() && !formData.competences.includes(tempCompetence.trim())) {
      setFormData(prev => ({
        ...prev,
        competences: [...prev.competences, tempCompetence.trim()]
      }));
      setTempCompetence('');
    }
  };

  // 🗑️ REMOVE COMPETENCE
  const removeCompetence = (competence: string) => {
    setFormData(prev => ({
      ...prev,
      competences: prev.competences.filter(c => c !== competence)
    }));
  };

  // 📤 HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }
    
    if (!project && !coverFile) {
      alert('Une image de cover est obligatoire');
      return;
    }

    console.log('📋 ProjectForm - handleSubmit appelé');
    console.log('📸 Cover file:', coverFile);
    console.log('🖼️ Picture files:', pictureFiles);
    console.log('📋 Form data:', formData);
    console.log('🎯 Project (mode édition?):', project);

    try {
      setIsSubmitting(true);
      await onSubmit(formData, coverFile || undefined, pictureFiles);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Erreur lors de l\'enregistrement. Vérifiez la console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <div className="project-form__grid">
        
        {/* 📋 INFOS GÉNÉRALES */}
        <div className="project-form__section">
          <h3>Informations générales</h3>
          
          <div className="project-form__field">
            <label htmlFor="title">Titre *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="project-form__field">
            <label htmlFor="subtitle">Sous-titre</label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="project-form__field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="project-form__field">
            <label htmlFor="category">Catégorie</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            />
          </div>

          <div className="project-form__field">
            <label className="project-form__checkbox">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              Projet mis en avant
            </label>
          </div>
        </div>

        {/* 🖼️ IMAGES */}
        <div className="project-form__section">
          <h3>Images</h3>
          
          <div className="project-form__field">
            <label htmlFor="cover">Image de cover * {!project && '(obligatoire)'}</label>
            <input
              type="file"
              id="cover"
              accept="image/*"
              onChange={handleCoverChange}
            />
            {coverPreview && (
              <div className="project-form__preview">
                <img src={coverPreview} alt="Cover preview" />
                <small>Sera redimensionnée en 400x400 (card) et 1000x1000 (détails)</small>
              </div>
            )}
          </div>

          <div className="project-form__field">
            <label htmlFor="pictures">Images supplémentaires (max 10)</label>
            <input
              type="file"
              id="pictures"
              multiple
              accept="image/*"
              onChange={handlePicturesChange}
            />
            {picturesPreviews.length > 0 && (
              <div className="project-form__previews">
                {picturesPreviews.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview ${index + 1}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 🏷️ TECHNOLOGIES */}
        <div className="project-form__section">
          <h3>Technologies</h3>
          
          <div className="project-form__field">
            <div className="project-form__add-item">
              <input
                type="text"
                placeholder="Ajouter une technologie"
                value={tempTech}
                onChange={(e) => setTempTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              />
              <button type="button" onClick={addTechnology}>Ajouter</button>
            </div>
            
            <div className="project-form__tags">
              {formData.technologies.map((tech, index) => (
                <span key={index} className="project-form__tag">
                  {tech}
                  <button type="button" onClick={() => removeTechnology(tech)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 💡 COMPÉTENCES */}
        <div className="project-form__section">
          <h3>Compétences</h3>
          
          <div className="project-form__field">
            <div className="project-form__add-item">
              <input
                type="text"
                placeholder="Ajouter une compétence"
                value={tempCompetence}
                onChange={(e) => setTempCompetence(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetence())}
              />
              <button type="button" onClick={addCompetence}>Ajouter</button>
            </div>
            
            <div className="project-form__tags">
              {formData.competences.map((comp, index) => (
                <span key={index} className="project-form__tag">
                  {comp}
                  <button type="button" onClick={() => removeCompetence(comp)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ℹ️ INFORMATIONS PROJET */}
        <div className="project-form__section">
          <h3>Informations projet</h3>
          
          <div className="project-form__field">
            <label htmlFor="informations.client">Client</label>
            <input
              type="text"
              id="informations.client"
              name="informations.client"
              value={formData.informations.client || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="project-form__field">
            <label htmlFor="informations.date">Date</label>
            <input
              type="date"
              id="informations.date"
              name="informations.date"
              value={formData.informations.date}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 🔗 LIENS */}
        <div className="project-form__section">
          <h3>Liens</h3>
          
          <div className="project-form__field">
            <label htmlFor="links.website">Site web</label>
            <input
              type="url"
              id="links.website"
              name="links.website"
              value={formData.links.website || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="project-form__field">
            <label htmlFor="links.github">GitHub</label>
            <input
              type="url"
              id="links.github"
              name="links.github"
              value={formData.links.github || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
      </div>

      {/* 🎯 ACTIONS */}
      <div className="project-form__actions">
        <button 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
          className="project-form__cancel"
        >
          Annuler
        </button>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="project-form__submit"
        >
          {isSubmitting ? 'Enregistrement...' : project ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
