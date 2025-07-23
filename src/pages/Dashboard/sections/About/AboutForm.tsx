import React from 'react';
import { AboutFormState, AboutValidationErrors } from './types';
import HobbiesInput from './HobbiesInput';

interface AboutFormProps {
  formData: AboutFormState;
  onChange: (field: keyof AboutFormState, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const AboutForm: React.FC<AboutFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isLoading,
  disabled
}) => {
  const MAX_PARAGRAPH_LENGTH = 500;
  const MAX_JOB_LENGTH = 100;

  const getCharacterCount = (text: string, max: number) => ({
    current: text.length,
    max,
    isOverLimit: text.length > max
  });

  return (
    <form onSubmit={onSubmit} className="about-form">
      {/* Métier actuel */}
      <div className="form-group">
        <label htmlFor="currentJob" className="form-label">
          <span className="label-icon">👔</span>
          Métier actuel
        </label>
        <input
          type="text"
          id="currentJob"
          value={formData.currentJob}
          onChange={(e) => onChange('currentJob', e.target.value)}
          disabled={disabled}
          className={`form-input ${formData.validationErrors.currentJob ? 'error' : ''}`}
          placeholder="Ex: Développeur Full-Stack"
          maxLength={MAX_JOB_LENGTH}
        />
        {formData.validationErrors.currentJob && (
          <span className="error-message">{formData.validationErrors.currentJob}</span>
        )}
      </div>

      {/* Introduction */}
      <div className="form-group">
        <label htmlFor="introductionParagraph" className="form-label">
          <span className="label-icon">📝</span>
          Introduction
        </label>
        <textarea
          id="introductionParagraph"
          value={formData.introductionParagraph}
          onChange={(e) => onChange('introductionParagraph', e.target.value)}
          disabled={disabled}
          className={`form-textarea ${formData.validationErrors.introductionParagraph ? 'error' : ''}`}
          placeholder="Présentez-vous en quelques mots..."
          rows={4}
        />
        <div className="character-count">
          {(() => {
            const { current, max, isOverLimit } = getCharacterCount(
              formData.introductionParagraph, 
              MAX_PARAGRAPH_LENGTH
            );
            return (
              <span className={isOverLimit ? 'over-limit' : ''}>
                {current}/{max} caractères
              </span>
            );
          })()}
        </div>
        {formData.validationErrors.introductionParagraph && (
          <span className="error-message">{formData.validationErrors.introductionParagraph}</span>
        )}
      </div>

      {/* Parcours */}
      <div className="form-group">
        <label htmlFor="journeyParagraph" className="form-label">
          <span className="label-icon">📝</span>
          Parcours
        </label>
        <textarea
          id="journeyParagraph"
          value={formData.journeyParagraph}
          onChange={(e) => onChange('journeyParagraph', e.target.value)}
          disabled={disabled}
          className={`form-textarea ${formData.validationErrors.journeyParagraph ? 'error' : ''}`}
          placeholder="Décrivez votre parcours professionnel..."
          rows={4}
        />
        <div className="character-count">
          {(() => {
            const { current, max, isOverLimit } = getCharacterCount(
              formData.journeyParagraph, 
              MAX_PARAGRAPH_LENGTH
            );
            return (
              <span className={isOverLimit ? 'over-limit' : ''}>
                {current}/{max} caractères
              </span>
            );
          })()}
        </div>
        {formData.validationErrors.journeyParagraph && (
          <span className="error-message">{formData.validationErrors.journeyParagraph}</span>
        )}
      </div>

      {/* Objectifs */}
      <div className="form-group">
        <label htmlFor="goalsParagraph" className="form-label">
          <span className="label-icon">📝</span>
          Objectifs
        </label>
        <textarea
          id="goalsParagraph"
          value={formData.goalsParagraph}
          onChange={(e) => onChange('goalsParagraph', e.target.value)}
          disabled={disabled}
          className={`form-textarea ${formData.validationErrors.goalsParagraph ? 'error' : ''}`}
          placeholder="Quels sont vos objectifs professionnels..."
          rows={4}
        />
        <div className="character-count">
          {(() => {
            const { current, max, isOverLimit } = getCharacterCount(
              formData.goalsParagraph, 
              MAX_PARAGRAPH_LENGTH
            );
            return (
              <span className={isOverLimit ? 'over-limit' : ''}>
                {current}/{max} caractères
              </span>
            );
          })()}
        </div>
        {formData.validationErrors.goalsParagraph && (
          <span className="error-message">{formData.validationErrors.goalsParagraph}</span>
        )}
      </div>

      {/* Hobbies */}
      <div className="form-group">
        <label className="form-label">
          <span className="label-icon">🎯</span>
          Hobbies
        </label>
        <HobbiesInput
          hobbies={formData.hobbies}
          onHobbiesChange={(hobbies) => onChange('hobbies', hobbies)}
          error={formData.validationErrors.hobbies}
          disabled={disabled}
        />
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="cancel-btn"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading || !formData.isModified}
          className="save-btn"
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Sauvegarde...
            </>
          ) : (
            <>
              💾 Sauvegarder
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AboutForm;
