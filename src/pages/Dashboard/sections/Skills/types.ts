export interface Skill {
  id: string;
  name: string;
  description?: string;
  level: 'Débutant' | 'Junior' | 'Senior'; // ✅ Modifié pour le backend
  icon: string; // URL ou chemin upload
  categories: string[];
  featured?: boolean; // ✅ Nouveau champ backend
  order?: number; // ✅ Nouveau champ backend
  isVisible?: boolean; // ✅ Nouveau champ backend
}

export interface SkillFormData {
  name: string;
  description?: string;
  level: 'Débutant' | 'Junior' | 'Senior';
  icon: string | File; // ✅ Support File pour upload
  categories: string[];
  featured?: boolean;
  order?: number;
  isVisible?: boolean;
}

export interface SkillsGrouped {
  [category: string]: Skill[];
}

// ✅ Types pour les réponses API
export interface SkillApiResponse {
  success: boolean;
  data?: Skill;
  count?: number;
  message?: string;
  error?: string;
}

export interface SkillsApiResponse {
  success: boolean;
  data?: Skill[];
  count?: number;
  message?: string;
  error?: string;
}
