// src/p5/GameEngine.js (VERSI STABIL ULANG)

// --- KONSTANTA GAME ---
const GRAVITY = 0.8;
const JUMP_STRENGTH = -15;
const MARIO_SPEED = 5; 
const MARIO_SIZE = 30; 
const GROUND_Y = 300; 
const CANVAS_W = 800; 
const CANVAS_H = 400; 
const BLOCK_SIZE = 40;

export default class GameEngine {
    constructor(p, levelData, callbacks) {
        this.p = p;
        this.questions = levelData;
        this.callbacks = callbacks; 

        // State Game
        this.score = 0;
        this.questionIndex = 0;
        this.isGameOver = false;

        // Karakter (Mario)
        this.mario = { x: 50, y: GROUND_Y, vy: 0, isOnGround: true, dx: 0 }; 
        this.blocks = [];
        this.inputState = { left: false, right: false, jump: false }; 

        this.p.setup = this.setup.bind(this);
        this.p.draw = this.draw.bind(this);
    }

    // FUNGSI UNTUK MENERIMA INPUT DARI REACT
    updateInputState(newInput) {
        if (newInput) {
            this.inputState = newInput;
        }
    }

    setup() {
        this.p.createCanvas(CANVAS_W, CANVAS_H);
        this.p.textFont('Arial', 24);
        this.loadQuestion();
    }

    loadQuestion() {
        if (this.questionIndex >= this.questions.length) {
            this.isGameOver = true;
            this.callbacks.onLevelComplete(this.score);
            return;
        }

        const currentQ = this.questions[this.questionIndex];
        const options = [...currentQ.options].sort(() => 0.5 - Math.random()); 

        // Posisi Blok di tengah/kanan (HANYA SATU SET)
        const startX = (CANVAS_W / 2) - BLOCK_SIZE * 1.5; 

        this.blocks = [
            { id: 0, x: startX, y: 150, answer: options[0] },
            { id: 1, x: startX + BLOCK_SIZE * 1.5, y: 150, answer: options[1] },
            { id: 2, x: startX + BLOCK_SIZE * 3, y: 150, answer: options[2] },
        ];

        // Reset posisi Mario ke KIRI (x=50)
        this.mario.x = 50; 
        this.mario.y = GROUND_Y;
        this.mario.vy = 0;
        this.mario.isOnGround = true;
        this.mario.dx = 0;
    }

    updateMario() {
        const input = this.inputState;
        
        this.mario.dx = 0;
        if (input.right) {
            this.mario.dx = MARIO_SPEED;
        } else if (input.left) {
            this.mario.dx = -MARIO_SPEED;
        }

        if (input.jump && this.mario.isOnGround) {
            this.mario.vy = JUMP_STRENGTH;
            this.mario.isOnGround = false;
        }
        
        this.mario.vy += GRAVITY;
        this.mario.y += this.mario.vy;
        this.mario.x += this.mario.dx; 

        if (this.mario.y >= GROUND_Y) {
            this.mario.y = GROUND_Y;
            this.mario.vy = 0;
            this.mario.isOnGround = true;
        }

        if (this.mario.x < 0) {
            this.mario.x = 0;
        } else if (this.mario.x + MARIO_SIZE > CANVAS_W) {
            this.mario.x = CANVAS_W - MARIO_SIZE;
        }
    }

    checkCollision() {
        if (this.mario.vy < 0) { 
            this.blocks.forEach(block => {
                const isColliding = (
                    this.mario.x < block.x + BLOCK_SIZE &&
                    this.mario.x + MARIO_SIZE > block.x &&
                    this.mario.y < block.y + BLOCK_SIZE && 
                    this.mario.y + MARIO_SIZE > block.y + BLOCK_SIZE 
                );

                if (isColliding) {
                    this.mario.vy = 0; 
                    
                    const currentQ = this.questions[this.questionIndex];
                    if (block.answer === currentQ.a) {
                        this.score += 10;
                        this.callbacks.onScoreChange(this.score);
                        this.questionIndex++;
                        this.loadQuestion();
                    } else {
                        this.score -= 5;
                        this.callbacks.onScoreChange(this.score);
                    }
                }
            });
        }
    }

    draw() {
        if (this.isGameOver) {
            this.p.background(0);
            this.p.fill(255);
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.text('LEVEL SELESAI!', CANVAS_W / 2, CANVAS_H / 2);
            return;
        }

        this.p.background(92, 148, 252); 
        
        this.p.fill(150, 75, 0); 
        this.p.rect(0, GROUND_Y + 30, CANVAS_W, CANVAS_H - GROUND_Y);

        this.updateMario(); 
        this.checkCollision();

        this.p.fill(255, 0, 0); 
        this.p.rect(this.mario.x, this.mario.y, MARIO_SIZE, MARIO_SIZE); 

        this.p.fill(255);
        this.p.textAlign(this.p.LEFT, this.p.TOP);
        const currentQ = this.questions[this.questionIndex];
        this.p.text(`Soal: ${currentQ.q} = ?`, 10, 10);
        this.p.text(`Skor: ${this.score}`, 10, 40);

        this.blocks.forEach(block => {
            this.p.fill(255, 204, 0); 
            this.p.rect(block.x, block.y, BLOCK_SIZE, BLOCK_SIZE);
            this.p.fill(0);
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.text(block.answer, block.x + BLOCK_SIZE / 2, block.y + BLOCK_SIZE / 2);
        });
    }
}