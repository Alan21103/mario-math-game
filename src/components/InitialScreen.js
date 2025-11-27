// InitialScreen.js 
import React, { useState } from 'react'; // <-- Import useState
import LevelSelect from './LevelSelect'; // <-- Import LevelSelect
import '../css/InitialScreen.css';

/**
 * Komponen untuk menampilkan antarmuka awal DAN pemilihan level.
 * @param {function} onSelectLevel - Fungsi dari App.js (dipanggil saat level dipilih).
 */
const InitialScreen = ({ onSelectLevel }) => {
    // State lokal untuk mengontrol tampilan Intro (false) atau LevelSelect (true)
    const [showLevelSelect, setShowLevelSelect] = useState(false);

    // Handler untuk tombol 'Mulai Petualangan' (beralih ke LevelSelect)
    const handleStartGame = () => {
        setShowLevelSelect(true);
    };

    // Handler untuk tombol 'Kembali' di LevelSelect (beralih ke Intro Screen)
    const handleBackToMain = () => {
        setShowLevelSelect(false);
    };

    // Jika showLevelSelect true, tampilkan LevelSelect
    if (showLevelSelect) {
        return (
            <div className="initial-screen-container">
                {/* Latar Belakang Tetap Sama */}
                <div className="bg-layer bg-sky"></div>
                <div className="bg-layer bg-mountains"></div>
                <div className="bg-layer bg-clouds-1"></div>
                <div className="bg-layer bg-clouds-2"></div>
                <div className="bg-layer bg-trees"></div>
                <div className="animated-elements">
                    {/* Elemen Animasi Tetap (Platform, Coins, Characters, Ground) */}
                    <div className="floating-platform platform-1"><div className="coin coin-1"></div></div>
                    <div className="floating-platform platform-2"><div className="coin coin-2"></div></div>
                    <div className="floating-platform platform-3"><div className="coin coin-3"></div></div>
                    <div className="mario-character"></div>
                    <div className="goomba-character"></div>
                    <div className="luigi-character"></div>
                    <div className="ground-layer">
                        <div className="grass-top"><div className="grass-details"></div></div>
                        <div className="dirt-fill"><div className="dirt-pattern"></div></div>
                    </div>
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
                    <div className="bush bush-1"></div>
                    <div className="bush bush-2"></div>
                    <div className="pipe"></div>
                </div>

                {/* Tampilan Level Select (Berada di atas elemen latar belakang) */}
                <div className="content-wrapper level-select-overlay">
                    <LevelSelect 
                        onSelectLevel={onSelectLevel} 
                        onBackToMain={handleBackToMain} 
                    />
                </div>
            </div>
        );
    }
    
    // Jika showLevelSelect false, tampilkan Intro Screen
    return (
        <div className="initial-screen-container">
            {/* Background Layers */}
            <div className="bg-layer bg-sky"></div>
            <div className="bg-layer bg-mountains"></div>
            <div className="bg-layer bg-clouds-1"></div>
            <div className="bg-layer bg-clouds-2"></div>
            <div className="bg-layer bg-trees"></div>

            <div className="content-wrapper">
                
                {/* Tampilan Awal */}
                <>
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
                        onClick={handleStartGame} // Memicu perpindahan ke LevelSelect di tampilan lokal
                    >
                        <span className="btn-shine"></span>
                        MULAI PETUALANGAN
                    </button>
                </>
            </div>

            {/* Animated Elements */}
            <div className="animated-elements">
                {/* Platform dengan Coin */}
                <div className="floating-platform platform-1"><div className="coin coin-1"></div></div>
                <div className="floating-platform platform-2"><div className="coin coin-2"></div></div>
                <div className="floating-platform platform-3"><div className="coin coin-3"></div></div>
                {/* Characters */}
                <div className="mario-character"></div>
                <div className="goomba-character"></div>
                <div className="luigi-character"></div>
                {/* Ground */}
                <div className="ground-layer">
                    <div className="grass-top"><div className="grass-details"></div></div>
                    <div className="dirt-fill"><div className="dirt-pattern"></div></div>
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
