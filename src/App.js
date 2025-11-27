import React, { useState, useCallback } from 'react'; 
import P5Canvas from './components/P5Canvas';
import LevelSelect from './components/LevelSelect';
import InitialScreen from './components/InitialScreen'; 
import { QUESTIONS } from './data/questions';
import './App.css';

function App() {
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  const [currentLevelKey, setCurrentLevelKey] = useState(null); 
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('Pilih Level'); // 'Pilih Level', 'Bermain', 'Menang', 'Kalah'

  const handleStartInitial = () => setShowInitialScreen(false);

  const handleSelectLevel = (levelKey) => {
    setCurrentLevelKey(levelKey);
    setScore(0);
    setGameStatus('Bermain');
  };

  const handleScoreChange = useCallback((newScore) => setScore(newScore), []);
  
  const handleLevelComplete = useCallback((finalScore) => {
    setScore(finalScore);
    setGameStatus('Menang');
  }, []);

  const handleGameOver = useCallback((finalScore) => {
    setScore(finalScore);
    setGameStatus('Kalah');
  }, []);

  const handleRestart = () => {
    setCurrentLevelKey(null);
    setScore(0);
    setGameStatus('Pilih Level');
  }

  const handleRetry = () => {
    // Trik simple: set status null sebentar lalu 'Bermain' lagi untuk re-mount P5Canvas
    setGameStatus('Loading');
    setTimeout(() => {
        setScore(0);
        setGameStatus('Bermain');
    }, 100);
  }

  const levelData = currentLevelKey ? QUESTIONS[currentLevelKey] : [];

  return (
    <div className="App">
      {showInitialScreen && <InitialScreen onStartGame={handleStartInitial} />}
      
      {!showInitialScreen && (
        <>
          {gameStatus === 'Bermain' && (
            <div className="game-screen">
              <div className="game-container">
                <P5Canvas 
                  levelData={levelData} 
                  onScoreChange={handleScoreChange}
                  onLevelComplete={handleLevelComplete}
                  onGameOver={handleGameOver} 
                />
              </div>
            </div>
          )}

          {gameStatus === 'Pilih Level' && <LevelSelect onSelectLevel={handleSelectLevel} />}

          {gameStatus === 'Menang' && (
            <div className="completion-screen win">
              <h2>🎉 Level Selesai! 🎉</h2>
              <p>Hebat! Kamu menyelesaikan semua soal.</p>
              <div className="final-score">Skor Akhir: {score}</div>
              <button onClick={handleRestart} className="btn-primary">Menu Utama</button>
            </div>
          )}

          {gameStatus === 'Kalah' && (
            <div className="completion-screen lose">
              <h2>💀 Game Over 💀</h2>
              <p>Nyawa kamu habis! Jangan menyerah.</p>
              <div className="final-score">Skor Akhir: {score}</div>
              <div className="button-group">
                <button onClick={handleRetry} className="btn-secondary">Coba Lagi</button>
                <button onClick={handleRestart} className="btn-primary">Menu Utama</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;