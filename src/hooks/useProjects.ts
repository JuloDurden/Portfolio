import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL, getAuthHeaders, getAuthHeadersForFormData } from '../config/api';
import type { Project, ProjectFormData } from '../pages/Dashboard/sections/Projects/types';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (projectData: ProjectFormData, coverFile?: File, picturesFiles?: File[]) => Promise<void>;
  updateProject: (id: string, projectData: ProjectFormData, coverFile?: File, picturesFiles?: File[]) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getRecentProjects: (limit?: number) => Project[];
  createProject: (projectData: ProjectFormData, coverFile: File, picturesFiles?: File[]) => Promise<void>;
  fetchProjects: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
}

export const useProjects = (): UseProjectsReturn => {
  // 🛡️ ÉTAT INITIAL SÉCURISÉ
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📡 FETCH PROJECTS - VERSION CORRIGÉE POUR PRÉSERVER LA STRUCTURE COVER
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Données brutes du serveur:', data);
      
      let projectsArray = [];
      
      if (data.success && Array.isArray(data.data)) {
        projectsArray = data.data.map((project: any) => {
          console.log('🖼️ Traitement projet:', {
            title: project.title,
            cover_brut: project.cover,
            pictures_brut: project.pictures
          });

          // 🔥 GESTION CORRECTE DU COVER - PRESERVE LA STRUCTURE ORIGINALE
          let processedCover;

          if (project.cover) {
            if (typeof project.cover === 'object' && project.cover.large) {
              // Cover est un objet avec small/large - GARDE LA STRUCTURE
              processedCover = {
                small: project.cover.small?.startsWith('http') 
                  ? project.cover.small
                  : `${API_BASE_URL}${project.cover.small}`,
                large: project.cover.large?.startsWith('http') 
                  ? project.cover.large
                  : `${API_BASE_URL}${project.cover.large}`
              };
            } else if (typeof project.cover === 'string') {
              // Cover est une string - crée la structure
              const fullUrl = project.cover.startsWith('http') 
                ? project.cover
                : `${API_BASE_URL}${project.cover}`;
              
              processedCover = {
                small: fullUrl,
                large: fullUrl
              };
            } else {
              // Fallback
              processedCover = {
                small: '/images/project-placeholder.jpg',
                large: '/images/project-placeholder.jpg'
              };
            }
          } else {
            // Pas de cover
            processedCover = {
              small: '/images/project-placeholder.jpg',
              large: '/images/project-placeholder.jpg'
            };
          }

          return {
            ...project,
            id: project._id || project.id,
            // ✅ COVER AVEC STRUCTURE {small, large}
            cover: processedCover,
            // ✅ GARDE LE COVER ORIGINAL POUR L'ÉDITION
            originalCover: project.cover,
            // ✅ PICTURES (ARRAY DE STRINGS)
            pictures: Array.isArray(project.pictures) 
              ? project.pictures.map((pic: string) => 
                  pic.startsWith('http') 
                    ? pic 
                    : `${API_BASE_URL}${pic}`
                )
              : []
          };
        });
        
        console.log('✅ Projects avec URLs finales:', projectsArray.map(p => ({
          title: p.title, 
          id: p.id,
          cover: p.cover,
          picturesCount: p.pictures?.length || 0
        })));
        
      } else if (Array.isArray(data)) {
        projectsArray = data.map((project: any) => {
          // 🔥 MÊME LOGIQUE POUR LE CAS data DIRECT
          let processedCover;
          
          if (project.cover) {
            if (typeof project.cover === 'object' && project.cover.large) {
              processedCover = {
                small: project.cover.small?.startsWith('http') 
                  ? project.cover.small
                  : `${API_BASE_URL}${project.cover.small}`,
                large: project.cover.large?.startsWith('http') 
                  ? project.cover.large
                  : `${API_BASE_URL}${project.cover.large}`
              };
            } else if (typeof project.cover === 'string') {
              const fullUrl = project.cover.startsWith('http') 
                ? project.cover
                : `${API_BASE_URL}${project.cover}`;
              
              processedCover = {
                small: fullUrl,
                large: fullUrl
              };
            } else {
              processedCover = {
                small: '/images/project-placeholder.jpg',
                large: '/images/project-placeholder.jpg'
              };
            }
          } else {
            processedCover = {
              small: '/images/project-placeholder.jpg',
              large: '/images/project-placeholder.jpg'
            };
          }

          return {
            ...project,
            id: project._id || project.id,
            cover: processedCover,
            originalCover: project.cover,
            pictures: Array.isArray(project.pictures) 
              ? project.pictures.map((pic: string) => 
                  pic.startsWith('http') 
                    ? pic 
                    : `${API_BASE_URL}${pic}`
                )
              : []
          };
        });
      } else {
        console.warn('❌ Format inattendu:', data);
        projectsArray = [];
      }
      
      setProjects(projectsArray);
      
    } catch (err) {
      console.error('Erreur fetch projects:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔍 GET PROJECT BY ID
  const getProjectById = useCallback((id: string): Project | undefined => {
    return projects.find(project => project._id === id || project.id === id);
  }, [projects]);

  // 🆕 CREATE PROJECT - CORRIGÉ SANS ID
  const createProject = useCallback(async (
    projectData: ProjectFormData,
    coverFile: File,
    picturesFiles?: File[]
  ) => {
    try {
      console.log('➕ createProject appelé');
      setLoading(true);
      
      const formData = new FormData();
      
      // 🔥 PAS D'ID POUR LA CRÉATION !
      formData.append('title', projectData.title);
      formData.append('subtitle', projectData.subtitle || '');
      formData.append('description', projectData.description || '');
      formData.append('category', projectData.category || '');
      formData.append('featured', String(projectData.featured || false));
      
      // 🔥 GESTION SÉCURISÉE DES ARRAYS
      if (projectData.competences?.length) {
        projectData.competences.forEach(comp => {
          formData.append('competences[]', comp);
        });
      }
      
      if (projectData.technologies?.length) {
        projectData.technologies.forEach(tech => {
          formData.append('technologies[]', tech);
        });
      }
      
      // 🔥 INFORMATIONS SÉCURISÉES
      formData.append('informations[client]', projectData.informations?.client || '');
      formData.append('informations[date]', projectData.informations?.date || new Date().toISOString().split('T')[0]);
      
      // 🔥 LIENS SÉCURISÉS
      formData.append('links[website]', projectData.links?.website || '');
      formData.append('links[github]', projectData.links?.github || '');
      
      // 🔥 FICHIERS
      formData.append('cover', coverFile);
      
      if (picturesFiles?.length) {
        picturesFiles.forEach(file => {
          formData.append('pictures', file);
        });
      }

      console.log('📤 Envoi des données de création...');
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: getAuthHeadersForFormData(),
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Erreur serveur:', error);
        throw new Error(`Erreur création: ${response.status} - ${error}`);
      }

      console.log('✅ Projet créé avec succès');
      await fetchProjects();
    } catch (err) {
      console.error('❌ Erreur création projet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  // ✏️ UPDATE PROJECT
  const updateProject = useCallback(async (
    id: string,
    projectData: ProjectFormData,
    coverFile?: File,
    picturesFiles?: File[]
  ) => {
    try {
      console.log('🔧 updateProject appelé pour ID:', id);
      setLoading(true);
      
      const formData = new FormData();
      
      formData.append('title', projectData.title);
      formData.append('subtitle', projectData.subtitle || '');
      formData.append('description', projectData.description || '');
      formData.append('category', projectData.category || '');
      formData.append('featured', String(projectData.featured || false));
      
      if (projectData.competences?.length) {
        projectData.competences.forEach(comp => {
          formData.append('competences[]', comp);
        });
      }
      
      if (projectData.technologies?.length) {
        projectData.technologies.forEach(tech => {
          formData.append('technologies[]', tech);
        });
      }
      
      formData.append('informations[client]', projectData.informations?.client || '');
      formData.append('informations[date]', projectData.informations?.date || new Date().toISOString().split('T')[0]);
      
      formData.append('links[website]', projectData.links?.website || '');
      formData.append('links[github]', projectData.links?.github || '');
      
      if (coverFile) {
        formData.append('cover', coverFile);
      }
      
      if (picturesFiles?.length) {
        picturesFiles.forEach(file => {
          formData.append('pictures', file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeadersForFormData(),
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erreur mise à jour: ${response.status} - ${error}`);
      }

      console.log('✅ Projet mis à jour avec succès');
      await fetchProjects();
    } catch (err) {
      console.error('❌ Erreur update projet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  // 🗑️ DELETE PROJECT
  const deleteProject = useCallback(async (id: string) => {
    try {
      console.log('🗑️ deleteProject appelé pour ID:', id);
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Erreur suppression: ${response.status} - ${error}`);
      }

      console.log('✅ Projet supprimé avec succès');
      await fetchProjects();
    } catch (err) {
      console.error('❌ Erreur suppression projet:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  // 🔥 GET RECENT PROJECTS (SÉCURISÉ)
  const getRecentProjects = useCallback((limit: number = 3): Project[] => {
    if (!Array.isArray(projects) || projects.length === 0) {
      return [];
    }

    try {
      return projects
        .filter(project => project?.informations?.date)
        .sort((a, b) => new Date(b.informations.date).getTime() - new Date(a.informations.date).getTime())
        .slice(0, limit);
    } catch (err) {
      console.error('Erreur tri projets:', err);
      return projects.slice(0, limit);
    }
  }, [projects]);

  // 🔥 ADD PROJECT (alias) - CORRIGÉ
  const addProject = useCallback(async (
    projectData: ProjectFormData,
    coverFile?: File,
    picturesFiles?: File[]
  ) => {
    if (!coverFile) {
      throw new Error('Une image de couverture est requise pour créer un projet');
    }
    return createProject(projectData, coverFile, picturesFiles);
  }, [createProject]);

  // 🚀 INITIAL LOAD
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    getRecentProjects,
    getProjectById,
    createProject,
    fetchProjects,
  };
};

export default useProjects;
