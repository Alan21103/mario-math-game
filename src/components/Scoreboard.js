import React from 'react';

const Scoreboard = ({ score, level, lives }) => {
  
  // Fungsi untuk mengubah kode level menjadi nama yang mudah dibaca
  const getLevelName = (levelCode) => {
    switch (levelCode) {
      case 'MUD_EASY':
        return 'Mudah';
      case 'MED_MEDIUM':
        return 'Sedang';
      case 'SUL_HARD':
        return 'Sulit';
      default:
        return 'N/A';
    }
  };

  const boardStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '15px 30px',
    backgroundColor: '#fff3cd', // Warna kuning muda (ala notifikasi)
    border: '1px solid #ffeeba',
    borderRadius: '8px',
    marginBottom: '30px',
    maxWidth: '500px',
    margin: '0 auto 30px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const itemStyle = {
    textAlign: 'center',
    fontSize: '1.1em',
    fontWeight: '600',
    color: '#856404', // Warna teks yang kontras
  };

  const valueStyle = {
    display: 'block',
    fontSize: '1.5em',
    marginTop: '5px',
    fontWeight: 'bold',
  };

  // Tampilkan ikon nyawa
  const renderLives = () => {
    let hearts = '';
    for (let i = 0; i < lives; i++) {
      hearts += '❤️'; 
    }
    return hearts || '💔';
  };

  return (
    <div style={boardStyle}>
      
      <div style={itemStyle}>
        SCORE
        <span style={valueStyle}>{score}</span>
      </div>
      
      <div style={itemStyle}>
        LEVEL
        <span style={valueStyle}>{getLevelName(level)}</span>
      </div>
      
      <div style={itemStyle}>
        NYAWA
        <span style={valueStyle}>{renderLives()}</span>
      </div>
      
    </div>
  );
};

export default Scoreboard;