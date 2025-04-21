import React, { useContext, useState } from 'react';
import { SunoContext } from '../context/SunoContext';

const BeatSelector = () => {
  const { beatType, setBeatType } = useContext(SunoContext);
  const [showDescription, setShowDescription] = useState(true);
  
  const beatOptions = [
    { value: 'hip-hop', label: 'Hip-Hop', description: 'Rhythmic beats with heavy bass and occasional samples' },
    { value: 'trap', label: 'Trap', description: 'Heavy 808 bass, rapid hi-hats, and dark atmospheric sounds' },
    { value: 'lo-fi', label: 'Lo-Fi', description: 'Mellow, relaxed beats with a vintage feel and warm textures' },
    { value: 'electronic', label: 'Electronic', description: 'Synthesized sounds with digital production and precise rhythms' },
    { value: 'pop', label: 'Pop', description: 'Catchy, upbeat instrumentals with modern production' },
    { value: 'rock', label: 'Rock', description: 'Guitar-driven beats with energetic drums and powerful sound' },
    { value: 'jazz', label: 'Jazz', description: 'Smooth, improvisational feel with complex harmonies' },
    { value: 'ambient', label: 'Ambient', description: 'Atmospheric, spacious sounds that create a mood' },
    { value: 'dance', label: 'Dance', description: 'Energetic beats designed for movement with steady rhythms' }
  ];
  
  // Find the current beat description
  const currentBeatOption = beatOptions.find(option => option.value === beatType);

  return (
    <div className="beat-selector-container">
      <div className="beat-selector">
        <label htmlFor="beatType">Select Beat Type:</label>
        <select
          id="beatType"
          value={beatType}
          onChange={(e) => setBeatType(e.target.value)}
          className="beat-select"
        >
          {beatOptions.map((beat) => (
            <option key={beat.value} value={beat.value}>
              {beat.label}
            </option>
          ))}
        </select>
        <button 
          className="info-toggle-button" 
          onClick={() => setShowDescription(!showDescription)}
          title={showDescription ? "Hide description" : "Show description"}
        >
          {showDescription ? "−" : "+"}
        </button>
      </div>
      
      {showDescription && currentBeatOption && (
        <div className="beat-description">
          <p>{currentBeatOption.description}</p>
        </div>
      )}
    </div>
  );
};

export default BeatSelector; 