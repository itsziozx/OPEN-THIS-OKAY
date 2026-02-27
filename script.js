// Game state management
let currentScreen = 'loading';
let tetrisGame = null;
let gameScore = 0;
let gameLevel = 1;
let gameLines = 0;
let typewriterInterval = null;
let isTyping = false;
let currentPhotoIndex = 0;
let currentSongIndex = 0;
let isPlaying = false;
let audioContext = null;

// Message content
const fullMessage = `Hi,

Happy Birthday!

Today I want you to experience all the positive things and magic that can only happen when you're in this world. I hope all your wishes come true, especially the funny and unusual ones, because you're so unique! I always believe that you can get through every challenge with your incredible strength and spirit.

Thank you for being the most precious part of my life. You truly make my days more meaningful and colorful. I hope in this new year, you become happier, more successful, and of course more beautiful (even though you're already so beautiful!).

I love you so much! 💕`;

// Photo data
const photos = [
    { text: 'Best Friends Forever 👯', image: './images/photo1.jpg' },
    { text: 'Happy Birthday! 🎂', image: './images/photo2.jpg' },
    { text: 'Crazy Together 🤪', image: './images/photo3.jpg' },
    { text: 'Support System 💪', image: './images/photo4.jpg' },
    { text: 'Laughter & Chaos 😂', image: './images/photo5.jpg' },
    { text: 'Through Thick & Thin 🌈', image: './images/photo6.jpg' },
    { text: 'Celebrating You 🎉', image: './images/photo7.jpg' },
    { text: 'Forever Grateful 🙏', image: './images/photo8.jpg' }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    simulateLoading();
    initializeTetris();
    preloadImages();
}

function preloadImages() {
    photos.forEach(photo => {
        const img = new Image();
        img.src = photo.image;
    });
}

function simulateLoading() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const loadingText = document.getElementById('loading-text');
    
    let progress = 0;
    const messages = [
        'INITIALIZING..._',
        'LOADING MEMORIES..._',
        'PREPARING SURPRISE..._',
        'ALMOST READY..._',
        'LOADING COMPLETE!_'
    ];
    
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';
        
        const msgIndex = Math.floor((progress / 100) * (messages.length - 1));
        loadingText.textContent = '> ' + messages[msgIndex];
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showScreen('main');
            }, 1000);
        }
    }, 200);
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        
        // Initialize screen content
        if (screenId === 'message') initializeMessage();
        if (screenId === 'gallery') initializeGallery();
        if (screenId === 'music') initializeMusic();
        if (screenId === 'tetris' && tetrisGame && !tetrisGame.gameRunning) {
            startTetrisGame();
        }
    }
}

function setupEventListeners() {
    // Menu buttons
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.page;
            showScreen(page);
        });
    });
    
    // Start button
    document.getElementById('start-btn')?.addEventListener('click', () => {
        showScreen('main');
    });
    
    // Skip button
    document.getElementById('skip-btn')?.addEventListener('click', skipMessage);
    
    // Photo button
    document.getElementById('photo-btn')?.addEventListener('click', startPhotoShow);
    
    // Music controls
    document.getElementById('prev-btn')?.addEventListener('click', prevSong);
    document.getElementById('play-pause-btn')?.addEventListener('click', playPause);
    document.getElementById('next-btn')?.addEventListener('click', nextSong);
    
    // Song selection
    document.querySelectorAll('.song').forEach(song => {
        song.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            playSong(index);
        });
    });
    
    // Tetris controls
    document.getElementById('left-btn')?.addEventListener('click', () => moveTetrisPiece(-1));
    document.getElementById('right-btn')?.addEventListener('click', () => moveTetrisPiece(1));
    document.getElementById('rotate-btn')?.addEventListener('click', rotateTetrisPiece);
    
    // Game over modal
    document.getElementById('game-over-ok')?.addEventListener('click', () => {
        document.getElementById('game-over-modal').classList.remove('active');
        showScreen('main');
    });
    
    // Final modal
    document.getElementById('final-ok')?.addEventListener('click', () => {
        document.getElementById('final-message-modal').classList.remove('active');
        showScreen('main');
    });
}

// Message functions
function initializeMessage() {
    if (typewriterInterval) clearInterval(typewriterInterval);
    
    const messageContent = document.getElementById('message-content');
    if (!messageContent) return;
    
    messageContent.innerHTML = '';
    let charIndex = 0;
    isTyping = true;
    
    typewriterInterval = setInterval(() => {
        if (charIndex < fullMessage.length) {
            const char = fullMessage[charIndex];
            messageContent.innerHTML += char === '\n' ? '<br>' : char;
            charIndex++;
            messageContent.scrollTop = messageContent.scrollHeight;
        } else {
            clearInterval(typewriterInterval);
            isTyping = false;
        }
    }, 50);
}

function skipMessage() {
    if (isTyping && typewriterInterval) {
        clearInterval(typewriterInterval);
        const messageContent = document.getElementById('message-content');
        messageContent.innerHTML = fullMessage.replace(/\n/g, '<br>');
        isTyping = false;
    }
}

// Gallery functions
function initializeGallery() {
    const photoDisplay = document.getElementById('photo-display');
    photoDisplay.innerHTML = '<div class="photo-placeholder">Press START PRINT to begin</div>';
    document.getElementById('photobox-progress').textContent = '📸 READY TO PRINT';
    document.getElementById('photo-btn').disabled = false;
    document.getElementById('photo-btn').textContent = 'START PRINT';
    currentPhotoIndex = 0;
}

function startPhotoShow() {
    const photoBtn = document.getElementById('photo-btn');
    const photoDisplay = document.getElementById('photo-display');
    const progressDiv = document.getElementById('photobox-progress');
    
    photoBtn.disabled = true;
    photoBtn.textContent = 'PRINTING...';
    progressDiv.textContent = 'INITIALIZING CAMERA...';
    
    let framesHTML = '';
    for (let i = 0; i < photos.length; i++) {
        framesHTML += `
            <div class="photo-frame" id="frame-${i+1}">
                <div class="photo-content">READY</div>
            </div>
        `;
    }
    
    photoDisplay.innerHTML = `
        <div class="photo-strip">
            <div class="photo-strip-header">PHOTOSTRIP SESSION</div>
            <div class="photo-frames-container" style="max-height:300px; overflow-y:auto;">
                ${framesHTML}
            </div>
            <div class="photo-strip-footer">🎂 HAPPY BIRTHDAY! 🎂</div>
        </div>
    `;
    
    currentPhotoIndex = 0;
    
    let countdown = 3;
    progressDiv.textContent = `GET READY... ${countdown}`;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            progressDiv.textContent = `GET READY... ${countdown}`;
        } else {
            clearInterval(countdownInterval);
            progressDiv.textContent = 'SMILE! 📸';
            startPhotoCapture();
        }
    }, 1000);
}

function startPhotoCapture() {
    const progressDiv = document.getElementById('photobox-progress');
    const framesContainer = document.querySelector('.photo-frames-container');
    
    const captureInterval = setInterval(() => {
        if (currentPhotoIndex < photos.length) {
            const frame = document.getElementById(`frame-${currentPhotoIndex + 1}`);
            
            if (frame) {
                progressDiv.textContent = '✨ FLASH! ✨';
                
                setTimeout(() => {
                    frame.classList.add('filled');
                    const photo = photos[currentPhotoIndex];
                    frame.innerHTML = `
                        <div class="photo-content" style="color:white; text-align:center; padding:10px;">
                            ${photo.text}
                        </div>
                    `;
                    
                    const displayCount = currentPhotoIndex + 1;
                    progressDiv.textContent = `CAPTURED ${displayCount}/${photos.length}`;
                    currentPhotoIndex++;
                }, 500);
            } else {
                currentPhotoIndex++;
            }
        } else {
            clearInterval(captureInterval);
            
            setTimeout(() => {
                progressDiv.textContent = '🎉 PHOTO STRIP COMPLETE! 🎉';
                document.getElementById('photo-btn').textContent = 'PRINT AGAIN';
                document.getElementById('photo-btn').disabled = false;
            }, 2000);
        }
    }, 2000);
}

// Music functions
function initializeMusic() {
    updateNowPlaying();
    document.querySelectorAll('.song').forEach((song, index) => {
        if (index === currentSongIndex) {
            song.classList.add('playing');
        } else {
            song.classList.remove('playing');
        }
    });
}

function playSong(index) {
    if (index < 0 || index >= 5) return;
    
    currentSongIndex = index;
    updateNowPlaying();
    
    document.querySelectorAll('.song').forEach((song, i) => {
        if (i === currentSongIndex) {
            song.classList.add('playing');
        } else {
            song.classList.remove('playing');
        }
    });
    
    // Simulate play
    isPlaying = true;
    document.getElementById('play-pause-btn').textContent = '⏸';
}

function playPause() {
    isPlaying = !isPlaying;
    document.getElementById('play-pause-btn').textContent = isPlaying ? '⏸' : '⏯';
}

function prevSong() {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) newIndex = 4;
    playSong(newIndex);
}

function nextSong() {
    let newIndex = currentSongIndex + 1;
    if (newIndex >= 5) newIndex = 0;
    playSong(newIndex);
}

function updateNowPlaying() {
    const songTitles = [
        'Happy Birthday To You',
        'Best Day Ever',
        'For You My Friend',
        'Celebration',
        'Forever Young'
    ];
    document.getElementById('now-playing').textContent = `🎜 Now Playing: ${songTitles[currentSongIndex]}`;
}

// Tetris functions
function initializeTetris() {
    // Simple Tetris implementation
    tetrisGame = {
        board: Array(20).fill().map(() => Array(10).fill(0)),
        currentPiece: null,
        gameRunning: false,
        score: 0,
        level: 1,
        lines: 0
    };
}

function startTetrisGame() {
    tetrisGame.gameRunning = true;
    gameScore = 0;
    gameLevel = 1;
    gameLines = 0;
    updateTetrisStats();
    drawTetrisBoard();
}

function moveTetrisPiece(direction) {
    if (!tetrisGame?.gameRunning) return;
    // Simplified movement
    console.log('Moving piece:', direction);
}

function rotateTetrisPiece() {
    if (!tetrisGame?.gameRunning) return;
    console.log('Rotating piece');
}

function updateTetrisStats() {
    document.getElementById('score').textContent = gameScore;
    document.getElementById('level').textContent = gameLevel;
    document.getElementById('lines').textContent = gameLines;
}

function drawTetrisBoard() {
    const canvas = document.getElementById('tetris-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#9bbc0f';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 30, 0);
        ctx.lineTo(i * 30, canvas.height);
        ctx.stroke();
    }
    
    for (let i = 0; i <= 20; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 20);
        ctx.lineTo(canvas.width, i * 20);
        ctx.stroke();
    }
    
    // Simulate game over after 10 seconds for demo
    if (!window.gameOverTimer) {
        window.gameOverTimer = setTimeout(() => {
            if (tetrisGame?.gameRunning) {
                gameOver();
            }
        }, 10000);
    }
}

function gameOver() {
    tetrisGame.gameRunning = false;
    clearTimeout(window.gameOverTimer);
    window.gameOverTimer = null;
    
    document.getElementById('game-over-modal').classList.add('active');
    
    // Show final message after game over
    document.getElementById('game-over-ok').onclick = () => {
        document.getElementById('game-over-modal').classList.remove('active');
        document.getElementById('final-message-modal').classList.add('active');
    };
}

// Make showScreen available globally
window.showScreen = showScreen;
