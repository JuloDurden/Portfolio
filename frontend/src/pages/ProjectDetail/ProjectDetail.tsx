// pages/ProjectDetail/ProjectDetail.tsx
import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import './ProjectDetail.scss';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, loading } = useProjects();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  if (loading) {
    return <div className="project-detail__loading">Chargement...</div>;
  }

  if (!id) {
    return <Navigate to="/projects" replace />;
  }

  const project = getProjectById(id);

  if (!project) {
    return (
      <div className="project-detail">
        <div className="project-detail__container">
          <div className="project-detail__not-found">
            <h1>Projet non trouvé</h1>
            <Link to="/projects" className="btn btn--primary">
              Retour aux projets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <div className="project-detail__container">
        {/* Breadcrumb */}
        <nav className="project-detail__breadcrumb">
          <Link to="/">Accueil</Link>
          <span>/</span>
          <Link to="/projects">Projets</Link>
          <span>/</span>
          <span>{project.title}</span>
        </nav>

        {/* Header */}
        <header className="project-detail__header">
          <h1 className="project-detail__title">{project.title}</h1>
          <p className="project-detail__subtitle">{project.subtitle}</p>
          
          <div className="project-detail__meta">
            <div className="project-detail__info">
              <span className="label">Client :</span>
              <span className="value">{project.informations.client}</span>
            </div>
            <div className="project-detail__info">
              <span className="label">Date :</span>
              <span className="value">{project.informations.date}</span>
            </div>
          </div>

          <div className="project-detail__actions">
            {project.links.website && (
              <a 
                href={project.links.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                Voir le site
              </a>
            )}
            <a 
              href={project.links.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn--secondary"
            >
              Code source
            </a>
          </div>
        </header>

        {/* Main Image */}
        <div className="project-detail__hero">
          <img src={project.cover} alt={project.title} />
        </div>

        {/* Content */}
        <div className="project-detail__content">
          <div className="project-detail__main">
            <section className="project-detail__description">
              <h2>Description du projet</h2>
              <p>{project.description}</p>
            </section>

            {/* Gallery */}
            {project.pictures.length > 0 && (
              <section className="project-detail__gallery">
                <h2>Galerie</h2>
                <div className="gallery">
                  {project.pictures.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="gallery__image"
                      onClick={() => setSelectedImage(image)}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className="project-detail__competences">
              <h2>Compétences développées</h2>
              <ul className="competences-list">
                {project.competences.map((competence, index) => (
                  <li key={index}>{competence}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="project-detail__sidebar">
            <div className="project-detail__technologies">
              <h3>Technologies utilisées</h3>
              <div className="technologies-grid">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="technology-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Navigation */}
        <nav className="project-detail__navigation">
          <Link to="/projects" className="btn btn--outline">
            ← Tous les projets
          </Link>
        </nav>
      </div>

      {/* Lightbox simple */}
      {selectedImage && (
        <div 
          className="lightbox" 
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="" />
          <button 
            className="lightbox__close"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
