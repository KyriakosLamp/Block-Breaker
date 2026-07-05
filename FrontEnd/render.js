// FrontEnd/render.js
// Depends on: state.js, physics.js, scores.js

const paddleEl      = document.getElementById('paddle');
const ballEl        = document.getElementById('ball');
const hudEl         = document.getElementById('hud');
const scoreEl       = document.getElementById('score');
const livesEl       = document.getElementById('lives');
const timerEl       = document.getElementById('timer');
const bestEl        = document.getElementById('best-score');
const historyList   = document.getElementById('history-list');
const goLeaderboard = document.getElementById('go-leaderboard');

let scoreSaved = false;
let lastStatus = null;

// ── Render ────────────────────────────────────────────────────────────────────

function render() {
    paddleEl.style.transform = `translate3d(${paddle.x}px, ${PADDLE_Y}px, 0)`;
    ballEl.style.transform   = `translate3d(${ball.x}px, ${ball.y}px, 0)`;

    if (gameState.status === 'PLAYING') {
        scoreEl.textContent = gameState.score;
        livesEl.textContent = gameState.lives;
        timerEl.textContent = Math.floor(gameState.time);
    }

    if (lastStatus !== gameState.status) {
        onStatusChange(gameState.status);
        lastStatus = gameState.status;
    }
}

// ── Status change handler ─────────────────────────────────────────────────────

function onStatusChange(status) {
    switch (status) {
        case 'PLAYING':
            hudEl.classList.remove('hud-hidden');
            break;

        case 'PAUSED':
            showOverlay('overlay-pause');
            break;

        case 'GAMEOVER':
            document.getElementById('go-score').textContent = gameState.score;
            document.getElementById('go-time').textContent  = Math.floor(gameState.time) + 's';
            hudEl.classList.add('hud-hidden');
            triggerScoreEntry(() => {
                renderLeaderboard(goLeaderboard);
                showOverlay('overlay-gameover');
            });
            break;

        case 'WIN':
            document.getElementById('win-score').textContent = gameState.score;
            document.getElementById('win-time').textContent  = Math.floor(gameState.time) + 's';
            hudEl.classList.add('hud-hidden');
            triggerScoreEntry(() => {
                showOverlay('overlay-win');
            });
            break;

        case 'MENU':
            renderLeaderboard(historyList);
            updateBestBadge();
            showOverlay('overlay-menu');
            hudEl.classList.add('hud-hidden');
            break;
    }
}

// ── Name entry ────────────────────────────────────────────────────────────────

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let neState = { pos: 0, indices: [0, 0, 0], onDone: null };

function triggerScoreEntry(onDone) {
    if (scoreSaved) { onDone(); return; }

    if (!isHighScore(gameState.score)) {
        saveScore('---', gameState.score, Math.floor(gameState.time));
        scoreSaved = true;
        updateBestBadge();
        onDone();
        return;
    }

    // It's a high score — show name entry
    neState = { pos: 0, indices: [0, 0, 0], onDone };
    document.getElementById('ne-score').textContent = gameState.score;
    updateNeDisplay();
    showOverlay('overlay-nameentry');
}

function updateNeDisplay() {
    for (let i = 0; i < 3; i++) {
        const el = document.getElementById(`ne-c${i}`);
        el.textContent = CHARS[neState.indices[i]];
        el.classList.toggle('ne-active', i === neState.pos);
    }
}

function confirmName() {
    const name = neState.indices.map(i => CHARS[i]).join('');
    saveScore(name, gameState.score, Math.floor(gameState.time));
    scoreSaved = true;
    updateBestBadge();
    hideOverlay('overlay-nameentry');
    neState.onDone();
}

// Keyboard navigation for name entry
window.addEventListener('keydown', (e) => {
    if (document.getElementById('overlay-nameentry').classList.contains('hidden')) return;

    switch (e.key) {
        case 'ArrowRight':
            neState.pos = (neState.pos + 1) % 3;
            break;
        case 'ArrowLeft':
            neState.pos = (neState.pos + 2) % 3;
            break;
        case 'ArrowUp':
            neState.indices[neState.pos] = (neState.indices[neState.pos] + 1) % CHARS.length;
            break;
        case 'ArrowDown':
            neState.indices[neState.pos] = (neState.indices[neState.pos] + CHARS.length - 1) % CHARS.length;
            break;
        case 'Enter':
            confirmName();
            return;
    }
    updateNeDisplay();
});

document.getElementById('btn-ne-confirm').addEventListener('click', confirmName);

// ── Score helpers ─────────────────────────────────────────────────────────────

function updateBestBadge() {
    bestEl.textContent = getBestScore();
}

// ── Overlay helpers ───────────────────────────────────────────────────────────

function showOverlay(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hideOverlay(id) {
    document.getElementById(id).classList.add('hidden');
}

function goToMenu() {
    lastStatus = null;
    gameState.status = 'MENU';
}

// ── Button listeners ──────────────────────────────────────────────────────────

document.getElementById('btn-start').addEventListener('click', () => {
    hideOverlay('overlay-menu');
    scoreSaved = false;
    initBricks();
    restartGame();
});

document.getElementById('btn-history').addEventListener('click', () => {
    hideOverlay('overlay-menu');
    renderLeaderboard(historyList);
    showOverlay('overlay-history');
});

document.getElementById('btn-back').addEventListener('click', () => {
    hideOverlay('overlay-history');
    showOverlay('overlay-menu');
});

document.getElementById('btn-continue').addEventListener('click', () => {
    hideOverlay('overlay-pause');
    gameState.status = 'PLAYING';
});

document.getElementById('btn-restart').addEventListener('click', () => {
    hideOverlay('overlay-pause');
    scoreSaved = false;
    initBricks();
    restartGame();
});

document.getElementById('btn-restart-go').addEventListener('click', () => {
    hideOverlay('overlay-gameover');
    scoreSaved = false;
    initBricks();
    restartGame();
});

document.getElementById('btn-menu-go').addEventListener('click', () => {
    hideOverlay('overlay-gameover');
    goToMenu();
});

document.getElementById('btn-restart-win').addEventListener('click', () => {
    hideOverlay('overlay-win');
    scoreSaved = false;
    initBricks();
    restartGame();
});

document.getElementById('btn-menu-win').addEventListener('click', () => {
    hideOverlay('overlay-win');
    goToMenu();
});

// ── Init ──────────────────────────────────────────────────────────────────────

initBricks();
updateBestBadge();
renderLeaderboard(historyList);
hudEl.classList.add('hud-hidden');
