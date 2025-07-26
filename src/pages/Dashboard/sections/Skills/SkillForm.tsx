import React, { useState, useRef, useEffect } from 'react';
import { Skill, SkillFormData } from './types';
import './SkillForm.scss';

interface SkillFormProps {
  skill?: Skill | null;
  existingCategories?: string[];
  onSubmit: (skillData: SkillFormData) => void;
  onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({
  skill,
  existingCategories = [],
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<SkillFormData>({
    name: skill?.name || '',
    description: skill?.description || '',
    level: skill?.level || 'Débutant',
    icon: skill?.icon || '',
    categories: skill?.categories || [],
    featured: skill?.featured || false,
    order: skill?.order || 0,
    isVisible: skill?.isVisible ?? true
  });

  const [iconPreview, setIconPreview] = useState<string>(skill?.icon || '');
  const [iconFile, setIconFile] = useState<File | null>(null);
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
        categories: skill.categories || [],
        featured: skill.featured || false,
        order: skill.order || 0,
        isVisible: skill.isVisible ?? true
      });
      setIconPreview(skill.icon || '');
    }
  }, [skill]);

  // 🎨 FONCTION POUR LES INFOS DE NIVEAU
  const getLevelInfo = (level: SkillFormData['level']) => {
    const levels = {
      'Débutant': { 
        icon: '🌱', 
        color: '#ef4444', 
        bgColor: 'rgba(239, 68, 68, 0.1)',
        description: 'Apprentissage des bases'
      },
      'Junior': { 
        icon: '⚡', 
        color: '#22c55e', 
        bgColor: 'rgba(34, 197, 94, 0.1)',
        description: 'Compétences solides'
      },
      'Senior': { 
        icon: '🚀', 
        color: '#3b82f6', 
        bgColor: 'rgba(59, 130, 246, 0.1)',
        description: 'Expertise avancée'
      }
    };
    return levels[level];
  };

  const handleInputChange = (field: keyof SkillFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 📁 Upload de fichier icône
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation du fichier
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, icon: 'Veuillez sélectionner une image' }));
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB
        setErrors(prev => ({ ...prev, icon: 'L\'image doit faire moins de 2MB' }));
        return;
      }

      setIconFile(file);
      
      // Preview local
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setIconPreview(result);
      };
      reader.readAsDataURL(file);
      
      // Clear URL input
      handleInputChange('icon', '');
    }
  };

  // 🌐 URL d'icône
  const handleIconUrlChange = (url: string) => {
    handleInputChange('icon', url);
    setIconPreview(url);
    setIconFile(null); // Clear file upload
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

    if (!formData.icon.trim() && !iconFile) {
      newErrors.icon = 'Une icône est requise (URL ou fichier)';
    }

    if (formData.categories.length === 0) {
      newErrors.categories = 'Au moins une catégorie est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Préparer les données à envoyer
    const submitData: SkillFormData = {
      ...formData,
      icon: iconFile || formData.icon // File ou URL
    };

    onSubmit(submitData);
  };

  const currentLevelInfo = getLevelInfo(formData.level);

  return (
    <form onSubmit={handleSubmit} className="skill-form">
      {/* Nom */}
      <div className="form-group">
        <label htmlFor="name">
          Nom de la compétence <span className="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={errors.name ? 'error' : ''}
          placeholder="Ex: React, TypeScript, Python..."
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Décrivez cette compétence..."
          rows={3}
        />
      </div>

      {/* Niveau */}
      <div className="form-group">
        <label>Niveau de maîtrise <span className="required">*</span></label>
        
        <div className="level-selection">
          {(['Débutant', 'Junior', 'Senior'] as const).map(level => {
            const levelInfo = getLevelInfo(level);
            return (
              <label 
                key={level}
                className={`level-option ${formData.level === level ? 'selected' : ''}`}
                style={{
                  backgroundColor: formData.level === level ? levelInfo.bgColor : 'transparent',
                  borderColor: formData.level === level ? levelInfo.color : '#e5e7eb'
                }}
              >
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={formData.level === level}
                  onChange={(e) => handleInputChange('level', e.target.value as any)}
                />
                <div className="level-content">
                  <span className="level-icon">{levelInfo.icon}</span>
                  <div className="level-text">
                    <span className="level-name">{level}</span>
                    <span className="level-desc">{levelInfo.description}</span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
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
              accept="image/*,.svg"
              onChange={handleIconUpload}
              style={{ display: 'none' }}
            />

            <div className="url-input-group">
              <input
                type="url"
                value={typeof formData.icon === 'string' ? formData.icon : ''}
                onChange={(e) => handleIconUrlChange(e.target.value)}
                placeholder="ou collez une URL d'image..."
                disabled={!!iconFile}
              />
              {iconFile && (
                <button
                  type="button"
                  onClick={() => {
                    setIconFile(null);
                    setIconPreview('');
                  }}
                  className="clear-file-btn"
                >
                  ❌
                </button>
              )}
            </div>
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
              ➕
            </button>
          </div>

          {/* Suggestions */}
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

          {/* Tags sélectionnés */}
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

      {/* Options avancées */}
      <div className="form-group">
        <label>Options</label>
        <div className="checkbox-group">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
            />
            <span>⭐ Mettre en avant (featured)</span>
          </label>
          
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={formData.isVisible}
              onChange={(e) => handleInputChange('isVisible', e.target.checked)}
            />
            <span>👁️ Visible publiquement</span>
          </label>
        </div>
      </div>

      {/* Ordre d'affichage */}
      <div className="form-group">
        <label htmlFor="order">Ordre d'affichage</label>
        <input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
          min="0"
          placeholder="0"
        />
        <small>Plus le nombre est petit, plus l'élément apparaîtra en premier</small>
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
