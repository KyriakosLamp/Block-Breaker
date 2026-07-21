const paddle = { x: 350, speed: 400 };
const ball   = { x: 400, y: 550, vx: 200, vy: -300 };

const bricks = [];

function initBricks() {
    const brickArea = document.getElementById('brick-area');
    brickArea.innerHTML = '';
    bricks.length = 0;

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

function resetBricks() {
    bricks.forEach(b => {
        b.active = true;
        b.el.style.visibility = 'visible';
    });
}

function resetBall() {
    ball.x = 400; ball.y = 550;
    ball.vx = 200; ball.vy = -300;
}

function restartGame() {
    gameState.score  = 0;
    gameState.lives  = 3;
    gameState.time   = 0;
    gameState.status = 'PLAYING';
    paddle.x = 350;
    resetBall();
    resetBricks();
}

function updatePhysics(dt) {
    // Paddle movement
    if (keys['ArrowLeft']  || keys['a']) paddle.x -= paddle.speed * dt;
    if (keys['ArrowRight'] || keys['d']) paddle.x += paddle.speed * dt;
    if (paddle.x < 0)                    paddle.x = 0;
    if (paddle.x > GAME_WIDTH - PADDLE_WIDTH) paddle.x = GAME_WIDTH - PADDLE_WIDTH;

    // Ball movement
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // Wall collisions
    if (ball.x <= 0)                        { ball.x = 0;                        ball.vx *= -1; }
    if (ball.x >= GAME_WIDTH - BALL_SIZE)   { ball.x = GAME_WIDTH - BALL_SIZE;   ball.vx *= -1; }
    if (ball.y <= 0)                        { ball.y = 0;                        ball.vy *= -1; }

    // Paddle collision
    if (
        ball.y + BALL_SIZE >= PADDLE_Y &&
        ball.y + BALL_SIZE <= PADDLE_Y + 16 &&
        ball.x + BALL_SIZE >= paddle.x &&
        ball.x <= paddle.x + PADDLE_WIDTH
    ) {
        ball.y = PADDLE_Y - BALL_SIZE;
        const offset = (ball.x + BALL_SIZE / 2) - (paddle.x + PADDLE_WIDTH / 2);
        ball.vx = offset * 6;
        ball.vy = -Math.abs(ball.vy);
    }

    // Brick collisions
    let hitBrick = false;
    bricks.forEach(brick => {
        if (!brick.active || hitBrick) return;
        if (
            ball.x + BALL_SIZE > brick.x &&
            ball.x < brick.x + brick.width &&
            ball.y + BALL_SIZE > brick.y &&
            ball.y < brick.y + brick.height
        ) {
            brick.active = false;
            brick.el.style.visibility = 'hidden';
            ball.vy *= -1;
            gameState.score += 100;
            hitBrick = true;
        }
    });

    // Ball out of bounds — lose life
    if (ball.y > GAME_HEIGHT) {
        gameState.lives -= 1;
        if (gameState.lives <= 0) {
            gameState.status = 'GAMEOVER';
        } else {
            resetBall();
        }
    }

    // Win condition
    if (bricks.every(b => !b.active)) {
        gameState.status = 'WIN';
    }
}
