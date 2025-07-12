import React from 'react';
import './Home.scss';

import Hero from '../../components/Hero/Hero';

function Home() {
  return (
    <main className="home">
      <Hero />

      {/* About Preview */}
      <section className="home__section">
        <div className="home__container">
          <h2 className="home__section-title">À propos</h2>
          <div className="home__about-grid">
            <div className="home__about-text">
              <p>
                Développeur passionné avec plusieurs années d'expérience dans le développement web. 
                J'aime créer des solutions élégantes et performantes pour résoudre des problèmes complexes.
              </p>
              <p>
                Mon expertise couvre le développement frontend et backend, avec une attention particulière 
                portée à l'expérience utilisateur et aux performances.
              </p>
            </div>
            <div className="home__skills">
              <h3>Compétences principales</h3>
              <div className="home__skills-grid">
                <div className="home__skill">React</div>
                <div className="home__skill">TypeScript</div>
                <div className="home__skill">Node.js</div>
                <div className="home__skill">Python</div>
                <div className="home__skill">PostgreSQL</div>
                <div className="home__skill">MongoDB</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="home__section home__section--alt">
        <div className="home__container">
          <h2 className="home__section-title">Projets récents</h2>
          <div className="home__projects-grid">
            <div className="home__project-card">
              <div className="home__project-image"></div>
              <h3>Projet E-commerce</h3>
              <p>Une plateforme e-commerce complète avec React et Node.js</p>
              <div className="home__project-tags">
                <span className="home__tag">React</span>
                <span className="home__tag">Node.js</span>
                <span className="home__tag">MongoDB</span>
              </div>
            </div>
            <div className="home__project-card">
              <div className="home__project-image"></div>
              <h3>Application Mobile</h3>
              <p>Une application mobile développée avec React Native</p>
              <div className="home__project-tags">
                <span className="home__tag">React Native</span>
                <span className="home__tag">TypeScript</span>
                <span className="home__tag">Firebase</span>
              </div>
            </div>
            <div className="home__project-card">
              <div className="home__project-image"></div>
              <h3>Dashboard Analytics</h3>
              <p>Un tableau de bord pour visualiser des données complexes</p>
              <div className="home__project-tags">
                <span className="home__tag">Vue.js</span>
                <span className="home__tag">D3.js</span>
                <span className="home__tag">Python</span>
              </div>
            </div>
          </div>
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
