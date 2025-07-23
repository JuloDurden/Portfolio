import React, { useState, useEffect } from 'react';
import { AboutData, AboutFormState, AboutValidationErrors } from './types';
import AboutForm from './AboutForm';
import './AboutSection.scss';

const AboutSection: React.FC = () => {
  // Données mockées - sera remplacé par l'API
  const mockData: AboutData = {
    currentJob: 'Développeur Full-Stack',
    introductionParagraph: 'Passionné par le développement web et les nouvelles technologies, je créé des applications modernes et performantes.',
    journeyParagraph: 'Après mes études en informatique, j\'ai travaillé sur de nombreux projets alliant créativité et technique.',
    goalsParagraph: 'Mon objectif est de continuer à apprendre et à créer des solutions innovantes qui apportent une vraie valeur ajoutée.',
    hobbies: ['Photographie', 'Gaming', 'Randonnée'],
    lastUpdated: new Date('2024-01-15')
  };

  const [originalData, setOriginalData] = useState<AboutData>(mockData);
  const [formData, setFormData] = useState<AboutFormState>({
    ...mockData,
    isModified: false,
    validationErrors: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Validation
  const validateForm = (data: AboutFormState): AboutValidationErrors => {
    const errors: AboutValidationErrors = {};

    if (!data.currentJob.trim()) {
      errors.currentJob = 'Le métier actuel est requis';
    } else if (data.currentJob.length > 100) {
      errors.currentJob = 'Maximum 100 caractères';
    }

    if (!data.introductionParagraph.trim()) {
      errors.introductionParagraph = 'L\'introduction est requise';
    } else if (data.introductionParagraph.length > 500) {
      errors.introductionParagraph = 'Maximum 500 caractères';
    }

    if (!data.journeyParagraph.trim()) {
      errors.journeyParagraph = 'Le parcours est requis';
    } else if (data.journeyParagraph.length > 500) {
      errors.journeyParagraph = 'Maximum 500 caractères';
    }

    if (!data.goalsParagraph.trim()) {
      errors.goalsParagraph = 'Les objectifs sont requis';
    } else if (data.goalsParagraph.length > 500) {
      errors.goalsParagraph = 'Maximum 500 caractères';
    }

    if (data.hobbies.length === 0) {
      errors.hobbies = 'Ajoutez au moins un hobby';
    }

    return errors;
  };

  // Vérifier les modifications
  const checkModifications = (newData: Partial<AboutFormState>) => {
    const currentData = { ...formData, ...newData };
    const hasChanges = (
      currentData.currentJob !== originalData.currentJob ||
      currentData.introductionParagraph !== originalData.introductionParagraph ||
      currentData.journeyParagraph !== originalData.journeyParagraph ||
      currentData.goalsParagraph !== originalData.goalsParagraph ||
      JSON.stringify(currentData.hobbies) !== JSON.stringify(originalData.hobbies)
    );

    return { ...currentData, isModified: hasChanges };
  };

  // Gérer les changements
  const handleChange = (field: keyof AboutFormState, value: any) => {
    const newData = { [field]: value };
    const updatedData = checkModifications(newData);
    
    // Nettoyer les erreurs du champ modifié
    if (updatedData.validationErrors[field as keyof AboutValidationErrors]) {
      updatedData.validationErrors = { 
        ...updatedData.validationErrors,
        [field]: undefined 
      };
    }

    setFormData(updatedData);
  };

  // Sauvegarder
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormData(prev => ({ ...prev, validationErrors: errors }));
      setFeedback({ type: 'error', message: 'Veuillez corriger les erreurs' });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: null, message: '' });

    try {
      // TODO: Remplacer par l'appel API réel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const savedData: AboutData = {
        currentJob: formData.currentJob,
        introductionParagraph: formData.introductionParagraph,
        journeyParagraph: formData.journeyParagraph,
        goalsParagraph: formData.goalsParagraph,
        hobbies: formData.hobbies,
        lastUpdated: new Date()
      };

      setOriginalData(savedData);
      setFormData(prev => ({ 
        ...prev, 
        ...savedData,
        isModified: false,
        validationErrors: {}
      }));

      setFeedback({ 
        type: 'success', 
        message: 'Contenu About sauvegardé avec succès !' 
      });
    } catch (error) {
      setFeedback({ 
        type: 'error', 
        message: 'Erreur lors de la sauvegarde' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Annuler
  const handleCancel = () => {
    setFormData({
      ...originalData,
      isModified: false,
      validationErrors: {}
    });
    setFeedback({ type: null, message: '' });
  };

  // Auto-clear feedback
  useEffect(() => {
    if (feedback.type) {
      const timer = setTimeout(() => {
        setFeedback({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <section id="about-section" className="about-section">
      <div className="section-header">
        <div className="section-title">
          <h2>
            <span className="title-icon">👤</span>
            Contenu About
          </h2>
          {originalData.lastUpdated && (
            <span className="last-updated">
              📊 Dernière mise à jour: {originalData.lastUpdated.toLocaleDateString('fr-FR')}
            </span>
          )}
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
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </div>
    </section>
  );
};

export default AboutSection;
