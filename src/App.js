import React, { useState, useEffect } from "react";
import { SunoProvider } from "./context/SunoContext";
import BeatSelector from "./components/BeatSelector";
import GenerateButton from "./components/GenerateButton";
import Player from "./components/Player";
import TaskList from "./components/TaskList";
import "./App.css";

const WEBHOOK_URL =
  process.env.REACT_APP_WEBHOOK_URL ||
  "https://webhook.site/90a58c92-ac97-4e7d-9ae2-9201064a78c9";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

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
              <h1>AI Beat Maker</h1>
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
            <p>Powered by Suno AI</p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="GitHub">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} AI Beat Maker
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
            display: flex;
            flex-wrap: wrap;
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
            max-width: 1440px;
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
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }

          .social-links {
            display: flex;
            gap: 1rem;
          }

          .social-icon {
            color: rgba(255, 255, 255, 0.6);
            transition: color 0.3s ease, transform 0.3s ease;
          }

          .social-icon:hover {
            color: rgba(255, 255, 255, 1);
            transform: translateY(-2px);
          }

          .light-theme .social-icon {
            color: rgba(26, 26, 46, 0.6);
          }

          .light-theme .social-icon:hover {
            color: rgba(26, 26, 46, 1);
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
