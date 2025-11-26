// src/p5/GameEngine.js - VERSI INPUT P5.JS LANGSUNG
export default class GameEngine {
    constructor(p, levelData, callbacks) {
        this.p = p;
        this.questions = levelData || [];
        this.callbacks = callbacks; 

        // State Game
        this.score = 0;
        this.questionIndex = 0;
        this.isGameOver = false;

        // Karakter (Mario)
        this.mario = { 
            x: 50, 
            y: 300, 
            vy: 0, 
            isOnGround: true, 
            dx: 0,
            width: 30,
            height: 30
        }; 
        
        this.blocks = [];

        // Constants
        this.GRAVITY = 0.8;
        this.JUMP_POWER = -15;
        this.MOVE_SPEED = 5;
        this.GROUND_Y = 300;
        
        console.log('🎮 GameEngine initialized - Using P5.js direct input');
    }

    setup() {
        console.log('🎯 GameEngine Setup');
        this.loadQuestion();
    }

    // METHOD INI TIDAK DIPAKAI LAGI - input dihandle langsung di update()
    updateInputState(newInput) {
        // Kosongkan - kita pakai input langsung dari p5.js
    }

    update() {
        this.handleInput(); // Handle input langsung di p5.js
        this.updateMario();
        this.checkCollision();
    }

    handleInput() {
        // RESET movement
        this.mario.dx = 0;
        
        // HANDLE INPUT LANGSUNG dari p5.js
        if (this.p.keyIsDown(this.p.RIGHT_ARROW) || this.p.keyIsDown(68)) { // D key
            this.mario.dx = this.MOVE_SPEED;
        }
        if (this.p.keyIsDown(this.p.LEFT_ARROW) || this.p.keyIsDown(65)) { // A key
            this.mario.dx = -this.MOVE_SPEED;
        }
        
        // HANDLE JUMP - hanya sekali saat tombol ditekan
        if ((this.p.keyIsDown(32) || this.p.keyIsDown(this.p.UP_ARROW) || this.p.keyIsDown(13)) && this.mario.isOnGround) {
            this.mario.vy = this.JUMP_POWER;
            this.mario.isOnGround = false;
        }
    }

    updateMario() {
        // APPLY gravity
        this.mario.vy += this.GRAVITY;
        
        // UPDATE position
        this.mario.y += this.mario.vy;
        this.mario.x += this.mario.dx;

        // GROUND collision
        if (this.mario.y >= this.GROUND_Y) {
            this.mario.y = this.GROUND_Y;
            this.mario.vy = 0;
            this.mario.isOnGround = true;
        }

        // SCREEN boundaries
        this.mario.x = this.p.constrain(this.mario.x, 0, 800 - this.mario.width);
    }

    // ... method checkCollision, loadQuestion, draw tetap sama seperti sebelumnya ...
    checkCollision() {
        if (this.mario.vy >= 0) return;

        for (let block of this.blocks) {
            const collision = (
                this.mario.x < block.x + 40 &&
                this.mario.x + this.mario.width > block.x &&
                this.mario.y < block.y + 40 &&
                this.mario.y + this.mario.height > block.y
            );
            
            if (collision) {
                this.mario.vy = 0;
                this.mario.y = block.y + 40;
                
                const currentQ = this.questions[this.questionIndex];
                if (block.answer === currentQ.a) {
                    this.score += 10;
                    this.questionIndex++;
                    if (this.callbacks.onScoreChange) this.callbacks.onScoreChange(this.score);
                    this.loadQuestion();
                } else {
                    this.score = Math.max(0, this.score - 5);
                    if (this.callbacks.onScoreChange) this.callbacks.onScoreChange(this.score);
                }
                break;
            }
        }
    }

    loadQuestion() {
        if (this.questionIndex >= this.questions.length) {
            this.isGameOver = true;
            if (this.callbacks.onLevelComplete) this.callbacks.onLevelComplete(this.score);
            return;
        }

        const currentQ = this.questions[this.questionIndex];
        const options = [...currentQ.options].sort(() => Math.random() - 0.5);
        const startX = 400 - 60;

        this.blocks = [
            { x: startX, y: 150, answer: options[0] },
            { x: startX + 80, y: 150, answer: options[1] },
            { x: startX + 160, y: 150, answer: options[2] },
        ];

        // Reset Mario
        this.mario.x = 50;
        this.mario.y = this.GROUND_Y;
        this.mario.vy = 0;
        this.mario.dx = 0;
        this.mario.isOnGround = true;
    }

    draw() {
        if (this.isGameOver) {
            this.p.background(0);
            this.p.fill(255);
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.textSize(32);
            this.p.text('LEVEL SELESAI!', 400, 180);
            this.p.textSize(24);
            this.p.text(`Skor Akhir: ${this.score}`, 400, 220);
            return;
        }

        this.p.background(92, 148, 252);
        this.p.fill(150, 75, 0);
        this.p.rect(0, 330, 800, 70);

        this.p.fill(255, 0, 0);
        this.p.rect(this.mario.x, this.mario.y, this.mario.width, this.mario.height);

        this.p.fill(255);
        this.p.textAlign(this.p.LEFT, this.p.TOP);
        const currentQ = this.questions[this.questionIndex];
        this.p.text(`Soal: ${currentQ.q} = ?`, 10, 10);
        this.p.text(`Skor: ${this.score}`, 10, 40);

        this.blocks.forEach(block => {
            this.p.fill(255, 204, 0);
            this.p.rect(block.x, block.y, 40, 40);
            this.p.fill(0);
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.text(block.answer, block.x + 20, block.y + 20);
        });
    }
}