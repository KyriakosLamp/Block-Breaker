let lastTime = 0;

const keys = {};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

const paddle = {
  x: 350,
  speed: 400,
};

function gameLoop(timestamp) {
  if (lastTime === 0) lastTime = timestamp; // fix the first frame

  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (keys["ArrowLeft"] || keys["a"])
    paddle.x -= paddle.speed * (deltaTime / 1000);
  if (keys["ArrowRight"] || keys["d"])
    paddle.x += paddle.speed * (deltaTime / 1000);

  console.log(paddle.x);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
