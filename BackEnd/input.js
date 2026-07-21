const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'Escape' && gameState.status === 'PLAYING') {
        gameState.status = 'PAUSED';
    }
});

window.addEventListener('keyup', (e) => keys[e.key] = false);
