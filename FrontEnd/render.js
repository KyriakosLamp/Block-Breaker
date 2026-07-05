const paddleEl = document.getElementById('paddle');
const hudEl    = document.getElementById('hud');
const bestEl   = document.getElementById('best-score');

const historyList   = document.getElementById('history-list');
const goLeaderboard = document.getElementById('go-leaderboard');

let lastStatus = null;
let scoreSaved = false;

function updateHud() {
    const active = gameState.status === 'PLAYING' || gameState.status === 'PAUSED';
    hudEl.classList.toggle('hud-hidden', !active);
}

function updateBestBadge() {
    bestEl.textContent = getBestScore();
}

function onGameOver() {
    if (scoreSaved) return;
    saveScore(gameState.score, Math.floor(gameState.time));
    scoreSaved = true;
    updateBestBadge();
    renderLeaderboard(goLeaderboard);
}

function onWin() {
    if (scoreSaved) return;
    saveScore(gameState.score, Math.floor(gameState.time));
    scoreSaved = true;
    updateBestBadge();
}

function onMenuOpen() {
    renderLeaderboard(historyList);
    updateBestBadge();
}

// Reset save flag when a new game starts
const _originalRestart = window.restartGame;
document.getElementById('btn-start').addEventListener('click', () => scoreSaved = false);
document.getElementById('btn-restart').addEventListener('click', () => scoreSaved = false);
document.getElementById('btn-restart-go').addEventListener('click', () => scoreSaved = false);
document.getElementById('btn-restart-win').addEventListener('click', () => scoreSaved = false);

// Init
updateBestBadge();
renderLeaderboard(historyList);

function render() {
    paddleEl.style.transform = `translate3d(${paddle.x}px, 570px, 0)`;

    updateHud();

    if (lastStatus !== gameState.status) {
        if (gameState.status === 'GAMEOVER') onGameOver();
        if (gameState.status === 'WIN')      onWin();
        if (gameState.status === 'MENU')     onMenuOpen();
        lastStatus = gameState.status;
    }

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
