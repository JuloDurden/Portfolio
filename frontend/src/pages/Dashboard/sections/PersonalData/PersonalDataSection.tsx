import React, { useState, useEffect } from 'react';
import PersonalDataForm from './PersonalDataForm';
import { PersonalData } from './types';
import './PersonalDataSection.scss';

const PersonalDataSection: React.FC = () => {
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // 🔄 Charger les données au montage
  useEffect(() => {
    loadPersonalData();
  }, []);

  // 📥 Charger les données (simulation API)
  const loadPersonalData = async () => {
    setIsFetching(true);
    try {
      // 🚀 TODO: Remplacer par vraie API
      // const response = await fetch('/api/personal-data');
      // const data = await response.json();
      
      // 🧪 Simulation données existantes
      const mockData: PersonalData = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe', 
        email: 'john.doe@example.com',
        dateOfBirth: '1990-05-15',
        githubUrl: 'https://github.com/johndoe',
        profilePicture: '', // Pas de photo par défaut
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z'
      };
      
      // 🎭 Simuler délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPersonalData(mockData);
      setLastSaved(mockData.updatedAt || null);
    } catch (error) {
      console.error('Erreur chargement données personnelles:', error);
      setPersonalData(null);
    } finally {
      setIsFetching(false);
    }
  };

  // 💾 Sauvegarder les données
  const handleSave = async (data: PersonalData, profileFile?: File): Promise<void> => {
    setIsLoading(true);
    setSaveStatus('saving');
    
    try {
      let finalData = { ...data };
      
      // 📸 Upload de la photo si présente
      if (profileFile) {
        // 🚀 TODO: Upload vers API
        // const formData = new FormData();
        // formData.append('profilePicture', profileFile);
        // const uploadResponse = await fetch('/api/upload/profile-picture', {
        //   method: 'POST',
        //   body: formData
        // });
        // const { url } = await uploadResponse.json();
        
        // 🧪 Simulation URL de la photo
        const mockPhotoUrl = URL.createObjectURL(profileFile);
        finalData.profilePicture = mockPhotoUrl;
      }
      
      // 💾 Sauvegarder les données
      // 🚀 TODO: Remplacer par vraie API
      // const response = await fetch('/api/personal-data', {
      //   method: personalData?.id ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(finalData)
      // });
      // const savedData = await response.json();
      
      // 🧪 Simulation sauvegarde
      const savedData: PersonalData = {
        ...finalData,
        id: personalData?.id || '1',
        updatedAt: new Date().toISOString()
      };
      
      // 🎭 Simuler délai réseau
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setPersonalData(savedData);
      setLastSaved(savedData.updatedAt || null);
      setSaveStatus('success');
      
      // ✅ Message success temporaire
      setTimeout(() => setSaveStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Actualiser les données
  const handleRefresh = () => {
    loadPersonalData();
  };

  // 📅 Format date pour affichage
  const formatLastSaved = (dateString: string | null): string => {
    if (!dateString) return 'Jamais sauvegardé';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)} h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <section id="personal-data-section" className="personal-data-section">
      
      {/* 📋 EN-TÊTE SECTION */}
      <div className="personal-data-section__header">
        <div className="personal-data-section__title-group">
          <h2 className="personal-data-section__title">
            👤 Données Personnelles
          </h2>
          <p className="personal-data-section__description">
            Gérez vos informations personnelles et votre photo de profil
          </p>
        </div>
        
        <div className="personal-data-section__actions">
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="personal-data-section__refresh-btn"
            title="Actualiser les données"
          >
            🔄 {isFetching ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* 📊 STATUS BAR */}
      <div className="personal-data-section__status">
        <div className="personal-data-section__status-left">
          <span className="personal-data-section__last-saved">
            📅 Dernière sauvegarde : {formatLastSaved(lastSaved)}
          </span>
        </div>
        
        <div className="personal-data-section__status-right">
          {saveStatus === 'saving' && (
            <div className="personal-data-section__status-item personal-data-section__status-item--saving">
              ⏳ Sauvegarde en cours...
            </div>
          )}
          {saveStatus === 'success' && (
            <div className="personal-data-section__status-item personal-data-section__status-item--success">
              ✅ Sauvegardé avec succès
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="personal-data-section__status-item personal-data-section__status-item--error">
              ❌ Erreur de sauvegarde
            </div>
          )}
        </div>
      </div>

      {/* 📝 CONTENU PRINCIPAL */}
      <div className="personal-data-section__content">
        {isFetching ? (
          <div className="personal-data-section__loading">
            <div className="personal-data-section__loading-spinner"></div>
            <p>Chargement de vos données personnelles...</p>
          </div>
        ) : (
          <PersonalDataForm
            initialData={personalData || undefined}
            onSave={handleSave}
            isLoading={isLoading}
          />
        )}
      </div>
    </section>
  );
};

export default PersonalDataSection;
