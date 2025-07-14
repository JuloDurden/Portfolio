// pages/Projects/Projects.tsx
import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './Projects.scss';

const Projects: React.FC = () => {
  const { projects, loading } = useProjects();

  if (loading) {
    return (
      <div className="projects">
        <div className="projects__container">
          <div className="projects__loading">Chargement des projets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="projects">
      <div className="projects__container">
        <header className="projects__header">
          <h1 className="projects__title">Mes Projets</h1>
          <p className="projects__description">
            Découvrez une sélection de mes réalisations, des projets d'apprentissage 
            aux créations personnelles. Chaque projet témoigne de mon évolution et 
            de ma passion pour le développement web.
          </p>
        </header>

        <div className="projects__grid">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="projects__stats">
          <div className="projects__stat">
            <span className="projects__stat-number">{projects.length}</span>
            <span className="projects__stat-label">Projets réalisés</span>
          </div>
          <div className="projects__stat">
            <span className="projects__stat-number">
              {[...new Set(projects.flatMap(p => p.technologies))].length}
            </span>
            <span className="projects__stat-label">Technologies utilisées</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
