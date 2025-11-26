// src/components/P5Canvas.js (SOLUSI PENGHAPUSAN PAKSA)
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import GameEngine from '../p5/GameEngine';

const P5Canvas = ({ levelData, onScoreChange, onLevelComplete, keyInput }) => { 
  const canvasRef = useRef(null);
  const p5InstanceRef = useRef(null); // Ref untuk menyimpan instance GameEngine

  useEffect(() => {
    // 1. PASTIKAN SEMUA CANVAS LAMA DIHAPUS DULU
    // P5.js menggunakan ID unik (misalnya 'defaultCanvas0', 'defaultCanvas1').
    // Kita akan mencari dan menghapus elemen <canvas> apa pun yang sudah ada
    // di dalam container ini sebelum membuat yang baru.
    if (canvasRef.current) {
        let existingCanvas = canvasRef.current.querySelector('canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
    }
    
    // Inisialisasi P5.js dan GameEngine
    const callbacks = { onScoreChange, onLevelComplete };
    
    // p.remove() akan membersihkan canvas dan event listeners saat komponen di-unmount
    const sketch = new p5(p => {
      p5InstanceRef.current = new GameEngine(p, levelData, callbacks);
    }, canvasRef.current);

    return () => {
      // 2. Gunakan fungsi remove() bawaan P5.js saat komponen dilepas
      sketch.remove();
    };
  }, [levelData, onScoreChange, onLevelComplete]); 

  // Mengirim state input ke GameEngine SETIAP PERUBAHAN
  useEffect(() => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.updateInputState(keyInput);
    }
  }, [keyInput]); 

  // Berikan kelas yang ketat untuk styling
  return <div ref={canvasRef} className="p5-canvas-container" />;
};

export default P5Canvas;