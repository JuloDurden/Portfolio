import React, { useEffect } from 'react';
import './Modal.scss';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  closeOnOverlay?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  children, 
  onClose, 
  title,
  size = 'medium',
  closeOnOverlay = true 
}) => {
  
  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Bloquer scroll
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal modal--${size}`}>
        
        {/* Header avec titre et bouton fermer */}
        <div className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          <button 
            className="modal__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Contenu */}
        <div className="modal__content">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
