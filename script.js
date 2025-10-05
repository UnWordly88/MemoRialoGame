 
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.timer = 0;
        this.timerInterval = null;
        this.maxTime = 60; // 1 minute
        
        // Predefined images - „Ž€‚‹…Ž this.predefinedImages
        this.predefinedImages = [
            'card1.png',
            'card2.png',
            'card3.png',
            'card4.png',
            'card5.png',
            'card6.png',
            'card7.png',
            'card8.png'
        ];
        
        this.initializeGame();
    }
    
    // ... ®áâ «ì­®© ª®¤ ¡¥§ ¨§¬¥­¥­¨© ...
    initializeGame() {
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.movesElement = document.getElementById('moves');
        this.timerElement = document.getElementById('timer');
        this.messageElement = document.getElementById('message');
        this.startButton = document.getElementById('startGame');
        this.gameStats = document.getElementById('gameStats');
        this.finalScoreElement = document.getElementById('finalScore');
        this.finalTimeElement = document.getElementById('finalTime');
        this.finalMovesElement = document.getElementById('finalMoves');
        this.bonusPointsElement = document.getElementById('bonusPoints');
        
        this.setupEventListeners();
        this.updateDisplay();
        this.showMessage('Click "Start Game" to begin!');
    }
    
    setupEventListeners() {
        this.startButton.addEventListener('click', () => {
            this.startGame();
        });
    }
    
    startGame() {
        this.resetGame();
        this.createCards();
        this.shuffleCards();
        this.renderCards();
        this.startTimer();
        this.gameStarted = true;
        this.showMessage('Game started! Find all matching pairs. Time limit: ' + this.formatTime(this.maxTime));
    }
    
    createCards() {
        this.cards = [];
        
        // Use first 6 predefined images for the game
        const imagesToUse = this.predefinedImages.slice(0, 6);
        
        imagesToUse.forEach((image, index) => {
            const card1 = {
                id: index * 2,
                image: image, // Ž‘’Ž ˆ‘Ž‹œ‡“…Œ image, ­¥ ¢ë§ë¢ ¥¬ createImageElement
                type: index,
                flipped: false,
                matched: false
            };
            
            const card2 = {
                id: index * 2 + 1,
                image: image, // Ž‘’Ž ˆ‘Ž‹œ‡“…Œ image
                type: index,
                flipped: false,
                matched: false
            };
            
            this.cards.push(card1, card2);
        });
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    renderCards() {
        this.gameBoard.innerHTML = '';
        
        // Auto-adjust grid based on number of cards
        const columns = Math.min(4, Math.ceil(Math.sqrt(this.cards.length)));
        this.gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.id = card.id;
            
            // „«ï à¥ «ì­ëå ¨§®¡à ¦¥­¨©
            cardElement.innerHTML = `
                <div class="card-front">
                    <img src="images/${card.image}" alt="Card image">
                </div>
                <div class="card-back">?</div>
            `;
            
            cardElement.addEventListener('click', () => this.flipCard(card));
            this.gameBoard.appendChild(cardElement);
        });
    }
    
    flipCard(card) {
        if (!this.gameStarted || card.flipped || card.matched || this.flippedCards.length >= 2) {
            return;
        }
        
        card.flipped = true;
        this.flippedCards.push(card);
        
        const cardElement = document.querySelector(`[data-id="${card.id}"]`);
        if (cardElement) {
            cardElement.classList.add('flipped');
        }
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkForMatch();
        }
    }
    
    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.type === card2.type) {
            // Match found - calculate points
            const basePoints = 50;
            const timeBonus = Math.max(0, 100 - this.timer);
            const moveBonus = Math.max(0, 50 - this.moves);
            const pointsEarned = basePoints + Math.floor(timeBonus / 10) + Math.floor(moveBonus / 5);
            
            this.score += pointsEarned;
            this.matchedPairs++;
            
            // Show points animation
            this.showPointsAnimation(pointsEarned);
            
            setTimeout(() => {
                card1.matched = true;
                card2.matched = true;
                
                const card1Element = document.querySelector(`[data-id="${card1.id}"]`);
                const card2Element = document.querySelector(`[data-id="${card2.id}"]`);
                
                if (card1Element) card1Element.classList.add('matched');
                if (card2Element) card2Element.classList.add('matched');
            }, 500);
            
            this.flippedCards = [];
            
            if (this.matchedPairs === this.cards.length / 2) {
                setTimeout(() => this.endGame(true), 500);
            }
        } else {
            // No match - penalty
            this.score = Math.max(0, this.score - 5);
            
            setTimeout(() => {
                card1.flipped = false;
                card2.flipped = false;
                
                const card1Element = document.querySelector(`[data-id="${card1.id}"]`);
                const card2Element = document.querySelector(`[data-id="${card2.id}"]`);
                
                if (card1Element) card1Element.classList.remove('flipped');
                if (card2Element) card2Element.classList.remove('flipped');
                
                this.flippedCards = [];
            }, 1000);
        }
    }
    
    showPointsAnimation(points) {
        const pointsElement = document.createElement('div');
        pointsElement.textContent = `+${points}`;
        pointsElement.style.cssText = `
            position: fixed;
            color: #4CAF50;
            font-weight: bold;
            font-size: 24px;
            pointer-events: none;
            animation: floatUp 1s ease-out forwards;
            z-index: 1000;
        `;
        
        // Position near the score element
        const scoreRect = this.scoreElement.getBoundingClientRect();
        pointsElement.style.left = scoreRect.right + 10 + 'px';
        pointsElement.style.top = scoreRect.top + 'px';
        
        document.body.appendChild(pointsElement);
        
        setTimeout(() => {
            document.body.removeChild(pointsElement);
        }, 1000);
    }
    
    startTimer() {
        this.timer = 0;
        clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateDisplay();
            
            // Check if time is running out
            if (this.maxTime - this.timer <= 30) {
                this.timerElement.classList.add('timer-warning');
            }
            
            // Check time limit
            if (this.timer >= this.maxTime) {
                this.endGame(false);
            }
        }, 1000);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.movesElement.textContent = `Moves: ${this.moves}`;
        this.timerElement.textContent = `Time: ${this.formatTime(this.timer)}`;
        
        // Show time remaining
        const timeLeft = this.maxTime - this.timer;
        if (timeLeft >= 0) {
            this.timerElement.title = `Time left: ${this.formatTime(timeLeft)}`;
        }
    }
    
    endGame(success = true) {
        clearInterval(this.timerInterval);
        this.gameStarted = false;
        this.timerElement.classList.remove('timer-warning');
        
        if (success) {
            // Calculate final score with bonuses
            const baseScore = 100;
            const timeBonus = Math.max(0, Math.floor((this.maxTime - this.timer) * 2));
            const movesBonus = Math.max(0, Math.floor((this.cards.length - this.moves) * 5));
            
            const finalScore = this.score + baseScore + timeBonus + movesBonus;
            const bonusPoints = finalScore - this.score;
            
            // Show statistics
            this.showGameStats(finalScore, bonusPoints, timeBonus, movesBonus);
            
            const finalMessage = `Congratulations! You completed the game with ${finalScore} points!`;
            this.showMessage(finalMessage, 'win');
        } else {
            this.showMessage(`Time's up! You found ${this.matchedPairs} of ${this.cards.length / 2} pairs.`, 'error');
        }
        
        this.addRestartButton();
    }
    
    showGameStats(finalScore, bonusPoints, timeBonus, movesBonus) {
        this.gameStats.style.display = 'block';
        this.finalScoreElement.textContent = `Final Score: ${finalScore}`;
        this.finalTimeElement.textContent = `Time: ${this.formatTime(this.timer)}`;
        this.finalMovesElement.textContent = `Moves: ${this.moves}`;
        this.bonusPointsElement.textContent = `Bonus Points: +${bonusPoints} (Time: +${timeBonus}, Moves: +${movesBonus})`;
    }
    
    addRestartButton() {
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Play Again';
        restartButton.onclick = () => {
            this.gameStats.style.display = 'none';
            this.startGame();
        };
        this.messageElement.appendChild(restartButton);
    }
    
    showMessage(text, type = 'info') {
        this.messageElement.innerHTML = text;
        this.messageElement.className = 'message';
        
        if (type === 'error') {
            this.messageElement.style.background = '#ffebee';
            this.messageElement.style.color = '#c62828';
        } else if (type === 'success') {
            this.messageElement.style.background = '#e8f5e8';
            this.messageElement.style.color = '#2e7d32';
        } else if (type === 'win') {
            this.messageElement.style.background = '#4CAF50';
            this.messageElement.style.color = 'white';
            this.messageElement.style.fontWeight = 'bold';
        }
    }
    
    resetGame() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.timer = 0;
        clearInterval(this.timerInterval);
        if (this.gameBoard) {
            this.gameBoard.innerHTML = '';
        }
        this.gameStats.style.display = 'none';
        this.updateDisplay();
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Start game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
