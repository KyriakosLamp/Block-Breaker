# 🕹️ Brick Breaker

A high-performance browser-based Brick Breaker game built with **Vanilla JavaScript, HTML, and CSS only** — no canvas, no frameworks, no dependencies. Targets a locked **60 FPS** using GPU-composited DOM rendering.

---

## 🎮 How to Play

| Key | Action |
|---|---|
| `←` / `A` | Move paddle left |
| `→` / `D` | Move paddle right |
| `Escape` | Pause / unpause |

Break all bricks to win. You have **3 lives** — if the ball falls below the paddle you lose one. Run out of lives and it's game over.

Scores are saved locally. If you land in the **top 5**, you'll be prompted to enter a 3-character name.

---

## 🏗️ Project Structure

```
make-your-game/
├── BackEnd/
│   ├── state.js       — gameState object, constants, brick map
│   ├── input.js       — keyboard tracking (keydown / keyup)
│   ├── physics.js     — paddle, ball, bricks, collision logic
│   └── loop.js        — requestAnimationFrame game loop
├── FrontEnd/
│   ├── index.html     — game layout, overlays, script load order
│   ├── style.css      — all visual styles, retro neon theme
│   ├── render.js      — DOM renderer, HUD, overlays, button wiring
│   └── scores.js      — localStorage high score system
└── Docs/
    ├── Project_Roadmap.md
    ├── Dom_explained.md
    └── Contributions.md
```

---

## ⚙️ Architecture

The project is split into a clear **logic / view** boundary:

- `BackEnd/` — pure game logic, owns no DOM references except brick element creation
- `FrontEnd/` — owns all DOM reads and writes, never touches physics math directly

They communicate through a **shared global state** (`gameState`, `paddle`, `ball`, `bricks`) that both sides read from. The renderer never writes to game state — it only reads it.

### Script load order

```html
<script src="../BackEnd/state.js"></script>    <!-- 1. data first -->
<script src="../BackEnd/input.js"></script>    <!-- 2. input listeners -->
<script src="../BackEnd/physics.js"></script>  <!-- 3. logic, depends on state -->
<script src="scores.js"></script>              <!-- 4. localStorage helpers -->
<script src="render.js"></script>              <!-- 5. DOM layer, depends on all above -->
<script src="../BackEnd/loop.js"></script>     <!-- 6. starts the loop last -->
```

---

## 🔄 The Main Loop

The game runs on a single `requestAnimationFrame` loop inside `loop.js`:

```js
function gameLoop(timestamp) {
    const dt = (timestamp - lastTime) / 1000; // delta time in seconds
    lastTime = timestamp;

    if (gameState.status === 'PLAYING') {
        gameState.time += dt;
        updatePhysics(dt);
    }

    render(dt);
    requestAnimationFrame(gameLoop);
}
```

**Delta time (`dt`)** is the time elapsed since the last frame in seconds. All movement is multiplied by `dt` so the game runs at the same speed regardless of frame rate — a machine running at 30 FPS moves the ball the same distance per second as one running at 120 FPS.

---

## 🧱 DOM as the Renderer (No Canvas)

Instead of drawing pixels on a `<canvas>`, every game object is an HTML `<div>`:

- `#paddle` — a div styled with `width`, `height`, and `border-radius`
- `#ball` — an SVG element with a `<circle>` and a `feGaussianBlur` glow filter for the neon effect
- `.brick` — divs dynamically generated from the `brickMap` array

**Positions are never set via `top` / `left`.** All movement is applied through:

```js
element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
```

`translate3d` forces the browser to handle the element on the **GPU compositor thread**, meaning position updates never trigger layout recalculations or repaints on the rest of the page. This is what keeps the game at 60 FPS.

---

## 💥 Physics & Collision

All physics runs in `updatePhysics(dt)` inside `physics.js`:

- **Paddle movement** — `paddle.x` is incremented/decremented by `speed * dt`, clamped to the game boundary
- **Ball movement** — `ball.x += ball.vx * dt`, `ball.y += ball.vy * dt`
- **Wall collisions** — velocity component is inverted when the ball hits a wall (`vx *= -1` or `vy *= -1`)
- **Paddle collision (AABB)** — Axis-Aligned Bounding Box check. On hit, `vy` is reversed and `vx` is recalculated based on the contact offset from the paddle center, giving the player directional steering control:

```js
const offset = (ball.x + BALL_SIZE / 2) - (paddle.x + PADDLE_WIDTH / 2);
ball.vx = offset * 6;
ball.vy = -Math.abs(ball.vy);
```

- **Brick collision (AABB)** — same bounding box check against each active brick. On hit the brick is deactivated (`visibility: hidden`), score increments by 100, and `vy` is inverted. Only one brick is hit per frame to prevent tunnelling.

---

## 🏆 High Score System

Scores are persisted in `localStorage` under the key `brickbreaker_scores` as a JSON array of `{ name, score, time }` objects, sorted by score descending, capped at 5 entries.

When a game ends:
1. The score is checked against the current bottom of the leaderboard via `isHighScore()`
2. If it qualifies, a **retro name entry screen** appears — 3 character slots, navigated with arrow keys, cycling through `A–Z` and `0–9`
3. On confirm the entry is saved and the leaderboard updates immediately

---

## 🎨 Visual Theme

- Background: deep purple `#0d0015` with a low-opacity retro grid image overlay
- Game viewport: dark purple `#12002a` with a neon green `#39ff14` border glow
- All interactive elements use `box-shadow` glow effects to simulate a CRT arcade screen
- Brick tiers: two greens (`#39ff14`, `#7fff00`) and two purples (`#a855f7`, `#d946ef`)

---

## 🚀 How to Run

No build step, no install, no server required for basic use.

**Option 1 — Open directly:**
```bash
open FrontEnd/index.html
# or just double-click index.html in your file manager
```

**Option 2 — Local server (recommended, avoids browser path issues with /BackEnd/ scripts):**
```bash
# Python
python3 -m http.server 8080

# Node (if http-server is installed)
npx http-server -p 8080
```
Then open `http://localhost:8080/FrontEnd/index.html` in your browser.

---

## 👥 Team

| Person | Role |
|---|---|
| Person A | Game loop, physics, input, state |
| Person B | UI, rendering, overlays, score system |

Built as part of the **Zone01** curriculum.
