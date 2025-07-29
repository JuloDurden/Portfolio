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
  // 🚫 BLOQUER LE SCROLL DU BODY
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

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

  // 🎯 GESTION CLAVIER AMÉLIORÉE
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 🚫 EMPÊCHER LES ACTIONS PAR DÉFAUT
      if (['Escape', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown, true); // 🎯 CAPTURE PHASE
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  // 🚫 EMPÊCHER LE SCROLL SUR LA LIGHTBOX
  const handleLightboxClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }, [onClose]);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }, [onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div 
      className="lightbox" 
      onClick={handleLightboxClick}
      onTouchStart={(e) => e.preventDefault()} // 🎯 MOBILE
      role="dialog"
      aria-label="Galerie d'images"
      aria-modal="true"
    >
      <div 
        className="lightbox__content" 
        onClick={handleContentClick}
      >
        <img 
          src={images[currentIndex]} 
          alt={`${altText} - Image ${currentIndex + 1} sur ${images.length}`}
          draggable={false} // 🚫 PAS DE DRAG
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
        onClick={handleCloseClick}
        onTouchStart={handleCloseClick} // 🎯 SUPPORT MOBILE
        aria-label="Fermer la galerie"
        type="button"
      >
        ×
      </button>
    </div>
  );
};

export default Lightbox;
