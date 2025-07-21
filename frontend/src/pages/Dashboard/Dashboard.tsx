import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SectionNavigation from '../../components/SectionNavigation/SectionNavigation';
import PersonalDataSection from './sections/PersonalData/PersonalDataSection';
import AboutSection from './sections/About/AboutSection';
import ExperiencesSection from './sections/Experiences/ExperiencesSection';
import './Dashboard.scss';

// 🎯 Navigation items pour le dashboard
const DASHBOARD_NAVIGATION = [
  { id: 'overview', label: '📊 Vue d\'ensemble', selector: '#dashboard-overview' },
  { id: 'personal-data', label: '👤 Données personnelles', selector: '#personal-data-section' },
  { id: 'about', label: '📝 Contenu About', selector: '#about-section' },
  { id: 'experiences', label: '💼 Expériences', selector: '#experiences-section' },
  { id: 'skills', label: '🛠️ Compétences', selector: '#dashboard-skills' },
  { id: 'projects', label: '🚀 Projets', selector: '#dashboard-projects' }
];

// 🎨 Types temporaires (en attendant les vrais)
interface DashboardStats {
  projectsCount: number;
  skillsCount: number;
  experiencesCount: number;
  lastUpdate: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 📊 Stats mockées (en attendant l'API)
  const stats: DashboardStats = {
    projectsCount: 8,
    skillsCount: 12,
    experiencesCount: 6,
    lastUpdate: new Date().toLocaleDateString('fr-FR')
  };

  // 🚪 Déconnexion
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 🏠 Retour accueil
  const handleBackToSite = () => {
    navigate('/');
  };

  return (
    <div className="dashboard">
      {/* 🎯 HEADER DU DASHBOARD */}
      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <div className="dashboard__header-left">
            <h1 className="dashboard__title">
              <span className="dashboard__title-icon">⚡</span>
              Dashboard
            </h1>
            <p className="dashboard__subtitle">
              Bienvenue, <strong>{user?.firstName} {user?.lastName}</strong>
            </p>
          </div>
          
          <div className="dashboard__header-actions">
            <button 
              onClick={handleBackToSite}
              className="dashboard__btn dashboard__btn--secondary"
              title="Retour au site"
            >
              🏠 Voir le site
            </button>
            <button 
              onClick={handleLogout}
              className="dashboard__btn dashboard__btn--danger"
              title="Déconnexion"
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* 🧭 NAVIGATION DES SECTIONS */}
      <div className="dashboard__navigation">
        <SectionNavigation 
          navigationItems={DASHBOARD_NAVIGATION}
          defaultActiveSection="overview"
          offsetTop={140}
        />
      </div>

      {/* 📋 CONTENU PRINCIPAL */}
      <main className="dashboard__main">
        <div className="dashboard__container">
          
          {/* 📊 VUE D'ENSEMBLE */}
          <section id="dashboard-overview" className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">📊 Vue d'ensemble</h2>
              <p className="dashboard__section-subtitle">
                Aperçu rapide de votre portfolio
              </p>
            </div>
            
            <div className="dashboard__stats">
              <div className="dashboard__stat-card">
                <div className="dashboard__stat-icon">🚀</div>
                <div className="dashboard__stat-content">
                  <span className="dashboard__stat-number">{stats.projectsCount}</span>
                  <span className="dashboard__stat-label">Projets</span>
                </div>
              </div>
              
              <div className="dashboard__stat-card">
                <div className="dashboard__stat-icon">🛠️</div>
                <div className="dashboard__stat-content">
                  <span className="dashboard__stat-number">{stats.skillsCount}</span>
                  <span className="dashboard__stat-label">Compétences</span>
                </div>
              </div>
              
              <div className="dashboard__stat-card">
                <div className="dashboard__stat-icon">💼</div>
                <div className="dashboard__stat-content">
                  <span className="dashboard__stat-number">{stats.experiencesCount}</span>
                  <span className="dashboard__stat-label">Expériences</span>
                </div>
              </div>
              
              <div className="dashboard__stat-card">
                <div className="dashboard__stat-icon">📅</div>
                <div className="dashboard__stat-content">
                  <span className="dashboard__stat-number">{stats.lastUpdate}</span>
                  <span className="dashboard__stat-label">Dernière MAJ</span>
                </div>
              </div>
            </div>
            
            <div className="dashboard__quick-actions">
              <h3 className="dashboard__quick-title">🚀 Actions rapides</h3>
              <div className="dashboard__quick-buttons">
                <button className="dashboard__quick-btn">
                  ➕ Nouveau projet
                </button>
                <button className="dashboard__quick-btn">
                  🆕 Nouvelle compétence
                </button>
                <button className="dashboard__quick-btn">
                  📝 Modifier About
                </button>
                <button className="dashboard__quick-btn">
                  👤 Modifier profil
                </button>
              </div>
            </div>
          </section>

          {/* 👤 DONNÉES PERSONNELLES */}           
          <PersonalDataSection />

          {/* 📝 CONTENU ABOUT */}
          <AboutSection />

          {/* 💼 EXPÉRIENCES & FORMATIONS */}
          <ExperiencesSection />

          {/* 🛠️ COMPÉTENCES */}
          <section id="dashboard-skills" className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">🛠️ Compétences</h2>
              <p className="dashboard__section-subtitle">
                Administrez vos compétences techniques
              </p>
            </div>
            
            <div className="dashboard__placeholder">
              <div className="dashboard__placeholder-icon">🛠️</div>
              <h3>Section en développement</h3>
              <p>Cette section permettra de gérer vos compétences</p>
              <ul>
                <li>✅ Nom et description</li>
                <li>✅ Niveau (0-100)</li>
                <li>✅ Icône et catégories</li>
              </ul>
            </div>
          </section>

          {/* 🚀 PROJETS */}
          <section id="dashboard-projects" className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">🚀 Projets</h2>
              <p className="dashboard__section-subtitle">
                Administrez votre portfolio de projets
              </p>
            </div>
            
            <div className="dashboard__placeholder">
              <div className="dashboard__placeholder-icon">🚀</div>
              <h3>Section en développement</h3>
              <p>Cette section permettra de gérer vos projets</p>
              <ul>
                <li>✅ CRUD complet</li>
                <li>✅ Upload d'images</li>
                <li>✅ Technologies et liens</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
