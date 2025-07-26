import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SectionNavigation from '../../components/SectionNavigation/SectionNavigation';
import PersonalDataSection from './sections/PersonalData/PersonalDataSection';
import AboutSection from './sections/About/AboutSection';
import ExperiencesSection from './sections/Experiences/ExperiencesSection';
import SkillsSection from './sections/Skills/SkillsSection';
import ProjectsList from './sections/Projects/ProjectsList';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import './Dashboard.scss';

import projectsData from '../../data/projects.json';

// 🎯 Navigation items pour le dashboard
const DASHBOARD_NAVIGATION = [
  { id: 'overview', label: '📊 Vue d\'ensemble', selector: '#dashboard-overview' },
  { id: 'personal-data', label: '👤 Données personnelles', selector: '#personal-data-section' },
  { id: 'about', label: '📝 Contenu About', selector: '#about-section' },
  { id: 'experiences', label: '💼 Expériences', selector: '#experiences-section' },
  { id: 'skills', label: '🛠️ Compétences', selector: '#skills-section' },
  { id: 'projects', label: '🚀 Projets', selector: '#projects-section' }
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

  // 📊 Stats mockées (en attendant l'API)
  const stats: DashboardStats = {
    projectsCount: projectsData.length,
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

  // 🚀 Action rapide pour nouvelle compétence
  const handleNewSkill = () => {
    document.getElementById('skills-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setTimeout(() => {
      const addButton = document.querySelector('.skills-section .btn-add') as HTMLButtonElement;
      addButton?.click();
    }, 500);
  };

  // 🚀 Action rapide pour nouveau projet 
  const handleNewProject = () => {
    document.getElementById('projects-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setTimeout(() => {
      const addButton = document.querySelector('.projects-list__btn--primary') as HTMLButtonElement;
      addButton?.click();
    }, 500);
  };

  // 🚀 Action rapide pour modifier About
  const handleEditAbout = () => {
    document.getElementById('about-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setTimeout(() => {
      const editButton = document.querySelector('.about-section__actions .about-section__btn--primary') as HTMLButtonElement;
      editButton?.click();
    }, 500);
  };

  // 🚀 Action rapide pour modifier profil
  const handleEditProfile = () => {
    document.getElementById('personal-data-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    // Pas de timeout nécessaire car c'est un formulaire direct
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
            <div className='dashboard__btn dashboard__btn--secondary'>
              <ThemeToggle />
            </div>
            <button 
              onClick={handleBackToSite}
              className="dashboard__btn dashboard__btn--secondary"
            >
              🏠 Retour au site
            </button>
            <button 
              onClick={handleLogout}
              className="dashboard__btn dashboard__btn--danger"
            >
              🚪 Se déconnecter
            </button>
          </div>
        </div>
      </header>

      {/* 🎯 NAVIGATION RAPIDE */}
      <SectionNavigation 
        navigationItems={DASHBOARD_NAVIGATION} 
        defaultActiveSection="overview"
      />

      {/* 📊 CONTENU PRINCIPAL */}
      <main className="dashboard__main">
        <div className="dashboard__container">
          {/* 📊 VUE D'ENSEMBLE */}
          <section id="dashboard-overview" className="dashboard__section">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">📊 Vue d'ensemble</h2>
              <p className="dashboard__section-subtitle">
                Statistiques rapides de votre portfolio
              </p>
            </div>
            
            <div className="dashboard__stats">
              <div className="dashboard__stat-card">
                <div className="dashboard__stat-icon">🚀</div>
                <div className="dashboard__stat-content">
                  <div className="dashboard__stat-number">{stats.projectsCount}</div>
                  <div className="dashboard__stat-label">Projets</div>
                </div>
              </div>
              
              <div className="dashboard__stat-card">
                <div className="dashboard__stat-icon">🛠️</div>
                <div className="dashboard__stat-content">
                  <div className="dashboard__stat-number">{stats.skillsCount}</div>
                  <div className="dashboard__stat-label">Compétences</div>
                </div>
              </div>
              
              <div className="dashboard__stat-card">
                <div className="dashboard__stat-icon">💼</div>
                <div className="dashboard__stat-content">
                  <div className="dashboard__stat-number">{stats.experiencesCount}</div>
                  <div className="dashboard__stat-label">Expériences</div>
                </div>
              </div>
              
              <div className="dashboard__stat-card">
                <div className="dashboard__stat-icon">📅</div>
                <div className="dashboard__stat-content">
                  <div className="dashboard__stat-number">{stats.lastUpdate}</div>
                  <div className="dashboard__stat-label">Dernière MAJ</div>
                </div>
              </div>
            </div>

            <div className="dashboard__quick-actions">
              <h3>Actions rapides</h3>
              <div className="dashboard__quick-buttons">
                <button 
                  className="dashboard__quick-btn"
                  onClick={handleNewProject} // 🚀 CONNECTÉ !
                >
                  🚀 Nouveau projet
                </button>
                <button 
                  className="dashboard__quick-btn"
                  onClick={handleNewSkill}
                >
                  🆕 Nouvelle compétence
                </button>
                <button className="dashboard__quick-btn"
                  onClick={handleEditAbout}
                >
                  📝 Modifier About
                </button>
                <button
                  className="dashboard__quick-btn"
                  onClick={handleEditProfile}
                >
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
          <SkillsSection />

          {/* 🚀 PROJETS */}
          <section id="projects-section" className="dashboard__section">
            <ProjectsList />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
