import Phaser from 'phaser';

const PALETTES = {
  mario:    { body: '#e82020', skin: '#f0b080', hat: '#e82020', shoe: '#6a3000', overall: '#2020e0', hair: '#6a3000', eyes: '#222' },
  luigi:    { body: '#20c020', skin: '#f0b080', hat: '#20c020', shoe: '#6a3000', overall: '#006000', hair: '#6a3000', eyes: '#222' },
  peach:    { body: '#ffb0d0', skin: '#f0c8a0', hat: '#ffb0d0', shoe: '#ff4080', overall: '#ff80a0', hair: '#ffd000', eyes: '#222' },
  bowser:   { body: '#d06020', skin: '#d09060', hat: '#d06020', shoe: '#5a3000', overall: '#208020', hair: '#e8a000', eyes: '#ff0' },
  toad:     { body: '#e0a030', skin: '#f0c8a0', hat: '#e04040', shoe: '#5a3000', overall: '#2080d0', hair: '#5a3000', eyes: '#222' },
  yoshi:    { body: '#30d030', skin: '#b0e8b0', hat: '#30d030', shoe: '#208020', overall: '#208020', hair: '#e03030', eyes: '#222' },
  boo:      { body: '#f0f0f0', skin: '#e8e0e8', hat: '#f0f0f0', shoe: '#aaa', overall: '#ddd', hair: '#888', eyes: '#222' },
  koopa:    { body: '#30b030', skin: '#d0a870', hat: '#30b030', shoe: '#5a3000', overall: '#208020', hair: '#d0a870', eyes: '#222' },
  daisy:    { body: '#f0c040', skin: '#f0c8a0', hat: '#f0c040', shoe: '#e88020', overall: '#40a040', hair: '#e88020', eyes: '#222' },
  rosalina: { body: '#4080ff', skin: '#e8d0c0', hat: '#4080ff', shoe: '#4040a0', overall: '#6060c0', hair: '#c0d0ff', eyes: '#222' },
  wario:    { body: '#d0a020', skin: '#e8b080', hat: '#d0a020', shoe: '#5a3000', overall: '#6020a0', hair: '#5a3000', eyes: '#222' },
  waluigi:  { body: '#6020a0', skin: '#e8b080', hat: '#6020a0', shoe: '#5a3000', overall: '#2080d0', hair: '#5a3000', eyes: '#222' },
};

const PLAYER_W = 26;
const PLAYER_H = 36;

function generatePlayerFrames(key, pal) {
  const canvas = document.createElement('canvas');
  canvas.width = PLAYER_W * 5;
  canvas.height = PLAYER_H * 3;
  const ctx = canvas.getContext('2d');

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      const dx = col * PLAYER_W;
      const dy = row * PLAYER_H;
      const frame = col;
      const isJump = row === 1;
      const isDeath = row === 2;

      drawPlayerFrame(ctx, dx, dy, pal, frame, isJump, isDeath);
    }
  }

  return { key, canvas, frameWidth: PLAYER_W, frameHeight: PLAYER_H };
}

function drawPlayerFrame(ctx, dx, dy, pal, frame, isJump, isDeath) {
  const w = PLAYER_W;
  const h = PLAYER_H;

  const legOffset = isJump ? 0 : [0, 2, 0, -2][frame] || 0;
  const armOffset = isJump ? -2 : [0, 1, 0, -1][frame] || 0;
  const hatBob = isJump ? -1 : 0;

  ctx.fillStyle = pal.shoe;
  ctx.fillRect(dx + 3, dy + h - 8, 8, 6);
  ctx.fillRect(dx + w - 11, dy + h - 8, 8, 6);

  if (isJump) {
    ctx.fillRect(dx + 1, dy + h - 8, 8, 6);
    ctx.fillRect(dx + w - 9, dy + h - 8, 8, 6);
  }

  ctx.fillStyle = pal.overall;
  if (isDeath) {
    ctx.fillStyle = '#666';
  }
  ctx.fillRect(dx + 4, dy + 16, w - 8, h - 22);

  ctx.fillStyle = pal.skin;
  if (isDeath) ctx.fillStyle = '#999';
  ctx.fillRect(dx + 1, dy + 13 + armOffset, 5, 10);
  ctx.fillRect(dx + w - 6, dy + 13 + armOffset, 5, 10);

  ctx.fillStyle = pal.body;
  if (isDeath) ctx.fillStyle = '#888';
  ctx.fillRect(dx + 4, dy + 6 + hatBob, w - 8, 14);

  ctx.fillStyle = pal.skin;
  if (isDeath) ctx.fillStyle = '#ccc';
  ctx.fillRect(dx + 5, dy + 6 + hatBob, w - 10, 10);

  ctx.fillStyle = pal.hat;
  if (isDeath) ctx.fillStyle = '#777';
  ctx.fillRect(dx + 1, dy + hatBob - 2, w - 2, 8);
  ctx.fillRect(dx + 3, dy + hatBob - 6, w - 6, 6);

  ctx.fillStyle = pal.hair;
  if (isDeath) ctx.fillStyle = '#888';
  ctx.fillRect(dx + 4, dy + 4 + hatBob, 5, 3);
  ctx.fillRect(dx + w - 9, dy + 4 + hatBob, 5, 3);

  ctx.fillStyle = pal.eyes;
  ctx.fillRect(dx + 7, dy + 8 + hatBob, 3, 3);
  ctx.fillRect(dx + w - 10, dy + 8 + hatBob, 3, 3);

  if (isJump) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(dx + 5, dy + 5 + hatBob, 3, 2);
  }

  if (isDeath) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✕', dx + w / 2, dy + h / 2 + 4);
  }
}

function generateGoombaFrames() {
  const w = 30, h = 30;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const legOff = f === 0 ? 0 : 2;

    ctx.fillStyle = '#c07040';
    ctx.beginPath();
    ctx.arc(dx + w / 2, 12, 14, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#8a5030';
    ctx.fillRect(dx + 6, 16 + legOff, 7, 6);
    ctx.fillRect(dx + w - 13, 16 + legOff, 7, 6);

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(dx + 9, 6, 4, 0, Math.PI * 2);
    ctx.arc(dx + w - 9, 6, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(dx + 8, 6, 2, 0, Math.PI * 2);
    ctx.arc(dx + w - 10, 6, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#222';
    ctx.fillRect(dx + 10, 10, w - 20, 2);
  }

  return { key: 'goomba', canvas, frameWidth: w, frameHeight: h };
}

function generateCoinFrames() {
  const s = 16;
  const canvas = document.createElement('canvas');
  canvas.width = s * 4;
  canvas.height = s;
  const ctx = canvas.getContext('2d');

  const widths = [14, 10, 6, 10];
  for (let i = 0; i < 4; i++) {
    const dx = i * s;
    const cw = widths[i];
    const ox = (s - cw) / 2;

    ctx.fillStyle = '#ffd700';
    ctx.fillRect(dx + ox, 1, cw, s - 2);

    ctx.fillStyle = '#fff0a0';
    ctx.fillRect(dx + ox + 1, 2, cw - 2, s - 4);

    ctx.fillStyle = '#b8960f';
    ctx.fillRect(dx + ox, 0, cw, 2);
    ctx.fillRect(dx + ox, s - 2, cw, 2);
  }

  return { key: 'coin', canvas, frameWidth: s, frameHeight: s };
}

function generateTileTextures() {
  const result = {};

  const groundCanvas = document.createElement('canvas');
  groundCanvas.width = 40;
  groundCanvas.height = 40;
  const gctx = groundCanvas.getContext('2d');
  gctx.fillStyle = '#c84c0c';
  gctx.fillRect(0, 0, 40, 40);
  gctx.fillStyle = '#4a9e3a';
  gctx.fillRect(0, 0, 40, 6);
  gctx.fillStyle = '#3a7e2a';
  gctx.fillRect(0, 0, 40, 2);
  gctx.strokeStyle = '#a03808';
  gctx.strokeRect(0, 0, 40, 40);
  result.ground = groundCanvas;

  const brickCanvas = document.createElement('canvas');
  brickCanvas.width = 40;
  brickCanvas.height = 40;
  const bctx = brickCanvas.getContext('2d');
  bctx.fillStyle = '#c84c0c';
  bctx.fillRect(0, 0, 40, 40);
  bctx.strokeStyle = '#a03808';
  bctx.lineWidth = 1;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 2; col++) {
      const bx = col * 20;
      const by = row * 10;
      const offset = row % 2 === 0 ? 0 : 10;
      bctx.strokeRect(bx + offset, by, 20, 10);
      if (row % 2 === 0) bctx.strokeRect(bx, by, 20, 10);
    }
  }
  result.brick = brickCanvas;

  const floatCanvas = document.createElement('canvas');
  floatCanvas.width = 40;
  floatCanvas.height = 24;
  const fctx = floatCanvas.getContext('2d');
  fctx.fillStyle = '#e09030';
  fctx.fillRect(0, 0, 40, 24);
  fctx.fillStyle = '#c07020';
  fctx.fillRect(0, 0, 40, 4);
  fctx.strokeStyle = '#b06018';
  fctx.strokeRect(0, 0, 40, 24);
  result.floating = floatCanvas;

  return result;
}

function generatePipeTexture() {
  const canvas = document.createElement('canvas');
  const w = 50, h = 120;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#30b030';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#209020';
  ctx.fillRect(4, 4, 8, h - 4);

  ctx.fillStyle = '#40c040';
  ctx.fillRect(w - 10, 4, 6, h - 4);

  ctx.fillStyle = '#209020';
  ctx.fillRect(0, 0, w, 8);

  ctx.fillStyle = '#30b030';
  ctx.fillRect(-4, -6, w + 8, 8);

  ctx.fillStyle = '#40c040';
  ctx.fillRect(-4, -6, 6, 8);

  ctx.fillStyle = '#40c040';
  ctx.fillRect(w + 2, -6, 6, 8);

  ctx.fillStyle = '#1a7a1a';
  ctx.fillRect(w + 2, -6, 2, 8);

  return { key: 'pipe', canvas };
}

function generateQuestionBlockFrames() {
  const s = 36;
  const canvas = document.createElement('canvas');
  canvas.width = s * 3;
  canvas.height = s;
  const ctx = canvas.getContext('2d');

  for (let i = 0; i < 3; i++) {
    const dx = i * s;
    const hit = i === 2;

    ctx.fillStyle = hit ? '#8a7040' : '#d0a020';
    ctx.fillRect(dx, 0, s, s);

    ctx.strokeStyle = hit ? '#6a5020' : '#b08010';
    ctx.lineWidth = 2;
    ctx.strokeRect(dx, 0, s, s);

    if (!hit) {
      ctx.fillStyle = '#b08010';
      ctx.fillRect(dx + 5, 0, 3, s);
      ctx.fillRect(dx + s - 8, 0, 3, s);

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', dx + s / 2, s / 2 + 1);
    }
  }

  return { key: 'questionBlock', canvas, frameWidth: s, frameHeight: s };
}

function generateBackgroundTextures() {
  const result = {};

  const mountCanvas = document.createElement('canvas');
  mountCanvas.width = 160;
  mountCanvas.height = 120;
  const mctx = mountCanvas.getContext('2d');
  mctx.fillStyle = '#5a8a5a';
  mctx.beginPath();
  mctx.moveTo(0, 120);
  mctx.lineTo(80, 10);
  mctx.lineTo(160, 120);
  mctx.fill();
  mctx.fillStyle = '#4a7a4a';
  mctx.beginPath();
  mctx.moveTo(40, 120);
  mctx.lineTo(100, 30);
  mctx.lineTo(160, 120);
  mctx.fill();
  result.mountain = mountCanvas;

  const bushCanvas = document.createElement('canvas');
  bushCanvas.width = 80;
  bushCanvas.height = 40;
  const bctx = bushCanvas.getContext('2d');
  bctx.fillStyle = '#4a9e3a';
  bctx.beginPath();
  bctx.arc(20, 40, 20, Math.PI, 0);
  bctx.arc(50, 40, 22, Math.PI, 0);
  bctx.arc(70, 40, 16, Math.PI, 0);
  bctx.fill();
  bctx.fillStyle = '#3a8e2a';
  bctx.beginPath();
  bctx.arc(35, 40, 14, Math.PI, 0);
  bctx.fill();
  result.bush = bushCanvas;

  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 80;
  cloudCanvas.height = 40;
  const cctx = cloudCanvas.getContext('2d');
  cctx.fillStyle = '#fff';
  cctx.beginPath();
  cctx.arc(25, 40, 18, Math.PI, 0);
  cctx.arc(50, 40, 22, Math.PI, 0);
  cctx.arc(70, 40, 14, Math.PI, 0);
  cctx.fill();
  cctx.fillStyle = '#eee';
  cctx.beginPath();
  cctx.arc(30, 38, 10, 0, Math.PI * 2);
  cctx.fill();
  cctx.beginPath();
  cctx.arc(55, 36, 12, 0, Math.PI * 2);
  cctx.fill();
  result.cloud = cloudCanvas;

  return result;
}

export function generateAllTextures(scene) {
  const tiles = generateTileTextures();
  for (const [k, c] of Object.entries(tiles)) {
    scene.textures.addCanvas(k, c);
  }

  for (const [name, pal] of Object.entries(PALETTES)) {
    const { key, canvas, frameWidth, frameHeight } = generatePlayerFrames(name, pal);
    scene.textures.addSpriteSheet(key, canvas, { frameWidth, frameHeight });
  }

  const { key: gkey, canvas: gcan, frameWidth: gfw, frameHeight: gfh } = generateGoombaFrames();
  scene.textures.addSpriteSheet(gkey, gcan, { frameWidth: gfw, frameHeight: gfh });

  const { key: ckey, canvas: ccan, frameWidth: cfw, frameHeight: cfh } = generateCoinFrames();
  scene.textures.addSpriteSheet(ckey, ccan, { frameWidth: cfw, frameHeight: cfh });

  const { key: pkey, canvas: pcan } = generatePipeTexture();
  scene.textures.addCanvas(pkey, pcan);

  const { key: qkey, canvas: qcan, frameWidth: qfw, frameHeight: qfh } = generateQuestionBlockFrames();
  scene.textures.addSpriteSheet(qkey, qcan, { frameWidth: qfw, frameHeight: qfh });

  const bg = generateBackgroundTextures();
  for (const [k, c] of Object.entries(bg)) {
    scene.textures.addCanvas(k, c);
  }

  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 60;
  flagCanvas.height = 170;
  const flctx = flagCanvas.getContext('2d');
  flctx.fillStyle = '#888';
  flctx.fillRect(10, 0, 8, 170);
  flctx.fillStyle = '#ff4444';
  flctx.beginPath();
  flctx.moveTo(20, 4);
  flctx.lineTo(60, 24);
  flctx.lineTo(20, 44);
  flctx.fill();
  flctx.fillStyle = '#222';
  flctx.fillRect(55, 20, 6, 10);
  scene.textures.addCanvas('flag', flagCanvas);

  const heartCanvas = document.createElement('canvas');
  heartCanvas.width = 20;
  heartCanvas.height = 20;
  const hctx = heartCanvas.getContext('2d');
  hctx.fillStyle = '#ff3040';
  hctx.beginPath();
  hctx.arc(6, 7, 5, Math.PI, 0);
  hctx.arc(14, 7, 5, Math.PI, 0);
  hctx.fill();
  hctx.fillRect(1, 7, 18, 8);
  hctx.beginPath();
  hctx.arc(10, 15, 6, Math.PI, 0);
  hctx.fill();
  scene.textures.addCanvas('heart', heartCanvas);
}

export function getPaletteByAvatar(avatar) {
  return PALETTES[avatar] || PALETTES.mario;
}

export { PALETTES };
