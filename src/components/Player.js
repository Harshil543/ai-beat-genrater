import React, { useContext } from 'react';
import { SunoContext } from '../context/SunoContext';
import TrackSelector from './TrackSelector';

const Player = () => {
  const { audioUrl, error, isLoading, taskId, beatType, pollingAttempts, trackList } = useContext(SunoContext);

  const getStatusMessage = () => {
    if (!taskId) {
      return `Initializing ${beatType} beat generation... Please wait`;
    }
    
    if (pollingAttempts <= 1) {
      return `Task created! Waiting for process your ${beatType} beat...`;
    }
    
    return `Checking for beat completion (attempt ${pollingAttempts}/40)...`;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p className="loading">{getStatusMessage()}</p>
        
        {taskId && (
          <div className="task-info">
            <p className="task-id">Task ID: {taskId}</p>
            <p className="task-hint">
              {pollingAttempts <= 1 
                ? "Task has been sent. Waiting for the webhook callback..." 
                : "Polling for task completion. This can take several minutes."}
            </p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min((pollingAttempts / 40) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="callback-hint">
              <small>
                The API will send a callback to our webhook when your beat is ready.
                We're checking every 15 seconds to see if the callback has arrived.
              </small>
            </p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">Error: {error}</p>
        <p className="error-hint">
          {taskId 
            ? "Your task was created but couldn't be completed. The server might be busy, try again later." 
            : "Please check console for more details or try again."}
        </p>
        {taskId && <p className="task-id">Task ID: {taskId}</p>}
      </div>
    );
  }

  if (!audioUrl) return null;

  return (
    <div className="player-container">
      <h3>Generated Beat{trackList.length > 1 ? 's' : ''}:</h3>
      
      <TrackSelector />
      
      <audio controls src={audioUrl} autoPlay>
        Your browser does not support the audio element.
      </audio>
      
      <div className="audio-info">
        <p className="audio-url">
          <small>Audio URL: {audioUrl}</small>
        </p>
        {taskId && <p className="task-id">Task ID: {taskId}</p>}
        <p className="success-note">
          <small>✓ Beat successfully generated</small>
        </p>
      </div>
    </div>
  );
};

export default Player; 