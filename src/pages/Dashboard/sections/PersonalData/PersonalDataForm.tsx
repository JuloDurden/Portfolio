import React, { useState, useEffect } from 'react';
import ProfilePictureUpload from './ProfilePictureUpload';
import { PersonalData, PersonalDataFormErrors } from './types';

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

  // 🔄 Met à jour formData quand initialData change
  useEffect(() => {
    if (initialData) {
      console.log('🔄 Mise à jour formData avec initialData:', initialData);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        githubUrl: '',
        profilePicture: '',
        ...initialData
      });
      setProfilePreview(initialData.profilePicture || null);
    }
  }, [initialData]);

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

  // 📸 UPLOAD Avatar avec CLOUDINARY SUPPORT
  const handlePictureChange = async (file: File | null, previewUrl: string | null) => {
    console.log('📸 handlePictureChange appelé avec file:', !!file);
    
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
        // 🔑 RÉCUPÉRER LE TOKEN
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token d\'authentification manquant');
        }

        // 📦 PRÉPARER FormData
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', file);

        // 🎯 URL CORRECTE (selon les routes)
        const API_URL = import.meta.env.VITE_API_URL;
        const uploadUrl = `${API_URL}/api/user/avatar`;
        
        console.log('🔗 URL d\'upload utilisée:', uploadUrl);
        console.log('🔑 Token présent:', !!token);

        // 🚀 REQUÊTE D'UPLOAD
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST', // Correspond à router.post('/avatar', ...)
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: avatarFormData
        });

        console.log('📡 Response status upload:', uploadResponse.status);
        console.log('📡 Response headers:', Object.fromEntries(uploadResponse.headers.entries()));

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('❌ Erreur serveur:', errorText);
          throw new Error(`Erreur HTTP ${uploadResponse.status}: ${errorText}`);
        }

        // 🔍 PARSING SÉCURISÉ DE LA RÉPONSE
        const responseText = await uploadResponse.text();
        console.log('📄 Response text brut:', responseText);

        if (!responseText.trim()) {
          throw new Error('Réponse vide du serveur');
        }

        let uploadResult;
        try {
          uploadResult = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ Erreur parsing JSON:', parseError);
          throw new Error(`Réponse serveur invalide: ${responseText.substring(0, 100)}`);
        }

        console.log('✅ Avatar uploadé avec succès !', uploadResult);
        
        // 📝 🌟 TRAITER L'URL CLOUDINARY
        if (uploadResult.success && uploadResult.data?.profilePicture) {
          let newAvatarUrl = uploadResult.data.profilePicture;
          console.log('📸 URL avatar reçue depuis DB:', newAvatarUrl);
          
          // ✅ CLOUDINARY URL - Utiliser directement
          if (newAvatarUrl.startsWith('https://res.cloudinary.com/')) {
            console.log('🌟 URL Cloudinary détectée - utilisation directe');
            setFormData(prev => ({
              ...prev,
              profilePicture: newAvatarUrl
            }));
            setProfilePreview(newAvatarUrl);
          } 
          // 🔧 RAILWAY FALLBACK
          else if (!newAvatarUrl.startsWith('http')) {
            newAvatarUrl = `${API_URL}/${newAvatarUrl}`;
            console.log('🔧 URL Railway générée:', newAvatarUrl);
            setFormData(prev => ({
              ...prev,
              profilePicture: newAvatarUrl
            }));
            setProfilePreview(newAvatarUrl);
          }
          // ✅ URL COMPLÈTE 
          else {
            console.log('✅ URL complète détectée');
            setFormData(prev => ({
              ...prev,
              profilePicture: newAvatarUrl
            }));
            setProfilePreview(newAvatarUrl);
          }
          
          setProfileFile(null); // Reset car déjà uploadé
          
        } else {
          console.warn('⚠️ Réponse inattendue:', uploadResult);
          throw new Error('Format de réponse inattendu du serveur');
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

  // 💾 Soumission FORM - UTILISE onSave DU PARENT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Sauvegarde des données personnelles...');
    
    if (!validateForm()) {
      console.log('❌ Validation échouée');
      return;
    }

    setIsSaving(true);
    setErrors(prev => ({ ...prev, submit: undefined }));

    try {
      // 🔥 APPELER LA FONCTION PARENT onSave
      await onSave(formData, profileFile);
      
      console.log('✅ Données sauvegardées avec succès');
      
      // 🎯 Reset des états locaux
      setHasChanges(false);
      setProfileFile(null);
      
    } catch (error: any) {
      console.log('❌ Erreur sauvegarde PersonalData:', error);
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Erreur de sauvegarde'
      }));
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
      
      {/* ❌ ERREUR GÉNÉRALE */}
      {errors.submit && (
        <div className="personal-data-form__error personal-data-form__error--global">
          ❌ {errors.submit}
        </div>
      )}

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
        {errors.profilePicture && (
          <div className="personal-data-form__error">
            ⚠️ {errors.profilePicture}
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

      {/* 🐛 DEBUG FORM DATA */}
      <div style={{ 
        background: '#e8f4f8', 
        color: '#000000',
        padding: '8px', 
        margin: '10px 0', 
        fontSize: '11px',
        fontFamily: 'monospace',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}>
        <strong>🐛 DEBUG FORM:</strong><br/>
        FirstName: "{formData.firstName}" | LastName: "{formData.lastName}"<br/>
        Email: "{formData.email}" | Date: "{formData.dateOfBirth}"<br/>
        GitHub: "{formData.githubUrl}"<br/>
        ProfilePicture: "{formData.profilePicture?.substring(0, 80)}..."<br/>
        ProfilePreview: "{profilePreview?.substring(0, 80)}..."<br/>
        HasChanges: {hasChanges ? '✅' : '❌'} | Loading: {isFormLoading ? '🔄' : '✅'}<br/>
        UploadingAvatar: {isUploadingAvatar ? '📸' : '❌'}<br/>
        🌟 URL Type: {formData.profilePicture?.includes('cloudinary.com') ? 'CLOUDINARY' : 'RAILWAY'}
      </div>
    </form>
  );
};

export default PersonalDataForm;
