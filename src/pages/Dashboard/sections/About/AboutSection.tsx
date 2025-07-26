import React, { useState, useEffect, useRef } from 'react';
import { AboutData, AboutValidationErrors } from './types';
import AboutForm from './AboutForm';
import userService from '../../../../userService';
import './AboutSection.scss';

const AboutSection: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData>({
    currentJob: '',
    introductionParagraph: '',
    journeyParagraph: '',
    goalsParagraph: '',
    hobbies: []
  });
  
  const [validationErrors, setValidationErrors] = useState<AboutValidationErrors>({});
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // 🔥 REF POUR DEBOUNCE
  const debounceTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // 🔥 CHARGEMENT INITIAL
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const userData = await userService.getUserData();
        if (userData?.about) {
          setAboutData({
            currentJob: userData.about.currentJob || '',
            introductionParagraph: userData.about.introductionParagraph || '',
            journeyParagraph: userData.about.journeyParagraph || '',
            goalsParagraph: userData.about.goalsParagraph || '',
            hobbies: userData.about.hobbies || []
          });
        }
      } catch (error) {
        console.error('Erreur chargement About:', error);
        setFeedback({
          type: 'error',
          message: 'Erreur lors du chargement des données'
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadAboutData();
  }, []);

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
        
        // Appel API
        const response = await userService.updateAboutData(updatedData);

        console.log('✅ RÉPONSE API:', response);
        
        if (response.success) {
          setFeedback({
            type: 'success',
            message: `${getFieldLabel(field)} sauvegardé`
          });
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
        setAboutData(prev => ({ ...prev, [field]: aboutData[field] }));

        console.log('💾 STATE LOCAL MIS À JOUR:', { [field]: value });
        
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

  if (isInitialLoading) {
    return (
      <div className="about-section">
        <div className="loading-message">
          <span className="loading-spinner"></span>
          Chargement des données About...
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
