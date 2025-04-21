import React, { useContext, useState, useRef, useEffect } from 'react';
import { SunoContext } from '../context/SunoContext';

const TaskList = () => {
  const { allTasks, loadingTasks, fetchAllTasks, loadTask } = useContext(SunoContext);
  const [playingId, setPlayingId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const audioRef = useRef(null);
  const [viewType, setViewType] = useState('list'); // 'list' or 'grid'

  useEffect(() => {
    // Load font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Clean up
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleRefresh = () => {
    fetchAllTasks();
  };

  const handleLoadTask = (taskId) => {
    loadTask(taskId);
  };

  const togglePlay = (e, task) => {
    e.stopPropagation(); // Prevent triggering the parent onClick (loadTask)
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (playingId === task.id) {
      setPlayingId(null);
    } else {
      setPlayingId(task.id);
      const audio = new Audio(task.audio_url);
      audioRef.current = audio;
      audio.play();
      
      audio.addEventListener('ended', () => {
        setPlayingId(null);
      });
    }
  };

  const renderWaveform = (isPlaying) => {
    return (
      <div className={`waveform ${isPlaying ? 'playing' : ''}`}>
        {[...Array(16)].map((_, i) => (
          <div key={i} className="waveform-bar" style={{
            height: `${Math.random() * 25 + 5}px`,
            animationDelay: `${i * 0.05}s`
          }}></div>
        ))}
      </div>
    );
  };

  if (loadingTasks) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading your beats...</p>
      </div>
    );
  }

  if (!allTasks || allTasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">🎵</div>
        <p>No beats found in your library</p>
        <button className="refresh-button" onClick={handleRefresh}>
          Refresh Library
        </button>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <div className="header-left">
          <h3>Your Beat Library</h3>
          <span className="beat-count">{allTasks.length} beats</span>
        </div>
        
        <div className="header-right">
          <div className="view-toggle">
            <button 
              className={`view-button ${viewType === 'list' ? 'active' : ''}`} 
              onClick={() => setViewType('list')}
              aria-label="List View"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z"/>
              </svg>
            </button>
            <button 
              className={`view-button ${viewType === 'grid' ? 'active' : ''}`} 
              onClick={() => setViewType('grid')}
              aria-label="Grid View"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zm0 10h8v8h-8v-8zM3 13h8v8H3v-8z"/>
              </svg>
            </button>
          </div>
          <button className="refresh-button" onClick={handleRefresh}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"/>
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      {viewType === 'list' ? (
        <div className="track-list">
          {allTasks.map((task) => (
            <div 
              key={task.id || task.taskId} 
              className={`track-item ${playingId === task.id ? 'playing' : ''} ${hoveredId === task.id ? 'hovered' : ''}`}
              onClick={(e) => togglePlay(e, task)}
              onMouseEnter={() => setHoveredId(task.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="track-number-play">
                {playingId === task.id ? (
                  <button 
                    className="play-pause-button" 
                    onClick={(e) => togglePlay(e, task)}
                    aria-label="Pause"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                    </button>
                ) : hoveredId === task.id ? (
                  <button 
                    className="play-pause-button" 
                    aria-label="Play"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                ) : (
                  <span className="track-number">{allTasks.indexOf(task) + 1}</span>
                )}
              </div>
              
              <div className="track-image">
                {task.image_url ? (
                  <img src={task.image_url} alt={task.title} />
                ) : (
                  <div className="default-image">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="track-info">
                <div className="track-title">{task.title}</div>
                <div className="track-artist">{task.model_name || "AI Generated"}</div>
              </div>
              
              <div className="track-tags">
                <span className="tag">{task.tags || task.type || "Beat"}</span>
              </div>
              
              <div className="track-visualizer">
                {playingId === task.id ? renderWaveform(true) : (
                  <div className="track-duration">{formatDuration(task.duration || 0)}</div>
                )}
              </div>
              
              <div className="track-actions">
                <button 
                  className="load-button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadTask(task.task_id || task.taskId);
                  }}
                  aria-label="Load Beat"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="track-grid">
          {allTasks.map((task) => (
            <div 
              key={task.id || task.taskId} 
              onClick={(e) => togglePlay(e, task)}
              className={`grid-item ${playingId === task.id ? 'playing' : ''}`}
              >
              <div className="grid-item-artwork">
                {task.image_url ? (
                  <img src={task.image_url} alt={task.title} />
                ) : (
                  <div className="default-grid-image">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                  </div>
                )}
                <div className="grid-item-overlay">
                  <button 
                    className="grid-play-button" 
                    onClick={(e) => togglePlay(e, task)}
                    aria-label={playingId === task.id ? "Pause" : "Play"}
                  >
                    {playingId === task.id ? (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="grid-item-info">
                <div className="grid-item-title">{task.title}</div>
                <div className="grid-item-meta">
                  <span>{formatDuration(task.duration || 0)}</span>
                  {task.tags && <span className="grid-tag">{task.tags}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        /* Base Styles with Jost Font */
        .task-list-container,
        .task-list-loading,
        .task-list-empty,
        button {
          font-family: 'Jost', sans-serif;
        }
        
        .task-list-container {
          background: rgba(18, 18, 18, 0.8);
          border-radius: 12px;
          padding: 24px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        /* Header Styles */
        .task-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .header-left {
          display: flex;
          flex-direction: column;
        }
        
        .header-left h3 {
          margin: 0 0 4px 0;
          color: #fff;
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        
        .beat-count {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          font-weight: 400;
        }
        
        .header-right {
          display: flex;
          align-items: center;
         }
        
        .view-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 3px;
        }
        
        .view-button {
          background: none;
          border: none;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.6);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .view-button.active {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        
        .view-button:hover:not(.active) {
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
        }
        
        .refresh-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(30, 215, 96, 0.8);
          color: #000;
          font-weight: 500;
          border: none;
          border-radius: 24px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(30, 215, 96, 0.3);
        }
        
        .refresh-button:hover {
          background: rgba(30, 215, 96, 1);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(30, 215, 96, 0.4);
        }
        
        /* List View Styles */
        .track-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .track-item {
          display: grid;
          grid-template-columns: 36px 48px 3fr 1fr 80px 36px;
          align-items: center;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        
        .track-item:hover, .track-item.hovered {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .track-item.playing {
          background: rgba(30, 215, 96, 0.1);
          border: 1px solid rgba(30, 215, 96, 0.2);
        }
        
        .track-number-play {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
        }
        
        .track-number {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
        }
        
        .play-pause-button {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
          padding: 0;
        }
        
        .play-pause-button:hover {
          transform: scale(1.1);
          color: rgba(30, 215, 96, 1);
        }
        
        .track-image {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;
          background: #333;
        }
        
        .track-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .default-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2D46B9, #509BF5);
          color: rgba(255, 255, 255, 0.8);
        }
        
        .track-info {
          overflow: hidden;
        }
        
        .track-title {
          font-weight: 500;
          margin-bottom: 4px;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .track-artist {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .track-tags {
          display: flex;
          gap: 8px;
        }
        
        .tag {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 4px 10px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        
        .track-visualizer {
          display: flex;
          align-items: center;
          height: 30px;
        }
        
        .track-duration {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
        }
        
        .waveform {
          display: flex;
          align-items: center;
          gap: 2px;
          height: 30px;
        }
        
        .waveform-bar {
          width: 3px;
          background: rgba(30, 215, 96, 0.7);
          border-radius: 1px;
        }
        
        .waveform.playing .waveform-bar {
          animation: sound 0.5s ease infinite alternate;
        }
        
        @keyframes sound {
          0% { height: 5px; }
          100% { height: 100%; }
        }
        
        .track-actions {
          display: flex;
          justify-content: center;
        }
        
        .load-button {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.2s;
        }
        
        .track-item:hover .load-button {
          opacity: 1;
        }
        
        .load-button:hover {
          color: #fff;
          transform: translateY(-1px);
        }
        
        /* Grid View Styles */
        .track-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 24px;
          padding: 8px 0;
        }
        
        .grid-item {
          background: rgba(24, 24, 24, 0.8);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
        
        .grid-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        
        .grid-item.playing {
          box-shadow: 0 0 0 2px rgba(30, 215, 96, 0.8), 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        
        .grid-item-artwork {
          aspect-ratio: 1;
          position: relative;
          overflow: hidden;
        }
        
        .grid-item-artwork img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .grid-item:hover .grid-item-artwork img {
          transform: scale(1.05);
        }
        
        .default-grid-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2D46B9, #509BF5);
          color: rgba(255, 255, 255, 0.8);
        }
        
        .grid-item-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .grid-item:hover .grid-item-overlay,
        .grid-item.playing .grid-item-overlay {
          opacity: 1;
        }
        
        .grid-play-button {
          background: rgba(30, 215, 96, 0.9);
          border: none;
          color: #000;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        
        .grid-play-button:hover {
          transform: scale(1.1);
          background: rgba(30, 215, 96, 1);
        }
        
        .grid-item-info {
          padding: 16px;
        }
        
        .grid-item-title {
          font-weight: 500;
          margin-bottom: 8px;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .grid-item-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .grid-tag {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 2px 8px;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        /* Loading State */
        .task-list-loading {
          padding: 40px;
          text-align: center;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          font-family: 'Jost', sans-serif;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(30, 215, 96, 0.3);
          border-radius: 50%;
          border-top-color: rgba(30, 215, 96, 1);
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Empty State */
        .task-list-empty {
          padding: 40px;
          text-align: center;
          font-family: 'Jost', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
          opacity: 0.7;
        }
        
        .task-list-empty p {
          margin-bottom: 20px;
          font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
          .track-item {
            grid-template-columns: 36px 48px 1fr 80px;
          }
          
          .track-tags, .track-actions {
            display: none;
          }
          
          .track-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default TaskList; 