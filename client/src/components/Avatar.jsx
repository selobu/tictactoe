import { useId } from 'react';
import './Avatar.css';

const CHARACTERS = {
  'plumber-01': {
    kind: 'plumber',
    bg1: '#2b1030', bg2: '#120814',
    skin: '#f0b98d', skinShade: '#d39263',
    hair: '#5a3320',
    cap: '#e63946', capDark: '#a81f2c', capLight: '#ff6f6f',
    emblem: 'spark', emblemColor: '#a81f2c',
    shirt: '#e63946', overalls: '#2f5aa8', button: '#ffd166',
    eyes: '#2f5d8a', brows: 'normal', hairStyle: 'short',
    mustache: 'big', mouth: 'smile', rosy: true,
  },
  'plumber-02': {
    kind: 'plumber',
    bg1: '#102b24', bg2: '#081410',
    skin: '#f6c9a6', skinShade: '#dfa47c',
    hair: '#7a4b2a',
    cap: '#43aa8b', capDark: '#2f7d66', capLight: '#74d3b6',
    emblem: 'leaf', emblemColor: '#2f7d66',
    shirt: '#43aa8b', overalls: '#2f5aa8', button: '#ffd166',
    eyes: '#3d7a4e', brows: 'normal', hairStyle: 'tufts',
    mouth: 'smile', freckles: true, rosy: true,
  },
  'plumber-03': {
    kind: 'plumber',
    bg1: '#2b230e', bg2: '#120f06',
    skin: '#8d5524', skinShade: '#6f411a',
    hair: '#1f1a17',
    cap: '#f4c430', capDark: '#c99a10', capLight: '#ffe066',
    emblem: 'bolt', emblemColor: '#8a6400',
    shirt: '#f08a24', overalls: '#6b4a2f', button: '#ffe066',
    eyes: '#4a2c17', brows: 'normal', hairStyle: 'curls',
    mouth: 'grin', earring: true,
  },
  'plumber-04': {
    kind: 'plumber',
    bg1: '#0f1e33', bg2: '#070d18',
    skin: '#c68642', skinShade: '#a5682f',
    hair: '#2b1d16',
    cap: '#3a86ff', capDark: '#2660c4', capLight: '#7eb1ff',
    emblem: 'star', emblemColor: '#2660c4',
    shirt: '#3a86ff', overalls: '#7aa5d8', button: '#ffd166',
    eyes: '#3b2a20', brows: 'normal', hairStyle: 'ponytail',
    mouth: 'smile', rosy: true,
  },
  'plumber-05': {
    kind: 'plumber',
    bg1: '#22122f', bg2: '#0d0714',
    skin: '#f0c8a0', skinShade: '#d6a276',
    hair: '#b8b8c4',
    cap: '#9b5de5', capDark: '#6f3cb3', capLight: '#c39cf5',
    emblem: 'gear', emblemColor: '#6f3cb3',
    shirt: '#9b5de5', overalls: '#3b3b4f', button: '#ffd166',
    eyes: '#4a5a6a', brows: 'bushy', hairStyle: 'short',
    mustache: 'big', mouth: 'smile', older: true, rosy: true,
  },
  'plumber-06': {
    kind: 'plumber',
    bg1: '#2b1710', bg2: '#140a06',
    skin: '#d9a066', skinShade: '#b87e4b',
    hair: '#6b4423',
    cap: '#ff8c42', capDark: '#d96a1f', capLight: '#ffb37a',
    emblem: 'flame', emblemColor: '#d96a1f',
    shirt: '#ff8c42', overalls: '#2a9d8f', button: '#ffe066',
    eyes: '#3d5a2a', brows: 'normal', hairStyle: 'curls',
    mouth: 'grin', freckles: true, rosy: true,
  },
  'plumber-07': {
    kind: 'plumber',
    bg1: '#2b0f1e', bg2: '#140710',
    skin: '#6b4226', skinShade: '#52301a',
    hair: '#1f1a17',
    cap: '#ff5d8f', capDark: '#d63a70', capLight: '#ff95b5',
    emblem: 'heart', emblemColor: '#d63a70',
    shirt: '#ffd166', overalls: '#ff8fab', button: '#fff3b0',
    eyes: '#3b2a20', brows: 'normal', hairStyle: 'braids',
    mouth: 'smile', earring: true, rosy: true,
  },
  'plumber-08': {
    kind: 'plumber',
    bg1: '#0e2630', bg2: '#061217',
    skin: '#b07a4a', skinShade: '#8d5c33',
    hair: '#2b1d16',
    cap: '#00b4d8', capDark: '#0086a8', capLight: '#62d6f0',
    emblem: 'droplet', emblemColor: '#0086a8',
    shirt: '#00b4d8', overalls: '#1d3557', button: '#ffd166',
    eyes: '#3b2a20', brows: 'normal', hairStyle: 'short',
    beard: 'stubble', mouth: 'smile', glasses: true,
  },
  'plumber-09': {
    kind: 'plumber',
    bg1: '#1f1f26', bg2: '#0c0c11',
    skin: '#5c3a21', skinShade: '#452a16',
    hair: '#2b1d16',
    cap: '#f1f1f1', capDark: '#c9c9d1', capLight: '#ffffff',
    emblem: 'gear', emblemColor: '#ffffff', emblemBg: '#5c677d',
    shirt: '#e63946', overalls: '#8d99ae', button: '#ffd166',
    eyes: '#2b1d16', brows: 'normal', hairStyle: 'bald',
    beard: 'full', beardColor: '#2b1d16',
    mouth: 'grin', goldTooth: true,
  },
  'plumber-10': {
    kind: 'plumber',
    bg1: '#221d0e', bg2: '#110e06',
    skin: '#7b4a2d', skinShade: '#5f3720',
    hair: '#1a1117',
    cap: '#2b2d42', capDark: '#171825', capLight: '#4a4d68',
    emblem: 'moon', emblemColor: '#171825',
    shirt: '#22223b', overalls: '#f4c430', button: '#2b2d42',
    eyes: '#3b2a20', brows: 'normal', hairStyle: 'dreadlocks',
    mouth: 'smile', rosy: true,
  },
  'plumber-11': {
    kind: 'plumber',
    bg1: '#2b1014', bg2: '#140708',
    skin: '#f3d1b3', skinShade: '#d8ab88',
    hair: '#b5522b',
    cap: '#8d2f3d', capDark: '#661f2b', capLight: '#b85765',
    emblem: 'clover', emblemColor: '#661f2b',
    shirt: '#8d2f3d', overalls: '#2a9d8f', button: '#ffd166',
    eyes: '#2f5d8a', brows: 'bushy', hairStyle: 'short',
    mustache: 'small', beard: 'full', beardColor: '#b5522b',
    mouth: 'smile', rosy: true,
  },
  'plumber-12': {
    kind: 'plumber',
    bg1: '#1e2b10', bg2: '#0e1406',
    skin: '#f7cdb0', skinShade: '#e0a98b',
    hair: '#c8553d',
    cap: '#a7c957', capDark: '#7fa03a', capLight: '#c6e07a',
    emblem: 'fish', emblemColor: '#5f7a2a',
    shirt: '#a7c957', overalls: '#9aa0a6', button: '#ffd166',
    eyes: '#2f5d8a', brows: 'normal', hairStyle: 'tufts',
    mouth: 'open', freckles: true, toothGap: true, rosy: true,
  },
  'flower-01': {
    kind: 'flower',
    bg1: '#173a2b', bg2: '#08140f',
    glow: '#ff8fb1',
    petal: '#ff6f91', petalLight: '#ffb3c7',
    center: '#ffd166', centerShade: '#f4a261',
    stem: '#3f8f4f', leaf: '#4caf50',
    eyeColor: '#4a2c17',
  },
  'pine-01': {
    kind: 'pine',
    bg1: '#0c2637', bg2: '#050f18',
    glow: '#5eead4',
    tree: '#2f8f6a', treeLight: '#56c79a', treeDark: '#1f6b50',
    trunk: '#7a4b2a', star: '#ffd166',
    scarf: '#e63946', scarfLight: '#ff8a93',
    eyeColor: '#2f5d8a',
  },
  'cloud-01': {
    kind: 'cloud',
    bg1: '#173a5e', bg2: '#081624',
    glow: '#8ecae6',
    cloud: '#f7fbff', cloudShade: '#c9e2f2',
    rain: '#8ecae6',
    eyeColor: '#2f5d8a',
  },
  'rocket-01': {
    kind: 'rocket',
    bg1: '#120b2e', bg2: '#06041a',
    glow: '#ff8c42',
    body: '#f4f1de', bodyShade: '#d9d4bd',
    nose: '#e63946', fin: '#e63946',
    window: '#4cc9f0', windowRim: '#c9c9d1',
    flame: '#ff8c42', flameInner: '#ffd166',
    eyeColor: '#1d3557',
  },
  'mushroom-01': {
    kind: 'mushroom',
    bg1: '#122a1a', bg2: '#07110a',
    glow: '#ff6b6b',
    cap: '#e63946', capLight: '#ff8080', spot: '#fff3e0',
    stem: '#fff3e0', stemShade: '#e6d3b3',
    grass: '#4caf50',
    eyeColor: '#4a2c17',
  },
  'cactus-01': {
    kind: 'cactus',
    bg1: '#4a2a1a', bg2: '#1b0f0a',
    glow: '#ffd166',
    cactus: '#3a9d6a', cactusLight: '#5cc28a', cactusDark: '#2a7a4f',
    pot: '#c46a3a', potLight: '#e08a55', sand: '#e6b566',
    flower: '#ff6f91', flowerCenter: '#ffd166',
    eyeColor: '#2f5d8a',
  },
  'planet-01': {
    kind: 'planet',
    bg1: '#0a1029', bg2: '#05030f',
    glow: '#7bdff2',
    planet: '#2ec4b6', planetLight: '#6fe0d4', planetDark: '#1f8f85',
    land: '#7bd389', ring: '#ffd166', ringLight: '#ffe8a3',
    eyeColor: '#13315c',
  },
  'robot-01': {
    kind: 'robot',
    bg1: '#1a1230', bg2: '#08050f',
    glow: '#b388ff',
    metal: '#adb5bd', metalLight: '#dee2e6', metalDark: '#6c757d',
    screen: '#101826', neon: '#4cc9f0', accent: '#ffb703',
  },
  'coffee-01': {
    kind: 'coffee',
    bg1: '#2a170d', bg2: '#0f0805',
    glow: '#e0a46b',
    bean: '#8b4a2f', beanLight: '#b06a45', beanDark: '#5e2c1a',
    crease: '#47200f',
    stem: '#3f8f4f', leaf: '#4caf50', leafLight: '#6fd37a',
    hill: '#1f4d2f', hillDark: '#173a24',
    ribbonYellow: '#fcd116', ribbonBlue: '#003893', ribbonRed: '#ce1126',
    eyeColor: '#2b1d16', mouthColor: '#3a150d',
  },
  'eagle-01': {
    kind: 'eagle',
    bg1: '#0a1a3a', bg2: '#040812',
    glow: '#5aa9ff',
    head: '#f8f9fa', headShade: '#c9d4dc',
    feather: '#6b4226', featherLight: '#8b5a2b', featherDark: '#4a2c18',
    beak: '#f4a261', beakDark: '#e76f51', eye: '#f4c430', brow: '#b6c2cc',
    scarf: '#1d3557', trimRed: '#e63946', trimWhite: '#f1faee',
  },
  'axolotl-01': {
    kind: 'axolotl',
    bg1: '#0b2b33', bg2: '#051014',
    glow: '#ff9ec4',
    body: '#f7a8c4', bodyDark: '#e58bb0', belly: '#ffd0e0',
    gill: '#e56b9a', gillLight: '#ff9ec4',
    smile: '#b34a72', eye: '#3a1c2b', plant: '#2a9d8f',
  },
  'house-01': {
    kind: 'house',
    bg1: '#1b3a5e', bg2: '#081421',
    glow: '#ffd166',
    wall: '#f4e3c1', wallShade: '#dcc9a3',
    roof: '#d95d39', roofDark: '#b3472c', roofLight: '#ef7a54',
    door: '#2a9d8f', doorDark: '#1f7a6f',
    window: '#8ecae6', frame: '#fff7e8',
    bush: '#4caf50', bushDark: '#2f7d32',
    flower: '#ff6f91', flowerCenter: '#ffd166',
    grass: '#3a8f4f', stone: '#9aa0a6',
    eye: '#1b2a3a', teal: '#2a9d8f',
    chimney: '#8c3b2a', chimneyDark: '#6b2a1d',
  },
  'catrina-01': {
    kind: 'catrina',
    bg1: '#2b0f2e', bg2: '#120614',
    glow: '#ff9f1c',
    skull: '#f3e7d3', skullShade: '#d8c6a8',
    socket: '#2a1630', socketLight: '#4b2450',
    lips: '#c9184a', lipsDark: '#8f1236',
    hair: '#1b1026',
    hat: '#24122e', hatDark: '#160a1e', hatBand: '#ff9f1c',
    marigold: '#ff9f1c', marigoldLight: '#ffd166', leaf: '#4caf50',
    teal: '#2ec4b6', pink: '#ff6f91', gold: '#ffd166',
    dress: '#2a1233', dressDark: '#1a0a20', lace: '#f3e7d3',
  },
};

const AVATAR_IDS = Object.keys(CHARACTERS);

function Emblem({ type, color }) {
  switch (type) {
    case 'spark':
      return (
        <path
          d="M0 -3.4 L0.9 -0.9 L3.4 0 L0.9 0.9 L0 3.4 L-0.9 0.9 L-3.4 0 L-0.9 -0.9 Z"
          fill={color}
        />
      );
    case 'leaf':
      return (
        <g>
          <path d="M0.4 3.2 C-3.4 1.8 -3.2 -2.8 0.8 -3.1 C3.7 -3.4 3.4 1.6 0.4 3.2 Z" fill={color} />
          <path d="M0.7 2.3 Q0.4 -0.6 1.7 -2.1" stroke="#fff" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.6" />
        </g>
      );
    case 'bolt':
      return (
        <path
          d="M-0.4 -3.5 L2.6 -3.5 L0.6 -0.4 L2.8 -0.4 L-2.2 3.5 L-0.3 0.3 L-1.8 0.3 Z"
          fill={color}
        />
      );
    case 'star':
      return (
        <path
          d="M0 -3.4 L1 -1 L3.5 -1 L1.4 0.5 L2.2 3 L0 1.5 L-2.2 3 L-1.4 0.5 L-3.5 -1 L-1 -1 Z"
          fill={color}
        />
      );
    case 'gear':
      return (
        <g>
          <circle r="3.1" fill="none" stroke={color} strokeWidth="1.7" strokeDasharray="1.4 1.1" />
          <circle r="1" fill={color} />
        </g>
      );
    case 'flame':
      return (
        <path
          d="M0.3 3.4 C-3 2.1 -3.3 -1.1 -0.8 -3.4 C-0.1 -1.8 0.9 -1.5 1.1 -2.8 C3.2 -0.3 2.9 2.1 0.3 3.4 Z"
          fill={color}
        />
      );
    case 'heart':
      return (
        <path
          d="M0 3.2 C-4 0.2 -3.1 -3.1 -0.9 -3.1 C-0.2 -3.1 0 -2.5 0 -2.3 C0 -2.5 0.2 -3.1 0.9 -3.1 C3.1 -3.1 4 0.2 0 3.2 Z"
          fill={color}
        />
      );
    case 'droplet':
      return (
        <g>
          <path d="M0 -3.6 C1.9 -1.3 3.1 0.1 3.1 1.4 A3.1 3.1 0 0 1 -3.1 1.4 C-3.1 0.1 -1.9 -1.3 0 -3.6 Z" fill={color} />
          <ellipse cx="-1" cy="0.6" rx="0.7" ry="1.3" fill="#fff" opacity="0.55" transform="rotate(20 -1 0.6)" />
        </g>
      );
    case 'hammer':
      return (
        <g fill={color}>
          <rect x="-3" y="-3.1" width="6" height="2.3" rx="0.7" />
          <rect x="-0.9" y="-1" width="1.8" height="4.3" rx="0.6" />
        </g>
      );
    case 'moon':
      return (
        <path
          d="M1.1 -3.3 A3.4 3.4 0 1 0 1.1 3.3 A2.8 2.8 0 0 1 1.1 -3.3 Z"
          fill={color}
        />
      );
    case 'clover':
      return (
        <g fill={color}>
          <circle cx="-1.3" cy="-0.7" r="1.6" />
          <circle cx="1.3" cy="-0.7" r="1.6" />
          <circle cx="0" cy="1.7" r="1.6" />
          <rect x="-0.45" y="1.6" width="0.9" height="1.9" rx="0.4" />
        </g>
      );
    case 'fish':
      return (
        <g fill={color}>
          <path d="M-3 0 C-1 -2.6 2.4 -2.6 3.2 0 C2.4 2.6 -1 2.6 -3 0 Z" />
          <path d="M-2.8 0 L-4.3 -1.9 L-4.3 1.9 Z" />
          <circle cx="2" cy="-0.6" r="0.55" fill="#fff" />
        </g>
      );
    default:
      return null;
  }
}

function HairBack({ c }) {
  if (c.hairStyle === 'ponytail') {
    return (
      <g>
        <path
          d="M62 43 C76 40 83 52 78 65 C75 73 68 75 65 69 C72 62 72 51 61 48 Z"
          fill={c.hair}
        />
        <path
          d="M66 48 C73 52 75 59 73 66"
          stroke="#fff"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
          opacity="0.13"
        />
        <circle cx="69" cy="47" r="3" fill="#ffd166" />
        <circle cx="69" cy="47" r="3" fill="none" stroke="#b8860b" strokeWidth="0.6" />
      </g>
    );
  }
  if (c.hairStyle === 'braids') {
    return (
      <g>
        <g fill={c.hair}>
          <path d="M29 48 C22 57 22 67 25 76" stroke={c.hair} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M67 48 C74 57 74 67 71 76" stroke={c.hair} strokeWidth="7" strokeLinecap="round" fill="none" />
          <circle cx="25" cy="77" r="4.6" />
          <circle cx="71" cy="77" r="4.6" />
        </g>
        <circle cx="24.3" cy="68" r="2.2" fill="#ffd166" />
        <circle cx="71.7" cy="68" r="2.2" fill="#ffd166" />
      </g>
    );
  }
  if (c.hairStyle === 'dreadlocks') {
    return (
      <g stroke={c.hair} strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M29 46 C22 56 23 66 26 77" />
        <path d="M35 48 C30 58 31 68 34 79" />
        <path d="M67 46 C74 56 73 66 70 77" />
        <path d="M61 48 C66 58 65 68 62 79" />
      </g>
    );
  }
  return null;
}

function HairFront({ c }) {
  if (c.hairStyle === 'bald') return null;

  const sideburns = (
    <g fill={c.hair}>
      <path d="M29.5 40 C28 47 29 54 33 58 L36 56 C33 51 32.5 46 33.5 40 Z" />
      <path d="M66.5 40 C68 47 67 54 63 58 L60 56 C63 51 63.5 46 62.5 40 Z" />
    </g>
  );

  if (c.hairStyle === 'curls') {
    return (
      <g fill={c.hair}>
        <circle cx="31" cy="41" r="4" />
        <circle cx="35.5" cy="37.5" r="3.4" />
        <circle cx="65" cy="41" r="4" />
        <circle cx="60.5" cy="37.5" r="3.4" />
        <circle cx="30.5" cy="48" r="3.1" />
        <circle cx="65.5" cy="48" r="3.1" />
      </g>
    );
  }

  if (c.hairStyle === 'tufts') {
    return (
      <g fill={c.hair}>
        {sideburns}
        <path d="M32.5 38 Q35 41.5 38 38 Q38.5 42.5 35 43.5 Q32 42.5 32.5 38 Z" />
        <path d="M63.5 38 Q61 41.5 58 38 Q57.5 42.5 61 43.5 Q64 42.5 63.5 38 Z" />
      </g>
    );
  }

  if (c.hairStyle === 'dreadlocks') {
    return (
      <g>
        {sideburns}
        <g stroke={c.hair} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M32 40 C30 45 30 50 32 54" />
          <path d="M64 40 C66 45 66 50 64 54" />
        </g>
      </g>
    );
  }

  return sideburns;
}

function PlumberFace({ c }) {
  const browColor = c.hair;
  const browWidth = c.brows === 'bushy' ? 3.2 : 2.2;
  const lipColor = '#6b2f2a';
  const mouthShift = c.mustache ? 'translate(0 2.2)' : undefined;

  return (
    <g>
      <g stroke={browColor} strokeWidth={browWidth} strokeLinecap="round" fill="none">
        <path d="M36.3 42 Q40 39 43.7 42" />
        <path d="M52.3 42 Q56 39 59.7 42" />
      </g>

      <g className="av-plumber-eyes">
        <ellipse cx="40.6" cy="48.2" rx="4" ry="4.9" fill="#fff" />
        <ellipse cx="55.4" cy="48.2" rx="4" ry="4.9" fill="#fff" />
        <circle cx="41.3" cy="48.8" r="2.4" fill={c.eyes} />
        <circle cx="56.1" cy="48.8" r="2.4" fill={c.eyes} />
        <circle cx="41.3" cy="48.8" r="1.1" fill="#1b1218" />
        <circle cx="56.1" cy="48.8" r="1.1" fill="#1b1218" />
        <circle cx="40.3" cy="47.4" r="0.8" fill="#fff" />
        <circle cx="55.1" cy="47.4" r="0.8" fill="#fff" />
      </g>

      <path d="M45.4 50.5 C44.8 53.4 46 55.8 48 55.8 C50 55.8 51.2 53.4 50.6 50.5 Z" fill={c.skinShade} />
      <ellipse cx="46.9" cy="51.7" rx="1.2" ry="0.8" fill="#fff" opacity="0.28" />

      {c.rosy && (
        <g fill="#ff6b81" opacity="0.22">
          <ellipse cx="34.5" cy="55.5" rx="4" ry="2.4" />
          <ellipse cx="61.5" cy="55.5" rx="4" ry="2.4" />
        </g>
      )}

      {c.freckles && (
        <g fill={c.skinShade} opacity="0.75">
          <circle cx="34.3" cy="53.2" r="0.75" />
          <circle cx="36.4" cy="54.4" r="0.65" />
          <circle cx="33.6" cy="55.3" r="0.55" />
          <circle cx="61.7" cy="53.2" r="0.75" />
          <circle cx="59.6" cy="54.4" r="0.65" />
          <circle cx="62.4" cy="55.3" r="0.55" />
        </g>
      )}

      {c.older && (
        <g stroke={c.skinShade} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.8">
          <path d="M33.5 50.5 Q35 52 33.8 53.5" />
          <path d="M62.5 50.5 Q61 52 62.2 53.5" />
        </g>
      )}

      {c.beard === 'stubble' && (
        <path
          d="M31 54 C32 66 38 69 48 69 C58 69 64 66 65 54 C62 63 56 65 48 65 C40 65 34 63 31 54 Z"
          fill={c.beardColor || c.hair}
          opacity="0.28"
        />
      )}

      {c.beard === 'full' && (
        <path
          d="M30 50 C30 70 37 75 48 75 C59 75 66 70 66 50 C64 63 58 66 48 66 C38 66 32 63 30 50 Z"
          fill={c.beardColor || c.hair}
        />
      )}

      {c.mustache === 'big' && (
        <path
          className="av-mustache"
          d="M35 55.5 C38.5 51.5 44 53.5 48 57.5 C52 53.5 57.5 51.5 61 55.5 C57.5 62.5 52.5 63.5 48 60.5 C43.5 63.5 38.5 62.5 35 55.5 Z"
          fill={c.beardColor || c.hair}
        />
      )}

      {c.mustache === 'small' && (
        <path
          className="av-mustache"
          d="M40 56.5 C43 54.5 46 55.5 48 58 C50 55.5 53 54.5 56 56.5 C53.5 60.5 50 61 48 59.5 C46 61 42.5 60.5 40 56.5 Z"
          fill={c.beardColor || c.hair}
        />
      )}

      <g transform={mouthShift}>
        {c.mouth === 'open' ? (
          <g>
            <path d="M41.5 59.5 Q48 70 54.5 59.5 Q48 62 41.5 59.5 Z" fill="#5b2230" />
            <path d="M43 60.3 Q48 61.8 53 60.3 L52.5 62.2 Q48 63.6 43.5 62.2 Z" fill="#fff" />
            {c.toothGap && <rect x="47.4" y="59.9" width="1.3" height="2.7" fill="#5b2230" />}
            <ellipse cx="48" cy="66.3" rx="3" ry="1.7" fill="#e56b8a" />
          </g>
        ) : (
          <g>
            <path
              d="M42 61 Q48 66.5 54 61"
              stroke={lipColor}
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            {c.mouth === 'grin' && (
              <path d="M43.5 61.8 Q48 64.6 52.5 61.8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
            )}
            {c.goldTooth && <rect x="47.2" y="61.3" width="1.6" height="1.6" rx="0.3" fill="#ffd166" />}
          </g>
        )}
      </g>

      {c.glasses && (
        <g fill="rgba(255,255,255,0.06)" stroke="#26202f" strokeWidth="2">
          <rect x="33.8" y="43.4" width="12.5" height="10.5" rx="4" />
          <rect x="49.7" y="43.4" width="12.5" height="10.5" rx="4" />
          <path d="M46.3 47.6 H49.7" fill="none" />
          <path d="M33.8 46.6 H29.4" fill="none" strokeLinecap="round" />
          <path d="M62.2 46.6 H66.6" fill="none" strokeLinecap="round" />
        </g>
      )}

      {c.earring && (
        <circle cx="27.6" cy="56.5" r="2.1" fill="none" stroke="#ffd166" strokeWidth="1.4" />
      )}
    </g>
  );
}

function SimpleFace({
  c, cx = 48, cy = 52, scale = 1, eyeGap = 6.5,
  mouthY = 7, cheeks = true, openMouth = false,
}) {
  const eyeColor = c.eyeColor || '#2f5d8a';
  const mouthColor = c.mouthColor || '#5b2230';
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <g className="av-face-eyes">
        <ellipse cx={-eyeGap} cy="0" rx="4.1" ry="4.9" fill="#fff" />
        <ellipse cx={eyeGap} cy="0" rx="4.1" ry="4.9" fill="#fff" />
        <circle cx={-eyeGap + 0.6} cy="0.7" r="2.4" fill={eyeColor} />
        <circle cx={eyeGap + 0.6} cy="0.7" r="2.4" fill={eyeColor} />
        <circle cx={-eyeGap + 0.6} cy="0.7" r="1.1" fill="#1b1218" />
        <circle cx={eyeGap + 0.6} cy="0.7" r="1.1" fill="#1b1218" />
        <circle cx={-eyeGap - 0.2} cy="-0.6" r="0.8" fill="#fff" />
        <circle cx={eyeGap - 0.2} cy="-0.6" r="0.8" fill="#fff" />
      </g>

      {cheeks && (
        <g fill="#ff6b81" opacity="0.26">
          <ellipse cx={-eyeGap - 4.5} cy={mouthY - 1.5} rx="3.4" ry="2.1" />
          <ellipse cx={eyeGap + 4.5} cy={mouthY - 1.5} rx="3.4" ry="2.1" />
        </g>
      )}

      {openMouth ? (
        <g>
          <path
            d={`M-5 ${mouthY} Q0 ${mouthY + 8} 5 ${mouthY} Q0 ${mouthY + 3} -5 ${mouthY} Z`}
            fill={mouthColor}
          />
          <path
            d={`M-3.4 ${mouthY + 0.8} Q0 ${mouthY + 2.2} 3.4 ${mouthY + 0.8}`}
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ) : (
        <path
          d={`M-4.8 ${mouthY} Q0 ${mouthY + 6} 4.8 ${mouthY}`}
          stroke={mouthColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  );
}

function PlumberScene({ c, capGradient }) {
  return (
    <g>
      <path d="M6 96 C8 79 26 70 48 70 C70 70 88 79 90 96 Z" fill={c.shirt} />
      <path d="M8 96 C10 82 27 74 48 74 C69 74 86 82 88 96 Z" fill={c.shirt} opacity="0.35" />

      <HairBack c={c} />

      <path d="M40 58 H56 V72 Q48 78 40 72 Z" fill={c.skin} />
      <path d="M40 64 Q48 70 56 64 V70 Q48 76 40 70 Z" fill={c.skinShade} opacity="0.5" />

      <path d="M30 84 L32.5 72 L38.5 73.5 L36 86 Z" fill={c.overalls} />
      <path d="M66 84 L63.5 72 L57.5 73.5 L60 86 Z" fill={c.overalls} />
      <path d="M27 96 C28 84 36 79 48 79 C60 79 68 84 69 96 Z" fill={c.overalls} />
      <path d="M27 96 C28 84 36 79 48 79 C60 79 68 84 69 96 Z" fill="#fff" opacity="0.05" />
      <circle cx="36.2" cy="86.5" r="2" fill={c.button} />
      <circle cx="59.8" cy="86.5" r="2" fill={c.button} />
      <path d="M41 80 Q48 85 55 80" stroke={c.skinShade} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.45" />

      <HairFront c={c} />

      <circle cx="28.8" cy="49.5" r="5.2" fill={c.skin} />
      <circle cx="67.2" cy="49.5" r="5.2" fill={c.skin} />
      <circle cx="28.8" cy="49.5" r="2.4" fill={c.skinShade} opacity="0.55" />
      <circle cx="67.2" cy="49.5" r="2.4" fill={c.skinShade} opacity="0.55" />

      <ellipse cx="48" cy="47" rx="19" ry="20" fill={c.skin} />
      <ellipse cx="48" cy="56" rx="16" ry="9" fill={c.skinShade} opacity="0.12" />

      <path
        d="M27.5 37.5 C27.5 19 36 12 48 12 C60 12 68.5 19 68.5 37.5 Z"
        fill={`url(#${capGradient})`}
      />
      <path d="M31 29 C35 23 42 20 50 20.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.28" />
      <path d="M48 12 V37" stroke={c.capDark} strokeWidth="1.1" opacity="0.3" />
      <path
        d="M23 36.5 C33 29.5 63 29.5 73 36.5 C75 40 72.5 42.5 68.5 42.5 L27.5 42.5 C23.5 42.5 21 40 23 36.5 Z"
        fill={c.capDark}
      />
      <path d="M29 36.5 C38 32 58 32 67 36.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.22" />

      <circle cx="48" cy="25" r="5.7" fill={c.emblemBg || '#fff'} opacity="0.95" />
      <g transform="translate(48 25)">
        <Emblem type={c.emblem} color={c.emblemColor} />
      </g>

      <PlumberFace c={c} />
    </g>
  );
}

function FlowerScene({ c }) {
  return (
    <g>
      <path d="M48 96 C41 86 43 72 48 64" stroke={c.stem} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M45 92 C41 84 42 74 46 66" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.18" />

      <g className="av-flower-leaves">
        <path d="M43 80 C33 79 27 71 30 64 C38 66 43 71 45 78 Z" fill={c.leaf} />
        <path d="M53 80 C63 79 69 71 66 64 C58 66 53 71 51 78 Z" fill={c.leaf} />
        <path d="M31 66 C36 68 40 72 43 77" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.22" />
        <path d="M65 66 C60 68 56 72 53 77" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.22" />
      </g>

      <g className="av-flower-petals">
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse
            key={i}
            cx="48"
            cy="27"
            rx="5.8"
            ry="10.5"
            fill={i % 2 ? c.petalLight : c.petal}
            transform={`rotate(${i * 30} 48 42)`}
          />
        ))}
      </g>

      <circle cx="48" cy="42" r="16.5" fill={c.center} />
      <circle cx="48" cy="42" r="16.5" fill="none" stroke={c.centerShade} strokeWidth="2" opacity="0.5" />
      <circle cx="48" cy="42" r="12.5" fill={c.center} />
      <g fill={c.centerShade} opacity="0.35">
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <circle key={i} cx={48 + Math.cos(a) * 14} cy={42 + Math.sin(a) * 14} r="0.8" />;
        })}
      </g>

      <SimpleFace c={c} cx={48} cy={42} scale={0.9} eyeGap={6.2} mouthY={7} />

      <path d="M38 58 Q48 66 58 58 Q54 64 48 65 Q42 64 38 58 Z" fill={c.stem} />
    </g>
  );
}

function PineScene({ c }) {
  return (
    <g>
      <g fill="#fff" opacity="0.5">
        <circle cx="20" cy="20" r="1.4" />
        <circle cx="78" cy="30" r="1.1" />
        <circle cx="66" cy="14" r="1" />
        <circle cx="14" cy="44" r="1" />
        <circle cx="84" cy="54" r="1.3" />
      </g>

      <path d="M42 78 H54 V94 Q48 99 42 94 Z" fill={c.trunk} />

      <path d="M48 30 L20 72 Q48 79 76 72 Z" fill={c.treeDark} />
      <path d="M48 38 L28 68 Q48 75 68 68 Z" fill={c.tree} />
      <path d="M48 18 L26 54 Q48 61 70 54 Z" fill={c.treeDark} />
      <path d="M48 26 L32 51 Q48 57 64 51 Z" fill={c.treeLight} />
      <path d="M48 8 L34 34 Q48 40 62 34 Z" fill={c.tree} />
      <path d="M34 34 Q41 29 48 28" stroke="#fff" strokeWidth="2" opacity="0.3" strokeLinecap="round" fill="none" />

      <path d="M28 68 C20 66 15 59 17 53" stroke={c.treeDark} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M68 68 C76 66 81 59 79 53" stroke={c.treeDark} strokeWidth="4" strokeLinecap="round" fill="none" />

      <g className="av-pine-star">
        <g transform="translate(48 6) scale(0.95)">
          <path
            d="M0 -4 L1.2 -1.2 L4.2 -1.2 L1.7 0.6 L2.6 3.6 L0 1.8 L-2.6 3.6 L-1.7 0.6 L-4.2 -1.2 L-1.2 -1.2 Z"
            fill={c.star}
          />
        </g>
      </g>

      <ellipse cx="48" cy="58" rx="12.5" ry="12" fill={c.treeLight} />
      <SimpleFace c={c} cx={48} cy={56} scale={0.85} eyeGap={6} mouthY={7} />

      <g className="av-pine-scarf">
        <path d="M34 70 Q48 77 62 70 L64 76 Q48 83 32 76 Z" fill={c.scarf} />
        <path d="M58 76 L63 88 L55 84 Z" fill={c.scarf} />
        <path d="M36 73 Q48 78 60 73" stroke={c.scarfLight} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75" />
      </g>
    </g>
  );
}

function CloudScene({ c }) {
  return (
    <g>
      <g className="av-cloud-rainbow" fill="none" strokeWidth="3" opacity="0.28" strokeLinecap="round">
        <path d="M22 62 Q48 34 74 62" stroke="#ff6f91" />
        <path d="M27 64 Q48 40 69 64" stroke="#ffd166" />
        <path d="M32 66 Q48 46 64 66" stroke="#4cc9f0" />
      </g>

      <g fill={c.rain} opacity="0.75">
        <path d="M18 24 L19.2 27 L22.2 28.2 L19.2 29.4 L18 32.4 L16.8 29.4 L13.8 28.2 L16.8 27 Z" />
        <path d="M78 42 L79 44.4 L81.4 45.4 L79 46.4 L78 48.8 L77 46.4 L74.6 45.4 L77 44.4 Z" />
      </g>

      <path
        d="M18 64 C9 64 7 51 16 47 C14 33 30 27 38 37 C42 22 64 22 68 37 C80 32 88 46 80 56 C87 65 78 74 68 69 C62 80 38 80 30 70 C23 74 14 70 18 64 Z"
        fill={c.cloud}
      />
      <ellipse cx="48" cy="67" rx="23" ry="7" fill={c.cloudShade} opacity="0.45" />

      <SimpleFace c={c} cx={48} cy={52} scale={0.95} eyeGap={6.5} mouthY={8} openMouth />

      <g className="av-cloud-rain" fill={c.rain} opacity="0.85">
        <path d="M28 78 C30 81 31 83 31 84 A3 3 0 0 1 25 84 C25 83 26 81 28 78 Z" />
        <path d="M48 82 C50 85 51 87 51 88 A3 3 0 0 1 45 88 C45 87 46 85 48 82 Z" />
        <path d="M68 78 C70 81 71 83 71 84 A3 3 0 0 1 65 84 C65 83 66 81 68 78 Z" />
      </g>
    </g>
  );
}

function RocketScene({ c }) {
  return (
    <g>
      <g className="av-stars" fill="#fff" opacity="0.85">
        <circle cx="18" cy="20" r="1.2" />
        <circle cx="80" cy="26" r="1" />
        <circle cx="26" cy="42" r="0.9" />
        <circle cx="72" cy="12" r="1.4" />
        <path d="M78 46 L78.8 48 L80.8 48.8 L78.8 49.6 L78 51.6 L77.2 49.6 L75.2 48.8 L77.2 48 Z" />
      </g>

      <g className="av-rocket-flame">
        <path
          d="M38 76 C40 88 44 94 48 96 C52 94 56 88 58 76 C54 82 51 84 48 84 C45 84 42 82 38 76 Z"
          fill={c.flame}
        />
        <path
          d="M43 78 C45 86 46 89 48 91 C50 89 51 86 53 78 C51 82 49 83 48 83 C47 83 45 82 43 78 Z"
          fill={c.flameInner}
        />
      </g>

      <path d="M36 56 L22 80 L36 74 Z" fill={c.fin} />
      <path d="M60 56 L74 80 L60 74 Z" fill={c.fin} />

      <path d="M48 10 C57 20 61 32 61 48 L61 76 L35 76 L35 48 C35 32 39 20 48 10 Z" fill={c.body} />
      <path d="M48 10 C57 20 61 32 61 48 L61 76 L52 76 L52 20 Z" fill={c.bodyShade} opacity="0.55" />
      <path d="M48 8 C54 16 58 25 59 34 L37 34 C38 25 42 16 48 8 Z" fill={c.nose} />
      <path d="M48 8 C52 14 55 20 57 27" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.25" />

      <rect x="35" y="64" width="26" height="4" fill={c.nose} opacity="0.8" />
      <rect x="41" y="74" width="14" height="6" rx="2" fill={c.windowRim} />

      <circle cx="48" cy="46" r="12" fill={c.windowRim} />
      <circle cx="48" cy="46" r="9.5" fill={c.window} />
      <circle cx="44" cy="42" r="3" fill="#fff" opacity="0.2" />

      <g transform="translate(48 46) scale(0.65)">
        <SimpleFace c={c} cx={0} cy={0} scale={1} eyeGap={6.5} mouthY={7} cheeks={false} />
      </g>

      <g fill={c.bodyShade}>
        <circle cx="40" cy="62" r="1.2" />
        <circle cx="56" cy="62" r="1.2" />
        <circle cx="40" cy="70" r="1.2" />
        <circle cx="56" cy="70" r="1.2" />
      </g>
    </g>
  );
}

function MushroomScene({ c }) {
  return (
    <g>
      <g fill={c.grass}>
        <path d="M8 96 Q15 82 22 96 Z" />
        <path d="M24 96 Q30 84 36 96 Z" />
        <path d="M60 96 Q66 84 72 96 Z" />
        <path d="M74 96 Q81 82 88 96 Z" />
      </g>

      <path d="M36 56 H60 V82 Q48 92 36 82 Z" fill={c.stem} />
      <path d="M52 56 H60 V82 Q56 86 52 87 Z" fill={c.stemShade} opacity="0.5" />
      <circle cx="34" cy="68" r="5" fill={c.stem} />
      <circle cx="62" cy="68" r="5" fill={c.stem} />

      <g className="av-mushroom-cap">
        <path d="M16 54 C16 28 32 16 48 16 C64 16 80 28 80 54 Z" fill={c.cap} />
        <path d="M22 50 C26 32 36 24 48 24 C60 24 70 32 74 50 Z" fill={c.capLight} opacity="0.35" />
        <g fill={c.spot}>
          <ellipse cx="30" cy="42" rx="6" ry="5" />
          <ellipse cx="48" cy="30" rx="5" ry="4.5" />
          <ellipse cx="66" cy="43" rx="5.5" ry="4.5" />
          <ellipse cx="40" cy="52" rx="3" ry="2.4" />
          <ellipse cx="59" cy="52" rx="3.4" ry="2.6" />
        </g>
      </g>

      <SimpleFace c={c} cx={48} cy={66} scale={0.72} eyeGap={5.4} mouthY={6.5} />
    </g>
  );
}

function CactusScene({ c }) {
  return (
    <g>
      <circle cx="76" cy="22" r="10" fill={c.glow} opacity="0.35" />
      <path d="M0 88 Q24 80 48 86 Q72 92 96 84 V96 H0 Z" fill={c.sand} opacity="0.45" />

      <path d="M30 78 H66 L62 96 H34 Z" fill={c.pot} />
      <rect x="27" y="74" width="42" height="7" rx="2.5" fill={c.potLight} />

      <path d="M40 58 C31 58 28 50 30 42" stroke={c.cactus} strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M56 62 C65 62 68 54 66 46" stroke={c.cactus} strokeWidth="9" strokeLinecap="round" fill="none" />

      <rect x="39" y="34" width="18" height="48" rx="9" fill={c.cactus} />
      <path d="M45 38 V80" stroke={c.cactusDark} strokeWidth="1.3" opacity="0.4" />
      <path d="M51 38 V80" stroke={c.cactusDark} strokeWidth="1.3" opacity="0.4" />
      <path d="M42 40 C41 50 41 64 42 74" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.12" />

      <g stroke={c.cactusLight} strokeWidth="1.1" strokeLinecap="round">
        <path d="M39 44 L36 43" />
        <path d="M39 52 L36 51" />
        <path d="M57 48 L60 47" />
        <path d="M57 56 L60 55" />
      </g>

      <g className="av-cactus-flower">
        <g fill={c.flower}>
          <ellipse cx="48" cy="28" rx="4" ry="7" />
          <ellipse cx="41" cy="32" rx="7" ry="4" />
          <ellipse cx="55" cy="32" rx="7" ry="4" />
          <ellipse cx="42" cy="24" rx="5" ry="4" transform="rotate(-30 42 24)" />
          <ellipse cx="54" cy="24" rx="5" ry="4" transform="rotate(30 54 24)" />
        </g>
        <circle cx="48" cy="30" r="4.2" fill={c.flowerCenter} />
      </g>

      <SimpleFace c={c} cx={48} cy={57} scale={0.78} eyeGap={5.2} mouthY={6.5} cheeks={false} />
    </g>
  );
}

function PlanetScene({ c }) {
  return (
    <g>
      <g className="av-stars" fill="#fff" opacity="0.8">
        <circle cx="16" cy="18" r="1.2" />
        <circle cx="80" cy="20" r="1" />
        <circle cx="20" cy="72" r="1.1" />
        <circle cx="84" cy="70" r="1.3" />
        <path d="M70 10 L70.8 12 L72.8 12.8 L70.8 13.6 L70 15.6 L69.2 13.6 L67.2 12.8 L69.2 12 Z" />
      </g>

      <g transform="rotate(-16 48 51)">
        <ellipse cx="48" cy="51" rx="38" ry="10" fill="none" stroke={c.ring} strokeWidth="5" opacity="0.5" />
      </g>

      <circle cx="48" cy="51" r="25" fill={c.planet} />
      <path
        d="M27 44 C33 36 44 33 54 37 C62 40 66 46 68 52 C58 47 45 46 35 52 C31 54 28 56 26 60 C23 55 24 49 27 44 Z"
        fill={c.land}
        opacity="0.7"
      />
      <circle cx="48" cy="51" r="25" fill="none" stroke={c.planetDark} strokeWidth="2" opacity="0.35" />

      <g transform="rotate(-16 48 51)">
        <path
          d="M10 51 C10 56.5 27 61 48 61 C69 61 86 56.5 86 51"
          fill="none"
          stroke={c.ringLight}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      <SimpleFace c={c} cx={48} cy={49} scale={0.9} eyeGap={6.5} mouthY={8} />

      <g className="av-planet-moon">
        <circle cx="78" cy="36" r="4" fill={c.ringLight} opacity="0.9" />
        <circle cx="76.5" cy="35" r="1.2" fill="#c9a227" opacity="0.6" />
      </g>
    </g>
  );
}

function RobotScene({ c }) {
  return (
    <g>
      <path d="M48 26 V16" stroke={c.metalDark} strokeWidth="2.5" strokeLinecap="round" />
      <g className="av-robot-antenna">
        <circle cx="48" cy="14" r="4" fill={c.accent} />
        <circle cx="48" cy="14" r="4" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5" />
      </g>

      <path d="M18 96 C20 78 32 70 48 70 C64 70 76 78 78 96 Z" fill={c.metal} />
      <path d="M18 96 C20 78 32 70 48 70 C64 70 76 78 78 96 Z" fill="#fff" opacity="0.05" />

      <rect x="27" y="26" width="42" height="42" rx="10" fill={c.metal} />
      <rect x="31" y="30" width="34" height="34" rx="7" fill={c.screen} />
      <path d="M33 31 H63" stroke="#fff" strokeWidth="2" opacity="0.12" strokeLinecap="round" />

      <rect x="22" y="44" width="6" height="12" rx="2" fill={c.metalDark} />
      <rect x="68" y="44" width="6" height="12" rx="2" fill={c.metalDark} />

      <g>
        <g className="av-robot-eyes">
          <rect x="37" y="40" width="7" height="7" rx="2" fill={c.neon} />
          <rect x="52" y="40" width="7" height="7" rx="2" fill={c.neon} />
          <rect x="37" y="40" width="7" height="3" rx="1.5" fill="#fff" opacity="0.35" />
          <rect x="52" y="40" width="7" height="3" rx="1.5" fill="#fff" opacity="0.35" />
        </g>
        <path d="M42 52 Q48 57 54 52" stroke={c.neon} strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>

      <rect x="38" y="80" width="20" height="12" rx="3" fill={c.screen} />
      <circle cx="43" cy="86" r="2" fill={c.neon} />
      <circle cx="48" cy="86" r="2" fill={c.accent} />
      <circle cx="53" cy="86" r="2" fill={c.neon} />

      <circle cx="26" cy="74" r="2" fill={c.metalDark} />
      <circle cx="70" cy="74" r="2" fill={c.metalDark} />
    </g>
  );
}

function CoffeeFlower({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-4.5"
          rx="2.4"
          ry="3.6"
          fill="#fff"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r="1.8" fill="#ffd166" />
    </g>
  );
}

function CoffeeScene({ c }) {
  return (
    <g>
      <circle cx="78" cy="22" r="12" fill={c.glow} opacity="0.3" />
      <path d="M0 84 Q20 70 42 80 Q66 92 96 76 V96 H0 Z" fill={c.hill} opacity="0.55" />
      <path d="M0 91 Q26 80 52 88 Q74 96 96 86 V96 H0 Z" fill={c.hillDark} opacity="0.7" />

      <CoffeeFlower x={16} y={28} scale={0.9} />
      <CoffeeFlower x={82} y={30} scale={0.75} />
      <CoffeeFlower x={84} y={52} scale={0.6} />
      <CoffeeFlower x={13} y={52} scale={0.6} />

      <g className="av-coffee-sprout">
        <path d="M48 30 Q46 21 48 13" stroke={c.stem} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M47 23 C39 23 34 17 36 10 C44 9 48 15 47 23 Z" fill={c.leaf} />
        <path d="M48 19 C56 19 61 13 59 6 C51 5 47 11 48 19 Z" fill={c.leafLight} />
        <path d="M44 19 C41 17 38 15 37 12" stroke="#fff" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />
      </g>

      <path d="M23 62 C17 62 14 57 15 52" stroke={c.bean} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M73 62 C79 62 82 57 81 52" stroke={c.bean} strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="15" cy="51" r="4.2" fill={c.beanLight} />
      <circle cx="81" cy="51" r="4.2" fill={c.beanLight} />

      <ellipse cx="48" cy="57" rx="27" ry="29" fill={c.bean} transform="rotate(-6 48 57)" />
      <ellipse cx="38" cy="45" rx="8" ry="13" fill="#fff" opacity="0.1" transform="rotate(-20 38 45)" />
      <ellipse cx="58" cy="76" rx="14" ry="8" fill={c.beanDark} opacity="0.25" />

      <path
        d="M39 30 C33 42 37 54 34 66 C32 75 35 82 38 87"
        stroke={c.crease}
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <path d="M40 31 C35 42 38 53 36 64" stroke="#fff" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.12" />

      <SimpleFace c={c} cx={52} cy={53} scale={0.86} eyeGap={6.2} mouthY={7.5} />

      <path d="M25 72 Q48 79 71 72 L71.5 77 Q48 84 24.5 77 Z" fill={c.ribbonYellow} />
      <path d="M24.5 77 Q48 84 71.5 77 L72 82 Q48 89 24 82 Z" fill={c.ribbonBlue} />
      <path d="M24 82 Q48 89 72 82 L71 87 Q48 94 23 87 Z" fill={c.ribbonRed} />
      <g className="av-coffee-ribbon">
        <path d="M70 77 Q78 79 80 87 L73 84 Q73 80 68 79 Z" fill={c.ribbonRed} />
        <circle cx="70" cy="77" r="3" fill={c.ribbonYellow} />
      </g>
    </g>
  );
}

function EagleScene({ c }) {
  return (
    <g>
      <g className="av-stars" fill="#fff" opacity="0.85">
        <path d="M16 18 L17 14.5 L18 18 L21.5 19 L18 20 L17 23.5 L16 20 L12.5 19 Z" />
        <path d="M82 22 L82.7 19.3 L83.4 22 L86.1 22.7 L83.4 23.4 L82.7 26.1 L82 23.4 L79.3 22.7 Z" />
        <path d="M12 42 L12.6 39.8 L13.2 42 L15.4 42.6 L13.2 43.2 L12.6 45.4 L12 43.2 L9.8 42.6 Z" />
        <path d="M85 47 L85.7 44.3 L86.4 47 L89.1 47.7 L86.4 48.4 L85.7 51.1 L85 48.4 L82.3 47.7 Z" />
      </g>

      <g opacity="0.2">
        <rect x="0" y="87" width="96" height="3" fill="#fff" />
        <rect x="0" y="92" width="96" height="3" fill={c.trimRed} />
      </g>

      <path d="M8 96 C11 78 28 70 48 70 C68 70 85 78 88 96 Z" fill={c.feather} />
      <g fill={c.featherLight} opacity="0.55">
        <path d="M18 88 Q24 82 30 88 Q36 82 42 88 Q48 82 54 88 Q60 82 66 88 Q72 82 78 88 L78 92 Q72 86 66 92 Q60 86 54 92 Q48 86 42 92 Q36 86 30 92 Q24 86 18 92 Z" />
      </g>

      <path d="M38 62 Q48 70 58 62 L60 78 Q48 84 36 78 Z" fill={c.head} />
      <path d="M40 66 Q48 72 56 66" stroke={c.headShade} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.6" />

      <path d="M22 76 Q48 84 74 76 L76 86 Q48 94 20 86 Z" fill={c.scarf} />
      <path d="M20 86 Q48 94 76 86 L76 90 Q48 98 20 90 Z" fill={c.trimRed} />
      <path d="M20 90 Q48 98 76 90 L76 93 Q48 100 20 93 Z" fill={c.trimWhite} opacity="0.9" />

      <g fill="#fff">
        <path d="M34 80 L34.8 77.6 L35.6 80 L38 80.8 L35.6 81.6 L34.8 84 L34 81.6 L31.6 80.8 Z" />
        <path d="M48 82 L48.9 79.3 L49.8 82 L52.5 82.9 L49.8 83.8 L48.9 86.5 L48 83.8 L45.3 82.9 Z" />
        <path d="M62 80 L62.8 77.6 L63.6 80 L66 80.8 L63.6 81.6 L62.8 84 L62 81.6 L59.6 80.8 Z" />
      </g>

      <path d="M72 80 Q80 82 82 90 L74 87 Q74 84 70 82 Z" fill={c.scarf} />
      <path d="M73 84 Q77 86 78 90" stroke={c.trimWhite} strokeWidth="1" fill="none" opacity="0.5" />

      <g className="av-eagle-head">
        <g fill={c.head}>
          <path d="M33 31 Q28 20 34 18 Q35 24 40 29 Z" />
          <path d="M42 27 Q40 15 48 13 Q49 20 50 27 Z" />
          <path d="M54 27 Q58 16 63 20 Q59 24 58 31 Z" />
        </g>

        <ellipse cx="48" cy="45" rx="20" ry="19" fill={c.head} />
        <ellipse cx="48" cy="52" rx="16" ry="10" fill={c.headShade} opacity="0.35" />

        <g stroke={c.headShade} strokeWidth="1" strokeLinecap="round" opacity="0.6">
          <path d="M32 48 Q35 49 37 48" />
          <path d="M64 48 Q61 49 59 48" />
        </g>

        <path d="M34.5 40 L43.5 42" stroke={c.brow} strokeWidth="3.6" strokeLinecap="round" />
        <path d="M61.5 40 L52.5 42" stroke={c.brow} strokeWidth="3.6" strokeLinecap="round" />

        <g className="av-eagle-eyes">
          <ellipse cx="40.5" cy="45.5" rx="4.4" ry="5" fill="#fff" />
          <ellipse cx="55.5" cy="45.5" rx="4.4" ry="5" fill="#fff" />
          <circle cx="41" cy="46" r="2.8" fill={c.eye} />
          <circle cx="56" cy="46" r="2.8" fill={c.eye} />
          <circle cx="41" cy="46" r="1.3" fill="#1b1218" />
          <circle cx="56" cy="46" r="1.3" fill="#1b1218" />
          <circle cx="40" cy="44.8" r="0.9" fill="#fff" />
          <circle cx="55" cy="44.8" r="0.9" fill="#fff" />
        </g>

        <path
          d="M48 46 C53 46 58 50 58 54 C58 58 54 60 52 60 L48 66 L44 60 C42 60 38 58 38 54 C38 50 43 46 48 46 Z"
          fill={c.beak}
        />
        <path
          d="M44 57 C46 59 50 59 52 57 C51 61 49 64 48 66 C47 64 45 61 44 57 Z"
          fill={c.beakDark}
        />
        <ellipse cx="45" cy="52" rx="1" ry="0.7" fill={c.beakDark} opacity="0.7" />
        <ellipse cx="51" cy="52" rx="1" ry="0.7" fill={c.beakDark} opacity="0.7" />
        <path d="M40 51 C42 48 46 47 48 47" stroke="#fff" strokeWidth="1.4" fill="none" opacity="0.25" strokeLinecap="round" />
      </g>
    </g>
  );
}

function AxolotlScene({ c }) {
  return (
    <g>
      <g className="av-axolotl-bubbles" fill="none" stroke="#cdeff5" opacity="0.5">
        <circle cx="17" cy="30" r="3" />
        <circle cx="82" cy="26" r="2.2" />
        <circle cx="86" cy="45" r="1.8" />
        <circle cx="11" cy="52" r="2.4" />
        <circle cx="76" cy="60" r="1.5" />
      </g>

      <g stroke={c.plant} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.75">
        <path d="M7 96 C5 88 9 82 6 76" />
        <path d="M13 96 C15 87 11 83 15 77" />
        <path d="M89 96 C91 88 87 82 90 76" />
        <path d="M83 96 C81 88 85 84 82 78" />
      </g>

      <path d="M16 96 C18 82 30 75 48 75 C66 75 78 82 80 96 Z" fill={c.body} />

      <path d="M18 82 Q48 90 78 82 L80 96 H16 Z" fill="#2a9d8f" />
      <path d="M22 83 L20 96 H27 L28 84 Z" fill="#fff" />
      <path d="M31 85 L30 96 H37 L37 85.5 Z" fill="#ce1126" />
      <path d="M40 86 L40 96 H47 L46 86 Z" fill="#ffd166" />
      <path d="M50 86 L50 96 H57 L56 86 Z" fill="#ce1126" />
      <path d="M60 85.5 L60 96 H67 L66 85 Z" fill="#fff" />
      <path d="M70 84 L72 96 H79 L77 83 Z" fill="#2a9d8f" />
      <path d="M18 82 Q48 90 78 82" stroke="#ffd166" strokeWidth="2" fill="none" />

      <g className="av-gills-left">
        <g stroke={c.gill} strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M27 41 C18 35 14 28 16 22" />
          <path d="M24 49 C14 47 9 41 9 35" />
          <path d="M25 57 C16 59 12 63 12 69" />
        </g>
        <g stroke={c.gillLight} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9">
          <path d="M21 33 C18 31 17 28 18 25" />
          <path d="M17 42 C14 41 12 38 12 35" />
          <path d="M19 61 C16 63 15 65 15 67" />
        </g>
      </g>
      <g className="av-gills-right">
        <g stroke={c.gill} strokeWidth="4.5" strokeLinecap="round" fill="none">
          <path d="M69 41 C78 35 82 28 80 22" />
          <path d="M72 49 C82 47 87 41 87 35" />
          <path d="M71 57 C80 59 84 63 84 69" />
        </g>
        <g stroke={c.gillLight} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9">
          <path d="M75 33 C78 31 79 28 78 25" />
          <path d="M79 42 C82 41 84 38 84 35" />
          <path d="M77 61 C80 63 81 65 81 67" />
        </g>
      </g>

      <ellipse cx="48" cy="50" rx="25" ry="21" fill={c.body} />
      <ellipse cx="48" cy="56" rx="19" ry="13" fill={c.belly} opacity="0.55" />
      <ellipse cx="48" cy="40" rx="16" ry="5" fill="#fff" opacity="0.12" />

      <circle cx="40" cy="49" r="3.2" fill={c.eye} />
      <circle cx="56" cy="49" r="3.2" fill={c.eye} />
      <circle cx="41" cy="48" r="1.1" fill="#fff" />
      <circle cx="57" cy="48" r="1.1" fill="#fff" />

      <ellipse cx="34.5" cy="56" rx="4" ry="2.3" fill="#ff6b81" opacity="0.35" />
      <ellipse cx="61.5" cy="56" rx="4" ry="2.3" fill="#ff6b81" opacity="0.35" />

      <path d="M38 59 Q48 67 58 59" stroke={c.smile} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M41 59.5 Q48 64.5 55 59.5" stroke="#fff" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />

      <g fill={c.gillLight} opacity="0.8">
        <circle cx="31" cy="37" r="1.2" />
        <circle cx="65" cy="37" r="1.2" />
      </g>
    </g>
  );
}

function Marigold({ x, y, scale = 1, petal, center }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-3"
          rx="2"
          ry="3"
          fill={petal}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r="1.7" fill={center} />
    </g>
  );
}

function HouseScene({ c }) {
  return (
    <g>
      <circle cx="80" cy="17" r="9" fill={c.glow} opacity="0.65" />
      <g fill="#fff" opacity="0.75">
        <ellipse cx="18" cy="26" rx="8" ry="4" />
        <circle cx="15" cy="24" r="4" />
        <circle cx="22" cy="23" r="5" />
      </g>

      <path d="M0 88 Q24 82 48 86 Q72 90 96 84 V96 H0 Z" fill={c.grass} />

      <path d="M10 90 Q20 78 30 90 Z" fill={c.bushDark} />
      <path d="M66 90 Q76 78 86 90 Z" fill={c.bushDark} />
      <g fill={c.flower}>
        <circle cx="17" cy="86" r="2.2" />
        <circle cx="24" cy="88" r="1.8" />
        <circle cx="75" cy="87" r="2" />
        <circle cx="82" cy="86" r="2.2" />
      </g>
      <g fill={c.flowerCenter}>
        <circle cx="17" cy="86" r="0.9" />
        <circle cx="24" cy="88" r="0.8" />
        <circle cx="75" cy="87" r="0.8" />
        <circle cx="82" cy="86" r="0.9" />
      </g>

      <rect x="19" y="44" width="58" height="46" fill={c.wall} />
      <rect x="61" y="44" width="16" height="46" fill={c.wallShade} opacity="0.6" />

      <path d="M8 46 L48 12 L88 46 Z" fill={c.roof} />
      <path d="M9 46 L48 14 L87 46 L84 49 L48 18 L12 49 Z" fill={c.roofDark} opacity="0.55" />
      <path d="M18 46 L48 22 L78 46 Z" fill={c.roofLight} opacity="0.18" />
      <g stroke={c.roofDark} strokeWidth="1" opacity="0.35" fill="none">
        <path d="M20 41 Q48 32 76 41" />
        <path d="M14 45 Q48 35 82 45" />
      </g>
      <path d="M8 46 H88 V50 H8 Z" fill={c.roofDark} />
      <circle cx="48" cy="11" r="2" fill={c.glow} />

      <rect x="64" y="24" width="9" height="18" fill={c.chimney} />
      <g stroke={c.chimneyDark} strokeWidth="1" opacity="0.7">
        <path d="M64 30 H73" />
        <path d="M64 36 H73" />
      </g>
      <rect x="62" y="22" width="13" height="4" rx="1" fill={c.roofLight} />
      <g className="av-house-smoke" fill="#fff" opacity="0.8">
        <path d="M67 17 C65 15 66 13 67.6 13.6 C68 12 70 12.5 70 14 C70 15.5 68 17 67 18 Z" />
        <path d="M73 10 C71 8 72 6 73.6 6.6 C74 5 76 5.5 76 7 C76 8.5 74 10 73 11 Z" />
      </g>

      <g>
        <rect x="29" y="50" width="17" height="17" rx="2" fill={c.frame} />
        <rect x="32" y="53" width="11" height="11" rx="1" fill={c.window} />
        <rect x="50" y="50" width="17" height="17" rx="2" fill={c.frame} />
        <rect x="53" y="53" width="11" height="11" rx="1" fill={c.window} />
        <g className="av-house-eyes">
          <circle cx="37" cy="58" r="2.6" fill={c.eye} />
          <circle cx="37" cy="58" r="1.1" fill="#1b1218" />
          <circle cx="36.2" cy="57" r="0.8" fill="#fff" />
          <circle cx="59" cy="58" r="2.6" fill={c.eye} />
          <circle cx="59" cy="58" r="1.1" fill="#1b1218" />
          <circle cx="58.2" cy="57" r="0.8" fill="#fff" />
        </g>
      </g>

      <g>
        <rect x="27" y="66" width="21" height="4" rx="1" fill={c.bushDark} />
        <rect x="48" y="66" width="21" height="4" rx="1" fill={c.bushDark} />
        <g fill={c.flower}>
          <circle cx="31" cy="65.5" r="1.7" />
          <circle cx="38" cy="65.5" r="1.7" />
          <circle cx="45" cy="65.5" r="1.7" />
          <circle cx="53" cy="65.5" r="1.7" />
          <circle cx="60" cy="65.5" r="1.7" />
          <circle cx="67" cy="65.5" r="1.7" />
        </g>
        <g fill={c.flowerCenter}>
          <circle cx="31" cy="65.5" r="0.7" />
          <circle cx="38" cy="65.5" r="0.7" />
          <circle cx="45" cy="65.5" r="0.7" />
          <circle cx="53" cy="65.5" r="0.7" />
          <circle cx="60" cy="65.5" r="0.7" />
          <circle cx="67" cy="65.5" r="0.7" />
        </g>
      </g>

      <g fill="#ff6b81" opacity="0.3">
        <circle cx="22" cy="63" r="3.5" />
        <circle cx="74" cy="63" r="3.5" />
      </g>

      <path d="M38 72 Q48 79 58 72" stroke={c.eye} strokeWidth="2.4" strokeLinecap="round" fill="none" />

      <rect x="40" y="78" width="16" height="13" rx="2" fill={c.frame} />
      <g className="av-house-door">
        <rect x="42" y="80" width="12" height="11" rx="1" fill={c.door} />
        <rect x="42" y="80" width="12" height="3" fill={c.doorDark} opacity="0.5" />
        <circle cx="51" cy="86" r="1.2" fill={c.flowerCenter} />
      </g>
      <rect x="38" y="89" width="20" height="4" rx="1" fill={c.stone} />
    </g>
  );
}

function CatrinaScene({ c }) {
  return (
    <g>
      <g fill={c.marigold} opacity="0.8">
        <ellipse cx="13" cy="18" rx="2" ry="3.5" transform="rotate(-30 13 18)" />
        <ellipse cx="84" cy="24" rx="2" ry="3.5" transform="rotate(25 84 24)" />
        <ellipse cx="9" cy="52" rx="1.8" ry="3" transform="rotate(40 9 52)" />
        <ellipse cx="88" cy="56" rx="1.8" ry="3" transform="rotate(-35 88 56)" />
      </g>

      <path d="M12 96 C17 79 30 71 48 71 C66 71 79 79 84 96 Z" fill={c.dress} />
      <path d="M20 96 Q48 88 76 96 L78 96 H18 Z" fill={c.dressDark} opacity="0.6" />
      <path d="M34 73 Q48 80 62 73 L64 80 Q48 88 32 80 Z" fill={c.lace} />
      <g fill={c.marigold} opacity="0.9">
        <circle cx="34" cy="86" r="2.2" />
        <circle cx="62" cy="86" r="2.2" />
        <circle cx="48" cy="92" r="2.6" />
      </g>
      <g fill={c.marigoldLight}>
        <circle cx="34" cy="86" r="0.9" />
        <circle cx="62" cy="86" r="0.9" />
        <circle cx="48" cy="92" r="1" />
      </g>

      <path d="M43 60 H53 V73 Q48 77 43 73 Z" fill={c.skull} />
      <path d="M43 66 Q48 70 53 66 V72 Q48 76 43 72 Z" fill={c.skullShade} opacity="0.45" />

      <path d="M27 38 C23 52 24 62 29 70 L34 66 C30 58 30 48 32 38 Z" fill={c.hair} />
      <path d="M69 38 C73 52 72 62 67 70 L62 66 C66 58 66 48 64 38 Z" fill={c.hair} />

      <path
        d="M29 40 C29 24 37 15 48 15 C59 15 67 24 67 40 C67 49 64 55 60 59 L57 66 Q48 71 39 66 L36 59 C32 55 29 49 29 40 Z"
        fill={c.skull}
      />
      <path
        d="M56 24 C62 30 64 40 62 50 C60 58 56 63 52 66 Q48 68 48 64 Q58 58 59 40 C59 32 58 27 56 24 Z"
        fill={c.skullShade}
        opacity="0.4"
      />

      <ellipse cx="39.5" cy="43" rx="6.8" ry="7.6" fill={c.socket} />
      <ellipse cx="56.5" cy="43" rx="6.8" ry="7.6" fill={c.socket} />
      <ellipse cx="39.5" cy="43" rx="4.6" ry="5.4" fill={c.socketLight} opacity="0.5" />
      <ellipse cx="56.5" cy="43" rx="4.6" ry="5.4" fill={c.socketLight} opacity="0.5" />
      <g className="av-catrina-glints">
        <circle cx="40.5" cy="43" r="1.3" fill="#fff" opacity="0.9" />
        <circle cx="57.5" cy="43" r="1.3" fill="#fff" opacity="0.9" />
      </g>
      <circle cx="38.5" cy="46" r="1" fill={c.pink} opacity="0.8" />
      <circle cx="55.5" cy="46" r="1" fill={c.teal} opacity="0.8" />

      <g fill={c.marigold} opacity="0.95">
        <circle cx="32" cy="37" r="1.6" />
        <circle cx="30.5" cy="41" r="1.3" />
        <circle cx="64" cy="37" r="1.6" />
        <circle cx="65.5" cy="41" r="1.3" />
      </g>

      <path d="M48 49 L51.5 55 Q48 58 44.5 55 Z" fill={c.socket} />
      <path d="M48 50 L49.5 53 L48 56 L46.5 53 Z" fill={c.socketLight} opacity="0.4" />

      <path d="M39 60 Q48 66 57 60 Q57 65 48 69 Q39 65 39 60 Z" fill={c.lips} />
      <path d="M39 60 Q48 66 57 60" stroke={c.lipsDark} strokeWidth="1.2" fill="none" />
      <g stroke={c.lipsDark} strokeWidth="0.8" opacity="0.8">
        <path d="M43 61.5 V66" />
        <path d="M48 62.5 V68" />
        <path d="M53 61.5 V66" />
      </g>
      <circle cx="54" cy="63.5" r="0.9" fill={c.gold} />

      <g stroke={c.teal} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M31 50 Q34 52 32 56" />
        <path d="M65 50 Q62 52 64 56" />
      </g>
      <g fill={c.pink}>
        <circle cx="34" cy="49" r="1.1" />
        <circle cx="62" cy="49" r="1.1" />
      </g>

      <path d="M48 30.5 L50.5 33 L48 35.5 L45.5 33 Z" fill={c.teal} />
      <path d="M48 30.5 L50.5 33 L48 35.5 L45.5 33 Z" fill="none" stroke="#fff" strokeWidth="0.7" opacity="0.6" />

      <circle cx="28" cy="52" r="2.2" fill="none" stroke={c.gold} strokeWidth="1.5" />
      <circle cx="68" cy="52" r="2.2" fill="none" stroke={c.gold} strokeWidth="1.5" />

      <g className="av-catrina-hat">
        <ellipse cx="48" cy="24" rx="31" ry="6.5" fill={c.hatDark} />
        <path d="M32 24 C32 10 38 5 48 5 C58 5 64 10 64 24 Z" fill={c.hat} />
        <path d="M34 19 Q48 14 62 19 L62 22 Q48 17 34 22 Z" fill={c.hatBand} />
        <path d="M32 24 Q48 29 64 24" stroke={c.hatBand} strokeWidth="1.2" fill="none" opacity="0.6" />

        <Marigold x={37} y={17.5} scale={0.9} petal={c.marigold} center={c.marigoldLight} />
        <Marigold x={48} y={14.5} scale={1} petal={c.marigold} center={c.marigoldLight} />
        <Marigold x={59} y={17.5} scale={0.9} petal={c.marigold} center={c.marigoldLight} />
        <path d="M44 22 Q48 20 52 22" stroke={c.leaf} strokeWidth="2" strokeLinecap="round" fill="none" />

        <ellipse cx="48" cy="24" rx="31" ry="6.5" fill="none" stroke={c.marigold} strokeWidth="1" opacity="0.45" />
      </g>
    </g>
  );
}

export default function Avatar({ id, className = '', size, style }) {
  const key = CHARACTERS[id] ? id : AVATAR_IDS[0];
  const c = CHARACTERS[key];
  const uid = useId().replace(/:/g, '');
  const capGradient = `cap-${uid}`;
  const bgGradient = `bg-${uid}`;
  const glowGradient = `glow-${uid}`;
  const accent = c.glow || c.cap || '#ffd166';

  return (
    <span
      className={`avatar ${className}`.trim()}
      data-character={key}
      data-kind={c.kind || 'plumber'}
      style={size ? { width: size, height: size, ...style } : style}
      aria-hidden="true"
    >
      <span className="avatar-art">
      <svg viewBox="0 0 96 96" role="presentation" focusable="false">
        <defs>
          <linearGradient id={bgGradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.bg1} />
            <stop offset="100%" stopColor={c.bg2} />
          </linearGradient>
          <radialGradient id={glowGradient} cx="50%" cy="36%" r="58%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={capGradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.capLight || accent} />
            <stop offset="100%" stopColor={c.cap || accent} />
          </linearGradient>
        </defs>

        <rect width="96" height="96" fill={`url(#${bgGradient})`} />
        <circle cx="48" cy="40" r="37" fill={`url(#${glowGradient})`} />
        <ellipse cx="48" cy="98" rx="46" ry="22" fill="#000" opacity="0.16" />

        {c.kind === 'flower' && <FlowerScene c={c} />}
        {c.kind === 'pine' && <PineScene c={c} />}
        {c.kind === 'cloud' && <CloudScene c={c} />}
        {c.kind === 'rocket' && <RocketScene c={c} />}
        {c.kind === 'mushroom' && <MushroomScene c={c} />}
        {c.kind === 'cactus' && <CactusScene c={c} />}
        {c.kind === 'planet' && <PlanetScene c={c} />}
        {c.kind === 'robot' && <RobotScene c={c} />}
        {c.kind === 'coffee' && <CoffeeScene c={c} />}
        {c.kind === 'eagle' && <EagleScene c={c} />}
        {c.kind === 'axolotl' && <AxolotlScene c={c} />}
        {c.kind === 'house' && <HouseScene c={c} />}
        {c.kind === 'catrina' && <CatrinaScene c={c} />}
        {(!c.kind || c.kind === 'plumber') && <PlumberScene c={c} capGradient={capGradient} />}
      </svg>
      </span>
    </span>
  );
}
