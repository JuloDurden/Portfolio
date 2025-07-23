// components/ProjectCard/ProjectCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../../hooks/useProjects';
import './ProjectCard.scss';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className = '' }) => {
  return (
    <Link to={`/projects/${project.id}`} className={`project-card ${className}`}>
      <div className="project-card__image">
        <img src={project.cover} alt={project.title} loading="lazy" decoding="async" />
        <div className="project-card__overlay">
          <span className="project-card__view">Voir le projet</span>
        </div>
      </div>
      
      <div className="project-card__content">
        <h2 className="project-card__title">{project.title}</h2>
        <p className="project-card__subtitle">{project.subtitle}</p>
        
        <div className="project-card__meta">
          <span className="project-card__client">{project.informations.client}</span>
          <span className="project-card__date">{project.informations.date}</span>
        </div>
        
        <div className="project-card__technologies">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span key={index} className="project-card__tech">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="project-card__tech-more">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;