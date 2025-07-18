import { lazy, Suspense, useState, useEffect } from 'react';
import SectionNavigation from '../../components/SectionNavigation/SectionNavigation';
import './About.scss';

// Lazy imports pour le contenu below-the-fold
const Biography = lazy(() => import('../../components/Biography/Biography'));
const Experience = lazy(() => import('../../components/Experience/Experience'));
const Skills = lazy(() => import('../../components/Skills/Skills'));

const aboutNavigationItems = [
  { id: 'biography', label: 'Biographie', selector: '.about__biography' },
  { id: 'experience', label: 'Expérience', selector: '.about__experience' },
  { id: 'skills', label: 'Compétences', selector: '.about__skills' }
];

function About() {
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

  return (
    <div className="app">
      <SectionNavigation 
        navigationItems={aboutNavigationItems}
        defaultActiveSection="biography"
        offsetTop={120}
      />
      
      <main className="about main-content">
        <div className="page-content">
          
          {/* 🎯 SECTION 1 - BIOGRAPHIE (DIRECTLY ABOVE FOLD) */}
          <section className="about__section about__biography">
            <div className="about__container">
              <h2 className="about__section-title">Ma biographie</h2>
              <Biography />
            </div>
          </section>
          
          <div className="below-fold-trigger" style={{ height: '1px' }}></div>

          {shouldLoadBelowFold && (
            <Suspense fallback={<div className="about__loading">Chargement...</div>}>
              
              {/* 🎯 SECTION 2 - EXPÉRIENCE */}
              <section className="about__section about__section--alt about__experience">
                <div className="about__container">
                  <h2 className="about__section-title">Mon expérience</h2>
                  <Experience />
                </div>
              </section>

              {/* 🎯 SECTION 3 - COMPÉTENCES */}
              <section className="about__section about__skills">
                <div className="about__container">
                  <h2 className="about__section-title">Mes compétences</h2>
                  <Skills />
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

export default About;
