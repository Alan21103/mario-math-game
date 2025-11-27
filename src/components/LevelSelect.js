// levelselect.js (Hapus import CSS di sini, karena sudah di InitialScreen.css)
import React from 'react';
// import '../css/LevelSelect.css'; // HAPUS/Nonaktifkan jika Anda memindahkan CSS ke InitialScreen.css

/**
 * Komponen untuk menampilkan antarmuka pemilihan level.
 * @param {function} onSelectLevel - Fungsi yang dipanggil saat level dipilih (diteruskan ke App.js).
 * @param {function} onBackToMain - Fungsi untuk kembali ke layar utama (mengubah state di InitialScreen).
 */
const LevelSelect = ({ onSelectLevel, onBackToMain }) => {
    return (
        <div className="level-select-content"> {/* Ubah dari level-select-overlay ke level-select-content */}
            
            <button className="back-button" onClick={onBackToMain}>
                ← Kembali
            </button>

            <div className="level-title-area">
                <span className="level-title-top">PILIH LEVEL</span>
                <h1 className="level-title-main">TANTANGAN<br />MATEMATIKA</h1>
            </div>

            <p className="level-select-slogan">
                Pilih tingkat kesulitan dan<br />
                mulai petualanganmu!
            </p>

            <div className="level-buttons-group">
                {/* Tombol Mudah */}
                <button 
                    className="level-button easy" 
                    onClick={() => onSelectLevel('MUD_EASY')}
                >
                    <span className="btn-shine"></span>
                    <span className="level-icon">🟢</span>
                    <span className="level-text">
                        <strong>Level Mudah</strong>
                        <small>Operasi dasar matematika</small>
                    </span>
                </button>

                {/* Tombol Sedang */}
                <button 
                    className="level-button medium" 
                    onClick={() => onSelectLevel('MED_MEDIUM')}
                >
                    <span className="btn-shine"></span>
                    <span className="level-icon">🟡</span>
                    <span className="level-text">
                        <strong>Level Sedang</strong>
                        <small>Kombinasi operasi</small>
                    </span>
                </button>

                {/* Tombol Sulit */}
                <button 
                    className="level-button hard" 
                    onClick={() => onSelectLevel('SUL_HARD')}
                >
                    <span className="btn-shine"></span>
                    <span className="level-icon">🔴</span>
                    <span className="level-text">
                        <strong>Level Sulit</strong>
                        <small>Tantangan kompleks</small>
                    </span>
                </button>
            </div>
        </div>
    );
};

export default LevelSelect;
