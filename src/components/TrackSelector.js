import React, { useContext } from 'react';
import { SunoContext } from '../context/SunoContext';

const TrackSelector = () => {
  const { trackList, selectedTrack, selectTrack } = useContext(SunoContext);

  if (!trackList || trackList.length <= 1) {
    return null; // Don't show if there's only one track
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="track-selector">
      <div className="track-selector-title">
        Select Version ({selectedTrack + 1}/{trackList.length}):
      </div>
      <div className="track-options">
        {trackList.map((track, index) => (
          <button
            key={track.id}
            className={`track-option ${index === selectedTrack ? 'selected' : ''}`}
            onClick={() => selectTrack(index)}
          >
            Version {index + 1}
            <span className="track-duration">{formatDuration(track.duration)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrackSelector; 