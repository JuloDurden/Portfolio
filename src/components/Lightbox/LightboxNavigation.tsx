import React from 'react';

interface LightboxNavigationProps {
  currentIndex: number;
  totalImages: number;
  onPrevious: () => void;
  onNext: () => void;
  showNavigation?: boolean;
  className?: string;
}

const LightboxNavigation: React.FC<LightboxNavigationProps> = ({
  currentIndex,
  totalImages,
  onPrevious,
  onNext,
  showNavigation = true,
  className = ''
}) => {
  if (!showNavigation || totalImages <= 1) return null;

  return (
    <div className={`lightbox-navigation ${className}`}>
      <button 
        className="lightbox-navigation__btn lightbox-navigation__btn--prev"
        onClick={onPrevious}
        aria-label="Image précédente"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <button 
        className="lightbox-navigation__btn lightbox-navigation__btn--next"
        onClick={onNext}
        aria-label="Image suivante"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div className="lightbox-navigation__counter">
        {currentIndex + 1} / {totalImages}
      </div>
    </div>
  );
};

export default LightboxNavigation;
