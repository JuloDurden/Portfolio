import React, { useState, useRef, useEffect } from 'react';
import { Skill } from './types';
import './SkillForm.scss';

interface SkillFormProps {
  skill?: Skill | null;
  existingCategories?: string[]; // ← OPTIONNEL maintenant
  onSubmit: (skillData: Omit<Skill, 'id'>) => void;
  onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({
  skill,
  existingCategories = [], // ← VALEUR PAR DÉFAUT
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    description: skill?.description || '',
    level: skill?.level || 50,
    icon: skill?.icon || '',
    categories: skill?.categories || []
  });

  const [iconPreview, setIconPreview] = useState<string>(skill?.icon || '');
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        description: skill.description || '',
        level: skill.level,
        icon: skill.icon,
        categories: skill.categories || [] // ← SÉCURITÉ
      });
      setIconPreview(skill.icon || ''); // ← SÉCURITÉ
    }
  }, [skill]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setIconPreview(result);
        handleInputChange('icon', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconUrlChange = (url: string) => {
    handleInputChange('icon', url);
    setIconPreview(url);
  };

  const addCategory = (category: string) => {
    const trimmedCategory = category.trim();
    if (trimmedCategory && !formData.categories.includes(trimmedCategory)) {
      handleInputChange('categories', [...formData.categories, trimmedCategory]);
    }
    setCategoryInput('');
    setShowCategorySuggestions(false);
  };

  const removeCategory = (categoryToRemove: string) => {
    handleInputChange(
      'categories',
      formData.categories.filter(cat => cat !== categoryToRemove)
    );
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (categoryInput.trim()) {
        addCategory(categoryInput);
      }
    }
  };

  const filteredSuggestions = (existingCategories || []).filter(cat =>
    cat.toLowerCase().includes(categoryInput.toLowerCase()) &&
    !formData.categories.includes(cat)
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.icon.trim()) {
      newErrors.icon = 'Une icône est requise';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'Au moins une catégorie est requise';
    }

    if (formData.level < 0 || formData.level > 100) {
      newErrors.level = 'Le niveau doit être entre 0 et 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getLevelLabel = (level: number): string => {
    if (level >= 80) return 'Expert';
    if (level >= 60) return 'Avancé';
    if (level >= 40) return 'Intermédiaire';
    return 'Débutant';
  };

  return (
    <form onSubmit={handleSubmit} className="skill-form">
      {/* Nom de la compétence */}
      <div className="form-group">
        <label htmlFor="skill-name">
          Nom de la compétence <span className="required">*</span>
        </label>
        <input
          id="skill-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="ex: React, Photoshop, Marketing..."
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="skill-description">Description (optionnel)</label>
        <textarea
          id="skill-description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Décrivez vos compétences et expériences..."
          rows={3}
        />
      </div>

      {/* Niveau */}
      <div className="form-group">
        <div className="level-slider-container">
          <div className="level-header">
            <label htmlFor="skill-level">Niveau</label>
            <div className="level-value">
              {formData.level}% - {getLevelLabel(formData.level)}
            </div>
          </div>
          
          <input
            id="skill-level"
            type="range"
            min="0"
            max="100"
            step="5"
            value={formData.level}
            onChange={(e) => handleInputChange('level', parseInt(e.target.value))}
            className="slider"
          />
          
          <div className="level-labels">
            <span className={`level-label ${formData.level < 40 ? 'active' : ''}`}>
              Débutant
            </span>
            <span className={`level-label ${formData.level >= 40 && formData.level < 60 ? 'active' : ''}`}>
              Intermédiaire
            </span>
            <span className={`level-label ${formData.level >= 60 && formData.level < 80 ? 'active' : ''}`}>
              Avancé
            </span>
            <span className={`level-label ${formData.level >= 80 ? 'active' : ''}`}>
              Expert
            </span>
          </div>
        </div>
        {errors.level && <span className="error-message">{errors.level}</span>}
      </div>

      {/* Icône */}
      <div className="form-group">
        <label>Icône <span className="required">*</span></label>
        
        <div className="icon-upload-section">
          <div className="icon-preview">
            {iconPreview ? (
              <img src={iconPreview} alt="Aperçu" />
            ) : (
              <div className="placeholder-icon">📄</div>
            )}
          </div>

          <div className="icon-actions">
            <label className="upload-button" onClick={() => fileInputRef.current?.click()}>
              <span className="upload-icon">📁</span>
              Uploader un fichier
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleIconUpload}
            />

            <input
              type="url"
              value={formData.icon}
              onChange={(e) => handleIconUrlChange(e.target.value)}
              placeholder="ou collez une URL d'image..."
            />
          </div>
        </div>
        
        {errors.icon && <span className="error-message">{errors.icon}</span>}
      </div>


      {/* Catégories */}
      <div className="form-group">
        <label>
          Catégories <span className="required">*</span>
        </label>
        
        <div className="categories-input-section">
          <div className="category-input-group">
            <input
              ref={categoryInputRef}
              type="text"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value);
                setShowCategorySuggestions(e.target.value.length > 0);
              }}
              onKeyDown={handleCategoryKeyDown}
              onFocus={() => setShowCategorySuggestions(categoryInput.length > 0)}
              onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 150)}
              placeholder="Tapez une catégorie et appuyez sur Entrée"
              className={errors.categories ? 'error' : ''}
            />
            
            <button
              type="button"
              onClick={() => categoryInput.trim() && addCategory(categoryInput)}
              className="btn-add-category"
            >
              Ajouter
            </button>
          </div>

          {/* Suggestions de catégories */}
          {showCategorySuggestions && filteredSuggestions.length > 0 && (
            <div className="category-suggestions">
              {filteredSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addCategory(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Catégories sélectionnées */}
          <div className="selected-categories">
            {formData.categories.map(category => (
              <span key={category} className="category-tag">
                {category}
                <button
                  type="button"
                  onClick={() => removeCategory(category)}
                  className="remove-category"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {errors.categories && <span className="error-message">{errors.categories}</span>}
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-secondary"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          {skill ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default SkillForm;
