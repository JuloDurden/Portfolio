import React from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import ProjectCard from '../../components/ProjectCard/ProjectCard';

import './Home.scss';

import Hero from '../../components/Hero/Hero';

// Import des icônes SVG
import ReactIcon from './img/react.svg';
import MongoDBIcon from './img/mongodb.svg';
import NodeJSIcon from './img/nodejs.svg';
import ExpressIcon from './img/express.svg';
import HTML5Icon from './img/html5.svg';
import SASSIcon from './img/sass.svg';
import JavaScriptIcon from './img/javascript.svg';

function Home() {
  // Ajout du hook UseProjects
  const { getRecentProjects, loading } = useProjects();
  const recentProjects = getRecentProjects(3);

  // Configuration des compétences avec icônes
  const skills = [
    { name: 'React', icon: ReactIcon },
    { name: 'MongoDB', icon: MongoDBIcon },
    { name: 'Node.js', icon: NodeJSIcon },
    { name: 'Express', icon: ExpressIcon },
    { name: 'HTML5', icon: HTML5Icon },
    { name: 'SASS', icon: SASSIcon },
    { name: 'JavaScript', icon: JavaScriptIcon },
  ];

  return (
    <main className="home">
      <Hero />

      {/* About Preview */}
      <section className="home__section">
        <div className="home__container--about">
          <h2 className="home__section-title">À propos</h2>
          <div className="home__about-grid">
            <div className="home__about-text">
              <p>
                L’informatique, je suis tombé dedans quand j’étais petit. Aujourd’hui, je transforme cette passion en métier, avec un objectif simple : résoudre des problèmes grâce à du code propre, structuré et utile.
              </p>
              <p>
                Mon expertise couvre le développement frontend et backend, avec une attention particulière 
                portée à l'expérience utilisateur et aux performances.
              </p>
            </div>
            <div className="home__skills">
              <h3 className='home__skills-title'>Mes compétences principales</h3>
              <div className="home__skills-grid">
                {skills.map((skill, index) => (
                  <div key={index} className="home__skill">
                    <img 
                      src={skill.icon} 
                      alt={skill.name} 
                      className="home__skill-icon"
                    />
                    {/* <span className="home__skill-name">{skill.name}</span> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="home__section home__section--alt">
        <div className="home__container">
          <h2 className="home__section-title">Projets récents</h2>
          
          {loading ? (
            <div className="home__loading">Chargement des projets...</div>
          ) : (
            <>
              <div className="home__projects-grid">
                {recentProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    className="home__project-card"
                  />
                ))}
              </div>
              <div className="home__projects-cta">
                <Link to="/projects" className="btn btn--primary">
                  Voir tous les projets
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Experience */}
      <section className="home__section">
        <div className="home__container">
          <h2 className="home__section-title">Expérience</h2>
          <div className="home__timeline">
            <div className="home__timeline-item">
              <div className="home__timeline-date">2024 - Présent</div>
              <div className="home__timeline-content">
                <h3>Développeur Full Stack Senior</h3>
                <p className="home__company">TechCorp Solutions</p>
                <p>
                  Développement d'applications web complexes et encadrement d'équipes de développement.
                  Mise en place d'architectures scalables et optimisation des performances.
                </p>
              </div>
            </div>
            <div className="home__timeline-item">
              <div className="home__timeline-date">2021 - 2023</div>
              <div className="home__timeline-content">
                <h3>Développeur Frontend</h3>
                <p className="home__company">Digital Agency</p>
                <p>
                  Création d'interfaces utilisateur modernes et responsives. Collaboration étroite 
                  avec les équipes design et backend pour livrer des produits de qualité.
                </p>
              </div>
            </div>
            <div className="home__timeline-item">
              <div className="home__timeline-date">2020 - 2021</div>
              <div className="home__timeline-content">
                <h3>Développeur Junior</h3>
                <p className="home__company">StartUp Innovante</p>
                <p>
                  Premiers pas dans le développement professionnel. Apprentissage des bonnes 
                  pratiques et contribution au développement de produits innovants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="home__section home__section--cta">
        <div className="home__container">
          <h2 className="home__section-title">Prêt à collaborer ?</h2>
          <p className="home__cta-text">
            Je suis toujours intéressé par de nouveaux défis et projets passionnants.
            N'hésitez pas à me contacter pour discuter de vos idées !
          </p>
          <div className="home__cta">
            <button className="home__btn home__btn--primary">
              Démarrer un projet
            </button>
            <button className="home__btn home__btn--secondary">
              Télécharger CV
            </button>
          </div>
        </div>
      </section>

      {/* Footer spacer */}
      <div style={{ height: '200px' }}></div>
    </main>
  );
}

export default Home;
