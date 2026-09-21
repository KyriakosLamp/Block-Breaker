let lastTime = 0;

function gameLoop(timestamp) {
    if (lastTime === 0) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    if (gameState.status === 'PLAYING') {
        gameState.time += dt;
        updatePhysics(dt);
    }

    render(dt);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
