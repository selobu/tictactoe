# Tic Tac Tournament

A real-time multiplayer Mario-themed tic-tac-toe and Mine Finder tournament game with betting, custom SVG avatars, and Web Audio sound effects.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Game Modes](#game-modes)
4. [Socket Events](#socket-events)
5. [Tournament Flow](#tournament-flow)
6. [Mine Finder Rules](#mine-finder-rules)
7. [Betting System](#betting-system)
8. [Components](#components)
9. [Avatar System](#avatar-system)
10. [State Management](#state-management)
11. [Styling](#styling)
12. [Development Setup](#development-setup)
13. [Deployment](#deployment)
14. [Configuration Files](#configuration-files)

---

## Architecture Overview

**Stack:** Node.js + Express + Socket.io (server) / React + Vite (client)

- **Single-server architecture:** Express serves both the REST API and the built client files (`client/dist/`).
- **Real-time:** All game state lives in server memory (no database). Socket.io broadcasts moves, timers, and results to all room members.
- **In-memory state:** Rooms, tournaments, games, and player data are stored in JavaScript objects. A server restart resets everything.

```
Browser  →  socket.io (WebSocket)  →  Express server (port 3001)
                ↑                           |
                └─────────── HTTP (client build) ←─── express.static
```

---

## Project Structure

```
/
├── client/                        # React frontend
│   ├── src/
│   │   ├── main.jsx               # Entry point (render <App />)
│   │   ├── App.jsx                # Root component, socket handlers, screen routing
│   │   ├── App.css                # All styles (~3300 lines)
│   │   ├── socket.js              # Socket.io client factory
│   │   ├── components/
│   │   │   ├── MarioAvatar.jsx    # 26 SVG character renderers + charData colors
│   │   │   ├── AvatarDisplay.jsx  # Avatar dispatcher (SVG or emoji fallback)
│   │   │   ├── MarioBackground.jsx# Full parallax Mario world scene
│   │   │   ├── Lobby.jsx          # Join/create room form + avatar picker
│   │   │   ├── WaitingRoom.jsx    # Pre-game lobby, game type selector
│   │   │   ├── GameBoard.jsx      # 3×3 tic-tac-toe board
│   │   │   ├── MineBoard.jsx      # 10×10 blind minesweeper board
│   │   │   ├── BettingPhase.jsx   # Betting UI (side picker, pot, timer)
│   │   │   ├── RoundResults.jsx   # Per-round matchups summary
│   │   │   ├── ChampionScreen.jsx # End-of-tournament champion + leaderboard
│   │   │   ├── TimerClock.jsx     # SVG circular countdown timer
│   │   │   └── Sparkles.jsx       # Decorative floating particles
│   │   └── utils/
│   │       ├── marioAvatars.js    # Avatar key/name array (26 entries)
│   │       └── marioMusic.js      # Web Audio API sound synthesis
│   └── package.json
│
├── server/                        # Node.js backend
│   ├── src/
│   │   ├── index.js               # Express + Socket.io server (758 lines)
│   │   ├── gameLogic.js           # createBoard, makeMove, checkWin, createMineBoard, revealMineCell
│   │   └── tournament.js          # Tournament bracket logic, scoring, betting
│   └── package.json
│
├── Dockerfile                     # Single-container build (client + server)
├── docker-compose.yml
├── netlify.toml                   # Static client deployment config
├── render.yaml                    # Server deployment config
└── DOCUMENTATION.md               # This file
```

---

## Game Modes

### Tic-Tac-Toe

- Standard 3×3 grid, X vs O.
- Each round pairs players in a **2-game series** (each player goes first once).
- If tied after 2 games, the player with more coins wins.
- 30-second move timer per player (per game). Timer runs down during your turn, pauses during opponent's turn.

### Mine Finder

- 10×10 grid with **16 hidden mines**.
- **Blind mode:** cells are always hidden — no numbers, no flood fill. Players click blindly.
- Each player gets **2 turns** per match (4 turns total per match).
- Each turn uses a **freshly randomized board**.
- During a turn, the player clicks safe cells continuously until:
  - They hit a mine (turn ends, 1200ms explosion animation)
  - Their 60s timer expires (turn ends, -200 coin penalty)
  - On their **second turn**: additionally, the turn ends immediately when their turn score exceeds the opponent's last turn score ("beat" condition)
- **Scoring:** +1 point per safe cell pressed. Total across all 4 turns determines the winner.
- The board is shared with all players (spectators see revealed cells) but only the active player can click.

---

## Socket Events

### Client → Server

| Event | Data | When |
|---|---|---|
| `join-room` | `{ roomId, playerName, avatar }` | User submits lobby form |
| `start-tournament` | `{ gameType }` | Host clicks Start Tournament |
| `make-move` | `{ matchId, cellIndex }` | Player clicks a cell |
| `place-bet` | `{ matchId, amount, on }` | Player places a bet |
| `new-tournament` | — | Player clicks Play Again |
| `leave-room` | — | Player leaves or disconnects |

### Server → Client

| Event | Data | When |
|---|---|---|
| `room-update` | `{ players, tournament, gameType }` | Any room state change |
| `tournament-start` | `{ tournament, gameType }` | Tournament begins |
| `match-start` | `{ match, series }` | A match game begins |
| `board-update` | `{ matchId, board, currentTurn, moveCooldownUntil }` | Tic-tac-toe move made |
| `mine-board-update` | `{ matchId, board, cellIndex, scores, currentTurn, moveCooldownUntil }` | Safe mine cell revealed |
| `mine-hit` | `{ matchId, cellIndex, scores, currentTurn, moveCooldownUntil }` | Mine detonated |
| `mine-turn-start` | `{ matchId, board, currentTurn, moveCooldownUntil, scores }` | New mine turn begins |
| `timer-update` | `{ p1, p2, currentTurn }` | Every 250ms during match |
| `match-result` | `{ match, winner, draw, winCombo, tournament }` | Game ends |
| `series-result` | `{ seriesId, winner, loserId, p1wins, p2wins }` | Full series ends |
| `round-results` | `{ round, pairs, advanced }` | Round complete |
| `round-start` | `{ round, message }` | New round begins |
| `tournament-end` | `{ champion, runnerUp, mostCoins, tournament }` | Tournament finished |
| `betting-start` | `{ matchId, player1, player2, players, bettingEndAt }` | Betting phase opens |
| `bet-update` | `{ matchId, bettorId, on, amount }` | A bet was placed |
| `betting-finished` | `{ matchId, bets, totalPot }` | Betting period ends |
| `player-abandoned` | `{ playerName, playerId }` | Player disconnected |

---

## Tournament Flow

```
Lobby  →  Waiting Room  →  (Host selects game type)  →  Tournament Start
                                                                │
                          ┌───────────────────────────────────┐
                          ▼                                   │
                   Betting Phase (60s)                        │
                          │                                   │
                          ▼                                   │
                    Game 1 of Series                          │
                          │                                   │
                    Game 2 of Series                          │
                          │                                   │
                   Series Complete ──── more pairs? ────── yes┘
                          │
                     All series done? ──no──→ Next round
                          │
                Round Results (8s display)
                          │
                    Tournament over?
                     yes → Champion Screen → Play Again
                      no → Next round
```

---

## Mine Finder Rules

### Match Format

- **4 turns total**: Player A turn 1, Player B turn 1, Player A turn 2, Player B turn 2.
- Each turn reveals cells on a **fresh 10×10 board** (16 mines).

### Turn Mechanics

1. Active player clicks hidden cells.
2. Safe cell → +1 point (shown as green ripple), player keeps clicking.
3. Mine hit → explosion animation (1200ms), turn ends.
4. Timer expires (60s per player total) → turn ends, -200 coin penalty.
5. Second turn special rule: turn ends immediately when current-turn score > opponent's last-turn score ("beat" condition).
6. Winner = highest total score across all 4 turns.

### Board Visibility

All players see the same board state (revealed cells are synced via `cell.revealed` from the server). Only the active player can click. On mine hit, a `mineHitLock` immediately disables the board to prevent further clicks during the explosion animation.

### Timer

- 60 seconds per player, shared across all their turns.
- If it runs out before the player finishes all 2 turns, remaining turns are forfeited with a coin penalty.

---

## Betting System

### Flow

1. Before each series, a **60-second betting phase** opens for all room members (not just participants).
2. Each player picks a side (Player 1 or Player 2) and wagers an amount.
3. Match participants auto-bet **100 coins** on themselves if they don't bet before the timer ends.
4. The total pot is **boosted by 30%** (×1.3 multiplier).
5. Winners split the boosted pot proportionally based on their bet amount.
6. If the series is a draw, all bets are refunded.

### Bet Limits

- Minimum bet: 10 coins.
- Maximum bet: whatever the player has (ALL IN shortcut).

---

## Components

### App.jsx

The root component manages all state and socket event listeners. It conditionally renders one of these screens based on the `screen` state:

- `lobby` → `<Lobby>`
- `waiting` → `<WaitingRoom>`
- `game` → `<GameBoard>` or `<MineBoard>` (depending on `gameType`)
- `betting` → `<BettingPhase>`
- `round-results` → `<RoundResults>`
- `champion` → `<ChampionScreen>`

### GameBoard

**Props:** `board`, `onCellClick`, `disabled`, `myMark`, `isMyTurn`, `winCombo`, `showWait`, `player1`, `player2`, `currentTurn`, `myId`

- 3×3 button grid.
- Winning cells get a pulsing glow (`.win-cell`).
- Shows whose turn it is with avatar + name.
- Cooldown bar appears briefly when turn switches.

### MineBoard

**Props:** `board`, `onCellClick`, `disabled`, `isMyTurn`, `showWait`, `player1`, `player2`, `currentTurn`, `myId`, `scores`, `mineHitIndex`, `safePressIndex`

- 10×10 button grid.
- All cells start hidden. Uses `cell.revealed` from server data (synced to all players).
- Animations: green ripple on safe press, nuclear explosion (screen shake + mushroom cloud) on mine.
- Score bars show current turn scores.

### BettingPhase

**Props:** `match`, `player1`, `player2`, `playerId`, `players`, `bettingEndAt`, `bets`, `onPlaceBet`, `tournament`

- Bet side selector with coin amounts (100, 500, ALL IN shortcuts).
- Shows pot size with boosted multiplier.
- Lists all bets placed.
- Live countdown timer.

### WaitingRoom

**Props:** `players`, `playerId`, `tournament`, `onStart`

- Player list with status indicators, host badge, coin counts.
- Host sees game type toggle (Tic-Tac-Toe / Mine Finder) and Start button.
- Max 16 players.

### ChampionScreen

**Props:** `champion`, `players`, `onPlayAgain`, `runnerUp`, `mostCoins`

- Confetti animation, trophy, champion card.
- Runner-up (silver) and richest player (money bag) cards.
- Full leaderboard sorted by coins.
- Play Again button.

---

## Avatar System

### Definition

51 avatars across two collections:

- **Classic (26):** `client/src/utils/marioAvatars.js`, rendered by `MarioAvatar.jsx`.
- **Custom animated (25):** `client/src/utils/customAvatars.js`, rendered by `Avatar.jsx` + `Avatar.css`.

```js
export const MARIO_AVATARS = [
  { key: 'mario', name: 'Mario' },
  { key: 'luigi', name: 'Luigi' },
  // ... 25 more classic avatars
];
```

### Rendering

Classic avatars use `charData` palettes in `MarioAvatar.jsx` with shared SVG sub-components (`MarioHat`, `Hair`, `Eyes`, `Cheeks`, `Mouth`, `Face`, `Body`, `Shoe`).

Custom avatars are full SVG illustrations in `Avatar.jsx` (96x96 viewBox) with:

- Per-character idle motion using `data-character` CSS animations.
- Animated internal details: blinking, petals, flames, gills, smoke, door swing, hat sway, and more.
- Hover and selection reactions.
- `prefers-reduced-motion` support.

`AvatarDisplay.jsx` dispatches between the two systems, so custom avatars work everywhere: picker, waiting room, game cells, betting, results, and champion screens.

### Avatar Picker

`Lobby.jsx` shows two tabs:

- **Classic (26):** the existing Mario-themed roster.
- **New Characters (25):** the animated custom roster.

The selected index is stored in `localStorage` (`ttt-player-avatar`), and the correct tab is restored from the saved index.

### Server Assignment

The server maintains an `AVATARS` array (51 entries) and assigns avatars round-robin to players who don't explicitly pick one. Player-picked custom keys are accepted as long as they are unused in the room.

### Full List

**Classic (26):** Mario, Luigi, Peach, Bowser, Toad, Yoshi, Boo, Star, Fire Flower, Koopa, Daisy, Rosalina, Wario, Waluigi, Shark, Smiling Shark, Chinese Princess, American Eagle, Mexican, Realtor, Sumo Fighter, Mexican Woman, Colombia, Business Man, Chespirito, Baby.

**Custom animated (25):** 12 Plumbers, Flower Person, Pine Tree, Smiling Cloud, Rocket, Mushroom, Cactus, Ringed Planet, Robot, Coffee Bean, Bald Eagle, Axolotl, Smiling House, Catrina.

---

## State Management

All state lives in `App.jsx` as React state. Key groups:

| Group | State variables |
|---|---|
| **Connection** | `playerId`, `roomId`, `playerName` |
| **Room** | `players`, `roomId` |
| **Tournament** | `tournament`, `champion`, `roundResults`, `gameType` |
| **Game** | `currentMatch`, `winner`, `winCombo`, `mineScores`, `mineHitIndex`, `safePressIndex`, `boardVersion`, `mineHitLock` |
| **UI** | `screen`, `message`, `screenTransition`, `error`, `joining`, `abandonToast` |
| **Timer** | `timer` |
| **Betting** | `bettingMatch`, `bettingPlayer1`, `bettingPlayer2`, `bettingEndAt`, `bets` |

---

## Styling

All styles are in `client/src/App.css` (~3300 lines). Key sections:

- **Mario Background:** Sky gradient, sun with rays, drifting clouds, parallax hills, trees, "?" blocks, spinning coins, flagpole, pipes, bushes, fire flowers (with faces), brick ground.
- **Lobby:** Glassmorphism card with animated gradient border, avatar grid (7 columns).
- **Game board:** 3×3 grid with X/O marks, winning cell glow, player tags with active turn highlight.
- **Mine board:** 10×10 grid, hidden cell styling, safe press ripple animation, nuclear explosion animation (shake + mushroom cloud).
- **Betting phase:** Card-based layout with side picker, amount shortcuts, pot display.
- **Champion:** Confetti particles, rotating border on champion card, leaderboard.
- **Responsive:** Single breakpoint at 600px for mobile.

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Terminal 1: Server
cd server
npm install
npm run dev       # starts on port 3001, auto-restart on file changes

# Terminal 2: Client
cd client
npm install
npm run dev       # starts Vite on port 5173, proxies /socket.io to server
```

The client dev server proxies `/socket.io` requests to `http://localhost:3001` (configured in `vite.config.js`). Set `VITE_SERVER_URL` environment variable to override the default same-origin connection.

### Production Build

```bash
cd client
npm run build     # outputs to client/dist/
cd ../server
npm start         # serves client/dist/ + API on port 3001
```

---

## Deployment

### Option 1: Docker (single container)

```bash
docker build -t tictactoe .
docker run -p 3001:3001 tictactoe
# or: docker compose up
```

The Dockerfile installs client + server deps, builds the client, and starts the server from `/app/server`.

### Option 2: Render (free tier)

Update `render.yaml`:

```yaml
services:
  - type: web
    name: tic-tac-tournament
    env: node
    buildCommand: cd client && npm install && npm run build && cd ../server && npm install
    startCommand: cd server && npm start
```

**Free tier caveats:**
- Spins down after 15 min idle → all in-memory state lost.
- Cold start ~30-60s.
- Use a cron job (e.g., cron-job.org) to ping `/` every 10 min to prevent sleep.

### Option 3: Railway

Same build as Render. No spin-down within credit. $5/mo minimum after $5 free credit expires.

### Option 4: VPS + Coolify

Deploy via Docker compose on any VPS (Hetzner, DigitalOcean, etc.) using Coolify for a Heroku-like experience with no sleep.

### Option 5: Netlify (client only) + Render (server)

The client can be deployed to Netlify (configured in `netlify.toml`). Set `VITE_SERVER_URL` to the Render server URL. The server must have CORS enabled (already configured).

---

## Configuration Files

| File | Purpose |
|---|---|
| `Dockerfile` | Single-container build (node:20-alpine, client build, server start) |
| `docker-compose.yml` | Maps port 3001 |
| `netlify.toml` | Builds client, publishes `client/dist/`, SPA redirects |
| `render.yaml` | Server deployment on Render |
| `.dockerignore` | Excludes node_modules, dist, .git |
| `client/vite.config.js` | Dev proxy for `/socket.io` → `localhost:3001` |

---

## Key Server Functions

### `server/src/gameLogic.js`

| Function | Description |
|---|---|
| `createBoard()` | Empty 3×3 array |
| `makeMove(board, index, mark)` | Place mark, check win/draw, return result |
| `checkWin(board)` | Check 8 win combos, return winning mark + indices |
| `createMineBoard(rows=10, cols=10, mineCount=16)` | Random mine placement, adjacent counts |
| `revealMineCell(game, cellIndex)` | Reveal a cell, return `{ valid, mine }` |

### `server/src/tournament.js`

| Function | Description |
|---|---|
| `createTournament(players)` | Initialize tournament state |
| `startRound(tournament)` | Pair active players, give BYE to odd player |
| `createGameForSeries(tournament, series, gameType)` | Create game with appropriate board |
| `finalizeSeries(tournament, series)` | Determine winner, eliminate loser |
| `checkRoundComplete(tournament)` | Check if round is done, advance or finish |
| `addCoins(tournament, playerId, amount)` | Add/remove coins (clamped to ≥ 0) |
| `penalizeDraw(tournament, p1Id, p2Id)` | Deduct 100 coins per player on draw |
| `getRoundResults(tournament, round)` | Format matchups for display |
| `getMostCoinsPlayer(tournament)` | Find richest player |
