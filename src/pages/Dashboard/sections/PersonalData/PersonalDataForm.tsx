import React, { useState, useEffect } from 'react';
import ProfilePictureUpload from './ProfilePictureUpload';
import { PersonalData, PersonalDataFormErrors } from './types';
import { updatePersonalData, uploadAvatar } from '../../../../userService';

interface PersonalDataFormProps {
  initialData?: PersonalData;
  onSave: (data: PersonalData, profileFile?: File) => Promise<void>;
  isLoading?: boolean;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({
  initialData,
  onSave,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<PersonalData>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    githubUrl: '',
    profilePicture: '',
    ...initialData
  });
  
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    initialData?.profilePicture || null
  );
  const [errors, setErrors] = useState<PersonalDataFormErrors>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // 🔄 Détecter les changements
  useEffect(() => {
    if (!initialData) {
      setHasChanges(true);
      return;
    }

    const hasDataChanged = JSON.stringify(formData) !== JSON.stringify(initialData);
    const hasFileChanged = profileFile !== null;
    setHasChanges(hasDataChanged || hasFileChanged);
  }, [formData, profileFile, initialData]);

  // ✅ Validation
  const validateForm = (): boolean => {
    const newErrors: PersonalDataFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom de famille est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La date de naissance est requise';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16 || age > 100) {
        newErrors.dateOfBirth = 'Âge invalide';
      }
    }

    if (formData.githubUrl && !formData.githubUrl.includes('github.com/')) {
      newErrors.githubUrl = 'URL GitHub invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📝 Gestion changements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof PersonalDataFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // 📸 UPLOAD Avatar séparé
  const handlePictureChange = async (file: File | null, previewUrl: string | null) => {
    // 📝 Met à jour localement d'abord
    setProfileFile(file);
    setProfilePreview(previewUrl || initialData?.profilePicture || null);
    
    if (errors.profilePicture) {
      setErrors(prev => ({ ...prev, profilePicture: undefined }));
    }

    // 📸 🚀 UPLOAD IMMÉDIAT si fichier sélectionné
    if (file) {
      console.log('📸 Upload avatar immédiat...');
      setIsUploadingAvatar(true);
      
      try {
        // 🎯 APPEL CORRIGÉ - GESTION DU SUCCESS
        const uploadResult = await uploadAvatar(file);
        
        console.log('✅ Avatar uploadé avec succès !', uploadResult);
        
        // 📝 Met à jour formData avec la nouvelle URL
        if (uploadResult.avatarUrl) {
          setFormData(prev => ({
            ...prev,
            profilePicture: uploadResult.avatarUrl
          }));
          
          setProfilePreview(uploadResult.avatarUrl);
          setProfileFile(null); // Reset car déjà uploadé
        }
        
      } catch (error: any) {
        console.error('❌ Erreur upload avatar:', error);
        setErrors(prev => ({ 
          ...prev, 
          profilePicture: error.message || 'Erreur lors de l\'upload' 
        }));
        
        // Revenir à l'état précédent en cas d'erreur
        setProfilePreview(initialData?.profilePicture || null);
        setProfileFile(null);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  // 💾 Soumission FORM (sans upload avatar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      console.log('📝 Sauvegarde des données personnelles...');
      const result = await updatePersonalData(formData);

      if (result.success) {
        console.log('✅ Données sauvegardées avec succès');
        
        // 🔄 Appeler le callback parent
        await onSave(formData);
        
        // 🎯 Reset des états locaux
        setHasChanges(false);
        setProfileFile(null);
        
      } else {
        throw new Error(result.message || 'Erreur lors de la sauvegarde');
      }

    } catch (error: any) {
      console.error('❌ Erreur sauvegarde PersonalData:', error);
      
      if (error.message?.includes('email')) {
        setErrors(prev => ({ ...prev, email: 'Cet email est déjà utilisé' }));
      } else {
        console.error('Erreur générale:', error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // 🔄 Reset form
  const handleReset = () => {
    setFormData(initialData || {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      githubUrl: '',
      profilePicture: ''
    });
    setProfileFile(null);
    setProfilePreview(initialData?.profilePicture || null);
    setErrors({});
    setHasChanges(false);
  };

  const isFormLoading = isLoading || isSaving || isUploadingAvatar;

  return (
    <form onSubmit={handleSubmit} className="personal-data-form">
      
      {/* 📸 PHOTO DE PROFIL */}
      <div className="personal-data-form__picture">
        <ProfilePictureUpload
          currentPicture={profilePreview || undefined}
          onPictureChange={handlePictureChange}
          error={errors.profilePicture}
          isUploading={isUploadingAvatar}
        />
        {isUploadingAvatar && (
          <div className="personal-data-form__upload-status">
            📸 Upload en cours...
          </div>
        )}
      </div>

      {/* 📝 CHAMPS FORMULAIRE */}
      <div className="personal-data-form__fields">
        <div className="personal-data-form__row">
          <div className="personal-data-form__field">
            <label htmlFor="firstName" className="personal-data-form__label">
              👤 Prénom *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`personal-data-form__input ${
                errors.firstName ? 'personal-data-form__input--error' : ''
              }`}
              placeholder="Votre prénom"
              disabled={isFormLoading}
            />
            {errors.firstName && (
              <div className="personal-data-form__error">{errors.firstName}</div>
            )}
          </div>

          <div className="personal-data-form__field">
            <label htmlFor="lastName" className="personal-data-form__label">
              👤 Nom de famille *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`personal-data-form__input ${
                errors.lastName ? 'personal-data-form__input--error' : ''
              }`}
              placeholder="Votre nom de famille"
              disabled={isFormLoading}
            />
            {errors.lastName && (
              <div className="personal-data-form__error">{errors.lastName}</div>
            )}
          </div>
        </div>

        <div className="personal-data-form__field">
          <label htmlFor="email" className="personal-data-form__label">
            📧 Adresse email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`personal-data-form__input ${
              errors.email ? 'personal-data-form__input--error' : ''
            }`}
            placeholder="votre@email.com"
            disabled={isFormLoading}
          />
          {errors.email && (
            <div className="personal-data-form__error">{errors.email}</div>
          )}
        </div>

        <div className="personal-data-form__field">
          <label htmlFor="dateOfBirth" className="personal-data-form__label">
            🎂 Date de naissance *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`personal-data-form__input ${
              errors.dateOfBirth ? 'personal-data-form__input--error' : ''
            }`}
            disabled={isFormLoading}
          />
          {errors.dateOfBirth && (
            <div className="personal-data-form__error">{errors.dateOfBirth}</div>
          )}
        </div>

        <div className="personal-data-form__field">
          <label htmlFor="githubUrl" className="personal-data-form__label">
            🐙 URL GitHub
          </label>
          <input
            type="url"
            id="githubUrl"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            className={`personal-data-form__input ${
              errors.githubUrl ? 'personal-data-form__input--error' : ''
            }`}
            placeholder="https://github.com/votre-username"
            disabled={isFormLoading}
          />
          {errors.githubUrl && (
            <div className="personal-data-form__error">{errors.githubUrl}</div>
          )}
        </div>
      </div>

      {/* 💾 ACTIONS */}
      <div className="personal-data-form__actions">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges || isFormLoading}
          className="personal-data-form__btn personal-data-form__btn--secondary"
        >
          🔄 Annuler
        </button>
        
        <button
          type="submit"
          disabled={!hasChanges || isFormLoading}
          className="personal-data-form__btn personal-data-form__btn--primary"
        >
          {isSaving 
            ? '💾 Sauvegarde...' 
            : isUploadingAvatar 
            ? '📸 Upload...' 
            : '💾 Sauvegarder'
          }
        </button>
      </div>
    </form>
  );
};

export default PersonalDataForm;
