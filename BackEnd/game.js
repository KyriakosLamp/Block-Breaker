let lastTime = 0;


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



function render() {
  paddleEl.style.transform = `translate3d(${paddle.x}px, 570px, 0)`;
  ballEl.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0)`;
}


function gameLoop(timestamp) {
if (lastTime === 0) lastTime = timestamp ; // fix the first frame

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

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




        render()


    requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);
