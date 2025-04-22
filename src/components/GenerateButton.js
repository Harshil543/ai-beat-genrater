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
            <span className="loading-text">Creating {beatType} beat...</span>
            <span className="loading-dots"></span>
          </>
        ) : 'Generate Beat'}
      </button>
      {!isLoading && (
        <p className="generate-hint">
          Click to create a new {beatType} beat with Nexa AI
        </p>
      )}
      
      <style jsx>{`
        .generate-button-container {
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Jost', sans-serif;
        }
        
        .generate-button {
          min-width: 200px;
          position: relative;
          background: linear-gradient(45deg, #4361ee, #7209b7);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 30px;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(67, 97, 238, 0.4);
          font-family: 'Jost', sans-serif;
          letter-spacing: 0.02em;
        }
        
        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(67, 97, 238, 0.5);
        }
        
        .generate-button:active:not(:disabled) {
          transform: translateY(1px);
          box-shadow: 0 2px 10px rgba(67, 97, 238, 0.4);
        }
        
        .generate-button.loading {
          background: linear-gradient(45deg, #4a5568, #2d3748);
          color: #edf2f7;
          cursor: not-allowed;
        }
        
        .loading-text {
          display: inline-block;
        }
        
        .loading-dots:after {
          content: '';
          animation: dots 1.5s infinite;
        }
        
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
        
        .generate-hint {
          margin-top: 12px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
          max-width: 320px;
          font-weight: 300;
          letter-spacing: 0.015em;
        }
      `}</style>
    </div>
  );
};

export default GenerateButton; 