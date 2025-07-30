export interface PersonalData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  githubUrl: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalDataFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  githubUrl?: string;
  profilePicture?: string;
  submit?: string; // 🆕 Pour les erreurs générales de soumission
}

export interface ProfilePictureUploadProps {
  currentPicture?: string;
  onPictureChange: (file: File | null, previewUrl: string | null) => void;
  error?: string;
  isUploading?: boolean; // 🆕 Pour afficher l'état d'upload
}

// 🔐 TYPES POUR LE CHANGEMENT DE MOT DE PASSE
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordFormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  submit?: string; // Pour les erreurs générales (ex: mauvais mot de passe actuel)
}

// 🎯 RÉPONSE API POUR LE CHANGEMENT DE MOT DE PASSE
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    updatedAt: string;
  };
}
