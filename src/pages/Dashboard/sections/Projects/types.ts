// Backend-compatible types
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  cover: {
    small: string;  // 400x400 pour ProjectCard
    large: string;  // 1000x1000 pour détails + pictures[]
  };
  description: string;
  pictures: string[]; // Images supplémentaires + cover.large automatiquement
  competences: string[];
  informations: {
    client?: string;
    date: string;
  };
  links: {
    website?: string;
    github?: string;
  };
  technologies: string[];
  category?: string;
  featured?: boolean;
}

// Pour les formulaires
export interface ProjectFormData {
  title: string;
  subtitle: string;
  description: string;
  competences: string[];
  informations: {
    client?: string;
    date: string;
  };
  links: {
    website?: string;
    github?: string;
  };
  technologies: string[];
  category?: string;
  featured?: boolean;
}
