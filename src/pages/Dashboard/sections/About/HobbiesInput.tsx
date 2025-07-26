import React, { useState } from 'react';

interface HobbiesInputProps {
  hobbies: string[];
  onHobbiesChange: (hobbies: string[]) => void;
  error?: string;
}

const HobbiesInput: React.FC<HobbiesInputProps> = ({
  hobbies,
  onHobbiesChange,
  error
}) => {
  const [inputValue, setInputValue] = useState('');

  const addHobby = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !hobbies.includes(trimmedValue)) {
      onHobbiesChange([...hobbies, trimmedValue]);
      setInputValue('');
    }
  };

  const removeHobby = (hobbyToRemove: string) => {
    onHobbiesChange(hobbies.filter(hobby => hobby !== hobbyToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHobby();
    }
  };

  return (
    <div className="hobbies-input">
      {/* 🔥 TAGS HOBBIES */}
      <div className="hobbies-tags">
        {hobbies.map((hobby, index) => (
          <span key={index} className="hobby-tag">
            {hobby}
            <button
              type="button"
              className="remove-hobby"
              onClick={() => removeHobby(hobby)}
              aria-label={`Supprimer ${hobby}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* 🔥 INPUT AJOUT */}
      <div className="hobby-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tapez un hobby et appuyez sur Entrée"
          className="hobby-input"
          maxLength={50}
        />
        <button
          type="button"
          className="add-hobby-btn"
          onClick={addHobby}
          disabled={!inputValue.trim()}
        >
          + Ajouter
        </button>
      </div>

      {error && (
        <span className="error-message">❌ {error}</span>
      )}
      
      <div className="hobbies-info">
        💡 Conseil: Ajoutez vos passions pour personnaliser votre profil
      </div>
    </div>
  );
};

export default HobbiesInput;
