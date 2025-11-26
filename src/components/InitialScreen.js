import React from 'react';
import '../css/InitialScreen.css';

const InitialScreen = ({ onStartGame }) => {
  return (
    <div className="initial-screen-container">
      {/* Background Layers */}
      <div className="bg-layer bg-sky"></div>
      <div className="bg-layer bg-mountains"></div>
      <div className="bg-layer bg-clouds-1"></div>
      <div className="bg-layer bg-clouds-2"></div>
      <div className="bg-layer bg-trees"></div>
      
      {/* Main Content - Diposisikan Lebih Aman */}
      <div className="content-wrapper">
        <div className="game-title-area">
          <div className="title-glow"></div>
          <span className="game-title-top">MARIO MATH ADVENTURE</span>
          <h1 className="game-title-main">LEVEL UP!</h1>
        </div>

        <p className="game-slogan">
          Selesaikan tantangan matematika dan kumpulkan koin!
        </p>

        <button 
          className="start-button" 
          onClick={onStartGame}
        >
          <span className="btn-shine"></span>
          MULAI PETUALANGAN
        </button>
      </div>

      {/* Animated Elements dengan Posisi yang Lebih Presisi */}
      <div className="animated-elements">
        {/* Platform dengan Coin */}
        <div className="floating-platform platform-1">
          <div className="coin coin-1"></div>
        </div>
        <div className="floating-platform platform-2">
          <div className="coin coin-2"></div>
        </div>
        <div className="floating-platform platform-3">
          <div className="coin coin-3"></div>
        </div>
        
        {/* Characters */}
        <div className="mario-character"></div>
        <div className="goomba-character"></div>
        <div className="luigi-character"></div>
        
        {/* Ground yang Lebih Realistis */}
        <div className="ground-layer">
          <div className="grass-top">
            <div className="grass-details"></div>
          </div>
          <div className="dirt-fill">
            <div className="dirt-pattern"></div>
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        {/* Additional Decorations */}
        <div className="bush bush-1"></div>
        <div className="bush bush-2"></div>
        <div className="pipe"></div>
      </div>
    </div>
  );
};

export default InitialScreen;