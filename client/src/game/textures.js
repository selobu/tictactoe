const RUNNER_FRAME_W = 32;
const RUNNER_FRAME_H = 44;
const RUNNER_FRAMES = 12;

// Classic palettes kept for older rooms / fallback.
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

// Colors taken from the animated avatar collection.
const CUSTOM_PALETTES = {
  'plumber-01': { hat: '#e63946', shirt: '#e63946', overall: '#2f5aa8', skin: '#f0b98d', hair: '#5a3320', shoe: '#6a3a12' },
  'plumber-02': { hat: '#43aa8b', shirt: '#43aa8b', overall: '#2f5aa8', skin: '#f6c9a6', hair: '#7a4b2a', shoe: '#2f6b4f' },
  'plumber-03': { hat: '#f4c430', shirt: '#f08a24', overall: '#6b4a2f', skin: '#8d5524', hair: '#1f1a17', shoe: '#5a3a1a' },
  'plumber-04': { hat: '#3a86ff', shirt: '#3a86ff', overall: '#7aa5d8', skin: '#c68642', hair: '#2b1d16', shoe: '#2660c4' },
  'plumber-05': { hat: '#9b5de5', shirt: '#9b5de5', overall: '#3b3b4f', skin: '#f0c8a0', hair: '#b8b8c4', shoe: '#5a3a7a' },
  'plumber-06': { hat: '#ff8c42', shirt: '#ff8c42', overall: '#2a9d8f', skin: '#d9a066', hair: '#6b4423', shoe: '#a0521f' },
  'plumber-07': { hat: '#ff5d8f', shirt: '#ffd166', overall: '#ff8fab', skin: '#6b4226', hair: '#1f1a17', shoe: '#b02a5a' },
  'plumber-08': { hat: '#00b4d8', shirt: '#00b4d8', overall: '#1d3557', skin: '#b07a4a', hair: '#2b1d16', shoe: '#007a99' },
  'plumber-09': { hat: '#f1f1f1', shirt: '#e63946', overall: '#8d99ae', skin: '#5c3a21', hair: '#2b1d16', shoe: '#5a5a66' },
  'plumber-10': { hat: '#2b2d42', shirt: '#22223b', overall: '#f4c430', skin: '#7b4a2d', hair: '#1a1117', shoe: '#171825' },
  'plumber-11': { hat: '#8d2f3d', shirt: '#8d2f3d', overall: '#2a9d8f', skin: '#f3d1b3', hair: '#b5522b', shoe: '#5a2a1a' },
  'plumber-12': { hat: '#a7c957', shirt: '#a7c957', overall: '#9aa0a6', skin: '#f7cdb0', hair: '#c8553d', shoe: '#6b7a45' },
  'flower-01': { hat: '#ff6f91', shirt: '#ff8fb1', overall: '#3f8f4f', skin: '#ffd166', hair: '#4caf50', shoe: '#2f6b3a' },
  'pine-01': { hat: '#2f8f6a', shirt: '#56c79a', overall: '#1f6b50', skin: '#f7d9b8', hair: '#7a4b2a', shoe: '#4a2c18' },
  'cloud-01': { hat: '#c9e2f2', shirt: '#f7fbff', overall: '#8ecae6', skin: '#ffd6b0', hair: '#c9e2f2', shoe: '#5a8fb0' },
  'rocket-01': { hat: '#e63946', shirt: '#f4f1de', overall: '#1d3557', skin: '#ffd6b0', hair: '#d9d4bd', shoe: '#4cc9f0' },
  'mushroom-01': { hat: '#e63946', shirt: '#fff3e0', overall: '#4caf50', skin: '#ffd6b0', hair: '#fff3e0', shoe: '#c46a3a' },
  'cactus-01': { hat: '#3a9d6a', shirt: '#5cc28a', overall: '#2a7a4f', skin: '#ffe0b0', hair: '#2f6b3a', shoe: '#c46a3a' },
  'planet-01': { hat: '#2ec4b6', shirt: '#6fe0d4', overall: '#1f8f85', skin: '#cfe8ff', hair: '#7bdff2', shoe: '#ffd166' },
  'robot-01': { hat: '#adb5bd', shirt: '#dee2e6', overall: '#6c757d', skin: '#c9d4dc', hair: '#4cc9f0', shoe: '#2b2d42' },
  'coffee-01': { hat: '#8b4a2f', shirt: '#b06a45', overall: '#5e2c1a', skin: '#f0c8a0', hair: '#47200f', shoe: '#3a1a0c' },
  'eagle-01': { hat: '#f8f9fa', shirt: '#c9d4dc', overall: '#1d3557', skin: '#f4a261', hair: '#f8f9fa', shoe: '#e76f51' },
  'axolotl-01': { hat: '#f7a8c4', shirt: '#ffd0e0', overall: '#e58bb0', skin: '#ffd6e6', hair: '#e56b9a', shoe: '#b34a72' },
  'house-01': { hat: '#d95d39', shirt: '#f4e3c1', overall: '#2a9d8f', skin: '#ffe0c2', hair: '#8c3b2a', shoe: '#8c3b2a' },
  'catrina-01': { hat: '#24122e', shirt: '#2a1233', overall: '#ff9f1c', skin: '#f3e7d3', hair: '#1b1026', shoe: '#8f1236' },
};

const FALLBACK_PALETTES = [
  CUSTOM_PALETTES['plumber-01'],
  CUSTOM_PALETTES['plumber-02'],
  CUSTOM_PALETTES['plumber-04'],
  CUSTOM_PALETTES['plumber-06'],
  CUSTOM_PALETTES['plumber-07'],
  CUSTOM_PALETTES['plumber-08'],
];

function hashString(value) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = ((h << 5) - h + value.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function normalizePalette(p) {
  if (!p) return FALLBACK_PALETTES[0];
  return {
    hat: p.hat || p.cap || p.body || '#e63946',
    shirt: p.shirt || p.body || p.hat || '#e63946',
    overall: p.overall || p.overalls || '#2f5aa8',
    skin: p.skin || '#f0b98d',
    hair: p.hair || '#5a3320',
    shoe: p.shoe || '#6a3a12',
  };
}

export function getPaletteByAvatar(avatar) {
  const key = String(avatar || '');
  return normalizePalette(PALETTES[key] || CUSTOM_PALETTES[key] || FALLBACK_PALETTES[hashString(key) % FALLBACK_PALETTES.length]);
}

export function getRunnerTextureKey(avatar) {
  const safe = String(avatar || 'default').replace(/[^a-z0-9]/gi, '').toLowerCase() || 'default';
  return `runner-${safe}`;
}

function shade(hex, factor) {
  const h = hex.replace('#', '');
  if (h.length !== 6) return hex;
  const n = parseInt(h, 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * factor));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * factor));
  const b = Math.min(255, Math.round((n & 255) * factor));
  return `rgb(${r},${g},${b})`;
}

function rr(ctx, x, y, w, h, r, fill, stroke) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.9;
    ctx.stroke();
  }
}

function limb(ctx, x1, y1, x2, y2, color, width) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#3a2410';
  ctx.lineWidth = width + 1.6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function hand(ctx, x, y, pal, cuffColor) {
  // Glove with a small cuff.
  if (cuffColor) {
    rr(ctx, x - 2.6, y + 1.5, 5.2, 2, 1, cuffColor, '#3a2410');
  }
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#fffdf8';
  ctx.fill();
  ctx.strokeStyle = '#3a2410';
  ctx.lineWidth = 0.9;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.beginPath(); ctx.arc(x - 0.9, y - 1, 1.1, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(120, 90, 60, .45)';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(x - 1.6, y + 1.1); ctx.lineTo(x + 1.4, y + 1.1); ctx.stroke();
}

function shoeShape(ctx, x, y, pal) {
  // Chunky shoe with a sole, toe highlight, and lace.
  rr(ctx, x, y, 9.2, 5.5, 2.4, pal.shoe, '#2c1a0c');
  ctx.fillStyle = '#f7ead1';
  ctx.fillRect(x + 1.1, y + 4.7, 7.1, 1.3);
  ctx.fillStyle = 'rgba(255,255,255,.42)';
  rr(ctx, x + 1.6, y + 0.8, 5.4, 1.6, 0.8, 'rgba(255,255,255,.42)');
  ctx.strokeStyle = 'rgba(255,255,255,.55)';
  ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(x + 2.7, y + 2.1); ctx.lineTo(x + 6.5, y + 2.1); ctx.stroke();
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  ctx.fillRect(x + 7, y + 1.1, 1.4, 3.2);
}

function drawPlumberRunner(ctx, ox, look, frame) {
  const pal = look.palette;
  const walk = frame < 6;  const jump = frame === 6;
  const fall = frame === 7;
  const die = frame === 10;
  const cheer = frame === 11;
  const swing = walk ? [0, 2.4, 4, 0, -2.4, -4][frame] : 0;
  const bob = walk ? [0, 0.7, 1.1, 0, 0.7, 1.1][frame] : (jump ? -1 : 0);
  const armSwing = walk ? -swing * 1.15 : 0;

  const { hat, shirt, overall, skin, hair, shoe } = pal;
  const outline = '#3a2410';
  const hatShade = shade(hat, 0.72);
  const hatLight = shade(hat, 1.18);
  const shirtShade = shade(shirt, 0.76);
  const shirtLight = shade(shirt, 1.16);
  const overallShade = shade(overall, 0.72);
  const overallLight = shade(overall, 1.15);
  const skinShade = shade(skin, 0.86);
  const hairShade = shade(hair, 0.72);

  ctx.save();
  ctx.translate(ox, 0);

  let backFootX = 6 + swing * 0.7;
  let frontFootX = 20.5 - swing * 0.55;
  let backFootY = 36;
  let frontFootY = 36;
  if (jump) {
    backFootX = 5.5; frontFootX = 22.4;
    backFootY = 34; frontFootY = 33;
  } else if (fall) {
    backFootX = 4; frontFootX = 22.5;
    backFootY = 36; frontFootY = 36;
  } else if (die) {
    backFootX = 7; frontFootX = 21;
    backFootY = 38; frontFootY = 38;
  } else if (cheer) {
    backFootX = 6; frontFootX = 22;
    backFootY = 35; frontFootY = 35;
  }

  const hipY = 29 + bob;
  const shoulderY = 18 + bob;
  const headY = 4 + bob;

  // --- Back layer ---------------------------------------------------------
  if (cheer || jump) {
    limb(ctx, 10, shoulderY, 5, 12 + bob, shirtShade, 4.2);
    hand(ctx, 5, 12 + bob, pal, shirtShade);
  } else if (!die) {
    limb(ctx, 10, shoulderY, 4.5, 26 + bob + armSwing * 0.55, shirtShade, 4.2);
    hand(ctx, 4.5, 26 + bob + armSwing * 0.55, pal, shirtShade);
  }

  if (!die) {
    limb(ctx, 13, hipY, backFootX + 4, backFootY - 2, overallShade, 4.4);
    rr(ctx, backFootX + 2, backFootY - 4, 7, 3, 1.2, overallShade, outline);
    shoeShape(ctx, backFootX, backFootY, pal);
  } else {
    limb(ctx, 13, hipY, 8, 37, overallShade, 4.2);
    shoeShape(ctx, 5, 38, pal);
  }

  // --- Torso --------------------------------------------------------------
  rr(ctx, 8.5, 17 + bob, 15, 13, 4, shirt, outline);
  rr(ctx, 9.5, 17.8 + bob, 13, 2.6, 1.2, shirtLight);
  ctx.fillStyle = shirtShade;
  ctx.fillRect(8.7, 27 + bob, 14.6, 2.2);

  // Sleeves.
  rr(ctx, 6.8, 18.5 + bob, 5.2, 7.4, 2, shirt, outline);
  rr(ctx, 20, 18.5 + bob, 5.2, 7.4, 2, shirtShade, outline);
  ctx.fillStyle = shirtLight;
  ctx.fillRect(7.4, 19.2 + bob, 3.6, 1.2);

  // Overalls bib and straps.
  rr(ctx, 10.4, 21 + bob, 12.6, 10.2, 2.8, overall, outline);
  ctx.fillStyle = overallShade;
  ctx.fillRect(11, 28.5 + bob, 11.4, 2.4);
  rr(ctx, 11.6, 17.8 + bob, 2.6, 6.2, 1, overall, outline);
  rr(ctx, 19.4, 17.8 + bob, 2.6, 6.2, 1, overallShade, outline);

  // Gold buttons.
  for (const bx of [12.4, 20.2]) {
    ctx.beginPath(); ctx.arc(bx, 22.3 + bob, 1.25, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166'; ctx.fill();
    ctx.strokeStyle = '#8a5a00'; ctx.lineWidth = 0.5; ctx.stroke();
    ctx.fillStyle = '#fff4b8';
    ctx.beginPath(); ctx.arc(bx - 0.4, 21.9 + bob, 0.45, 0, Math.PI * 2); ctx.fill();
  }

  // Bib pocket and seam.
  rr(ctx, 13.2, 24.5 + bob, 5, 3.3, 1, shade(overall, 0.9), outline);
  ctx.strokeStyle = overallLight;
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(13.8, 25.2 + bob); ctx.lineTo(17.4, 25.2 + bob); ctx.stroke();
  ctx.strokeStyle = overallShade;
  ctx.beginPath(); ctx.moveTo(11, 24 + bob); ctx.lineTo(11, 29 + bob); ctx.stroke();

  // Belt.
  rr(ctx, 9.8, 29 + bob, 13.6, 2.3, 1, shade(overall, 0.62), outline);
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(15.2, 29.2 + bob, 2.4, 1.9);

  // Front leg.
  if (!die) {
    limb(ctx, 19, hipY, frontFootX + 4, frontFootY - 2, overall, 4.4);
    rr(ctx, frontFootX + 2, frontFootY - 4, 7, 3, 1.2, overall, outline);
    ctx.fillStyle = overallLight;
    ctx.fillRect(frontFootX + 3, frontFootY - 3.4, 4.5, 1);
    shoeShape(ctx, frontFootX, frontFootY, pal);
  } else {
    limb(ctx, 19, hipY, 25, 38, overall, 4.2);
    shoeShape(ctx, 21, 38, pal);
  }

  // --- Head ---------------------------------------------------------------
  rr(ctx, 13.5, 14.5 + bob, 5.4, 4.2, 1.4, skinShade, outline);
  rr(ctx, 8.4, headY, 15.6, 12.4, 5, skin, outline);
  ctx.fillStyle = 'rgba(255,255,255,.22)';
  rr(ctx, 9.7, headY + 1.2, 8.6, 3, 1.4, 'rgba(255,255,255,.22)');
  ctx.fillStyle = skinShade;
  ctx.fillRect(8.6, headY + 9, 15, 2.4);

  // Ear.
  ctx.beginPath(); ctx.ellipse(8.2, 11.5 + bob, 2.6, 3.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 0.85; ctx.stroke();
  ctx.strokeStyle = skinShade;
  ctx.beginPath(); ctx.arc(8.2, 11.5 + bob, 1.4, -0.4, Math.PI + 0.4); ctx.stroke();

  // Hair / sideburn.
  ctx.fillStyle = hair;
  rr(ctx, 8.4, 8.7 + bob, 2.5, 6.3, 1, hair, outline);
  ctx.fillStyle = hairShade;
  ctx.fillRect(8.7, 13.8 + bob, 2, 1.4);

  // Nose.
  ctx.beginPath(); ctx.ellipse(23.1, 11.6 + bob, 3.3, 2.7, -0.12, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 0.9; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.32)';
  ctx.beginPath(); ctx.ellipse(22.4, 10.7 + bob, 1.2, 0.8, -0.2, 0, Math.PI * 2); ctx.fill();

  // Mustache.
  ctx.fillStyle = hair;
  ctx.beginPath(); ctx.ellipse(19.2, 14.4 + bob, 3.4, 1.9, 0.12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(22.6, 14.2 + bob, 2.9, 1.7, -0.12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = hairShade;
  ctx.fillRect(17.6, 14.8 + bob, 6.8, 0.8);

  // Eye / brow.
  if (die) {
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(18.7, 8.7 + bob); ctx.lineTo(22.1, 12.1 + bob); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(22.1, 8.7 + bob); ctx.lineTo(18.7, 12.1 + bob); ctx.stroke();
  } else {
    rr(ctx, 18.3, 7.8 + bob, 4.5, 5.3, 2, '#fffdf8', outline);
    ctx.fillStyle = '#222';
    ctx.fillRect(20.3, 9.1 + bob, 2, 3);
    ctx.fillStyle = '#fff';
    ctx.fillRect(20.6, 9.4 + bob, 0.9, 0.9);
    ctx.strokeStyle = hair;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(18.4, 7.1 + bob); ctx.lineTo(22.5, 7.8 + bob); ctx.stroke();
  }

  // Cheek / smile.
  if (!die) {
    ctx.strokeStyle = '#8a4a2a';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(21.4, 17.2 + bob, 1.5, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = 'rgba(255, 130, 130, .22)';
    ctx.beginPath(); ctx.ellipse(12.8, 14.2 + bob, 1.8, 1, 0, 0, Math.PI * 2); ctx.fill();
  }

  // --- Cap ----------------------------------------------------------------
  rr(ctx, 6.4, 1.2 + bob, 19, 7.2, 3.2, hat, outline);
  rr(ctx, 7.3, 2 + bob, 16.8, 2.2, 1, hatLight);
  ctx.fillStyle = hatShade;
  ctx.fillRect(7.2, 6.6 + bob, 17.5, 1.8);
  rr(ctx, 19.2, 5.4 + bob, 12, 3.5, 1.8, hatShade, outline);
  ctx.fillStyle = shade(hat, 0.9);
  ctx.fillRect(20.2, 6 + bob, 9.2, 1.1);
  ctx.fillStyle = 'rgba(255,255,255,.22)';
  ctx.fillRect(20.4, 5.6 + bob, 8.2, 0.7);

  // Cap badge.
  ctx.beginPath(); ctx.arc(15.2, 4.4 + bob, 2.45, 0, Math.PI * 2);
  ctx.fillStyle = '#fffdf8'; ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 0.75; ctx.stroke();
  ctx.fillStyle = hatShade;
  ctx.font = 'bold 3px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('M', 15.2, 4.6 + bob);

  // --- Front arm ----------------------------------------------------------
  if (cheer || jump) {
    limb(ctx, 22, shoulderY, 27, 12 + bob, shirt, 4.2);
    hand(ctx, 27, 12 + bob, pal, shirt);
  } else if (fall) {
    limb(ctx, 22, shoulderY, 28, 22 + bob, shirt, 4.2);
    hand(ctx, 28, 22 + bob, pal, shirt);
  } else if (!die) {
    limb(ctx, 22, shoulderY, 27, 26 + bob + armSwing * 0.55, shirt, 4.2);
    hand(ctx, 27, 26 + bob + armSwing * 0.55, pal, shirt);
  }

  ctx.restore();
}

function runnerPose(frame) {
  const walk = frame < 6;
  const jump = frame === 6;
  const fall = frame === 7;
  const die = frame === 10;
  const cheer = frame === 11;
  const swing = walk ? [0, 2.4, 4, 0, -2.4, -4][frame] : 0;
  const bob = walk ? [0, 0.7, 1.1, 0, 0.7, 1.1][frame] : (jump ? -1 : 0);
  return { walk, jump, fall, die, cheer, swing, bob, armSwing: walk ? -swing * 1.1 : 0 };
}

const RUNNER_KINDS = new Set([
  'plumber', 'flower', 'pine', 'cloud', 'rocket', 'mushroom', 'cactus',
  'planet', 'robot', 'coffee', 'eagle', 'axolotl', 'house', 'catrina',
]);

function getRunnerLook(avatar, palette) {
  const id = String(avatar || 'plumber-01');
  const prefix = id.split('-')[0];
  return { avatar: id, kind: RUNNER_KINDS.has(prefix) ? prefix : 'plumber', palette };
}

function runnerStar(ctx, cx, cy, outer, inner, fill, stroke) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.8; ctx.stroke(); }
}

function drawFlowerRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#2d1a10';
  const cx = 16;
  const headY = 10 + p.bob;
  ctx.save();
  ctx.translate(ox, 0);

  // Leaf arms.
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(cx + side * 8, 24 + p.bob + (p.jump || p.cheer ? -5 : 0));
    ctx.rotate(side * (p.walk ? p.swing * 0.12 : 0.2));
    ctx.beginPath(); ctx.ellipse(side * 4, 0, 6, 3.2, side * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = shade(pal.shirt, side > 0 ? 1 : 0.9); ctx.fill();
    ctx.strokeStyle = outline; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.strokeStyle = shade(pal.overall, 1.2); ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(side * 7, 1); ctx.stroke();
    ctx.restore();
  }

  // Stem body and legs.
  rr(ctx, 13, 18 + p.bob, 6, 16, 3, pal.overall, outline);
  rr(ctx, 14.2, 19 + p.bob, 1.6, 12, 0.8, shade(pal.overall, 1.25));
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.5;
    limb(ctx, cx + side * 2, 32 + p.bob, footX, 38, pal.overall, 3.2);
    shoeShape(ctx, footX - 4.5, 38, pal);
  }

  // Petals.
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * 7, headY + Math.sin(a) * 6);
    ctx.rotate(a + Math.PI / 2);
    ctx.beginPath(); ctx.ellipse(0, 0, 4.2, 6.2, 0, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 ? pal.hat : shade(pal.hat, 1.16); ctx.fill();
    ctx.strokeStyle = outline; ctx.lineWidth = 0.75; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    ctx.beginPath(); ctx.ellipse(-1, -2, 1.2, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.beginPath(); ctx.arc(cx, headY, 6.3, 0, Math.PI * 2);
  ctx.fillStyle = pal.skin; ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.3)';
  ctx.beginPath(); ctx.arc(cx - 2, headY - 2, 2, 0, Math.PI * 2); ctx.fill();

  if (p.die) {
    limb(ctx, cx - 3, headY - 2, cx - 0.5, headY + 1, '#222', 0.8);
    limb(ctx, cx - 0.5, headY - 2, cx - 3, headY + 1, '#222', 0.8);
    limb(ctx, cx + 1, headY - 2, cx + 3.5, headY + 1, '#222', 0.8);
    limb(ctx, cx + 3.5, headY - 2, cx + 1, headY + 1, '#222', 0.8);
  } else {
    for (const dx of [-2.4, 2.4]) {
      ctx.fillStyle = '#fffdf8';
      ctx.beginPath(); ctx.ellipse(cx + dx, headY - 1, 1.7, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1210';
      ctx.beginPath(); ctx.arc(cx + dx + 0.3, headY - 0.6, 0.9, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#8a4a2a'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(cx, headY + 3, 1.6, 0.2, Math.PI - 0.2); ctx.stroke();
  }
  // Small leaf flourish.
  ctx.beginPath(); ctx.ellipse(cx + 5, 20 + p.bob, 2.5, 1.2, 0.6, 0, Math.PI * 2);
  ctx.fillStyle = shade(pal.shirt, 1.1); ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 0.6; ctx.stroke();
  ctx.restore();
}

function drawPineRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#1d2a20';
  const cx = 16;
  ctx.save();
  ctx.translate(ox, 0);

  // Trunk legs.
  for (const side of [-1, 1]) {
    const footX = cx + side * 4 + p.swing * side * 0.6;
    limb(ctx, cx + side * 2, 27 + p.bob, footX, 37, pal.hair, 3.8);
    shoeShape(ctx, footX - 4.5, 37, pal);
  }

  // Branch arms.
  for (const side of [-1, 1]) {
    const lift = (p.jump || p.cheer) ? -6 : 0;
    limb(ctx, cx + side * 7, 22 + p.bob, cx + side * 13, 24 + p.bob + lift, pal.overall, 2.4);
    ctx.beginPath(); ctx.arc(cx + side * 13, 24 + p.bob + lift, 3, 0, Math.PI * 2);
    ctx.fillStyle = pal.shirt; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 0.7; ctx.stroke();
  }

  // Three tree layers.
  const layers = [
    [5, 10, 22, pal.hat],
    [7, 16, 18, pal.shirt],
    [9, 22, 14, pal.overall],
  ];
  for (const [left, top, width, color] of layers) {
    ctx.beginPath();
    ctx.moveTo(cx, top - 5 + p.bob);
    ctx.lineTo(cx - width / 2, top + 9 + p.bob);
    ctx.quadraticCurveTo(cx, top + 12 + p.bob, cx + width / 2, top + 9 + p.bob);
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.strokeStyle = outline; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.14)';
    ctx.beginPath(); ctx.moveTo(cx, top - 3 + p.bob); ctx.lineTo(cx - width / 3, top + 7 + p.bob); ctx.lineTo(cx, top + 5 + p.bob); ctx.fill();
  }

  // Star.
  runnerStar(ctx, cx, 3.5 + p.bob, 3.6, 1.7, pal.skin, '#8a5a00');

  // Scarf.
  rr(ctx, 9, 22 + p.bob, 14, 3.2, 2, '#e63946', outline);
  ctx.fillStyle = '#ff8a93';
  ctx.fillRect(10, 22.5 + p.bob, 11, 0.9);
  ctx.fillStyle = '#e63946';
  ctx.beginPath(); ctx.moveTo(20, 24 + p.bob); ctx.lineTo(25, 31 + p.bob); ctx.lineTo(21, 27 + p.bob); ctx.closePath(); ctx.fill();

  // Face on the middle layer.
  if (p.die) {
    limb(ctx, 12, 17 + p.bob, 14.5, 19.5 + p.bob, '#222', 0.8);
    limb(ctx, 14.5, 17 + p.bob, 12, 19.5 + p.bob, '#222', 0.8);
    limb(ctx, 17.5, 17 + p.bob, 20, 19.5 + p.bob, '#222', 0.8);
    limb(ctx, 20, 17 + p.bob, 17.5, 19.5 + p.bob, '#222', 0.8);
  } else {
    for (const dx of [-2.5, 2.5]) {
      ctx.fillStyle = '#fffdf8';
      ctx.beginPath(); ctx.ellipse(cx + dx, 18 + p.bob, 1.7, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1210';
      ctx.beginPath(); ctx.arc(cx + dx + 0.2, 18.4 + p.bob, 0.9, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#2f4d3a'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(cx, 21 + p.bob, 1.6, 0.2, Math.PI - 0.2); ctx.stroke();
  }
  ctx.restore();
}

function drawCloudRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#3a5b78';
  const cx = 16;
  const cy = 22 + p.bob;
  ctx.save();
  ctx.translate(ox, 0);

  // Cloud puffs.
  const puffs = [
    [cx - 7, cy + 2, 6], [cx, cy - 3, 7.5], [cx + 7, cy + 1, 6], [cx - 2, cy + 6, 6.5], [cx + 5, cy + 6, 5.5],
  ];
  for (const [x, y, r] of puffs) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = pal.shirt; ctx.fill();
    ctx.strokeStyle = outline; ctx.lineWidth = 0.85; ctx.stroke();
  }
  // Shaded underside and highlight.
  ctx.fillStyle = shade(pal.overall, 1.1);
  ctx.beginPath(); ctx.ellipse(cx, cy + 6, 13, 4, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.4)';
  ctx.beginPath(); ctx.ellipse(cx - 4, cy - 7, 5, 2.4, -0.2, 0, Math.PI * 2); ctx.fill();

  // Cloud arms.
  for (const side of [-1, 1]) {
    const lift = (p.jump || p.cheer) ? -5 : 0;
    ctx.beginPath(); ctx.arc(cx + side * 12, cy + 1 + lift, 3.4, 0, Math.PI * 2);
    ctx.fillStyle = pal.hat; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 0.75; ctx.stroke();
  }

  // Legs and shoes.
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.55;
    limb(ctx, cx + side * 2, 28 + p.bob, footX, 36, pal.overall, 2.8);
    shoeShape(ctx, footX - 4.5, 36, pal);
  }

  if (p.die) {
    limb(ctx, cx - 4, cy - 2, cx - 1, cy + 1, '#222', 0.8);
    limb(ctx, cx - 1, cy - 2, cx - 4, cy + 1, '#222', 0.8);
    limb(ctx, cx + 1, cy - 2, cx + 4, cy + 1, '#222', 0.8);
    limb(ctx, cx + 4, cy - 2, cx + 1, cy + 1, '#222', 0.8);
  } else {
    for (const dx of [-3, 3]) {
      ctx.fillStyle = '#1d3a52';
      ctx.beginPath(); ctx.ellipse(cx + dx, cy - 1, 1.8, 2.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx + dx + 0.5, cy - 1.8, 0.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#3a5b78'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(cx, cy + 3, 2, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,130,160,.35)';
    ctx.beginPath(); ctx.ellipse(cx - 6, cy + 2, 2, 1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 6, cy + 2, 2, 1, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawRocketRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#2a1a10';
  const cx = 16;
  const bob = p.bob;
  ctx.save();
  ctx.translate(ox, 0);

  // Flames.
  const flame = p.jump ? 10 : (p.walk ? 6 + Math.abs(p.swing) : 5);
  ctx.fillStyle = pal.shoe;
  ctx.beginPath(); ctx.moveTo(cx - 4, 37 + bob); ctx.lineTo(cx, 37 + flame + bob); ctx.lineTo(cx + 4, 37 + bob); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff3b0';
  ctx.beginPath(); ctx.moveTo(cx - 1.8, 37 + bob); ctx.lineTo(cx, 37 + flame * 0.6 + bob); ctx.lineTo(cx + 1.8, 37 + bob); ctx.closePath(); ctx.fill();

  // Body.
  rr(ctx, 10, 10 + bob, 12, 27, 6, pal.shirt, outline);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  rr(ctx, 11.2, 12 + bob, 2.6, 19, 1.2, 'rgba(255,255,255,.35)');
  ctx.fillStyle = shade(pal.shirt, 0.8);
  ctx.fillRect(19.6, 13 + bob, 1.6, 20);

  // Nose cone.
  ctx.beginPath(); ctx.moveTo(cx, 2 + bob); ctx.lineTo(cx + 7, 11 + bob); ctx.lineTo(cx - 7, 11 + bob); ctx.closePath();
  ctx.fillStyle = pal.hat; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.3)';
  ctx.beginPath(); ctx.moveTo(cx - 1, 4 + bob); ctx.lineTo(cx - 5, 10 + bob); ctx.lineTo(cx - 1, 10 + bob); ctx.fill();

  // Fins.
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(cx + side * 5, 27 + bob);
    ctx.lineTo(cx + side * 12, 36 + bob);
    ctx.lineTo(cx + side * 5, 34 + bob);
    ctx.closePath();
    ctx.fillStyle = pal.overall; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 0.9; ctx.stroke();
  }

  // Window face.
  ctx.beginPath(); ctx.arc(cx, 21 + bob, 7, 0, Math.PI * 2);
  ctx.fillStyle = pal.skin; ctx.fill();
  ctx.strokeStyle = pal.overall; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = outline; ctx.lineWidth = 0.8; ctx.stroke();
  if (p.die) {
    limb(ctx, cx - 3, 19 + bob, cx - 0.5, 22 + bob, '#222', 0.8);
    limb(ctx, cx - 0.5, 19 + bob, cx - 3, 22 + bob, '#222', 0.8);
    limb(ctx, cx + 1, 19 + bob, cx + 3.5, 22 + bob, '#222', 0.8);
    limb(ctx, cx + 3.5, 19 + bob, cx + 1, 22 + bob, '#222', 0.8);
  } else {
    for (const dx of [-2.4, 2.4]) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx + dx, 20 + bob, 1.7, 2.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1210';
      ctx.beginPath(); ctx.arc(cx + dx + 0.2, 20.4 + bob, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#8a4a2a'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(cx, 24 + bob, 1.7, 0.2, Math.PI - 0.2); ctx.stroke();
  }
  ctx.restore();
}

function drawMushroomRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#3a2410';
  const cx = 16;
  const bob = p.bob;
  ctx.save();
  ctx.translate(ox, 0);

  // Legs.
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.6;
    limb(ctx, cx + side * 2, 30 + bob, footX, 37, pal.overall, 3);
    shoeShape(ctx, footX - 4.5, 37, pal);
  }
  // Stem body.
  rr(ctx, 11, 19 + bob, 10, 13, 4, '#f4e3c1', outline);
  ctx.fillStyle = '#e8d3ad';
  ctx.fillRect(11.5, 28 + bob, 9, 3.2);
  rr(ctx, 12, 25 + bob, 8, 5, 2, pal.overall, outline);
  // Arms.
  for (const side of [-1, 1]) {
    const lift = (p.jump || p.cheer) ? -5 : 0;
    limb(ctx, cx + side * 5, 22 + bob, cx + side * 9, 27 + bob + lift, '#f4e3c1', 3);
    hand(ctx, cx + side * 9, 27 + bob + lift, pal, '#f4e3c1');
  }
  // Mushroom cap.
  ctx.beginPath(); ctx.ellipse(cx, 11 + bob, 13, 9, 0, Math.PI, 0); ctx.closePath();
  ctx.fillStyle = pal.hat; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.2)';
  ctx.beginPath(); ctx.ellipse(cx - 4, 7 + bob, 5, 2.4, -0.2, 0, Math.PI * 2); ctx.fill();
  for (const [dx, dy, r] of [[-7, 8, 3], [5, 5, 2.4], [8, 10, 2.2], [-2, 13, 2]]) {
    ctx.fillStyle = '#fff4d6';
    ctx.beginPath(); ctx.arc(cx + dx, dy + bob, r, 0, Math.PI * 2); ctx.fill();
  }
  // Face.
  if (p.die) {
    limb(ctx, cx - 3, 22 + bob, cx - 0.5, 24.5 + bob, '#222', 0.8);
    limb(ctx, cx - 0.5, 22 + bob, cx - 3, 24.5 + bob, '#222', 0.8);
    limb(ctx, cx + 1, 22 + bob, cx + 3.5, 24.5 + bob, '#222', 0.8);
    limb(ctx, cx + 3.5, 22 + bob, cx + 1, 24.5 + bob, '#222', 0.8);
  } else {
    for (const dx of [-2.4, 2.4]) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx + dx, 22 + bob, 1.7, 2.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1210';
      ctx.beginPath(); ctx.arc(cx + dx + 0.2, 22.4 + bob, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#8a4a2a'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(cx, 26 + bob, 1.7, 0.2, Math.PI - 0.2); ctx.stroke();
  }
  ctx.restore();
}

function drawCactusRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#1f3d2a';
  const cx = 16;
  const bob = p.bob;
  const green = pal.shirt;
  ctx.save();
  ctx.translate(ox, 0);

  // Legs.
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.6;
    limb(ctx, cx + side * 2, 31 + bob, footX, 37, pal.overall, 3);
    shoeShape(ctx, footX - 4.5, 37, pal);
  }
  // Body and arms.
  rr(ctx, 12, 13 + bob, 8, 20, 4, green, outline);
  ctx.fillStyle = shade(green, 1.18);
  ctx.fillRect(13, 15 + bob, 1.8, 15);
  for (const side of [-1, 1]) {
    const lift = (p.jump || p.cheer) ? -5 : 0;
    limb(ctx, cx + side * 4, 21 + bob, cx + side * 10, 24 + bob + lift, pal.overall, 2.8);
    limb(ctx, cx + side * 10, 24 + bob + lift, cx + side * 10, 19 + bob + lift, pal.overall, 2.8);
  }
  // Spikes.
  ctx.fillStyle = '#fff4d6';
  for (let i = 0; i < 7; i++) {
    const x = i < 4 ? 11.5 : 20.5;
    const y = 16 + (i % 4) * 4 + bob;
    ctx.beginPath(); ctx.moveTo(x, y + 2); ctx.lineTo(x - 2, y); ctx.lineTo(x, y - 2); ctx.closePath(); ctx.fill();
  }
  // Flower.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.fillStyle = i % 2 ? '#ff8fb1' : '#ffb3c7';
    ctx.beginPath(); ctx.ellipse(cx + Math.cos(a) * 5, 9 + Math.sin(a) * 4 + bob, 3.2, 2.2, a, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = pal.skin;
  ctx.beginPath(); ctx.arc(cx, 9 + bob, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 0.7; ctx.stroke();
  // Face.
  if (p.die) {
    limb(ctx, cx - 3, 19 + bob, cx - 0.5, 21.5 + bob, '#222', 0.8);
    limb(ctx, cx - 0.5, 19 + bob, cx - 3, 21.5 + bob, '#222', 0.8);
    limb(ctx, cx + 1, 19 + bob, cx + 3.5, 21.5 + bob, '#222', 0.8);
    limb(ctx, cx + 3.5, 19 + bob, cx + 1, 21.5 + bob, '#222', 0.8);
  } else {
    for (const dx of [-2.4, 2.4]) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx + dx, 19 + bob, 1.7, 2.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1210';
      ctx.beginPath(); ctx.arc(cx + dx + 0.2, 19.4 + bob, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#1f3d2a'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(cx, 23 + bob, 1.7, 0.2, Math.PI - 0.2); ctx.stroke();
  }
  ctx.restore();
}

function drawPlanetRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#1f4a52';
  const cx = 16;
  const cy = 21 + p.bob;
  ctx.save();
  ctx.translate(ox, 0);

  // Ring (behind).
  ctx.save();
  ctx.translate(cx, cy + 2);
  ctx.rotate(-0.28);
  ctx.beginPath(); ctx.ellipse(0, 0, 15, 4.5, 0, 0, Math.PI * 2);
  ctx.strokeStyle = pal.hat; ctx.lineWidth = 3.2; ctx.stroke();
  ctx.strokeStyle = shade(pal.hat, 1.25); ctx.lineWidth = 1; ctx.stroke();
  ctx.restore();

  // Planet body.
  const grad = ctx.createRadialGradient(cx - 5, cy - 6, 3, cx, cy, 13);
  grad.addColorStop(0, shade(pal.shirt, 1.2));
  grad.addColorStop(0.65, pal.shirt);
  grad.addColorStop(1, shade(pal.shirt, 0.72));
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, 12.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 1; ctx.stroke();

  // Craters.
  for (const [dx, dy, r] of [[-6, 4, 2.2], [6, -6, 1.8], [4, 6, 2.4], [-3, -5, 1.3]]) {
    ctx.beginPath(); ctx.arc(cx + dx, cy + dy, r, 0, Math.PI * 2);
    ctx.fillStyle = shade(pal.overall, 1.1); ctx.fill();
    ctx.strokeStyle = shade(pal.overall, 0.8); ctx.lineWidth = 0.5; ctx.stroke();
  }

  // Face.
  if (p.die) {
    limb(ctx, cx - 4, cy - 2, cx - 1, cy + 1, '#222', 0.8);
    limb(ctx, cx - 1, cy - 2, cx - 4, cy + 1, '#222', 0.8);
    limb(ctx, cx + 1, cy - 2, cx + 4, cy + 1, '#222', 0.8);
    limb(ctx, cx + 4, cy - 2, cx + 1, cy + 1, '#222', 0.8);
  } else {
    for (const dx of [-3, 3]) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx + dx, cy - 1, 1.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1210';
      ctx.beginPath(); ctx.arc(cx + dx + 0.2, cy - 0.6, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#1f4a52'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(cx, cy + 3, 2, 0.2, Math.PI - 0.2); ctx.stroke();
  }

  // Ring (front half).
  ctx.save();
  ctx.translate(cx, cy + 2);
  ctx.rotate(-0.28);
  ctx.beginPath(); ctx.ellipse(0, 0, 15, 4.5, 0, 0, Math.PI);
  ctx.strokeStyle = pal.hat; ctx.lineWidth = 3.2; ctx.stroke();
  ctx.restore();

  // Legs.
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.5;
    limb(ctx, cx + side * 2, cy + 11, footX, 37, pal.overall, 2.8);
    shoeShape(ctx, footX - 4.5, 37, pal);
  }
  ctx.restore();
}

function drawRobotRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#26303a';
  const cx = 16;
  const bob = p.bob;
  const metal = pal.hat;
  const metalLight = shade(pal.hat, 1.25);
  const metalDark = shade(pal.hat, 0.7);
  ctx.save();
  ctx.translate(ox, 0);

  // Legs.
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.55;
    limb(ctx, cx + side * 3, 31 + bob, footX, 36, metalDark, 3.2);
    rr(ctx, footX - 4.5, 36, 9.4, 4, 1.5, pal.shoe, outline);
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.fillRect(footX - 3.5, 36.6, 5.2, 0.8);
  }
  // Body.
  rr(ctx, 9.5, 19 + bob, 13, 13, 3, metal, outline);
  rr(ctx, 10.5, 20 + bob, 11, 2, 1, metalLight);
  ctx.fillStyle = metalDark;
  ctx.fillRect(10, 29 + bob, 12, 2.5);
  // Chest light.
  ctx.beginPath(); ctx.arc(16, 26 + bob, 3.2, 0, Math.PI * 2);
  ctx.fillStyle = pal.hair; ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 0.6; ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(15.2, 25.2 + bob, 0.9, 0, Math.PI * 2); ctx.fill();
  // Arms.
  for (const side of [-1, 1]) {
    const lift = (p.jump || p.cheer) ? -5 : 0;
    limb(ctx, cx + side * 6, 21 + bob, cx + side * 11, 27 + bob + lift, metalDark, 2.8);
    ctx.beginPath(); ctx.arc(cx + side * 11, 27 + bob + lift, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = metalLight; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 0.7; ctx.stroke();
  }
  // Head.
  rr(ctx, 9, 7 + bob, 14, 11, 3, metalLight, outline);
  rr(ctx, 10.5, 8.5 + bob, 11, 7.5, 2, '#1b2a38', outline);
  // Antenna.
  ctx.strokeStyle = metalDark; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(cx, 7 + bob); ctx.lineTo(cx, 3 + bob); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, 2.5 + bob, 1.6, 0, Math.PI * 2);
  ctx.fillStyle = pal.hair; ctx.fill();
  // Face screen.
  if (p.die) {
    limb(ctx, cx - 4, 10 + bob, cx - 1, 13 + bob, pal.hair, 0.9);
    limb(ctx, cx - 1, 10 + bob, cx - 4, 13 + bob, pal.hair, 0.9);
    limb(ctx, cx + 1, 10 + bob, cx + 4, 13 + bob, pal.hair, 0.9);
    limb(ctx, cx + 4, 10 + bob, cx + 1, 13 + bob, pal.hair, 0.9);
  } else {
    for (const dx of [-3, 3]) {
      ctx.fillStyle = pal.hair;
      ctx.beginPath(); ctx.ellipse(cx + dx, 11 + bob, 1.8, 2.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx + dx + 0.4, 10.4 + bob, 0.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = pal.hair; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(cx, 14 + bob, 2, 0.2, Math.PI - 0.2); ctx.stroke();
  }
  // Bolt details.
  for (const [x, y] of [[10.5, 20.5], [21.5, 20.5], [10.5, 28.5], [21.5, 28.5]]) {
    ctx.beginPath(); ctx.arc(x, y + bob, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = metalDark; ctx.fill();
  }
  ctx.restore();
}

function drawCoffeeRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#2a150a';
  const cx = 16;
  const bob = p.bob;
  ctx.save();
  ctx.translate(ox, 0);

  // Legs.
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.55;
    limb(ctx, cx + side * 2, 32 + bob, footX, 38, pal.overall, 2.8);
    shoeShape(ctx, footX - 4.5, 38, pal);
  }
  // Bean body.
  const grad = ctx.createRadialGradient(cx - 4, 14 + bob, 3, cx, 22 + bob, 13);
  grad.addColorStop(0, shade(pal.shirt, 1.2));
  grad.addColorStop(0.65, pal.shirt);
  grad.addColorStop(1, pal.overall);
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.ellipse(cx, 21 + bob, 11.5, 13.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 1; ctx.stroke();
  // Center crease.
  ctx.strokeStyle = pal.hat; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(cx - 4, 10 + bob); ctx.quadraticCurveTo(cx + 3, 21 + bob, cx - 3, 33 + bob); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx - 6, 11 + bob); ctx.quadraticCurveTo(cx + 1, 21 + bob, cx - 5, 31 + bob); ctx.stroke();
  // Arms.
  for (const side of [-1, 1]) {
    const lift = (p.jump || p.cheer) ? -5 : 0;
    limb(ctx, cx + side * 7, 20 + bob, cx + side * 11, 25 + bob + lift, pal.hat, 2.6);
    hand(ctx, cx + side * 11, 25 + bob + lift, pal, pal.hat);
  }
  // Face.
  if (p.die) {
    limb(ctx, cx - 4, 18 + bob, cx - 1, 21 + bob, '#222', 0.8);
    limb(ctx, cx - 1, 18 + bob, cx - 4, 21 + bob, '#222', 0.8);
    limb(ctx, cx + 1, 18 + bob, cx + 4, 21 + bob, '#222', 0.8);
    limb(ctx, cx + 4, 18 + bob, cx + 1, 21 + bob, '#222', 0.8);
  } else {
    for (const dx of [-3, 3]) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx + dx, 18 + bob, 1.8, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1210';
      ctx.beginPath(); ctx.arc(cx + dx + 0.2, 18.4 + bob, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#2a150a'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(cx, 23 + bob, 2, 0.2, Math.PI - 0.2); ctx.stroke();
  }
  // Steam.
  ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1.1;
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    ctx.moveTo(cx - 3 + i * 6, 7 + bob);
    ctx.quadraticCurveTo(cx - 6 + i * 6, 3 + bob, cx - 3 + i * 6, 0 + bob);
    ctx.stroke();
  }
  ctx.restore();
}

function drawEagleRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#2a2418';
  const cx = 16;
  const bob = p.bob;
  const white = '#f8f9fa';
  const yellow = '#f4c430';
  const brown = '#8c5a2b';
  ctx.save();
  ctx.translate(ox, 0);

  // Talons.
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.55;
    limb(ctx, cx + side * 2, 32 + bob, footX, 37, yellow, 2.4);
    ctx.fillStyle = yellow;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.ellipse(footX - 2 + i * 2.2, 38, 1.2, 1.8, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  // Wings.
  for (const side of [-1, 1]) {
    const spread = (p.jump || p.fall) ? 8 : 3;
    ctx.beginPath();
    ctx.moveTo(cx + side * 5, 19 + bob);
    ctx.quadraticCurveTo(cx + side * (13 + spread), 15 + bob, cx + side * (12 + spread), 27 + bob);
    ctx.quadraticCurveTo(cx + side * 8, 24 + bob, cx + side * 5, 25 + bob);
    ctx.closePath();
    ctx.fillStyle = brown; ctx.fill();
    ctx.strokeStyle = outline; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(cx + side * 7, 20 + bob); ctx.lineTo(cx + side * (10 + spread), 23 + bob); ctx.stroke();
  }
  // Body.
  rr(ctx, 10, 19 + bob, 12, 14, 5, pal.overall, outline);
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  rr(ctx, 11, 20 + bob, 10, 3, 1.5, 'rgba(255,255,255,.18)');
  // Head.
  ctx.beginPath(); ctx.arc(cx, 11 + bob, 9, 0, Math.PI * 2);
  ctx.fillStyle = white; ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 0.9; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  ctx.beginPath(); ctx.arc(cx - 3, 8 + bob, 3.5, 0, Math.PI * 2); ctx.fill();
  // Beak.
  ctx.beginPath(); ctx.moveTo(cx + 7, 11 + bob); ctx.lineTo(cx + 13, 13 + bob); ctx.lineTo(cx + 8, 15 + bob); ctx.closePath();
  ctx.fillStyle = yellow; ctx.fill();
  ctx.strokeStyle = '#8a5a00'; ctx.lineWidth = 0.6; ctx.stroke();
  // Brow / eyes.
  if (p.die) {
    limb(ctx, cx - 4, 8 + bob, cx - 1, 11 + bob, '#222', 0.8);
    limb(ctx, cx - 1, 8 + bob, cx - 4, 11 + bob, '#222', 0.8);
    limb(ctx, cx + 1, 8 + bob, cx + 4, 11 + bob, '#222', 0.8);
    limb(ctx, cx + 4, 8 + bob, cx + 1, 11 + bob, '#222', 0.8);
  } else {
    for (const dx of [-3, 3]) {
      ctx.fillStyle = '#1d1210';
      ctx.beginPath(); ctx.ellipse(cx + dx, 10 + bob, 1.4, 1.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx + dx + 0.4, 9.4 + bob, 0.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#6b4a2a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - 5, 7 + bob); ctx.lineTo(cx - 1, 8 + bob); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 5, 7 + bob); ctx.lineTo(cx + 1, 8 + bob); ctx.stroke();
  }
  // Chest star.
  runnerStar(ctx, cx, 25 + bob, 2.6, 1.2, '#ffd166', '#8a5a00');
  ctx.restore();
}

function drawAxolotlRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#5a2a4a';
  const cx = 16;
  const bob = p.bob;
  const pink = pal.hat;
  const light = shade(pink, 1.2);
  ctx.save();
  ctx.translate(ox, 0);

  // Tail.
  ctx.strokeStyle = pal.overall; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx + 7, 28 + bob); ctx.quadraticCurveTo(cx + 16, 26 + bob, cx + 14 + p.swing * 0.5, 34 + bob); ctx.stroke();
  // Legs.
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.55;
    limb(ctx, cx + side * 2, 32 + bob, footX, 38, pink, 2.8);
    shoeShape(ctx, footX - 4.5, 38, pal);
  }
  // Body.
  rr(ctx, 10, 19 + bob, 12, 14, 5, pink, outline);
  ctx.fillStyle = light;
  rr(ctx, 11, 20 + bob, 8, 4, 2, light);
  // Arms.
  for (const side of [-1, 1]) {
    const lift = (p.jump || p.cheer) ? -5 : 0;
    limb(ctx, cx + side * 6, 22 + bob, cx + side * 10, 27 + bob + lift, pink, 2.6);
    ctx.beginPath(); ctx.arc(cx + side * 10, 27 + bob + lift, 2.3, 0, Math.PI * 2);
    ctx.fillStyle = light; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 0.7; ctx.stroke();
  }
  // Head.
  ctx.beginPath(); ctx.arc(cx, 11 + bob, 8.5, 0, Math.PI * 2);
  ctx.fillStyle = pink; ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 0.9; ctx.stroke();
  ctx.fillStyle = light;
  ctx.beginPath(); ctx.ellipse(cx, 14 + bob, 6, 3.2, 0, 0, Math.PI * 2); ctx.fill();
  // Gills.
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = pal.hair; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + side * 7, 8 + i * 3 + bob);
      ctx.quadraticCurveTo(cx + side * 12, 5 + i * 3 + bob, cx + side * 14, 8 + i * 3 + bob);
      ctx.stroke();
      ctx.fillStyle = shade(pal.hair, 1.1);
      ctx.beginPath(); ctx.arc(cx + side * 14, 8 + i * 3 + bob, 1.4, 0, Math.PI * 2); ctx.fill();
    }
  }
  // Face.
  if (p.die) {
    limb(ctx, cx - 4, 9 + bob, cx - 1, 12 + bob, '#222', 0.8);
    limb(ctx, cx - 1, 9 + bob, cx - 4, 12 + bob, '#222', 0.8);
    limb(ctx, cx + 1, 9 + bob, cx + 4, 12 + bob, '#222', 0.8);
    limb(ctx, cx + 4, 9 + bob, cx + 1, 12 + bob, '#222', 0.8);
  } else {
    for (const dx of [-3, 3]) {
      ctx.fillStyle = '#1d1210';
      ctx.beginPath(); ctx.ellipse(cx + dx, 11 + bob, 1.4, 1.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(cx + dx + 0.4, 10.4 + bob, 0.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = '#5a2a4a'; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(cx, 15 + bob, 1.6, 0.2, Math.PI - 0.2); ctx.stroke();
  }
  ctx.restore();
}

function drawHouseRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#3a2410';
  const cx = 16;
  const bob = p.bob;
  ctx.save();
  ctx.translate(ox, 0);

  // Legs.
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.55;
    limb(ctx, cx + side * 2, 33 + bob, footX, 38, '#c9a27a', 2.8);
    shoeShape(ctx, footX - 4.5, 38, pal);
  }
  // Wall body.
  rr(ctx, 9, 16 + bob, 14, 18, 3, pal.shirt, outline);
  ctx.fillStyle = 'rgba(255,255,255,.22)';
  ctx.fillRect(10, 17 + bob, 12, 2);
  ctx.fillStyle = shade(pal.shirt, 0.86);
  ctx.fillRect(10, 31 + bob, 12, 2);
  // Roof.
  ctx.beginPath();
  ctx.moveTo(5, 17 + bob); ctx.lineTo(cx, 4 + bob); ctx.lineTo(27, 17 + bob); ctx.closePath();
  ctx.fillStyle = pal.hat; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.2)';
  ctx.beginPath(); ctx.moveTo(8, 16 + bob); ctx.lineTo(cx, 6 + bob); ctx.lineTo(cx, 16 + bob); ctx.fill();
  // Door + windows.
  rr(ctx, 13, 24 + bob, 6, 10, 1.5, pal.overall, outline);
  ctx.fillStyle = '#ffd166';
  ctx.beginPath(); ctx.arc(17.5, 29 + bob, 0.8, 0, Math.PI * 2); ctx.fill();
  for (const dx of [-5, 5]) {
    rr(ctx, cx + dx - 2.5, 21 + bob, 5, 5, 1, pal.skin, outline);
    ctx.strokeStyle = pal.hair; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(cx + dx, 21.5 + bob); ctx.lineTo(cx + dx, 25.5 + bob); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + dx - 2, 23.5 + bob); ctx.lineTo(cx + dx + 2, 23.5 + bob); ctx.stroke();
  }
  // Chimney.
  rr(ctx, 21, 3 + bob, 4, 7, 1, pal.hair, outline);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.beginPath(); ctx.arc(24, 0.5 + bob, 1.6, 0, Math.PI * 2); ctx.fill();
  // Face.
  if (p.die) {
    limb(ctx, cx - 4, 19 + bob, cx - 1, 22 + bob, '#222', 0.8);
    limb(ctx, cx - 1, 19 + bob, cx - 4, 22 + bob, '#222', 0.8);
    limb(ctx, cx + 1, 19 + bob, cx + 4, 22 + bob, '#222', 0.8);
    limb(ctx, cx + 4, 19 + bob, cx + 1, 22 + bob, '#222', 0.8);
  } else {
    for (const dx of [-4, 4]) {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(cx + dx, 19 + bob, 1.8, 2.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1d1210';
      ctx.beginPath(); ctx.arc(cx + dx + 0.2, 19.4 + bob, 0.8, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

function drawCatrinaRunner(ctx, ox, look, frame) {
  const p = runnerPose(frame);
  const pal = look.palette;
  const outline = '#2a102a';
  const cx = 16;
  const bob = p.bob;
  const bone = '#f3e7d3';
  const dress = pal.hat;
  const accent = pal.overall;
  ctx.save();
  ctx.translate(ox, 0);

  // Dress / body.
  ctx.beginPath();
  ctx.moveTo(12, 20 + bob);
  ctx.lineTo(20, 20 + bob);
  ctx.lineTo(25, 36 + bob);
  ctx.quadraticCurveTo(cx, 39 + bob, 7, 36 + bob);
  ctx.closePath();
  ctx.fillStyle = dress; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.moveTo(11, 23 + bob); ctx.lineTo(21, 23 + bob); ctx.lineTo(22, 25 + bob); ctx.lineTo(10, 25 + bob); ctx.closePath(); ctx.fill();
  // Skirt hem.
  ctx.strokeStyle = accent; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(8, 35 + bob); ctx.quadraticCurveTo(cx, 38 + bob, 24, 35 + bob); ctx.stroke();
  // Legs/shoes.
  for (const side of [-1, 1]) {
    const footX = cx + side * 3 + p.swing * side * 0.55;
    limb(ctx, cx + side * 2, 35 + bob, footX, 38, bone, 1.8);
    shoeShape(ctx, footX - 4.5, 38, pal);
  }
  // Bone arms.
  for (const side of [-1, 1]) {
    const lift = (p.jump || p.cheer) ? -5 : 0;
    limb(ctx, cx + side * 6, 21 + bob, cx + side * 10, 26 + bob + lift, bone, 1.8);
    ctx.beginPath(); ctx.arc(cx + side * 10, 26 + bob + lift, 2.1, 0, Math.PI * 2);
    ctx.fillStyle = bone; ctx.fill(); ctx.strokeStyle = outline; ctx.lineWidth = 0.6; ctx.stroke();
  }
  // Skull head.
  ctx.beginPath(); ctx.arc(cx, 12 + bob, 8, 0, Math.PI * 2);
  ctx.fillStyle = bone; ctx.fill();
  ctx.strokeStyle = outline; ctx.lineWidth = 0.9; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.beginPath(); ctx.arc(cx - 3, 9 + bob, 3, 0, Math.PI * 2); ctx.fill();
  // Eye sockets / nose.
  if (p.die) {
    limb(ctx, cx - 4, 10 + bob, cx - 1, 13 + bob, '#222', 0.8);
    limb(ctx, cx - 1, 10 + bob, cx - 4, 13 + bob, '#222', 0.8);
    limb(ctx, cx + 1, 10 + bob, cx + 4, 13 + bob, '#222', 0.8);
    limb(ctx, cx + 4, 10 + bob, cx + 1, 13 + bob, '#222', 0.8);
  } else {
    for (const dx of [-3, 3]) {
      ctx.fillStyle = '#2a102a';
      ctx.beginPath(); ctx.ellipse(cx + dx, 11 + bob, 2.1, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(cx + dx + 0.4, 10.4 + bob, 0.7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#2a102a';
    ctx.beginPath(); ctx.moveTo(cx, 14 + bob); ctx.lineTo(cx - 1.3, 16 + bob); ctx.lineTo(cx + 1.3, 16 + bob); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#8a6a7a'; ctx.lineWidth = 0.6;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(cx + i * 1.5, 18 + bob); ctx.lineTo(cx + i * 1.5, 19.5 + bob); ctx.stroke();
    }
  }
  // Flower hat.
  rr(ctx, 6.5, 4 + bob, 19, 4, 2, dress, outline);
  ctx.fillStyle = 'rgba(255,255,255,.15)';
  ctx.fillRect(7.5, 4.6 + bob, 17, 0.8);
  for (const dx of [-5, 0, 5]) {
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.arc(cx + dx, 4 + bob, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(cx + dx, 4 + bob, 0.7, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawRunnerFrame(ctx, ox, look, frame) {
  switch (look.kind) {
    case 'flower': return drawFlowerRunner(ctx, ox, look, frame);
    case 'pine': return drawPineRunner(ctx, ox, look, frame);
    case 'cloud': return drawCloudRunner(ctx, ox, look, frame);
    case 'rocket': return drawRocketRunner(ctx, ox, look, frame);
    case 'mushroom': return drawMushroomRunner(ctx, ox, look, frame);
    case 'cactus': return drawCactusRunner(ctx, ox, look, frame);
    case 'planet': return drawPlanetRunner(ctx, ox, look, frame);
    case 'robot': return drawRobotRunner(ctx, ox, look, frame);
    case 'coffee': return drawCoffeeRunner(ctx, ox, look, frame);
    case 'eagle': return drawEagleRunner(ctx, ox, look, frame);
    case 'axolotl': return drawAxolotlRunner(ctx, ox, look, frame);
    case 'house': return drawHouseRunner(ctx, ox, look, frame);
    case 'catrina': return drawCatrinaRunner(ctx, ox, look, frame);
    default: return drawPlumberRunner(ctx, ox, look, frame);
  }
}

function generateRunnerFrames(look) {
  const canvas = document.createElement('canvas');
  canvas.width = RUNNER_FRAME_W * RUNNER_FRAMES;
  canvas.height = RUNNER_FRAME_H;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  for (let f = 0; f < RUNNER_FRAMES; f++) drawRunnerFrame(ctx, f * RUNNER_FRAME_W, look, f);
  return canvas;
}

function generateGoombaFrames() {
  const w = 30;
  const h = 30;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const step = f === 0 ? -1.5 : 1.5;

    // Feet.
    ctx.fillStyle = '#4a2814';
    ctx.beginPath(); ctx.ellipse(dx + 9 + step, 27, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 21 - step, 27, 6, 3, 0, 0, Math.PI * 2); ctx.fill();

    // Mushroom head.
    ctx.fillStyle = '#8a4a2a';
    ctx.beginPath(); ctx.arc(dx + 8, 13, 9, Math.PI, 0); ctx.arc(dx + 15, 10, 12, Math.PI, 0); ctx.arc(dx + 23, 13, 9, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = '#4a2814';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(dx + 15, 13, 14, Math.PI, 0); ctx.stroke();

    // Face.
    ctx.fillStyle = '#f0c090';
    ctx.beginPath(); ctx.ellipse(dx + 15, 17, 10, 8, 0, 0, Math.PI * 2); ctx.fill();

    // Eyes.
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(dx + 10.5, 13, 3.2, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 19.5, 13, 3.2, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1d1210';
    ctx.beginPath(); ctx.ellipse(dx + 11.5, 14, 1.5, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 18.5, 14, 1.5, 2, 0, 0, Math.PI * 2); ctx.fill();

    // Angry brows and fangs.
    ctx.strokeStyle = '#3a2010';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(dx + 7, 9); ctx.lineTo(dx + 13, 11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dx + 23, 9); ctx.lineTo(dx + 17, 11); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(dx + 10, 20); ctx.lineTo(dx + 12, 23); ctx.lineTo(dx + 14, 20); ctx.fill();
    ctx.beginPath(); ctx.moveTo(dx + 16, 20); ctx.lineTo(dx + 18, 23); ctx.lineTo(dx + 20, 20); ctx.fill();
  }

  return { key: 'goomba', canvas, frameWidth: w, frameHeight: h };
}

function generateKoopaFrames() {
  const w = 30;
  const h = 34;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const step = f === 0 ? -1.5 : 1.5;

    ctx.fillStyle = '#2f7d32';
    ctx.beginPath(); ctx.ellipse(dx + 9 + step, 31, 5.5, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 21 - step, 31, 5.5, 3, 0, 0, Math.PI * 2); ctx.fill();

    // Shell.
    ctx.fillStyle = '#f6edcf';
    ctx.beginPath(); ctx.ellipse(dx + 15, 22, 12.5, 10.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#43b44e';
    ctx.beginPath(); ctx.ellipse(dx + 15, 21, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#145a26';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.ellipse(dx + 15, 21, 10, 8, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dx + 7, 21); ctx.lineTo(dx + 23, 21); ctx.moveTo(dx + 15, 14); ctx.lineTo(dx + 15, 28); ctx.stroke();

    // Head.
    ctx.fillStyle = '#ffd25a';
    ctx.strokeStyle = '#7a4a00';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(dx + 15, 10, 8.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Eyes.
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(dx + 11.5, 8.5, 2.6, 3.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 18.5, 8.5, 2.6, 3.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1d1210';
    ctx.beginPath(); ctx.ellipse(dx + 11.8, 9.2, 1.2, 1.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 18.2, 9.2, 1.2, 1.7, 0, 0, Math.PI * 2); ctx.fill();

    // Snout + mouth.
    ctx.fillStyle = '#f2b840';
    ctx.beginPath(); ctx.ellipse(dx + 15, 14, 4.5, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7a4a00';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(dx + 15, 14.5, 2.2, 0.2, Math.PI - 0.2); ctx.stroke();
  }

  return { key: 'enemy-koopa', canvas, frameWidth: w, frameHeight: h };
}

function generateSpinyFrames() {
  const w = 30;
  const h = 30;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const step = f === 0 ? -1.5 : 1.5;

    ctx.fillStyle = '#3a1a10';
    ctx.beginPath(); ctx.ellipse(dx + 9 + step, 28, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 21 - step, 28, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

    // Spikes.
    ctx.fillStyle = '#fff8e7';
    const spikes = [
      [15, 1, 10, 11, 20, 11],
      [4, 6, 10, 14, 6, 17],
      [26, 6, 20, 14, 24, 17],
      [2, 18, 9, 19, 5, 24],
      [28, 18, 21, 19, 25, 24],
    ];
    for (const s of spikes) {
      ctx.beginPath();
      ctx.moveTo(dx + s[0], s[1]);
      ctx.lineTo(dx + s[2], s[3]);
      ctx.lineTo(dx + s[4], s[5]);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#7a4a00';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Body.
    ctx.fillStyle = '#e63946';
    ctx.beginPath(); ctx.ellipse(dx + 15, 18, 12, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#6b1a1a';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Face.
    ctx.fillStyle = '#ffd25a';
    ctx.beginPath(); ctx.ellipse(dx + 15, 20, 7, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(dx + 11.5, 17.5, 2.4, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 18.5, 17.5, 2.4, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1d1210';
    ctx.beginPath(); ctx.ellipse(dx + 11.8, 18.2, 1.1, 1.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 18.2, 18.2, 1.1, 1.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7a3a10';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(dx + 9, 15); ctx.lineTo(dx + 13, 16.5); ctx.moveTo(dx + 21, 15); ctx.lineTo(dx + 17, 16.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(dx + 15, 22.5, 2.4, 3.4, 6.0); ctx.stroke();
  }

  return { key: 'enemy-spiny', canvas, frameWidth: w, frameHeight: h };
}

function generateJumperFrames() {
  const w = 28;
  const h = 26;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const step = f === 0 ? -1 : 1;

    ctx.fillStyle = '#145a2a';
    ctx.beginPath(); ctx.ellipse(dx + 7 + step, 23, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 21 - step, 23, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

    // Body.
    ctx.fillStyle = '#5ad46a';
    ctx.beginPath(); ctx.ellipse(dx + 14, 17, 11, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#145a2a';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Eyes.
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(dx + 10, 10, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 18, 10, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#15251c';
    ctx.beginPath(); ctx.arc(dx + 11, 11, 1.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 17, 11, 1.8, 0, Math.PI * 2); ctx.fill();

    // Mouth + belly.
    ctx.strokeStyle = '#145a2a';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(dx + 14, 18, 4, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = '#a8f0a8';
    ctx.beginPath(); ctx.ellipse(dx + 14, 20, 6, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  }

  return { key: 'enemy-jumper', canvas, frameWidth: w, frameHeight: h };
}

function generateFlyerFrames() {
  const w = 34;
  const h = 26;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const wingY = f === 0 ? 6 : 13;

    // Wings.
    ctx.fillStyle = '#f4f4ff';
    ctx.strokeStyle = '#4a4a7a';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(dx + 7, wingY, 7, 4, -0.5, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(dx + 27, wingY, 7, 4, 0.5, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    // Body.
    ctx.fillStyle = '#5661d8';
    ctx.beginPath(); ctx.ellipse(dx + 17, 15, 9.5, 8.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#292f7a';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Face.
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(dx + 13.5, 12, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 20.5, 12, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1d1210';
    ctx.beginPath(); ctx.arc(dx + 14.2, 12.7, 1.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 19.8, 12.7, 1.3, 0, Math.PI * 2); ctx.fill();

    // Beak + feet.
    ctx.fillStyle = '#ffb703';
    ctx.beginPath(); ctx.moveTo(dx + 15, 16); ctx.lineTo(dx + 19, 16); ctx.lineTo(dx + 17, 19); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.ellipse(dx + 13, 23, 3, 1.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 21, 23, 3, 1.6, 0, 0, Math.PI * 2); ctx.fill();
  }

  return { key: 'enemy-flyer', canvas, frameWidth: w, frameHeight: h };
}

function generateOneUpTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  // Stem.
  ctx.fillStyle = '#f4e3c1';
  ctx.strokeStyle = '#4a331a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(10, 17, 12, 12, 4);
  ctx.fill();
  ctx.stroke();

  // Green cap.
  ctx.fillStyle = '#3fae4a';
  ctx.beginPath();
  ctx.arc(16, 15, 13, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#145a26';
  ctx.stroke();

  // Spots.
  ctx.fillStyle = '#fffdf0';
  ctx.beginPath(); ctx.arc(10, 10, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(21, 8, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(16, 14, 2, 0, Math.PI * 2); ctx.fill();

  // Face.
  ctx.fillStyle = '#2a1a10';
  ctx.beginPath(); ctx.arc(13, 22, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(19, 22, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#7a4a00';
  ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(16, 24, 2.5, 0.2, Math.PI - 0.2); ctx.stroke();

  // Feet.
  ctx.fillStyle = '#4a331a';
  ctx.beginPath(); ctx.ellipse(11, 29, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(21, 29, 4, 2, 0, 0, Math.PI * 2); ctx.fill();

  return canvas;
}

export function getEnemyTextureKey(type) {
  switch (type) {
    case 'koopa': return 'enemy-koopa';
    case 'spiny': return 'enemy-spiny';
    case 'jumper': return 'enemy-jumper';
    case 'flyer': return 'enemy-flyer';
    case 'toad': return 'enemy-toad';
    case 'fire': return 'enemy-fire';
    case 'spitter': return 'enemy-spitter';
    case 'penguin': return 'enemy-penguin';
    case 'gust': return 'enemy-gust';
    case 'ghost': return 'enemy-ghost';
    case 'blinky':
    case 'pinky':
    case 'inky':
    case 'clyde': return 'enemy-ghost';
    case 'fish': return 'enemy-fish';
    case 'jelly': return 'enemy-jelly';
    default: return 'goomba';
  }
}

function generateFireFrames() {
  const w = 30;
  const h = 34;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const sway = f ? 2 : -2;
    // Feet.
    ctx.fillStyle = '#8a2a08';
    ctx.beginPath(); ctx.ellipse(dx + 9, 32, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 21, 32, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

    // Outer flame.
    const grad = ctx.createLinearGradient(dx + 15, 2, dx + 15, 32);
    grad.addColorStop(0, '#fff36b');
    grad.addColorStop(0.42, '#ff9f1a');
    grad.addColorStop(1, '#e02d00');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(dx + 15, 1);
    ctx.quadraticCurveTo(dx + 28 + sway, 10, dx + 25, 22);
    ctx.quadraticCurveTo(dx + 24, 31, dx + 15, 31);
    ctx.quadraticCurveTo(dx + 6, 31, dx + 5, 22);
    ctx.quadraticCurveTo(dx + 2 + sway, 10, dx + 15, 1);
    ctx.fill();
    ctx.strokeStyle = '#8a2a08';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Inner flame.
    ctx.fillStyle = '#ffe066';
    ctx.beginPath();
    ctx.moveTo(dx + 15, 10);
    ctx.quadraticCurveTo(dx + 22, 17, dx + 18, 26);
    ctx.quadraticCurveTo(dx + 15, 30, dx + 12, 26);
    ctx.quadraticCurveTo(dx + 8, 17, dx + 15, 10);
    ctx.fill();

    // Eyes.
    ctx.fillStyle = '#2a0d06';
    ctx.beginPath(); ctx.ellipse(dx + 11, 21, 2.2, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 19, 21, 2.2, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(dx + 11.6, 20.2, 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 18.4, 20.2, 0.8, 0, Math.PI * 2); ctx.fill();

    // Angry brows.
    ctx.strokeStyle = '#4a1200';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(dx + 7, 17); ctx.lineTo(dx + 13, 18.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dx + 23, 17); ctx.lineTo(dx + 17, 18.5); ctx.stroke();
  }
  return { key: 'enemy-fire', canvas, frameWidth: w, frameHeight: h };
}

function generateSpitterFrames() {
  const w = 32;
  const h = 34;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const open = f === 1;

    // Feet.
    ctx.fillStyle = '#5a1a08';
    ctx.beginPath(); ctx.ellipse(dx + 10, 32, 5, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 22, 32, 5, 2.4, 0, 0, Math.PI * 2); ctx.fill();

    // Tail flame.
    ctx.fillStyle = '#ffb02e';
    ctx.beginPath();
    ctx.moveTo(dx + 25, 26);
    ctx.quadraticCurveTo(dx + 34, 20, dx + 29, 12);
    ctx.quadraticCurveTo(dx + 25, 20, dx + 25, 26);
    ctx.fill();

    // Round imp body.
    const grad = ctx.createLinearGradient(dx + 16, 5, dx + 16, 32);
    grad.addColorStop(0, '#ffb02e');
    grad.addColorStop(0.55, '#f05a10');
    grad.addColorStop(1, '#9a1d05');
    ctx.fillStyle = grad;
    ctx.strokeStyle = '#5a1a08';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(dx + 16, 20, 12, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Horns.
    ctx.fillStyle = '#5a1a08';
    ctx.beginPath(); ctx.moveTo(dx + 8, 10); ctx.lineTo(dx + 5, 2); ctx.lineTo(dx + 13, 8); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(dx + 24, 10); ctx.lineTo(dx + 27, 2); ctx.lineTo(dx + 19, 8); ctx.closePath(); ctx.fill();

    // Eyes.
    ctx.fillStyle = '#fff4c2';
    ctx.beginPath(); ctx.ellipse(dx + 11, 15, 3.2, 3.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 21, 15, 3.2, 3.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1d0b04';
    ctx.beginPath(); ctx.arc(dx + 12, 15, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 20, 15, 1.5, 0, Math.PI * 2); ctx.fill();

    // Mouth / fire glow.
    if (open) {
      ctx.fillStyle = '#ffdc6b';
      ctx.beginPath(); ctx.ellipse(dx + 16, 25, 6, 4.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff9e0';
      ctx.beginPath(); ctx.arc(dx + 16, 25, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#5a1a08';
      ctx.beginPath(); ctx.moveTo(dx + 12, 22); ctx.lineTo(dx + 14, 25); ctx.lineTo(dx + 16, 22); ctx.fill();
      ctx.beginPath(); ctx.moveTo(dx + 16, 22); ctx.lineTo(dx + 18, 25); ctx.lineTo(dx + 20, 22); ctx.fill();
    } else {
      ctx.strokeStyle = '#5a1a08';
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(dx + 16, 24, 4, 0.15, Math.PI - 0.15); ctx.stroke();
    }

    // Brow.
    ctx.strokeStyle = '#3a0d03';
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(dx + 7, 10); ctx.lineTo(dx + 14, 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dx + 25, 10); ctx.lineTo(dx + 18, 12); ctx.stroke();
  }
  return { key: 'enemy-spitter', canvas, frameWidth: w, frameHeight: h };
}

function generatePenguinFrames() {  const w = 30;
  const h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const step = f ? 1.5 : -1.5;
    ctx.fillStyle = '#f2a33a';
    ctx.beginPath(); ctx.ellipse(dx + 9 + step, 30, 5, 2.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 21 - step, 30, 5, 2.4, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#1d3557';
    ctx.beginPath(); ctx.ellipse(dx + 15, 21, 11, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f6fbff';
    ctx.beginPath(); ctx.ellipse(dx + 15, 23, 7.5, 8, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#2b4c7e';
    ctx.beginPath(); ctx.arc(dx + 15, 10, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f6fbff';
    ctx.beginPath(); ctx.ellipse(dx + 15, 13, 6, 5, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#111827';
    ctx.beginPath(); ctx.arc(dx + 11.5, 10, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 18.5, 10, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(dx + 12, 9.4, 0.7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 18, 9.4, 0.7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f2a33a';
    ctx.beginPath(); ctx.moveTo(dx + 12, 14); ctx.lineTo(dx + 18, 14); ctx.lineTo(dx + 15, 17); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8ad7ff';
    ctx.beginPath(); ctx.ellipse(dx + 24, 20, 3.5, 6, -0.5, 0, Math.PI * 2); ctx.fill();
  }
  return { key: 'enemy-penguin', canvas, frameWidth: w, frameHeight: h };
}

function generateGustFrames() {
  const w = 36;
  const h = 30;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const shift = f ? 2 : -2;
    ctx.fillStyle = 'rgba(180, 235, 255, 0.55)';
    ctx.beginPath(); ctx.arc(dx + 18, 15, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e8f8ff';
    ctx.strokeStyle = '#6bb8d8';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(dx + 13, 14, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(dx + 23, 12, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(dx + 18, 20, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#1d4f6e';
    ctx.beginPath(); ctx.ellipse(dx + 13, 14, 2.2, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 23, 13, 2.2, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1d4f6e';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(dx + 10, 9); ctx.lineTo(dx + 16, 11); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dx + 26, 8); ctx.lineTo(dx + 20, 10); ctx.stroke();

    ctx.strokeStyle = 'rgba(107, 184, 216, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(dx + 18 + shift, 26, 9, 0.15, Math.PI - 0.15);
    ctx.stroke();
  }
  return { key: 'enemy-gust', canvas, frameWidth: w, frameHeight: h };
}

function generateFishFrames() {
  const w = 36;
  const h = 26;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const tail = f ? 1 : -1;
    ctx.fillStyle = '#4cc9f0';
    ctx.strokeStyle = '#1d4f78';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(dx + 18, 13, 13, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#7ef9ff';
    ctx.beginPath(); ctx.moveTo(dx + 5, 13); ctx.lineTo(dx - 2 + tail * 2, 4); ctx.lineTo(dx - 1, 13); ctx.lineTo(dx - 2 + tail * 2, 22); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#b8f4ff';
    ctx.beginPath(); ctx.ellipse(dx + 24, 10, 5, 3, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1d3557';
    ctx.beginPath(); ctx.arc(dx + 28, 11, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(dx + 28.6, 10.4, 0.7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1d4f78';
    ctx.beginPath(); ctx.moveTo(dx + 16, 6); ctx.lineTo(dx + 21, 1); ctx.lineTo(dx + 23, 7); ctx.stroke();
  }
  return { key: 'enemy-fish', canvas, frameWidth: w, frameHeight: h };
}

function generateJellyFrames() {
  const w = 28;
  const h = 34;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const wave = f ? 2 : -2;
    ctx.fillStyle = 'rgba(209, 140, 255, 0.9)';
    ctx.strokeStyle = '#4b1f7a';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(dx + 14, 12, 11, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e9c8ff';
    ctx.beginPath(); ctx.arc(dx + 14, 10, 6, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#7c5cff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const x = dx + 6 + i * 5;
      ctx.beginPath();
      ctx.moveTo(x, 12);
      ctx.quadraticCurveTo(x + wave, 20, x - 1 + wave, 31);
      ctx.stroke();
    }
    ctx.fillStyle = '#2b1450';
    ctx.beginPath(); ctx.arc(dx + 11, 9, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 17, 9, 1.6, 0, Math.PI * 2); ctx.fill();
  }
  return { key: 'enemy-jelly', canvas, frameWidth: w, frameHeight: h };
}

function generateGhostFrames() {  const w = 32;
  const h = 34;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const wobble = f ? 2 : -2;
    ctx.fillStyle = 'rgba(142, 102, 255, 0.92)';
    ctx.strokeStyle = '#3f1f74';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(dx + 5, 17);
    ctx.quadraticCurveTo(dx + 5, 3, dx + 16, 3);
    ctx.quadraticCurveTo(dx + 27, 3, dx + 27, 17);
    ctx.lineTo(dx + 27, 27);
    ctx.quadraticCurveTo(dx + 24, 23 + wobble, dx + 21, 28);
    ctx.quadraticCurveTo(dx + 18, 23 - wobble, dx + 15, 28);
    ctx.quadraticCurveTo(dx + 12, 23 + wobble, dx + 9, 28);
    ctx.quadraticCurveTo(dx + 5, 23 - wobble, dx + 5, 27);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#f4ecff';
    ctx.beginPath(); ctx.ellipse(dx + 12, 15, 3.3, 4.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 20, 15, 3.3, 4.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2b1450';
    ctx.beginPath(); ctx.arc(dx + 12.5, 15.6, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 19.5, 15.6, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c9b8ff';
    ctx.beginPath(); ctx.arc(dx + 16, 22, 2.4, 0.2, Math.PI - 0.2); ctx.fill();
  }
  return { key: 'enemy-ghost', canvas, frameWidth: w, frameHeight: h };
}

function generateIceTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 16);
  grad.addColorStop(0, 'rgba(225, 250, 255, 0.95)');
  grad.addColorStop(0.35, 'rgba(126, 223, 255, 0.85)');
  grad.addColorStop(1, 'rgba(76, 165, 220, 0.75)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 16);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(2, 5); ctx.lineTo(11, 3); ctx.lineTo(17, 7); ctx.lineTo(29, 4);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.moveTo(6, 12); ctx.lineTo(14, 9); ctx.lineTo(23, 13);
  ctx.stroke();
  return canvas;
}

function generateNeonGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = 'rgba(76, 201, 240, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 64, 64);
  ctx.strokeStyle = 'rgba(255, 110, 180, 0.22)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 32); ctx.lineTo(64, 32);
  ctx.moveTo(32, 0); ctx.lineTo(32, 64);
  ctx.stroke();
  ctx.fillStyle = 'rgba(76, 201, 240, 0.55)';
  ctx.beginPath(); ctx.arc(32, 32, 2.5, 0, Math.PI * 2); ctx.fill();
  return canvas;
}

function generateLavaTexture() {  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 24;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 24);
  grad.addColorStop(0, '#ffb02e');
  grad.addColorStop(0.32, '#ff5a00');
  grad.addColorStop(1, '#8a1000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 24);
  ctx.fillStyle = 'rgba(255, 230, 120, 0.9)';
  for (let x = 0; x < 32; x += 8) {
    ctx.beginPath();
    ctx.ellipse(x + 4, 3 + ((x / 8) % 2) * 2, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(120, 10, 0, 0.35)';
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.quadraticCurveTo(8, 13, 16, 18);
  ctx.quadraticCurveTo(24, 23, 32, 17);
  ctx.lineTo(32, 24); ctx.lineTo(0, 24); ctx.closePath(); ctx.fill();
  return canvas;
}

export function getBossTextureKey(theme) {
  return `boss-${theme}`;
}

function generateToadFrames() {
  const w = 30;
  const h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    const step = f === 0 ? -1.5 : 1.5;

    // Feet.
    ctx.fillStyle = '#2f4d8f';
    ctx.beginPath(); ctx.ellipse(dx + 9 + step, 30, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 21 - step, 30, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

    // Toad body and vest.
    ctx.fillStyle = '#f5f0e1';
    ctx.beginPath(); ctx.ellipse(dx + 15, 24, 8, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3a6ed8';
    ctx.beginPath(); ctx.roundRect(dx + 8, 19, 14, 11, 4); ctx.fill();
    ctx.fillStyle = '#f5f0e1';
    ctx.beginPath(); ctx.arc(dx + 15, 23, 3.4, 0, Math.PI * 2); ctx.fill();

    // Mushroom cap.
    ctx.fillStyle = '#fffdf4';
    ctx.beginPath(); ctx.arc(dx + 15, 11, 13, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#c9bfa8';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(dx + 15, 11, 13, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = '#e84a5f';
    ctx.beginPath(); ctx.arc(dx + 7, 7, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 18, 3.5, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(dx + 24, 9, 3, 0, Math.PI * 2); ctx.fill();

    // Face.
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(dx + 11, 13, 2.8, 3.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 19, 13, 2.8, 3.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1d1210';
    ctx.beginPath(); ctx.ellipse(dx + 11.4, 13.6, 1.2, 1.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(dx + 18.6, 13.6, 1.2, 1.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7a4a00';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(dx + 15, 18, 2.2, 0.2, Math.PI - 0.2); ctx.stroke();
  }

  return { key: 'enemy-toad', canvas, frameWidth: w, frameHeight: h };
}

function drawPeachBoss(ctx, dx, f) {
  const bob = f ? -1 : 1;
  // Parasol behind her.
  ctx.save();
  ctx.translate(dx + 63, 16 + bob);
  ctx.rotate(f ? 0.14 : -0.06);
  ctx.fillStyle = '#ff7eb6';
  ctx.strokeStyle = '#a4286a';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, 25, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffd1e4';
  for (let i = 0; i < 4; i++) {
    const a = Math.PI + 0.28 + i * 0.62;
    ctx.beginPath(); ctx.arc(Math.cos(a) * 15, Math.sin(a) * 15, 3.4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = '#d8a05a';
  ctx.lineWidth = 2.3;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 38); ctx.stroke();
  ctx.restore();

  // Gown.
  ctx.fillStyle = '#ff9ec7';
  ctx.strokeStyle = '#a4286a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(dx + 30, 46);
  ctx.quadraticCurveTo(dx + 12, 60, dx + 8, 86);
  ctx.quadraticCurveTo(dx + 40, 94, dx + 72, 86);
  ctx.quadraticCurveTo(dx + 68, 60, dx + 50, 46);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffd1e4';
  ctx.beginPath(); ctx.ellipse(dx + 40, 72, 17, 6, 0, 0, Math.PI * 2); ctx.fill();

  // Torso and gloves.
  ctx.fillStyle = '#ff9ec7';
  ctx.beginPath(); ctx.roundRect(dx + 31, 38, 18, 16, 5); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(dx + 27, 48, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(dx + 53, 48, 5, 0, Math.PI * 2); ctx.fill();

  // Neck and head.
  ctx.fillStyle = '#ffd9b8';
  ctx.fillRect(dx + 36, 34, 8, 6);
  ctx.beginPath(); ctx.arc(dx + 40, 26, 18, 0, Math.PI * 2); ctx.fill();

  // Hair and crown.
  ctx.fillStyle = '#f6cf3f';
  ctx.beginPath(); ctx.arc(dx + 40, 22, 20, Math.PI * 0.92, Math.PI * 2.08); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 22, 27, 5, 12, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 58, 27, 5, 12, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd700';
  ctx.strokeStyle = '#a86b00';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(dx + 30, 10); ctx.lineTo(dx + 35, 1); ctx.lineTo(dx + 40, 8);
  ctx.lineTo(dx + 45, 1); ctx.lineTo(dx + 50, 10); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#4cc9f0';
  ctx.beginPath(); ctx.arc(dx + 40, 8, 2, 0, Math.PI * 2); ctx.fill();

  // Angry royal face.
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(dx + 34, 26, 4.2, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 46, 26, 4.2, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4cc9f0';
  ctx.beginPath(); ctx.ellipse(dx + 34.6, 26.4, 2.2, 2.9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 45.4, 26.4, 2.2, 2.9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#8a4a00';
  ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.moveTo(dx + 30, 19); ctx.lineTo(dx + 37, 21); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx + 50, 19); ctx.lineTo(dx + 43, 21); ctx.stroke();
  ctx.strokeStyle = '#a4286a';
  ctx.beginPath(); ctx.arc(dx + 40, 34, 4.2, 0.15, Math.PI - 0.15); ctx.stroke();
  ctx.fillStyle = '#4cc9f0';
  ctx.beginPath(); ctx.arc(dx + 21, 30, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(dx + 59, 30, 2.2, 0, Math.PI * 2); ctx.fill();

  // Turnip in the free hand.
  ctx.fillStyle = '#f3f0ff';
  ctx.strokeStyle = '#7e5aa8';
  ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.ellipse(dx + 58, 55, 7, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#6dbb4a';
  ctx.beginPath(); ctx.ellipse(dx + 55, 46, 3, 6, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 61, 46, 3, 6, 0.5, 0, Math.PI * 2); ctx.fill();
}

function drawCrystalSerpent(ctx, dx, f) {
  const sway = f ? 5 : -5;
  // Coiled tail.
  ctx.strokeStyle = '#5b3aa8';
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(dx + 10, 68);
  ctx.bezierCurveTo(dx + 28, 78, dx + 66, 48, dx + 58 + sway, 28);
  ctx.stroke();
  ctx.strokeStyle = '#b79cff';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(dx + 14, 70);
  ctx.bezierCurveTo(dx + 30, 76, dx + 62, 49, dx + 55 + sway, 31);
  ctx.stroke();

  // Back crystals.
  for (let i = 0; i < 4; i++) {
    const x = dx + 36 + i * 11;
    const y = 48 - i * 5 + (f ? 2 : 0);
    ctx.fillStyle = i % 2 ? '#7ef9ff' : '#d7b8ff';
    ctx.strokeStyle = '#3a1e6e';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(x, y + 8); ctx.lineTo(x + 5, y - 9); ctx.lineTo(x + 10, y + 8);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  // Head.
  ctx.fillStyle = '#7d55d6';
  ctx.strokeStyle = '#31155e';
  ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.ellipse(dx + 78, 26 + (f ? -2 : 0), 25, 17, -0.18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#b79cff';
  ctx.beginPath(); ctx.ellipse(dx + 79, 33 + (f ? -2 : 0), 18, 8, -0.12, 0, Math.PI * 2); ctx.fill();

  // Crystal crest.
  ctx.fillStyle = '#7ef9ff';
  ctx.strokeStyle = '#1d4f78';
  ctx.beginPath();
  ctx.moveTo(dx + 66, 12); ctx.lineTo(dx + 71, -6); ctx.lineTo(dx + 78, 10);
  ctx.lineTo(dx + 85, -9); ctx.lineTo(dx + 91, 10); ctx.closePath(); ctx.fill(); ctx.stroke();

  // Eyes and fangs.
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(dx + 76, 21, 5, 5.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff4f7a';
  ctx.beginPath(); ctx.ellipse(dx + 78, 21, 2.2, 4.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(dx + 87, 36); ctx.lineTo(dx + 90, 44); ctx.lineTo(dx + 94, 36); ctx.fill();
  ctx.fillStyle = '#ff4f7a';
  ctx.beginPath(); ctx.moveTo(dx + 99, 30); ctx.lineTo(dx + 111, 36); ctx.lineTo(dx + 99, 37); ctx.fill();
}

function drawStormDjinn(ctx, dx, f) {
  const bob = f ? -3 : 2;
  // Storm aura.
  ctx.fillStyle = 'rgba(89, 194, 255, 0.20)';
  ctx.beginPath(); ctx.arc(dx + 58, 46 + bob, 36, 0, Math.PI * 2); ctx.fill();

  // Cloud body.
  const puffs = [
    [36, 48, 20], [58, 58, 26], [82, 46, 22], [50, 38, 24], [72, 34, 18],
  ];
  ctx.fillStyle = '#39527a';
  ctx.strokeStyle = '#182a46';
  ctx.lineWidth = 2;
  for (const [x, y, r] of puffs) {
    ctx.beginPath(); ctx.arc(dx + x, y + bob, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = '#6c86ad';
  for (const [x, y, r] of puffs) {
    ctx.beginPath(); ctx.arc(dx + x - 2, y + bob - 4, r * 0.62, 0, Math.PI * 2); ctx.fill();
  }

  // Angry eyes.
  ctx.fillStyle = '#e9fbff';
  ctx.beginPath(); ctx.ellipse(dx + 45, 43 + bob, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 69, 43 + bob, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#119dff';
  ctx.beginPath(); ctx.arc(dx + 47, 44 + bob, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(dx + 67, 44 + bob, 3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d9f6ff';
  ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(dx + 37, 35 + bob); ctx.lineTo(dx + 52, 38 + bob); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx + 79, 35 + bob); ctx.lineTo(dx + 64, 38 + bob); ctx.stroke();

  // Lightning trident.
  ctx.fillStyle = '#ffe066';
  ctx.strokeStyle = '#a86b00';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(dx + 83, 60 + bob); ctx.lineTo(dx + 94, 43 + bob); ctx.lineTo(dx + 96, 55 + bob);
  ctx.lineTo(dx + 106, 38 + bob); ctx.lineTo(dx + 110, 58 + bob); ctx.lineTo(dx + 100, 58 + bob);
  ctx.lineTo(dx + 99, 72 + bob); ctx.lineTo(dx + 89, 62 + bob); ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Wind swirls.
  ctx.strokeStyle = 'rgba(159, 225, 255, 0.8)';
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(dx + 30 + i * 6, 70 + i * 3 + bob, 12 + i * 4, 0.2, Math.PI * 1.2);
    ctx.stroke();
  }
}

function drawKai(ctx, dx, f) {
  const bob = f ? -2 : 1;
  const auraAlpha = f ? 0.20 : 0.12;
  // Ki aura.
  ctx.fillStyle = `rgba(255, 194, 61, ${auraAlpha})`;
  ctx.beginPath(); ctx.ellipse(dx + 56, 64 + bob, 43, 57, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = `rgba(108, 226, 255, ${auraAlpha * 0.85})`;
  ctx.beginPath(); ctx.ellipse(dx + 56, 58 + bob, 31, 49, 0, 0, Math.PI * 2); ctx.fill();

  // Boots.
  ctx.fillStyle = '#234a9e';
  ctx.strokeStyle = '#0f2352';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(dx + 30, 98 + bob, 19, 18, 5); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(dx + 62, 98 + bob, 19, 18, 5); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(dx + 30, 111 + bob, 19, 3);
  ctx.fillRect(dx + 62, 111 + bob, 19, 3);

  // Gi pants.
  ctx.fillStyle = '#ff8c1a';
  ctx.strokeStyle = '#a84a00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(dx + 33, 68 + bob);
  ctx.quadraticCurveTo(dx + 26, 88, dx + 29, 100 + bob);
  ctx.lineTo(dx + 51, 100 + bob);
  ctx.quadraticCurveTo(dx + 51, 86, dx + 55, 70 + bob);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(dx + 57, 70 + bob);
  ctx.quadraticCurveTo(dx + 61, 86, dx + 61, 100 + bob);
  ctx.lineTo(dx + 83, 100 + bob);
  ctx.quadraticCurveTo(dx + 86, 88, dx + 79, 68 + bob);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Torso gi.
  ctx.fillStyle = '#ff9f2e';
  ctx.beginPath();
  ctx.moveTo(dx + 33, 42 + bob);
  ctx.quadraticCurveTo(dx + 56, 35 + bob, dx + 79, 42 + bob);
  ctx.lineTo(dx + 76, 72 + bob);
  ctx.lineTo(dx + 36, 72 + bob);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Blue undershirt and belt.
  ctx.fillStyle = '#2557b8';
  ctx.beginPath();
  ctx.moveTo(dx + 44, 40 + bob);
  ctx.lineTo(dx + 56, 62 + bob);
  ctx.lineTo(dx + 68, 40 + bob);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1f4fa8';
  ctx.beginPath(); ctx.roundRect(dx + 35, 66 + bob, 41, 9, 3); ctx.fill();
  ctx.strokeStyle = '#0e2d68';
  ctx.beginPath(); ctx.moveTo(dx + 54, 67 + bob); ctx.lineTo(dx + 48, 82 + bob); ctx.stroke();

  // Arms and wristbands.
  ctx.strokeStyle = '#ff9f2e';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(dx + 36, 46 + bob); ctx.lineTo(dx + 24, 59 + bob); ctx.lineTo(dx + 42, 67 + bob); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx + 76, 46 + bob); ctx.lineTo(dx + 88, 58 + bob); ctx.lineTo(dx + 70, 67 + bob); ctx.stroke();
  ctx.strokeStyle = '#2557b8';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(dx + 27, 62 + bob); ctx.lineTo(dx + 35, 65 + bob); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx + 85, 60 + bob); ctx.lineTo(dx + 77, 64 + bob); ctx.stroke();

  // Head.
  ctx.fillStyle = '#ffd9b8';
  ctx.beginPath(); ctx.arc(dx + 56, 27 + bob, 19, 0, Math.PI * 2); ctx.fill();

  // Spiky hair.
  ctx.fillStyle = '#17121f';
  const spikes = [
    [-20, -10], [-14, -28], [-6, -16], [2, -34], [9, -16], [20, -30], [21, -8], [30, -14],
  ];
  ctx.beginPath();
  ctx.moveTo(dx + 38, 22 + bob);
  for (const [sx, sy] of spikes) ctx.lineTo(dx + 56 + sx, 22 + bob + sy);
  ctx.lineTo(dx + 74, 22 + bob);
  ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(dx + 56, 20 + bob, 17, Math.PI, 0); ctx.fill();

  // Face.
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(dx + 49, 27 + bob, 4.6, 3.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 63, 27 + bob, 4.6, 3.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1d1210';
  ctx.beginPath(); ctx.arc(dx + 50, 27 + bob, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(dx + 62, 27 + bob, 2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#3a2010';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(dx + 44, 20 + bob); ctx.lineTo(dx + 52, 22 + bob); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx + 68, 20 + bob); ctx.lineTo(dx + 60, 22 + bob); ctx.stroke();
  ctx.strokeStyle = '#8a4a00';
  ctx.beginPath(); ctx.arc(dx + 56, 32 + bob, 5, 0.18, Math.PI - 0.18); ctx.stroke();

  // Gi emblem.
  ctx.fillStyle = '#fff8e7';
  ctx.beginPath(); ctx.arc(dx + 42, 51 + bob, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a84a00';
  ctx.font = 'bold 7px Arial';
  ctx.fillText('気', dx + 38.5, 54 + bob);
}

function drawGluttonBoss(ctx, dx, f) {
  const cx = dx + 52;
  const cy = 52;
  const bob = f ? -2 : 2;
  // Body.
  const grad = ctx.createRadialGradient(cx - 10, cy - 12, 8, cx, cy, 42);
  grad.addColorStop(0, '#fff59a');
  grad.addColorStop(0.55, '#ffd93d');
  grad.addColorStop(1, '#d99a00');
  ctx.fillStyle = grad;
  ctx.strokeStyle = '#7a4a00';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy + bob, 41, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Mouth wedge.
  const mouth = f ? 0.62 : 0.38;
  ctx.fillStyle = '#2a1200';
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy + bob);
  ctx.arc(cx, cy + bob, 38, -mouth, mouth);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ff8fa3';
  ctx.beginPath();
  ctx.moveTo(cx + 8, cy + bob - 24);
  ctx.lineTo(cx + 28, cy + bob - 12);
  ctx.lineTo(cx + 22, cy + bob + 12);
  ctx.closePath(); ctx.fill();

  // Eye.
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(cx - 15, cy - 22 + bob, 8, 10, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1d1210';
  ctx.beginPath(); ctx.arc(cx - 13, cy - 21 + bob, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(cx - 14, cy - 23 + bob, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#7a4a00';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx - 28, cy - 34 + bob); ctx.lineTo(cx - 8, cy - 28 + bob); ctx.stroke();

  // Arms and feet.
  ctx.fillStyle = '#ffd93d';
  ctx.strokeStyle = '#7a4a00';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(cx - 44, cy + 8 + bob, 10, 7, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx + 44, cy + 8 + bob, 10, 7, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#d99a00';
  ctx.beginPath(); ctx.ellipse(cx - 18, cy + 39 + bob, 11, 5, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 18, cy + 39 + bob, 11, 5, 0.2, 0, Math.PI * 2); ctx.fill();

  // Tiny ghost trail.
  ctx.fillStyle = 'rgba(255, 209, 102, 0.35)';
  ctx.beginPath(); ctx.arc(cx - 30, cy + 34, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx - 38, cy + 28, 3.5, 0, Math.PI * 2); ctx.fill();
}

function drawKuppaBoss(ctx, dx, f) {
  const bob = f ? -2 : 1;
  // Tail.
  ctx.fillStyle = '#5e8c3a';
  ctx.strokeStyle = '#2d4a1a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(dx + 86, 78 + bob);
  ctx.quadraticCurveTo(dx + 116, 70 + bob, dx + 110, 98 + bob);
  ctx.quadraticCurveTo(dx + 100, 84 + bob, dx + 86, 88 + bob);
  ctx.fill(); ctx.stroke();

  // Legs.
  ctx.fillStyle = '#d98a2b';
  ctx.beginPath(); ctx.roundRect(dx + 28, 82 + bob, 20, 20, 6); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(dx + 64, 82 + bob, 20, 20, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff4d6';
  ctx.beginPath(); ctx.ellipse(dx + 33, 102 + bob, 8, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 69, 102 + bob, 8, 4, 0, 0, Math.PI * 2); ctx.fill();

  // Shell.
  ctx.fillStyle = '#3f7a33';
  ctx.beginPath(); ctx.ellipse(dx + 64, 62 + bob, 38, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f4e7c4';
  ctx.beginPath(); ctx.ellipse(dx + 64, 63 + bob, 28, 21, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2d4a1a';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + 0.4;
    ctx.beginPath();
    ctx.moveTo(dx + 64, 63 + bob);
    ctx.lineTo(dx + 64 + Math.cos(a) * 26, 63 + bob + Math.sin(a) * 19);
    ctx.stroke();
  }
  // Spikes.
  ctx.fillStyle = '#fff4d6';
  for (let i = 0; i < 5; i++) {
    const x = dx + 34 + i * 15;
    const y = 38 - Math.sin((i / 4) * Math.PI) * 9 + bob;
    ctx.beginPath(); ctx.moveTo(x - 5, y + 8); ctx.lineTo(x, y - 8); ctx.lineTo(x + 5, y + 8); ctx.closePath(); ctx.fill();
  }

  // Body / belly.
  ctx.fillStyle = '#c97a25';
  ctx.beginPath(); ctx.ellipse(dx + 64, 60 + bob, 23, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffdca8';
  ctx.beginPath(); ctx.ellipse(dx + 62, 66 + bob, 13, 17, 0, 0, Math.PI * 2); ctx.fill();

  // Head.
  ctx.fillStyle = '#d98a2b';
  ctx.beginPath(); ctx.arc(dx + 64, 27 + bob, 25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  // Horns.
  ctx.fillStyle = '#fff4d6';
  ctx.beginPath(); ctx.moveTo(dx + 41, 16 + bob); ctx.lineTo(dx + 32, 0 + bob); ctx.lineTo(dx + 49, 10 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx + 87, 16 + bob); ctx.lineTo(dx + 96, 0 + bob); ctx.lineTo(dx + 79, 10 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
  // Hair.
  ctx.fillStyle = '#e84a2a';
  ctx.beginPath(); ctx.moveTo(dx + 45, 7 + bob); ctx.lineTo(dx + 52, -2 + bob); ctx.lineTo(dx + 57, 7 + bob); ctx.lineTo(dx + 64, -4 + bob); ctx.lineTo(dx + 71, 7 + bob); ctx.lineTo(dx + 76, -2 + bob); ctx.lineTo(dx + 83, 7 + bob); ctx.closePath(); ctx.fill();

  // Face.
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(dx + 53, 23 + bob, 6, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 75, 23 + bob, 6, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1d1210';
  ctx.beginPath(); ctx.arc(dx + 55, 24 + bob, 2.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(dx + 73, 24 + bob, 2.4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#5a2a08';
  ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(dx + 43, 15 + bob); ctx.lineTo(dx + 58, 18 + bob); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx + 85, 15 + bob); ctx.lineTo(dx + 70, 18 + bob); ctx.stroke();
  // Mouth.
  ctx.fillStyle = '#2a1200';
  ctx.beginPath(); ctx.ellipse(dx + 64, 39 + bob, 11, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff4d6';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.moveTo(dx + 55 + i * 6, 35 + bob); ctx.lineTo(dx + 58 + i * 6, 40 + bob); ctx.lineTo(dx + 61 + i * 6, 35 + bob); ctx.fill();
  }
}

function drawKrakenBoss(ctx, dx, f) {
  const bob = f ? -3 : 2;
  ctx.strokeStyle = '#3a1e6e';
  ctx.lineWidth = 3;
  // Tentacles.
  for (let i = 0; i < 5; i++) {
    const bx = dx + 20 + i * 19;
    const wave = Math.sin(i * 1.2 + (f ? 1.1 : 0)) * 8;
    ctx.fillStyle = i % 2 ? '#7c5cff' : '#5b3aa8';
    ctx.beginPath();
    ctx.moveTo(bx - 7, 58 + bob);
    ctx.quadraticCurveTo(bx + wave, 80 + bob, bx - 10 + wave, 96 + bob);
    ctx.quadraticCurveTo(bx + 2, 82 + bob, bx + 7, 58 + bob);
    ctx.fill(); ctx.stroke();
  }

  // Head.
  const grad = ctx.createLinearGradient(dx + 56, 4, dx + 56, 70);
  grad.addColorStop(0, '#b79cff');
  grad.addColorStop(0.6, '#7c5cff');
  grad.addColorStop(1, '#3a1e6e');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.ellipse(dx + 58, 37 + bob, 42, 36, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Head fins.
  ctx.fillStyle = '#4cc9f0';
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const x = dx + 58 + side * (32 + i * 2);
      const y = 18 + i * 12 + bob;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + side * 16, y - 6); ctx.lineTo(x + side * 6, y + 10); ctx.closePath(); ctx.fill();
    }
  }

  // Eyes.
  ctx.fillStyle = '#d9f6ff';
  ctx.beginPath(); ctx.ellipse(dx + 45, 32 + bob, 10, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 71, 32 + bob, 10, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff4f7a';
  ctx.beginPath(); ctx.ellipse(dx + 47, 33 + bob, 4, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + 69, 33 + bob, 4, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1d1210';
  ctx.beginPath(); ctx.arc(dx + 47, 32 + bob, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(dx + 69, 32 + bob, 2, 0, Math.PI * 2); ctx.fill();

  // Mouth.
  ctx.fillStyle = '#2a1200';
  ctx.beginPath(); ctx.ellipse(dx + 58, 54 + bob, 11, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff4d6';
  ctx.beginPath(); ctx.moveTo(dx + 52, 50 + bob); ctx.lineTo(dx + 55, 56 + bob); ctx.lineTo(dx + 58, 50 + bob); ctx.fill();
  ctx.beginPath(); ctx.moveTo(dx + 58, 50 + bob); ctx.lineTo(dx + 61, 56 + bob); ctx.lineTo(dx + 64, 50 + bob); ctx.fill();

  // Bubbles.
  ctx.fillStyle = 'rgba(126, 249, 255, 0.6)';
  ctx.beginPath(); ctx.arc(dx + 22, 55 + bob, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(dx + 14, 44 + bob, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(dx + 92, 58 + bob, 4, 0, Math.PI * 2); ctx.fill();
}

function generateBossFrames(theme) {
  const sizes = {
    grass: [96, 96],
    cave: [120, 80],
    sky: [120, 88],
    castle: [112, 128],
    pac: [104, 96],
    koopa: [120, 110],
    water: [120, 96],
  };
  const [w, h] = sizes[theme] || sizes.grass;
  const canvas = document.createElement('canvas');
  canvas.width = w * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  for (let f = 0; f < 2; f++) {
    const dx = f * w;
    if (theme === 'grass') drawPeachBoss(ctx, dx, f);
    else if (theme === 'cave') drawCrystalSerpent(ctx, dx, f);
    else if (theme === 'sky') drawStormDjinn(ctx, dx, f);
    else if (theme === 'pac') drawGluttonBoss(ctx, dx, f);
    else if (theme === 'koopa') drawKuppaBoss(ctx, dx, f);
    else if (theme === 'water') drawKrakenBoss(ctx, dx, f);
    else drawKai(ctx, dx, f);
  }
  return { key: getBossTextureKey(theme), canvas, frameWidth: w, frameHeight: h };
}

function generateBossProjectileTextures() {
  const result = {};

  const make = (key, w, h, draw) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    draw(ctx, w, h);
    result[key] = canvas;
  };

  make('boss-turnip', 22, 22, (ctx) => {
    ctx.fillStyle = '#f4f0ff';
    ctx.strokeStyle = '#7e5aa8';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(11, 14, 7, 7.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#6dbb4a';
    ctx.beginPath(); ctx.ellipse(7.5, 5, 3, 6, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(14, 4.5, 3, 6.5, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#c9a0ff';
    ctx.beginPath(); ctx.arc(8, 15, 1.5, 0, Math.PI * 2); ctx.fill();
  });

  make('boss-crystal', 18, 18, (ctx) => {
    ctx.fillStyle = '#7ef9ff';
    ctx.strokeStyle = '#1d4f78';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(9, 0); ctx.lineTo(17, 8); ctx.lineTo(10, 18); ctx.lineTo(1, 9);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e6ffff';
    ctx.beginPath(); ctx.moveTo(9, 2); ctx.lineTo(14, 8); ctx.lineTo(9, 13); ctx.closePath(); ctx.fill();
  });

  make('boss-bolt', 20, 34, (ctx) => {
    ctx.fillStyle = '#fff36b';
    ctx.strokeStyle = '#b56a00';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(12, 0); ctx.lineTo(2, 19); ctx.lineTo(9, 19); ctx.lineTo(5, 34);
    ctx.lineTo(19, 13); ctx.lineTo(11, 13); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(11, 3); ctx.lineTo(6, 15); ctx.lineTo(10, 15); ctx.closePath(); ctx.fill();
  });

  make('boss-ki', 20, 20, (ctx) => {
    const grad = ctx.createRadialGradient(10, 10, 1, 10, 10, 10);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.45, '#7ef9ff');
    grad.addColorStop(1, 'rgba(57, 133, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(10, 10, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e9ffff';
    ctx.beginPath(); ctx.arc(10, 10, 4, 0, Math.PI * 2); ctx.fill();
  });

  make('enemy-fireball', 20, 20, (ctx) => {
    const grad = ctx.createRadialGradient(10, 10, 1, 10, 10, 10);
    grad.addColorStop(0, '#fff6c2');
    grad.addColorStop(0.4, '#ffb02e');
    grad.addColorStop(0.75, '#ff4d00');
    grad.addColorStop(1, 'rgba(180, 20, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(10, 10, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff9e0';
    ctx.beginPath(); ctx.arc(10, 10, 3.2, 0, Math.PI * 2); ctx.fill();
  });

  make('boss-pellet', 16, 16, (ctx) => {
    ctx.fillStyle = '#ffe066';
    ctx.strokeStyle = '#b56a00';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(8, 8, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fff9d6';
    ctx.beginPath(); ctx.arc(6, 6, 2.2, 0, Math.PI * 2); ctx.fill();
  });

  make('boss-ink', 20, 20, (ctx) => {
    const grad = ctx.createRadialGradient(10, 10, 1, 10, 10, 10);
    grad.addColorStop(0, '#e0c8ff');
    grad.addColorStop(0.4, '#8c5cff');
    grad.addColorStop(0.8, '#3a1e6e');
    grad.addColorStop(1, 'rgba(30, 10, 60, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(10, 10, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f4ecff';
    ctx.beginPath(); ctx.arc(7, 7, 2, 0, Math.PI * 2); ctx.fill();
  });

  make('boss-fire', 20, 20, (ctx) => {
    const grad = ctx.createRadialGradient(10, 10, 1, 10, 10, 10);
    grad.addColorStop(0, '#fff9d6');
    grad.addColorStop(0.35, '#ffd166');
    grad.addColorStop(0.7, '#ff6b00');
    grad.addColorStop(1, 'rgba(160, 20, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(10, 10, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff3c4';
    ctx.beginPath(); ctx.arc(9, 8, 3, 0, Math.PI * 2); ctx.fill();
  });

  make('boss-shockwave', 44, 26, (ctx) => {
    ctx.fillStyle = 'rgba(255, 126, 182, 0.9)';
    ctx.strokeStyle = '#a4286a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 26);
    ctx.quadraticCurveTo(6, 6, 20, 12);
    ctx.quadraticCurveTo(28, 0, 38, 12);
    ctx.quadraticCurveTo(44, 18, 44, 26);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255, 230, 246, 0.9)';
    ctx.beginPath(); ctx.ellipse(22, 21, 14, 4, 0, 0, Math.PI * 2); ctx.fill();
  });

  make('boss-beam', 64, 58, (ctx) => {
    const grad = ctx.createLinearGradient(0, 0, 0, 58);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    grad.addColorStop(0.18, 'rgba(126, 249, 255, 0.9)');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(0.82, 'rgba(126, 249, 255, 0.9)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 58);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(0, 22, 64, 14);
  });

  make('boss-spirit', 60, 60, (ctx) => {
    const grad = ctx.createRadialGradient(30, 30, 2, 30, 30, 30);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, '#b8f4ff');
    grad.addColorStop(0.7, '#3f9dff');
    grad.addColorStop(1, 'rgba(43, 92, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(30, 30, 30, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255, 240, 150, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(30, 30, 22, 0, Math.PI * 2); ctx.stroke();
  });

  return result;
}

function generateBossGateTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 40;
  canvas.height = 230;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 40, 0);
  grad.addColorStop(0, 'rgba(126, 249, 255, 0.25)');
  grad.addColorStop(0.5, 'rgba(255, 209, 102, 0.85)');
  grad.addColorStop(1, 'rgba(255, 110, 180, 0.25)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 40, 230);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 3;
  ctx.strokeRect(3, 2, 34, 226);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  for (let y = 12; y < 220; y += 26) {
    ctx.fillRect(8, y, 24, 3);
  }
  return canvas;
}

function generateBossTelegraphTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const cx = 32;
  const cy = 32;
  const glow = ctx.createRadialGradient(cx, cy, 4, cx, cy, 32);
  glow.addColorStop(0, 'rgba(255, 246, 170, 0.95)');
  glow.addColorStop(0.45, 'rgba(255, 209, 102, 0.5)');
  glow.addColorStop(1, 'rgba(255, 209, 102, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = '#fff6a8';
  ctx.strokeStyle = '#ffb300';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? 22 : 9;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  return canvas;
}

function generateBossWallTexture() {  const canvas = document.createElement('canvas');
  canvas.width = 36;
  canvas.height = 230;
  const ctx = canvas.getContext('2d');

  // Stone pillar frame.
  ctx.fillStyle = 'rgba(34, 18, 52, 0.95)';
  ctx.fillRect(2, 0, 32, 230);
  ctx.strokeStyle = 'rgba(255, 123, 72, 0.95)';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 1, 32, 228);

  // Glowing rune segments.
  const runeGrad = ctx.createLinearGradient(0, 0, 0, 230);
  runeGrad.addColorStop(0, 'rgba(255, 220, 120, 0.15)');
  runeGrad.addColorStop(0.5, 'rgba(255, 107, 74, 0.95)');
  runeGrad.addColorStop(1, 'rgba(255, 220, 120, 0.15)');
  ctx.fillStyle = runeGrad;
  for (let y = 18; y < 215; y += 34) {
    ctx.fillRect(7, y, 22, 5);
    ctx.beginPath();
    ctx.arc(18, y + 18, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Diagonal energy cracks.
  ctx.strokeStyle = 'rgba(255, 235, 170, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, 210); ctx.lineTo(20, 185); ctx.lineTo(13, 160); ctx.lineTo(24, 130);
  ctx.stroke();

  return canvas;
}

function generateCoinFrames() {
  const s = 16;
  const canvas = document.createElement('canvas');
  canvas.width = s * 4;
  canvas.height = s;
  const ctx = canvas.getContext('2d');
  const widths = [14, 10, 4, 10];

  for (let i = 0; i < 4; i++) {
    const dx = i * s;
    const cw = widths[i];
    const ox = (s - cw) / 2;

    ctx.fillStyle = '#d99a00';
    ctx.beginPath(); ctx.ellipse(dx + s / 2, s / 2, cw / 2, s / 2 - 1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd700';
    ctx.beginPath(); ctx.ellipse(dx + s / 2, s / 2, Math.max(1, cw / 2 - 1.5), s / 2 - 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff6b0';
    ctx.fillRect(dx + ox + 2, 3, Math.max(1, cw - 4), 2);
    if (cw > 6) {
      ctx.fillStyle = '#b8860b';
      ctx.fillRect(dx + s / 2 - 1, 4, 2, s - 8);
    }
  }

  return { key: 'coin', canvas, frameWidth: s, frameHeight: s };
}

const THEME_TILES = {
  grass: { dirt: '#b5651d', dirt2: '#c8783a', line: '#8a4515', top: '#4a9e3a', light: '#6ac050', dark: '#2f7a2a' },
  cave: { dirt: '#34324f', dirt2: '#47446a', line: '#211f36', top: '#5b5790', light: '#8f8bd8', dark: '#35325c' },
  sky: { dirt: '#a8ddf5', dirt2: '#cdf3ff', line: '#78b9d6', top: '#f7fdff', light: '#ffffff', dark: '#bce8fa' },
  castle: { dirt: '#3a2229', dirt2: '#4e2e38', line: '#221217', top: '#7a3040', light: '#a34b5d', dark: '#4a1a24' },
};

const PIPE_THEMES = {
  grass: { base: '#2fa52f', dark: '#1c7a1c', light: '#55cc55', rim: '#3fbf3f', edge: '#145a14' },
  cave: { base: '#365a8a', dark: '#1f3a5e', light: '#6fa8d9', rim: '#4676a8', edge: '#132a46' },
  sky: { base: '#bfefff', dark: '#7fc0e0', light: '#ffffff', rim: '#d8f8ff', edge: '#6aa9c9' },
  castle: { base: '#7a2a2a', dark: '#4a1414', light: '#b05050', rim: '#9a3838', edge: '#340b0b' },
};

function drawBrickDirt(ctx, c) {
  ctx.fillStyle = c.dirt;
  ctx.fillRect(0, 0, 40, 40);
  ctx.fillStyle = c.dirt2;
  for (let row = 0; row < 4; row++) {
    const y = 8 + row * 8;
    ctx.fillRect(row % 2 ? 0 : 20, y, 20, 8);
  }
  ctx.strokeStyle = c.line;
  ctx.lineWidth = 1;
  for (let row = 0; row < 5; row++) {
    const y = row * 8;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(40, y); ctx.stroke();
    const offset = row % 2 ? 20 : 0;
    for (let x = offset; x <= 40; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 8); ctx.stroke();
    }
  }
}

function generateTileTextures() {
  const result = {};

  for (const [theme, c] of Object.entries(THEME_TILES)) {
    const ground = document.createElement('canvas');
    ground.width = 40;
    ground.height = 40;
    const gctx = ground.getContext('2d');
    drawBrickDirt(gctx, c);
    gctx.fillStyle = c.top;
    gctx.fillRect(0, 0, 40, 8);
    gctx.fillStyle = c.light;
    gctx.fillRect(0, 0, 40, 3);
    gctx.fillStyle = c.dark;
    gctx.fillRect(0, 7, 40, 1);
    result[`ground-${theme}`] = ground;

    const dirt = document.createElement('canvas');
    dirt.width = 40;
    dirt.height = 40;
    drawBrickDirt(dirt.getContext('2d'), c);
    result[`dirt-${theme}`] = dirt;

    const floating = document.createElement('canvas');
    floating.width = 40;
    floating.height = 20;
    const fctx = floating.getContext('2d');
    fctx.fillStyle = c.dirt;
    fctx.fillRect(0, 0, 40, 20);
    fctx.fillStyle = c.dirt2;
    fctx.fillRect(0, 0, 40, 4);
    fctx.fillStyle = c.dark;
    fctx.fillRect(0, 16, 40, 4);
    fctx.strokeStyle = c.line;
    fctx.lineWidth = 1;
    fctx.strokeRect(0.5, 0.5, 39, 19);
    for (let x = 0; x < 40; x += 20) {
      fctx.beginPath(); fctx.moveTo(x, 4); fctx.lineTo(x, 16); fctx.stroke();
    }
    result[`floating-${theme}`] = floating;
  }

  return result;
}

function generatePipeTexture(theme) {
  const c = PIPE_THEMES[theme] || PIPE_THEMES.grass;
  const canvas = document.createElement('canvas');
  const w = 54;
  const h = 120;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = c.base;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = c.dark;
  ctx.fillRect(4, 4, 10, h - 4);
  ctx.fillStyle = c.light;
  ctx.fillRect(w - 12, 4, 7, h - 4);
  ctx.fillStyle = c.dark;
  ctx.fillRect(0, 0, w, 8);
  ctx.fillStyle = c.rim;
  ctx.fillRect(-4, -7, w + 8, 9);
  ctx.fillStyle = c.light;
  ctx.fillRect(-4, -7, 7, 9);
  ctx.fillStyle = c.dark;
  ctx.fillRect(w + 2, -7, 4, 9);
  ctx.strokeStyle = c.edge;
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 8.5, w - 1, h - 9);

  return { key: `pipe-${theme}`, canvas };
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
    ctx.fillStyle = hit ? '#8a7040' : '#d9a514';
    ctx.fillRect(dx, 0, s, s);
    ctx.fillStyle = hit ? '#6a5020' : '#f0c84a';
    ctx.fillRect(dx + 2, 2, s - 4, 4);
    ctx.fillStyle = hit ? '#5a4018' : '#b07c10';
    ctx.fillRect(dx + 2, s - 6, s - 4, 4);
    ctx.strokeStyle = hit ? '#4a3510' : '#8a5c08';
    ctx.lineWidth = 2;
    ctx.strokeRect(dx + 1, 1, s - 2, s - 2);
    if (!hit) {
      ctx.fillStyle = '#fff7d0';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', dx + s / 2, s / 2 + 1);
    }
  }

  return { key: 'questionBlock', canvas, frameWidth: s, frameHeight: s };
}

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function drawSun(ctx, x, y, r) {
  ctx.fillStyle = 'rgba(255, 245, 170, 0.35)';
  ctx.beginPath(); ctx.arc(x, y, r * 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffe066';
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff3a0';
  ctx.beginPath(); ctx.arc(x - r * 0.27, y - r * 0.25, r * 0.38, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#7a4500';
  ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.08, r * 0.08, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + r * 0.25, y - r * 0.08, r * 0.08, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#7a4500';
  ctx.lineWidth = r * 0.06;
  ctx.beginPath(); ctx.arc(x, y + r * 0.08, r * 0.27, 0.25, Math.PI - 0.25); ctx.stroke();
}

function drawCloud(ctx, x, y, s, shade = 'rgba(130,190,240,0.35)') {
  ctx.fillStyle = shade;
  ctx.beginPath(); ctx.arc(x + 10, y + 10, 30 * s, 0, Math.PI * 2); ctx.arc(x + 45 * s, y + 8, 38 * s, 0, Math.PI * 2); ctx.arc(x + 82 * s, y + 14, 28 * s, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(x, y, 28 * s, 0, Math.PI * 2); ctx.arc(x + 34 * s, y - 8, 40 * s, 0, Math.PI * 2); ctx.arc(x + 74 * s, y + 2, 30 * s, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f4fbff';
  ctx.beginPath(); ctx.arc(x + 20 * s, y - 14 * s, 20 * s, 0, Math.PI * 2); ctx.fill();
}

function makeSky(theme) {
  const canvas = makeCanvas(960, 600);
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 600);

  if (theme === 'cave') {
    grad.addColorStop(0, '#060414');
    grad.addColorStop(0.5, '#171033');
    grad.addColorStop(1, '#2d214f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 600);
    ctx.fillStyle = 'rgba(90, 70, 190, 0.22)';
    ctx.beginPath(); ctx.arc(520, 210, 240, 0, Math.PI * 2); ctx.fill();
    // Distant cave rocks.
    ctx.fillStyle = '#0e0a1f';
    ctx.beginPath(); ctx.moveTo(0, 600); ctx.lineTo(0, 390); ctx.lineTo(120, 300); ctx.lineTo(260, 420); ctx.lineTo(400, 330); ctx.lineTo(560, 440); ctx.lineTo(720, 320); ctx.lineTo(960, 430); ctx.lineTo(960, 600); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#22163f';
    ctx.beginPath(); ctx.moveTo(0, 600); ctx.lineTo(0, 470); ctx.lineTo(180, 420); ctx.lineTo(340, 500); ctx.lineTo(520, 440); ctx.lineTo(760, 510); ctx.lineTo(960, 460); ctx.lineTo(960, 600); ctx.closePath(); ctx.fill();
    const glow = ctx.createLinearGradient(0, 500, 0, 600);
    glow.addColorStop(0, 'rgba(80, 230, 255, 0)');
    glow.addColorStop(1, 'rgba(80, 230, 255, 0.16)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 500, 960, 100);
  } else if (theme === 'sky') {
    grad.addColorStop(0, '#1478ff');
    grad.addColorStop(0.45, '#5ccaff');
    grad.addColorStop(1, '#eefcff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 600);
    drawSun(ctx, 790, 92, 50);
    // Distant cloud puffs.
    for (let i = 0; i < 4; i++) {
      drawCloud(ctx, 80 + i * 240, 260 + (i % 2) * 80, 0.7 + (i % 3) * 0.15, 'rgba(160,220,255,0.25)');
    }
  } else if (theme === 'castle') {
    grad.addColorStop(0, '#09040d');
    grad.addColorStop(0.5, '#240916');
    grad.addColorStop(1, '#481020');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 600);
    // Distant castle arches and lava glow.
    ctx.fillStyle = '#12050d';
    ctx.fillRect(0, 360, 960, 240);
    for (let x = 40; x < 960; x += 190) {
      ctx.fillStyle = '#2c0d1a';
      ctx.fillRect(x, 280, 100, 240);
      ctx.fillStyle = '#ff8c42';
      ctx.beginPath();
      ctx.arc(x + 50, 390, 34, Math.PI, 0);
      ctx.rect(x + 16, 390, 68, 110);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 100, 40, 0.18)';
      ctx.beginPath(); ctx.arc(x + 50, 430, 90, 0, Math.PI * 2); ctx.fill();
    }
    const lava = ctx.createLinearGradient(0, 520, 0, 600);
    lava.addColorStop(0, 'rgba(255, 80, 30, 0)');
    lava.addColorStop(1, 'rgba(255, 120, 40, 0.4)');
    ctx.fillStyle = lava;
    ctx.fillRect(0, 520, 960, 80);
  } else {
    grad.addColorStop(0, '#1d6fd6');
    grad.addColorStop(0.45, '#57b8ff');
    grad.addColorStop(1, '#d8f7ff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 600);
    drawSun(ctx, 800, 90, 48);
  }

  return canvas;
}

function makeGrassClouds() {
  const canvas = makeCanvas(960, 200);
  const ctx = canvas.getContext('2d');
  drawCloud(ctx, 60, 70, 1);
  drawCloud(ctx, 330, 130, 0.8);
  drawCloud(ctx, 600, 60, 1.15);
  drawCloud(ctx, 820, 140, 0.7);
  return canvas;
}

function makeCaveCeiling() {
  const canvas = makeCanvas(960, 200);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0d0a1a';
  ctx.fillRect(0, 0, 960, 38);
  for (let x = -30; x < 990; x += 72) {
    const h = 48 + ((x / 72) % 3) * 22;
    ctx.fillStyle = '#1a1530';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 40, 0);
    ctx.lineTo(x + 20, h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(80, 230, 255, 0.8)';
    ctx.beginPath(); ctx.arc(x + 20, h, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(80, 230, 255, 0.16)';
    ctx.beginPath(); ctx.arc(x + 20, h, 13, 0, Math.PI * 2); ctx.fill();
  }
  return canvas;
}

function makeSkyClouds() {
  const canvas = makeCanvas(960, 200);
  const ctx = canvas.getContext('2d');
  drawCloud(ctx, 40, 80, 1.25);
  drawCloud(ctx, 310, 35, 0.9);
  drawCloud(ctx, 540, 120, 1.15);
  drawCloud(ctx, 800, 55, 1);
  return canvas;
}

function makeCastleCeiling() {
  const canvas = makeCanvas(960, 200);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#12050d';
  ctx.fillRect(0, 0, 960, 34);
  for (let x = 40; x < 960; x += 140) {
    ctx.strokeStyle = '#3c2731';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 86); ctx.stroke();
    ctx.fillStyle = '#ff9f1c';
    ctx.beginPath(); ctx.arc(x, 92, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath(); ctx.arc(x, 92, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 140, 40, 0.2)';
    ctx.beginPath(); ctx.arc(x, 92, 32, 0, Math.PI * 2); ctx.fill();
  }
  return canvas;
}

function makeGrassMountains() {
  const canvas = makeCanvas(960, 200);
  const ctx = canvas.getContext('2d');
  const mountain = (x, w, h, color, color2) => {
    const g = ctx.createLinearGradient(0, 200 - h, 0, 200);
    g.addColorStop(0, color2);
    g.addColorStop(1, color);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, 200);
    ctx.lineTo(x + w / 2, 200 - h);
    ctx.lineTo(x + w, 200);
    ctx.closePath();
    ctx.fill();
  };
  mountain(-80, 380, 150, '#4f9e55', '#7ecb6e');
  mountain(180, 470, 180, '#3f8a4b', '#6cbc5e');
  mountain(560, 420, 160, '#4a9450', '#7ccb6d');
  mountain(820, 300, 120, '#5aa55c', '#8ad77b');
  const haze = ctx.createLinearGradient(0, 150, 0, 200);
  haze.addColorStop(0, 'rgba(200, 245, 255, 0)');
  haze.addColorStop(1, 'rgba(200, 245, 255, 0.55)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 150, 960, 50);
  return canvas;
}

function makeCaveMountains() {
  const canvas = makeCanvas(960, 200);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#100c20';
  ctx.fillRect(0, 0, 960, 200);
  const rocks = [
    [-40, 150, 210, 70], [120, 130, 260, 60], [330, 170, 220, 80],
    [520, 120, 300, 55], [740, 160, 240, 70], [860, 140, 160, 60],
  ];
  for (const [x, top, w, h] of rocks) {
    ctx.fillStyle = '#231a42';
    ctx.beginPath();
    ctx.moveTo(x, 200);
    ctx.lineTo(x + w * 0.15, top);
    ctx.lineTo(x + w * 0.5, top + h * 0.35);
    ctx.lineTo(x + w * 0.85, top);
    ctx.lineTo(x + w, 200);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3d2d68';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  for (let i = 0; i < 6; i++) {
    const x = 70 + i * 160;
    const h = 30 + (i % 3) * 18;
    ctx.fillStyle = 'rgba(80, 230, 255, 0.75)';
    ctx.beginPath();
    ctx.moveTo(x, 190);
    ctx.lineTo(x + 10, 190 - h);
    ctx.lineTo(x + 20, 190);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(80, 230, 255, 0.14)';
    ctx.beginPath(); ctx.arc(x + 10, 190 - h, 26, 0, Math.PI * 2); ctx.fill();
  }
  return canvas;
}

function makeSkyIslands() {
  const canvas = makeCanvas(960, 200);
  const ctx = canvas.getContext('2d');
  const island = (x, y, s) => {
    ctx.fillStyle = '#8d6a4a';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 70 * s, y);
    ctx.lineTo(x + 52 * s, y + 42 * s);
    ctx.lineTo(x + 35 * s, y + 76 * s);
    ctx.lineTo(x + 18 * s, y + 42 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#7ee06a';
    ctx.beginPath();
    ctx.ellipse(x + 35 * s, y, 38 * s, 15 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.ellipse(x + 35 * s, y - 4 * s, 26 * s, 7 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  island(90, 90, 0.9);
  island(420, 150, 1.15);
  island(780, 80, 0.7);
  drawCloud(ctx, 180, 160, 0.6, 'rgba(160,220,255,0.25)');
  drawCloud(ctx, 650, 160, 0.7, 'rgba(160,220,255,0.25)');
  return canvas;
}

function makeCastleMountains() {
  const canvas = makeCanvas(960, 200);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#180910';
  ctx.fillRect(0, 0, 960, 200);
  for (let row = 0; row < 8; row++) {
    const y = row * 25;
    for (let x = -20; x < 980; x += 60) {
      ctx.fillStyle = (row + x / 60) % 2 === 0 ? '#24101a' : '#2e1420';
      ctx.fillRect(x + (row % 2 ? 30 : 0), y, 58, 23);
      ctx.strokeStyle = '#3e1a28';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + (row % 2 ? 30 : 0) + 0.5, y + 0.5, 57, 22);
    }
  }
  for (let x = 80; x < 960; x += 240) {
    ctx.fillStyle = '#11060c';
    ctx.fillRect(x, 0, 48, 200);
    ctx.fillStyle = '#35121e';
    ctx.fillRect(x + 8, 0, 32, 200);
    ctx.fillStyle = 'rgba(255, 120, 60, 0.6)';
    ctx.beginPath(); ctx.arc(x + 24, 92, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 120, 60, 0.12)';
    ctx.beginPath(); ctx.arc(x + 24, 92, 40, 0, Math.PI * 2); ctx.fill();
  }
  return canvas;
}

function makeGrassBushes() {
  const canvas = makeCanvas(960, 62);
  const ctx = canvas.getContext('2d');
  const bush = (x, s) => {
    ctx.fillStyle = '#2f7d32';
    ctx.beginPath();
    ctx.arc(x, 62, 24 * s, Math.PI, 0);
    ctx.arc(x + 30 * s, 62, 30 * s, Math.PI, 0);
    ctx.arc(x + 64 * s, 62, 22 * s, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.arc(x + 8 * s, 62, 16 * s, Math.PI, 0);
    ctx.arc(x + 36 * s, 62, 20 * s, Math.PI, 0);
    ctx.fill();
  };
  bush(40, 1);
  bush(300, 0.8);
  bush(590, 1.1);
  bush(820, 0.7);
  return canvas;
}

function makeCaveBushes() {
  const canvas = makeCanvas(960, 62);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#151024';
  ctx.fillRect(0, 24, 960, 38);
  for (let x = 40; x < 960; x += 110) {
    const h = 22 + ((x / 110) % 3) * 10;
    ctx.fillStyle = '#4b3f8a';
    ctx.beginPath();
    ctx.moveTo(x, 62);
    ctx.lineTo(x + 12, 62 - h);
    ctx.lineTo(x + 24, 62);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(120, 230, 255, 0.8)';
    ctx.beginPath(); ctx.arc(x + 12, 62 - h, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(120, 230, 255, 0.12)';
    ctx.beginPath(); ctx.arc(x + 12, 62 - h, 16, 0, Math.PI * 2); ctx.fill();
  }
  return canvas;
}

function makeSkyBushes() {
  const canvas = makeCanvas(960, 62);
  const ctx = canvas.getContext('2d');
  const puff = (x, s) => {
    ctx.fillStyle = 'rgba(190, 235, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(x, 62, 22 * s, Math.PI, 0);
    ctx.arc(x + 26 * s, 62, 28 * s, Math.PI, 0);
    ctx.arc(x + 56 * s, 62, 20 * s, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(x + 10 * s, 58, 12 * s, Math.PI, 0);
    ctx.arc(x + 34 * s, 56, 16 * s, Math.PI, 0);
    ctx.fill();
  };
  puff(50, 1);
  puff(300, 0.8);
  puff(600, 1.1);
  puff(830, 0.7);
  return canvas;
}

function makeCastleBushes() {
  const canvas = makeCanvas(960, 62);
  const ctx = canvas.getContext('2d');
  const lava = ctx.createLinearGradient(0, 20, 0, 62);
  lava.addColorStop(0, '#45120d');
  lava.addColorStop(0.4, '#a52a10');
  lava.addColorStop(0.75, '#ff8c1a');
  lava.addColorStop(1, '#ffd166');
  ctx.fillStyle = lava;
  ctx.fillRect(0, 20, 960, 42);
  for (let x = 20; x < 960; x += 80) {
    ctx.fillStyle = 'rgba(255, 220, 120, 0.8)';
    ctx.beginPath(); ctx.arc(x, 44 + (x % 3) * 4, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255, 120, 40, 0.25)';
    ctx.beginPath(); ctx.arc(x, 40, 22, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#2a0c12';
  for (let x = 0; x < 960; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 24);
    ctx.lineTo(x + 20, 10);
    ctx.lineTo(x + 40, 24);
    ctx.lineTo(x + 60, 14);
    ctx.lineTo(x + 80, 24);
    ctx.lineTo(x + 80, 30);
    ctx.lineTo(x, 30);
    ctx.closePath();
    ctx.fill();
  }
  return canvas;
}

function generateBackgroundTextures() {
  const result = {};

  result['sky-grass'] = makeSky('grass');
  result['sky-cave'] = makeSky('cave');
  result['sky-sky'] = makeSky('sky');
  result['sky-castle'] = makeSky('castle');
  result['clouds-grass'] = makeGrassClouds();
  result['clouds-cave'] = makeCaveCeiling();
  result['clouds-sky'] = makeSkyClouds();
  result['clouds-castle'] = makeCastleCeiling();
  result['mountains-grass'] = makeGrassMountains();
  result['mountains-cave'] = makeCaveMountains();
  result['mountains-sky'] = makeSkyIslands();
  result['mountains-castle'] = makeCastleMountains();
  result['bushes-grass'] = makeGrassBushes();
  result['bushes-cave'] = makeCaveBushes();
  result['bushes-sky'] = makeSkyBushes();
  result['bushes-castle'] = makeCastleBushes();

  const flag = document.createElement('canvas');
  flag.width = 80;
  flag.height = 190;
  const fctx = flag.getContext('2d');
  fctx.fillStyle = '#e9e9e9';
  fctx.fillRect(12, 14, 8, 176);
  fctx.fillStyle = '#9a9a9a';
  fctx.fillRect(17, 14, 3, 176);
  fctx.fillStyle = '#ffd700';
  fctx.beginPath(); fctx.arc(16, 12, 9, 0, Math.PI * 2); fctx.fill();
  fctx.fillStyle = '#e6a800';
  fctx.beginPath(); fctx.arc(16, 12, 4, 0, Math.PI * 2); fctx.fill();
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      fctx.fillStyle = (row + col) % 2 === 0 ? '#111827' : '#f8fafc';
      fctx.fillRect(20 + col * 15, 22 + row * 15, 15, 15);
    }
  }
  fctx.strokeStyle = '#1f2937';
  fctx.lineWidth = 2;
  fctx.strokeRect(20, 22, 60, 60);
  result.flag = flag;

  const finishLine = document.createElement('canvas');
  finishLine.width = 48;
  finishLine.height = 12;
  const flctx = finishLine.getContext('2d');
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      flctx.fillStyle = (row + col) % 2 === 0 ? '#111827' : '#f8fafc';
      flctx.fillRect(col * 8, row * 4, 8, 4);
    }
  }
  result.finishLine = finishLine;

  return result;
}


export function generateRunnerTexture(scene, avatar) {
  const key = getRunnerTextureKey(avatar);
  if (scene.textures.exists(key)) return key;
  const palette = getPaletteByAvatar(avatar);
  const look = getRunnerLook(avatar, palette);
  const canvas = generateRunnerFrames(look);
  scene.textures.addSpriteSheet(key, canvas, {
    frameWidth: RUNNER_FRAME_W,
    frameHeight: RUNNER_FRAME_H,
  });
  return key;
}

export function generateAllTextures(scene, avatars = []) {
  const tiles = generateTileTextures();
  for (const [key, canvas] of Object.entries(tiles)) scene.textures.addCanvas(key, canvas);

  const goomba = generateGoombaFrames();
  scene.textures.addSpriteSheet(goomba.key, goomba.canvas, {
    frameWidth: goomba.frameWidth,
    frameHeight: goomba.frameHeight,
  });

  for (const generate of [generateKoopaFrames, generateSpinyFrames, generateJumperFrames, generateFlyerFrames, generateToadFrames, generateFireFrames, generateSpitterFrames, generatePenguinFrames, generateGustFrames, generateGhostFrames, generateFishFrames, generateJellyFrames]) {
    const enemy = generate();
    scene.textures.addSpriteSheet(enemy.key, enemy.canvas, {
      frameWidth: enemy.frameWidth,
      frameHeight: enemy.frameHeight,
    });
  }

  scene.textures.addCanvas('ice-tile', generateIceTexture());
  scene.textures.addCanvas('lava-tile', generateLavaTexture());
  scene.textures.addCanvas('neon-grid', generateNeonGridTexture());

  for (const theme of ['grass', 'cave', 'sky', 'castle', 'pac', 'koopa', 'water']) {
    const boss = generateBossFrames(theme);
    scene.textures.addSpriteSheet(boss.key, boss.canvas, {
      frameWidth: boss.frameWidth,
      frameHeight: boss.frameHeight,
    });
  }

  for (const [key, canvas] of Object.entries(generateBossProjectileTextures())) {
    scene.textures.addCanvas(key, canvas);
  }
  scene.textures.addCanvas('boss-gate', generateBossGateTexture());
  scene.textures.addCanvas('boss-wall', generateBossWallTexture());
  scene.textures.addCanvas('boss-telegraph', generateBossTelegraphTexture());

  const coin = generateCoinFrames();
  scene.textures.addSpriteSheet(coin.key, coin.canvas, {
    frameWidth: coin.frameWidth,
    frameHeight: coin.frameHeight,
  });

  const pipe = generatePipeTexture('grass');
  scene.textures.addCanvas(pipe.key, pipe.canvas);
  for (const theme of ['cave', 'sky', 'castle']) {
    const themedPipe = generatePipeTexture(theme);
    scene.textures.addCanvas(themedPipe.key, themedPipe.canvas);
  }

  const question = generateQuestionBlockFrames();
  scene.textures.addSpriteSheet(question.key, question.canvas, {
    frameWidth: question.frameWidth,
    frameHeight: question.frameHeight,
  });

  const bg = generateBackgroundTextures();
  for (const [key, canvas] of Object.entries(bg)) scene.textures.addCanvas(key, canvas);

  scene.textures.addCanvas('oneup', generateOneUpTexture());

  for (const avatar of new Set(avatars.filter(Boolean))) {
    generateRunnerTexture(scene, avatar);
  }
}

export { PALETTES, RUNNER_FRAME_W, RUNNER_FRAME_H };
