import React, { useState, useEffect } from 'react';
import './Experience.scss';
import { API_BASE_URL } from '../../config/api';

interface ExperienceItem {
  id: string;
  image?: string;
  company?: string;
  position: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string[];
  technologies?: string[];
  type: 'work' | 'education';
}

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ====================================
  // 🔄 MAPPING BACKEND → FRONTEND
  // ====================================
  const mapFromBackend = (backendExp: any): ExperienceItem => {
    // Helper pour parser les arrays mal formés
    const parseArrayField = (field: any): string[] => {
      if (!field) return [];
      
      // Si c'est déjà un array de strings normaux
      if (Array.isArray(field) && field.length > 0 && typeof field[0] === 'string') {
        // Si le premier élément commence par [ c'est du JSON
        if (field[0].startsWith('[')) {
          try {
            return JSON.parse(field[0]);
          } catch {
            return field;
          }
        }
        return field;
      }
      
      // Si c'est un string JSON
      if (typeof field === 'string' && field.startsWith('[')) {
        try {
          return JSON.parse(field);
        } catch {
          return [field];
        }
      }
      
      return Array.isArray(field) ? field : [];
    };

    // ✅ FORMATAGE PÉRIODE
    const formatPeriod = (startDate: string, endDate?: string): string => {
      const startYear = new Date(startDate).getFullYear();
      
      if (!endDate) {
        return `${startYear} - Présent`;
      }
      
      const endYear = new Date(endDate).getFullYear();
      return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
    };

    return {
      id: backendExp._id || backendExp.id,
      image: backendExp.image || undefined,
      company: backendExp.company || undefined,
      position: backendExp.position,
      startDate: backendExp.startDate,
      endDate: backendExp.endDate,
      location: backendExp.location,
      description: parseArrayField(backendExp.description),
      technologies: parseArrayField(backendExp.technologies),
      type: backendExp.type
    };
  };

  // ====================================
  // 📡 FETCH EXPERIENCES DEPUIS L'API
  // ====================================
  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/experiences?sort=newest`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        const mappedExperiences = result.data.map(mapFromBackend);
        
        // ✅ TRI : Work d'abord, puis Education, chacune du plus récent au plus vieux
        const sortedExperiences = [
          ...mappedExperiences
            .filter(exp => exp.type === 'work')
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
          ...mappedExperiences
            .filter(exp => exp.type === 'education')
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        ];
        
        setExperiences(sortedExperiences);
        console.log('✅ Expériences chargées:', sortedExperiences.length);
      } else {
        throw new Error(result.message || 'Erreur lors du chargement');
      }
    } catch (err) {
      console.error('❌ Erreur fetchExperiences:', err);
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // 🚀 CHARGEMENT INITIAL
  // ====================================
  useEffect(() => {
    fetchExperiences();
  }, []);

  // ====================================
  // 📅 FORMATAGE PÉRIODE
  // ====================================
  const formatPeriod = (startDate: string, endDate?: string): string => {
    const startYear = new Date(startDate).getFullYear();
    
    if (!endDate) {
      return `${startYear} - Présent`;
    }
    
    const endYear = new Date(endDate).getFullYear();
    return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
  };

  // ====================================
  // 🎨 RENDER CARD
  // ====================================
  const renderCard = (exp: ExperienceItem) => (
    <div key={exp.id} className="experience__card">
      <div className="experience__image">
        {exp.image ? (
          <img 
            src={exp.image} 
            alt={`${exp.position} - ${exp.company || exp.location}`}
            className="experience__img"
            onLoad={() => console.log('✅ Image chargée avec succès:', exp.image)}
            onError={(e) => {
              console.error('❌ Erreur chargement image:', exp.image);
              // Fallback si l'image ne charge pas
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback toujours présent mais caché si image OK */}
        <div 
          className="experience__fallback"
          style={{ display: exp.image ? 'none' : 'flex' }}
        >
          {exp.type === 'education' ? '🎓' : '💼'}
        </div>
      </div>
      
      <div className="experience__content">
        <div className="experience__header">
          <h3 className="experience__title">{exp.position}</h3>
          <span className="experience__period">{formatPeriod(exp.startDate, exp.endDate)}</span>
        </div>
        
        {exp.company && (
          <h4 className="experience__company">{exp.company}</h4>
        )}
        <p className="experience__location">📍 {exp.location}</p>
        
        <div className="experience__description">
          {exp.description.map((desc, index) => (
            <p key={index}>{desc}</p>
          ))}
        </div>
        
        {exp.technologies && exp.technologies.length > 0 && (
          <div className="experience__tech">
            {exp.technologies.map((tech, index) => (
              <span key={index} className="experience__tag">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ====================================
  // 🎨 RENDER PRINCIPAL
  // ====================================

  // ✅ ÉTAT DE CHARGEMENT
  if (loading) {
    return (
      <section className="experience">
        <div className="container">
          <div className="experience__loading">
            <p>🔄 Chargement des expériences...</p>
          </div>
        </div>
      </section>
    );
  }

  // ✅ ÉTAT D'ERREUR
  if (error) {
    return (
      <section className="experience">
        <div className="container">
          <div className="experience__error">
            <p>❌ Erreur: {error}</p>
            <button onClick={fetchExperiences} className="experience__retry">
              🔄 Réessayer
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ✅ DONNÉES VIDES
  if (experiences.length === 0) {
    return (
      <section className="experience">
        <div className="container">
          <div className="experience__empty">
            <p>📭 Aucune expérience trouvée.</p>
          </div>
        </div>
      </section>
    );
  }

  // ✅ FILTRAGE POUR L'AFFICHAGE
  const workExperiences = experiences.filter(exp => exp.type === 'work');
  const education = experiences.filter(exp => exp.type === 'education');

  return (
    <section className="experience">
      <div className="container">
        
        {/* 💼 EXPÉRIENCE PRO */}
        {workExperiences.length > 0 && (
          <div className="experience__section">
            <h2 className="experience__section-title">
              💼 Expérience Professionnelle
            </h2>
            <div className="experience__grid">
              {workExperiences.map(renderCard)}
            </div>
          </div>
        )}

        {/* 🎓 FORMATION */}
        {education.length > 0 && (
          <div className="experience__section">
            <h2 className="experience__section-title">
              🎓 Formation
            </h2>
            <div className="experience__grid">
              {education.map(renderCard)}
            </div>
          </div>
        )}
        
      </div>
    </section>
  );
};

export default Experience;
