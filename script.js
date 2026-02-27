// Game state management
let currentScreen = 'loading';
let tetrisGame = null;
let gameScore = 0;
let gameLevel = 1;
let gameLines = 0;
let typewriterInterval = null;
let isTyping = false;
let currentPhotoIndex = 0;
let currentMusicIndex = 0;
let isPlaying = false;
let playbackInterval = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    showScreen('loading');
    simulateLoading();
    addEventListeners();
    initializeTetris();
}

function simulateLoading() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.querySelector('.progress-text');
    const loadingText = document.querySelector('.loading-text');
    const loadingScreen = document.getElementById('loading-screen');
    
    let progress = 0;
    const loadingMessages = [
        '&gt; INITIALIZING..._',
        '&gt; LOADING MEMORIES..._',
        '&gt; PREPARING SURPRISE..._',
        '&gt; ALMOST READY..._',
        '&gt; LOADING COMPLETE!_'
    ];
    
    let messageIndex = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random increment between 5-20
        
        if (progress > 100) progress = 100;
        
        // Update progress bar with smooth animation
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.floor(progress) + '%';
        
        // Update loading message based on progress
        const newMessageIndex = Math.floor((progress / 100) * (loadingMessages.length - 1));
        if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length) {
            messageIndex = newMessageIndex;
            
            // Fade out current message
            loadingText.style.opacity = '0';
            
            setTimeout(() => {
                loadingText.innerHTML = loadingMessages[messageIndex];
                loadingText.style.opacity = '1';
            }, 200);
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Add completion animation
            loadingScreen.classList.add('loading-complete');
            
            // Wait for completion animation, then transition
            setTimeout(() => {
                transitionToMainScreen();
            }, 1000);
        }
    }, 200);
}

function transitionToMainScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainScreen = document.getElementById('main-screen');
    
    // Start fade out animation for loading screen
    loadingScreen.classList.add('fade-out');
    
    // After fade out completes, show main screen
    setTimeout(() => {
        loadingScreen.classList.remove('active', 'fade-out', 'loading-complete');
        
        // Show main screen with entrance animation
        mainScreen.classList.add('active', 'screen-entering');
        currentScreen = 'main';
        
        // Add staggered animations for elements
        setTimeout(() => {
            initializeMainScreen();
        }, 100);
        
        // Remove entrance class after animation
        setTimeout(() => {
            mainScreen.classList.remove('screen-entering');
        }, 1200);
        
    }, 600);
}

function initializeMainScreen() {
    // Add interactive elements and event listeners
    const menuButtons = document.querySelectorAll('.menu-btn');
    const startBtn = document.querySelector('.start-btn');
    
    // Add button click animations
    menuButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Start button functionality
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // Could trigger some action here
            }, 150);
        });
    }
    
    // Add hover effects for menu buttons
    menuButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function showScreen(screenName) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenName;
        
        // Initialize screen-specific content
        switch(screenName) {
            case 'message':
                setTimeout(() => {
                    initializeMessage();
                }, 100);
                break;
            case 'gallery':
                setTimeout(() => {
                    initializeGallery();
                }, 100);
                break;
            case 'music':
                setTimeout(() => {
                    initializeMusicPlayer();
                }, 100);
                break;
            case 'tetris':
                setTimeout(() => {
                    if (tetrisGame && !tetrisGame.gameRunning) {
                        startTetrisGame();
                    }
                }, 100);
                break;
        }
    }
}

// Message Page Functions
function initializeMessage() {
    // Clear any existing typewriter interval
    if (typewriterInterval) {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
    }
    
    const messageScreen = document.getElementById('message-screen');
    if (!messageScreen) return;
    
    // Create or update the message screen content
    const pageScreen = messageScreen.querySelector('.page-screen');
    if (pageScreen) {
        pageScreen.innerHTML = `
            <div class="page-header">Message</div>
            <div class="message-content">
                <!-- Content will be populated by typewriter -->
            </div>
            <button class="skip-btn">SKIP</button>
        `;
        
        // Add skip button event listener
        const skipBtn = pageScreen.querySelector('.skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', skipTypewriter);
        }
    }
    
    // Start typewriter effect
    setTimeout(() => {
        startTypewriter();
    }, 300);
}

function startTypewriter() {
    const messageContent = document.querySelector('.message-content');
    if (!messageContent) return;
    
    const fullMessage = `Hi,

Happy Birthday!
l
Hi, Miyu — or as I often call you, Mango.

But because I suddenly realized: we've come this far together, and I don't think I've ever thanked you properly.

Thank you for being such a... weird friend.
In the most positive way possible.

You're so kind. Sometimes I think, "How can Mango be this patient with me?"
Patient — even though I know I sometimes annoy you with the same old antics.

You're also loud. Super loud.
When we hang out, there's never a dull moment. Your voice is like the most comforting background noise in my life.
Chatty, talkative, love to nag. But somehow, when I don't hear your voice, something feels missing.

Caring. So much.
Down to the little things others don't notice.
You always know when to send a message, when to show up, when to just sit beside me in silence.

Attentive. Sometimes it makes me think, "Wow, Mango really looks out for me."
You're beautiful — that's a fact.
But what makes you different isn't just your looks, but the way you see the world: always finding room to laugh, even in the hardest times.

Funny, humorous, love to joke.
You're the type of person who can make people mad, but also make them forget why they were angry.
Because beneath all your randomness, there's a heart that's incredibly sincere.

You don't dwell on things — that's what I admire most.
You're the type who says, "Problem? Okay, next." Not because you don't feel, but because you choose not to drown. And that's really cool.

Most importantly: you always make my day colorful.
Even on the grayest days, you show up — through chats, through stories, through your random antics — and everything becomes a little brighter.

Thank you for being a place to come home to, a place to share stories, a place to laugh, a place to cry, and a place to just be myself without fear of judgment.

Thank you for choosing to be my friend, out of thousands of people.

I love you, Mango — as a friend.
Never change.
Keep being you — annoying, loud, funny, caring, and always making life a little less quiet.

— From someone who's always proud of you,  
ItsZio & Uncle Vic 💕`;
    
    // Clear content and start fresh
    messageContent.innerHTML = '';
    let charIndex = 0;
    isTyping = true;
    
    // Clear any existing interval
    if (typewriterInterval) {
        clearInterval(typewriterInterval);
    }
    
    typewriterInterval = setInterval(() => {
        if (charIndex < fullMessage.length) {
            const char = fullMessage[charIndex];
            if (char === '\n') {
                messageContent.innerHTML += '<br>';
            } else {
                messageContent.innerHTML += char;
            }
            charIndex++;
            // Auto scroll to bottom
            messageContent.scrollTop = messageContent.scrollHeight;
        } else {
            clearInterval(typewriterInterval);
            isTyping = false;
        }
    }, 50);
}

function skipTypewriter() {
    if (isTyping && typewriterInterval) {
        clearInterval(typewriterInterval);
        const messageContent = document.querySelector('.message-content');
        if (messageContent) {
            const fullMessage = `Hi Cel,<br><br>Happy Birthday!<br><br>Today I want you to experience all the positive things and magic that can only happen when you're in this world. I hope all your wishes come true, especially the funny and unusual ones, because you're so unique! I always believe that you can get through every challenge with your incredible strength and spirit.<br><br>Thank you for being the most precious part of my life. You truly make my days more meaningful and colorful. I hope in this new year, you become happier, more successful, and of course more beautiful (even though you're already so beautiful!).<br><br>I love you so much! 💕`;
            messageContent.innerHTML = fullMessage;
            isTyping = false;
            messageContent.scrollTop = messageContent.scrollHeight;
        }
    }
}

// Gallery Functions
function initializeGallery() {
    const galleryContent = document.querySelector('.gallery-content');
    if (!galleryContent) return;
    
    // Clear existing content
    galleryContent.innerHTML = '';
    
    // Create gallery structure
    const galleryHTML = `
        <div class="photobox-header">
            <div class="photobox-dot red"></div>
            <span class="photobox-title">PHOTOBOX</span>
            <div class="photobox-dot green"></div>
        </div>
        <div class="photobox-progress">READY TO PRINT</div>
        <div class="photo-display">
            <div class="photo-placeholder">Press START PRINT to begin photo session</div>
        </div>
        <div class="photobox-controls">
            <button class="photo-btn">START PRINT</button>
        </div>
    `;
    
    galleryContent.innerHTML = galleryHTML;
    
    // Add event listener for photo button after DOM is updated
    setTimeout(() => {
        const photoBtn = document.querySelector('.photo-btn');
        if (photoBtn) {
            photoBtn.addEventListener('click', startPhotoShow);
            console.log('Photo button found and listener added'); // Debug log
        } else {
            console.log('Photo button not found'); // Debug log
        }
    }, 100);
}

function startPhotoShow() {
    const photoBtn = document.querySelector('.photo-btn');
    const photoDisplay = document.querySelector('.photo-display'); 
    const progressDiv = document.querySelector('.photobox-progress');
    
    if (!photoBtn || !photoDisplay || !progressDiv) return;
    
    // Local photos from images folder
    const photos = [
        {
            text: 'OUR MEMORY TRIO😎❤️',
            image: './images/photo1.jpg'
        },
        {
            text: 'OUR MEMORY TRIO😡🤗',
            image: './images/photo2.jpg'
        },
        {
            text: 'OUR MEMORY TRIO🥳🌚',
            image: './images/photo3.jpg'
        },
        {
            text: 'OUR MEMORY TRIO🥔🔥',
            image: './images/photo4.jpg'
        },
        {
            text: 'OUR MEMORY TRIO🎈🤩',
            image: './images/photo5.jpg'
        },
        {
            text: 'OUR MEMORY TRIO😈🌝',
            image: './images/photo6.jpg'
        },
        {
            text: 'OUR MEMORY TRIO👯‍♀️🎂',
            image: './images/photo7.jpg'
        },
        {
            text: 'OUR MEMORY TRIO💥😜',
            image: './images/photo8.jpg'
        }
    ];
    
    console.log('Total photos:', photos.length);
    
    photoBtn.textContent = 'PRINTING...';
    photoBtn.disabled = true;
    progressDiv.textContent = 'INITIALIZING CAMERA...';
    
    // Create photo frames HTML
    let framesHTML = '';
    for (let i = 0; i < photos.length; i++) {
        framesHTML += `
            <div class="photo-frame" id="frame-${i + 1}">
                <div class="photo-content">READY</div>
            </div>
        `;
    }
    
    // Create vertical photo strip container
    const photoStripHTML = `
        <div class="photo-strip">
            <div class="photo-strip-header">PHOTOSTRIP SESSION</div>
            <div class="photo-frames-container">
                ${framesHTML}
            </div>
            <div class="photo-strip-footer">💕 BIRTHDAY MEMORIES 💕</div>
        </div>
        <div class="scroll-indicator">⬇ Scroll Down ⬇</div>
    `;
    
    photoDisplay.innerHTML = photoStripHTML;
    currentPhotoIndex = 0;
    
    // Countdown before starting
    let countdown = 3;
    progressDiv.textContent = `GET READY... ${countdown}`;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            progressDiv.textContent = `GET READY... ${countdown}`;
        } else {
            clearInterval(countdownInterval);
            progressDiv.textContent = 'SMILE! 📸';
            startPhotoCapture(photos);
        }
    }, 1000);
}

function startPhotoCapture(photos) {
    const progressDiv = document.querySelector('.photobox-progress');
    const photoBtn = document.querySelector('.photo-btn');
    const photoDisplay = document.querySelector('.photo-display');
    const framesContainer = document.querySelector('.photo-frames-container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    console.log('Starting photo capture. Initial currentPhotoIndex:', currentPhotoIndex);
    console.log('Total photos to capture:', photos.length);
    
    const captureInterval = setInterval(() => {
        console.log('=== CAPTURE LOOP ===');
        console.log('Current photo index:', currentPhotoIndex);
        console.log('Photos remaining:', photos.length - currentPhotoIndex);
        
        if (currentPhotoIndex < photos.length) {
            const frameId = `frame-${currentPhotoIndex + 1}`;
            const frame = document.getElementById(frameId);
            
            console.log('Processing frame:', frameId);
            console.log('Photo content:', photos[currentPhotoIndex]);
            
            if (frame) {
                // Flash effect
                progressDiv.textContent = '✨ FLASH! ✨';
                
                // Auto scroll to current photo
                setTimeout(() => {
                    if (framesContainer) {
                        try {
                            const frameTop = frame.offsetTop - framesContainer.offsetTop;
                            const containerHeight = framesContainer.clientHeight;
                            const frameHeight = frame.clientHeight;
                            
                            const scrollPosition = frameTop - (containerHeight / 2) + (frameHeight / 2);
                            
                            framesContainer.scrollTo({
                                top: scrollPosition,
                                behavior: 'smooth'
                            });
                        } catch (error) {
                            console.log('Scroll error:', error);
                            const frameTop = frame.offsetTop - framesContainer.offsetTop;
                            framesContainer.scrollTop = frameTop - (framesContainer.clientHeight / 2);
                        }
                    }
                }, 200);
                
                // Update frame content with image
                setTimeout(() => {
                    frame.classList.add('filled');
                    
                    const photo = photos[currentPhotoIndex];
                    frame.innerHTML = `
                        <img src="${photo.image}" alt="${photo.text}" class="photo-image" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.background='linear-gradient(45deg, #ff6b9d, #c44569)';" />
                        <div class="photo-overlay">
                            <div class="photo-content">${photo.text}</div>
                        </div>
                    `;
                    
                    const displayCount = currentPhotoIndex + 1;
                    progressDiv.textContent = `CAPTURED ${displayCount}/${photos.length}`;
                    
                    console.log('Photo captured. Showing:', displayCount, 'of', photos.length);
                    
                    if (currentPhotoIndex < photos.length - 1 && scrollIndicator) {
                        scrollIndicator.style.display = 'block';
                    }
                    
                    currentPhotoIndex++;
                    console.log('Index incremented to:', currentPhotoIndex);
                    
                }, 500);
            } else {
                console.error(`Frame with ID ${frameId} not found`);
                currentPhotoIndex++;
            }
            
        } else {
            console.log('=== ALL PHOTOS COMPLETED ===');
            clearInterval(captureInterval);
            
            if (scrollIndicator) {
                scrollIndicator.style.display = 'none';
            }
            
            setTimeout(() => {
                if (framesContainer) {
                    try {
                        framesContainer.scrollTo({ top: 0, behavior: 'smooth' });
                    } catch (error) {
                        framesContainer.scrollTop = 0;
                    }
                }
            }, 1000);
            
            setTimeout(() => {
                progressDiv.textContent = '🎉 PHOTO STRIP COMPLETE! 🎉';
                photoBtn.textContent = 'PRINT AGAIN';
                photoBtn.disabled = false;
                
                photoBtn.removeEventListener('click', startPhotoShow);
                photoBtn.addEventListener('click', startNewSession);
            }, 2000);
        }
    }, 2500);
}

function startNewSession() {
    const photoBtn = document.querySelector('.photo-btn');
    const progressDiv = document.querySelector('.photobox-progress');
    
    console.log('=== STARTING NEW SESSION ===');
    
    // Reset for new session
    progressDiv.textContent = 'READY TO PRINT';
    photoBtn.textContent = 'START PRINT';
    
    // Remove old listener and add original
    photoBtn.removeEventListener('click', startNewSession);
    photoBtn.addEventListener('click', startPhotoShow);
    
    // Clear display
    const photoDisplay = document.querySelector('.photo-display');
    if (photoDisplay) {
        photoDisplay.innerHTML = '<div class="photo-placeholder">Press START PRINT to begin photo session</div>';
    }
    
    // CRITICAL: Reset photo index to exactly 0
    currentPhotoIndex = 0;
    
    console.log('Session reset. Photo index:', currentPhotoIndex);
}


// Music Player Functions
function initializeMusicPlayer() {
    const musicContent = document.querySelector('.music-content');
    if (!musicContent) return;
    
    musicContent.innerHTML = `
        <div class="spotify-container">
            <div class="spotify-header">
                <div class="spotify-logo">♪ Spotify Playlists</div>
            </div>
            <div class="spotify-embed-container">
                <iframe id="spotify-iframe" 
                        style="border-radius:12px" 
                        src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator" 
                        width="100%" 
                        height="200" 
                        frameBorder="0" 
                        allowfullscreen="" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
               