import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import Hero from '../../components/Hero/Hero';

import './Home.scss';

// Lazy imports pour TOUT le contenu below-the-fold
const ProjectCard = lazy(() => import('../../components/ProjectCard/ProjectCard'));
const BackgroundGradient = lazy(() => import('../../components/BackgroundGradient/BackgroundGradient'));

// Lazy import des icônes (chargées seulement au scroll)
const loadIcons = () => Promise.all([
  import('./img/react.svg'),
  import('./img/mongodb.svg'),
  import('./img/nodejs.svg'),
  import('./img/express.svg'),
  import('./img/html5.svg'),
  import('./img/sass.svg'),
  import('./img/javascript.svg'),
]);

function Home() {
  const [shouldLoadBelowFold, setShouldLoadBelowFold] = useState(false);
  const [icons, setIcons] = useState([]);

  // Intersection Observer pour détecter le scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadBelowFold(true);
          // Charger les icônes dynamiquement
          loadIcons().then((loadedIcons) => {
            setIcons([
              { name: 'React', icon: loadedIcons[0].default },
              { name: 'MongoDB', icon: loadedIcons[1].default },
              { name: 'Node.js', icon: loadedIcons[2].default },
              { name: 'Express', icon: loadedIcons[3].default },
              { name: 'HTML5', icon: loadedIcons[4].default },
              { name: 'SASS', icon: loadedIcons[5].default },
              { name: 'JavaScript', icon: loadedIcons[6].default },
            ]);
          });
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Commencer à charger 100px avant d'arriver
      }
    );

    // Observer un élément invisible juste après le Hero
    const triggerElement = document.querySelector('.below-fold-trigger');
    if (triggerElement) {
      observer.observe(triggerElement);
    }

    return () => observer.disconnect();
  }, []);

  // Hook useProjects conditionnel
  const { getRecentProjects, loading } = useProjects();
  const recentProjects = shouldLoadBelowFold ? getRecentProjects(3) : [];

  // Composant SkillIcon optimisé
  const SkillIcon = ({ name, icon }) => (
    <div className="home__skill">
      <img 
        src={icon} 
        alt={name}
        loading="lazy" 
        decoding="async"
        width="40"
        height="40"
        className="home__skill-icon"
      />
    </div>
  );

  return (
    <div className="app">
      <Suspense fallback={null}>
        <BackgroundGradient />
      </Suspense>
      
      <main className="home main-content">
        <div className="page-content">
          
          <Hero />
          
          {/* Élément trigger invisible pour déclencher le lazy loading */}
          <div className="below-fold-trigger" style={{ height: '1px' }}></div>

          {/* Tout le contenu below-the-fold */}
          {shouldLoadBelowFold && (
            <Suspense fallback={<div className="home__loading">Chargement...</div>}>
              
              {/* About Preview */}
              <section className="home__section">
                <div className="home__container--about">
                  <h2 className="home__section-title">À propos</h2>
                  <div className="home__about-grid">
                    <div className="home__about-text">
                      <p>
                        L'informatique, je suis tombé dedans quand j'étais petit. Aujourd'hui, je transforme cette passion en métier, avec un objectif simple : résoudre des problèmes grâce à du code propre, structuré et utile.
                      </p>
                      <p>
                        Mon expertise couvre le développement frontend et backend, avec une attention particulière 
                        portée à l'expérience utilisateur et aux performances.
                      </p>
                    </div>
                    
                    <div className="home__skills">
                      <h3 className='home__skills-title'>Mes compétences principales</h3>
                      <div className="home__skills-grid">
                        {icons.map((skill, index) => (
                          <SkillIcon 
                            key={index} 
                            name={skill.name} 
                            icon={skill.icon} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Projects Preview */}
              <section className="home__section home__section--alt">
                <div className="home__container">
                  <h2 className="home__section-title">Mes derniers projets</h2>
                  
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
                          Voir tous mes projets
                        </Link>
                      </div>
                    </>
                  )}
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
              
            </Suspense>
          )}
          
        </div>
      </main>
    </div>
  );
}

export default Home;
