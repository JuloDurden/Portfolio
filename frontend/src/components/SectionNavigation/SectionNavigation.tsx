import React, { useState, useEffect } from 'react';
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

  // 🎯 DÉTECTION DE LA SECTION ACTIVE
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -50% 0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      let mostVisibleEntry = null;
      let maxRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });

      if (mostVisibleEntry) {
        const element = mostVisibleEntry.target;
        
        // Trouver l'ID de section correspondant
        navigationItems.forEach((item) => {
          if (element.matches(item.selector) || element.querySelector(item.selector)) {
            if (item.id !== activeSection) {
              setActiveSection(item.id);
            }
          }
        });
      }
    }, observerOptions);

    // Observer toutes les sections définies
    navigationItems.forEach((item) => {
      const elements = document.querySelectorAll(item.selector);
      elements.forEach(element => observer.observe(element));
    });

    return () => observer.disconnect();
  }, [activeSection, navigationItems]);

  // 🎯 NAVIGATION SMOOTH
  const scrollToSection = (sectionId: string, selector: string) => {
    setActiveSection(sectionId);
    
    const element = document.querySelector(selector);
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
      const finalOffsetTop = elementTop - offsetTop;

      window.scrollTo({
        top: finalOffsetTop,
        behavior: 'smooth'
      });
    }
  };

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
          >
            <span className="section-navigation__label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SectionNavigation;
