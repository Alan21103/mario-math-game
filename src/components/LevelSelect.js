// src/components/LevelSelect.js
import React from 'react';

const LevelSelect = ({ onSelectLevel }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Pilih Level Game</h2>
      <button onClick={() => onSelectLevel('MUD_EASY')} 
        style={{ margin: '10px', padding: '10px 20px', fontSize: '18px' }}>
        Level Mudah
      </button>
      <button onClick={() => onSelectLevel('MED_MEDIUM')} 
        style={{ margin: '10px', padding: '10px 20px', fontSize: '18px' }}>
        Level Sedang
      </button>
      <button onClick={() => onSelectLevel('SUL_HARD')} 
        style={{ margin: '10px', padding: '10px 20px', fontSize: '18px' }}>
        Level Sulit
      </button>
    </div>
  );
};

export default LevelSelect;