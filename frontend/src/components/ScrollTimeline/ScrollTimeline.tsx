import React, { useState, useEffect, useRef } from 'react';
import './ScrollTimeline.scss';

interface TimelineItem {
  id: string;
  title: string;
  content: string;
  icon: string;
}

interface ScrollTimelineProps {
  items: TimelineItem[];
  className?: string;
}

const ScrollTimeline: React.FC<ScrollTimelineProps> = ({ items, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isTimelineActive, setIsTimelineActive] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // ✅ OBSERVER pour détecter quand on entre/sort de la timeline
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTimelineActive(entry.isIntersecting);
      },
      { 
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ✅ GESTION DU SCROLL - LOGIQUE SIMPLIFIÉE
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // ✅ Hijack SEULEMENT si on est dans la timeline
      if (!isTimelineActive) return;
      
      // ✅ Prévenir le scroll normal
      e.preventDefault();
      e.stopPropagation();
      
      if (isScrolling) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const newIndex = currentIndex + direction;
      
      console.log('🎯 Scroll détecté:', { 
        direction, 
        currentIndex, 
        newIndex, 
        totalItems: items.length 
      });
      
      // ✅ Navigation dans la timeline
      if (newIndex >= 0 && newIndex < items.length) {
        console.log('✅ Changement vers index:', newIndex);
        
        setIsScrolling(true);
        setCurrentIndex(newIndex);
        
        setTimeout(() => {
          setIsScrolling(false);
        }, 800);
        
        return;
      }
      
      // ✅ Sortie de timeline (fin atteinte)
      if (newIndex >= items.length) {
        console.log('🚀 Fin de timeline atteinte - libération du scroll');
        setIsTimelineActive(false);
        
        // Forcer la sortie de la section
        setTimeout(() => {
          const nextSection = timelineRef.current?.nextElementSibling as HTMLElement;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };

    // ✅ CAPTURE GLOBALE du scroll
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isTimelineActive, currentIndex, isScrolling, items.length]);

  // ✅ NAVIGATION PAR CLAVIER
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isTimelineActive || !['ArrowUp', 'ArrowDown', 'Space'].includes(e.key)) return;
      
      e.preventDefault();
      
      if (isScrolling) return;
      
      let direction = 0;
      if (e.key === 'ArrowDown' || e.key === 'Space') direction = 1;
      if (e.key === 'ArrowUp') direction = -1;
      
      const newIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
      
      if (newIndex !== currentIndex) {
        setIsScrolling(true);
        setCurrentIndex(newIndex);
        
        setTimeout(() => {
          setIsScrolling(false);
        }, 800);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isTimelineActive, currentIndex, isScrolling, items.length]);

  // ✅ NAVIGATION PAR DOTS
  const handleDotClick = (index: number) => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  // ✅ DEBUG - Affichage des données
  console.log('📊 Timeline State:', {
    currentIndex,
    isTimelineActive,
    isScrolling,
    totalItems: items.length,
    currentItem: items[currentIndex]?.title
  });

  return (
    <div 
      ref={timelineRef}
      className={`scroll-timeline ${className} ${isTimelineActive ? 'active' : ''}`}
      data-current-index={currentIndex}
      style={{ minHeight: '100vh' }} // ✅ Assurer la hauteur pour intersection
    >
      {/* Progress Bar */}
      <div className="timeline-progress">
        <div 
          className="timeline-progress-bar"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* Navigation Dots */}
      <div className="timeline-navigation">
        {items.map((_, index) => (
          <button
            key={index}
            className={`timeline-dot ${index === currentIndex ? 'active' : ''} ${index <= currentIndex ? 'visited' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Étape ${index + 1}: ${items[index].title}`}
          />
        ))}
      </div>

      {/* Timeline Content */}
      <div className="timeline-container">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`timeline-section ${index === currentIndex ? 'active' : ''}`}
            style={{ 
              opacity: index === currentIndex ? 1 : 0,
              transform: index === currentIndex ? 'translateY(0)' : 'translateY(50px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
          >
            <div className="timeline-card">
              <div className="timeline-card-icon">
                {item.icon}
              </div>
              <h3 className="timeline-card-title">
                {item.title}
              </h3>
              <p className="timeline-card-description">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="timeline-instructions">
        <span>
          {currentIndex < items.length - 1 
            ? `Étape ${currentIndex + 1} / ${items.length} - Scrollez pour continuer`
            : '🎉 Méthode complète ! Continuez à scroller ↓'
          }
        </span>
      </div>
    </div>
  );
};

export default ScrollTimeline;
