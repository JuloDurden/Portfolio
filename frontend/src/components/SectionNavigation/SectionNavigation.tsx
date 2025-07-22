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
  const [isScrolling, setIsScrolling] = useState(false);

  // 🎯 DÉTECTION SECTION ACTIVE
  useEffect(() => {
    const handleScroll = () => {
      // Ne pas détecter pendant un scroll programmé
      if (isScrolling) return;
      
      const scrollPosition = window.scrollY + offsetTop + 50;
      let currentSection = navigationItems[0]?.id || '';
      
      // Parcourir en ordre inverse pour prendre la section la plus haute visible
      for (let i = navigationItems.length - 1; i >= 0; i--) {
        const item = navigationItems[i];
        const element = document.querySelector(item.selector);
        
        if (element) {
          const elementTop = element.offsetTop;
          
          if (scrollPosition >= elementTop) {
            currentSection = item.id;
            break; // ✅ Sortir dès qu'on trouve la bonne section
          }
        }
      }
      
      // Mettre à jour seulement si différent
      setActiveSection(prev => prev !== currentSection ? currentSection : prev);
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
    
    // Vérification initiale (après un petit délai)
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      clearTimeout(timer);
    };
  }, [navigationItems, offsetTop, isScrolling]);

  // 🎯 NAVIGATION SMOOTH OPTIMISÉE
  const scrollToSection = useCallback((sectionId: string, selector: string) => {
    const element = document.querySelector(selector);
    if (!element) return;
    
    // Marquer qu'on scroll programmé
    setIsScrolling(true);
    setActiveSection(sectionId);
    
    const elementTop = element.offsetTop;
    const finalOffsetTop = elementTop - offsetTop;

    window.scrollTo({
      top: finalOffsetTop,
      behavior: 'smooth'
    });
    
    // Remettre la détection après le scroll
    const timer = setTimeout(() => {
      setIsScrolling(false);
    }, 1000); // Délai pour le smooth scroll
    
    return () => clearTimeout(timer);
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
