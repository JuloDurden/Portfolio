// src/components/sections/Projects/ProjectsList.tsx
import React, { useState } from 'react';
import { useProjects } from '../../../../hooks/useProjects';
import ProjectCard from '../../../../components/ProjectCard/ProjectCard';
import ProjectForm from './ProjectForm';
import Modal from '../../../../components/Modal/Modal';
import { Project } from './types';
import './ProjectsList.scss';

const ProjectsList: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, loading } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  // Filtrage et tri
  const filteredProjects = projects
    .filter(project => 
      project.title.toLowerCase().includes(filter.toLowerCase()) ||
      project.technologies.some(tech => 
        tech.toLowerCase().includes(filter.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.informations.date).getTime() - new Date(a.informations.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  const handleAddProject = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      await deleteProject(projectId);
    }
  };

  const handleFormSubmit = async (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      await updateProject(editingProject.id, projectData);
    } else {
      await addProject(projectData);
    }
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProject(null);
  };

  if (loading) {
    return <div className="projects-section__loading">Chargement des projets...</div>;
  }

  return (
    <section id="projects-section" className="projects-section">
      {/* 📊 HEADER UNIFORME */}
      <div className="projects-section__header">
        <div className="projects-section__header-content">
          <h2 className="projects-section__title">
            🚀 Projets
          </h2>
          <p className="projects-section__subtitle">
            Gérez votre portfolio de projets
          </p>
        </div>
        
        <button 
          className="btn-primary"
          onClick={handleAddProject}
        >
          + Ajouter un projet
        </button>
      </div>

      {/* 🔍 FILTRES */}
      <div className="projects-section__filters">
        <input
          type="text"
          placeholder="Rechercher par titre ou technologie..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="projects-section__search"
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
          className="projects-section__sort"
        >
          <option value="date">Trier par date</option>
          <option value="title">Trier par titre</option>
        </select>
      </div>

      {/* 🎯 GRILLE 3x3 DES PROJETS */}
      <div className="projects-section__grid">
        {filteredProjects.length === 0 ? (
          <div className="projects-section__empty">
            <p>Aucun projet trouvé</p>
            <button 
              onClick={handleAddProject} 
              className="btn-primary"
            >
              Créer votre premier projet
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="projects-section__item">
              <ProjectCard project={project} />
              
              <div className="projects-section__actions">
                <button
                  onClick={() => handleEditProject(project)}
                  className="btn-secondary btn-small"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="btn-danger btn-small"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {isFormOpen && (
        <Modal
          onClose={handleFormClose}
          title={editingProject ? 'Modifier le projet' : 'Nouveau projet'}
          size="large"
        >
          <ProjectForm
            project={editingProject}
            onSubmit={handleFormSubmit}
            onCancel={handleFormClose}
          />
        </Modal>
      )}
    </section>
  );
};

export default ProjectsList;
