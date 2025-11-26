import React from 'react';
// Jalur yang benar: Keluar dari 'components' (..) lalu masuk ke 'css'
import '../css/LevelSelect.css'; 

const LevelSelect = ({ onSelectLevel }) => {
  return (
    <div className="level-select-container">
      <h2 className="level-select-heading">🎮 Pilih Level Game Matematika</h2>
      <p className="level-select-subtext">Tentukan tantanganmu dan mulai bermain!</p>
      
      <div className="level-buttons-group">
        
        {/* Tombol Mudah */}
        <button 
          className="level-button easy" 
          onClick={() => onSelectLevel('MUD_EASY')}
        >
          🟢 Level **Mudah**
        </button>
        
        {/* Tombol Sedang */}
        <button 
          className="level-button medium" 
          onClick={() => onSelectLevel('MED_MEDIUM')}
        >
          🟡 Level **Sedang**
        </button>
        
        {/* Tombol Sulit */}
        <button 
          className="level-button hard" 
          onClick={() => onSelectLevel('SUL_HARD')}
        >
          🔴 Level **Sulit**
        </button>
        
      </div>
    </div>
  );
};

export default LevelSelect;