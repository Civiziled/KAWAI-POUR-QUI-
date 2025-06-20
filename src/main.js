// Configuration du jeu
const images = [
    "bunny", "dog", "fox", "mouse", "owl", "whale",
    "alpaca", "cat", "chick", "hedgehog", "koala",
    "panda", "parrot", "penguin", "raccoon",
    "shark", "sloth", "tiger"
];

// Variables globales
let boardState = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let timer = 0;
let timerInterval = null;
let currentDifficulty = 'easy';
let matchedPairs = 0;
let totalPairs = 0;

// Configuration des difficultés
const difficulties = {
    easy: { rows: 4, cols: 4, pairs: 8 },
    medium: { rows: 6, cols: 6, pairs: 18 },
    hard: { rows: 8, cols: 8, pairs: 32 }
};

// Éléments DOM
const homeScreen = document.getElementById('homeScreen');
const gameScreen = document.getElementById('gameScreen');
const winScreen = document.getElementById('winScreen');
const gameBoard = document.getElementById('gameBoard');
const movesCount = document.getElementById('movesCount');
const timerElement = document.getElementById('timer');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');

// Événements
document.getElementById('playButton').addEventListener('click', startGame);
document.getElementById('homeButton').addEventListener('click', goHome);
document.getElementById('restartButton').addEventListener('click', restartGame);

// Sélecteurs de difficulté (maintenant dans le menu principal)
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentDifficulty = e.target.dataset.difficulty;
    });
});

// Fonctions principales
function startGame() {
    resetGame();
    showScreen(gameScreen);
    createBoard();
    startTimer();
    playSound('start');
}

function goHome() {
    stopTimer();
    showScreen(homeScreen);
    playSound('click');
}

function restartGame() {
    startGame();
    playSound('restart');
}

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function resetGame() {
    moves = 0;
    timer = 0;
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    updateDisplay();
}

function createBoard() {
    const config = difficulties[currentDifficulty];
    totalPairs = config.pairs;
    
    // Sélectionner les images pour cette partie
    const selectedImages = images.slice(0, config.pairs);
    
    // Créer le tableau avec deux exemplaires de chaque image
    boardState = [...selectedImages, ...selectedImages];
    
    // Mélanger le tableau
    boardState.sort(() => Math.random() - 0.5);
    
    // Configurer la grille CSS
    gameBoard.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${config.rows}, 1fr)`;
    
    // Créer les cartes
    gameBoard.innerHTML = '';
    boardState.forEach((image, index) => {
        const card = createCard(image, index);
        gameBoard.appendChild(card);
    });
    
    // Animation d'apparition des cartes
    setTimeout(() => {
        animateCards();
    }, 100);
}

function createCard(image, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.image = image;
    card.dataset.index = index;
    
    const backImagePath = `/images/animals/back.jpeg`;
    const frontImagePath = `/images/animals/${image}.jpeg`;
    
    console.log(`Création de carte ${index}: ${image} - Chemin: ${frontImagePath}`);
    
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <img src="${backImagePath}" alt="Dos de carte" onerror="console.error('Erreur chargement dos:', this.src)">
            </div>
            <div class="card-back">
                <img src="${frontImagePath}" alt="${image}" onerror="console.error('Erreur chargement face:', this.src)">
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function flipCard(card) {
    if (lockBoard || card.classList.contains('flipped') || card === firstCard) {
        return;
    }
    
    card.classList.add('flipped');
    playSound('flip');
    
    if (!firstCard) {
        firstCard = card;
        return;
    }
    
    secondCard = card;
    moves++;
    updateDisplay();
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;
    
    if (isMatch) {
        matchedPairs++;
        playSound('match');
        createMatchEffect(firstCard, secondCard);
        
        firstCard.style.pointerEvents = 'none';
        secondCard.style.pointerEvents = 'none';
        resetTurn();
        
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                endGame();
            }, 1000);
        }
    } else {
        lockBoard = true;
        playSound('wrong');
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetTurn();
        }, 1000);
    }
}

function createMatchEffect(card1, card2) {
    // Créer des particules de célébration
    const particles = 10;
    for (let i = 0; i < particles; i++) {
        createParticle(card1);
        createParticle(card2);
    }
    
    // Animation de victoire pour les cartes
    card1.style.animation = 'celebrate 0.6s ease-in-out';
    card2.style.animation = 'celebrate 0.6s ease-in-out';
    
    setTimeout(() => {
        card1.style.animation = '';
        card2.style.animation = '';
    }, 600);
}

function createParticle(card) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: particle 1s ease-out forwards;
    `;
    
    const rect = card.getBoundingClientRect();
    const gameRect = gameBoard.getBoundingClientRect();
    
    particle.style.left = (rect.left - gameRect.left + rect.width / 2) + 'px';
    particle.style.top = (rect.top - gameRect.top + rect.height / 2) + 'px';
    
    gameBoard.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function updateDisplay() {
    movesCount.textContent = moves;
    timerElement.textContent = formatTime(timer);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        updateDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function endGame() {
    stopTimer();
    finalMoves.textContent = moves;
    finalTime.textContent = formatTime(timer);
    
    // Sauvegarder le score
    saveScore();
    
    // Créer une grande célébration
    createVictoryEffect();
    
    setTimeout(() => {
        showScreen(winScreen);
    }, 1500);
}

function createVictoryEffect() {
    // Créer beaucoup de particules pour célébrer
    const particles = 50;
    for (let i = 0; i < particles; i++) {
        setTimeout(() => {
            createVictoryParticle();
        }, i * 50);
    }
}

function createVictoryParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 12px;
        height: 12px;
        background: linear-gradient(45deg, var(--primary-color), var(--accent-color), var(--secondary-color));
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: victoryParticle 2s ease-out forwards;
    `;
    
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 2000);
}

function saveScore() {
    const score = {
        moves: moves,
        time: timer,
        difficulty: currentDifficulty,
        date: new Date().toISOString()
    };
    
    let scores = JSON.parse(localStorage.getItem('memoryScores') || '[]');
    scores.push(score);
    
    // Garder seulement les 10 meilleurs scores
    scores.sort((a, b) => {
        if (a.difficulty !== b.difficulty) {
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        }
        return a.moves - b.moves || a.time - b.time;
    });
    
    scores = scores.slice(0, 10);
    localStorage.setItem('memoryScores', JSON.stringify(scores));
}

// Animation d'entrée pour les cartes
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'cardAppear 0.6s ease-out forwards';
    });
}

// Effets sonores (simulation avec l'API Web Audio)
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        let frequency = 440;
        let duration = 0.1;
        
        switch(type) {
            case 'flip':
                frequency = 800;
                duration = 0.1;
                break;
            case 'match':
                frequency = 1200;
                duration = 0.3;
                break;
            case 'wrong':
                frequency = 200;
                duration = 0.2;
                break;
            case 'start':
                frequency = 600;
                duration = 0.2;
                break;
            case 'restart':
                frequency = 500;
                duration = 0.15;
                break;
            case 'click':
                frequency = 400;
                duration = 0.1;
                break;
        }
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        console.log(`Son joué: ${type}`);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Charger les scores sauvegardés
    const scores = JSON.parse(localStorage.getItem('memoryScores') || '[]');
    console.log('Scores sauvegardés:', scores);
    
    // Ajouter les styles CSS pour les particules
    addParticleStyles();
    
    // Vérifier que toutes les images sont disponibles
    checkImagesAvailability();
    
    // Test de chargement d'images
    testImageLoading();
});

function addParticleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particle {
            0% {
                transform: scale(1) translate(0, 0);
                opacity: 1;
            }
            100% {
                transform: scale(0) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
        
        @keyframes victoryParticle {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: scale(1) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function checkImagesAvailability() {
    // Vérifier que les images principales sont disponibles
    const criticalImages = ['back.jpeg', ...images.slice(0, 6).map(img => `${img}.jpeg`)];
    
    console.log('Vérification des images critiques:', criticalImages);
    
    criticalImages.forEach(image => {
        const img = new Image();
        img.onload = () => {
            console.log(`✅ Image chargée avec succès: ${image}`);
        };
        img.onerror = () => {
            console.error(`❌ Image manquante: ${image}`);
        };
        img.src = `/images/animals/${image}`;
    });
}

// Amélioration de l'accessibilité
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gameScreen.classList.contains('active')) {
        goHome();
    }
});

// Préchargement des images pour de meilleures performances
function preloadImages() {
    const imagePromises = images.map(image => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = `/images/animals/${image}.jpeg`;
        });
    });
    
    Promise.all(imagePromises)
        .then(() => console.log('Toutes les images sont préchargées'))
        .catch(err => console.warn('Erreur lors du préchargement:', err));
}

// Précharger les images au démarrage
preloadImages();

function testImageLoading() {
    console.log('🧪 Test de chargement des images...');
    
    // Test du dos de carte
    const testBackImage = new Image();
    testBackImage.onload = () => {
        console.log('✅ Image dos de carte chargée avec succès');
    };
    testBackImage.onerror = () => {
        console.error('❌ Erreur chargement dos de carte');
    };
    testBackImage.src = '/images/animals/back.jpeg';
    
    // Test d'une image d'animal
    const testAnimalImage = new Image();
    testAnimalImage.onload = () => {
        console.log('✅ Image animal (bunny) chargée avec succès');
    };
    testAnimalImage.onerror = () => {
        console.error('❌ Erreur chargement image animal (bunny)');
    };
    testAnimalImage.src = '/images/animals/bunny.jpeg';
}

// Gestion de l'écran de chargement kawaii
window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const homeScreen = document.getElementById('homeScreen');
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            loadingScreen.style.display = 'none';
            homeScreen.classList.add('active');
        }, 1000); // Durée de l'animation fade-out
    }, 2000); // Durée de l'écran de chargement (2s)
});
