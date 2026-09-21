# 🕹️ Project Roadmap & Todo List: 60 FPS Brick Breaker Game

A professional, high-performance web game built strictly using **Vanilla JavaScript, HTML, and CSS (DOM-only, No Canvas/Frameworks)**. Optimized for 60 FPS smooth rendering via GPU compositing.

---

## 👥 Team Workload Distribution Matrix

| Task Category | 🧑‍💻 Person A: Engine & Physics (Logic) | 👩‍💻 Person B: UI, Graphics & DOM (View) |
| :--- | :--- | :--- |
| **Phase 1: Foundation** | [ ] Implement Game Loop (`requestAnimationFrame`) & Delta Time<br>[ ] Build Keyboard Input State Listener (Non-blocking) | [ ] Create Game Window Layout (`index.html` & `style.css`)<br>[ ] Define Base Styles for Ball, Paddle, and Bricks |
| **Phase 2: Core Gameplay** | [ ] Code Paddle Movement Math<br>[ ] Implement Ball Physics & AABB Collision Detection | [ ] Build Dynamic Brick Grid Generator from Map Array<br>[ ] Code DOM Renderer (`transform: translate3d`) |
| **Phase 3: Systems & UI** | [ ] Program State Manager (`PLAYING`, `PAUSED`, `GAMEOVER`)<br>[ ] Track Core Metrics (Score, Lives, Timer logic) | [ ] Build Overlay Screens (Pause, Game Over, Win)<br>[ ] Map & Sync Real-Time Scoreboard Elements |
| **Phase 4: Polish & Perf** | [ ] Write Micro-benchmarks using `performance.now()` | [ ] Optimize Layout to Eliminate Repaints/Layout Thrashing |

---

## 📋 Master Task Checklist

### 🏗️ Phase 1: Foundation & Infrastructure

#### Joint Tasks (Pre-requisites)
- [ ] **Define Shared Game State Object:** Agree on the architecture of the `gameState` structure tracking positions, velocities, score, and game status.

#### 🧑‍💻 Person A: Logic & Input
- [ ] **Setup High-Precision Game Loop:**
  - Implement a `requestAnimationFrame` recursion loop.
  - Track `lastTime` and calculate `deltaTime` (in seconds or milliseconds) to keep movement independent of frame rate fluctuations.
- [ ] **Implement Non-Blocking Input Tracking:**
  - Attach event listeners to `window` for `keydown` and `keyup`.
  - Maintain a `keysPressed` object map (e.g., `{ ArrowLeft: false, ArrowRight: false }`) to ensure stutter-free holding actions instead of firing single steps per browser repeat event.

#### 👩‍💻 Person B: Canvas-less Layout
- [ ] **Establish Game Boundary Container:**
  - Create the main viewport container element using strict dimensions (e.g., `800x600`).
  - Configure viewport styles with `position: relative` and `overflow: hidden`.
- [ ] **Style Visual Game Elements:**
  - Declare CSS rules for `.paddle`, `.ball`, and `.brick`.
  - Use `position: absolute; top: 0; left: 0;` and explicitly define `width` and `height`. 
  - *Rule:* Visual positions must be manipulated entirely by `transform` rather than modifying `top`/`left`.

---

### ⚽ Phase 2: Core Physics & Rendering

#### 🧑‍💻 Person A: Logic & Physics
- [ ] **Implement Movement Equations:**
  - Update paddle X position based on active keyboard tracking flags and speed constant multiplied by `deltaTime`.
  - Update ball X and Y positions via its velocity vectors: `ball.x += ball.vx * deltaTime`.
- [ ] **Implement Boundary Collision Detection:**
  - Detect collisions between ball bounds and side walls (invert `vx`).
  - Detect collision with top wall (invert `vy`).
  - Detect collision with bottom wall (trigger life loss / reset routine).
- [ ] **Implement Paddle & Brick Matrix Collision:**
  - Build AABB (Axis-Aligned Bounding Box) collision check logic.
  - Ball vs. Paddle: Reverse Y velocity, modify X velocity dynamically based on contact offset from paddle center to allow steering control.
  - Ball vs. Brick Array: Determine which brick is hit, toggle its `active: false` state, and reverse appropriate velocity vector.

#### 👩‍💻 Person B: DOM Generation & Performance Rendering
- [ ] **Build Dynamic Brick Grid Spawner:**
  - Write a initialization function reading a multi-dimensional map array.
  - Dynamically generate HTML `<div>` elements representing each active brick and append them to the game viewport wrapper.
- [ ] **Write High-Performance Frame Renderer:**
  - Create the `render()` loop function triggered exactly once per frame by the main loop.
  - Apply `transform: translate3d(x, y, 0);` to the ball and paddle DOM nodes utilizing raw `gameState` mathematical values.
  - Hide broken bricks by setting `display: none` or using `visibility: hidden` (avoid modifying layouts across the entire grid).

---

### 🖥️ Phase 3: Systems, Metrics & Menus

#### 🧑‍💻 Person A: System Controls
- [ ] **Incorporate State Machine Routing:**
  - Prevent updating positional physics if `gameState.status !== 'PLAYING'`.
  - Ensure the loop keeps running during a `PAUSED` state to seamlessly handle menu render signals without freezing the thread.
- [ ] **Build Core Timers & Metric Reducers:**
  - Run a real-time countdown clock updating every second using delta time accumulation.
  - Code metric adjustments for score increments (+100 per brick) and life penalties.

#### 👩‍💻 Person B: UI Overlays & Data Binding
- [ ] **Build Overlay UI Component System:**
  - Create modal states using HTML/CSS for `Pause Screen`, `Game Over`, and `Victory Screen`.
  - Wire up action buttons inside the Pause screen to execute callbacks for `Continue` and `Restart`.
- [ ] **Bind Scoreboard Metrics:**
  - Create dedicated layout tags for `Score`, `Timer`, and `Lives`.
  - Update their `.textContent` properties dynamically only when values drift from the prior state to mitigate unnecessary DOM manipulation.

---

### ⚡ Phase 4: Performance Monitoring & Optimization

#### 🧑‍💻 Person A: Micro-benchmarking
- [ ] **Monitor Function Execution Cost:**
  - Wrap logic evaluation code-blocks within `performance.now()` segments to audit exact frame evaluation time down to fractions of a millisecond.
  - Ensure processing logic never surpasses a strict budget of **2–3ms** per frame, reserving the remaining frame time for browser paint routines.

#### 👩‍💻 Person B: Rendering Profiling
- [ ] **Eliminate Layout Thrashing:**
  - Ensure there are no interleaved reads (`element.offsetHeight`, `getBoundingClientRect()`) and writes (`element.style.*`) within the loop. All reading must happen from the pure virtual mathematical game state.
- [ ] **Leverage Browser Developer Profiles:**
  - Profile using Chrome/Firefox DevTools **Performance Profiler** to ensure stable execution locked at 60 FPS.
  - Enable **Paint Flashing** options in the developer menu to ensure only the ball and paddle trigger rendering regions, validating that the rest of the layout tree remains static.
