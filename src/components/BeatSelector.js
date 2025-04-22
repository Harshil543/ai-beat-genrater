import React, { useContext, useState, useEffect } from 'react';
import { SunoContext } from '../context/SunoContext';

const BeatSelector = () => {
  const { beatType, setBeatType } = useContext(SunoContext);
  const [showDescription, setShowDescription] = useState(true);
  
  useEffect(() => {
    // Load font if not already loaded
    if (!document.getElementById('jost-font')) {
      const link = document.createElement('link');
      link.id = 'jost-font';
      link.href = 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);
  
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
        <label htmlFor="beatType">Select Style:</label>
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

      <style jsx>{`
        .beat-selector-container {
          margin: 20px 0;
          width: 100%;
          font-family: 'Jost', sans-serif;
        }
        
        .beat-selector {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .beat-selector label {
          font-weight: 500;
          margin-right: 15px;
          color: #fff;
        }
        
        .beat-description {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 12px 15px;
          margin: 5px 0 15px;
          max-width: 100%;
          border-left: 3px solid rgba(67, 97, 238, 0.7);
        }
        
        .beat-description p {
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
          font-weight: 300;
        }
        
        .info-toggle-button {
          width: 30px;
          height: 30px;
          min-width: 30px;
          background-color: rgba(67, 97, 238, 0.2);
          color: #fff;
          border: 1px solid rgba(67, 97, 238, 0.3);
          border-radius: 50%;
          font-size: 16px;
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .info-toggle-button:hover {
          background-color: rgba(67, 97, 238, 0.4);
          transform: translateY(-2px);
        }
        
        .beat-select {
          padding: 12px 16px;
          border-radius: 8px;
          background-color: rgba(30, 30, 50, 0.6);
          color: white;
          border: 1px solid rgba(67, 97, 238, 0.3);
          font-size: 0.95rem;
          min-width: 220px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Jost', sans-serif;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 40px;
        }
        
        .beat-select:hover {
          border-color: rgba(67, 97, 238, 0.7);
          box-shadow: 0 0 10px rgba(67, 97, 238, 0.3);
        }
        
        .beat-select:focus {
          outline: none;
          border-color: rgba(67, 97, 238, 0.8);
          box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
        }
      `}</style>
    </div>
  );
};

export default BeatSelector; 