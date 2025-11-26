import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import GameEngine from '../p5/GameEngine';

const P5Canvas = ({ levelData, onScoreChange, onLevelComplete, keyInput }) => { 
  const canvasRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const gameEngineRef = useRef(null);

  useEffect(() => {
    console.log('🎯 P5Canvas Mount - Level data:', levelData?.length);

    // CLEANUP TOTAL sebelum membuat baru
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }
    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
    }

    // BUAT SKETCH P5.JS YANG SEDERHANA
    const sketch = (p) => {
      console.log('🎨 Creating p5 sketch');
      
      let gameEngine;

      p.setup = () => {
        console.log('⚙️ p5 setup called');
        p.createCanvas(800, 400);
        p.textFont('Arial', 24);
        
        // Buat GameEngine instance
        gameEngine = new GameEngine(p, levelData, { onScoreChange, onLevelComplete });
        gameEngineRef.current = gameEngine;
        gameEngine.setup();
      };

      p.draw = () => {
        if (gameEngine && !gameEngine.isGameOver) {
          // UPDATE: Terima input langsung di setiap frame
          gameEngine.updateInputState(keyInput);
          gameEngine.update();
          gameEngine.draw();
        }
      };
    };

    // BUAT P5 INSTANCE
    p5InstanceRef.current = new p5(sketch, canvasRef.current);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
      gameEngineRef.current = null;
    };
  }, [levelData]); // HANYA levelData sebagai dependency

  return (
    <div 
      ref={canvasRef} 
      className="p5-canvas-container"
    />
  );
};

export default P5Canvas;