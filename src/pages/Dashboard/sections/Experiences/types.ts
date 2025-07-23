// ====================================
// 💼 EXPERIENCES TYPES
// ====================================

export type ExperienceType = 'experience' | 'formation';

export interface Experience {
  id?: string;
  type: ExperienceType;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrentlyActive: boolean;
  description: string[];
  technologies: string[];
  photo?: string | null; // 🆕 PHOTO AJOUTÉE !
  photoFile?: File | null; // Pour l'upload
  createdAt?: string;
  updatedAt?: string;
}

// ====================================
// 📝 FORM TYPES
// ====================================

export interface ExperienceFormData {
  type: ExperienceType;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrentlyActive: boolean;
  description: string[];
  technologies: string[];
  photo?: string | null;
  photoFile?: File | null;
}

export interface ExperienceFormProps {
  experience?: Experience;
  mode: 'create' | 'edit';
  onSubmit: (data: ExperienceFormData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  isSubmitting?: boolean;
}

// ====================================
// 📊 SECTION TYPES
// ====================================

export interface ExperiencesStats {
  totalExperiences: number;
  totalFormations: number;
  totalCount: number;
  activeExperiences: number;
}

export interface ExperiencesSectionProps {
  experiences?: Experience[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

// ====================================
// 🖼️ PHOTO UPLOAD TYPES
// ====================================

export interface ExperiencePhotoUploadProps {
  currentPhoto?: string | null;
  onPhotoChange: (file: File | null) => void;
  onPhotoRemove: () => void;
  disabled?: boolean;              // Pour désactiver l'upload
  maxSize?: number;                // Taille max en bytes (défaut: 5MB)
  acceptedTypes?: string[];        // Types MIME acceptés
  isUploading?: boolean;           // État de chargement externe
  error?: string;                  // Erreur externe
  className?: string;              // Classes CSS additionnelles
}

export interface PhotoUploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
}

// ====================================
// 🔄 API TYPES
// ====================================

export interface CreateExperienceRequest {
  type: ExperienceType;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrentlyActive: boolean;
  description: string[];
  technologies: string[];
  photoFile?: File;
}

export interface UpdateExperienceRequest extends CreateExperienceRequest {
  id: string;
  removePhoto?: boolean;
}

export interface ExperienceResponse {
  success: boolean;
  data: Experience;
  message?: string;
}

export interface ExperiencesListResponse {
  success: boolean;
  data: Experience[];
  stats: ExperiencesStats;
  message?: string;
}

// ====================================
// 📋 FILTER & SORT TYPES
// ====================================

export type ExperienceFilterType = 'all' | 'experience' | 'formation' | 'active';

export type ExperienceSortType = 'newest' | 'oldest' | 'title' | 'company';

export interface ExperienceFilters {
  type: ExperienceFilterType;
  sort: ExperienceSortType;
  search: string;
}

// ====================================
// ⚠️ ERROR TYPES
// ====================================

export interface ExperienceFormErrors {
  title?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  technologies?: string;
  photo?: string;
  general?: string;
}

export interface ExperienceValidationResult {
  isValid: boolean;
  errors: ExperienceFormErrors;
}

// ====================================
// 🎯 UTILITY TYPES
// ====================================

export type ExperienceField = keyof Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;

export type RequiredExperienceFields = Pick<Experience, 'type' | 'title' | 'company' | 'location' | 'startDate'>;

export type OptionalExperienceFields = Partial<Omit<Experience, keyof RequiredExperienceFields>>;

// ====================================
// 📈 MOCK DATA TYPE
// ====================================

export interface MockExperienceData {
  experiences: Experience[];
  formations: Experience[];
}

// ====================================
// 🔍 SEARCH & PAGINATION
// ====================================

export interface ExperienceSearchParams {
  query?: string;
  type?: ExperienceFilterType;
  page?: number;
  limit?: number;
  sortBy?: ExperienceSortType;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedExperiencesResponse {
  experiences: Experience[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
