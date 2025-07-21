import React, { useRef, useState, useCallback } from 'react';
import { ExperiencePhotoUploadProps } from './types';
import './ExperiencePhotoUpload.scss';

const ExperiencePhotoUpload: React.FC<ExperiencePhotoUploadProps> = ({
  currentPhoto,
  onPhotoChange,
  onPhotoRemove,
  disabled = false,
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ====================================
  // 📁 VALIDATION DU FICHIER
  // ====================================
  const validateFile = (file: File): string | null => {
    // Vérifier le type
    if (!acceptedTypes.includes(file.type)) {
      return `Format non supporté. Utilisez : ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}`;
    }

    // Vérifier la taille
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      const fileMB = Math.round(file.size / (1024 * 1024) * 10) / 10;
      return `Fichier trop volumineux (${fileMB}MB). Maximum : ${maxMB}MB`;
    }

    return null;
  };

  // ====================================
  // 📤 TRAITEMENT DU FICHIER
  // ====================================
  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadError(null);

    try {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      // Créer l'URL de prévisualisation
      const previewUrl = URL.createObjectURL(file);
      
      // Appeler le callback parent
      onPhotoChange(file, previewUrl);
      
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error);
      setUploadError('Erreur lors du traitement du fichier');
    } finally {
      setIsProcessing(false);
    }
  }, [onPhotoChange, maxSize, acceptedTypes]);

  // ====================================
  // 🖱️ GESTIONNAIRES D'ÉVÉNEMENTS
  // ====================================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !disabled) {
      processFile(file);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onPhotoRemove) {
      onPhotoRemove();
      setUploadError(null);
    }
  };

  // ====================================
  // 🎯 DRAG & DROP
  // ====================================
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!disabled) {
      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    }
  };

  // ====================================
  // 🎨 RENDU DU COMPOSANT
  // ====================================
  const formatFileSize = (bytes: number): string => {
    return `${Math.round(bytes / (1024 * 1024) * 10) / 10} MB`;
  };

  return (
    <div className="experience-photo-upload">
      <label className="experience-photo-upload__label">
        🖼️ Photo d'illustration <span className="optional">(optionnel)</span>
      </label>
      
      <div
        className={`
          experience-photo-upload__zone
          ${isDragging ? 'experience-photo-upload__zone--dragging' : ''}
          ${disabled ? 'experience-photo-upload__zone--disabled' : ''}
          ${currentPhoto ? 'experience-photo-upload__zone--has-photo' : ''}
          ${uploadError ? 'experience-photo-upload__zone--error' : ''}
        `}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* 🖼️ PRÉVISUALISATION DE LA PHOTO */}
        {currentPhoto && (
          <div className="experience-photo-upload__preview">
            <img
              src={currentPhoto}
              alt="Aperçu de l'image d'expérience"
              className="experience-photo-upload__image"
            />
            <div className="experience-photo-upload__overlay">
              {!disabled && (
                <>
                  <button
                    type="button"
                    className="experience-photo-upload__remove"
                    onClick={handleRemove}
                    title="Supprimer l'image"
                    disabled={isProcessing}
                  >
                    🗑️
                  </button>
                  <p className="experience-photo-upload__change-text">
                    Cliquer pour changer
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* 📤 ZONE D'UPLOAD VIDE */}
        {!currentPhoto && (
          <div className="experience-photo-upload__empty">
            {isProcessing ? (
              <div className="experience-photo-upload__processing">
                <div className="spinner"></div>
                <p>Traitement en cours...</p>
              </div>
            ) : (
              <>
                <div className="experience-photo-upload__icon">
                  {isDragging ? '📥' : '🖼️'}
                </div>
                <div className="experience-photo-upload__text">
                  <p className="primary">
                    {isDragging 
                      ? 'Déposez votre image ici' 
                      : 'Cliquez ou glissez une image'
                    }
                  </p>
                  <p className="secondary">
                    Logo entreprise, photo du lieu, certificat...
                  </p>
                  <p className="info">
                    Formats acceptés: JPG, PNG, WebP • Max: {Math.round(maxSize / (1024 * 1024))}MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ❌ AFFICHAGE DES ERREURS */}
        {uploadError && (
          <div className="experience-photo-upload__error">
            ⚠️ {uploadError}
          </div>
        )}
      </div>

      {/* 🔧 INPUT FICHIER CACHÉ */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* 💡 SUGGESTIONS D'UTILISATION */}
      <div className="experience-photo-upload__suggestions">
        <p className="experience-photo-upload__suggestions-title">
          💡 Idées d'images :
        </p>
        <ul className="experience-photo-upload__suggestions-list">
          <li>🏢 Logo de l'entreprise/école</li>
          <li>📜 Certificat ou diplôme</li>
          <li>🏗️ Photo du projet réalisé</li>
          <li>📸 Photo de l'équipe ou du lieu</li>
        </ul>
      </div>
    </div>
  );
};

export default ExperiencePhotoUpload;
