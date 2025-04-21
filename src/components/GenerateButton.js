import React, { useContext } from 'react';
import { SunoContext } from '../context/SunoContext';

const GenerateButton = () => {
  const { generateBeat, isLoading, beatType } = useContext(SunoContext);

  return (
    <div className="generate-button-container">
      <button 
        onClick={generateBeat} 
        disabled={isLoading}
        className={`generate-button ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? (
          <>
            <span className="loading-text">Generating {beatType} beat...</span>
            <span className="loading-dots"></span>
          </>
        ) : 'Generate Beat'}
      </button>
      {!isLoading && (
        <p className="generate-hint">
          Click to generate a new {beatType} beat using Suno API
        </p>
      )}
    </div>
  );
};

export default GenerateButton; 