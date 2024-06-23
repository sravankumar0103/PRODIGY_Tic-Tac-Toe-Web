// script.js

const cells = document.querySelectorAll('.cell');
const status = document.querySelector('.status');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.querySelector('.restart-btn');
const container = document.querySelector('.container');
const board = document.querySelector('.board');

let currentPlayer = 'X';
let gameActive = false;
let gameState = ['', '', '', '', '', '', '', '', ''];
const aiPlayerName = 'SK';

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    status.textContent = `${currentPlayer === 'X' ? "Your" : aiPlayerName} turn`;

    container.classList.add('scale-in');
    startBtn.classList.add('hide');
    setTimeout(() => {
        board.classList.remove('hide');
        status.classList.remove('hide');
    }, 300);

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
        cell.addEventListener('click', handleCellClick, { once: true });
    });

    if (currentPlayer === 'O') {
        setTimeout(makeAiMove, 500); // AI makes move after 0.5 seconds delay
    }
}

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute('data-cell'));

    if (gameState[cellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    container.classList.add('fade-in');
    setTimeout(() => {
        container.classList.remove('fade-in');
    }, 500);

    if (checkWin()) {
        status.textContent = `${currentPlayer === 'X' ? "You" : aiPlayerName} wins!`;
        gameActive = false;
        showRestartButton();
        return;
    }

    if (checkDraw()) {
        status.textContent = 'Draw!';
        gameActive = false;
        showRestartButton();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `${currentPlayer === 'X' ? "Your" : aiPlayerName} turn`;

    if (currentPlayer === 'O' && gameActive) {
        setTimeout(makeAiMove, 500); // AI makes move after 0.5 seconds delay
    }
}

function makeAiMove() {
    // Advanced AI logic for PvAI mode
    const availableMoves = getAvailableMoves();

    // Check if AI can win in the next move
    for (let i = 0; i < availableMoves.length; i++) {
        const move = availableMoves[i];
        gameState[move] = currentPlayer;
        if (checkWin()) {
            gameState[move] = '';
            placeAiMove(move);
            return;
        }
        gameState[move] = '';
    }

    // Check if player can win in the next move and block
    for (let i = 0; i < availableMoves.length; i++) {
        const move = availableMoves[i];
        gameState[move] = 'X'; // Assume player's move
        if (checkWin()) {
            gameState[move] = '';
            placeAiMove(move);
            return;
        }
        gameState[move] = '';
    }

    // Choose a random move from available moves
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const aiMove = availableMoves[randomIndex];
    placeAiMove(aiMove);
}

function getAvailableMoves() {
    return gameState.reduce((moves, cell, index) => {
        if (cell === '') {
            moves.push(index);
        }
        return moves;
    }, []);
}

function placeAiMove(move) {
    const aiCell = cells[move];
    aiCell.click(); // Simulate AI clicking on cell
}

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return gameState.every(cell => {
        return cell !== '';
    });
}

function showRestartButton() {
    restartBtn.classList.add('show');
}

function restartGame() {
    gameActive = false;
    startBtn.classList.remove('hide');
    restartBtn.classList.remove('show');
    currentPlayer = 'X';

    container.classList.add('scale-in');
    setTimeout(() => {
        container.classList.remove('scale-in');
        board.classList.add('hide');
        status.classList.add('hide');

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
            cell.removeEventListener('click', handleCellClick);
        });
    }, 300);
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Initial setup
