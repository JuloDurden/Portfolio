import React, { useState, useEffect } from 'react';
import PersonalDataForm from './PersonalDataForm';
import { PersonalData } from './types';
import { useUserData } from '../../../../hooks/useUserData';
import './PersonalDataSection.scss';

const PersonalDataSection: React.FC = () => {
  // 🔥 UTILISER LE HOOK useUserData
  const { biographyData, loading: dataLoading, error: dataError, refetch } = useUserData();
  
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // 🔥 SYNCHRONISER AVEC LES DONNÉES API  
  useEffect(() => {
    if (biographyData && !dataLoading) {
      console.log('🔍 DONNÉES REÇUES biographyData:', biographyData);
      console.log('🔍 DONNÉES RAW biographyData.rawData:', biographyData.rawData);
      
      // 🔥 AMÉLIORER LE PARSING DU NOM
      const fullNameParts = (biographyData.fullName || '').trim().split(' ');
      const firstName = fullNameParts[0] || '';
      const lastName = fullNameParts.slice(1).join(' ') || '';
      
      const mappedData: PersonalData = {
        id: biographyData.rawData?._id || biographyData.rawData?.id || '1',
        firstName,
        lastName,
        // 🔥 ESSAYER PLUSIEURS SOURCES POUR EMAIL
        email: biographyData.rawData?.email || biographyData.email || '',
        // 🔥 ESSAYER PLUSIEURS SOURCES POUR DATE
        dateOfBirth: biographyData.rawData?.dateOfBirth || biographyData.dateOfBirth || '', 
        // 🔥 ESSAYER PLUSIEURS SOURCES POUR GITHUB
        githubUrl: biographyData.rawData?.githubUrl || biographyData.githubUrl || '',
        profilePicture: biographyData.profilePicture || '',
        createdAt: biographyData.rawData?.createdAt || biographyData.createdAt || '',
        updatedAt: biographyData.rawData?.updatedAt || biographyData.updatedAt || ''
      };
      
      console.log('✅ DONNÉES MAPPÉES DÉTAILLÉES:', {
        firstName: `"${mappedData.firstName}"`,
        lastName: `"${mappedData.lastName}"`,
        email: `"${mappedData.email}"`,
        dateOfBirth: `"${mappedData.dateOfBirth}"`,
        githubUrl: `"${mappedData.githubUrl}"`,
        profilePicture: `"${mappedData.profilePicture}"`
      });
      
      setPersonalData(mappedData);
      setLastSaved(biographyData.updatedAt || biographyData.rawData?.updatedAt || null);
    }
  }, [biographyData, dataLoading]);

  // 💾 FONCTION SAUVEGARDE PRINCIPALE
  const handleSave = async (data: PersonalData, profileFile?: File | null) => {
    console.log('🚀 DÉBUT SAUVEGARDE PERSONAL DATA:', {
      firstName: data.firstName,
      lastName: data.lastName, 
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      githubUrl: data.githubUrl,
      profileFile: profileFile ? 'PRÉSENT' : 'ABSENT'
    });
    
    setIsLoading(true);
    setSaveStatus('saving');

    try {
      // 🔥 RÉCUPÉRER LE TOKEN
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }

      // 🔥 ÉTAPE 1: Upload photo si présente
      if (profileFile) {
        console.log('📸 Upload photo de profil...', {
          name: profileFile.name,
          size: profileFile.size,
          type: profileFile.type
        });
        
        const formData = new FormData();
        formData.append('avatar', profileFile);

        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.text();
          console.error('❌ Erreur upload photo:', uploadError);
          throw new Error(`Erreur upload photo: ${uploadResponse.status}`);
        }
        
        const uploadResult = await uploadResponse.json();
        console.log('✅ Photo uploadée avec succès:', uploadResult);
      }

      // 🔥 ÉTAPE 2: Sauvegarde données personnelles (PAYLOAD AMÉLIORÉ)
      const personalDataPayload = {
        firstName: data.firstName?.trim() || '',
        lastName: data.lastName?.trim() || '',
        email: data.email?.trim() || '',
        dateOfBirth: data.dateOfBirth?.trim() || '',
        githubUrl: data.githubUrl?.trim() || ''
      };

      console.log('💾 PAYLOAD FINAL vers /personal-data:', personalDataPayload);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/personal-data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(personalDataPayload),
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur Response Body:', errorText);
        
        // 🚨 GESTION SPÉCIFIQUE DES ERREURS
        if (response.status === 404) {
          throw new Error('Endpoint /api/user/personal-data non trouvé');
        } else if (response.status === 500) {
          throw new Error('Erreur serveur lors de la sauvegarde');
        } else {
          throw new Error(`Erreur ${response.status}: ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('✅ DONNÉES PERSONNELLES SAUVEGARDÉES:', result);

      // 🔥 ÉTAPE 3: Mise à jour locale et rafraîchissement
      setPersonalData(prev => prev ? { 
        ...prev, 
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        githubUrl: data.githubUrl,
        updatedAt: new Date().toISOString()
      } : null);
      
      setLastSaved(new Date().toISOString());
      setSaveStatus('success');
      
      // 🔄 Rafraîchir après sauvegarde
      setTimeout(async () => {
        try {
          console.log('🔄 Rafraîchissement des données...');
          await refetch();
          console.log('✅ Données rafraîchies avec succès');
        } catch (refetchError) {
          console.error('⚠️ Erreur rafraîchissement:', refetchError);
        }
        setSaveStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('❌ ERREUR SAUVEGARDE COMPLÈTE:', error);
      setSaveStatus('error');
      
      // 🔄 Revenir à idle après 3 secondes
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔄 Rafraîchir les données
  const handleRefresh = async () => {
    try {
      console.log('🔄 Actualisation manuelle...');
      await refetch();
      console.log('✅ Données rafraîchies');
    } catch (error) {
      console.error('❌ Erreur rafraîchissement:', error);
    }
  };

  // 📅 Formater la date de dernière sauvegarde
  const formatLastSaved = (date: string | null) => {
    if (!date) return 'Jamais';
    try {
      return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // 🐛 GESTION DES ERREURS DE CHARGEMENT
  if (dataError) {
    return (
      <section className="personal-data-section" id='personal-data-section'>
        <div className="personal-data-section__error">
          <h2>❌ Erreur de chargement</h2>
          <p>Impossible de charger les données personnelles: {dataError}</p>
          <button onClick={handleRefresh} className="personal-data-section__retry-btn">
            🔄 Réessayer
          </button>
        </div>
      </section>
    );
  }

  // ⏳ ÉTAT DE CHARGEMENT
  if (dataLoading && !personalData) {
    return (
      <section className="personal-data-section">
        <div className="personal-data-section__loading">
          <h2>⏳ Chargement des données personnelles...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="personal-data-section">
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
            disabled={dataLoading || isLoading}
            className="personal-data-section__refresh-btn"
            title="Actualiser les données"
          >
            🔄 {dataLoading ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>
      </div>

      {/* 📊 STATUS BAR */}
      <div className="personal-data-section__status">
        <div className="personal-data-section__status-left">
          <span className="personal-data-section__status-saved">
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

      {/* 🐛 DEBUG INFO AMÉLIORER */}
      {biographyData && (
        <div style={{ 
          background: '#e8f4fd',
          color: '#003366', 
          padding: '12px', 
          margin: '10px 0', 
          fontSize: '11px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          border: '1px solid #b3d9ff'
        }}>
          <strong>🐛 DEBUG MAPPING COMPLET:</strong><br/>
          
          <strong>📊 biographyData structure:</strong><br/>
          - fullName: "{biographyData.fullName || '❌ VIDE'}"<br/>
          - email: "{biographyData.email || '❌ VIDE'}"<br/>
          - dateOfBirth: "{biographyData.dateOfBirth || '❌ VIDE'}"<br/>
          - githubUrl: "{biographyData.githubUrl || '❌ VIDE'}"<br/>
          
          <strong>📊 biographyData.rawData:</strong><br/>
          {biographyData.rawData ? (
            <>
              - email: "{biographyData.rawData.email || '❌ VIDE'}"<br/>
              - dateOfBirth: "{biographyData.rawData.dateOfBirth || '❌ VIDE'}"<br/>
              - githubUrl: "{biographyData.rawData.githubUrl || '❌ VIDE'}"<br/>
            </>
          ) : (
            '❌ rawData est NULL/UNDEFINED<br/>'
          )}
          
          <strong>📊 personalData final:</strong><br/>
          {personalData ? (
            <>
              - firstName: "{personalData.firstName}"<br/>
              - lastName: "{personalData.lastName}"<br/>
              - email: "{personalData.email}"<br/>
              - dateOfBirth: "{personalData.dateOfBirth}"<br/>
              - githubUrl: "{personalData.githubUrl}"<br/>
            </>
          ) : (
            '❌ personalData est NULL<br/>'
          )}
          
          <strong>Status:</strong> {saveStatus} | <strong>Loading:</strong> {isLoading ? 'OUI' : 'NON'}
        </div>
      )}

      {/* 📝 CONTENU PRINCIPAL */}
      <div className="personal-data-section__content">
        {personalData ? (
          <PersonalDataForm
            initialData={personalData}
            onSave={handleSave}
            isLoading={isLoading}
          />
        ) : (
          <div className="personal-data-section__no-data">
            ⚠️ Aucune donnée personnelle disponible
            <button onClick={handleRefresh}>🔄 Recharger</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PersonalDataSection;
