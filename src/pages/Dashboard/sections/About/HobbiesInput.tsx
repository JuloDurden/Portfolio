import React, { useState } from 'react';

interface HobbiesInputProps {
  hobbies: string[];
  onHobbiesChange: (hobbies: string[]) => void;
  error?: string;
  disabled?: boolean;
}

const HobbiesInput: React.FC<HobbiesInputProps> = ({
  hobbies,
  onHobbiesChange,
  error,
  disabled = false
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
      <div className="hobbies-tags">
        {hobbies.map((hobby, index) => (
          <span key={index} className="hobby-tag">
            {hobby}
            {!disabled && (
              <button
                type="button"
                className="remove-hobby"
                onClick={() => removeHobby(hobby)}
                aria-label={`Supprimer ${hobby}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>

      {!disabled && (
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
      )}

      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default HobbiesInput;
