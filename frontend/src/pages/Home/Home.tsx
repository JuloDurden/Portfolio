import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import Hero from '../../components/Hero/Hero';
import SectionNavigation from '../../components/SectionNavigation/SectionNavigation';
import methodologyData from '../../data/methodology.json';

import './Home.scss';

// Lazy imports pour TOUT le contenu below-the-fold
const ProjectCard = lazy(() => import('../../components/ProjectCard/ProjectCard'));
const BackgroundGradient = lazy(() => import('../../components/BackgroundGradient/BackgroundGradient'));
const ScrollTimeline = lazy(() => import('../../components/ScrollTimeline/ScrollTimeline'));

const homeNavigationItems = [
  { id: 'me-choisir', label: 'Me choisir', selector: '.home__section--alt' },
  { id: 'methode', label: 'Méthode', selector: '.home__section--methodology' },
  { id: 'portfolio', label: 'Portfolio', selector: '.home__projects-grid' },
  { id: 'contact', label: 'Contact', selector: '.home__section--cta' }
];

function Home() {
  const [shouldLoadBelowFold, setShouldLoadBelowFold] = useState(false);

  // Intersection Observer pour détecter le scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadBelowFold(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const triggerElement = document.querySelector('.below-fold-trigger');
    if (triggerElement) {
      observer.observe(triggerElement);
    }

    return () => observer.disconnect();
  }, []);

  const { getRecentProjects, loading } = useProjects();
  const recentProjects = shouldLoadBelowFold ? getRecentProjects(3) : [];

  return (
    <div className="app">
      <Suspense fallback={null}>
        <BackgroundGradient />
      </Suspense>
      
      <SectionNavigation 
        navigationItems={homeNavigationItems}
        defaultActiveSection="me-choisir"
        offsetTop={120}
      />
      
      <main className="home main-content">
        <div className="page-content">
          
          <Hero />
          
          <div className="below-fold-trigger" style={{ height: '1px' }}></div>

          {shouldLoadBelowFold && (
            <Suspense fallback={<div className="home__loading">Chargement...</div>}>
              
              {/* 🎯 SECTION 1 - ME CHOISIR */}
              <section className="home__section home__section--alt">
                <div className="home__container">
                  <h2 className="home__section-title">Pourquoi me choisir ?</h2>
                  <div className="home__section-intro">
                    <p>
                      L'informatique, je suis tombé dedans quand j'étais petit. Aujourd'hui, je transforme cette passion en métier, avec un objectif simple : résoudre des problèmes grâce à du code propre, structuré et utile.
                    </p>
                    <p>
                      Mon expertise couvre le développement frontend et backend, avec une attention particulière portée à l'expérience utilisateur et aux performances.
                    </p>
                  </div>
                  <div className="home__features-grid">
                    <div className="home__feature">
                      <span className="home__feature-icon">📱</span>
                      <h3>Sur mesure & Responsive</h3>
                      <p>Je développe des sites en restant totalement à votre écoute.</p>
                      <p>Ils sont aussi parfaitement adaptés à tous les supports.</p>
                    </div>
                    <div className="home__feature">
                      <span className="home__feature-icon">🎯</span>
                      <h3>Performance & SEO</h3>
                      <p>Mon code est propre, rapide à charger et facilement maintenable.</p>
                      <p>Mes sites sont parfaitement optimisés pour le référencement.</p>
                    </div>
                    <div className="home__feature">
                      <span className="home__feature-icon">🤝</span>
                      <h3>Adaptabilité & Collaboration</h3>
                      <p>Fort de 20 ans d'expérience en équipe, je m'intègre facilement dans vos projets.</p>
                      <p>Freelance ou en entreprise, je m'adapte à vos méthodes et votre culture.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 🎯 SECTION 2 - MÉTHODE */}
              <section className="home__section home__section--methodology">
                <div className="home__container">
                  <h2 className="home__section-title">Ma méthodologie de travail</h2>
                  <div className="home__section-intro">
                    <p>
                      Chaque projet suit une approche structurée et éprouvée, de l'analyse initiale jusqu'à la mise en ligne. 
                      Cette méthodologie garantit des résultats de qualité et une collaboration fluide.
                    </p>
                  </div>
                </div>
                
                <ScrollTimeline
                  title={methodologyData.title}
                  items={methodologyData.items}
                  showImages={methodologyData.showImages}
                  theme={methodologyData.theme as 'light' | 'dark'}
                  className="home__methodology-timeline"
                />
              </section>

              {/* 🎯 SECTION 3 - PORTFOLIO */}
              <section className="home__section">
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
                      <div className="home__projects-link-container">
                        <Link to="/projects" className="home__projects-link">
                          Voir tous mes projets
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* 🎯 SECTION 4 - CONTACT */}
              <section className="home__section home__section--cta">
                <div className="home__container">
                  <h2 className="home__section-title">Prêt à collaborer ?</h2>
                  <p className="home__cta-text">
                    Je suis toujours intéressé par de nouveaux défis et projets passionnants.
                    N'hésitez pas à me contacter pour discuter de vos idées !
                  </p>
                  <div className="home__cta">
                    <a 
                      href="mailto:julowebdev@gmail.com?subject=Votre%20profil%20m'intéresse"
                      className="home__btn home__btn--primary"
                    >
                      Me contacter
                    </a>
                    <a 
                      href="/cv-julien-clavel.pdf" 
                      className="home__btn home__btn--secondary"
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Télécharger mon CV
                    </a>
                  </div>
                </div>
              </section>

              <div style={{ height: '200px' }}></div>
              
            </Suspense>
          )}
          
        </div>
      </main>
    </div>
  );
}

export default Home;
