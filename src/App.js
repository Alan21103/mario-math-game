// src/App.js (Ganti seluruh isinya dengan ini)
import React, { useState, useCallback, useEffect } from 'react'; 
import P5Canvas from './components/P5Canvas';
import LevelSelect from './components/LevelSelect';
import { QUESTIONS } from './data/questions';
import './App.css';

function App() {
  const [currentLevelKey, setCurrentLevelKey] = useState(null); 
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('Pilih Level'); 
  const [keyInput, setKeyInput] = useState({ left: false, right: false, jump: false }); 
  
  // ... (Fungsi handleKeyDown, handleKeyUp, dan State management lainnya di sini) ...
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== 'Bermain') return;
      if (e.key === ' ' || e.key === 'ArrowUp') {
          e.preventDefault(); 
      }
      
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setKeyInput(prev => ({ ...prev, right: true }));
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        setKeyInput(prev => ({ ...prev, left: true }));
      } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp') {
        setKeyInput(prev => ({ ...prev, jump: true }));
      }
    };

    const handleKeyUp = (e) => {
      if (gameStatus !== 'Bermain') return;
      
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setKeyInput(prev => ({ ...prev, right: false }));
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        setKeyInput(prev => ({ ...prev, left: false }));
      } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp') {
        setKeyInput(prev => ({ ...prev, jump: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStatus]); 

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
  }

  const levelData = currentLevelKey ? QUESTIONS[currentLevelKey] : [];


  return (
    <div className="App" style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🎓 Game Matematika P5.js & React</h1>
      
      {currentLevelKey && gameStatus === 'Bermain' && (
        <>
          <h3>Level: {currentLevelKey.replace('_', ' ')} | Skor: {score}</h3> 
          
          {/* Div container game: Pastikan tidak ada style inline yang membagi dua */}
          <div className="game-container" style={{ display: 'inline-block' }}> 
            
            {/* HANYA SATU INSTANCE P5Canvas */}
            <P5Canvas 
              levelData={levelData} 
              onScoreChange={handleScoreChange}
              onLevelComplete={handleLevelComplete}
              keyInput={keyInput} 
            />
          </div>
          <p>Gunakan **Panah Kiri/Kanan (A/D)** untuk bergerak, **Spasi/Enter/Panah Atas** untuk melompat!</p>
        </>
      )}

      {gameStatus === 'Pilih Level' && (
        <LevelSelect onSelectLevel={handleSelectLevel} />
      )}

      {gameStatus === 'Selesai' && (
        <div style={{ marginTop: '20px' }}>
          <h2>🎉 Level Selesai! 🎉</h2>
          <p>Skor Akhir Anda: **{score}**</p>
          <button onClick={handleRestart} 
            style={{ padding: '10px 20px', fontSize: '18px' }}>
            Main Lagi
          </button>
        </div>
      )}
    </div>
  );
}

export default App;