# What is the DOM?

DOM stands for **Document Object Model**. When the browser loads your HTML file, it doesn't just display text — it parses the entire file and builds a **tree of objects in memory**, one object per HTML element. That tree is the DOM.

Think of it like this:

```
document
└── html
    ├── head
    └── body
        ├── div#hud
        ├── div#game
        │   ├── div#brick-area
        │   ├── div#ball
        │   └── div#paddle
        └── ...
```

Every node in that tree is a **live JavaScript object** you can read and modify.

---

## What can you do with it?

**Select elements:**
```js
const paddle = document.getElementById('paddle')
const bricks = document.querySelectorAll('.brick')
```

**Read or change content:**
```js
document.getElementById('score').textContent = 200
```

**Change styles:**
```js
paddle.style.transform = `translate3d(${x}px, 570px, 0)`
```

**Create and inject elements dynamically** (this is exactly what you'll do for bricks):
```js
const brick = document.createElement('div')
brick.classList.add('brick', 'brick-1')
brick.style.transform = `translate3d(${col * 80}px, ${row * 28}px, 0)`
document.getElementById('brick-area').appendChild(brick)
```

**Show/hide overlays:**
```js
document.getElementById('overlay-pause').classList.remove('hidden')
document.getElementById('overlay-pause').classList.add('hidden')
```

---

## Why does it matter for this game?

Since you're not using Canvas, the DOM **is your renderer**. Every game object (ball, paddle, brick) is a `<div>`. Instead of drawing pixels, you move elements around by updating their `transform` property. The browser's GPU handles the actual rendering — which is why `translate3d` is used instead of `top`/`left` (it avoids layout recalculations and keeps you at 60 FPS).
