import Matter from 'matter-js';

const { Engine, World, Bodies, Body, Query } = Matter;

// The game is simulated on the server at 20 Hz. Matter runs three 60 Hz
// substeps per tick, which also removes tunneling through thin platforms.
const PHYSICS_STEPS = 3;
const PHYSICS_DT = 1000 / 60;
const GRAVITY_SUB = 0.38;        // faster, snappier arc (~1368 px/s² at 60 Hz)
const MOVE_SUB = 3;              // 180 px/s
const JUMP_SUB = -10.5;          // ~145px apex, reached much faster
const DOUBLE_JUMP_SUB = -8.2;
const MAX_FALL_SUB = 8.5;        // quicker descent

const PLAYER_W = 32;
const PLAYER_H = 44;
const ENEMY_TYPES = {
  goomba: { w: 30, h: 30, speed: 1.4 },
  koopa: { w: 30, h: 34, speed: 2.2 },
  spiny: { w: 30, h: 30, speed: 1.8 },
  jumper: { w: 28, h: 26, speed: 1.1 },
  flyer: { w: 34, h: 26, speed: 1.2 },
  toad: { w: 30, h: 32, speed: 1.7 },
  fire: { w: 30, h: 34, speed: 2.0 },
  spitter: { w: 32, h: 34, speed: 0.8 },
  penguin: { w: 30, h: 32, speed: 2.1 },
  gust: { w: 36, h: 30, speed: 1.5 },
  ghost: { w: 32, h: 34, speed: 1.15 },
  blinky: { w: 32, h: 34, speed: 3.2 },
  pinky: { w: 32, h: 34, speed: 2.9 },
  inky: { w: 32, h: 34, speed: 3.0 },
  clyde: { w: 32, h: 34, speed: 2.6 },
  fish: { w: 36, h: 26, speed: 1.6 },
  jelly: { w: 28, h: 34, speed: 0.9 },
};
const DEFAULT_PHYSICS = {
  grip: 0.44,
  airGrip: 0.08,
  iceGrip: 0.11,
  jump: -10.5,
  doubleJump: -8.2,
  gravity: 0.38,
  maxFall: 8.5,
};
const LEVEL_PHYSICS = {
  grass: { ...DEFAULT_PHYSICS, airGrip: 0.12 },
  cave: { grip: 0.40, airGrip: 0.09, iceGrip: 0.105, jump: -10.2, doubleJump: -8.0, gravity: 0.36, maxFall: 8.6 },
  sky: { grip: 0.31, airGrip: 0.14, iceGrip: 0.11, jump: -10.9, doubleJump: -8.7, gravity: 0.30, maxFall: 7.1 },
  castle: { grip: 0.50, airGrip: 0.11, iceGrip: 0.11, jump: -10.4, doubleJump: -8.2, gravity: 0.42, maxFall: 9.2 },
  pac: { grip: 0.52, airGrip: 0.15, iceGrip: 0.11, jump: -10.6, doubleJump: -8.5, gravity: 0.36, maxFall: 8.5 },
  koopa: { grip: 0.48, airGrip: 0.10, iceGrip: 0.11, jump: -10.5, doubleJump: -8.3, gravity: 0.43, maxFall: 9.4 },
  water: { grip: 0.26, airGrip: 0.20, iceGrip: 0.11, jump: -8.1, doubleJump: -7.2, gravity: 0.17, maxFall: 4.6 },
};
const GROUND_Y = 520;
const GROUND_H = 80;
const CANVAS_H = 600;
const LEVEL_WIDTH = 9100;
const BOSS_ARENA_START = 8200;
const BOSS_TRIGGER_X = 8250;
const BOSS_GATE_X = 8860;
const BOSS_GATE_W = 30;
const BOSS_GATE_H = 230;
const FINISH_X = 8990;
const TIME_LIMIT = 120000;
const COYOTE_TICKS = 2;
const JUMP_BUFFER_TICKS = 2;
const DEATH_MS = 1000;
const RESPAWN_INVULN_MS = 2000;
const RESPAWN_INVULN_TICKS = Math.ceil(RESPAWN_INVULN_MS / 50);
const BOSS_TIME_BONUS_PER_SEC = 25;
const BOSS_DEFEAT_BONUS = 1000;
const BOSS_HIT_BONUS = 150;

const LEVEL_NAMES = {
  grass: 'Mushroom Plains',
  cave: 'Crystal Caverns',
  sky: 'Cloud Kingdom',
  castle: 'Celestial Citadel',
  pac: 'Neon Labyrinth',
  koopa: "Kuppa's Lava Keep",
  water: 'Sunken Ruins',
};
const PLATFORMER_LEVEL_IDS = Object.keys(LEVEL_NAMES);

const BOSS_DEFS = {
  grass: {
    name: 'Princess Peach',
    title: 'The Royal Rage',
    intro: 'I am DONE being the prize!',
    taunts: ['I hope you like turnips!', 'TOAD, DEAL WITH THEM!', 'Royal decree: SQUASH!'],
    defeatTaunt: "Fine! But I'm keeping the crown.",
    movement: 'peach',
    weapon: 'Turnip Toss & Royal Decree',
    projectile: 'turnip',
    style: 'air',
    w: 78, h: 82, hp: 6,
    speed: 1.7,
    jumpEvery: 0, jumpDuration: 0, jumpHeight: 0,
    attackEvery: 1900,
    color: 0xffb7d5,
  },
  cave: {
    name: 'Crystal Serpent',
    title: 'The Prism Devourer',
    intro: 'Sssso bold... I like that.',
    taunts: ['Sssslide into oblivion.', 'My ssscales shine!', 'Ssshatter!'],
    defeatTaunt: 'My prism... goesss dark...',
    movement: 'serpentine',
    weapon: 'Prism Shards',
    projectile: 'crystal',
    style: 'air',
    w: 108, h: 64, hp: 6,
    speed: 1.9,
    jumpEvery: 0, jumpDuration: 0, jumpHeight: 0,
    attackEvery: 1800,
    color: 0x9b7bff,
  },
  sky: {
    name: 'Storm Djinn',
    title: 'The Cloudbreaker',
    intro: 'BOW TO THE STORM!',
    taunts: ['THUNDER OBEYS ME!', 'BLOWN AWAY YET?', 'THE SKY IS MINE!'],
    defeatTaunt: 'Impossible... my storm...',
    movement: 'blink',
    weapon: 'Skyfall Bolts',
    projectile: 'bolt',
    style: 'air',
    w: 100, h: 70, hp: 7,
    speed: 2.3,
    jumpEvery: 0, jumpDuration: 0, jumpHeight: 0,
    attackEvery: 1750,
    color: 0x7dd3fc,
  },
  castle: {
    name: 'Kai',
    title: 'The Celestial Champion',
    intro: "So you reached the citadel. Let's have some fun!",
    taunts: ['Not bad! Now I am warming up!', 'Okay, okay... time to go all out!', 'Your moves are impressive!'],
    defeatTaunt: "Heh... you're stronger than you look. The citadel is yours.",
    movement: 'kai',
    weapon: 'Ki Barrage & Celestial Wave',
    projectile: 'ki',
    style: 'air',
    w: 92, h: 104, hp: 9,
    speed: 2.5,
    jumpEvery: 0, jumpDuration: 0, jumpHeight: 0,
    attackEvery: 1500,
    color: 0xff8c1a,
  },
  pac: {
    name: 'The Glutton',
    title: 'Devourer of the Maze',
    intro: 'WAKA WAKA... YOU LOOK TASTY!',
    taunts: ['PELLET POWER!', 'CHOMP CHOMP CHOMP!', 'THE MAZE IS MINE!'],
    defeatTaunt: 'BURP... good game.',
    movement: 'chomper',
    weapon: 'Pellet Burst & Ghost Summon',
    projectile: 'pellet',
    style: 'ground',
    w: 96, h: 90, hp: 8,
    speed: 2.2,
    jumpEvery: 1900, jumpDuration: 620, jumpHeight: 78,
    attackEvery: 1550,
    color: 0xffd93d,
  },
  koopa: {
    name: 'Kuppa',
    title: 'The Koopa King',
    intro: 'GWAAHAHA! THIS KEEP IS MINE!',
    taunts: ['BURN, LITTLE HERO!', 'SHELL SPIN!', 'GWAAHAHA!'],
    defeatTaunt: 'GWAH... I NEED A BIGGER CASTLE...',
    movement: 'kuppa',
    weapon: 'Fire Breath & Shell Spin',
    projectile: 'fire',
    style: 'ground',
    w: 112, h: 100, hp: 10,
    speed: 1.8,
    jumpEvery: 2500, jumpDuration: 800, jumpHeight: 112,
    attackEvery: 1500,
    color: 0x7bc96f,
  },
  water: {
    name: 'Kraken',
    title: 'The Abyss Sovereign',
    intro: 'THE DEEP... HUNGERS...',
    taunts: ['INK IN YOUR EYES!', 'SINK TO THE ABYSS!', 'MY TENTACLES ARE EVERYWHERE!'],
    defeatTaunt: 'The tide... recedes...',
    movement: 'kraken',
    weapon: 'Ink Barrage & Tentacle Sweep',
    projectile: 'ink',
    style: 'air',
    w: 112, h: 84, hp: 9,
    speed: 1.6,
    jumpEvery: 0, jumpDuration: 0, jumpHeight: 0,
    attackEvery: 1900,
    color: 0x7c5cff,
  },
};

function createBossState(theme) {
  const def = BOSS_DEFS[theme] || BOSS_DEFS.grass;
  const spawnX = BOSS_ARENA_START + 360;
  const baseY = def.style === 'ground' ? GROUND_Y - def.h : 286;
  return {
    ...def,
    id: `boss-${theme}`,
    theme,
    hp: def.hp,
    maxHp: def.hp,
    x: spawnX,
    y: baseY,
    spawnX,
    spawnY: baseY,
    baseY,
    gateX: BOSS_GATE_X,
    dir: -1,
    vx: 0,
    vy: 0,
    active: false,
    defeated: false,
    gateOpen: false,
    phase: 1,
    jumpTimer: def.jumpEvery,
    jumpPhase: 0,
    jumpDir: 0,
    attackTimer: def.attackEvery,
    hitCooldown: 0,
    hitFlash: 0,
    taunt: '',
    tauntTicks: 0,
    teleportTimer: 2400,
    teleported: false,
    blinkTelegraph: false,
    blinkTargetX: spawnX,
    blinkTargetY: baseY + def.h / 2,
    blinkPhase: 0,
    diveTimer: 2600,
    divePhase: 0,
    chargeTimer: 2200,
    chargePhase: 0,
    charging: false,
    chargeDir: 1,
    dashTimer: 2800,
    dashPhase: 0,
    dashing: false,
    dashDir: 1,
    stompTimer: 1700,
    stompPhase: 0,
    stompDuration: 900,
    attackCount: 0,
    projectiles: [],
    projectileCounter: 0,
    defeatedBy: null,
    bossBonus: 0,
    lastHitPoints: 0,
    lastHitBy: null,
    lastHitSeq: 0,
    arenaMin: BOSS_ARENA_START + 45,
    arenaMax: BOSS_GATE_X - def.w - 25,
  };
}


function makeLevel(themeId = 'grass') {
  const theme = LEVEL_NAMES[themeId] ? themeId : 'grass';
  const platforms = [];
  const enemies = [];
  const coins = [];
  const pipes = [];
  const questionBlocks = [];
  const checkpoints = [];
  const hazards = [];
  const icePatches = [];

  const addCoin = (x, y) => coins.push({ x: Math.round(x), y: Math.round(y), collected: false });
  const coinLine = (x, y, count, step = 34) => {
    for (let i = 0; i < count; i++) addCoin(x + i * step, y);
  };
  const coinArc = (x, width) => {
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      addCoin(x + t * width, GROUND_Y - 62 - Math.sin(t * Math.PI) * 50);
    }
  };
  const addPlatform = (x, y, w, withCoins = true) => {
    const plat = { x, y, w, h: 20 };
    platforms.push(plat);
    if (withCoins) {
      const count = Math.max(2, Math.floor(w / 38));
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        addCoin(plat.x + 20 + t * (plat.w - 40), plat.y - 26);
      }
    }
  };
  const addPipe = (x, height) => {
    pipes.push({ x, y: GROUND_Y - height, w: 54, h: height });
    for (let i = 0; i < 3; i++) addCoin(x + 12 + i * 15, GROUND_Y - height - 24);
  };
  const addQuestion = (x, y = GROUND_Y - 128) => {
    const rewards = ['coins', 'life', 'enemy', 'star'];
    questionBlocks.push({
      x, y, w: 36, h: 36, hit: false,
      reward: rewards[questionBlocks.length % rewards.length],
    });
    addCoin(x + 18, y - 32);
  };
  const addQuestionReward = (x, y, reward) => {
    questionBlocks.push({ x, y, w: 36, h: 36, hit: false, reward });
    addCoin(x + 18, y - 32);
  };
  const addEnemy = (x, type = 'goomba', patrolMin = x - 120, patrolMax = x + 120, extra = {}) => {
    const spec = ENEMY_TYPES[type] || ENEMY_TYPES.goomba;
    const y = extra.baseY ?? GROUND_Y - spec.h;
    const dir = extra.dir ?? (enemies.length % 2 === 0 ? -1 : 1);
    enemies.push({
      id: `${type}-${enemies.length + 1}`,
      type,
      x,
      y,
      spawnX: x,
      spawnY: y,
      baseX: x,
      baseY: y,
      w: spec.w,
      h: spec.h,
      speed: spec.speed,
      vx: spec.speed * dir,
      initialVx: spec.speed * dir,
      alive: true,
      patrolMin,
      patrolMax,
      phase: 0,
      hopPhase: 0,
      hopHeight: extra.hopHeight ?? 52,
      ampX: extra.ampX ?? 50,
      ampY: extra.ampY ?? 22,
      moveSpeed: extra.moveSpeed ?? 1.2,
      shootTimer: extra.shootTimer ?? 1200 + (enemies.length % 4) * 260,
      shootWindup: 0,
    });
  };

  // Each level uses a different ground rhythm, platform language, and enemy set.
  let segments;
  if (theme === 'grass') {
    segments = [
      [0, 1100], [1200, 2200], [2300, 3300], [3540, 4500],
      [4600, 5700], [5800, 7000], [7100, 8100], [8200, 9100],
    ];
  } else if (theme === 'cave') {
    segments = [
      [0, 950], [1050, 1950], [2050, 2850], [3000, 3900],
      [4050, 4900], [5050, 6000], [6150, 7100], [7250, 8100], [8200, 9100],
    ];
  } else if (theme === 'sky') {
    segments = [
      [0, 900], [1500, 1900], [2700, 3100], [3900, 4300],
      [5100, 5500], [6300, 6700], [7500, 8100], [8200, 9100],
    ];
  } else if (theme === 'castle') {
    segments = [
      [0, 1000], [1150, 1900], [2100, 2900], [3100, 4000],
      [4200, 5000], [5200, 6100], [6300, 7000], [7200, 8100], [8200, 9100],
    ];
  } else if (theme === 'pac') {
    segments = [[0, 8100], [8200, 9100]];
  } else if (theme === 'koopa') {
    segments = [
      [0, 950], [1100, 1700], [1850, 2500], [2700, 3400], [3600, 4400],
      [4600, 5300], [5500, 6200], [6400, 7100], [7300, 8100], [8200, 9100],
    ];
  } else {
    segments = [
      [0, 1100], [1250, 2100], [2300, 3100], [3300, 4100], [4300, 5100],
      [5300, 6100], [6300, 7100], [7300, 8100], [8200, 9100],
    ];
  }
  for (const [start, end] of segments) {
    platforms.push({ x: start, y: GROUND_Y, w: end - start, h: GROUND_H });
    checkpoints.push(start + 70);
  }

  if (theme === 'grass') {
    // Mushroom Plains: classic pipes, rolling jumps, and an open high route.
    checkpoints.push(3240);
    coinLine(180, GROUND_Y - 46, 4);
    coinLine(680, GROUND_Y - 46, 3);
    addPlatform(790, 420, 140);
    addQuestion(960);
    addPipe(500, 50);
    addEnemy(900, 'goomba', 820, 1040);
    coinArc(1110, 80);

    addPipe(1550, 70);
    addPlatform(1350, 410, 120);
    addEnemy(1750, 'jumper', 1650, 2050, { hopHeight: 54 });
    addPlatform(1900, 430, 150);
    addQuestion(2110);
    addEnemy(2050, 'flyer', 1970, 2130, { baseY: 330, ampX: 60, ampY: 20, moveSpeed: 1.15 });
    coinArc(2210, 80);

    addPlatform(2450, 390, 120);
    addPipe(2700, 60);
    addEnemy(2500, 'koopa', 2380, 2630);
    addEnemy(2950, 'spiny', 2820, 3200);
    addPlatform(3050, 420, 140);
    addQuestion(3230);
    addEnemy(3150, 'flyer', 3070, 3230, { baseY: 320, ampX: 55, ampY: 18, moveSpeed: 1.3 });
    addPlatform(3350, 430, 70);
    addPlatform(3450, 410, 70);

    addPlatform(3600, 430, 110);
    addPipe(3700, 80);
    addPlatform(3850, 410, 150);
    addEnemy(3950, 'koopa', 3760, 4050);
    addPipe(4100, 50);
    addPlatform(4200, 470, 80);
    addPlatform(4290, 430, 80);
    addPlatform(4380, 390, 80);
    addPlatform(4470, 430, 80);
    addEnemy(4350, 'spiny', 4180, 4440);
    addEnemy(4450, 'flyer', 4370, 4530, { baseY: 310, ampX: 60, ampY: 20, moveSpeed: 1.1 });
    coinArc(4510, 80);

    addPlatform(4750, 425, 140);
    addEnemy(4850, 'jumper', 4700, 4950, { hopHeight: 58 });
    addPipe(5000, 70);
    addQuestion(5100);
    addPlatform(5200, 450, 100);
    addPlatform(5300, 410, 100);
    addPlatform(5400, 370, 100);
    addPlatform(5500, 410, 100);
    addPlatform(5600, 450, 100);
    addEnemy(5450, 'koopa', 5300, 5620);
    addEnemy(5400, 'flyer', 5300, 5500, { baseY: 280, ampX: 60, ampY: 20, moveSpeed: 1.3 });
    coinArc(5710, 80);

    addPlatform(5900, 415, 150);
    addQuestion(6100);
    addEnemy(6100, 'jumper', 5900, 6150, { hopHeight: 50 });
    addPipe(6200, 90);
    addPlatform(6400, 420, 160);
    addEnemy(6400, 'flyer', 6320, 6480, { baseY: 330, ampX: 65, ampY: 20, moveSpeed: 1.2 });
    addEnemy(6600, 'koopa', 6460, 6720);
    coinLine(6720, GROUND_Y - 46, 3, 30);

    coinLine(7060, GROUND_Y - 46, 3, 30);
    addPlatform(7250, 410, 140);
    addEnemy(7350, 'koopa', 7200, 7550);
    addPipe(7500, 70);
    addQuestion(7700);
    addPlatform(7800, 380, 120);
    addEnemy(7900, 'jumper', 7800, 8050, { hopHeight: 60 });
    addPlatform(8000, 430, 120);
    coinArc(8110, 80);
  } else if (theme === 'cave') {
    // Crystal Caverns: icy surfaces, crystal spires, penguins, and sharp gaps.
    icePatches.push(
      { x: 1050, y: GROUND_Y, w: 900, h: 14 },
      { x: 2050, y: GROUND_Y, w: 800, h: 14 },
      { x: 4050, y: GROUND_Y, w: 850, h: 14 },
      { x: 6150, y: GROUND_Y, w: 950, h: 14 },
      { x: 7250, y: GROUND_Y, w: 850, h: 14 }
    );
    coinLine(200, GROUND_Y - 46, 4);
    addPipe(430, 60);
    addPlatform(700, 400, 110, false);
    addQuestion(850);
    addEnemy(820, 'penguin', 650, 930);
    coinArc(960, 80);

    addPlatform(1120, 430, 90, false);
    addPlatform(1340, 370, 90, false);
    addPlatform(1380, 310, 80, false);
    addEnemy(1500, 'spiny', 1200, 1850);
    addQuestion(1600);
    addPlatform(1650, 430, 100, false);
    addEnemy(1880, 'penguin', 1700, 1940);
    addPlatform(1975, 430, 60, false);

    addPlatform(2200, 400, 100, false);
    addPlatform(2300, 340, 100, false);
    addPlatform(2400, 290, 90, false);
    addPlatform(2520, 360, 90, false);
    addQuestion(2560, 270);
    addEnemy(2650, 'penguin', 2100, 2820);
    addEnemy(2760, 'flyer', 2500, 2840, { baseY: 300, ampX: 70, ampY: 20, moveSpeed: 1.3 });
    addPlatform(2870, 430, 60, false);
    addPlatform(2940, 390, 60, false);

    addEnemy(3200, 'spiny', 3050, 3350);
    addPipe(3400, 70);
    addPlatform(3550, 380, 110, false);
    addPlatform(3750, 330, 90, false);
    addQuestion(3800, 240);
    addEnemy(3820, 'penguin', 3420, 3880);
    addPlatform(3975, 430, 70, false);

    addPlatform(4150, 430, 90, false);
    addPlatform(4250, 370, 90, false);
    addPlatform(4350, 310, 90, false);
    addPlatform(4450, 350, 90, false);
    addPlatform(4550, 410, 90, false);
    addQuestion(4600, 290);
    addEnemy(4750, 'spiny', 4400, 4880);
    addEnemy(4850, 'flyer', 4600, 4890, { baseY: 290, ampX: 65, ampY: 20, moveSpeed: 1.2 });
    addPlatform(4975, 430, 70, false);

    addPipe(5250, 90);
    addPlatform(5400, 400, 110, false);
    addPlatform(5600, 340, 100, false);
    addPlatform(5800, 390, 90, false);
    addQuestion(5650, 250);
    addEnemy(5500, 'penguin', 5100, 5980);
    addEnemy(5880, 'flyer', 5700, 5990, { baseY: 310, ampX: 60, ampY: 18, moveSpeed: 1.3 });
    addPlatform(6075, 430, 70, false);

    addPlatform(6250, 420, 100, false);
    addPlatform(6350, 360, 100, false);
    addPlatform(6550, 320, 90, false);
    addPlatform(6700, 380, 100, false);
    addQuestion(6500);
    addEnemy(6650, 'spiny', 6200, 6900);
    addPipe(6800, 60);
    addEnemy(7000, 'penguin', 6900, 7080);
    addPlatform(7175, 420, 70, false);

    addPlatform(7350, 410, 100, false);
    addPlatform(7500, 350, 100, false);
    addPlatform(7850, 370, 100, false);
    addPlatform(8000, 430, 100, false);
    addQuestion(7650);
    addEnemy(7450, 'flyer', 7300, 7700, { baseY: 290, ampX: 60, ampY: 22, moveSpeed: 1.3 });
    addEnemy(7800, 'spiny', 7600, 8080);
  } else if (theme === 'sky') {
    // Cloud Kingdom: floaty physics, tiny islands, and long cloud-platform climbs.
    coinLine(160, GROUND_Y - 46, 4);
    addPipe(650, 60);
    addPlatform(980, 430, 100, false);
    addPlatform(1100, 380, 100, false);
    addPlatform(1220, 330, 100, false);
    addPlatform(1340, 380, 100, false);
    addPlatform(1440, 430, 80, false);
    addQuestion(1200, 230);
    addEnemy(1120, 'gust', 950, 1420, { baseY: 300, ampX: 85, ampY: 26, moveSpeed: 1.5 });

    addPipe(1700, 70);
    addEnemy(1650, 'jumper', 1520, 1880, { hopHeight: 72 });
    addPlatform(1980, 420, 100, false);
    addPlatform(2100, 360, 100, false);
    addPlatform(2220, 410, 100, false);
    addPlatform(2340, 350, 100, false);
    addPlatform(2460, 400, 100, false);
    addPlatform(2580, 440, 100, false);
    addQuestion(2300, 230);
    addEnemy(2500, 'flyer', 2050, 2650, { baseY: 290, ampX: 95, ampY: 24, moveSpeed: 1.4 });

    addPipe(2900, 80);
    addEnemy(2950, 'koopa', 2780, 3080);
    addPlatform(3180, 430, 100, false);
    addPlatform(3300, 370, 100, false);
    addPlatform(3420, 320, 100, false);
    addPlatform(3540, 370, 100, false);
    addPlatform(3660, 420, 100, false);
    addPlatform(3780, 380, 100, false);
    addQuestion(3400, 210);
    addEnemy(3600, 'gust', 3200, 3850, { baseY: 270, ampX: 80, ampY: 24, moveSpeed: 1.6 });

    addPipe(4100, 60);
    addEnemy(4050, 'jumper', 3920, 4280, { hopHeight: 75 });
    addPlatform(4380, 420, 100, false);
    addPlatform(4500, 360, 100, false);
    addPlatform(4620, 300, 100, false);
    addPlatform(4740, 350, 100, false);
    addPlatform(4860, 410, 100, false);
    addPlatform(4980, 440, 100, false);
    addQuestion(4600, 190);
    addEnemy(4880, 'flyer', 4450, 5050, { baseY: 300, ampX: 90, ampY: 22, moveSpeed: 1.5 });

    addPipe(5300, 90);
    addEnemy(5250, 'koopa', 5150, 5450);
    addPlatform(5580, 430, 100, false);
    addPlatform(5700, 370, 100, false);
    addPlatform(5820, 310, 100, false);
    addPlatform(5940, 360, 100, false);
    addPlatform(6060, 410, 100, false);
    addPlatform(6180, 440, 100, false);
    addQuestion(5800, 200);
    addEnemy(6000, 'gust', 5600, 6250, { baseY: 300, ampX: 90, ampY: 28, moveSpeed: 1.55 });

    addPipe(6500, 70);
    addEnemy(6450, 'jumper', 6350, 6680, { hopHeight: 78 });
    addPlatform(6780, 420, 100, false);
    addPlatform(6900, 360, 100, false);
    addPlatform(7020, 300, 100, false);
    addPlatform(7140, 350, 100, false);
    addPlatform(7260, 400, 100, false);
    addPlatform(7380, 430, 100, false);
    addQuestion(7000, 190);
    addEnemy(5450, 'flyer', 5400, 5600, { baseY: 320, ampX: 70, ampY: 20, moveSpeed: 1.3 });
    addEnemy(7200, 'gust', 6800, 7450, { baseY: 280, ampX: 95, ampY: 24, moveSpeed: 1.6 });

    addPipe(7700, 80);
    addPlatform(7800, 400, 100, false);
    addPlatform(7950, 360, 90, false);
    addPlatform(8130, 450, 80, false);
    addQuestion(8050, 310);
    addEnemy(7900, 'koopa', 7550, 8080);
  } else if (theme === 'castle') {
    // Celestial Citadel: lava gaps, fire walkers, ghosts, and a hard vertical route.
    hazards.push(
      { x: 1000, y: GROUND_Y - 8, w: 150, h: 90 },
      { x: 1900, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 2900, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 4000, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 5000, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 6100, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 7000, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 8100, y: GROUND_Y - 8, w: 100, h: 90 }
    );
    coinLine(180, GROUND_Y - 46, 4);
    addPipe(600, 60);
    addEnemy(800, 'fire', 650, 980);
    addEnemy(1450, 'spitter', 1300, 1580);
    addQuestion(850);
    addPlatform(1030, 440, 70, false);
    addPlatform(1100, 400, 60, false);
    coinArc(1080, 80);

    addPipe(1600, 70);
    addEnemy(1300, 'ghost', 1200, 1850, { baseY: 300, ampX: 90, ampY: 36, moveSpeed: 1.1 });
    addPlatform(1400, 420, 110, false);
    addPlatform(1500, 350, 100, false);
    addPlatform(1700, 390, 110, false);
    addQuestion(1650, 300);
    addEnemy(1750, 'fire', 1550, 1880);
    addPlatform(1960, 430, 70, false);
    addPlatform(2030, 390, 70, false);

    addEnemy(2200, 'spiny', 2120, 2450);
    addPlatform(2300, 410, 90, false);
    addPlatform(2400, 340, 90, false);
    addPlatform(2600, 300, 90, false);
    addQuestion(2450, 230);
    addPipe(2500, 80);
    addEnemy(2750, 'fire', 2550, 2880);
    addEnemy(2650, 'spitter', 2520, 2880);
    addPlatform(2960, 430, 70, false);
    addPlatform(3030, 390, 70, false);

    addEnemy(3200, 'koopa', 3120, 3450);
    addPlatform(3300, 420, 120, false);
    addPlatform(3500, 360, 100, false);
    addPlatform(3700, 320, 90, false);
    addQuestion(3550, 250);
    addPipe(3400, 70);
    addEnemy(3850, 'ghost', 3200, 3980, { baseY: 280, ampX: 110, ampY: 34, moveSpeed: 1.2 });
    addPlatform(4060, 440, 70, false);
    addPlatform(4130, 400, 70, false);

    addEnemy(4400, 'fire', 4240, 4700);
    addPlatform(4300, 420, 110, false);
    addPlatform(4450, 360, 100, false);
    addPlatform(4700, 330, 90, false);
    addQuestion(4500, 250);
    addPipe(4600, 60);
    addEnemy(4900, 'spiny', 4750, 4980);
    addEnemy(4850, 'spitter', 4720, 4980);
    addPlatform(5060, 430, 70, false);
    addPlatform(5130, 390, 70, false);

    addEnemy(5400, 'fire', 5220, 5700);
    addPipe(5600, 80);
    addPlatform(5300, 410, 100, false);
    addPlatform(5450, 350, 100, false);
    addPlatform(5700, 390, 100, false);
    addQuestion(5550, 240);
    addEnemy(5850, 'ghost', 5300, 6080, { baseY: 300, ampX: 100, ampY: 30, moveSpeed: 1.1 });
    addPlatform(6160, 440, 70, false);
    addPlatform(6230, 400, 70, false);

    addPipe(6600, 60);
    addEnemy(6500, 'fire', 6320, 6880);
    addPlatform(6400, 420, 100, false);
    addPlatform(6550, 360, 100, false);
    addQuestion(6450, 310);
    addEnemy(6800, 'koopa', 6620, 6980);
    addEnemy(6650, 'spitter', 6480, 6980);
    addPlatform(7060, 430, 70, false);
    addPlatform(7130, 390, 70, false);

    addEnemy(7400, 'fire', 7250, 7680);
    addPlatform(7300, 410, 100, false);
    addPlatform(7500, 350, 100, false);
    addPlatform(7700, 390, 100, false);
    addPlatform(7900, 430, 100, false);
    addQuestion(7600, 240);
    addPipe(7500, 70);
    addEnemy(7800, 'spiny', 7550, 8080);
    addEnemy(7750, 'spitter', 7600, 8080);
    addEnemy(8000, 'ghost', 7300, 8090, { baseY: 270, ampX: 100, ampY: 32, moveSpeed: 1.25 });
    addPlatform(8140, 460, 60, false);
  } else if (theme === 'pac') {
    // Neon Labyrinth: pellet lanes, maze platforms, and four ghost personalities.
    coinLine(180, GROUND_Y - 46, 6, 28);
    for (let x = 600; x < 7900; x += 900) {
      addPlatform(x, 430, 220, false);
      addPlatform(x + 270, 350, 180, false);
      addPlatform(x + 500, 430, 180, false);
      addPlatform(x + 690, 280, 150, false);
      coinLine(x + 30, 404, 5, 32);
      coinLine(x + 520, 404, 4, 32);
      coinLine(x + 700, 254, 4, 28);
    }
    addQuestionReward(1000, GROUND_Y - 128, 'star');
    addQuestionReward(2800, GROUND_Y - 128, 'star');
    addQuestionReward(4600, GROUND_Y - 128, 'star');
    addQuestionReward(6400, GROUND_Y - 128, 'star');
    addQuestion(1900, 300);
    addQuestion(5500, 300);
    addPipe(1550, 60);
    addPipe(3100, 80);
    addPipe(5150, 60);
    addPipe(6700, 90);
    addEnemy(1050, 'blinky', 800, 1500, { baseY: 340, ampX: 120, ampY: 26, moveSpeed: 1.2 });
    addEnemy(2150, 'pinky', 1800, 2600, { baseY: 300, ampX: 140, ampY: 30, moveSpeed: 1.2 });
    addEnemy(3300, 'inky', 3000, 3700, { baseY: 350, ampX: 150, ampY: 38, moveSpeed: 1.3 });
    addEnemy(4550, 'clyde', 4200, 4900, { baseY: 320, ampX: 130, ampY: 30, moveSpeed: 1.05 });
    addEnemy(5750, 'blinky', 5400, 6300, { baseY: 330, ampX: 140, ampY: 28, moveSpeed: 1.35 });
    addEnemy(6900, 'pinky', 6500, 7300, { baseY: 300, ampX: 150, ampY: 34, moveSpeed: 1.25 });
    addEnemy(7600, 'inky', 7300, 8000, { baseY: 350, ampX: 130, ampY: 30, moveSpeed: 1.3 });
    addEnemy(4000, 'spiny', 3800, 4300);
    addPlatform(8130, 450, 80, false);
    checkpoints.push(1200, 2400, 3600, 4800, 6000, 7200);
  } else if (theme === 'koopa') {
    // Kuppa's Lava Keep: long lava bridges, fire walkers, spitters, and shell-crushing jumps.
    hazards.push(
      { x: 950, y: GROUND_Y - 8, w: 150, h: 90 },
      { x: 1700, y: GROUND_Y - 8, w: 150, h: 90 },
      { x: 2500, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 3400, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 4400, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 5300, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 6200, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 7100, y: GROUND_Y - 8, w: 200, h: 90 },
      { x: 8100, y: GROUND_Y - 8, w: 100, h: 90 }
    );
    coinLine(180, GROUND_Y - 46, 4);
    addPipe(500, 60);
    addEnemy(760, 'fire', 620, 940);
    addPlatform(980, 440, 70, false);
    addPlatform(1040, 400, 60, false);
    addPlatform(1250, 420, 110, false);
    addQuestion(1350, 300);
    addPlatform(1500, 350, 100, false);
    addEnemy(1450, 'spitter', 1250, 1680);
    addPlatform(1740, 430, 60, false);
    addPlatform(1800, 390, 60, false);

    addPipe(2200, 70);
    addEnemy(2250, 'spitter', 2050, 2480);
    addPlatform(2250, 410, 100, false);
    addPlatform(2400, 340, 90, false);
    addEnemy(2350, 'spiny', 2100, 2480);
    addPlatform(2550, 440, 70, false);
    addPlatform(2620, 400, 70, false);

    addPipe(3100, 80);
    addEnemy(3200, 'koopa', 3000, 3380);
    addPlatform(3000, 430, 100, false);
    addPlatform(3200, 360, 100, false);
    addQuestion(3300, 280);
    addPlatform(3450, 430, 60, false);
    addPlatform(3520, 390, 60, false);

    addEnemy(3800, 'fire', 3620, 3980);
    addPlatform(3750, 420, 100, false);
    addPlatform(3950, 350, 100, false);
    addEnemy(4100, 'ghost', 3600, 4380, { baseY: 280, ampX: 100, ampY: 32, moveSpeed: 1.2 });
    addQuestion(4050, 300);
    addPlatform(4450, 440, 70, false);
    addPlatform(4520, 400, 70, false);

    addEnemy(4800, 'spitter', 4620, 4980);
    addPlatform(4700, 410, 100, false);
    addPlatform(4950, 340, 90, false);
    addPipe(4900, 60);
    addEnemy(5100, 'fire', 4880, 5280);
    addPlatform(5350, 430, 60, false);
    addPlatform(5420, 390, 60, false);

    addEnemy(5650, 'koopa', 5450, 5980);
    addPlatform(5600, 430, 100, false);
    addPlatform(5850, 360, 100, false);
    addQuestion(5750, 300);
    addEnemy(5950, 'spitter', 5700, 6190);
    addPlatform(6250, 440, 70, false);
    addPlatform(6320, 400, 70, false);

    addPipe(6700, 70);
    addEnemy(6600, 'ghost', 6350, 7080, { baseY: 270, ampX: 100, ampY: 34, moveSpeed: 1.25 });
    addPlatform(6500, 410, 100, false);
    addPlatform(6750, 340, 90, false);
    addEnemy(6900, 'spitter', 6650, 7080);
    addQuestion(6650, 300);
    addPlatform(7150, 430, 60, false);
    addPlatform(7220, 390, 60, false);

    addPipe(7700, 80);
    addEnemy(7500, 'koopa', 7320, 7680);
    addPlatform(7400, 420, 100, false);
    addPlatform(7650, 350, 100, false);
    addEnemy(7850, 'spitter', 7700, 8080);
    addEnemy(7900, 'spiny', 7750, 8080);
    addPlatform(8140, 460, 60, false);
  } else if (theme === 'water') {
    // Sunken Ruins: buoyant swimming physics, ruined pillars, fish, and jellyfish.
    coinLine(180, GROUND_Y - 46, 5);
    addPipe(800, 70);
    addPlatform(500, 400, 120, false);
    addPlatform(700, 320, 100, false);
    addPlatform(1000, 260, 90, false);
    addQuestion(900, 240);
    addEnemy(750, 'fish', 550, 1050, { baseY: 330, ampX: 90, ampY: 26, moveSpeed: 1.3 });
    addEnemy(1150, 'jelly', 1050, 1220, { baseY: 260, ampX: 30, ampY: 38, moveSpeed: 0.9 });
    addPlatform(1140, 430, 60, false);

    addPlatform(1400, 380, 120, false);
    addPlatform(1600, 300, 100, false);
    addQuestion(1550, 260);
    addEnemy(1500, 'fish', 1280, 1850, { baseY: 300, ampX: 110, ampY: 30, moveSpeed: 1.4 });
    addEnemy(1800, 'spiny', 1300, 2080);
    addPlatform(2150, 420, 60, false);
    addPlatform(2220, 380, 60, false);

    addPipe(1900, 60);
    addPlatform(2400, 400, 110, false);
    addPlatform(2600, 320, 100, false);
    addPlatform(2900, 260, 90, false);
    addQuestion(2700, 280);
    addEnemy(2500, 'jelly', 2300, 2780, { baseY: 280, ampX: 40, ampY: 42, moveSpeed: 0.95 });
    addEnemy(2850, 'fish', 2600, 3080, { baseY: 330, ampX: 100, ampY: 28, moveSpeed: 1.3 });
    addPlatform(3150, 430, 60, false);
    addPlatform(3220, 390, 60, false);

    addPipe(2900, 80);
    addPlatform(3400, 380, 120, false);
    addPlatform(3650, 300, 100, false);
    addQuestion(3550, 260);
    addEnemy(3300, 'spiny', 3120, 3380);
    addEnemy(3550, 'fish', 3300, 3880, { baseY: 300, ampX: 110, ampY: 32, moveSpeed: 1.45 });
    addEnemy(3850, 'jelly', 3650, 4080, { baseY: 250, ampX: 35, ampY: 40, moveSpeed: 1.0 });
    addPlatform(4150, 420, 60, false);
    addPlatform(4220, 380, 60, false);

    addPipe(3900, 70);
    addPlatform(4400, 400, 110, false);
    addPlatform(4600, 320, 100, false);
    addPlatform(4900, 260, 90, false);
    addQuestion(4700, 280);
    addEnemy(4500, 'fish', 4250, 4780, { baseY: 330, ampX: 100, ampY: 28, moveSpeed: 1.35 });
    addEnemy(4850, 'spiny', 4300, 5080);
    addPlatform(5150, 430, 60, false);
    addPlatform(5220, 390, 60, false);

    addPipe(4900, 80);
    addPlatform(5400, 380, 120, false);
    addPlatform(5650, 300, 100, false);
    addQuestion(5500, 260);
    addEnemy(5550, 'jelly', 5320, 5880, { baseY: 270, ampX: 35, ampY: 44, moveSpeed: 1.0 });
    addEnemy(5800, 'fish', 5520, 6080, { baseY: 300, ampX: 110, ampY: 30, moveSpeed: 1.4 });
    addPlatform(6150, 420, 60, false);
    addPlatform(6220, 380, 60, false);

    addPipe(5900, 60);
    addPlatform(6400, 400, 110, false);
    addPlatform(6600, 320, 100, false);
    addPlatform(6900, 260, 90, false);
    addQuestion(6750, 280);
    addEnemy(6600, 'spiny', 6320, 6980);
    addEnemy(6800, 'fish', 6500, 7080, { baseY: 330, ampX: 100, ampY: 28, moveSpeed: 1.35 });
    addPlatform(7150, 430, 60, false);
    addPlatform(7220, 390, 60, false);

    addPipe(6900, 80);
    addPlatform(7400, 380, 120, false);
    addPlatform(7650, 300, 100, false);
    addPlatform(7900, 240, 90, false);
    addQuestion(7750, 260);
    addEnemy(7500, 'jelly', 7320, 7880, { baseY: 260, ampX: 35, ampY: 42, moveSpeed: 1.05 });
    addEnemy(7950, 'fish', 7700, 8080, { baseY: 300, ampX: 80, ampY: 26, moveSpeed: 1.4 });
    addEnemy(7600, 'spiny', 7350, 8080);
    addPlatform(8140, 450, 60, false);
  }
  checkpoints.sort((a, b) => a - b);

  // --- Boss chamber: a final arena with evasion platforms, then the gate.
  addPlatform(8310, 402, 84, false);
  addPlatform(8470, 352, 84, false);
  addPlatform(8690, 402, 84, false);
  addCoin(8400, 330);
  addCoin(8520, 300);
  addCoin(8650, 330);

  // Each scenario is a standalone, single-theme level.
  const visualTheme = theme === 'pac' || theme === 'koopa' ? 'castle' : theme === 'water' ? 'sky' : theme;
  const zones = [{
    id: visualTheme,
    name: LEVEL_NAMES[theme],
    start: 0,
    end: LEVEL_WIDTH,
    startX: 60,
  }];

  return {
    platforms, enemies, coins, pipes, questionBlocks, checkpoints, zones,
    hazards,
    icePatches,
    physics: LEVEL_PHYSICS[theme] || DEFAULT_PHYSICS,
    width: LEVEL_WIDTH,
    finishX: FINISH_X,
    groundTop: GROUND_Y,
    levelId: theme,
    name: LEVEL_NAMES[theme],
    boss: createBossState(theme),
    arena: {
      start: BOSS_ARENA_START,
      trigger: BOSS_TRIGGER_X,
      gateX: BOSS_GATE_X,
      end: LEVEL_WIDTH,
    },
  };
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
    points: 0,
    lives: 3,
    starTicks: 0,
    invulnTicks: 0,
    gameOver: false,
    dying: false,
    deathTimer: 0,
    justDied: false,
    coinCollected: false,
    jumps: 0,
    jumped: false,
    walkFrame: 0,
    walkTimer: 0,
    prevJumpDown: false,
    coyoteTicks: 0,
    jumpBufferTicks: 0,
    jumpCutAvailable: false,
    checkpointX: 70,
    finished: false,
    finishTime: null,
    bossBonus: 0,
    timeBonus: 0,
    bossDefeated: false,
    bossLocked: false,
    moveDir: 0,
    controlVx: 0,
    prevBottom: GROUND_Y,
    preStepVy: 0,
    prevTop: GROUND_Y - PLAYER_H,
  };
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function getSurfaceGrip(player, level) {
  const cfg = level.physics || DEFAULT_PHYSICS;
  if (!player.onGround) return cfg.airGrip ?? DEFAULT_PHYSICS.airGrip;
  const centerX = player.x + PLAYER_W / 2;
  const feet = player.y + PLAYER_H;
  const onIce = (level.icePatches || []).some(
    (patch) =>
      centerX >= patch.x &&
      centerX <= patch.x + patch.w &&
      feet >= patch.y - 10 &&
      feet <= patch.y + 30
  );
  return onIce ? (cfg.iceGrip ?? DEFAULT_PHYSICS.iceGrip) : (cfg.grip ?? DEFAULT_PHYSICS.grip);
}

function createPhysics(level) {
  const engine = Engine.create();
  engine.gravity.x = 0;
  engine.gravity.y = 0;
  engine.positionIterations = 8;
  engine.velocityIterations = 8;
  engine.enableSleeping = false;

  const solids = [];
  const addSolid = (x, y, w, h) => {
    const body = Bodies.rectangle(x + w / 2, y + h / 2, w, h, {
      isStatic: true,
      friction: 0,
      frictionStatic: 0,
      restitution: 0,
    });
    World.add(engine.world, body);
    solids.push(body);
    return body;
  };

  for (const plat of level.platforms) addSolid(plat.x, plat.y, plat.w, plat.h);
  for (const pipe of level.pipes) addSolid(pipe.x, pipe.y, pipe.w, pipe.h);
  for (const qb of level.questionBlocks) addSolid(qb.x, qb.y, qb.w, qb.h);

  const physics = { engine, solids, playerBodies: new Map(), bossGateBody: null };
  if (level.boss) {
    physics.bossGateBody = addSolid(
      level.boss.gateX ?? BOSS_GATE_X,
      GROUND_Y - BOSS_GATE_H,
      BOSS_GATE_W,
      BOSS_GATE_H
    );
  }

  return physics;
}

function addBossGateBody(physics, level) {
  if (!level.boss || physics.bossGateBody) return;
  const gateX = level.boss.gateX ?? BOSS_GATE_X;
  const body = Bodies.rectangle(
    gateX + BOSS_GATE_W / 2,
    GROUND_Y - BOSS_GATE_H / 2,
    BOSS_GATE_W,
    BOSS_GATE_H,
    { isStatic: true, friction: 0, frictionStatic: 0, restitution: 0 }
  );
  World.add(physics.engine.world, body);
  physics.solids.push(body);
  physics.bossGateBody = body;
}

function openBossGate(state) {
  const body = state.physics.bossGateBody;
  if (!body) return;
  World.remove(state.physics.engine.world, body);
  const index = state.physics.solids.indexOf(body);
  if (index >= 0) state.physics.solids.splice(index, 1);
  state.physics.bossGateBody = null;
  if (state.level.boss) state.level.boss.gateOpen = true;
}

function attachPlayerBody(physics, player) {
  const body = Bodies.rectangle(
    player.x + PLAYER_W / 2,
    player.y + PLAYER_H / 2,
    PLAYER_W,
    PLAYER_H,
    {
      friction: 0,
      frictionStatic: 0,
      frictionAir: 0,
      restitution: 0,
      // Players don't collide with each other; only with the static level.
      collisionFilter: { group: -1 },
    }
  );
  Body.setInertia(body, Infinity);
  World.add(physics.engine.world, body);
  physics.playerBodies.set(player.id, body);
}

function isGrounded(body, solids) {
  const bottom = body.position.y + PLAYER_H / 2;
  for (const dx of [-10, 0, 10]) {
    const hits = Query.ray(
      solids,
      { x: body.position.x + dx, y: bottom - 2 },
      { x: body.position.x + dx, y: bottom + 8 },
      1
    );
    if (hits.length > 0) return true;
  }
  return false;
}

function respawnPlayer(state, player) {
  const body = state.physics.playerBodies.get(player.id);
  const x = player.checkpointX + PLAYER_W / 2;
  const y = GROUND_Y - PLAYER_H / 2;
  if (body) {
    Body.setPosition(body, { x, y });
    Body.setVelocity(body, { x: 0, y: 0 });
  }
  player.x = player.checkpointX;
  player.y = GROUND_Y - PLAYER_H;
  player.vx = 0;
  player.vy = 0;
  player.alive = true;
  player.dying = false;
  player.deathTimer = 0;
  player.onGround = false;
  player.jumps = 0;
  player.jumped = false;
  player.coyoteTicks = 0;
  player.jumpBufferTicks = 0;
  player.jumpCutAvailable = false;
  player.moveDir = 0;
  player.controlVx = 0;
  player.invulnTicks = RESPAWN_INVULN_TICKS;
  player.prevBottom = player.y + PLAYER_H;
}

function killPlayer(player, physics) {
  if (player.dying) return;
  player.alive = false;
  player.dying = true;
  player.deathTimer = DEATH_MS;
  player.lives = Math.max(0, (player.lives || 0) - 1);
  if (player.lives <= 0) player.gameOver = true;
  player.starTicks = 0;
  player.vx = 0;
  player.vy = 0;
  player.moveDir = 0;
  player.justDied = true;
  const body = physics?.playerBodies?.get(player.id);
  if (body) Body.setVelocity(body, { x: 0, y: 0 });
}

let questionRewardEnemyCounter = 0;

function hitQuestionBlock(state, player, block) {
  block.hit = true;
  player.points = (player.points || 0) + 100;
  const reward = block.reward || 'coins';

  if (reward === 'coins') {
    player.coins += 4;
    player.points += 40;
  } else if (reward === 'life') {
    player.lives = Math.min(9, (player.lives || 0) + 1);
    player.points += 50;
  } else if (reward === 'star') {
    player.starTicks = 240;
    player.points += 200;
  } else if (reward === 'enemy') {
    const spec = ENEMY_TYPES.flyer;
    questionRewardEnemyCounter++;
    state.level.enemies.push({
      id: `reward-flyer-${questionRewardEnemyCounter}`,
      type: 'flyer',
      x: block.x + block.w / 2 - spec.w / 2,
      y: block.y - spec.h - 10,
      spawnX: block.x + block.w / 2 - spec.w / 2,
      spawnY: block.y - spec.h - 10,
      baseX: block.x + block.w / 2,
      baseY: block.y - spec.h - 10,
      w: spec.w,
      h: spec.h,
      speed: spec.speed,
      vx: 0,
      initialVx: 0,
      alive: true,
      patrolMin: block.x,
      patrolMax: block.x + block.w,
      phase: 0,
      hopPhase: 0,
      hopHeight: 0,
      ampX: 55,
      ampY: 20,
      moveSpeed: 1.5,
    });
  }
}

function spawnBossProjectile(boss, options) {
  boss.projectileCounter = (boss.projectileCounter || 0) + 1;
  boss.projectiles.push({
    id: `${boss.id}-shot-${boss.projectileCounter}`,
    type: options.type || boss.projectile,
    x: options.x,
    y: options.y,
    w: options.w || 24,
    h: options.h || 24,
    vx: options.vx || 0,
    vy: options.vy || 0,
    gravity: options.gravity || 0,
    life: options.life ?? 2800,
    delay: options.delay || 0,
  });
}

function spawnArenaMinion(state, type, x) {
  const boss = state.level.boss;
  if (!boss) return;
  const spec = ENEMY_TYPES[type] || ENEMY_TYPES.goomba;
  const minX = boss.arenaMin;
  const maxX = boss.arenaMax + boss.w;
  const spawnX = Math.max(minX, Math.min(maxX - spec.w, x));
  const aerial = ['flyer', 'gust', 'ghost', 'blinky', 'pinky', 'inky', 'clyde', 'fish', 'jelly'].includes(type);
  const spawnY = aerial ? 300 : GROUND_Y - spec.h;
  state.bossMinionCounter = (state.bossMinionCounter || 0) + 1;
  state.level.enemies.push({
    id: `boss-minion-${state.bossMinionCounter}`,
    type,
    x: spawnX,
    y: spawnY,
    spawnX,
    spawnY,
    baseX: spawnX,
    baseY: spawnY,
    w: spec.w,
    h: spec.h,
    speed: spec.speed,
    vx: (state.players.length % 2 === 0 ? 1 : -1) * spec.speed * 1.15,
    initialVx: (state.players.length % 2 === 0 ? 1 : -1) * spec.speed * 1.15,
    alive: true,
    patrolMin: minX,
    patrolMax: maxX,
    phase: 0,
    hopPhase: 0,
    hopHeight: 46,
    ampX: 40,
    ampY: 16,
    moveSpeed: 1.4,
    summoned: true,
  });
}

function bossShockwaves(state, boss, directions = [-1, 1]) {
  for (const dir of directions) {
    spawnBossProjectile(boss, {
      type: 'shockwave',
      x: boss.x + (dir > 0 ? boss.w - 24 : 4),
      y: GROUND_Y - 26,
      w: 44,
      h: 26,
      vx: dir * (3.1 + boss.phase * 0.35),
      vy: 0,
      life: 2600,
    });
  }
}

function bossAttack(state, boss, target) {
  const phase = boss.phase;
  const cx = boss.x + boss.w / 2;
  const cy = boss.y + boss.h / 2;
  const targetX = target ? target.x + PLAYER_W / 2 : cx - 120;
  const targetY = target ? target.y + PLAYER_H / 2 : cy;
  const baseAngle = Math.atan2(targetY - cy, targetX - cx);

  if (boss.theme === 'grass') {
    // Princess Peach: parasol-powered turnip volleys, royal stomps, and Toad backup.
    const count = phase === 1 ? 2 : phase === 2 ? 3 : 5;
    const speed = 2.6 + phase * 0.2;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (i - (count - 1) / 2) * 0.14;
      spawnBossProjectile(boss, {
        type: 'turnip',
        x: cx - 11,
        y: cy - 11,
        w: 22,
        h: 22,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.4,
        gravity: 0.075,
        life: 2800,
      });
    }
    if (phase >= 2) {
      spawnArenaMinion(state, 'toad', boss.x + (boss.dir > 0 ? boss.w + 30 : -55));
      boss.taunt = 'TOAD, DEAL WITH THEM!';
      boss.tauntTicks = 1500;
    }
    if (phase >= 3) bossShockwaves(state, boss, [-1, 1]);
  } else if (boss.theme === 'cave') {
    // Crystal Serpent: a widening fan of prism shards.
    const count = phase === 1 ? 3 : phase === 2 ? 5 : 7;
    const speed = 3.2 + phase * 0.25;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (i - (count - 1) / 2) * 0.17;
      spawnBossProjectile(boss, {
        type: 'crystal',
        x: cx - 9,
        y: cy - 9,
        w: 18,
        h: 18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 2400,
      });
    }
    if (phase >= 3) {
      for (const dx of [-140, 0, 140]) {
        spawnBossProjectile(boss, {
          type: 'crystal',
          x: Math.max(BOSS_ARENA_START + 40, targetX + dx - 9),
          y: 30,
          w: 18,
          h: 18,
          vx: 0,
          vy: 4.4,
          life: 2200,
        });
      }
    }
  } else if (boss.theme === 'sky') {
    // Storm Djinn: vertical lightning columns from the top of the screen.
    const offsets = phase === 1 ? [-80, 20, 120] : phase === 2 ? [-170, -60, 60, 170] : [-210, -120, -30, 60, 150, 240];
    for (const dx of offsets) {
      spawnBossProjectile(boss, {
        type: 'bolt',
        x: Math.max(BOSS_ARENA_START + 20, Math.min(levelSafeMax(), targetX + dx - 10)),
        y: 30,
        w: 20,
        h: 34,
        vx: 0,
        vy: 4.2 + phase * 0.35,
        life: 2200,
      });
    }
  } else if (boss.theme === 'pac') {
    // The Glutton: pellet bursts and summoned maze ghosts.
    boss.attackCount = (boss.attackCount || 0) + 1;
    const count = phase === 1 ? 4 : phase === 2 ? 6 : 8;
    const spin = (boss.attackCount % 2 ? 1 : -1) * 0.2;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + spin + (i - (count - 1) / 2) * 0.22;
      spawnBossProjectile(boss, {
        type: 'pellet',
        x: cx - 8,
        y: cy - 8,
        w: 16,
        h: 16,
        vx: Math.cos(angle) * (2.9 + phase * 0.3),
        vy: Math.sin(angle) * (2.9 + phase * 0.3),
        life: 2400,
      });
    }
    if (phase >= 2 && boss.attackCount % 2 === 0) {
      const ghosts = ['blinky', 'pinky', 'inky', 'clyde'];
      spawnArenaMinion(state, ghosts[boss.attackCount % ghosts.length], cx - 120);
    }
  } else if (boss.theme === 'koopa') {
    // Kuppa: fire breath, a shell-spin shockwave, and summoned Koopa guards.
    boss.attackCount = (boss.attackCount || 0) + 1;
    const count = phase === 1 ? 3 : phase === 2 ? 5 : 7;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (i - (count - 1) / 2) * 0.13;
      spawnBossProjectile(boss, {
        type: 'fire',
        x: cx - 10,
        y: cy - 10,
        w: 20,
        h: 20,
        vx: Math.cos(angle) * (3.1 + phase * 0.22),
        vy: Math.sin(angle) * (3.1 + phase * 0.22),
        life: 2400,
      });
    }
    if (phase >= 2 && boss.attackCount % 2 === 0) {
      spawnArenaMinion(state, 'koopa', boss.x + (boss.dir > 0 ? boss.w + 30 : -60));
    }
    if (phase >= 3) {
      for (const dx of [-160, 0, 160]) {
        spawnBossProjectile(boss, {
          type: 'fire',
          x: Math.max(BOSS_ARENA_START + 30, Math.min(levelSafeMax(), targetX + dx - 10)),
          y: 30,
          w: 20,
          h: 20,
          vx: 0,
          vy: 4.2,
          life: 2200,
        });
      }
    }
  } else if (boss.theme === 'water') {
    // Kraken: ink spreads, a tentacle sweep, and ink rain.
    const count = phase === 1 ? 3 : phase === 2 ? 5 : 7;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (i - (count - 1) / 2) * 0.18;
      spawnBossProjectile(boss, {
        type: 'ink',
        x: cx - 10,
        y: cy - 10,
        w: 20,
        h: 20,
        vx: Math.cos(angle) * (2.7 + phase * 0.22),
        vy: Math.sin(angle) * (2.7 + phase * 0.22),
        life: 2800,
      });
    }
    if (phase >= 2) {
      bossShockwaves(state, boss, [-1, 1]);
      if (phase >= 2 && (boss.attackCount || 0) % 3 === 0) {
        spawnArenaMinion(state, 'jelly', cx + 100);
      }
    }
    boss.attackCount = (boss.attackCount || 0) + 1;
    if (phase >= 3) {
      for (const dx of [-170, 0, 170]) {
        spawnBossProjectile(boss, {
          type: 'ink',
          x: Math.max(BOSS_ARENA_START + 30, Math.min(levelSafeMax(), targetX + dx - 10)),
          y: 30,
          w: 20,
          h: 20,
          vx: 0,
          vy: 3.9,
          life: 2500,
        });
      }
    }
  } else {
    // Kai: rapid ki blasts, a telegraphed Celestial Wave, and a phase-3 spirit orb.
    boss.attackCount = (boss.attackCount || 0) + 1;
    const count = phase === 1 ? 3 : phase === 2 ? 4 : 6;
    const speed = 3.4 + phase * 0.22;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (i - (count - 1) / 2) * 0.13;
      spawnBossProjectile(boss, {
        type: 'ki',
        x: cx - 10,
        y: cy - 10,
        w: 20,
        h: 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 2400,
      });
    }
    if (phase >= 2 && boss.attackCount % 2 === 0) {
      const dir = targetX < cx ? -1 : 1;
      const beamWidth = BOSS_GATE_X - BOSS_ARENA_START - 50;
      spawnBossProjectile(boss, {
        type: 'beam',
        x: dir > 0 ? cx : cx - beamWidth,
        y: GROUND_Y - 58,
        w: beamWidth,
        h: 58,
        vx: 0,
        vy: 0,
        life: 620,
        delay: 820,
      });
      boss.taunt = 'HAAA!';
      boss.tauntTicks = 900;
    }
    if (phase >= 3 && boss.attackCount % 3 === 0) {
      spawnBossProjectile(boss, {
        type: 'spirit',
        x: Math.max(BOSS_ARENA_START + 60, Math.min(levelSafeMax() - 60, targetX - 30)),
        y: 26,
        w: 60,
        h: 60,
        vx: 0,
        vy: 1.8,
        life: 7000,
      });
    }
  }
}

function levelSafeMax() {
  return BOSS_GATE_X - 40;
}

function moveBoss(state, boss, dt, target) {
  const phaseSpeed = 1 + (boss.phase - 1) * 0.22;
  const step = dt / 50;

  if (boss.movement === 'leaper') {
    if (boss.jumpPhase > 0) {
      boss.jumpPhase -= dt;
      boss.x += boss.jumpDir * boss.speed * phaseSpeed * 1.65 * step;
      const progress = Math.min(1, 1 - Math.max(0, boss.jumpPhase) / boss.jumpDuration);
      boss.y = boss.baseY - Math.sin(progress * Math.PI) * boss.jumpHeight;
      if (boss.jumpPhase <= 0) {
        boss.jumpPhase = 0;
        boss.y = boss.baseY;
        bossShockwaves(state, boss, [-1, 1]);
      }
    } else {
      boss.x += boss.dir * boss.speed * phaseSpeed * 0.62 * step;
      boss.y = boss.baseY + Math.sin(state.elapsedMs / 260) * 2;
      boss.jumpTimer -= dt;
      if (boss.jumpTimer <= 0) {
        boss.jumpTimer = Math.max(1250, boss.jumpEvery - (boss.phase - 1) * 350);
        boss.jumpPhase = boss.jumpDuration;
        boss.jumpDir = target ? (Math.sign(target.x - boss.x) || boss.dir) : boss.dir;
        boss.dir = boss.jumpDir;
      }
    }
  } else if (boss.movement === 'peach') {
    // Peach: parasol glide, then a royal stomp that rattles the whole arena.
    boss.x += boss.dir * boss.speed * 0.7 * phaseSpeed * step;
    const t = state.elapsedMs / 1000;
    boss.y = boss.baseY + Math.sin(t * 2.2) * 18;
    if (boss.stompPhase > 0) {
      boss.stompPhase -= dt;
      const progress = 1 - Math.max(0, boss.stompPhase) / boss.stompDuration;
      const landingY = GROUND_Y - boss.h;
      boss.y = boss.baseY + Math.sin(progress * Math.PI) * (landingY - boss.baseY);
      if (boss.stompPhase <= 0) {
        boss.stompPhase = 0;
        boss.y = boss.baseY;
        bossShockwaves(state, boss, [-1, 1]);
      }
    } else {
      boss.stompTimer -= dt;
      if (boss.stompTimer <= 0) {
        boss.stompTimer = Math.max(1500, 2800 - boss.phase * 350);
        boss.stompPhase = boss.stompDuration;
      }
    }
  } else if (boss.movement === 'serpentine') {
    boss.x += boss.dir * boss.speed * phaseSpeed * step;
    const t = state.elapsedMs / 1000;
    boss.y = boss.baseY + Math.sin(t * 2.1) * 48 + Math.sin(t * 5.3) * 14;
    boss.diveTimer -= dt;
    if (boss.diveTimer <= 0) {
      boss.diveTimer = 3400 - boss.phase * 420;
      boss.divePhase = 1000;
    }
    if (boss.divePhase > 0) {
      boss.divePhase -= dt;
      const progress = 1 - Math.max(0, boss.divePhase) / 1000;
      boss.y += Math.sin(progress * Math.PI) * 92;
    }
  } else if (boss.movement === 'blink') {
    boss.y = boss.baseY + Math.sin(state.elapsedMs / 240) * 16;
    if (boss.blinkTelegraph) {
      boss.blinkPhase -= dt;
      if (boss.blinkPhase <= 0) {
        const oldX = boss.x;
        boss.x = boss.blinkTargetX;
        boss.blinkTelegraph = false;
        boss.teleported = true;
        spawnBossProjectile(boss, {
          type: 'bolt',
          x: oldX + boss.w / 2 - 10,
          y: boss.y + boss.h / 2,
          w: 20,
          h: 34,
          vx: 0,
          vy: 0.5,
          life: 700,
        });
      }
    } else {
      boss.x += boss.dir * boss.speed * 0.52 * phaseSpeed * step;
      boss.teleportTimer -= dt;
      if (boss.teleportTimer <= 0) {
        const oldX = boss.x;
        const span = boss.arenaMax - boss.arenaMin;
        let nextX = boss.arenaMin + Math.random() * Math.max(1, span);
        if (Math.abs(nextX - oldX) < 110) {
          nextX = oldX < boss.arenaMin + span / 2 ? boss.arenaMax : boss.arenaMin;
        }
        boss.blinkTargetX = Math.max(boss.arenaMin, Math.min(boss.arenaMax, nextX));
        boss.blinkTargetY = boss.baseY + boss.h / 2;
        boss.blinkPhase = 560;
        boss.blinkTelegraph = true;
        boss.teleportTimer = Math.max(1400, 2600 - boss.phase * 330) + 420;
        boss.taunt = 'Watch the star!';
        boss.tauntTicks = 780;
      }
    }
  } else if (boss.movement === 'kai') {
    // Kai: hover, aerial dash, and instant transmission.
    const t = state.elapsedMs / 1000;
    boss.y = boss.baseY + Math.sin(t * 1.9) * 20 + Math.sin(t * 4.4) * 6;
    if (boss.dashing) {
      boss.dashPhase -= dt;
      boss.x += boss.dashDir * boss.speed * 3.1 * phaseSpeed * step;
      boss.y = boss.baseY + 6;
      if (boss.dashPhase <= 0) {
        boss.dashing = false;
        boss.dashTimer = Math.max(1400, 2600 - boss.phase * 300);
      }
    } else {
      boss.x += boss.dir * boss.speed * 0.45 * phaseSpeed * step;
      boss.dashTimer -= dt;
      if (boss.dashTimer <= 0) {
        boss.dashing = true;
        boss.dashPhase = 420;
        boss.dashDir = target ? (Math.sign(target.x - boss.x) || boss.dir) : boss.dir;
        boss.dir = boss.dashDir;
      }
    }
    boss.teleportTimer -= dt;
    if (boss.teleportTimer <= 0) {
      boss.teleportTimer = Math.max(1500, 2700 - boss.phase * 350);
      let nextX;
      if (target) {
        const side = target.facing > 0 ? -1 : 1;
        nextX = target.x + side * 180;
      } else {
        nextX = boss.arenaMin + Math.random() * Math.max(1, boss.arenaMax - boss.arenaMin);
      }
      boss.x = Math.max(boss.arenaMin, Math.min(boss.arenaMax, nextX));
      boss.teleported = true;
      boss.taunt = 'Too slow!';
      boss.tauntTicks = 800;
    }
  } else if (boss.movement === 'charger') {
    if (boss.charging) {
      boss.chargePhase -= dt;
      boss.x += boss.chargeDir * boss.speed * 3.25 * phaseSpeed * step;
      boss.y = boss.baseY + Math.sin(state.elapsedMs / 90) * 1.5;
      if (boss.chargePhase <= 0) {
        boss.charging = false;
        boss.chargeTimer = Math.max(1300, 2300 - boss.phase * 300);
        boss.dir = -boss.chargeDir;
      }
    } else {
      boss.x += boss.dir * boss.speed * 0.58 * phaseSpeed * step;
      boss.y = boss.baseY + Math.sin(state.elapsedMs / 300) * 2;
      boss.chargeTimer -= dt;
      if (boss.chargeTimer <= 0) {
        boss.charging = true;
        boss.chargePhase = 720;
        boss.chargeDir = target ? (Math.sign(target.x - boss.x) || boss.dir) : boss.dir;
        boss.dir = boss.chargeDir;
        boss.taunt = 'TOASTY!';
        boss.tauntTicks = 900;
      }
    }
  } else if (boss.movement === 'chomper') {
    if (boss.charging) {
      boss.chargePhase -= dt;
      boss.x += boss.chargeDir * boss.speed * 3.35 * phaseSpeed * step;
      boss.y = boss.baseY + Math.sin(state.elapsedMs / 70) * 2;
      if (boss.chargePhase <= 0) {
        boss.charging = false;
        boss.chargeTimer = Math.max(1300, 2300 - boss.phase * 280);
        boss.dir = -boss.chargeDir;
      }
    } else {
      boss.dir = target ? (Math.sign(target.x - boss.x) || boss.dir) : boss.dir;
      boss.x += boss.dir * boss.speed * 0.62 * phaseSpeed * step;
      boss.y = boss.baseY + Math.sin(state.elapsedMs / 220) * 3;
      boss.chargeTimer -= dt;
      if (boss.chargeTimer <= 0) {
        boss.charging = true;
        boss.chargePhase = 560;
        boss.chargeDir = boss.dir;
        boss.taunt = 'CHOMP!';
        boss.tauntTicks = 700;
      }
    }
  } else if (boss.movement === 'kuppa') {
    if (boss.jumpPhase > 0) {
      boss.jumpPhase -= dt;
      boss.x += boss.jumpDir * boss.speed * phaseSpeed * 1.15 * step;
      const progress = Math.min(1, 1 - Math.max(0, boss.jumpPhase) / boss.jumpDuration);
      boss.y = boss.baseY - Math.sin(progress * Math.PI) * boss.jumpHeight;
      if (boss.jumpPhase <= 0) {
        boss.jumpPhase = 0;
        boss.y = boss.baseY;
        bossShockwaves(state, boss, [-1, 1]);
      }
    } else if (boss.charging) {
      boss.chargePhase -= dt;
      boss.x += boss.chargeDir * boss.speed * 3.1 * phaseSpeed * step;
      boss.y = boss.baseY + Math.sin(state.elapsedMs / 80) * 2;
      if (boss.chargePhase <= 0) {
        boss.charging = false;
        boss.chargeTimer = Math.max(1400, 2500 - boss.phase * 280);
        boss.dir = -boss.chargeDir;
        bossShockwaves(state, boss, [boss.dir]);
      }
    } else {
      boss.x += boss.dir * boss.speed * 0.5 * phaseSpeed * step;
      boss.y = boss.baseY + Math.sin(state.elapsedMs / 280) * 2;
      boss.jumpTimer -= dt;
      boss.chargeTimer -= dt;
      if (boss.jumpTimer <= 0) {
        boss.jumpTimer = Math.max(1500, boss.jumpEvery - (boss.phase - 1) * 300);
        boss.jumpPhase = boss.jumpDuration;
        boss.jumpDir = target ? (Math.sign(target.x - boss.x) || boss.dir) : boss.dir;
        boss.dir = boss.jumpDir;
      } else if (boss.chargeTimer <= 0) {
        boss.charging = true;
        boss.chargePhase = 680;
        boss.chargeDir = target ? (Math.sign(target.x - boss.x) || boss.dir) : boss.dir;
        boss.dir = boss.chargeDir;
        boss.taunt = 'SHELL SPIN!';
        boss.tauntTicks = 800;
      }
    }
  } else if (boss.movement === 'kraken') {
    const t = state.elapsedMs / 1000;
    boss.x += boss.dir * boss.speed * 0.42 * phaseSpeed * step;
    boss.y = boss.baseY + Math.sin(t * 1.7) * 28 + Math.sin(t * 3.1) * 8;
    boss.diveTimer -= dt;
    if (boss.diveTimer <= 0) {
      boss.diveTimer = 3200 - boss.phase * 380;
      boss.divePhase = 900;
      boss.dir = target ? (Math.sign(target.x - boss.x) || boss.dir) : boss.dir;
    }
    if (boss.divePhase > 0) {
      boss.divePhase -= dt;
      const progress = 1 - Math.max(0, boss.divePhase) / 900;
      boss.y += Math.sin(progress * Math.PI) * 82;
    }
  }

  if (boss.x < boss.arenaMin) {
    boss.x = boss.arenaMin;
    boss.dir = 1;
    if (boss.charging) boss.chargeDir = 1;
    if (boss.dashing) boss.dashDir = 1;
  } else if (boss.x > boss.arenaMax) {
    boss.x = boss.arenaMax;
    boss.dir = -1;
    if (boss.charging) boss.chargeDir = -1;
    if (boss.dashing) boss.dashDir = -1;
  }
}

function updateBossProjectiles(state, boss, dt) {
  const step = dt / 50;
  for (let i = boss.projectiles.length - 1; i >= 0; i--) {
    const shot = boss.projectiles[i];
    if (shot.delay > 0) {
      shot.delay -= dt;
      continue;
    }
    shot.life -= dt;
    shot.vy += (shot.gravity || 0) * step;
    shot.x += shot.vx * step;
    shot.y += shot.vy * step;
    if (
      shot.life <= 0 ||
      shot.x + shot.w < BOSS_ARENA_START - 160 ||
      shot.x > state.level.width + 180 ||
      shot.y > CANVAS_H + 80 ||
      shot.y + shot.h < -120
    ) {
      boss.projectiles.splice(i, 1);
      continue;
    }

    let hit = false;
    for (const player of state.players) {
      if (!player.alive || player.dying || player.finished) continue;
      if (!overlaps(player, shot)) continue;
      if ((player.invulnTicks || 0) > 0) continue;
      if ((player.starTicks || 0) > 0) {
        player.points = (player.points || 0) + 25;
      } else {
        killPlayer(player, state.physics);
      }
      hit = true;
      break;
    }
    if (hit) boss.projectiles.splice(i, 1);
  }
}

function activateBoss(state, boss) {
  boss.active = true;
  boss.attackTimer = Math.min(boss.attackTimer, 1000);
  boss.jumpTimer = Math.min(boss.jumpTimer, 1400);
  boss.taunt = boss.intro;
  boss.tauntTicks = 3000;
  state.bossEngagedAt = state.elapsedMs;
}

function defeatBoss(state, boss, player) {
  boss.hp = 0;
  boss.active = false;
  boss.defeated = true;
  boss.gateOpen = true;
  boss.defeatedBy = player?.id || null;
  boss.taunt = boss.defeatTaunt;
  boss.tauntTicks = 3200;
  boss.projectiles = [];
  if (player) {
    player.points = (player.points || 0) + BOSS_DEFEAT_BONUS;
    player.bossBonus = (player.bossBonus || 0) + BOSS_DEFEAT_BONUS;
  }
  for (const p of state.players) p.bossDefeated = true;
  for (const p of state.players) p.bossLocked = false;
  state.bossDefeatedAt = state.elapsedMs;
  openBossGate(state);
}

function updateBoss(state, dt) {
  const boss = state.level.boss;
  if (!boss) return;

  if (boss.defeated) {
    boss.projectiles.length = 0;
    boss.teleported = false;
    return;
  }

  if (!boss.active) {
    const playerEntered = state.players.some(
      (p) => p.alive && !p.dying && !p.finished && p.x + PLAYER_W / 2 >= (state.level.arena?.trigger ?? BOSS_TRIGGER_X)
    );
    if (playerEntered) activateBoss(state, boss);
    boss.projectiles.length = 0;
    boss.teleported = false;
    return;
  }

  boss.hitCooldown = Math.max(0, boss.hitCooldown - dt);
  boss.hitFlash = Math.max(0, boss.hitFlash - dt);
  boss.tauntTicks = Math.max(0, boss.tauntTicks - dt);

  const ratio = boss.hp / boss.maxHp;
  const nextPhase = ratio > 0.66 ? 1 : ratio > 0.33 ? 2 : 3;
  if (nextPhase > boss.phase) {
    boss.phase = nextPhase;
    boss.taunt = boss.taunts[Math.min(boss.taunts.length - 1, nextPhase - 2)] || boss.taunt;
    boss.tauntTicks = 2300;
    boss.attackTimer = Math.min(boss.attackTimer, 650);
    if (nextPhase === 2) {
      const minionType = boss.theme === 'cave' ? 'spiny' : boss.theme === 'sky' ? 'flyer' : 'goomba';
      spawnArenaMinion(state, minionType, boss.x - 120);
    }
  }

  const targets = state.players.filter((p) => p.alive && !p.dying && !p.finished);
  let target = null;
  let bestDistance = Infinity;
  for (const p of targets) {
    const distance = Math.abs(p.x + PLAYER_W / 2 - (boss.x + boss.w / 2));
    if (distance < bestDistance) {
      bestDistance = distance;
      target = p;
    }
  }

  moveBoss(state, boss, dt, target);

  boss.attackTimer -= dt;
  if (boss.attackTimer <= 0) {
    bossAttack(state, boss, target);
    boss.attackTimer = Math.max(720, boss.attackEvery - (boss.phase - 1) * 360);
  }

  updateBossProjectiles(state, boss, dt);
  boss.teleported = false;
}

let enemyFireballCounter = 0;

function spawnEnemyFireball(state, enemy) {
  const targets = state.players.filter((p) => p.alive && !p.dying && !p.finished);
  if (!targets.length) return;
  let target = null;
  let best = Infinity;
  for (const p of targets) {
    const d = Math.abs(p.x - enemy.x);
    if (d < best) {
      best = d;
      target = p;
    }
  }
  if (!target || best > 780) return;
  const sx = enemy.x + enemy.w / 2;
  const sy = enemy.y + enemy.h * 0.42;
  const dx = target.x + PLAYER_W / 2 - sx;
  const dy = target.y + PLAYER_H / 2 - sy;
  const length = Math.hypot(dx, dy) || 1;
  const speed = 3.1;
  enemyFireballCounter++;
  state.enemyProjectiles.push({
    id: `enemy-fire-${enemyFireballCounter}`,
    type: 'enemy-fire',
    x: sx - 9,
    y: sy - 9,
    w: 18,
    h: 18,
    vx: (dx / length) * speed,
    vy: (dy / length) * speed,
    life: 3200,
  });
}

function updateEnemyProjectiles(state, dt) {
  const step = dt / 50;
  for (let i = state.enemyProjectiles.length - 1; i >= 0; i--) {
    const shot = state.enemyProjectiles[i];
    shot.life -= dt;
    shot.x += shot.vx * step;
    shot.y += shot.vy * step;
    if (
      shot.life <= 0 ||
      shot.x + shot.w < -100 ||
      shot.x > state.level.width + 100 ||
      shot.y > CANVAS_H + 80 ||
      shot.y + shot.h < -100
    ) {
      state.enemyProjectiles.splice(i, 1);
      continue;
    }
    let hit = false;
    for (const player of state.players) {
      if (!player.alive || player.dying || player.finished) continue;
      if (!overlaps(player, shot)) continue;
      if ((player.invulnTicks || 0) > 0) continue;
      if ((player.starTicks || 0) > 0) {
        player.points = (player.points || 0) + 25;
      } else {
        killPlayer(player, state.physics);
      }
      hit = true;
      break;
    }
    if (hit) state.enemyProjectiles.splice(i, 1);
  }
}

function updatePlatformer(state, inputs, dt) {
  const { players, level, physics } = state;
  const physicsCfg = level.physics || DEFAULT_PHYSICS;
  state.elapsedMs = (state.elapsedMs || 0) + dt;

  for (const enemy of level.enemies) {
    if (!enemy.alive) continue;
    if (['blinky', 'pinky', 'inky', 'clyde'].includes(enemy.type)) {
      const targets = players.filter((p) => p.alive && !p.dying && !p.finished);
      let target = null;
      let bestDistance = Infinity;
      for (const p of targets) {
        const d = Math.abs(p.x - enemy.x);
        if (d < bestDistance) { bestDistance = d; target = p; }
      }
      const t = state.elapsedMs / 1000;
      let targetX = target ? target.x + PLAYER_W / 2 : enemy.baseX;
      if (enemy.type === 'pinky' && target) targetX += (target.facing || 1) * 140;
      if (enemy.type === 'inky') targetX += Math.sin(t * 1.7 + enemy.baseX * 0.01) * 220;
      if (enemy.type === 'clyde' && target && bestDistance < 240) targetX = enemy.baseX;
      const dx = targetX - (enemy.x + enemy.w / 2);
      const step = dt / 50;
      const move = Math.min(Math.abs(dx), enemy.speed * step);
      enemy.x += Math.sign(dx) * move;
      const targetY = (target ? target.y + PLAYER_H / 2 : enemy.baseY) + Math.sin(t * 2.4 + enemy.phase) * 18;
      const dy = targetY - (enemy.y + enemy.h / 2);
      enemy.y += Math.sign(dy) * Math.min(Math.abs(dy), enemy.speed * 0.45 * step);
      enemy.x = Math.max(30, Math.min(level.width - enemy.w - 30, enemy.x));
      enemy.y = Math.max(70, Math.min(CANVAS_H - enemy.h - 70, enemy.y));
      continue;
    }
    if (enemy.type === 'flyer' || enemy.type === 'gust' || enemy.type === 'ghost' || enemy.type === 'fish' || enemy.type === 'jelly') {
      enemy.phase += dt;
      const t = enemy.phase / 1000;
      enemy.x = enemy.baseX + Math.sin(t * enemy.moveSpeed) * enemy.ampX;
      enemy.y = enemy.baseY + Math.sin(t * enemy.moveSpeed * 1.4 + 1) * enemy.ampY;
      continue;
    }

    enemy.x += enemy.vx;
    if (enemy.x <= enemy.patrolMin) {
      enemy.x = enemy.patrolMin;
      enemy.vx = Math.abs(enemy.vx);
    } else if (enemy.x + enemy.w >= enemy.patrolMax) {
      enemy.x = enemy.patrolMax - enemy.w;
      enemy.vx = -Math.abs(enemy.vx);
    }

    if (enemy.type === 'jumper') {
      enemy.hopPhase += dt;
      const cycle = 1600;
      const t = (enemy.hopPhase % cycle) / cycle;
      const hop = t < 0.55 ? Math.sin((t / 0.55) * Math.PI) * enemy.hopHeight : 0;
      enemy.y = enemy.baseY - hop;
    }

    if (enemy.type === 'spitter') {
      if (enemy.shootWindup > 0) {
        enemy.shootWindup -= dt;
        if (enemy.shootWindup <= 0) {
          spawnEnemyFireball(state, enemy);
          enemy.shootWindup = 0;
        }
      } else {
        enemy.shootTimer -= dt;
        if (enemy.shootTimer <= 0) {
          enemy.shootWindup = 360;
          enemy.shootTimer = 2100 + ((enemy.x | 0) % 3) * 220;
        }
      }
    }
  }

  updateEnemyProjectiles(state, dt);

  updateBoss(state, dt);

  // Phase 1: read input and start jumps.
  for (const player of players) {
    if (player.finished) continue;
    player.invulnTicks = Math.max(0, (player.invulnTicks || 0) - 1);

    if (!player.alive) {
      if (player.dying) {
        player.deathTimer -= dt;
        if (player.deathTimer <= 0) {
          if (player.gameOver) player.dying = false;
          else respawnPlayer(state, player);
        }
      }
      continue;
    }

    const input = inputs[player.id] || { left: false, right: false, jump: false, jumpQueued: false };
    const jumpDown = !!input.jump;
    const jumpPressed = !!input.jumpQueued;
    input.jumpQueued = false;

    let moveDir = 0;
    if (input.left && !input.right) moveDir = -1;
    else if (input.right && !input.left) moveDir = 1;
    player.moveDir = moveDir;
    if (moveDir !== 0) player.facing = moveDir;

    player.prevBottom = player.y + PLAYER_H;

    if (jumpPressed) player.jumpBufferTicks = JUMP_BUFFER_TICKS;
    else if (player.jumpBufferTicks > 0) player.jumpBufferTicks--;

    if (player.jumpBufferTicks > 0) {
      if (player.onGround || player.coyoteTicks > 0) {
        player.vy = physicsCfg.jump ?? JUMP_SUB;
        player.onGround = false;
        player.coyoteTicks = 0;
        player.jumpBufferTicks = 0;
        player.jumps = 1;
        player.jumped = true;
        player.jumpCutAvailable = true;
      } else if (player.jumps < 2) {
        player.vy = physicsCfg.doubleJump ?? DOUBLE_JUMP_SUB;
        player.jumps = 2;
        player.jumped = true;
        player.jumpBufferTicks = 0;
        player.jumpCutAvailable = true;
      }
    }

    if (!jumpDown && player.vy < 0 && player.jumpCutAvailable) {
      player.vy *= 0.55;
      player.jumpCutAvailable = false;
    }

    player.starTicks = Math.max(0, (player.starTicks || 0) - 1);
    player.preStepVy = player.vy;
    player.prevTop = player.y;
  }

  // Phase 2: Matter resolves terrain collisions and resting contacts.
  for (let step = 0; step < PHYSICS_STEPS; step++) {
    for (const player of players) {
      const body = physics.playerBodies.get(player.id);
      if (!body) continue;
      if (!player.alive || player.dying || player.finished) {
        Body.setVelocity(body, { x: 0, y: 0 });
        continue;
      }
      player.vy = Math.min(physicsCfg.maxFall ?? MAX_FALL_SUB, player.vy + (physicsCfg.gravity ?? GRAVITY_SUB));
      const speed = MOVE_SUB * ((player.starTicks || 0) > 0 ? 1.35 : 1);
      const desiredX = player.moveDir * speed;
      const grip = getSurfaceGrip(player, level);
      player.controlVx += (desiredX - player.controlVx) * grip;
      if (player.moveDir === 0 && Math.abs(player.controlVx) < 0.03) player.controlVx = 0;
      Body.setVelocity(body, {
        x: player.controlVx,
        y: player.vy,
      });
    }

    Engine.update(physics.engine, PHYSICS_DT);

    for (const player of players) {
      if (player.alive && !player.dying) {
        const body = physics.playerBodies.get(player.id);
        if (body) player.vy = body.velocity.y;
      }
    }
  }

  // Phase 3: sync and apply game rules.
  for (const player of players) {
    if (player.finished || !player.alive) continue;
    const body = physics.playerBodies.get(player.id);
    if (!body) continue;

    player.x = body.position.x - PLAYER_W / 2;
    player.y = body.position.y - PLAYER_H / 2;
    player.vx = body.velocity.x;

    if (player.x < 0) {
      player.x = 0;
      Body.setPosition(body, { x: PLAYER_W / 2, y: body.position.y });
    }
    if (player.x + PLAYER_W > level.width) {
      player.x = level.width - PLAYER_W;
      Body.setPosition(body, {
        x: level.width - PLAYER_W / 2,
        y: body.position.y,
      });
    }

    // Boss arena lock: once the fight starts, the entrance wall seals behind
    // each player who has entered, so they must see the fight through.
    const bossArena = level.arena;
    const arenaBoss = level.boss;
    if (bossArena && arenaBoss && arenaBoss.active && !arenaBoss.defeated) {
      if (player.x >= bossArena.start - 2) player.bossLocked = true;
      if (player.bossLocked && player.x < bossArena.start + 36) {
        player.x = bossArena.start + 36;
        Body.setPosition(body, { x: player.x + PLAYER_W / 2, y: body.position.y });
      }
    }

    const grounded = isGrounded(body, physics.solids);
    player.onGround = grounded;
    if (grounded) {
      player.jumps = 0;
      player.coyoteTicks = COYOTE_TICKS;
      player.jumpCutAvailable = false;
      if (player.vy > 0) {
        player.vy = 0;
        Body.setVelocity(body, { x: body.velocity.x, y: 0 });
      }
      for (const cp of level.checkpoints) {
        if (player.x >= cp - 4 && cp > player.checkpointX) player.checkpointX = cp;
      }
    } else {
      player.coyoteTicks = Math.max(0, player.coyoteTicks - 1);
    }

    if (player.y > CANVAS_H + 60) {
      killPlayer(player, physics);
      continue;
    }

    for (const hazard of level.hazards || []) {
      if ((player.invulnTicks || 0) <= 0 && overlaps(player, hazard)) {
        killPlayer(player, physics);
        break;
      }
    }
    if (player.dying) continue;

    if (Math.abs(player.vx) > 0.1 && grounded) {
      player.walkTimer += dt;
      if (player.walkTimer >= 120) {
        player.walkTimer = 0;
        player.walkFrame = (player.walkFrame + 1) % 4;
      }
    } else if (grounded) {
      player.walkFrame = 0;
      player.walkTimer = 0;
    }

    const cx = player.x + PLAYER_W / 2;
    const cy = player.y + PLAYER_H / 2;
    for (const coin of level.coins) {
      if (coin.collected) continue;
      if (Math.abs(cx - coin.x) < 22 && Math.abs(cy - coin.y) < 24) {
        coin.collected = true;
        player.coins++;
        player.points = (player.points || 0) + 10;
        player.coinCollected = true;
      }
    }

    for (const block of level.questionBlocks) {
      if (block.hit) continue;
      if (
        player.preStepVy < 0 &&
        player.x + PLAYER_W > block.x + 4 &&
        player.x < block.x + block.w - 4 &&
        Math.abs(player.y - (block.y + block.h)) <= 8
      ) {
        hitQuestionBlock(state, player, block);
      }
    }

    for (const enemy of level.enemies) {
      if (!enemy.alive || !overlaps(player, enemy)) continue;
      if ((player.starTicks || 0) > 0 && ['blinky', 'pinky', 'inky', 'clyde'].includes(enemy.type)) {
        enemy.alive = false;
        player.points = (player.points || 0) + 100;
        continue;
      }
      const canStomp = !['spiny', 'fire', 'ghost', 'blinky', 'pinky', 'inky', 'clyde', 'jelly'].includes(enemy.type);
      if (canStomp && player.vy > 0 && player.prevBottom <= enemy.y + enemy.h * 0.6) {
        enemy.alive = false;
        player.points = (player.points || 0) + 50;
        player.vy = (physicsCfg.jump ?? JUMP_SUB) * 0.55;
        player.onGround = false;
        player.jumpCutAvailable = false;
        player.jumps = Math.min(player.jumps, 1);
        Body.setVelocity(body, { x: body.velocity.x, y: player.vy });
      } else {
        if ((player.invulnTicks || 0) <= 0) {
          killPlayer(player, physics);
          break;
        }
      }
    }

    const boss = level.boss;
    if (!player.dying && boss && boss.active && !boss.defeated && overlaps(player, boss)) {
      const stomp = player.vy > 0 && player.prevBottom <= boss.y + boss.h * 0.58;
      if (stomp) {
        if (boss.hitCooldown <= 0) {
          boss.hp = Math.max(0, boss.hp - 1);
          boss.hitCooldown = 720;
          boss.hitFlash = 180;
          boss.lastHitPoints = BOSS_HIT_BONUS;
          boss.lastHitBy = player.id;
          boss.lastHitSeq = (boss.lastHitSeq || 0) + 1;
          player.points = (player.points || 0) + BOSS_HIT_BONUS;
          if (boss.hp <= 0) defeatBoss(state, boss, player);
        }
        player.vy = (physicsCfg.jump ?? JUMP_SUB) * 0.72;
        player.onGround = false;
        player.jumpCutAvailable = false;
        player.jumps = Math.min(player.jumps, 1);
        Body.setVelocity(body, { x: body.velocity.x, y: player.vy });
      } else if (player.vy >= 0 && (player.invulnTicks || 0) <= 0) {
        killPlayer(player, physics);
        break;
      }
    }

    if (!player.dying && (!boss || boss.defeated) && player.x + PLAYER_W >= level.finishX) {
      player.finished = true;
      player.timeBonus = Math.ceil(state.timeRemaining / 1000) * BOSS_TIME_BONUS_PER_SEC;
      player.points = (player.points || 0) + 1000 + player.timeBonus;
      player.finishTime = state.elapsedMs;
      state.finished = true;
      state.endReason = 'finish';
      state.winnerId = player.id;
      break;
    }

    if (player.x > player.distance) player.distance = Math.floor(player.x);
  }

  if (!state.finished && state.players.length > 1) {
    const eliminated = state.players.filter((p) => p.gameOver && !p.dying);
    const remaining = state.players.filter((p) => !p.gameOver && !p.finished);
    if (eliminated.length > 0 && remaining.length <= 1) {
      state.finished = true;
      state.endReason = 'gameover';
      state.winnerId = remaining[0]?.id || null;
    }
  }

  if (!state.finished && state.players.length > 0 && state.players.every((p) => p.gameOver && !p.dying)) {
    state.finished = true;
    state.endReason = 'gameover';
    state.winnerId = null;
  }

  state.timeRemaining = Math.max(0, state.timeRemaining - dt);
  if (state.timeRemaining <= 0) {
    if (!state.finished) state.endReason = 'timeout';
    state.finished = true;
  }
}

export function createPlatformerGameSetup(playerList, levelId = 'grass') {
  const level = makeLevel(levelId);
  const physics = createPhysics(level);
  const players = playerList.map((p) => ({
    ...createPlayerState(p.id),
    name: p.name,
    avatar: p.avatar,
  }));
  for (const player of players) attachPlayerBody(physics, player);

  const setup = {
    players,
    level,
    timeRemaining: TIME_LIMIT,
    elapsedMs: 0,
    finished: false,
    winnerId: null,
    endReason: null,
    enemyProjectiles: [],
    startedAt: null,
  };
  // Physics bodies/engine contain circular references, so keep them out of
  // socket.io payloads (non-enumerable properties are not serialized).
  Object.defineProperty(setup, 'physics', { value: physics, enumerable: false });
  return setup;
}

export function initPlatformerGame(setup, startX = null) {
  setup.startedAt = Date.now();
  setup.timeRemaining = TIME_LIMIT;
  setup.elapsedMs = 0;
  setup.finished = false;
  setup.winnerId = null;
  setup.endReason = null;
  setup.enemyProjectiles = [];
  const spawnX = Number.isFinite(startX) ? startX : 60;
  setup.startX = spawnX;
  for (const p of setup.players) {
    p.x = spawnX;
    p.y = GROUND_Y - PLAYER_H;
    p.vx = 0;
    p.vy = 0;
    p.alive = true;
    p.distance = Math.floor(spawnX);
    p.coins = 0;
    p.points = 0;
    p.lives = 3;
    p.starTicks = 0;
    p.invulnTicks = 0;
    p.gameOver = false;
    p.onGround = false;
    p.dying = false;
    p.deathTimer = 0;
    p.justDied = false;
    p.coinCollected = false;
    p.jumps = 0;
    p.jumped = false;
    p.prevJumpDown = false;
    p.coyoteTicks = 0;
    p.jumpBufferTicks = 0;
    p.jumpCutAvailable = false;
    p.checkpointX = spawnX;
    p.finished = false;
    p.finishTime = null;
    p.bossBonus = 0;
    p.timeBonus = 0;
    p.bossDefeated = false;
    p.bossLocked = false;
    p.moveDir = 0;
    p.controlVx = 0;
    p.prevBottom = p.y + PLAYER_H;
    const body = setup.physics.playerBodies.get(p.id);
    if (body) {
      Body.setPosition(body, { x: p.x + PLAYER_W / 2, y: p.y + PLAYER_H / 2 });
      Body.setVelocity(body, { x: 0, y: 0 });
    }
  }
  for (const c of setup.level.coins) c.collected = false;
  setup.level.enemies = setup.level.enemies.filter((e) => !e.summoned);
  for (const e of setup.level.enemies) {
    e.alive = true;
    e.x = e.spawnX;
    e.y = e.spawnY;
    e.vx = e.initialVx;
    e.phase = 0;
    e.hopPhase = 0;
  }
  for (const q of setup.level.questionBlocks) q.hit = false;
  if (setup.level.boss) {
    setup.level.boss = createBossState(setup.level.levelId);
    addBossGateBody(setup.physics, setup.level);
  }
}

export function tickPlatformerGame(setup, inputs) {
  updatePlatformer(setup, inputs, 50);
  return !setup.finished;
}

export function getPlatformerDynamicState(setup) {
  const boss = setup.level.boss;
  const bossState = boss ? {
    id: boss.id,
    name: boss.name,
    title: boss.title,
    theme: boss.theme,
    weapon: boss.weapon,
    style: boss.style,
    x: Math.round(boss.x),
    y: Math.round(boss.y),
    w: boss.w,
    h: boss.h,
    hp: boss.hp,
    maxHp: boss.maxHp,
    phase: boss.phase,
    active: boss.active,
    defeated: boss.defeated,
    gateOpen: boss.gateOpen,
    hitFlash: boss.hitFlash,
    taunt: boss.taunt,
    tauntTicks: boss.tauntTicks,
    teleported: !!boss.teleported,
    blinkTelegraph: !!boss.blinkTelegraph,
    blinkTargetX: Math.round(boss.blinkTargetX || 0),
    blinkTargetY: Math.round(boss.blinkTargetY || 0),
    dir: boss.dir,
    dashing: !!boss.dashing,
    charging: !!boss.charging,
    lastHitPoints: boss.lastHitPoints || 0,
    lastHitBy: boss.lastHitBy || null,
    lastHitSeq: boss.lastHitSeq || 0,
    projectiles: boss.projectiles.map((shot) => ({
      id: shot.id,
      type: shot.type,
      x: Math.round(shot.x),
      y: Math.round(shot.y),
      w: shot.w,
      h: shot.h,
      vx: shot.vx,
      vy: shot.vy,
      delay: Math.max(0, Math.round(shot.delay || 0)),
    })),
  } : null;
  if (boss) boss.teleported = false;

  return {
    players: setup.players.map((p) => {
      const coinCollected = p.coinCollected;
      const justDied = p.justDied;
      const jumped = p.jumped;
      p.coinCollected = false;
      p.justDied = false;
      p.jumped = false;
      return {
        id: p.id,
        x: Math.round(p.x),
        y: Math.round(p.y),
        vx: p.vx,
        vy: p.vy,
        onGround: p.onGround,
        alive: p.alive,
        distance: p.distance,
        facing: p.facing,
        coins: p.coins,
        points: p.points,
        lives: p.lives,
        gameOver: !!p.gameOver,
        invulnTicks: p.invulnTicks || 0,
        starTicks: p.starTicks,
        jumps: p.jumps,
        jumped,
        walkFrame: p.walkFrame,
        dying: p.dying,
        deathTimer: p.deathTimer,
        justDied,
        coinCollected,
        finished: p.finished,
        finishTime: p.finishTime,
        bossBonus: p.bossBonus || 0,
        timeBonus: p.timeBonus || 0,
        bossDefeated: !!p.bossDefeated,
      };
    }),
    boss: bossState,
    enemies: setup.level.enemies.filter((e) => e.alive).map((e) => ({
      id: e.id,
      x: Math.round(e.x),
      y: Math.round(e.y),
      w: e.w,
      h: e.h,
      type: e.type,
      charging: (e.shootWindup || 0) > 0,
    })),
    enemyProjectiles: (setup.enemyProjectiles || []).map((p) => ({
      id: p.id,
      type: p.type,
      x: Math.round(p.x),
      y: Math.round(p.y),
      w: p.w,
      h: p.h,
      vx: p.vx,
      vy: p.vy,
    })),
    coins: setup.level.coins.filter((c) => !c.collected).map((c) => ({ x: c.x, y: c.y })),
    questionBlocks: setup.level.questionBlocks.map((q) => ({
      x: q.x, y: q.y, w: q.w, h: q.h, hit: q.hit, reward: q.reward,
    })),
    timeRemaining: setup.timeRemaining,
    elapsedMs: setup.elapsedMs,
    finished: setup.finished,
    endReason: setup.endReason || null,
    winnerId: setup.winnerId,
  };
}

export function getPlatformerLevelData(setup) {
  const boss = setup.level.boss;
  return {
    platforms: setup.level.platforms,
    width: setup.level.width,
    finishX: setup.level.finishX,
    groundTop: setup.level.groundTop,
    checkpoints: setup.level.checkpoints,
    zones: setup.level.zones,
    startX: setup.startX ?? 60,
    levelId: setup.level.levelId,
    name: setup.level.name,
    coins: setup.level.coins.map((c) => ({ x: c.x, y: c.y, collected: c.collected })),
    enemies: setup.level.enemies.map((e) => ({
      id: e.id,
      x: e.x, y: e.y, w: e.w, h: e.h, type: e.type,
      patrolMin: e.patrolMin, patrolMax: e.patrolMax, vx: e.vx, alive: e.alive,
    })),
    pipes: setup.level.pipes,
    questionBlocks: setup.level.questionBlocks,
    icePatches: setup.level.icePatches || [],
    hazards: setup.level.hazards || [],
    physics: setup.level.physics,
    arena: setup.level.arena,
    boss: boss ? {
      id: boss.id,
      name: boss.name,
      title: boss.title,
      theme: boss.theme,
      weapon: boss.weapon,
      style: boss.style,
      movement: boss.movement,
      x: boss.x,
      y: boss.y,
      w: boss.w,
      h: boss.h,
      hp: boss.hp,
      maxHp: boss.maxHp,
      gateX: boss.gateX,
      arenaMin: boss.arenaMin,
      arenaMax: boss.arenaMax,
    } : null,
  };
}

export function getPlatformerResults(setup) {
  const sorted = [...setup.players].sort((a, b) => {
    if (a.finished && b.finished) return (a.finishTime || 0) - (b.finishTime || 0);
    if (a.finished) return -1;
    if (b.finished) return 1;
    if (!!a.gameOver !== !!b.gameOver) return a.gameOver ? 1 : -1;
    return b.distance - a.distance;
  });
  const summarize = (p) => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    distance: p.distance,
    coins: p.coins,
    points: p.points,
    lives: p.lives,
    gameOver: !!p.gameOver,
    finished: p.finished,
    finishTime: p.finishTime,
    bossDefeated: !!p.bossDefeated,
    bossBonus: p.bossBonus || 0,
    timeBonus: p.timeBonus || 0,
  });
  return {
    sorted: sorted.map(summarize),
    winner: sorted[0] ? summarize(sorted[0]) : null,
    boss: setup.level.boss ? {
      name: setup.level.boss.name,
      title: setup.level.boss.title,
      theme: setup.level.boss.theme,
      defeated: setup.level.boss.defeated,
      defeatedBy: setup.level.boss.defeatedBy,
      hp: setup.level.boss.hp,
      maxHp: setup.level.boss.maxHp,
    } : null,
    endReason: setup.endReason || null,
  };
}

export { LEVEL_NAMES, PLATFORMER_LEVEL_IDS };
