// hooks/useProjects.ts
import { useState, useEffect } from 'react';
import projectsData from '../data/projects.json';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  description: string;
  pictures: string[];
  competences: string[];
  informations: {
    client: string;
    date: string;
  };
  links: {
    website?: string;
    github: string;
  };
  technologies: string[];
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'un chargement async
    setTimeout(() => {
      setProjects(projectsData);
      setLoading(false);
    }, 100);
  }, []);

  const getProjectById = (id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  };

  const getRecentProjects = (count: number = 3): Project[] => {
    return projects.slice(0, count);
  };

  return { 
    projects, 
    loading, 
    getProjectById, 
    getRecentProjects 
  };
};
