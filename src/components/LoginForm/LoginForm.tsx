import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // ← AJOUTER
import './LoginForm.scss';

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 🔐 HOOKS
  const { login } = useAuth();
  const navigate = useNavigate(); // ← AJOUTER

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 TENTATIVE LOGIN:', formData);
    
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      console.log('✅ LOGIN RÉUSSI');
      onClose(); // Fermer la modal
      console.log('🚀 REDIRECTION VERS /dashboard'); // ← AJOUTER LOG
      navigate('/dashboard'); // ← AJOUTER REDIRECTION
    } catch (error) {
      console.error('❌ ERREUR LOGIN:', error);
      setError('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="login-form" onKeyDown={handleKeyDown}>
      
      {/* Header */}
      <div className="login-form__header">
        <div className="login-form__icon">🚀</div>
        <h2 className="login-form__title">Connexion Admin</h2>
        <p className="login-form__subtitle">
          Accédez à votre espace de gestion
        </p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="login-form__error">
          <span className="login-form__error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="login-form__form">
        
        {/* Email */}
        <div className={`login-form__field ${focusedField === 'email' ? 'login-form__field--focused' : ''}`}>
          <label htmlFor="email" className="login-form__label">
            Email
          </label>
          <div className="login-form__input-wrapper">
            <span className="login-form__input-icon">📧</span>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="login-form__input"
              placeholder="votre@email.com"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div className={`login-form__field ${focusedField === 'password' ? 'login-form__field--focused' : ''}`}>
          <label htmlFor="password" className="login-form__label">
            Mot de passe
          </label>
          <div className="login-form__input-wrapper">
            <span className="login-form__input-icon">🔐</span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="login-form__input"
              placeholder="••••••••"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="login-form__toggle-password"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              disabled={isLoading}
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="login-form__actions">
          <button
            type="button"
            onClick={onClose}
            className="login-form__button login-form__button--secondary"
            disabled={isLoading}
          >
            Annuler
          </button>
          
          <button
            type="submit"
            className="login-form__button login-form__button--primary"
            disabled={isLoading || !formData.email || !formData.password}
          >
            {isLoading ? (
              <>
                <span className="login-form__spinner"></span>
                Connexion...
              </>
            ) : (
              <>
                <span className="login-form__button-icon">⚡</span>
                Se connecter
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="login-form__footer">
        <p>
          Why so serious ! 🃏
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
