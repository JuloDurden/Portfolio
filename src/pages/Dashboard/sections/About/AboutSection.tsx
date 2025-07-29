import React, { useState, useEffect, useRef } from 'react';
import { AboutData, AboutValidationErrors } from './types';
import AboutForm from './AboutForm';
import { useUserData } from '../../../../hooks/useUserData';
import userService from '../../../../userService';
import './AboutSection.scss';

const AboutSection: React.FC = () => {
  // 🔥 UTILISER LE HOOK useUserData
  const { biographyData, loading: dataLoading, error: dataError, refetch } = useUserData();
  
  const [aboutData, setAboutData] = useState<AboutData>({
    currentJob: '',
    introductionParagraph: '',
    journeyParagraph: '',
    goalsParagraph: '',
    hobbies: []
  });
  
  const [validationErrors, setValidationErrors] = useState<AboutValidationErrors>({});
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // 🔥 REF POUR DEBOUNCE
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // 🔥 SYNCHRONISER AVEC LES DONNÉES API
  useEffect(() => {
    if (biographyData && !dataLoading) {
      setAboutData({
        currentJob: biographyData.currentJob || '',
        introductionParagraph: biographyData.biography.introduction || '',
        journeyParagraph: biographyData.biography.journey || '',
        goalsParagraph: biographyData.biography.goals || '',
        hobbies: biographyData.hobbies || []
      });
    }
  }, [biographyData, dataLoading]);

  // 🔥 VALIDATION
  const validateField = (field: keyof AboutData, value: any): string | undefined => {
    switch (field) {
      case 'currentJob':
        if (!value.trim()) return 'Le métier actuel est requis';
        if (value.length > 100) return 'Maximum 100 caractères';
        break;
      
      case 'introductionParagraph':
      case 'journeyParagraph':
      case 'goalsParagraph':
        if (!value.trim()) return 'Ce champ est requis';
        if (value.length > 500) return 'Maximum 500 caractères';
        break;
      
      case 'hobbies':
        if (!Array.isArray(value) || value.length === 0) {
          return 'Ajoutez au moins un hobby';
        }
        break;
    }
    return undefined;
  };

  // 🔥 GESTION LOADING PAR CHAMP
  const setFieldLoading = (field: string, isLoading: boolean) => {
    setLoadingFields(prev => {
      const newSet = new Set(prev);
      if (isLoading) {
        newSet.add(field);
      } else {
        newSet.delete(field);
      }
      return newSet;
    });
  };

  // 🔥 CLEAR ERRORS
  const clearErrors = () => {
    setFeedback({ type: null, message: '' });
  };

  // 🔥 SAUVEGARDE AUTO AVEC DEBOUNCE CORRECT
  const handleFieldChange = async (field: keyof AboutData, value: any) => {
    // Mise à jour immédiate UI
    setAboutData(prev => ({ ...prev, [field]: value }));
    clearErrors();

    // Validation temps réel
    const fieldError = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));

    // Annuler le timeout précédent pour ce champ
    if (debounceTimeouts.current[field]) {
      clearTimeout(debounceTimeouts.current[field]);
    }

    // Si erreur de validation, pas de sauvegarde
    if (fieldError) return;

    // Démarrer le loading pour ce champ
    setFieldLoading(field, true);

    // Nouveau timeout debounce
    debounceTimeouts.current[field] = setTimeout(async () => {
      try {
        // Créer les données mises à jour
        const updatedData = { ...aboutData, [field]: value };
        console.log('🚀 ENVOI API:', { [field]: value });
        
        // 🔥 APPEL API AVEC BONNE MÉTHODE
        const response = await userService.updateAboutData(updatedData);

        console.log('✅ RÉPONSE API:', response);
        
        if (response.success) {
          setFeedback({
            type: 'success',
            message: `${getFieldLabel(field)} sauvegardé`
          });
          
          // 🔥 RAFRAÎCHIR LES DONNÉES POUR SYNCHRONISER
          setTimeout(() => refetch(), 500);
        } else {
          throw new Error(response.message || 'Erreur de sauvegarde');
        }

      } catch (error) {
        console.error(`Erreur sauvegarde ${field}:`, error);
        setFeedback({
          type: 'error',
          message: `Erreur sauvegarde ${getFieldLabel(field)}`
        });
        
        // Remettre l'ancienne valeur en cas d'erreur
        if (biographyData) {
          const originalValue = field === 'currentJob' ? biographyData.currentJob :
                               field === 'introductionParagraph' ? biographyData.biography.introduction :
                               field === 'journeyParagraph' ? biographyData.biography.journey :
                               field === 'goalsParagraph' ? biographyData.biography.goals :
                               field === 'hobbies' ? biographyData.hobbies : '';
          setAboutData(prev => ({ ...prev, [field]: originalValue }));
        }
        
      } finally {
        // Arrêter le loading
        setFieldLoading(field, false);
      }
    }, 1000); // Debounce 1 seconde
  };

  // 🔥 LABELS CHAMPS
  const getFieldLabel = (field: keyof AboutData): string => {
    const labels = {
      currentJob: 'Métier',
      introductionParagraph: 'Introduction',
      journeyParagraph: 'Parcours',
      goalsParagraph: 'Objectifs',
      hobbies: 'Hobbies'
    };
    return labels[field];
  };

  // 🔥 CLEANUP TIMEOUTS
  useEffect(() => {
    return () => {
      Object.values(debounceTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // Auto-clear feedback
  useEffect(() => {
    if (feedback.type) {
      const timer = setTimeout(() => {
        setFeedback({ type: null, message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // 🔥 GESTION LOADING ET ERREURS
  if (dataLoading) {
    return (
      <div className="about-section">
        <div className="loading-message">
          <span className="loading-spinner"></span>
          Chargement des données About...
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="about-section">
        <div className="error-message">
          <span className="error-icon">❌</span>
          Erreur de chargement : {dataError}
          <button onClick={refetch} className="retry-btn">
            🔄 Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="about-section" className="about-section">
      <div className="section-header">
        <div className="section-title">
          <h2>
            <span className="title-icon">👤</span>
            Contenu About
          </h2>
        </div>

        {feedback.type && (
          <div className={`feedback ${feedback.type}`}>
            <span className="feedback-icon">
              {feedback.type === 'success' ? '✅' : '❌'}
            </span>
            {feedback.message}
          </div>
        )}
      </div>

      <div className="section-content">
        <AboutForm
          aboutData={aboutData}
          validationErrors={validationErrors}
          loadingFields={loadingFields}
          onChange={handleFieldChange}
        />
      </div>
    </section>
  );
};

export default AboutSection;
