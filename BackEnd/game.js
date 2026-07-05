let lastTime = 0;

const gameState = {
    score: 0,
    lives: 3,
    time: 0,
    status: 'MENU'
};

const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'Escape' && gameState.status === 'PLAYING') {
        gameState.status = 'PAUSED';
        document.getElementById('overlay-pause').classList.remove('hidden');
    }
});

window.addEventListener('keyup', (e) => keys[e.key] = false);

const paddleEl = document.getElementById('paddle');
const ballEl   = document.getElementById('ball');
const livesEl  = document.getElementById('lives');
const scoreEl  = document.getElementById('score');
const timerEl  = document.getElementById('timer');

const paddle = { x: 350, speed: 400 };
const ball   = { x: 400, y: 550, vx: 200, vy: -300 };

const brickMap = [
    [1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3],
    [4,4,4,4,4,4,4,4,4,4],
];

const brickArea = document.getElementById('brick-area');
const bricks = [];

function initBricks() {
    brickMap.forEach((row, rowIndex) => {
        row.forEach((type, colIndex) => {
            const el = document.createElement('div');
            el.classList.add('brick', `brick-${type}`);
            const x = colIndex * 78 + 10;
            const y = rowIndex * 28 + 10;
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            brickArea.appendChild(el);
            bricks.push({ x, y, width: 70, height: 20, active: true, el });
        });
    });
}

initBricks();

function render() {
    paddleEl.style.transform = `translate3d(${paddle.x}px, 570px, 0)`;
    ballEl.style.transform   = `translate3d(${ball.x}px, ${ball.y}px, 0)`;
    livesEl.textContent = gameState.lives;
    scoreEl.textContent = gameState.score;
    timerEl.textContent = Math.floor(gameState.time);
}

function restartGame() {
    gameState.score  = 0;
    gameState.lives  = 3;
    gameState.time   = 0;
    gameState.status = 'PLAYING';
    ball.x = 400; ball.y = 550; ball.vx = 200; ball.vy = -300;
    paddle.x = 350;
    bricks.forEach(brick => {
        brick.active = true;
        brick.el.style.display = 'block';
    });
}

function gameLoop(timestamp) {
    if (lastTime === 0) lastTime = timestamp;

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (gameState.status === 'PLAYING') {
        gameState.time += deltaTime / 1000;

        if (keys['ArrowLeft']  || keys['a']) paddle.x -= paddle.speed * (deltaTime / 1000);
        if (keys['ArrowRight'] || keys['d']) paddle.x += paddle.speed * (deltaTime / 1000);

        if (paddle.x < 0)   paddle.x = 0;
        if (paddle.x > 700) paddle.x = 700;

        ball.x += ball.vx * (deltaTime / 1000);
        ball.y += ball.vy * (deltaTime / 1000);

        if (ball.x <= 0)   { ball.x = 0;   ball.vx *= -1; }
        if (ball.x >= 786) { ball.x = 786; ball.vx *= -1; }
        if (ball.y <= 0)   { ball.y = 0;   ball.vy *= -1; }

        if (
            ball.y + 14 >= 570 &&
            ball.x + 14 >= paddle.x &&
            ball.x <= paddle.x + 100
        ) {
            ball.y = 556;
            ball.vy *= -1;
        }

        if (ball.y > 600) {
            gameState.lives -= 1;
            if (gameState.lives <= 0) {
                gameState.status = 'GAMEOVER';
                document.getElementById('go-score').textContent = gameState.score;
                document.getElementById('go-time').textContent  = Math.floor(gameState.time) + 's';
                document.getElementById('overlay-gameover').classList.remove('hidden');
            } else {
                ball.x = 400; ball.y = 550; ball.vx = 200; ball.vy = -300;
            }
        }

        bricks.forEach(brick => {
            if (!brick.active) return;
            if (
                ball.x + 14 >= brick.x &&
                ball.x <= brick.x + brick.width &&
                ball.y + 14 >= brick.y &&
                ball.y <= brick.y + brick.height
            ) {
                brick.active = false;
                brick.el.style.display = 'none';
                ball.vy *= -1;
                gameState.score += 100;
            }
        });

        if (bricks.every(brick => !brick.active)) {
            gameState.status = 'WIN';
            document.getElementById('win-score').textContent = gameState.score;
            document.getElementById('win-time').textContent  = Math.floor(gameState.time) + 's';
            document.getElementById('overlay-win').classList.remove('hidden');
        }
    }

    render();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// --- Button Listeners ---

document.getElementById('btn-start').addEventListener('click', () => {
    document.getElementById('overlay-menu').classList.add('hidden');
    gameState.status = 'PLAYING';
});

document.getElementById('btn-history').addEventListener('click', () => {
    document.getElementById('overlay-menu').classList.add('hidden');
    document.getElementById('overlay-history').classList.remove('hidden');
});

document.getElementById('btn-back').addEventListener('click', () => {
    document.getElementById('overlay-history').classList.add('hidden');
    document.getElementById('overlay-menu').classList.remove('hidden');
});

document.getElementById('btn-continue').addEventListener('click', () => {
    document.getElementById('overlay-pause').classList.add('hidden');
    gameState.status = 'PLAYING';
});

document.getElementById('btn-restart').addEventListener('click', () => {
    document.getElementById('overlay-pause').classList.add('hidden');
    restartGame();
});

document.getElementById('btn-restart-go').addEventListener('click', () => {
    document.getElementById('overlay-gameover').classList.add('hidden');
    restartGame();
});

document.getElementById('btn-menu-go').addEventListener('click', () => {
    document.getElementById('overlay-gameover').classList.add('hidden');
    document.getElementById('overlay-menu').classList.remove('hidden');
    gameState.status = 'MENU';
});

document.getElementById('btn-restart-win').addEventListener('click', () => {
    document.getElementById('overlay-win').classList.add('hidden');
    restartGame();
});

document.getElementById('btn-menu-win').addEventListener('click', () => {
    document.getElementById('overlay-win').classList.add('hidden');
    document.getElementById('overlay-menu').classList.remove('hidden');
    gameState.status = 'MENU';
});
