const paddleEl = document.getElementById("paddle");

function render() {
  paddleEl.style.transform = `translate3d(${paddle.x}px, 570px, 0)`;
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
