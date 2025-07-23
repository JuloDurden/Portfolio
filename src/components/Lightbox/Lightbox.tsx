import React, { useEffect, useCallback } from 'react';
import LightboxNavigation from './LightboxNavigation';
import './Lightbox.scss';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  altText?: string;
  showNavigation?: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  altText = '',
  showNavigation = true
}) => {
  const goToPrevious = useCallback(() => {
    if (images.length > 1) {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      onIndexChange(newIndex);
    }
  }, [currentIndex, images.length, onIndexChange]);

  const goToNext = useCallback(() => {
    if (images.length > 1) {
      const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      onIndexChange(newIndex);
    }
  }, [currentIndex, images.length, onIndexChange]);

  // Gestion clavier
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div 
      className="lightbox" 
      onClick={onClose}
      role="dialog"
      aria-label="Galerie d'images"
      aria-modal="true"
    >
      <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
        <img 
          src={images[currentIndex]} 
          alt={`${altText} - Image ${currentIndex + 1} sur ${images.length}`}
        />
        
        <LightboxNavigation
          currentIndex={currentIndex}
          totalImages={images.length}
          onPrevious={goToPrevious}
          onNext={goToNext}
          showNavigation={showNavigation}
        />
      </div>
      
      <button 
        className="lightbox__close"
        onClick={onClose}
        aria-label="Fermer la galerie"
      >
        ×
      </button>
    </div>
  );
};

export default Lightbox;
