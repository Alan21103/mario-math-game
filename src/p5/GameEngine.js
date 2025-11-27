export default class GameEngine {
    // 1. UPDATE CONSTRUCTOR: Tambah parameter 'sounds'
    constructor(p, levelData, callbacks, sounds, canvasWidth = 1000, canvasHeight = 600) {
        this.p = p;
        this.questions = levelData || [];
        this.callbacks = callbacks;
        this.sounds = sounds || {}; // Menerima object sounds
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // --- Game State ---
        this.score = 0;
        this.questionIndex = 0;
        this.isGameOver = false;
        this.lives = 3;
        this.coinsCollected = 0;
        this.isAnswering = false;
        this.lastAnswerFeedback = null;

        // --- Mario Character ---
        this.mario = {
            x: canvasWidth * 0.08,
            y: canvasHeight * 0.7,
            vy: 0,
            dx: 0,
            width: canvasWidth * 0.04,
            height: canvasHeight * 0.08,
            isOnGround: true,
            isJumping: false,
            facingRight: true
        };

        // --- Game Elements ---
        this.blocks = [];
        this.platforms = [];
        this.coins = [];
        this.pipes = [];
        this.clouds = [];
        
        // --- Asset Cache ---
        this.assets = {
            cloud: null,
            block: null,
            pipe: null
        };

        // --- Physics Constants ---
        this.GRAVITY = 0.8;
        this.JUMP_POWER = -22; 
        this.MOVE_SPEED = 7;
        this.GROUND_Y = canvasHeight * 0.85;
        this.SCREEN_WIDTH = canvasWidth;
        this.SCREEN_HEIGHT = canvasHeight;

        // --- Input State ---
        this.keyState = { space: false, up: false, w: false };

        // --- Current Level ---
        this.currentQuestion = null;
        this.currentOptions = [];

        console.log('🚀 Mario Math Game Engine initialized (Audio Enabled)');
    }

    setup() {
        this.createCachedAssets();
        this.generateLevel();
        this.generateClouds();
        this.loadQuestion();

        // 2. PLAY BGM
        if (this.sounds.bgm && !this.sounds.bgm.isPlaying()) {
            this.sounds.bgm.setVolume(0.5); // Volume background 50%
            this.sounds.bgm.loop();
        }
    }

    createCachedAssets() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA - TIDAK ADA PERUBAHAN DI SINI) ...
        const cw = 150;
        const ch = 100;
        this.assets.cloud = this.p.createGraphics(cw, ch);
        this.assets.cloud.noStroke();
        this.assets.cloud.fill(255, 255, 255, 200);
        this.assets.cloud.ellipse(cw/2, ch/2, cw, ch * 0.6);
        this.assets.cloud.ellipse(cw/2 - 30, ch/2 + 10, cw * 0.6, ch * 0.5);
        this.assets.cloud.ellipse(cw/2 + 30, ch/2 + 10, cw * 0.6, ch * 0.5);

        const bs = 50; 
        this.assets.block = this.p.createGraphics(bs, bs);
        const bg = this.assets.block;
        bg.stroke(184, 134, 11);
        bg.strokeWeight(1);
        bg.fill(255, 204, 0);
        bg.rect(0, 0, bs, bs, 3);
        bg.noStroke();
        bg.fill(255, 255, 255, 100);
        bg.beginShape();
        bg.vertex(0, bs); bg.vertex(0, 0); bg.vertex(bs, 0);
        bg.vertex(bs - 5, 5); bg.vertex(5, 5); bg.vertex(5, bs - 5);
        bg.endShape(bg.CLOSE);
        bg.fill(184, 134, 11, 100);
        bg.beginShape();
        bg.vertex(bs, 0); bg.vertex(bs, bs); bg.vertex(0, bs);
        bg.vertex(5, bs - 5); bg.vertex(bs - 5, bs - 5); bg.vertex(bs - 5, 5);
        bg.endShape(bg.CLOSE);
        bg.fill(139, 69, 19);
        const off = 6;
        bg.ellipse(off, off, 4); bg.ellipse(bs - off, off, 4);
        bg.ellipse(off, bs - off, 4); bg.ellipse(bs - off, bs - off, 4);
    }

    generateLevel() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        this.platforms = [
            { x: this.canvasWidth * 0.15, y: this.canvasHeight * 0.6, width: this.canvasWidth * 0.15, height: 20 },
            { x: this.canvasWidth * 0.42, y: this.canvasHeight * 0.45, width: this.canvasWidth * 0.16, height: 20 },
            { x: this.canvasWidth * 0.7, y: this.canvasHeight * 0.6, width: this.canvasWidth * 0.15, height: 20 }
        ];
        this.pipes = [
            { x: this.canvasWidth * 0.88, y: this.canvasHeight * 0.65, width: this.canvasWidth * 0.08, height: this.canvasHeight * 0.15 }
        ];
        this.generateCoins();
    }

    generateCoins() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        this.coins = [];
        const coinPositions = [
            { x: this.canvasWidth * 0.2, y: this.canvasHeight * 0.5 },
            { x: this.canvasWidth * 0.5, y: this.canvasHeight * 0.35 },
            { x: this.canvasWidth * 0.75, y: this.canvasHeight * 0.5 },
            { x: this.canvasWidth * 0.3, y: this.canvasHeight * 0.25 },
            { x: this.canvasWidth * 0.6, y: this.canvasHeight * 0.25 }
        ];
        coinPositions.forEach(pos => {
            this.coins.push({
                x: pos.x, y: pos.y, width: 30, height: 30, collected: false, animation: 0
            });
        });
    }

    generateClouds() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        this.clouds = [];
        for (let i = 0; i < 6; i++) {
            this.clouds.push({
                x: this.p.random(-100, this.SCREEN_WIDTH + 100),
                y: this.p.random(this.canvasHeight * 0.05, this.canvasHeight * 0.3),
                size: this.p.random(60, 120),
                speed: this.p.random(0.2, 0.5)
            });
        }
    }

    loadQuestion() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        if (this.questionIndex >= this.questions.length) {
            this.isGameOver = true;
            if (this.callbacks.onLevelComplete) this.callbacks.onLevelComplete(this.score);
            return;
        }

        this.currentQuestion = this.questions[this.questionIndex];
        this.currentOptions = [...this.currentQuestion.options].sort(() => Math.random() - 0.5);

        this.blocks = this.currentOptions.map((optionValue, index) => {
            const platformIndex = index % this.platforms.length;
            const platform = this.platforms[platformIndex];
            
            return {
                x: platform.x + (platform.width * 0.35),
                y: platform.y - 80,
                width: 50,
                height: 50,
                answer: optionValue,
                bumpOffset: 0
            };
        });

        this.resetMarioPosition();
        this.isAnswering = false;
        this.lastAnswerFeedback = null;
    }

    update() {
        if (this.isGameOver) return;
        this.handleInput();
        this.updateMario();
        this.updateClouds();
        this.updateCoins();
        this.checkCollisions();
        
        if (!this.isAnswering) {
            this.checkQuestionBlocks();
        } else {
            this.blocks.forEach(b => {
                if (b.bumpOffset > 0) b.bumpOffset -= 2;
            });
        }
    }

    draw() {
        this.drawEnvironment();
        this.drawGameElements();
        this.drawUI();
        if (this.isGameOver) {
            this.drawGameOverScreen();
        }
    }

    drawEnvironment() {
       // ... (KODE SAMA SEPERTI SEBELUMNYA - DRAW ENVIRONMENT) ...
       this.p.noStroke();
       this.p.fill(101, 67, 33);
       this.p.rect(0, this.GROUND_Y, this.SCREEN_WIDTH, this.SCREEN_HEIGHT - this.GROUND_Y);
       this.p.fill(34, 139, 34);
       this.p.rect(0, this.GROUND_Y, this.SCREEN_WIDTH, 20);
       this.p.stroke(20, 100, 20);
       this.p.strokeWeight(2);
       this.p.line(0, this.GROUND_Y + 20, this.SCREEN_WIDTH, this.GROUND_Y + 20);
       this.platforms.forEach(p => {
           this.p.fill(0, 0, 0, 50); 
           this.p.noStroke();
           this.p.rect(p.x + 5, p.y + 5, p.width, p.height, 4);
           this.p.stroke(0); 
           this.p.strokeWeight(2);
           this.p.fill(210, 105, 30);
           this.p.rect(p.x, p.y, p.width, p.height, 4);
           this.p.fill(0); 
           this.p.noStroke();
           this.p.ellipse(p.x + 10, p.y + 10, 4);
           this.p.ellipse(p.x + p.width - 10, p.y + 10, 4);
       });
       this.pipes.forEach(pipe => {
           this.p.fill(34, 177, 76);
           this.p.stroke(0);
           this.p.strokeWeight(2);
           this.p.rect(pipe.x, pipe.y, pipe.width, pipe.height);
           this.p.noStroke();
           this.p.fill(100, 230, 100); 
           this.p.rect(pipe.x + 5, pipe.y, 5, pipe.height);
           this.p.stroke(0);
           this.p.fill(34, 177, 76);
           this.p.rect(pipe.x - 4, pipe.y, pipe.width + 8, 30);
       });
    }

    drawGameElements() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA - DRAW ELEMENTS) ...
        this.clouds.forEach(cloud => {
            if (this.assets.cloud) {
                this.p.image(this.assets.cloud, cloud.x, cloud.y, cloud.size, cloud.size * 0.6);
            }
        });
        this.coins.forEach(coin => {
            if (!coin.collected) {
                const floatOffset = Math.sin(coin.animation) * 5;
                const cx = coin.x + coin.width/2;
                const cy = coin.y + floatOffset + coin.height/2;
                this.p.fill(255, 215, 0);
                this.p.stroke(218, 165, 32);
                this.p.strokeWeight(2);
                this.p.ellipse(cx, cy, coin.width, coin.height);
                this.p.noStroke();
                this.p.fill(255, 255, 200);
                this.p.ellipse(cx - 5, cy - 5, 6, 10);
            }
        });
        this.blocks.forEach(block => {
            const bx = block.x;
            const by = block.y - (block.bumpOffset || 0);
            if (this.assets.block) {
                this.p.image(this.assets.block, bx, by);
            } else {
                this.p.fill(255, 204, 0);
                this.p.rect(bx, by, 50, 50);
            }
            this.p.fill(100, 50, 0);
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.textSize(24);
            this.p.textStyle(this.p.BOLD);
            this.p.noStroke();
            this.p.text(block.answer, bx + 27, by + 27); 
            this.p.fill(0);
            this.p.text(block.answer, bx + 25, by + 25);
        });
        this.drawMario();
    }

    drawUI() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA - DRAW UI) ...
        this.p.noStroke();
        this.p.fill(0, 0, 0, 80);
        this.p.rect(25, 25, 380, 160, 15);
        this.p.fill(30, 30, 40, 220);
        this.p.stroke(255, 255, 255, 100);
        this.p.strokeWeight(2);
        this.p.rect(20, 20, 380, 160, 15);
        this.p.noStroke();
        this.p.textAlign(this.p.LEFT, this.p.TOP);
        this.p.fill(255, 215, 0); 
        this.p.textSize(26);
        this.p.textStyle(this.p.BOLD);
        const qText = this.currentQuestion ? `Soal:  ${this.currentQuestion.q} = ?` : "Selesai!";
        this.p.text(qText, 40, 35);
        this.p.stroke(255, 255, 255, 50);
        this.p.strokeWeight(1);
        this.p.line(40, 70, 380, 70);
        this.p.noStroke();
        this.p.fill(255);
        this.p.textSize(18);
        this.p.textStyle(this.p.NORMAL);
        this.p.text(`⭐ Skor: ${this.score}`, 40, 85);
        this.p.text(`🪙 Koin: ${this.coinsCollected}`, 220, 85);
        if (this.lives <= 1) this.p.fill(255, 100, 100);
        else this.p.fill(255);
        this.p.text(`❤️ Nyawa: ${this.lives}`, 40, 115);
        const displayIndex = Math.min(this.questionIndex + 1, this.questions.length);
        this.p.text(`❓ Level: ${displayIndex}/${this.questions.length}`, 220, 115);
        this.p.fill(200);
        this.p.textSize(12);
        this.p.textStyle(this.p.ITALIC);
        this.p.text("Kontrol: Arrow Keys / WASD + Spasi", 40, 150);

        if (this.isAnswering && this.lastAnswerFeedback) {
            const fb = this.lastAnswerFeedback;
            const cx = this.SCREEN_WIDTH / 2;
            const cy = this.SCREEN_HEIGHT / 3;
            this.p.fill(0, 0, 0, 100);
            this.p.rectMode(this.p.CENTER);
            this.p.rect(cx + 5, cy + 5, 320, 140, 10);
            this.p.fill(255);
            this.p.stroke(200);
            this.p.strokeWeight(2);
            this.p.rect(cx, cy, 320, 140, 10);
            this.p.rectMode(this.p.CORNER);
            this.p.noStroke();
            this.p.textSize(40);
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.text(fb.isCorrect ? "🎉" : "❌", cx, cy - 40);
            this.p.textSize(24);
            this.p.textStyle(this.p.BOLD);
            this.p.fill(fb.isCorrect ? "#2ecc71" : "#e74c3c");
            this.p.text(fb.isCorrect ? "JAWABAN BENAR!" : "SALAH!", cx, cy);
            this.p.textSize(16);
            this.p.fill(50);
            this.p.textStyle(this.p.NORMAL);
            if (fb.isCorrect) {
                this.p.text(`+20 Poin!`, cx, cy + 35);
            } else {
                this.p.text(`Jawaban: ${fb.correctAnswer}`, cx, cy + 35);
            }
        }
    }

    drawGameOverScreen() {
        this.p.fill(0, 0, 0, 220);
        this.p.noStroke();
        this.p.rect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.fill(255);
        this.p.textSize(50);
        this.p.textStyle(this.p.BOLD);
        
        let title = "GAME OVER";
        if (this.lives > 0 && this.questionIndex >= this.questions.length) {
            title = "LEVEL COMPLETED!";
        }
        
        this.p.fill(0,0,0,150);
        this.p.text(title, this.SCREEN_WIDTH/2 + 3, this.SCREEN_HEIGHT/2 - 57);
        this.p.fill(255);
        this.p.text(title, this.SCREEN_WIDTH/2, this.SCREEN_HEIGHT/2 - 60);

        this.p.textSize(24);
        this.p.textStyle(this.p.NORMAL);
        this.p.text(`Final Score: ${this.score}`, this.SCREEN_WIDTH/2, this.SCREEN_HEIGHT/2 + 10);
        this.p.text(`Coins: ${this.coinsCollected}`, this.SCREEN_WIDTH/2, this.SCREEN_HEIGHT/2 + 45);
        
        this.p.fill(255, 255, 0);
        this.p.textSize(20);
        this.p.text("[ Tekan R untuk Main Lagi ]", this.SCREEN_WIDTH/2, this.SCREEN_HEIGHT/2 + 100);
    }

    drawMario() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        this.p.push();
        this.p.translate(this.mario.x, this.mario.y);
        if (!this.mario.facingRight) {
            this.p.scale(-1, 1);
            this.p.translate(-this.mario.width, 0);
        }
        const w = this.mario.width;
        const h = this.mario.height;
        this.p.noStroke();
        this.p.fill(230, 0, 0);
        this.p.rect(w*0.1, 0, w*0.8, h*0.15);
        this.p.rect(w*0.1, h*0.25, w*0.8, h*0.45);
        this.p.fill(255, 200, 160);
        this.p.rect(w*0.2, h*0.15, w*0.6, h*0.25);
        this.p.fill(0, 0, 200);
        this.p.rect(w*0.2, h*0.6, w*0.6, h*0.25);
        this.p.fill(100, 50, 0);
        this.p.rect(w*0.1, h*0.85, w*0.3, h*0.15);
        this.p.rect(w*0.6, h*0.85, w*0.3, h*0.15);
        this.p.pop();
    }

    handleInput() {
        this.mario.dx = 0;
        if (this.p.keyIsDown(this.p.RIGHT_ARROW) || this.p.keyIsDown(68)) {
            this.mario.dx = this.MOVE_SPEED;
            this.mario.facingRight = true;
        }
        if (this.p.keyIsDown(this.p.LEFT_ARROW) || this.p.keyIsDown(65)) {
            this.mario.dx = -this.MOVE_SPEED;
            this.mario.facingRight = false;
        }

        const spacePressed = this.p.keyIsDown(32);
        const upPressed = this.p.keyIsDown(this.p.UP_ARROW);
        const wPressed = this.p.keyIsDown(87);

        if ((spacePressed && !this.keyState.space) || (upPressed && !this.keyState.up) || (wPressed && !this.keyState.w)) {
            if (this.mario.isOnGround) {
                this.mario.vy = this.JUMP_POWER;
                this.mario.isOnGround = false;
                this.mario.isJumping = true;
                
                // 3. PLAY JUMP SOUND
                if (this.sounds.jump) this.sounds.jump.play();
            }
        }

        this.keyState.space = spacePressed;
        this.keyState.up = upPressed;
        this.keyState.w = wPressed;
    }

    updateMario() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        this.mario.vy += this.GRAVITY;
        this.mario.y += this.mario.vy;
        this.mario.x += this.mario.dx;
        if (this.mario.y >= this.GROUND_Y - this.mario.height) {
            this.mario.y = this.GROUND_Y - this.mario.height;
            this.mario.vy = 0;
            this.mario.isOnGround = true;
            this.mario.isJumping = false;
        }
        for (let platform of this.platforms) {
            if (this.isOnPlatform(this.mario, platform)) {
                this.mario.y = platform.y - this.mario.height;
                this.mario.vy = 0;
                this.mario.isOnGround = true;
                this.mario.isJumping = false;
                break;
            }
        }
        this.mario.x = this.p.constrain(this.mario.x, 0, this.SCREEN_WIDTH - this.mario.width);
    }

    updateClouds() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x < -150) {
                cloud.x = this.SCREEN_WIDTH + 150;
                cloud.y = this.p.random(this.canvasHeight * 0.05, this.canvasHeight * 0.3);
            }
        });
    }

    updateCoins() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        this.coins.forEach(coin => {
            if (!coin.collected) {
                coin.animation = (coin.animation + 0.1) % (this.p.PI * 2);
            }
        });
    }

    checkQuestionBlocks() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        if (this.mario.vy >= 0) return;
        for (let block of this.blocks) {
            if (this.checkCollision(this.mario, block)) {
                this.mario.vy = 0;
                this.mario.y = block.y + block.height;
                if (this.isAnswering) return;
                this.isAnswering = true;
                block.bumpOffset = 10; 
                const isCorrect = block.answer === this.currentQuestion.a;
                this.lastAnswerFeedback = { isCorrect, answer: block.answer, correctAnswer: this.currentQuestion.a };
                if (isCorrect) this.handleCorrectAnswer();
                else this.handleWrongAnswer();
                break;
            }
        }
    }

    checkCollisions() {
        this.coins.forEach(coin => {
            if (!coin.collected && this.checkCollision(this.mario, coin)) {
                coin.collected = true;
                this.coinsCollected++;
                this.score += 5;
                if (this.callbacks.onScoreChange) this.callbacks.onScoreChange(this.score);
                
                // 4. PLAY COIN SOUND
                if (this.sounds.coin) this.sounds.coin.play();
            }
        });
    }

    handleCorrectAnswer() {
        this.score += 20;
        this.coinsCollected += 2;
        
        // 5. PLAY COIN SOUND (Reward)
        if (this.sounds.coin) this.sounds.coin.play();

        if (this.callbacks.onScoreChange) this.callbacks.onScoreChange(this.score);
        
        setTimeout(() => {
            this.isAnswering = false;
            this.lastAnswerFeedback = null;
            this.questionIndex++;
            if (this.questionIndex >= this.questions.length) {
                this.isGameOver = true; 
                
                // 6. PLAY LEVEL COMPLETE SOUND & STOP BGM
                if (this.sounds.bgm) this.sounds.bgm.stop();
                if (this.sounds.win) this.sounds.win.play();

                if (this.callbacks.onLevelComplete) this.callbacks.onLevelComplete(this.score);
            } else {
                this.loadQuestion();
            }
        }, 1500);
    }

    handleWrongAnswer() {
        this.score = Math.max(0, this.score - 5);
        this.lives--;
        
        // Suara salah/bump bisa ditambahkan disini jika ada (opsional)

        if (this.callbacks.onScoreChange) this.callbacks.onScoreChange(this.score);
        
        if (this.lives <= 0) {
            this.isGameOver = true;
            
            // 7. PLAY GAME OVER SOUND & STOP BGM
            if (this.sounds.bgm) this.sounds.bgm.stop();
            if (this.sounds.gameover) this.sounds.gameover.play();

            if (this.callbacks.onGameOver) this.callbacks.onGameOver(this.score);
        } else {
            setTimeout(() => {
                this.isAnswering = false;
                this.lastAnswerFeedback = null;
                this.resetMarioPosition();
            }, 1500);
        }
    }   

    isOnPlatform(mario, platform) {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        return (
            mario.x + mario.width > platform.x &&
            mario.x < platform.x + platform.width &&
            mario.y + mario.height >= platform.y &&
            mario.y + mario.height <= platform.y + 15 &&
            mario.vy >= 0
        );
    }

    checkCollision(obj1, obj2) {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        );
    }

    resetMarioPosition() {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        this.mario.x = this.canvasWidth * 0.08;
        this.mario.y = this.canvasHeight * 0.7;
        this.mario.vy = 0;
        this.mario.dx = 0;
        this.mario.isOnGround = true;
        this.mario.isJumping = false;
    }

    restart() {
        this.score = 0;
        this.questionIndex = 0;
        this.isGameOver = false;
        this.lives = 3;
        this.coinsCollected = 0;
        this.isAnswering = false;
        this.lastAnswerFeedback = null;
        this.resetMarioPosition();
        this.generateCoins();
        this.loadQuestion();
        
        // 8. RESTART BGM
        if (this.sounds.bgm) {
            this.sounds.bgm.stop();
            this.sounds.bgm.loop();
        }

        if (this.callbacks.onScoreChange) this.callbacks.onScoreChange(this.score);
    }

    updateCanvasSize(newWidth, newHeight) {
        // ... (KODE SAMA SEPERTI SEBELUMNYA) ...
        this.canvasWidth = newWidth;
        this.canvasHeight = newHeight;
        this.SCREEN_WIDTH = newWidth;
        this.SCREEN_HEIGHT = newHeight;
        this.GROUND_Y = newHeight * 0.85;
        this.mario.width = newWidth * 0.04;
        this.mario.height = newHeight * 0.08;
        this.createCachedAssets();
        this.generateLevel();
        this.generateClouds();
        this.loadQuestion();
    }
}