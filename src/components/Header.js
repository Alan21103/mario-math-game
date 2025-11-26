import React from 'react';// Anda bisa membuat file CSS terpisah (Header.css) jika perlu
// atau menggunakan inline styles sederhana.

const headerStyle = {
  backgroundColor: '#343a40', // Warna gelap
  color: 'white',
  padding: '15px 0',
  textAlign: 'center',
  fontSize: '2em',
  fontWeight: 'bold',
  marginBottom: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

const Header = ({ gameTitle }) => {
  return (
    <header style={headerStyle}>
      <h1>⭐ {gameTitle || 'Game Matematika'} ⭐</h1>
    </header>
  );
};

export default Header;