import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Project.scss';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  images: string[];
  date: string;
}

function Project() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  // Données de démonstration (à remplacer par un appel API)
  const projectsData: ProjectData[] = [
    {
      id: '1',
      title: 'Portfolio Personnel',
      description: 'Mon portfolio développé avec React et TypeScript',
      longDescription: 'Ce portfolio présente mes compétences en développement web. Créé avec React, TypeScript et SCSS, il démontre ma maîtrise des technologies modernes du frontend.',
      technologies: ['React', 'TypeScript', 'SCSS', 'React Router'],
      githubUrl: 'https://github.com/votre-username/portfolio',
      liveUrl: 'https://votre-portfolio.com',
      images: ['/images/portfolio-1.jpg', '/images/portfolio-2.jpg'],
      date: '2024'
    },
    {
      id: '2',
      title: 'Application E-commerce',
      description: 'Application e-commerce complète avec panier et paiement',
      longDescription: 'Application e-commerce full-stack avec authentification, gestion des produits, panier d\'achats et système de paiement intégré.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
      githubUrl: 'https://github.com/votre-username/ecommerce',
      liveUrl: 'https://votre-ecommerce.com',
      images: ['/images/ecommerce-1.jpg', '/images/ecommerce-2.jpg'],
      date: '2024'
    }
  ];

  useEffect(() => {
    if (id) {
      const foundProject = projectsData.find(p => p.id === id);
      if (foundProject) {
        setProject(foundProject);
      } else {
        navigate('/404');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return <div className="project__loading">Chargement...</div>;
  }

  if (!project) {
    return null;
  }

  return (
    <div className="project">
      <div className="project__container">
        <button 
          onClick={() => navigate(-1)} 
          className="project__back-btn"
        >
          ← Retour
        </button>

        <header className="project__header">
          <h1 className="project__title">{project.title}</h1>
          <p className="project__date">{project.date}</p>
        </header>

        <div className="project__content">
          <div className="project__images">
            {project.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${project.title} - Image ${index + 1}`}
                className="project__image"
              />
            ))}
          </div>

          <div className="project__info">
            <section className="project__description">
              <h2>Description</h2>
              <p>{project.longDescription}</p>
            </section>

            <section className="project__technologies">
              <h2>Technologies utilisées</h2>
              <div className="project__tech-list">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="project__tech-item">
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            <section className="project__links">
              <h2>Liens</h2>
              <div className="project__link-buttons">
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="project__link-btn project__link-btn--github"
                  >
                    Voir sur GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="project__link-btn project__link-btn--live"
                  >
                    Voir le site
                  </a>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;
