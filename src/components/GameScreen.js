import React, { useState } from 'react';
import Header from './Header';
import Scoreboard from './Scoreboard';
import LevelSelect from './LevelSelect';
// Asumsi Anda akan mengimpor P5Canvas dan GameEngine di sini
// import P5Canvas from './P5Canvas'; 

const GameScreen = () => {
  // 1. Definisikan state utama game
  const [currentLevel, setCurrentLevel] = useState('MUD_EASY');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  // 2. Fungsi untuk memilih level, diteruskan ke LevelSelect
  const handleLevelSelect = (level) => {
    setCurrentLevel(level);
    setScore(0); // Reset skor saat level diubah
    setLives(3); // Reset nyawa
    console.log(`Level dipilih: ${level}`);
  };

  // 3. Fungsi contoh untuk memperbarui skor (akan dipanggil dari GameEngine/P5Canvas)
  const handleScoreUpdate = (points) => {
    setScore(prevScore => prevScore + points);
  };
  
  // 4. Fungsi contoh untuk mengurangi nyawa
  const handleLifeLoss = () => {
    setLives(prevLives => prevLives - 1);
  };

  return (
    <div className="game-screen-container">
      {/* Bagian Atas: Header */}
      <Header gameTitle="MARIO MATH GAME" />
      
      {/* Bagian Skor dan Status */}
      <Scoreboard 
        score={score} 
        level={currentLevel} 
        lives={lives} 
      />
      
      {/* Bagian Pilih Level (Tampilkan hanya jika level belum dipilih atau di menu utama) */}
      {currentLevel === null ? (
        <LevelSelect onSelectLevel={handleLevelSelect} />
      ) : (
        <>
          {/* Bagian Game Engine / P5Canvas akan diposisikan di sini.
            Anda perlu menyesuaikan properti (props) yang diperlukan untuk menjalankan game.
          */}
          {/* <P5Canvas 
            currentLevel={currentLevel}
            onScoreUpdate={handleScoreUpdate}
            onLifeLoss={handleLifeLoss}
          /> */}

          {/* Contoh: Tombol untuk kembali ke pemilihan level */}
          <button 
            style={{ padding: '10px', marginTop: '20px' }} 
            onClick={() => setCurrentLevel(null)}
          >
            ↩️ Ganti Level
          </button>
        </>
      )}
      
    </div>
  );
};

export default GameScreen;