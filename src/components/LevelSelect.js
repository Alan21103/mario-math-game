import React from 'react';

const LevelSelect = ({ onSelectLevel }) => {
  return (
    <div className="level-select">
      <h2>🎮 Pilih Level Game Matematika</h2>
      <div className="level-buttons">
        <button onClick={() => onSelectLevel('MUD_EASY')}>
          🟢 Level Mudah
        </button>
        <button onClick={() => onSelectLevel('MED_MEDIUM')}>
          🟡 Level Sedang
        </button>
        <button onClick={() => onSelectLevel('SUL_HARD')}>
          🔴 Level Sulit
        </button>
      </div>
    </div>
  );
};

export default LevelSelect;