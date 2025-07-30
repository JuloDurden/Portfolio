import React, { useState, useEffect } from 'react';
import ProfilePictureUpload from './ProfilePictureUpload';
import { PersonalData, PersonalDataFormErrors } from './types';
import { useUserData, ChangePasswordData } from '../../../../hooks/useUserData';
import './PersonalDataForm.scss';

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

  // 🔐 NOUVEAUX STATES POUR LE MOT DE PASSE
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<{[key: string]: string}>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 🔐 HOOK POUR LE CHANGEMENT DE MOT DE PASSE
  const { changePassword } = useUserData();

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

  // 🔐 VALIDATION MOT DE PASSE
  const validatePassword = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Le mot de passe actuel est requis';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer le nouveau mot de passe';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe doit être différent de l\'ancien';
    }

    setPasswordErrors(newErrors);
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

  // 🔐 GESTION CHANGEMENTS MOT DE PASSE
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: undefined }));
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

        // 📤 PRÉPARER FORMDATA
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

  // 🔐 CHANGEMENT DE MOT DE PASSE
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔐 Changement de mot de passe...');
    
    if (!validatePassword()) {
      console.log('❌ Validation mot de passe échouée');
      return;
    }

    setIsChangingPassword(true);
    setPasswordErrors(prev => ({ ...prev, submit: undefined }));

    try {
      await changePassword(passwordData);
      
      console.log('✅ Mot de passe changé avec succès');
      
      // 🎯 Reset du formulaire mot de passe
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
      
      // TODO: Afficher un message de succès
      alert('✅ Mot de passe changé avec succès !');
      
    } catch (error: any) {
      console.error('❌ Erreur changement mot de passe:', error);
      setPasswordErrors(prev => ({
        ...prev,
        submit: error.message || 'Erreur lors du changement de mot de passe'
      }));
    } finally {
      setIsChangingPassword(false);
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

  // 🔐 RESET MOT DE PASSE
  const handlePasswordReset = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
    setShowPasswordSection(false);
  };

  const isFormLoading = isLoading || isSaving || isUploadingAvatar;

  return (
    <div className="personal-data-form-container">
      {/* 📝 FORMULAIRE DONNÉES PERSONNELLES */}
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

        {/* 💾 ACTIONS - DONNÉES PERSONNELLES */}
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

      {/* 🔐 SECTION CHANGEMENT MOT DE PASSE */}
      <div className="password-section">
        <div className="password-section__header">
          <h3 className="password-section__title">🔐 Sécurité</h3>
          {!showPasswordSection ? (
            <button
              type="button"
              onClick={() => setShowPasswordSection(true)}
              className="password-section__toggle-btn"
              disabled={isFormLoading}
            >
              🔑 Changer le mot de passe
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePasswordReset}
              className="password-section__toggle-btn password-section__toggle-btn--cancel"
              disabled={isChangingPassword}
            >
              ❌ Annuler
            </button>
          )}
        </div>

        {showPasswordSection && (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            {/* ❌ ERREUR GÉNÉRALE MOT DE PASSE */}
            {passwordErrors.submit && (
              <div className="password-form__error password-form__error--global">
                ❌ {passwordErrors.submit}
              </div>
            )}

            <div className="password-form__fields">
              <div className="password-form__field">
                <label htmlFor="currentPassword" className="password-form__label">
                  🔐 Mot de passe actuel *
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`password-form__input ${
                    passwordErrors.currentPassword ? 'password-form__input--error' : ''
                  }`}
                  placeholder="Votre mot de passe actuel"
                  disabled={isChangingPassword}
                />
                {passwordErrors.currentPassword && (
                  <div className="password-form__error">{passwordErrors.currentPassword}</div>
                )}
              </div>

              <div className="password-form__field">
                <label htmlFor="newPassword" className="password-form__label">
                  🆕 Nouveau mot de passe *
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`password-form__input ${
                    passwordErrors.newPassword ? 'password-form__input--error' : ''
                  }`}
                  placeholder="Nouveau mot de passe (min. 6 caractères)"
                  disabled={isChangingPassword}
                />
                {passwordErrors.newPassword && (
                  <div className="password-form__error">{passwordErrors.newPassword}</div>
                )}
              </div>

              <div className="password-form__field">
                <label htmlFor="confirmPassword" className="password-form__label">
                  ✅ Confirmer le nouveau mot de passe *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`password-form__input ${
                    passwordErrors.confirmPassword ? 'password-form__input--error' : ''
                  }`}
                  placeholder="Confirmez le nouveau mot de passe"
                  disabled={isChangingPassword}
                />
                {passwordErrors.confirmPassword && (
                  <div className="password-form__error">{passwordErrors.confirmPassword}</div>
                )}
              </div>
            </div>

            {/* 🔐 ACTIONS MOT DE PASSE */}
            <div className="password-form__actions">
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={isChangingPassword}
                className="password-form__btn password-form__btn--secondary"
              >
                🔄 Annuler
              </button>
              
              <button
                type="submit"
                disabled={isChangingPassword}
                className="password-form__btn password-form__btn--primary"
              >
                {isChangingPassword ? '🔐 Changement...' : '🔑 Changer le mot de passe'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PersonalDataForm;
