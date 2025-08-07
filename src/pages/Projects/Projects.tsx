import React from 'react';
import { useProjects } from '../../hooks/useProjects';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './Projects.scss';

const Projects: React.FC = () => {
  const { projects, loading } = useProjects();

  // ✅ TRI PAR DATE DÉCROISSANTE
  const sortedProjects = projects.sort((a, b) => {
    return new Date(b.informations.date).getTime() - new Date(a.informations.date).getTime();
  });

  if (loading) {
    return (
      <div className="app">
        <main className="projects main-content">
          <div className="page-content">
            <div className="projects__container">
              <div className="projects__loading">Chargement des projets...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="projects main-content">
        <div className="page-content">
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
              {sortedProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            <div className="projects__stats">
              <div className="projects__stat">
                <span className="projects__stat-number">{sortedProjects.length}</span>
                <span className="projects__stat-label">Projets réalisés</span>
              </div>
              <div className="projects__stat">
                <span className="projects__stat-number">
                  {[...new Set(sortedProjects.flatMap(p => p.technologies))].length}
                </span>
                <span className="projects__stat-label">Technologies utilisées</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;
