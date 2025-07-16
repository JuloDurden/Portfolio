import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import Lightbox from '../../components/Lightbox/Lightbox';
import './ProjectDetail.scss';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProjectById, loading } = useProjects();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (loading) {
    return (
      <div className="app">
        <main className="project-detail main-content">
          <div className="page-content">
            <div className="project-detail__container">
              <div className="project-detail__loading animate-fade-in">
                Chargement du projet...
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!id) {
    return <Navigate to="/404" replace />;
  }

  const project = getProjectById(id);

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  const allImages = [project.cover, ...project.pictures];

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const handleShowAllPhotos = () => {
    setCurrentImageIndex(0);
    setIsLightboxOpen(true);
  };

  return (
    <div className="app">
      <main className="project-detail main-content">
        <div className="page-content">
          {/* Breadcrumb */}
          <nav className="project-detail__breadcrumb animate-fade-in-down">
            <div className="project-detail__breadcrumb-container">
              <Link to="/projects" className="project-detail__breadcrumb-link">
                ← Retour aux projets
              </Link>
            </div>
          </nav>

          {/* Title */}
          <div className="project-detail__header animate-fade-in-up animate-delay-100">
            <div className="project-detail__header-container">
              <h1 className="project-detail__title">{project.title}</h1>
              <p className="project-detail__subtitle">{project.subtitle}</p>
            </div>
          </div>

          {/* Photo Gallery - Style Airbnb */}
          <div className="project-detail__gallery animate-fade-in animate-delay-200">
            <div className="project-detail__gallery-container">
              <div className="project-detail__gallery-grid">
                {/* Image principale - 2/3 de la largeur */}
                <div className="project-detail__gallery-main">
                  <img 
                    src={project.cover} 
                    alt={project.title}
                    className="project-detail__gallery-main-image"
                    onClick={() => handleImageClick(0)}
                  />
                </div>

                {/* Images secondaires - 1/3 de la largeur, max 2 photos */}
                <div className="project-detail__gallery-secondary">
                  {project.pictures.slice(0, 2).map((picture, index) => (
                    <div 
                      key={index} 
                      className={`project-detail__gallery-item ${
                        index === 1 && project.pictures.length > 2 ? 'project-detail__gallery-item--overlay' : ''
                      }`}
                      onClick={() => handleImageClick(index + 1)}
                    >
                      <img 
                        src={picture} 
                        alt={`${project.title} - Image ${index + 1}`}
                        className="project-detail__gallery-secondary-image"
                      />
                      {index === 1 && project.pictures.length > 2 && (
                        <div className="project-detail__gallery-overlay">
                          <span className="project-detail__gallery-overlay-text">
                            +{project.pictures.length - 1} photos
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bouton "Afficher toutes les photos" */}
                <button 
                  className="project-detail__gallery-show-all"
                  onClick={handleShowAllPhotos}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V4Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M6 8L8 10L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Afficher toutes les photos
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="project-detail__content animate-fade-in-up animate-delay-300">
            <div className="project-detail__content-container">
              {/* Colonne principale */}
              <div className="project-detail__main">
                {/* Meta informations */}
                <div className="project-detail__meta animate-fade-in-up animate-delay-400">
                  <div className="project-detail__meta-item">
                    <span className="project-detail__meta-label">Client</span>
                    <span className="project-detail__meta-value">{project.informations.client}</span>
                  </div>
                  <div className="project-detail__meta-item">
                    <span className="project-detail__meta-label">Date</span>
                    <span className="project-detail__meta-value">{project.informations.date}</span>
                  </div>
                </div>

                <hr className="project-detail__divider" />

                {/* Description */}
                <div className="project-detail__description animate-fade-in-up animate-delay-500">
                  <h2 className="project-detail__section-title">À propos de ce projet</h2>
                  <p className="project-detail__text">{project.description}</p>
                </div>

                <hr className="project-detail__divider" />

                {/* Technologies */}
                <div className="project-detail__technologies animate-fade-in-up animate-delay-600">
                  <h3 className="project-detail__section-title">Technologies utilisées</h3>
                  <div className="project-detail__tech-list">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="project-detail__tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <hr className="project-detail__divider" />

                {/* Compétences */}
                <div className="project-detail__competences animate-fade-in-up animate-delay-700">
                  <h3 className="project-detail__section-title">Compétences développées</h3>
                  <ul className="project-detail__competences-list">
                    {project.competences.map((competence, index) => (
                      <li key={index} className="project-detail__competences-item">
                        {competence}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="project-detail__sidebar animate-fade-in-left animate-delay-400">
                <div className="project-detail__card">
                  <h3 className="project-detail__card-title">Liens du projet</h3>
                  
                  <div className="project-detail__links">
                    {project.links.website && (
                      <a 
                        href={project.links.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="project-detail__link project-detail__link--primary"
                      >
                        🌐 Voir le site web
                      </a>
                    )}
                    <a 
                      href={project.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-detail__link project-detail__link--secondary"
                    >
                      📝 Voir le code source
                    </a>
                  </div>

                  <div className="project-detail__card-footer">
                    <p className="project-detail__card-note">
                      💡 Ce projet fait partie de mon parcours d'apprentissage en développement web.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lightbox */}
          <Lightbox
            images={allImages}
            currentIndex={currentImageIndex}
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            onIndexChange={setCurrentImageIndex}
            altText={project.title}
            showNavigation={true}
          />
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
