const TILE = 40;
const GRAVITY = 2;
const JUMP_VEL = -24;
const DOUBLE_JUMP_VEL = -20;
const MOVE_SPEED = 6;
const FRICTION = 0.8;
const MAX_FALL = 20;
const PLAYER_W = 26;
const PLAYER_H = 36;
const ENEMY_W = 30;
const ENEMY_H = 30;
const GROUND_Y = 520;
const CANVAS_H = 600;
const LEVEL_LENGTH = 12000;

let seedCounter = Date.now();

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateLevel(seed) {
  const rng = seededRandom(seed || seedCounter++);
  const platforms = [];
  const enemies = [];
  const coins = [];
  const pipes = [];
  const questionBlocks = [];

  let x = 0;

  platforms.push({ x: 0, y: GROUND_Y, w: 600, h: TILE });
  for (let i = 0; i < 5; i++) {
    const cx = 80 + Math.floor(rng() * 460);
    const cy = GROUND_Y - 50 - Math.floor(rng() * 30);
    coins.push({ x: cx, y: cy, collected: false });
  }

  pipes.push({ x: 300, y: GROUND_Y - 80, w: 50, h: 80 });
  platforms.push({ x: 300, y: GROUND_Y - 80, w: 50, h: 80 });

  x = 600;

  while (x < LEVEL_LENGTH) {
    const segW = 250 + Math.floor(rng() * 300);
    const segStart = x;

    platforms.push({ x: segStart, y: GROUND_Y, w: segW, h: TILE });

    const coinCount = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < coinCount; i++) {
      const cx = segStart + 40 + Math.floor(rng() * (segW - 80));
      const cy = GROUND_Y - 35 - Math.floor(rng() * 20);
      coins.push({ x: cx, y: cy, collected: false });
    }

    if (rng() > 0.5 && segW > 250) {
      const enemyX = segStart + 50 + Math.floor(rng() * (segW - 100));
      enemies.push({
        x: enemyX, y: GROUND_Y - ENEMY_H,
        w: ENEMY_W, h: ENEMY_H,
        type: 'goomba',
        vx: rng() > 0.5 ? -1.5 : 1.5,
        alive: true,
        patrolMin: segStart + 10,
        patrolMax: segStart + segW - ENEMY_W - 10,
      });
    }

    if (rng() > 0.5) {
      const px = segStart + 30 + Math.floor(rng() * (segW - 80));
      const py = GROUND_Y - 70 - Math.floor(rng() * 50);
      const pw = 80 + Math.floor(rng() * 100);
      platforms.push({ x: px, y: py, w: pw, h: 20 });

      if (rng() > 0.3) {
        const cCount = 2 + Math.floor(rng() * 3);
        for (let i = 0; i < cCount; i++) {
          const t = i / (cCount - 1);
          const cx = Math.round(px + t * pw);
          const cy = py - 10 - Math.round(Math.sin(t * Math.PI) * 40);
          coins.push({ x: cx, y: cy, collected: false });
        }
      }
    }

    if (rng() > 0.5 && segW > 300 && x > 800) {
      const qx = segStart + 40 + Math.floor(rng() * (segW - 120));
      const qy = GROUND_Y - 110 - Math.floor(rng() * 40);
      questionBlocks.push({ x: qx, y: qy, w: 36, h: 36, hit: false });
      platforms.push({ x: qx, y: qy, w: 36, h: 36 });
    }

    if (rng() > 0.6 && segW > 350 && x > 1000) {
      const ph = 60 + Math.floor(rng() * 60);
      const pipeX = segStart + 60 + Math.floor(rng() * (segW - 120));
      pipes.push({ x: pipeX, y: GROUND_Y - ph, w: 50, h: ph });
      platforms.push({ x: pipeX, y: GROUND_Y - ph, w: 50, h: ph });
    }

    x += segW + (rng() > 0.35 ? 40 + Math.floor(rng() * 60) : 0);
    while (x < LEVEL_LENGTH && rng() > 0.6 && x > 1200) {
      const px = x + Math.floor(rng() * 40);
      const py = GROUND_Y - 90 - Math.floor(rng() * 50);
      const pw = 70 + Math.floor(rng() * 80);
      platforms.push({ x: px, y: py, w: pw, h: 20 });

      if (rng() > 0.4) {
        const cCount = 2 + Math.floor(rng() * 2);
        for (let i = 0; i < cCount; i++) {
          const t = i / (cCount - 1);
          const cx = Math.round(px + t * pw);
          const cy = py - 5 - Math.round(Math.sin(t * Math.PI) * 30);
          coins.push({ x: cx, y: cy, collected: false });
        }
      }
      x += pw + 50;
    }
  }

  const finishX = LEVEL_LENGTH - 120;

  platforms.push({ x: finishX, y: GROUND_Y, w: 120, h: TILE * 3 });

  platforms.push({ x: finishX + 10, y: GROUND_Y - 160, w: 8, h: 160 });
  platforms.push({ x: finishX + 90, y: GROUND_Y - 160, w: 8, h: 160 });

  return { platforms, enemies, coins, pipes, questionBlocks, width: LEVEL_LENGTH };
}

function createPlayerState(id) {
  return {
    id,
    x: 60, y: GROUND_Y - PLAYER_H,
    vx: 0, vy: 0,
    w: PLAYER_W, h: PLAYER_H,
    onGround: false,
    alive: true,
    distance: 0,
    facing: 1,
    coins: 0,
    respawnTimer: 0,
    justDied: false,
    dying: false,
    deathTimer: 0,
    coinCollected: false,
    jumps: 0,
    walkFrame: 0,
    walkTimer: 0,
    wasMoving: false,
  };
}

function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h >= b.y;
}

function updatePlatformer(state, inputs, dt) {
  const { players, level } = state;

  for (const enemy of level.enemies) {
    if (!enemy.alive) continue;
    enemy.x += enemy.vx;
    if (enemy.x <= enemy.patrolMin || enemy.x + enemy.w >= enemy.patrolMax) {
      enemy.vx *= -1;
    }
  }

  for (const player of players) {
    if (!player.alive) {
      if (player.dying) {
        player.deathTimer -= dt;
        if (player.deathTimer <= 0) {
          player.dying = false;
          player.x = 60;
          player.y = GROUND_Y - PLAYER_H;
          player.vx = 0;
          player.vy = 0;
          player.alive = true;
          player.onGround = false;
          player.respawnTimer = 0;
        }
      } else if (player.respawnTimer > 0) {
        player.respawnTimer -= dt;
        if (player.respawnTimer <= 0) {
          player.x = 60;
          player.y = GROUND_Y - PLAYER_H;
          player.vx = 0;
          player.vy = 0;
          player.alive = true;
          player.onGround = false;
        }
      }
      continue;
    }

    const input = inputs[player.id] || { left: false, right: false, jump: false };

    if (input.left) { player.vx = -MOVE_SPEED; player.facing = -1; }
    else if (input.right) { player.vx = MOVE_SPEED; player.facing = 1; }
    else { player.vx *= FRICTION; if (Math.abs(player.vx) < 0.5) player.vx = 0; }

    const isMoving = Math.abs(player.vx) > 0.5;
    if (isMoving && player.onGround) {
      player.walkTimer += dt;
      if (player.walkTimer >= 120) {
        player.walkTimer = 0;
        player.walkFrame = (player.walkFrame + 1) % 4;
      }
    } else if (!isMoving) {
      player.walkFrame = 0;
      player.walkTimer = 0;
    }
    player.wasMoving = isMoving;

    if (input.jump && player.onGround) {
      player.vy = JUMP_VEL;
      player.onGround = false;
      player.jumps = 1;
    } else if (input.jump && !player.onGround && player.jumps < 2) {
      player.vy = DOUBLE_JUMP_VEL;
      player.jumps++;
    }

    player.vy += GRAVITY;
    if (player.vy > MAX_FALL) player.vy = MAX_FALL;

    player.x += player.vx;
    if (player.x < 0) player.x = 0;

    let collidedY = false;
    for (const plat of level.platforms) {
      if (aabb(player, plat)) {
        if (player.vy > 0 && player.y + player.h - player.vy <= plat.y + 4) {
          player.y = plat.y - player.h;
          player.vy = 0;
          player.onGround = true;
          player.jumps = 0;
          collidedY = true;
          break;
        }
        if (player.vy < 0 && player.y - player.vy >= plat.y + plat.h - 4) {
          player.y = plat.y + plat.h;
          player.vy = 0;
          break;
        }
      }
    }

    if (!collidedY) {
      player.y += player.vy;
      player.onGround = false;

      for (const plat of level.platforms) {
        if (aabb(player, plat)) {
          if (player.vy > 0) {
            player.y = plat.y - player.h;
            player.vy = 0;
            player.onGround = true;
            player.jumps = 0;
          }
          break;
        }
      }
    }

    for (const plat of level.platforms) {
      if (aabb(player, plat)) {
        if (player.x < plat.x + plat.w && player.x + player.w > plat.x + plat.w) {
          player.x = plat.x + plat.w;
        } else if (player.x + player.w > plat.x && player.x < plat.x) {
          player.x = plat.x - player.w;
        }
      }
    }

    if (player.y > CANVAS_H + 100) {
      player.alive = false;
      player.dying = true;
      player.deathTimer = 1200;
      player.vy = -16;
      player.vx = 0;
      player.justDied = true;
    }

    for (const coin of level.coins) {
      if (coin.collected) continue;
      if (Math.abs(player.x + player.w / 2 - coin.x) < 20 &&
          Math.abs(player.y + player.h / 2 - coin.y) < 20) {
        coin.collected = true;
        player.coins++;
        player.coinCollected = true;
      }
    }

    for (const enemy of level.enemies) {
      if (!enemy.alive) continue;
      if (aabb(player, enemy)) {
        if (player.vy > 0 && player.y + player.h - player.vy <= enemy.y + 8) {
          enemy.alive = false;
          player.vy = JUMP_VEL / 2;
          player.onGround = false;
        } else {
          player.alive = false;
          player.dying = true;
          player.deathTimer = 1200;
          player.vy = -14;
          player.vx = player.facing * -3;
          player.justDied = true;
        }
      }
    }

    if (player.x > player.distance) {
      player.distance = Math.floor(player.x);
    }
  }

  state.timeRemaining = Math.max(0, state.timeRemaining - dt);

  if (state.timeRemaining <= 0) {
    state.finished = true;
  }
}

export function createPlatformerGameSetup(playerList) {
  const seed = Date.now();
  const level = generateLevel(seed);
  const players = playerList.map(p => ({
    ...createPlayerState(p.id),
    name: p.name, avatar: p.avatar,
  }));

  return {
    players,
    level,
    timeRemaining: 120000,
    finished: false,
    startedAt: null,
  };
}

export function initPlatformerGame(setup) {
  setup.startedAt = Date.now();
  setup.timeRemaining = 120000;
  for (const p of setup.players) {
    p.x = 60;
    p.y = GROUND_Y - PLAYER_H;
    p.vx = 0; p.vy = 0;
    p.alive = true;
    p.distance = 0;
    p.coins = 0;
    p.onGround = false;
    p.respawnTimer = 0;
  }
  for (const c of setup.level.coins) c.collected = false;
  for (const e of setup.level.enemies) e.alive = true;
  for (const q of setup.level.questionBlocks) q.hit = false;
  setup.finished = false;
}

export function tickPlatformerGame(setup, inputs) {
  updatePlatformer(setup, inputs, 50);
  return !setup.finished;
}

export function getPlatformerDynamicState(setup) {
  return {
    players: setup.players.map(p => {
      const coinCollected = p.coinCollected;
      p.coinCollected = false;
      const justDied = p.justDied;
      p.justDied = false;
      return {
        id: p.id, x: Math.round(p.x), y: Math.round(p.y),
        vx: p.vx, vy: p.vy, onGround: p.onGround,
        alive: p.alive, distance: p.distance,
        facing: p.facing, coins: p.coins,
        respawnTimer: p.respawnTimer, jumps: p.jumps, walkFrame: p.walkFrame,
        dying: p.dying, deathTimer: p.deathTimer, justDied,
        coinCollected,
      };
    }),
    enemies: setup.level.enemies.filter(e => e.alive).map(e => ({
      x: Math.round(e.x), y: Math.round(e.y),
      w: e.w, h: e.h, type: e.type,
    })),
    coins: setup.level.coins.filter(c => !c.collected).map(c => ({ x: c.x, y: c.y })),
    questionBlocks: setup.level.questionBlocks.map(q => ({ x: q.x, y: q.y, w: q.w, h: q.h, hit: q.hit })),
    timeRemaining: setup.timeRemaining,
    finished: setup.finished,
  };
}

export function getPlatformerLevelData(setup) {
  return {
    platforms: setup.level.platforms,
    width: setup.level.width,
    coins: setup.level.coins.map(c => ({ x: c.x, y: c.y, collected: c.collected })),
    enemies: setup.level.enemies.map(e => ({
      x: e.x, y: e.y, w: e.w, h: e.h, type: e.type,
      patrolMin: e.patrolMin, patrolMax: e.patrolMax, vx: e.vx, alive: e.alive,
    })),
    pipes: setup.level.pipes,
    questionBlocks: setup.level.questionBlocks,
  };
}

export function getPlatformerResults(setup) {
  const sorted = [...setup.players].sort((a, b) => b.distance - a.distance);
  return {
    sorted: sorted.map(p => ({ id: p.id, name: p.name, avatar: p.avatar, distance: p.distance, coins: p.coins })),
    winner: sorted[0] || null,
  };
}
