import React, { useState, useCallback } from 'react';
import P5Canvas from './components/P5Canvas';
import InitialScreen from './components/InitialScreen';
import { QUESTIONS } from './data/questions';
import './App.css';

function App() {
  // Level yang dipilih
  const [currentLevelKey, setCurrentLevelKey] = useState(null);

  // Skor pemain
  const [score, setScore] = useState(0);

  // Status game: Initial | Bermain | Menang | Kalah | Loading
  const [gameStatus, setGameStatus] = useState('Initial');

  // Start game + pilih level
  const handleStartGameAndSelectLevel = (levelKey) => {
    setCurrentLevelKey(levelKey);
    setScore(0);
    setGameStatus('Bermain');
  };

  // Perubahan skor
  const handleScoreChange = useCallback((newScore) => {
    setScore(newScore);
  }, []);

  // Level selesai
  const handleLevelComplete = useCallback((finalScore) => {
    setScore(finalScore);
    setGameStatus('Menang');
  }, []);

  // Game Over
  const handleGameOver = useCallback((finalScore) => {
    setScore(finalScore);
    setGameStatus('Kalah');
  }, []);

  // Kembali ke menu utama
  const handleRestart = () => {
    setCurrentLevelKey(null);
    setScore(0);
    setGameStatus('Initial');
  };

  // Retry level (reload P5Canvas)
  const handleRetry = () => {
    setGameStatus('Loading');
    setTimeout(() => {
      setScore(0);
      setGameStatus('Bermain');
    }, 100);
  };

  // Ambil data level
  const levelData = currentLevelKey ? QUESTIONS[currentLevelKey] : [];

  return (
    <div className="App">

      {/* -------------------- 1. LAYAR AWAL / PILIH LEVEL -------------------- */}
      {gameStatus === 'Initial' && (
        <InitialScreen onSelectLevel={handleStartGameAndSelectLevel} />
      )}

      {/* -------------------- 2. LAYAR BERMAIN -------------------- */}
      {gameStatus === 'Bermain' && (
        <div className="game-screen">
          <div className="game-container">
            <P5Canvas
              levelData={levelData}
              onScoreChange={handleScoreChange}
              onLevelComplete={handleLevelComplete}
              onLifeLoss={handleGameOver} // mengikuti GameEngine Anda
            />
          </div>
        </div>
      )}

      {/* -------------------- 3. LAYAR MENANG -------------------- */}
      {gameStatus === 'Menang' && (
        <div className="completion-screen win">
          <h2>🎉 Level Selesai! 🎉</h2>
          <p>Hebat! Kamu menyelesaikan semua soal.</p>
          <div className="final-score">Skor Akhir: {score}</div>
          <button onClick={handleRestart} className="btn-primary">
            Menu Utama
          </button>
        </div>
      )}

      {/* -------------------- 4. LAYAR KALAH -------------------- */}
      {gameStatus === 'Kalah' && (
        <div className="completion-screen lose">
          <h2>💀 Game Over 💀</h2>
          <p>Nyawa kamu habis! Jangan menyerah.</p>
          <div className="final-score">Skor Akhir: {score}</div>
          <div className="button-group">
            <button onClick={handleRetry} className="btn-secondary">
              Coba Lagi
            </button>
            <button onClick={handleRestart} className="btn-primary">
              Menu Utama
            </button>
          </div>
        </div>
      )}

      {/* -------------------- 5. LAYAR LOADING -------------------- */}
      {gameStatus === 'Loading' && (
        <div className="loading-screen">
          <p>Memuat ulang level...</p>
        </div>
      )}
    </div>
  );
}

export default App;
