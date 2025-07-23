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
}

export interface ProfilePictureUploadProps {
  currentPicture?: string;
  onPictureChange: (file: File | null, previewUrl: string | null) => void;
  error?: string;
}
