import React from 'react';
import { AboutData, AboutValidationErrors } from './types';
import HobbiesInput from './HobbiesInput';

interface AboutFormProps {
  aboutData: AboutData;
  validationErrors: AboutValidationErrors;
  loadingFields: Set<string>;
  onChange: (field: keyof AboutData, value: any) => void;
}

const AboutForm: React.FC<AboutFormProps> = ({
  aboutData,
  validationErrors,
  loadingFields,
  onChange
}) => {
  const MAX_PARAGRAPH_LENGTH = 500;
  const MAX_JOB_LENGTH = 100;

  const getCharacterCount = (text: string, max: number) => ({
    current: text.length,
    max,
    isOverLimit: text.length > max
  });

  const isFieldLoading = (field: string) => loadingFields.has(field);

  return (
    <div className="about-form">
      {/* 🔥 MÉTIER ACTUEL */}
      <div className="form-group">
        <label htmlFor="currentJob" className="form-label">
          <span className="label-icon">👔</span>
          Métier actuel
          {isFieldLoading('currentJob') && (
            <span className="field-loading">
              <span className="loading-spinner"></span>
              Sauvegarde...
            </span>
          )}
        </label>
        <input
          type="text"
          id="currentJob"
          value={aboutData.currentJob}
          onChange={(e) => onChange('currentJob', e.target.value)}
          className={`form-input ${validationErrors.currentJob ? 'error' : ''} ${isFieldLoading('currentJob') ? 'loading' : ''}`}
          placeholder="Ex: Développeur Full-Stack"
          maxLength={MAX_JOB_LENGTH}
        />
        <div className="field-info">
          <span className="character-count">
            {aboutData.currentJob.length}/{MAX_JOB_LENGTH} caractères
          </span>
        </div>
        {validationErrors.currentJob && (
          <span className="error-message">❌ {validationErrors.currentJob}</span>
        )}
      </div>

      {/* 🔥 INTRODUCTION */}
      <div className="form-group">
        <label htmlFor="introductionParagraph" className="form-label">
          <span className="label-icon">📝</span>
          Introduction
          {isFieldLoading('introductionParagraph') && (
            <span className="field-loading">
              <span className="loading-spinner"></span>
              Sauvegarde...
            </span>
          )}
        </label>
        <textarea
          id="introductionParagraph"
          value={aboutData.introductionParagraph}
          onChange={(e) => onChange('introductionParagraph', e.target.value)}
          className={`form-textarea ${validationErrors.introductionParagraph ? 'error' : ''} ${isFieldLoading('introductionParagraph') ? 'loading' : ''}`}
          placeholder="Présentez-vous en quelques mots..."
          rows={4}
        />
        <div className="field-info">
          {(() => {
            const { current, max, isOverLimit } = getCharacterCount(
              aboutData.introductionParagraph, 
              MAX_PARAGRAPH_LENGTH
            );
            return (
              <span className={`character-count ${isOverLimit ? 'over-limit' : ''}`}>
                {current}/{max} caractères
              </span>
            );
          })()}
        </div>
        {validationErrors.introductionParagraph && (
          <span className="error-message">❌ {validationErrors.introductionParagraph}</span>
        )}
      </div>

      {/* 🔥 PARCOURS */}
      <div className="form-group">
        <label htmlFor="journeyParagraph" className="form-label">
          <span className="label-icon">🚀</span>
          Mon parcours
          {isFieldLoading('journeyParagraph') && (
            <span className="field-loading">
              <span className="loading-spinner"></span>
              Sauvegarde...
            </span>
          )}
        </label>
        <textarea
          id="journeyParagraph"
          value={aboutData.journeyParagraph}
          onChange={(e) => onChange('journeyParagraph', e.target.value)}
          className={`form-textarea ${validationErrors.journeyParagraph ? 'error' : ''} ${isFieldLoading('journeyParagraph') ? 'loading' : ''}`}
          placeholder="Racontez votre parcours professionnel..."
          rows={4}
        />
        <div className="field-info">
          {(() => {
            const { current, max, isOverLimit } = getCharacterCount(
              aboutData.journeyParagraph, 
              MAX_PARAGRAPH_LENGTH
            );
            return (
              <span className={`character-count ${isOverLimit ? 'over-limit' : ''}`}>
                {current}/{max} caractères
              </span>
            );
          })()}
        </div>
        {validationErrors.journeyParagraph && (
          <span className="error-message">❌ {validationErrors.journeyParagraph}</span>
        )}
      </div>

      {/* 🔥 OBJECTIFS */}
      <div className="form-group">
        <label htmlFor="goalsParagraph" className="form-label">
          <span className="label-icon">🎯</span>
          Mes objectifs
          {isFieldLoading('goalsParagraph') && (
            <span className="field-loading">
              <span className="loading-spinner"></span>
              Sauvegarde...
            </span>
          )}
        </label>
        <textarea
          id="goalsParagraph"
          value={aboutData.goalsParagraph}
          onChange={(e) => onChange('goalsParagraph', e.target.value)}
          className={`form-textarea ${validationErrors.goalsParagraph ? 'error' : ''} ${isFieldLoading('goalsParagraph') ? 'loading' : ''}`}
          placeholder="Quels sont vos objectifs professionnels..."
          rows={4}
        />
        <div className="field-info">
          {(() => {
            const { current, max, isOverLimit } = getCharacterCount(
              aboutData.goalsParagraph, 
              MAX_PARAGRAPH_LENGTH
            );
            return (
              <span className={`character-count ${isOverLimit ? 'over-limit' : ''}`}>
                {current}/{max} caractères
              </span>
            );
          })()}
        </div>
        {validationErrors.goalsParagraph && (
          <span className="error-message">❌ {validationErrors.goalsParagraph}</span>
        )}
      </div>

      {/* 🔥 HOBBIES */}
      <div className="form-group">
        <label className="form-label">
          <span className="label-icon">🎨</span>
          Mes hobbies
          {isFieldLoading('hobbies') && (
            <span className="field-loading">
              <span className="loading-spinner"></span>
              Sauvegarde...
            </span>
          )}
        </label>
        <div className={isFieldLoading('hobbies') ? 'loading' : ''}>
          <HobbiesInput
            hobbies={aboutData.hobbies}
            onHobbiesChange={(hobbies) => onChange('hobbies', hobbies)}
            error={validationErrors.hobbies}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutForm;
