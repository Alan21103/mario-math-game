import React, { useRef, useEffect, useState } from 'react';
// TIDAK ADA IMPORT P5 DISINI KARENA KITA PAKAI CDN DI INDEX.HTML

import GameEngine from '../p5/GameEngine';
import '../css/P5Canvas.css';

const P5Canvas = ({ levelData, onScoreChange, onLevelComplete, onGameOver }) => { 
  const canvasRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const gameEngineRef = useRef(null);
  const [gameStatus, setGameStatus] = useState('playing');

  useEffect(() => {
    console.log('🎯 P5Canvas Mount - Level data:', levelData?.length);

    // CLEANUP TOTAL
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }
    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
    }

    // --- DEFINISI SKETCH ---
    const sketch = (p) => {
      console.log('🎨 Creating p5 sketch using CDN version');
      
      let gameEngine;
      let backgroundElements = [];
      let clouds = [];
      let particles = [];
      let canvasWidth = window.innerWidth;
      let canvasHeight = window.innerHeight;
      let time = 0;
      let sounds = {};

      p.preload = () => {
        // Karena pakai CDN, p.loadSound otomatis tersedia jika file index.html benar
        if (typeof p.loadSound === 'function') {
          p.soundFormats('mp3');
          // File harus ada di folder public/assets/sound/
          try {
            sounds.bgm = p.loadSound('/assets/sound/bgm.mp3');
            sounds.jump = p.loadSound('/assets/sound/jump.mp3');
            sounds.coin = p.loadSound('/assets/sound/coin.mp3');
            sounds.gameover = p.loadSound('/assets/sound/gameover.mp3');
            sounds.win = p.loadSound('/assets/sound/win.mp3');
            console.log('🔊 Sounds loading...');
          } catch (e) {
            console.error(e);
          }
        }
      };

      p.setup = () => {
        console.log('⚙️ p5 setup');
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        
        p.createCanvas(canvasWidth, canvasHeight);
        p.frameRate(60);
        
        // Audio Context Start
        if (p.userStartAudio) {
            p.userStartAudio();
        }

        const callbacks = {
          onScoreChange: (score) => { if (onScoreChange) onScoreChange(score); },
          onLevelComplete: (score) => {
            setGameStatus('completed');
            if (onLevelComplete) onLevelComplete(score);
          },
          onGameOver: (score) => {
            setGameStatus('gameover');
            if (onGameOver) onGameOver(score);
          }
        };
        
        gameEngine = new GameEngine(p, levelData, callbacks, sounds, canvasWidth, canvasHeight);
        gameEngineRef.current = gameEngine;
        gameEngine.setup();

        generateBackgroundElements();
        generateClouds();
        generateParticles();
      };

      // --- VISUAL GENERATION (CODE VISUAL TETAP SAMA) ---
      const generateBackgroundElements = () => {
        backgroundElements = [];
        for (let i = 0; i < 6; i++) {
          backgroundElements.push({ type: 'farMountain', x: i * 500, y: canvasHeight * 0.65, size: p.random(150, 250), speed: 0.1, color: [60, 80, 60] });
        }
        for (let i = 0; i < 5; i++) {
          backgroundElements.push({ type: 'midMountain', x: i * 450, y: canvasHeight * 0.7, size: p.random(200, 300), speed: 0.2, color: [70, 100, 70] });
        }
        for (let i = 0; i < 4; i++) {
          backgroundElements.push({ type: 'nearMountain', x: i * 400, y: canvasHeight * 0.75, size: p.random(250, 350), speed: 0.3, color: [80, 120, 80] });
        }
        for (let i = 0; i < 15; i++) {
          backgroundElements.push({ type: 'farTree', x: i * 150, y: canvasHeight * 0.78, size: p.random(40, 70), speed: 0.4, color: [40, 100, 40] });
        }
        for (let i = 0; i < 10; i++) {
          backgroundElements.push({ type: 'nearTree', x: i * 200, y: canvasHeight * 0.8, size: p.random(80, 120), speed: 0.6, color: [50, 130, 50] });
        }
      };

      const generateClouds = () => {
        clouds = [];
        for (let i = 0; i < 12; i++) {
          clouds.push({ x: p.random(-200, canvasWidth + 200), y: p.random(30, canvasHeight * 0.4), size: p.random(100, 220), speed: p.random(0.3, 1.0), opacity: p.random(180, 240), layers: p.random(2, 4) });
        }
      };

      const generateParticles = () => {
        particles = [];
        for (let i = 0; i < 50; i++) {
          particles.push({ x: p.random(0, canvasWidth), y: p.random(0, canvasHeight * 0.7), size: p.random(1, 3), speed: p.random(0.1, 0.5), alpha: p.random(20, 80), type: p.random() > 0.5 ? 'dust' : 'sparkle' });
        }
      };

      const drawBackground = () => {
        drawDynamicSky();
        drawSun();
        drawParticles();
        drawClouds();
        drawBackgroundElements();
        drawDetailedGround();
      };

      const drawDynamicSky = () => {
        time += 0.01;
        const timeFactor = (Math.sin(time) + 1) / 2;
        for (let y = 0; y < canvasHeight * 0.8; y++) {
          const inter = p.map(y, 0, canvasHeight * 0.8, 0, 1);
          const baseR = p.lerp(135, 100, inter);
          const baseG = p.lerp(206, 180, inter);
          const baseB = p.lerp(235, 255, inter);
          const timeR = p.lerp(baseR, baseR + 10, timeFactor);
          const timeG = p.lerp(baseG, baseG + 5, timeFactor);
          const timeB = p.lerp(baseB, baseB + 15, timeFactor);
          p.stroke(timeR, timeG, timeB);
          p.line(0, y, canvasWidth, y);
        }
      };

      const drawSun = () => {
        const sunX = canvasWidth * 0.8;
        const sunY = canvasHeight * 0.2;
        const sunSize = canvasWidth * 0.08;
        for (let i = 5; i > 0; i--) {
          const alpha = 30 - i * 5;
          const size = sunSize + i * 10;
          p.fill(255, 255, 200, alpha);
          p.noStroke();
          p.ellipse(sunX, sunY, size, size);
        }
        p.fill(255, 255, 150);
        p.noStroke();
        p.ellipse(sunX, sunY, sunSize, sunSize);
        p.fill(255, 255, 200);
        p.ellipse(sunX - sunSize * 0.2, sunY - sunSize * 0.2, sunSize * 0.3, sunSize * 0.3);
      };

      const drawParticles = () => {
        particles.forEach(particle => {
          if (particle.type === 'sparkle') {
            p.fill(255, 255, 255, particle.alpha * (0.5 + 0.5 * Math.sin(time * 5)));
          } else {
            p.fill(200, 200, 255, particle.alpha);
          }
          p.noStroke();
          p.ellipse(particle.x, particle.y, particle.size, particle.size);
          particle.x -= particle.speed;
          if (particle.x < -10) {
            particle.x = canvasWidth + 10;
            particle.y = p.random(0, canvasHeight * 0.7);
          }
        });
      };

      const drawClouds = () => {
        clouds.forEach(cloud => {
          p.fill(255, 255, 255, cloud.opacity);
          p.noStroke();
          for (let i = 0; i < cloud.layers; i++) {
            const offsetX = i * cloud.size * 0.1;
            const offsetY = i * cloud.size * 0.05;
            const layerSize = cloud.size * (1 - i * 0.1);
            p.ellipse(cloud.x + offsetX, cloud.y + offsetY, layerSize, layerSize * 0.6);
            p.ellipse(cloud.x + offsetX + layerSize * 0.3, cloud.y + offsetY, layerSize * 0.8, layerSize * 0.5);
            p.ellipse(cloud.x + offsetX - layerSize * 0.3, cloud.y + offsetY, layerSize * 0.8, layerSize * 0.5);
          }
          cloud.x -= cloud.speed;
          if (cloud.x < -400) {
            cloud.x = canvasWidth + 400;
            cloud.y = p.random(30, canvasHeight * 0.4);
          }
        });
      };

      const drawBackgroundElements = () => {
        backgroundElements.forEach(element => {
          p.noStroke();
          if (element.type.includes('Mountain')) {
            p.fill(element.color[0], element.color[1], element.color[2]);
            p.triangle(element.x, element.y, element.x + element.size, element.y, element.x + element.size/2, element.y - element.size * 0.7);
            p.fill(element.color[0] + 20, element.color[1] + 20, element.color[2] + 20);
            p.triangle(element.x + element.size * 0.3, element.y - element.size * 0.2, element.x + element.size * 0.7, element.y - element.size * 0.2, element.x + element.size * 0.5, element.y - element.size * 0.5);
          } else if (element.type.includes('Tree')) {
            const trunkHeight = element.size * 0.4;
            p.fill(101, 67, 33); 
            p.rect(element.x, element.y - trunkHeight, 10, trunkHeight);
            p.fill(139, 90, 43);
            p.rect(element.x + 2, element.y - trunkHeight + 2, 6, trunkHeight - 4);
            const leafLayers = element.type === 'nearTree' ? 3 : 2;
            for (let i = 0; i < leafLayers; i++) {
              const layerSize = element.size * (1 - i * 0.2);
              const layerY = element.y - trunkHeight - i * 15;
              p.fill(element.color[0] - i * 10, element.color[1] - i * 5, element.color[2] - i * 10);
              p.ellipse(element.x + 5, layerY, layerSize, layerSize * 0.8);
              p.ellipse(element.x - layerSize * 0.2, layerY, layerSize * 0.6, layerSize * 0.5);
              p.ellipse(element.x + layerSize * 0.3, layerY, layerSize * 0.6, layerSize * 0.5);
            }
          }
          element.x -= element.speed;
          if (element.x < -500) element.x = canvasWidth + 300;
        });
      };

      const drawDetailedGround = () => {
        for (let y = canvasHeight * 0.8; y < canvasHeight; y++) {
          const inter = p.map(y, canvasHeight * 0.8, canvasHeight, 0, 1);
          const r = p.lerp(120, 80, inter);
          const g = p.lerp(80, 50, inter);
          const b = p.lerp(40, 20, inter);
          p.stroke(r, g, b);
          p.line(0, y, canvasWidth, y);
        }
        p.noStroke();
        p.fill(70, 160, 70);
        p.rect(0, canvasHeight * 0.8, canvasWidth, 25);
        p.stroke(60, 140, 60);
        p.strokeWeight(2);
        for (let x = 0; x < canvasWidth; x += 25) {
          const bladeHeight = p.random(8, 15);
          const curve = p.random(-3, 3);
          p.line(x, canvasHeight * 0.8, x + curve, canvasHeight * 0.8 - bladeHeight);
        }
        p.noStroke();
        for (let i = 0; i < 20; i++) {
          const x = p.random(0, canvasWidth);
          const y = p.random(canvasHeight * 0.82, canvasHeight * 0.9);
          if (p.random() > 0.5) {
            p.fill(100, 100, 100);
            p.ellipse(x, y, p.random(5, 15), p.random(3, 8));
          } else {
            p.fill(80, 150, 80, 100);
            p.ellipse(x, y, p.random(10, 25), p.random(5, 10));
          }
        }
      };

      p.draw = () => {
        drawBackground();
        if (gameEngine) {
          gameEngine.update();
          gameEngine.draw();
        }
      };

      p.windowResized = () => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        p.resizeCanvas(canvasWidth, canvasHeight);
        generateBackgroundElements();
        generateClouds();
        generateParticles();
        if (gameEngine && gameEngine.updateCanvasSize) {
          gameEngine.updateCanvasSize(canvasWidth, canvasHeight);
        }
      };

      p.mousePressed = () => {
        if (p.userStartAudio) p.userStartAudio();
      };

      p.keyPressed = () => {
        if (p.userStartAudio) p.userStartAudio();

        if ((p.key === 'r' || p.key === 'R') && gameEngine && gameEngine.isGameOver) {
          gameEngine.restart();
          setGameStatus('playing');
        }
        if ([32, 37, 38, 39, 65, 68, 87].includes(p.keyCode)) {
          return false;
        }
      };
    };

    // --- BAGIAN PERBAIKAN UTAMA ---
    // Gunakan window.p5 untuk instance p5 baru (karena import p5 sudah dihapus)
    if (window.p5) {
        p5InstanceRef.current = new window.p5(sketch, canvasRef.current);
    } else {
        console.error("Critical: p5 library not found in window object! Check index.html script tags.");
    }
    // -----------------------------

    const handleResize = () => {
      if (p5InstanceRef.current && p5InstanceRef.current.windowResized) {
        p5InstanceRef.current.windowResized();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
      gameEngineRef.current = null;
      window.removeEventListener('resize', handleResize);
    };
  }, [levelData, onScoreChange, onLevelComplete, onGameOver]);

  return (
    <div className="p5-game-container">
      <div className="game-title-overlay">
        <h2>MARIO MATH ADVENTURE</h2>
        <p>Jawab soal matematika dan kumpulkan koin!</p>
        {gameStatus === 'completed' && (
          <div className="status-message completed">LEVEL SELESAI! 🎉</div>
        )}
        {gameStatus === 'gameover' && (
          <div className="status-message gameover">GAME OVER! 😢</div>
        )}
      </div>
      
      <div 
        ref={canvasRef} 
        className="p5-canvas-wrapper"
      />
      
      <div className="game-instructions">
        <div className="instruction-item">
          <span className="key">← → A D</span>
          <span>Gerak Kiri/Kanan</span>
        </div>
        <div className="instruction-item">
          <span className="key">Spasi W ↑</span>
          <span>Lompat</span>
        </div>
        <div className="instruction-item">
          <span className="key">R</span>
          <span>Restart Game</span>
        </div>
        <div className="instruction-item">
          <span className="key" style={{fontSize: '0.8rem'}}>Klik</span>
          <span>Aktifkan Suara</span>
        </div>
      </div>
    </div>
  );
};

export default P5Canvas;