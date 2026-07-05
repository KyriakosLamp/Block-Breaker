const paddleEl      = document.getElementById('paddle');
const hudEl         = document.getElementById('hud');
const bestEl        = document.getElementById('best-score');
const historyList   = document.getElementById('history-list');
const goLeaderboard = document.getElementById('go-leaderboard');

let scoreSaved = false;

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

// Watch overlays for when game.js removes 'hidden' — more reliable than status polling
function watchOverlay(id, callback) {
    const el = document.getElementById(id);
    new MutationObserver(() => {
        if (!el.classList.contains('hidden')) callback();
    }).observe(el, { attributes: true, attributeFilter: ['class'] });
}

watchOverlay('overlay-gameover', onGameOver);
watchOverlay('overlay-win', onWin);
watchOverlay('overlay-history', () => renderLeaderboard(historyList));
watchOverlay('overlay-menu', () => {
    renderLeaderboard(historyList);
    updateBestBadge();
});

// Reset save flag on any new game
['btn-start', 'btn-restart', 'btn-restart-go', 'btn-restart-win'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => scoreSaved = false);
});

// HUD visibility
function updateHud() {
    const active = gameState.status === 'PLAYING' || gameState.status === 'PAUSED';
    hudEl.classList.toggle('hud-hidden', !active);
}

// Init on load
updateBestBadge();
renderLeaderboard(historyList);

function render() {
    paddleEl.style.transform = `translate3d(${paddle.x}px, 570px, 0)`;
    updateHud();
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
