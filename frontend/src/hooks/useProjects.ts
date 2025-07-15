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
    // Chargement immédiat des données
    console.log('🔄 Chargement des projets...');
    setProjects(projectsData);
    setLoading(false);
    console.log('✅ Projets chargés:', projectsData.length);
  }, []);

  const getProjectById = (id: string): Project | undefined => {
    console.log('🔍 Recherche du projet avec ID:', id);
    console.log('📋 Projets disponibles:', projects.map(p => p.id));
    
    const foundProject = projects.find(project => project.id === id);
    console.log('🎯 Projet trouvé:', foundProject);
    
    return foundProject;
  };

  const getRecentProjects = (count: number = 3): Project[] => {
    return projects.slice(-count).reverse();
  };

  return { 
    projects, 
    loading, 
    getProjectById, 
    getRecentProjects 
  };
};
