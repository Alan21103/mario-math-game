// export default class GameUI {
//     constructor(p, game) {
//         this.p = p;
//         this.game = game; // Referensi ke GameEngine untuk akses skor, nyawa, dll

//         // CACHE DOM ELEMENTS
//         // Kita simpan referensi elemen HTML di awal agar tidak perlu mencari (query) ulang setiap frame.
//         // Ini jauh lebih efisien untuk performa.
//         this.els = {
//             // HUD Elements
//             question: document.getElementById('question-display'),
//             score: document.getElementById('score-val'),
//             coins: document.getElementById('coins-val'),
//             lives: document.getElementById('lives-val'),
//             progress: document.getElementById('progress-val'),
            
//             // Feedback Modal Elements
//             feedbackModal: document.getElementById('feedback-modal'),
//             feedbackTitle: document.getElementById('feedback-title'),
//             feedbackDetail: document.getElementById('feedback-detail'),
//             feedbackReward: document.getElementById('feedback-reward'),
            
//             // Game Over Modal Elements
//             gameOverModal: document.getElementById('game-over-modal'),
//             goTitle: document.getElementById('go-title'),
//             goMessage: document.getElementById('go-message'),
//             finalScore: document.getElementById('final-score'),
//             finalCoins: document.getElementById('final-coins')
//         };
//     }

//     render() {
//         // Method ini dipanggil 60 kali per detik dari GameEngine.draw()
//         // Tugasnya memastikan teks di layar sesuai dengan data di GameEngine
        
//         // Cek dulu apakah element sudah siap (untuk mencegah error saat loading awal React)
//         if (!this.els.score) return;

//         this.updateHUD();
//         this.updateFeedback();
//         this.updateGameOver();
//     }

//     updateHUD() {
//         // Update Soal
//         if (this.game.currentQuestion) {
//             this.els.question.innerText = `Soal: ${this.game.currentQuestion.q} = ?`;
//         } else {
//             this.els.question.innerText = "Loading...";
//         }

//         // Update Statistik
//         this.els.score.innerText = this.game.score;
//         this.els.coins.innerText = this.game.coinsCollected;
//         this.els.lives.innerText = this.game.lives;
        
//         // Update Progres (Contoh: 1/5)
//         // Mencegah error division by zero atau array kosong
//         const totalQ = this.game.questions ? this.game.questions.length : 0;
//         this.els.progress.innerText = `${this.game.questionIndex + 1}/${totalQ}`;
        
//         // Efek Visual: Ubah warna nyawa jadi merah jika tinggal 1
//         if (this.game.lives <= 1) {
//             this.els.lives.style.color = '#ff4444'; // Merah terang
//             this.els.lives.style.textShadow = '0 0 10px red';
//         } else {
//             this.els.lives.style.color = 'white';
//             this.els.lives.style.textShadow = 'none';
//         }
//     }

//     updateFeedback() {
//         // Logika untuk menampilkan Pop-up Benar/Salah
        
//         // Jika sedang menjawab DAN ada data feedback
//         if (this.game.isAnswering && this.game.lastAnswerFeedback) {
//             const feedback = this.game.lastAnswerFeedback;
            
//             // Tampilkan modal (hapus class hidden)
//             this.els.feedbackModal.classList.remove('hidden');
            
//             if (feedback.isCorrect) {
//                 // Styling untuk Benar
//                 this.els.feedbackTitle.innerText = "✅ JAWABAN BENAR!";
//                 this.els.feedbackTitle.className = "correct"; // Class CSS untuk warna hijau
//                 this.els.feedbackDetail.innerText = `Jawaban kamu: ${feedback.answer}`;
//                 this.els.feedbackReward.innerText = "+20 Poin, +2 Koin";
//             } else {
//                 // Styling untuk Salah
//                 this.els.feedbackTitle.innerText = "❌ JAWABAN SALAH!";
//                 this.els.feedbackTitle.className = "wrong"; // Class CSS untuk warna merah
//                 this.els.feedbackDetail.innerText = `Kamu jawab: ${feedback.answer} (Harusnya: ${feedback.correctAnswer})`;
//                 this.els.feedbackReward.innerText = "-5 Poin, -1 Nyawa";
//             }
//         } else {
//             // Sembunyikan modal jika tidak sedang menjawab
//             this.els.feedbackModal.classList.add('hidden');
//         }
//     }

//     updateGameOver() {
//         // Logika untuk menampilkan Layar Game Over / Level Complete
        
//         if (this.game.isGameOver) {
//             this.els.gameOverModal.classList.remove('hidden');
            
//             // Set konten teks berdasarkan kondisi menang/kalah
//             if (this.game.lives <= 0) {
//                 this.els.goTitle.innerText = "GAME OVER";
//                 this.els.goTitle.style.color = "#e74c3c"; // Merah
//                 this.els.goMessage.innerText = "Yah, nyawa kamu habis! Coba lagi ya.";
//             } else {
//                 this.els.goTitle.innerText = "LEVEL SELESAI!";
//                 this.els.goTitle.style.color = "#2ecc71"; // Hijau
//                 this.els.goMessage.innerText = "Hebat! Kamu menjawab semua soal!";
//             }

//             // Set skor akhir
//             this.els.finalScore.innerText = this.game.score;
//             this.els.finalCoins.innerText = this.game.coinsCollected;
//         } else {
//             // Sembunyikan modal jika game masih berjalan
//             this.els.gameOverModal.classList.add('hidden');
//         }
//     }
// // }