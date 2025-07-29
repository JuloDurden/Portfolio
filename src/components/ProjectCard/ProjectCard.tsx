import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../pages/Dashboard/sections/Projects/types';
import './ProjectCard.scss';

interface ProjectCardProps {
  project: Project;
  className?: string;
  showActions?: boolean;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  className = '',
  showActions = false,
  onEdit,
  onDelete 
}) => {
  // 🛡️ ÉTAT POUR ÉVITER LA BOUCLE INFINIE
  const [imageError, setImageError] = useState(false);

  // 🔥 STABILISE L'URL AVEC useMemo
  const coverImage = useMemo(() => {
    if (imageError) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTg5OGE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgaW5kaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='; // SVG placeholder
    }
    
    if (typeof project.cover === 'string') {
      return project.cover;
    } else if (project.cover && typeof project.cover === 'object') {
      return project.cover.small || project.cover.large;
    }
    
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTg5OGE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgaW5kaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
  }, [project.cover, imageError]);
  
  // 📅 Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long'
      });
    } catch {
      return dateString;
    }
  };

  // 🎯 Handle actions
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${project.title}" ?`)) {
      onDelete?.(project.id);
    }
  };

  // 🛡️ GESTION ERREUR IMAGE (UNE SEULE FOIS)
  const handleImageError = () => {
    if (!imageError) {
      console.log('❌ Image cassée pour:', project.title);
      setImageError(true);
    }
  };

  return (
    <Link 
      to={`/projects/${project.id}`} 
      className={`project-card ${className} ${project.featured ? 'project-card--featured' : ''}`}
    >
      
      {/* 🖼️ IMAGE CONTAINER */}
      <div className="project-card__image">
        <img 
          src={coverImage}
          alt={project.title}
          loading="lazy"
          onError={handleImageError}
          onLoad={() => {
            if (!imageError) {
              console.log('✅ Image OK:', project.title);
            }
          }}
          style={{ 
            transition: 'none',
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        
        {/* OVERLAY */}
        <div className="project-card__overlay">
          <span className="project-card__view">
            Voir le projet
          </span>
        </div>

        {/* ACTIONS DASHBOARD */}
        {showActions && (
          <div 
            className="project-card__actions"
            onClick={(e) => e.preventDefault()}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              display: 'flex',
              gap: '0.5rem',
              zIndex: 10
            }}
          >
            <button 
              onClick={handleEdit}
              className="project-card__action project-card__action--edit"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: 'var(--color-primary)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Modifier le projet"
            >
              ✏️
            </button>
            <button 
              onClick={handleDelete}
              className="project-card__action project-card__action--delete"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: '#dc2626',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Supprimer le projet"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="project-card__content">
        <h3 className="project-card__title">{project.title}</h3>
        {project.subtitle && (
          <p className="project-card__subtitle">{project.subtitle}</p>
        )}

        <div className="project-card__meta">
          <span className="project-card__client">
            {project.informations.client || 'Projet personnel'}
          </span>
          <span className="project-card__date">
            {formatDate(project.informations.date)}
          </span>
        </div>

        <div className="project-card__technologies">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span key={index} className="project-card__tech">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="project-card__tech-more">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
      
    </Link>
  );
};

export default ProjectCard;
