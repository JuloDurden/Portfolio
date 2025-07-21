import React, { useRef, useState } from 'react';
import { ProfilePictureUploadProps } from './types';

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentPicture,
  onPictureChange,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // 📁 Gestion sélection fichier
  const handleFileSelect = (file: File) => {
    if (!file) return;

    // ✅ Validation type
    if (!file.type.startsWith('image/')) {
      onPictureChange(null, null);
      return;
    }

    // ✅ Validation taille (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      onPictureChange(null, null);
      return;
    }

    // 🖼️ Créer preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      onPictureChange(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  // 🖱️ Click pour ouvrir explorateur
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // 📝 Change input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  // 🎯 Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // 🗑️ Supprimer photo
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPictureChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="profile-picture-upload">
      <label className="profile-picture-upload__label">
        📸 Photo de profil
      </label>
      
      <div
        className={`profile-picture-upload__zone ${
          isDragOver ? 'profile-picture-upload__zone--drag-over' : ''
        } ${error ? 'profile-picture-upload__zone--error' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentPicture ? (
          <div className="profile-picture-upload__preview">
            <img
              src={currentPicture}
              alt="Photo de profil"
              className="profile-picture-upload__image"
            />
            <div className="profile-picture-upload__overlay">
              <span className="profile-picture-upload__change-text">
                📷 Changer la photo
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="profile-picture-upload__remove"
                title="Supprimer la photo"
              >
                🗑️
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-picture-upload__placeholder">
            <div className="profile-picture-upload__icon">📸</div>
            <p className="profile-picture-upload__text">
              Cliquez ou glissez votre photo ici
            </p>
            <p className="profile-picture-upload__hint">
              JPG, PNG • Max 2MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="profile-picture-upload__error">
          ⚠️ {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ProfilePictureUpload;
