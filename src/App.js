import React, { useState, useCallback, useEffect } from 'react'; 
import P5Canvas from './components/P5Canvas';
import LevelSelect from './components/LevelSelect';
import InitialScreen from './components/InitialScreen'; // <-- IMPORT BARU
import { QUESTIONS } from './data/questions';
import GameScreen from './components/GameScreen';
import './App.css';

function App() {
  // === STATE BARU ===
  const [showInitialScreen, setShowInitialScreen] = useState(true); // <-- STATE UNTUK KONTROL TAMPILAN AWAL
  
  // === STATE LAMA ===
  const [currentLevelKey, setCurrentLevelKey] = useState(null); 
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('Pilih Level'); 
  const [keyInput, setKeyInput] = useState({ left: false, right: false, jump: false }); 
  
  // ... (useEffect untuk Key Listener tetap sama, tidak perlu diubah) ...
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== 'Bermain') return;
      
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault(); 
      }
      
      let updated = false;
      let newState = { ...keyInput };

      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        newState.right = true;
        updated = true;
      } 
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        newState.left = true;
        updated = true;
      } 
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp') {
        newState.jump = true;
        updated = true;
      }

      if (updated) {
        setKeyInput(newState);
      }
    };

    const handleKeyUp = (e) => {
      if (gameStatus !== 'Bermain') return;
      
      let updated = false;
      let newState = { ...keyInput };

      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        newState.right = false;
        updated = true;
      } 
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        newState.left = false;
        updated = true;
      } 
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp') {
        newState.jump = false;
        updated = true;
      }

      if (updated) {
        setKeyInput(newState);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStatus, keyInput]);

  // === HANDLER BARU ===
  const handleStartInitial = () => {
    setShowInitialScreen(false); // Sembunyikan InitialScreen
    // Tidak perlu mengubah gameStatus di sini, karena 'Pilih Level' adalah default setelah InitialScreen.
  };

  const handleSelectLevel = (levelKey) => {
    setCurrentLevelKey(levelKey);
    setScore(0);
    setGameStatus('Bermain');
    setKeyInput({ left: false, right: false, jump: false });
  };

  const handleScoreChange = useCallback((newScore) => {
    setScore(newScore);
  }, []);

  const handleLevelComplete = useCallback((finalScore) => {
    setScore(finalScore);
    setGameStatus('Selesai');
  }, []);

  const handleRestart = () => {
    setCurrentLevelKey(null);
    setScore(0);
    setGameStatus('Pilih Level');
    setKeyInput({ left: false, right: false, jump: false });
  }

  const levelData = currentLevelKey ? QUESTIONS[currentLevelKey] : [];

  // === RENDERING UTAMA ===
  return (
    <div className="App">
      
      {/* 1. TAMPILAN AWAL */}
      {showInitialScreen && (
        <InitialScreen onStartGame={handleStartInitial} />
      )}
      
      {/* 2. KONTEN GAME (Ditampilkan setelah InitialScreen selesai) */}
      {!showInitialScreen && (
        <>
          {/* Header sederhana saat GameScreen aktif (opsional, bisa diganti dengan komponen Header.js) */}
          <h1>🎓 Game Matematika P5.js & React</h1> 
          
          {/* A. BERMAIN */}
          {gameStatus === 'Bermain' && (
            <div className="game-screen">
              <h3>Level: {currentLevelKey ? currentLevelKey.replace('_', ' ') : ''} | Skor: {score}</h3>
              
              <div className="game-container">
                <P5Canvas 
                  levelData={levelData} 
                  onScoreChange={handleScoreChange}
                  onLevelComplete={handleLevelComplete}
                  keyInput={keyInput} 
                />
              </div>
              
              <p className="controls-info">
                Gunakan <strong>Panah Kiri/Kanan (A/D)</strong> untuk bergerak, 
                <strong> Spasi/Enter/Panah Atas</strong> untuk melompat!
              </p>
            </div>
          )}

          {/* B. PILIH LEVEL */}
          {gameStatus === 'Pilih Level' && (
            <LevelSelect onSelectLevel={handleSelectLevel} />
          )}

          {/* C. SELESAI */}
          {gameStatus === 'Selesai' && (
            <div className="completion-screen">
              <h2>🎉 Level Selesai! 🎉</h2>
              <p>Skor Akhir Anda: <strong>{score}</strong></p>
              <button onClick={handleRestart}>
                Main Lagi
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;