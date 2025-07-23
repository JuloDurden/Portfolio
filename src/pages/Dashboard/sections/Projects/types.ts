// src/components/sections/Projects/types.ts
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  cover: string; // Image cover (petite résolution pour la carte)
  description: string;
  pictures: string[]; // Images haute résolution pour ProjectDetail
  competences: string[]; // Skills sélectionnés depuis la section Skills
  informations: {
    client?: string;
    date: string;
  };
  links: {
    website?: string;
    github?: string;
  };
  technologies: string[];
}
