import React, { useState, useEffect } from "react";
import { SunoProvider } from "./context/SunoContext";
import BeatSelector from "./components/BeatSelector";
import GenerateButton from "./components/GenerateButton";
import Player from "./components/Player";
import TaskList from "./components/TaskList";
import "./App.css";

const App = () => {
  const [theme, setTheme] = useState("dark");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mount
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <SunoProvider>
      <div className={`app ${theme}-theme ${isLoaded ? "loaded" : ""}`}>
        <div className="app-background">
          <div className="gradient-circle gradient-circle-1" />
          <div className="gradient-circle gradient-circle-2" />
          <div className="gradient-circle gradient-circle-3" />
          <div className="grid-overlay" />
        </div>

        <header className="app-header">
          <div className="header-content">
            <div className="logo-container">
              <div className="logo-icon">
                <span className="wave-icon">♫</span>
                <div className="pulse-effect" />
              </div>
              <h1>Nexa Beat Mastering Tool</h1>
            </div>

            <div className="app-controls">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>
          </div>

          <div className="app-tagline">
            <span>Create stunning beats with artificial intelligence</span>
          </div>
        </header>

        <main className="app-main">
          <div className="content-container">
            <div className="app-sections">
              <div className="generation-section">
                <div className="section-header">
                  <h2>Create New Beat</h2>
                  <div className="section-divider" />
                </div>
                <div className="generation-controls">
                  <BeatSelector />
                  <GenerateButton />
                </div>
                <Player />
              </div>

              <div className="saved-section">
                <div className="section-header">
                  <h2>Your Beats</h2>
                  <div className="section-divider" />
                </div>
                <TaskList />
              </div>
            </div>
          </div>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>Nexa Beat Mastering Tool</p>
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} Nexa Beat
          </div>
        </footer>

        <style jsx>{`
          .app {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            color: white;
            background: #0f0f1a;
            transition: background 0.5s ease, color 0.5s ease;
          }

          .light-theme {
            background: #f0f4f8;
            color: #1a1a2e;
          }

          .app-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            overflow: hidden;
          }

          .gradient-circle {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.4;
            transition: all 0.8s ease;
          }

          .loaded .gradient-circle {
            opacity: 0.4;
            transform: scale(1);
          }

          .gradient-circle-1 {
            background: linear-gradient(45deg, #4361ee, #3a0ca3);
            width: 50vw;
            height: 50vw;
            top: -15vw;
            left: -10vw;
            transform: scale(0.9);
            opacity: 0;
            transition-delay: 0.1s;
          }

          .gradient-circle-2 {
            background: linear-gradient(45deg, #7209b7, #f72585);
            width: 60vw;
            height: 60vw;
            bottom: -30vw;
            right: -20vw;
            transform: scale(0.9);
            opacity: 0;
            transition-delay: 0.2s;
          }

          .gradient-circle-3 {
            background: linear-gradient(45deg, #4895ef, #4cc9f0);
            width: 40vw;
            height: 40vw;
            top: 30vh;
            left: 20vw;
            opacity: 0;
            transform: scale(0.9);
            transition-delay: 0.3s;
          }

          .light-theme .gradient-circle-1 {
            background: linear-gradient(45deg, #3f87ff, #8a63d2);
            opacity: 0.2;
          }

          .light-theme .gradient-circle-2 {
            background: linear-gradient(45deg, #b249db, #ff79c6);
            opacity: 0.2;
          }

          .light-theme .gradient-circle-3 {
            background: linear-gradient(45deg, #69b5ff, #98e2f0);
            opacity: 0.15;
          }

          .grid-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: linear-gradient(
                rgba(255, 255, 255, 0.03) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.03) 1px,
                transparent 1px
              );
            background-size: 20px 20px;
            z-index: 1;
          }

          .light-theme .grid-overlay {
            background-image: linear-gradient(
                rgba(0, 0, 0, 0.05) 1px,
                transparent 1px
              ),
              linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          }

          .app-header {
            position: relative;
            z-index: 1;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.8s ease, opacity 0.8s ease;
          }

          .loaded .app-header {
            transform: translateY(0);
            opacity: 1;
          }

          .header-content {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .logo-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(45deg, #4361ee, #7209b7);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
            position: relative;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .logo-icon:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
          }

          .pulse-effect {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 12px;
            animation: pulse 2s infinite;
            background: linear-gradient(45deg, #4361ee, #7209b7);
            opacity: 0;
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.2);
              opacity: 0;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }

          .wave-icon {
            font-size: 28px;
            color: white;
            z-index: 1;
          }

          .app-controls {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .theme-toggle {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
          }

          .theme-toggle:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(15deg);
          }

          .light-theme .theme-toggle {
            color: #1a1a2e;
            background: rgba(0, 0, 0, 0.05);
          }

          .light-theme .theme-toggle:hover {
            background: rgba(0, 0, 0, 0.1);
          }

          .app-header h1 {
            font-size: 2.4rem;
            font-weight: 800;
            margin: 0;
            background: linear-gradient(45deg, #4cc9f0, #f72585);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            position: relative;
          }

          .light-theme .app-header h1 {
            background: linear-gradient(45deg, #3a0ca3, #f72585);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .app-tagline {
            font-size: 1.2rem;
            font-weight: 300;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            position: relative;
            display: inline-block;
          }

          .light-theme .app-tagline {
            color: rgba(26, 26, 46, 0.7);
          }

          .app-tagline span {
            display: inline-block;
            overflow: hidden;
            position: relative;
          }

          .app-tagline span::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(
              90deg,
              transparent,
              #4cc9f0,
              transparent
            );
            transform: scaleX(0);
            transition: transform 0.8s ease-in-out;
            transform-origin: left;
          }

          .loaded .app-tagline span::after {
            transform: scaleX(1);
          }

          .app-main {
            flex: 1;
            position: relative;
            z-index: 1;
            padding: 0 1rem 2rem;
            transform: translateY(40px);
            opacity: 0;
            transition: transform 1s ease, opacity 1s ease;
            transition-delay: 0.3s;
          }

          .loaded .app-main {
            transform: translateY(0);
            opacity: 1;
          }

          .content-container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(20, 20, 35, 0.7);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: background 0.5s ease, box-shadow 0.5s ease,
              border 0.5s ease;
          }

          .light-theme .content-container {
            background: rgba(255, 255, 255, 0.8);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(0, 0, 0, 0.05);
          }

          .app-sections {
            display: flex;
            flex-direction: column;
          }

          @media (min-width: 992px) {
            .app-sections {
              flex-direction: row;
            }

            .generation-section {
              flex: 3;
              border-right: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .light-theme .generation-section {
              border-right: 1px solid rgba(0, 0, 0, 0.05);
            }
            
            .saved-section {
              flex: 2;
            }
          }

          .generation-section,
          .saved-section {
            padding: 2rem;
          }

          .section-header {
            margin-bottom: 1.5rem;
            position: relative;
          }

          .section-header h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0 0 0.5rem;
            color: white;
            transition: color 0.5s ease;
          }

          .light-theme .section-header h2 {
            color: #1a1a2e;
          }

          .section-divider {
            height: 3px;
            width: 60px;
            background: linear-gradient(90deg, #4361ee, #4cc9f0);
            border-radius: 3px;
            position: relative;
            overflow: hidden;
          }

          .section-divider::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.8),
              transparent
            );
            transform: translateX(-100%);
            animation: shine 3s infinite;
          }

          @keyframes shine {
            0% {
              transform: translateX(-100%);
            }
            20% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .generation-controls {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .app-footer {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 1.5rem;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.8s ease, opacity 0.8s ease, color 0.5s ease;
            transition-delay: 0.5s;
          }

          .loaded .app-footer {
            transform: translateY(0);
            opacity: 1;
          }

          .light-theme .app-footer {
            color: rgba(26, 26, 46, 0.6);
          }

          .footer-content {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1rem;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }
          
          .copyright {
            margin-top: 1rem;
            opacity: 0.7;
            font-size: 0.8rem;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .app-header h1 {
              font-size: 2rem;
            }

            .app-tagline {
              font-size: 1rem;
            }

            .footer-content {
              flex-direction: column;
              gap: 1rem;
            }
          }

          @media (max-width: 480px) {
            .header-content {
              flex-direction: column;
              gap: 1rem;
            }

            .app-controls {
              margin-top: 1rem;
            }
          }
        `}</style>
      </div>
    </SunoProvider>
  );
};

export default App;
