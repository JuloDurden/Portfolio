import React, { useState, useEffect, useCallback } from 'react';
import './SectionNavigation.scss';

interface NavigationItem {
  id: string;
  label: string;
  selector: string;
}

interface SectionNavigationProps {
  navigationItems: NavigationItem[];
  defaultActiveSection?: string;
  offsetTop?: number;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({
  navigationItems,
  defaultActiveSection,
  offsetTop = 120
}) => {
  const [activeSection, setActiveSection] = useState<string>(
    defaultActiveSection || navigationItems[0]?.id || ''
  );

  // 🎯 DÉTECTION SECTION ACTIVE OPTIMISÉE
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offsetTop + 50;
      
      // Parcourir toutes les sections et trouver la plus proche
      let currentSection = navigationItems[0]?.id || '';
      
      navigationItems.forEach((item) => {
        const element = document.querySelector(item.selector);
        if (element) {
          const elementTop = element.offsetTop;
          const elementHeight = element.offsetHeight;
          
          // Si on est dans cette section
          if (scrollPosition >= elementTop && 
              scrollPosition < elementTop + elementHeight) {
            currentSection = item.id;
          }
          // Si on dépasse toutes les sections, prendre la dernière
          else if (scrollPosition >= elementTop) {
            currentSection = item.id;
          }
        }
      });
      
      // Mettre à jour seulement si différent
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // 🚀 THROTTLE SCROLL POUR PERFORMANCE
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Écouter le scroll
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Vérification initiale
    handleScroll();

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [navigationItems, offsetTop, activeSection]);

  // 🎯 NAVIGATION SMOOTH OPTIMISÉE
  const scrollToSection = useCallback((sectionId: string, selector: string) => {
    // Mettre à jour immédiatement l'état
    setActiveSection(sectionId);
    
    const element = document.querySelector(selector);
    if (element) {
      const elementTop = element.offsetTop;
      const finalOffsetTop = elementTop - offsetTop;

      window.scrollTo({
        top: finalOffsetTop,
        behavior: 'smooth'
      });
    }
  }, [offsetTop]);

  return (
    <div className="section-navigation">
      <nav className="section-navigation__nav">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id, item.selector)}
            className={`section-navigation__nav-item ${
              activeSection === item.id ? 'section-navigation__nav-item--active' : ''
            }`}
            aria-current={activeSection === item.id ? 'page' : undefined}
          >
            <span className="section-navigation__label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SectionNavigation;
