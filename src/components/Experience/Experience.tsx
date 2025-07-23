import React from 'react';
import './Experience.scss';

interface ExperienceItem {
  id: number;
  image?: string;
  company?: string;
  position: string;
  period: string;
  location: string;
  description: string[];
  technologies?: string[];
  type: 'work' | 'education';
}

const Experience: React.FC = () => {
  const experiences: ExperienceItem[] = [
    {
      id: 1,
      image: "/experience/freelance.webp",
      position: "Développeur Web",
      period: "2025 - Présent",
      location: "Montpellier, France",
      description: [
        "Développement d'applications web modernes avec React et Node.js",
        "Architecture et optimisation de bases de données MongoDB/Express",
        "Optimisation SEO"
      ],
      technologies: ["React", "Node.js", "TypeScript", "MongoDB", "Express"],
      type: 'work'
    },
    {
      id: 2,
      image: "/experience/casino-odysseum.webp",
      company: "Casino #Hyper Frais Odysseum",
      position: "Responsable commercial",
      period: "2009 - 2024",
      location: "Montpellier, France",
      description: [
        "Management d'équipe (15/25 personnes)",
        "Mise en rayon / Gestion de stock",
        "Achats/Ventes",
        "Conseil à la clientèle"
      ],
      type: 'work'
    },
    {
      id: 3,
      image: "/experience/casino-montpellier.webp",
      company: "Géant Casino Près d'Arènes",
      position: "Responsable commercial",
      period: "2002 - 2009",
      location: "Montpellier, France",
      description: [
        "Management d'équipe (5/10 personnes)",
        "Mise en rayon / Gestion de stock",
        "Achats/Ventes",
        "Conseil à la clientèle"
      ],
      type: 'work'
    },
    {
      id: 4,
      image: "/experience/openclassrooms.webp",
      company: "OpenClassrooms",
      position: "Formation Développement Web",
      period: "2025",
      location: "France",
      description: [
        "Formation intensive en développement web",
        "Apprentissage des langages et frameworks modernes",
        "Projets pratiques et mise en situation professionnelle",
        "Certification en développement web RNCP 38145"
      ],
      technologies: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "MongoDB", "Express"],
      type: 'education'
    }
  ];

  const workExperiences = experiences.filter(exp => exp.type === 'work');
  const education = experiences.filter(exp => exp.type === 'education');

  const renderCard = (exp: ExperienceItem) => (
    <div key={exp.id} className="experience__card">
      <div className="experience__image">
        {exp.image ? (
          <img 
            src={exp.image} 
            alt={`${exp.position} - ${exp.company || exp.location}`}
            className="experience__img"
          />
        ) : (
          <div className="experience__fallback">
            {exp.type === 'education' ? '🎓' : '💼'}
          </div>
        )}
      </div>
      
      <div className="experience__content">
        <div className="experience__header">
          <h3 className="experience__title">{exp.position}</h3>
          <span className="experience__period">{exp.period}</span>
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
        
        {exp.technologies && (
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

  return (
    <section className="experience">
      <div className="container">
        
        {/* 💼 EXPÉRIENCE PRO */}
        <div className="experience__section">
          <h2 className="experience__section-title">
            💼 Expérience Professionnelle
          </h2>
          <div className="experience__grid">
            {workExperiences.map(renderCard)}
          </div>
        </div>

        {/* 🎓 FORMATION */}
        <div className="experience__section">
          <h2 className="experience__section-title">
            🎓 Formation
          </h2>
          <div className="experience__grid">
            {education.map(renderCard)}
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Experience;
