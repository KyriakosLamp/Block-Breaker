const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'Escape') {
        if (gameState.status === 'PLAYING')  onEscPress();
        else if (gameState.status === 'PAUSED') onEscPress();
    }
});

window.addEventListener('keyup', (e) => keys[e.key] = false);
