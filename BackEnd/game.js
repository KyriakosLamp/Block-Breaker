let lastTime = 0;

const gameState = {
    score: 0,
    lives: 3,
    time: 0,
    status: 'PLAYING'
};

const livesEl = document.getElementById('lives');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');

const keys = {};

window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

const paddleEl = document.getElementById("paddle");
const ballEl = document.getElementById("ball");
const paddle = {
    x: 350,
    speed: 400
};

const ball = {
    x: 400,
    y: 550,
    vx: 200,
    vy: -300
};

const brickMap = [
    [1,1,1,1,1,1,1,1,1,1],
    [2,2,2,2,2,2,2,2,2,2],
    [3,3,3,3,3,3,3,3,3,3],
    [4,4,4,4,4,4,4,4,4,4],
];

//The numbers match the CSS classes `brick-1`, `brick-2` etc (the colors Person B already defined).
//Then add this function to generate the brick DOM elements:


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
    ballEl.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0)`;
    livesEl.textContent = gameState.lives;
    scoreEl.textContent = gameState.score;
    timerEl.textContent = Math.floor(gameState.time);
}


function gameLoop(timestamp) {
if (lastTime === 0) lastTime = timestamp ; // fix the first frame

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    gameState.time += deltaTime / 1000;


    if (keys['ArrowLeft'] || keys['a'])  paddle.x -= paddle.speed * (deltaTime / 1000);
    if (keys['ArrowRight'] || keys['d']) paddle.x += paddle.speed * (deltaTime / 1000);

    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x > 700) paddle.x = 700;


    ball.x += ball.vx * (deltaTime / 1000);
    ball.y += ball.vy * (deltaTime / 1000);

    // left and right walls
    if (ball.x <= 0) { ball.x = 0; ball.vx *= -1; }
    if (ball.x >= 786) { ball.x = 786; ball.vx *= -1; }

    // top wall
    if (ball.y <= 0) { ball.y = 0; ball.vy *= -1; }

    // paddle collision
    if (
        ball.y + 14 >= 570 &&
        ball.x + 14 >= paddle.x &&
        ball.x <= paddle.x + 100
    ) {
        ball.y = 556;
        ball.vy *= -1;
    }

    // ball fell off bottom
    if (ball.y > 600) {
        gameState.lives -= 1;
        ball.x = 400;
        ball.y = 550;
        ball.vx = 200;
        ball.vy = -300;
    }

    // brick collision
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


        render()
        console.log(gameState.lives)

    requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);
