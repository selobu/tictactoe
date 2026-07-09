const charData = {
  mario: {
    label: 'Mario',
    hat: '#e52521', hatBand: '#c41c1a', skin: '#f5c9a8',
    hair: '#6b2a1c', eye: '#222', cheek: '#f0a0a0',
    body: '#1c3a8a', bodyHighlight: '#2a50ba', overalls: '#1c3a8a',
    buttons: '#f5d742', shoe: '#6b2a1c', shoeSole: '#4a1a0c',
  },
  luigi: {
    label: 'Luigi',
    hat: '#2e8b2e', hatBand: '#1f6b1f', skin: '#f5c9a8',
    hair: '#6b2a1c', eye: '#222', cheek: '#f0a0a0',
    body: '#2e8b2e', bodyHighlight: '#3aaa3a', overalls: '#2e8b2e',
    buttons: '#f5d742', shoe: '#6b2a1c', shoeSole: '#4a1a0c',
  },
  peach: {
    label: 'Peach',
    crown: '#f7d400', crownGem: '#ff6b8a', skin: '#f5c9a8',
    hair: '#f7d400', hairHighlight: '#fff5c0', eye: '#5a3a1a',
    cheek: '#ffb0b0', lip: '#e8698a', dress: '#f7a8b8',
    dressHighlight: '#ffd0d8', earring: '#f7d400', shoe: '#f7a8b8',
  },
  bowser: {
    label: 'Bowser',
    shell: '#4a7a2e', shellSpike: '#c8843a', skin: '#c8843a',
    skinHighlight: '#dca050', hair: '#5c3a1e', eye: '#ff0',
    pupil: '#222', nose: '#8a6a2e', teeth: '#fff', horn: '#5c3a1e',
    belly: '#f5d742', arm: '#c8843a', claw: '#fff',
  },
  toad: {
    label: 'Toad',
    cap: '#e52521', capSpot: '#fff', skin: '#f5c9a8',
    eye: '#222', cheek: '#f0a0a0', body: '#fff',
    vest: '#e52521', vestButton: '#f7d400', shoe: '#6b2a1c',
    shoeSole: '#4a1a0c', belt: '#8b4513',
  },
  yoshi: {
    label: 'Yoshi',
    body: '#7ac85a', bodyHighlight: '#9ae07a', belly: '#c8e8a0',
    skin: '#7ac85a', eye: '#fff', pupil: '#222', cheek: '#5a9a3a',
    tongue: '#e52521', shoe: '#e52521', shoeSole: '#c41c1a',
    saddle: '#e52521', saddleAccent: '#f7d400',
  },
  boo: {
    label: 'Boo',
    body: '#f8f8ff', bodyShadow: '#e0e0f0', eye: '#222',
    iris: '#222', cheek: '#ffb0d0', tongue: '#ff6b8a',
    mouth: '#222', blush: '#ffb0d0',
  },
  star: {
    label: 'Star',
    body: '#f7d400', bodyHighlight: '#fff5a0', eye: '#222',
    cheek: '#f0a0a0', glow: '#fff5a0', starOutline: '#d4b000',
  },
  koopa: {
    label: 'Koopa',
    shell: '#7ac85a', shellHighlight: '#9ae07a', shellBorder: '#5a9a3a',
    skin: '#f5c9a8', eye: '#222', cheek: '#f0a0a0',
    sunglasses: '#222', sunglassShine: '#fff',
    shoe: '#6b2a1c', shoeSole: '#4a1a0c',
    shellSpike: '#c8843a',
  },
  daisy: {
    label: 'Daisy',
    flower: '#f7a800', flowerCenter: '#e58a00', skin: '#f5c9a8',
    hair: '#8b5a2b', hairHighlight: '#b07a4b', eye: '#5a3a1a',
    cheek: '#ffb0b0', lip: '#e8698a', dress: '#f7a800',
    dressHighlight: '#ffc840', earring: '#f7d400', shoe: '#f7a800',
  },
  wario: {
    label: 'Wario',
    hat: '#8b0080', hatBand: '#6a0060', skin: '#f0c8a0',
    hair: '#4a2a1c', eye: '#222', cheek: '#e0a080',
    nose: '#e0a080', mustache: '#4a2a1c', body: '#8b0080',
    overalls: '#f7d400', buttons: '#8b0080', shoe: '#4a2a1c',
    shoeSole: '#2a1a0c', belly: '#f0c8a0', belt: '#222',
  },
  waluigi: {
    label: 'Waluigi',
    hat: '#5c0099', hatBand: '#440077', skin: '#f0c8a0',
    hair: '#4a2a1c', eye: '#222', cheek: '#e0a080',
    mustache: '#4a2a1c', thinMustache: '#4a2a1c',
    body: '#5c0099', overalls: '#5c0099', buttons: '#8b0080',
    shoe: '#4a2a1c', shoeSole: '#2a1a0c',
  },
  rosalina: {
    label: 'Rosalina',
    hair: '#c0e0f0', hairHighlight: '#e0f4ff', skin: '#f5c9a8',
    eye: '#5a7aaa', cheek: '#ffb0d0', lip: '#e0a0b0',
    dress: '#1a6b8a', dressHighlight: '#2a8aaa', dressStar: '#f7d400',
    crown: '#f7d400', crownGem: '#48dbfb', earring: '#f7d400',
    shoe: '#1a6b8a',
  },
  fireflower: {
    label: 'Fire Flower',
    petalOuter: '#e52521', petalInner: '#ff4444', petalHighlight: '#ff8888',
    center: '#ff6600', centerHighlight: '#ffaa00',
    eye: '#222', cheek: '#ff8888', mouth: '#222',
    stem: '#4a7a2e', stemHighlight: '#5a9a3e', leaf: '#4a7a2e',
    leafHighlight: '#5a9a3e',
  },
  shark: {
    label: 'Shark',
    body: '#6b8e9a', bodyHighlight: '#8ab0bc', belly: '#d0e0e4',
    fin: '#5a7a8a', finHighlight: '#7a9aaa', eye: '#222',
    eyeHighlight: '#fff', teeth: '#fff', toothOutline: '#ddd',
    nose: '#6b8e9a', gill: '#5a7a8a', cheek: '#8ab0bc',
  },
  smileShark: {
    label: 'Smiling Shark',
    body: '#7a9aaa', bodyHighlight: '#9abccc', belly: '#e0ecee',
    fin: '#6a8a9a', finHighlight: '#8aaabc', eye: '#222',
    eyeHighlight: '#fff', teeth: '#fff', toothOutline: '#ddd',
    nose: '#7a9aaa', gill: '#6a8a9a', cheek: '#ffb0b0',
    blush: '#ffd0d0',
  },
  chinesePrincess: {
    label: 'Chinese Princess',
    crown: '#e52521', crownGem: '#ff4444', skin: '#f5c9a8',
    hair: '#1a0a00', hairHighlight: '#3a2a1a', eye: '#222',
    cheek: '#ffb0b0', lip: '#e8698a', dress: '#e52521',
    dressHighlight: '#ff6666', collar: '#f7d400', ornament: '#f7d400',
    sleeve: '#ff8888', shoe: '#c41c1a',
  },
  americanEagle: {
    label: 'American Eagle',
    body: '#4a3520', bodyHighlight: '#6a553a', head: '#fff',
    headHighlight: '#f0f0f0', eye: '#222', eyeHighlight: '#fff',
    beak: '#f7d400', beakHighlight: '#ffea40', wing: '#4a3520',
    wingHighlight: '#6a553a', chest: '#fff', feather: '#8a755a',
    shield: '#1a3a6a', shieldStripe: '#e52521',
  },
  mexican: {
    label: 'Mexican',
    skin: '#d4a574', hair: '#2a1a0a', eye: '#222',
    cheek: '#e0a080', mustache: '#2a1a0a',
    hat: '#f0d8a0', hatBand: '#e52521', hatTrim: '#f7d400',
    hatTop: '#d4b880', poncho: '#e52521', ponchoStripe1: '#fff',
    ponchoStripe2: '#1a7a3a', ponchoFringe: '#f7d400',
    shoe: '#4a2a1c', shoeSole: '#2a1a0c',
    arm: '#d4a574',
  },
  realtor: {
    label: 'Realtor',
    roof: '#e52521', roofHighlight: '#ff5555', wall: '#f5f5f5',
    wallShadow: '#ddd', door: '#e52521', doorKnob: '#f7d400',
    window: '#a8d8f0', windowFrame: '#ccc', chimney: '#999',
    chimneyBrick: '#e52521', R: '#e52521', ROutline: '#fff',
    base: '#e52521', baseTop: '#f5f5f5',
  },
  sumo: {
    label: 'Sumo Fighter',
    skin: '#d4a574', skinShadow: '#b8895d', hair: '#1a0a00',
    eye: '#222', eyeHighlight: '#fff', eyebrow: '#1a0a00',
    cheek: '#e0a080', mawashi: '#1a2a6a', mawashiHighlight: '#2a4a8a',
    mawashiKnot: '#f7d400', beltLine: '#f5f5f5', arm: '#d4a574',
    armShadow: '#b8895d', leg: '#c49868', legShadow: '#a87848',
    loincloth: '#f0f0f0', toes: '#c49868',
  },
  mexicanWoman: {
    label: 'Mexican Woman',
    skin: '#d4a574', hair: '#1a0a00', hairHighlight: '#3a2a1a',
    eye: '#222', eyeHighlight: '#fff', cheek: '#e0a080',
    lip: '#e8698a', dress: '#e52521', dressStripe1: '#f7d400',
    dressStripe2: '#1a7a3a', dressEmbellish: '#fff',
    rebozo: '#c49868', rebozoFringe: '#e52521',
    flower1: '#ff69b4', flower2: '#ffeb3b', flowerCenter: '#e52521',
    earring: '#f7d400', shoe: '#4a2a1c',
  },
  colombia: {
    label: 'Colombia',
    skin: '#d4a574', hair: '#1a0a00', eye: '#222', eyeHighlight: '#fff',
    cheek: '#e0a080', mustache: '#1a0a00',
    hat: '#1a1a1a', hatPattern: '#ddd', hatBand: '#f7d400',
    ruana: '#f7d400', ruanaStripe1: '#1a3a8a', ruanaStripe2: '#e52521',
    shirt: '#fff', coffee: '#6a3a1a', coffeeHighlight: '#8a5a3a',
    shoe: '#3a2a1a',
  },
  businessMan: {
    label: 'Business Man',
    skin: '#e8c8a0', skinShadow: '#d0b090', hair: '#1a1a2a',
    eye: '#222', eyeHighlight: '#fff', cheek: '#d4a080',
    suit: '#1a2a4a', suitHighlight: '#2a4a6a', shirt: '#fff',
    tie: '#c41a1a', tieHighlight: '#e52521', tieClip: '#f7d400',
    collar: '#f0f0f0', glasses: '#666', glassesHighlight: '#aaa',
    shoe: '#1a1a1a',
  },
  chespirito: {
    label: 'Chespirito',
    heart: '#e52521', heartHighlight: '#ff5555', heartShadow: '#b01818',
    letter: '#fff', letterOutline: '#fff', glow: '#ff8888',
  },
  baby: {
    label: 'Baby',
    skin: '#f0c8a8', skinShadow: '#e0b898', hair: '#d4a060',
    eye: '#444', eyeHighlight: '#fff', cheek: '#ffb0b0',
    bib: '#7ac4e8', bibStripe: '#fff', body: '#f0d0a0',
    pacifier: '#ff8888', pacifierRing: '#ccc', shoe: '#fff',
  },
};

function MarioHat({ c, letter = 'M', bg = '#fff' }) {
  return (
    <g>
      <ellipse cx="20" cy="7" rx="12" ry="7" fill={c.hat} />
      <rect x="9" y="5" width="22" height="5" rx="2.5" fill={c.hat} />
      <rect x="9" y="10" width="22" height="3" rx="1" fill={c.hatBand} />
      <circle cx="20" cy="7" r="4" fill={bg} />
      <text x="20" y="9" fontFamily="Arial,sans-serif" fontSize="5" fontWeight="900" fill={c.hat} textAnchor="middle">{letter}</text>
      <ellipse cx="8" cy="11.5" rx="3" ry="2" fill={c.hat} />
      <rect x="4" y="11.5" width="6" height="2.5" rx="1" fill="#f0f0f0" opacity="0.75" />
    </g>
  );
}

function Hair({ c }) {
  return (
    <g>
      <ellipse cx="20" cy="14" rx="13" ry="9" fill={c.hair} />
      <ellipse cx="11" cy="16" rx="5" ry="7" fill={c.hair} />
      <ellipse cx="29" cy="16" rx="5" ry="7" fill={c.hair} />
      <ellipse cx="20" cy="15" rx="6" ry="4" fill={c.hairHighlight || c.hair} opacity="0.3" />
    </g>
  );
}

function Eyes({ c, x1 = 14, x2 = 26, y = 18, r = 2.5 }) {
  return (
    <g>
      <circle cx={x1} cy={y} r={r} fill={c.eye} />
      <circle cx={x2} cy={y} r={r} fill={c.eye} />
      <circle cx={x1 - 0.8} cy={y - 1} r={0.9} fill={c.eyeHighlight || '#fff'} opacity="0.7" />
      <circle cx={x2 - 0.8} cy={y - 1} r={0.9} fill={c.eyeHighlight || '#fff'} opacity="0.7" />
    </g>
  );
}

function Mouth({ smile = true, open = false }) {
  if (open) {
    return <ellipse cx="20" cy="24" rx="4" ry="3.5" fill="#222" />;
  }
  return smile
    ? <path d="M14 24 Q20 30, 26 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
    : <ellipse cx="20" cy="24" rx="3" ry="2.5" fill="#222" />;
}

function Cheeks({ c, x1 = 12, x2 = 28 }) {
  return (
    <g>
      <circle cx={x1} cy={21} r="2.5" fill={c.cheek} opacity="0.5" />
      <circle cx={x2} cy={21} r="2.5" fill={c.cheek} opacity="0.5" />
    </g>
  );
}

function Face({ c, smile = true }) {
  return (
    <g>
      <circle cx="20" cy="20" r="12" fill={c.skin} />
      <Cheeks c={c} />
      <Eyes c={c} />
      <Mouth smile={smile} />
    </g>
  );
}

function Body({ c, w = 14, h = 8, y = 28 }) {
  return (
    <g>
      <rect x={20 - w / 2} y={y} width={w} height={h} rx="2" fill={c.body} />
    </g>
  );
}

function Shoe({ c, x, y = 35 }) {
  return (
    <g>
      <ellipse cx={x} cy={y + 1} rx="4.5" ry="2.5" fill={c.shoe} />
      <rect x={x - 4} y={y - 1} width="8" height="3" rx="1.5" fill={c.shoeSole || c.shoe} />
    </g>
  );
}

const renderers = {
  mario: (c) => (
    <g>
      <rect x="10" y="13" width="5" height="4" rx="2" fill={c.hair} />
      <rect x="25" y="13" width="5" height="4" rx="2" fill={c.hair} />
      <rect x="9" y="15" width="4" height="3" rx="1.5" fill={c.hair} />
      <rect x="27" y="15" width="4" height="3" rx="1.5" fill={c.hair} />
      <circle cx="20" cy="20" r="10" fill={c.skin} />
      <MarioHat c={c} letter="M" />
      <Cheeks c={c} x1={13} x2={27} />
      <Eyes c={c} x1={14} x2={26} y={18} r={2} />
      <path d="M14 23 Q20 28, 26 23" fill="none" stroke={c.hair} strokeWidth="2" strokeLinecap="round" />
      <rect x="12" y="24" width="4" height="2" rx="1" fill={c.hair} opacity="0.5" />
      <rect x="24" y="24" width="4" height="2" rx="1" fill={c.hair} opacity="0.5" />
      <rect x="14" y="29" width="12" height="7" rx="2" fill={c.body} />
      <rect x="14" y="29" width="12" height="2" fill={c.bodyHighlight} opacity="0.3" />
      <circle cx="17" cy="32" r="1.2" fill={c.buttons} />
      <circle cx="23" cy="32" r="1.2" fill={c.buttons} />
      <rect x="11" y="34" width="6" height="2" rx="1" fill="#fff" />
      <rect x="23" y="34" width="6" height="2" rx="1" fill="#fff" />
      <ellipse cx="14" cy="37" rx="4" ry="2" fill={c.shoe} />
      <rect x="11" y="36" width="6" height="1.5" rx="0.8" fill={c.shoeSole} />
      <ellipse cx="26" cy="37" rx="4" ry="2" fill={c.shoe} />
      <rect x="23" y="36" width="6" height="1.5" rx="0.8" fill={c.shoeSole} />
    </g>
  ),
  luigi: (c) => (
    <g>
      <circle cx="20" cy="20" r="12" fill={c.skin} />
      <MarioHat c={c} letter="L" bg="#fff" />
      <Cheeks c={c} />
      <Eyes c={c} />
      <path d="M15 24 Q20 29, 25 24" fill="none" stroke="#6b2a1c" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="14" y="29" width="12" height="7" rx="2" fill={c.body} />
      <rect x="14" y="29" width="12" height="2" fill={c.bodyHighlight} opacity="0.3" />
      <circle cx="17" cy="32" r="1.2" fill={c.buttons} />
      <circle cx="23" cy="32" r="1.2" fill={c.buttons} />
      <rect x="11" y="34" width="6" height="2" rx="1" fill="#fff" />
      <rect x="23" y="34" width="6" height="2" rx="1" fill="#fff" />
      <ellipse cx="14" cy="37" rx="4" ry="2" fill={c.shoe} />
      <rect x="11" y="36" width="6" height="1.5" rx="0.8" fill={c.shoeSole} />
      <ellipse cx="26" cy="37" rx="4" ry="2" fill={c.shoe} />
      <rect x="23" y="36" width="6" height="1.5" rx="0.8" fill={c.shoeSole} />
    </g>
  ),
  peach: (c) => (
    <g>
      <ellipse cx="20" cy="10" rx="10" ry="6" fill={c.hair} />
      <ellipse cx="11" cy="8" rx="5" ry="6" fill={c.hair} />
      <ellipse cx="29" cy="8" rx="5" ry="6" fill={c.hair} />
      <ellipse cx="20" cy="8" rx="8" ry="4" fill={c.hairHighlight} opacity="0.3" />
      <rect x="14" y="3" width="12" height="5" rx="2" fill={c.crown} />
      <rect x="13" y="3.5" width="14" height="2" fill="#fff" opacity="0.2" rx="1" />
      <polygon points="16,3 16,0 17,3" fill={c.crownGem} />
      <polygon points="20,3 20,-1 21,3" fill={c.crownGem} />
      <polygon points="24,3 24,0 25,3" fill={c.crownGem} />
      <circle cx="20" cy="20" r="11" fill={c.skin} />
      <Cheeks c={c} />
      <Eyes c={c} x1={14} x2={26} r={2} />
      <circle cx="12" cy="18" r="1.2" fill={c.earring} />
      <circle cx="28" cy="18" r="1.2" fill={c.earring} />
      <circle cx="12" cy="18" r="0.5" fill="#fff" opacity="0.5" />
      <circle cx="28" cy="18" r="0.5" fill="#fff" opacity="0.5" />
      <circle cx="20" cy="23" r="2" fill={c.lip} opacity="0.3" />
      <path d="M17 24 Q20 27, 23 24" fill="none" stroke={c.lip} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="12" y="29" width="16" height="8" rx="3" fill={c.dress} />
      <rect x="12" y="29" width="16" height="2" fill={c.dressHighlight} opacity="0.4" />
      <polygon points="14,32 16,37 12,37" fill={c.dressHighlight} opacity="0.2" />
      <polygon points="26,32 28,37 24,37" fill={c.dressHighlight} opacity="0.2" />
      <rect x="16" y="35" width="8" height="2" rx="1" fill={c.shoe} />
    </g>
  ),
  bowser: (c) => (
    <g>
      <ellipse cx="20" cy="9" rx="13" ry="8" fill={c.hair} />
      <polygon points="8,6 5,0 11,4" fill={c.horn} />
      <polygon points="32,6 35,0 29,4" fill={c.horn} />
      <polygon points="5,8 3,3 7,7" fill={c.horn} />
      <circle cx="8" cy="9" r="3.5" fill={c.shellSpike} />
      <circle cx="32" cy="9" r="3.5" fill={c.shellSpike} />
      <circle cx="11" cy="6" r="2.5" fill={c.shellSpike} />
      <circle cx="29" cy="6" r="2.5" fill={c.shellSpike} />
      <ellipse cx="20" cy="20" rx="14" ry="13" fill={c.skin} />
      <circle cx="13" cy="16" r="3.5" fill={c.eye} />
      <circle cx="27" cy="16" r="3.5" fill={c.eye} />
      <circle cx="13" cy="15" r="1.5" fill={c.pupil} />
      <circle cx="27" cy="15" r="1.5" fill={c.pupil} />
      <ellipse cx="20" cy="23" rx="5" ry="4" fill={c.nose} />
      <circle cx="18" cy="22" r="1.2" fill={c.nose} opacity="0.4" />
      <circle cx="22" cy="22" r="1.2" fill={c.nose} opacity="0.4" />
      <path d="M11 27 Q20 34, 29 27" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 27 L11 30 L14 27" fill={c.teeth} />
      <path d="M16 28 L16 31 L19 28" fill={c.teeth} />
      <path d="M21 28 L21 31 L24 28" fill={c.teeth} />
      <path d="M26 27 L26 30 L29 27" fill={c.teeth} />
      <rect x="12" y="32" width="16" height="5" rx="2" fill={c.belly} />
      <rect x="8" y="34" width="5" height="4" rx="1" fill={c.arm} />
      <rect x="27" y="34" width="5" height="4" rx="1" fill={c.arm} />
      <ellipse cx="11" cy="38" rx="4" ry="2.5" fill={c.shell} />
      <ellipse cx="29" cy="38" rx="4" ry="2.5" fill={c.shell} />
      <polygon points="8,36 6,34 10,36" fill={c.claw} opacity="0.6" />
      <polygon points="27,36 29,34 25,36" fill={c.claw} opacity="0.6" />
    </g>
  ),
  toad: (c) => (
    <g>
      <ellipse cx="20" cy="10" rx="12" ry="10" fill={c.cap} />
      <circle cx="13" cy="5" r="4" fill={c.capSpot} opacity="0.9" />
      <circle cx="27" cy="6" r="3.5" fill={c.capSpot} opacity="0.9" />
      <circle cx="20" cy="4" r="2.5" fill={c.capSpot} opacity="0.9" />
      <circle cx="10" cy="9" r="2" fill={c.capSpot} opacity="0.8" />
      <circle cx="30" cy="10" r="2" fill={c.capSpot} opacity="0.8" />
      <circle cx="20" cy="20" r="10" fill={c.skin} />
      <Cheeks c={c} />
      <Eyes c={c} r={2} />
      <path d="M15 24 Q20 28, 25 24" fill="none" stroke="#222" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="13" y="29" width="14" height="8" rx="2" fill={c.body} />
      <rect x="13" y="29" width="14" height="3" fill={c.vest} rx="1" />
      <rect x="14" y="31" width="4" height="4" rx="1" fill={c.vest} />
      <rect x="22" y="31" width="4" height="4" rx="1" fill={c.vest} />
      <circle cx="17" cy="33" r="0.8" fill={c.vestButton} />
      <circle cx="23" cy="33" r="0.8" fill={c.vestButton} />
      <rect x="17" y="34" width="6" height="2" rx="0.5" fill={c.belt} />
      <rect x="17" y="34.5" width="6" height="1" fill={c.belt} opacity="0.5" />
      <ellipse cx="13" cy="38" rx="4" ry="2.5" fill={c.shoe} />
      <rect x="10" y="37" width="5" height="1.5" rx="0.8" fill={c.shoeSole} />
      <ellipse cx="27" cy="38" rx="4" ry="2.5" fill={c.shoe} />
      <rect x="25" y="37" width="5" height="1.5" rx="0.8" fill={c.shoeSole} />
    </g>
  ),
  yoshi: (c) => (
    <g>
      <ellipse cx="20" cy="17" rx="13" ry="11" fill={c.body} />
      <ellipse cx="20" cy="18" rx="7" ry="5" fill={c.belly} opacity="0.6" />
      <ellipse cx="20" cy="12" rx="11" ry="8" fill={c.body} />
      <ellipse cx="20" cy="11" rx="6" ry="3" fill={c.bodyHighlight} opacity="0.3" />
      <circle cx="14" cy="16" r="3.5" fill={c.eye} />
      <circle cx="26" cy="16" r="3.5" fill={c.eye} />
      <circle cx="14" cy="15" r="2" fill={c.pupil} />
      <circle cx="26" cy="15" r="2" fill={c.pupil} />
      <Cheeks c={c} x1={9} x2={31} />
      <ellipse cx="20" cy="12" rx="5" ry="3" fill={c.body} />
      <circle cx="17" cy="11" r="1.2" fill={c.pupil} opacity="0.3" />
      <circle cx="23" cy="11" r="1.2" fill={c.pupil} opacity="0.3" />
      <ellipse cx="20" cy="21" rx="3.5" ry="2.5" fill={c.tongue} />
      <path d="M16 21 Q20 25, 24 21" fill="none" stroke="#222" strokeWidth="1.2" />
      <rect x="10" y="27" width="20" height="5" rx="2" fill={c.saddle} />
      <rect x="10" y="29" width="20" height="2" fill={c.saddleAccent} opacity="0.5" />
      <rect x="12" y="32" width="16" height="3" rx="1.5" fill={c.body} />
      <ellipse cx="12" cy="36" rx="4.5" ry="3" fill={c.shoe} />
      <rect x="9" y="35" width="5" height="1.5" rx="0.8" fill={c.shoeSole} />
      <ellipse cx="28" cy="36" rx="4.5" ry="3" fill={c.shoe} />
      <rect x="26" y="35" width="5" height="1.5" rx="0.8" fill={c.shoeSole} />
      <path d="M6 16 Q4 13 6 11" fill="none" stroke={c.body} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M34 16 Q36 13 34 11" fill="none" stroke={c.body} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="5" cy="14" rx="1.5" ry="2.5" fill={c.body} opacity="0.7" />
      <ellipse cx="35" cy="14" rx="1.5" ry="2.5" fill={c.body} opacity="0.7" />
    </g>
  ),
  boo: (c) => (
    <g>
      <path d="M6 14 C6 4 34 4 34 14 C34 16 33 20 32 24 C31 27 30 30 29 32 C27 35 25 37 23 37 C21 37 20 35 20 35 C20 35 19 37 17 37 C15 37 13 35 11 32 C10 30 9 27 8 24 C7 20 6 16 6 14Z" fill={c.body} />
      <path d="M8 14 C8 6 32 6 32 14 C32 16 31 19 30 23 C29 26 28 29 26 31 C24 34 22 36 20 36 C18 36 16 34 14 31 C12 29 11 26 10 23 C9 19 8 16 8 14Z" fill={c.bodyShadow} opacity="0.15" />
      <circle cx="13" cy="14" r="5" fill={c.eye} />
      <circle cx="27" cy="14" r="5" fill={c.eye} />
      <circle cx="11" cy="12.5" r="2" fill="#fff" opacity="0.7" />
      <circle cx="25" cy="12.5" r="2" fill="#fff" opacity="0.7" />
      <circle cx="11.5" cy="20" r="2" fill={c.blush} opacity="0.5" />
      <circle cx="28.5" cy="20" r="2" fill={c.blush} opacity="0.5" />
      <ellipse cx="20" cy="20" rx="6" ry="4" fill={c.mouth} />
      <ellipse cx="20" cy="20" rx="5" ry="3" fill={c.tongue} opacity="0.8" />
      <ellipse cx="20" cy="20" rx="5" ry="3" fill={c.tongue} opacity="0.3" />
      <path d="M14 18 L14 22" stroke={c.body} strokeWidth="1" strokeLinecap="round" />
      <path d="M17 18 L17 22" stroke={c.body} strokeWidth="1" strokeLinecap="round" />
      <path d="M23 18 L23 22" stroke={c.body} strokeWidth="1" strokeLinecap="round" />
      <path d="M26 18 L26 22" stroke={c.body} strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="20" cy="33" rx="7" ry="2" fill={c.bodyShadow} opacity="0.15" />
    </g>
  ),
  star: (c) => (
    <g>
      <polygon points="20,1 26,14 40,16 30,26 33,40 20,32 7,40 10,26 0,16 14,14" fill={c.body} />
      <polygon points="20,4 25,14 36,16 28,24 30,36 20,30 10,36 12,24 4,16 15,14" fill={c.bodyHighlight} opacity="0.2" />
      <circle cx="14" cy="20" r="2" fill={c.eye} />
      <circle cx="26" cy="20" r="2" fill={c.eye} />
      <circle cx="13.5" cy="19" r="0.7" fill="#fff" opacity="0.6" />
      <circle cx="25.5" cy="19" r="0.7" fill="#fff" opacity="0.6" />
      <circle cx="12" cy="23" r="1.5" fill={c.cheek} opacity="0.5" />
      <circle cx="28" cy="23" r="1.5" fill={c.cheek} opacity="0.5" />
      <path d="M16 25 Q20 29, 24 25" fill="none" stroke="#222" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="20" cy="16" r="1.5" fill={c.glow} opacity="0.4" />
      <circle cx="8" cy="8" r="1" fill={c.glow} opacity="0.4" />
      <circle cx="32" cy="6" r="0.8" fill={c.glow} opacity="0.4" />
      <circle cx="5" cy="28" r="0.7" fill={c.glow} opacity="0.3" />
      <circle cx="35" cy="30" r="0.9" fill={c.glow} opacity="0.3" />
      <circle cx="10" cy="3" r="0.6" fill={c.glow} opacity="0.5" />
      <circle cx="3" cy="18" r="0.5" fill={c.glow} opacity="0.4" />
      <circle cx="37" cy="10" r="0.6" fill={c.glow} opacity="0.4" />
    </g>
  ),
  koopa: (c) => (
    <g>
      <ellipse cx="20" cy="14" rx="10" ry="11" fill={c.shell} />
      <ellipse cx="20" cy="14" rx="7" ry="8" fill={c.shellHighlight} opacity="0.3" />
      <polygon points="13,5 15,1 17,5" fill={c.shellSpike} />
      <polygon points="18,3 20,0 22,3" fill={c.shellSpike} />
      <polygon points="23,5 25,1 27,5" fill={c.shellSpike} />
      <circle cx="20" cy="16" r="8" fill={c.skin} />
      <rect x="11" y="14" width="18" height="5" rx="2" fill={c.sunglasses} />
      <rect x="11" y="14" width="9" height="5" rx="1" fill={c.sunglassShine} opacity="0.2" />
      <rect x="21" y="14" width="8" height="5" rx="1" fill={c.sunglassShine} opacity="0.2" />
      <circle cx="12" cy="21" r="1.5" fill={c.cheek} opacity="0.5" />
      <circle cx="28" cy="21" r="1.5" fill={c.cheek} opacity="0.5" />
      <path d="M16 23 Q20 26, 24 23" fill="none" stroke="#222" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="20" cy="30" rx="11" ry="5" fill={c.shell} />
      <rect x="10" y="28" width="20" height="4" rx="2" fill={c.shellBorder} />
      <ellipse cx="13" cy="36" rx="3.5" ry="2" fill={c.shoe} />
      <rect x="10" y="35" width="5" height="1.5" rx="0.8" fill={c.shoeSole} />
      <ellipse cx="27" cy="36" rx="3.5" ry="2" fill={c.shoe} />
      <rect x="25" y="35" width="5" height="1.5" rx="0.8" fill={c.shoeSole} />
    </g>
  ),
  daisy: (c) => (
    <g>
      <ellipse cx="20" cy="10" rx="10" ry="6" fill={c.hair} />
      <ellipse cx="11" cy="8" rx="5" ry="6" fill={c.hair} />
      <ellipse cx="29" cy="8" rx="5" ry="6" fill={c.hair} />
      <ellipse cx="20" cy="8" rx="6" ry="3" fill={c.hairHighlight} opacity="0.3" />
      <circle cx="14" cy="4" r="3" fill={c.flower} />
      <circle cx="26" cy="4" r="3" fill={c.flower} />
      <circle cx="20" cy="2" r="3" fill={c.flower} />
      <circle cx="17" cy="3" r="2.5" fill={c.flower} opacity="0.8" />
      <circle cx="23" cy="3" r="2.5" fill={c.flower} opacity="0.8" />
      <circle cx="20" cy="2" r="1.5" fill={c.flowerCenter} />
      <circle cx="14" cy="4" r="1.3" fill={c.flowerCenter} />
      <circle cx="26" cy="4" r="1.3" fill={c.flowerCenter} />
      <circle cx="20" cy="20" r="11" fill={c.skin} />
      <Cheeks c={c} />
      <Eyes c={c} x1={14} x2={26} r={2} />
      <circle cx="12" cy="18" r="1" fill={c.earring} />
      <circle cx="28" cy="18" r="1" fill={c.earring} />
      <path d="M17 24 Q20 27, 23 24" fill="none" stroke={c.lip} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="12" y="29" width="16" height="8" rx="3" fill={c.dress} />
      <rect x="12" y="29" width="16" height="2" fill={c.dressHighlight} opacity="0.4" />
      <polygon points="15,32 17,37 13,37" fill={c.dressHighlight} opacity="0.2" />
      <polygon points="25,32 27,37 23,37" fill={c.dressHighlight} opacity="0.2" />
      <rect x="15" y="35" width="10" height="2" rx="1" fill={c.shoe} />
    </g>
  ),
  wario: (c) => (
    <g>
      <MarioHat c={{ ...c, hat: '#8b0080', hatBand: '#6a0060' }} letter="W" bg="#f7d400" />
      <ellipse cx="20" cy="22" rx="14" ry="14" fill={c.skin} />
      <ellipse cx="20" cy="20" rx="10" ry="8" fill={c.belly} opacity="0.3" />
      <circle cx="13" cy="16" r="3" fill={c.eye} />
      <circle cx="27" cy="16" r="3" fill={c.eye} />
      <circle cx="12" cy="15" r="1" fill="#fff" opacity="0.5" />
      <circle cx="26" cy="15" r="1" fill="#fff" opacity="0.5" />
      <circle cx="13" cy="21" r="2" fill={c.cheek} opacity="0.5" />
      <circle cx="27" cy="21" r="2" fill={c.cheek} opacity="0.5" />
      <ellipse cx="20" cy="25" rx="5" ry="4" fill={c.nose} />
      <circle cx="19" cy="24" r="1.2" fill={c.nose} opacity="0.4" />
      <path d="M9 21 Q14 25, 19 23" fill="none" stroke={c.mustache} strokeWidth="3" strokeLinecap="round" />
      <path d="M31 21 Q26 25, 21 23" fill="none" stroke={c.mustache} strokeWidth="3" strokeLinecap="round" />
      <rect x="12" y="31" width="16" height="7" rx="2" fill={c.overalls} />
      <rect x="12" y="31" width="16" height="3" fill={c.body} opacity="0.5" />
      <circle cx="16" cy="34" r="1.5" fill={c.buttons} />
      <circle cx="24" cy="34" r="1.5" fill={c.buttons} />
      <rect x="20" y="35" width="6" height="1.5" rx="0.5" fill={c.belt} />
      <ellipse cx="12" cy="38" rx="4.5" ry="2.5" fill={c.shoe} />
      <rect x="9" y="37" width="5" height="1.5" rx="0.8" fill={c.shoeSole} />
      <ellipse cx="28" cy="38" rx="4.5" ry="2.5" fill={c.shoe} />
      <rect x="26" y="37" width="5" height="1.5" rx="0.8" fill={c.shoeSole} />
    </g>
  ),
  waluigi: (c) => (
    <g>
      <MarioHat c={{ ...c, hat: '#5c0099', hatBand: '#440077' }} letter="L" bg="#fff" />
      <rect x="9" y="13" width="5" height="4" rx="2" fill={c.hair} />
      <rect x="26" y="13" width="5" height="4" rx="2" fill={c.hair} />
      <circle cx="20" cy="20" r="12" fill={c.skin} />
      <Cheeks c={c} x1={12} x2={28} />
      <Eyes c={c} x1={14} x2={26} y={18} r={2.2} />
      <path d="M9 20 Q14 23, 19 21" fill="none" stroke={c.mustache} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M31 20 Q26 23, 21 21" fill="none" stroke={c.mustache} strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="20" cy="26" rx="3.5" ry="3" fill="#222" />
      <rect x="14" y="29" width="12" height="8" rx="2" fill={c.overalls} />
      <rect x="14" y="29" width="12" height="2" fill={c.body} opacity="0.5" />
      <circle cx="17" cy="33" r="1.2" fill={c.buttons} />
      <circle cx="23" cy="33" r="1.2" fill={c.buttons} />
      <ellipse cx="13" cy="38" rx="4" ry="2.5" fill={c.shoe} />
      <rect x="10" y="37" width="5" height="1.5" rx="0.8" fill={c.shoeSole} />
      <ellipse cx="27" cy="38" rx="4" ry="2.5" fill={c.shoe} />
      <rect x="25" y="37" width="5" height="1.5" rx="0.8" fill={c.shoeSole} />
    </g>
  ),
  rosalina: (c) => (
    <g>
      <ellipse cx="20" cy="10" rx="12" ry="8" fill={c.hair} />
      <ellipse cx="10" cy="10" rx="5" ry="7" fill={c.hair} />
      <ellipse cx="30" cy="10" rx="5" ry="7" fill={c.hair} />
      <ellipse cx="20" cy="8" rx="6" ry="4" fill={c.hairHighlight} opacity="0.4" />
      <rect x="15" y="4" width="10" height="3" rx="1.5" fill={c.crown} />
      <circle cx="17" cy="4" r="1" fill={c.crownGem} />
      <circle cx="23" cy="4" r="1" fill={c.crownGem} />
      <circle cx="20" cy="4" r="1.2" fill={c.crownGem} />
      <circle cx="20" cy="20" r="11" fill={c.skin} />
      <Cheeks c={c} />
      <Eyes c={c} x1={14} x2={26} r={2} />
      <circle cx="12" cy="18" r="0.8" fill={c.earring} />
      <circle cx="28" cy="18" r="0.8" fill={c.earring} />
      <path d="M17 24 Q20 27, 23 24" fill="none" stroke={c.lip} strokeWidth="1.2" strokeLinecap="round" />
      <rect x="12" y="29" width="16" height="7" rx="3" fill={c.dress} />
      <rect x="12" y="29" width="16" height="2" fill={c.dressHighlight} opacity="0.3" />
      <polygon points="16,31 14,36 18,36" fill={c.dressStar} opacity="0.6" />
      <polygon points="24,30 23,34 25,34" fill={c.dressStar} opacity="0.6" />
      <rect x="15" y="35" width="10" height="2" rx="1" fill={c.shoe} />
    </g>
  ),
  fireflower: (c) => (
    <g>
      <ellipse cx="20" cy="12" rx="9" ry="7" fill={c.petalOuter} />
      <ellipse cx="12" cy="18" rx="7" ry="9" fill={c.petalOuter} />
      <ellipse cx="28" cy="18" rx="7" ry="9" fill={c.petalOuter} />
      <ellipse cx="20" cy="8" rx="7" ry="5" fill={c.petalInner} />
      <ellipse cx="12" cy="16" rx="5" ry="7" fill={c.petalInner} />
      <ellipse cx="28" cy="16" rx="5" ry="7" fill={c.petalInner} />
      <ellipse cx="20" cy="8" rx="4" ry="3" fill={c.petalHighlight} opacity="0.3" />
      <circle cx="20" cy="20" r="6" fill={c.center} />
      <circle cx="20" cy="19" r="3" fill={c.centerHighlight} opacity="0.5" />
      <circle cx="17" cy="18" r="2" fill={c.eye} />
      <circle cx="23" cy="18" r="2" fill={c.eye} />
      <circle cx="16.5" cy="17" r="0.7" fill="#fff" opacity="0.6" />
      <circle cx="22.5" cy="17" r="0.7" fill="#fff" opacity="0.6" />
      <circle cx="15" cy="21.5" r="1.5" fill={c.cheek} opacity="0.5" />
      <circle cx="25" cy="21.5" r="1.5" fill={c.cheek} opacity="0.5" />
      <path d="M17 23 Q20 26, 23 23" fill="none" stroke={c.mouth} strokeWidth="1.2" strokeLinecap="round" />
      <rect x="17" y="28" width="6" height="6" rx="2" fill={c.stem} />
      <rect x="17" y="28" width="6" height="2" fill={c.stemHighlight} opacity="0.3" />
      <ellipse cx="15" cy="32" rx="3" ry="1.5" fill={c.leaf} />
      <ellipse cx="14" cy="31" rx="2" ry="1" fill={c.leafHighlight} opacity="0.3" />
      <ellipse cx="25" cy="31" rx="3" ry="1.5" fill={c.leaf} />
      <ellipse cx="25" cy="30" rx="2" ry="1" fill={c.leafHighlight} opacity="0.3" />
    </g>
  ),
  shark: (c) => (
    <g>
      <ellipse cx="20" cy="18" rx="15" ry="9" fill={c.body} />
      <ellipse cx="22" cy="18" rx="10" ry="6" fill={c.bodyHighlight} opacity="0.2" />
      <ellipse cx="14" cy="14" rx="4" ry="6" fill={c.fin} />
      <polygon points="14,14 12,8 16,12" fill={c.finHighlight} opacity="0.3" />
      <ellipse cx="20" cy="21" rx="8" ry="4" fill={c.belly} opacity="0.7" />
      <circle cx="12" cy="16" r="2.5" fill={c.eye} />
      <circle cx="12" cy="15.5" r="1" fill={c.eyeHighlight} opacity="0.7" />
      <circle cx="29" cy="16" r="2.5" fill={c.eye} />
      <circle cx="29" cy="15.5" r="1" fill={c.eyeHighlight} opacity="0.7" />
      <path d="M6 16 Q4 14 5 12" fill="none" stroke={c.gill} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 18 Q5 17 5.5 15" fill="none" stroke={c.gill} strokeWidth="1" strokeLinecap="round" />
      <polygon points="1,17 4,16 1,19" fill={c.body} />
      <polygon points="0.5,17 3.5,16.5 0.5,18.5" fill={c.bodyHighlight} opacity="0.3" />
      <path d="M16 22 L16 25 L18 23" fill={c.teeth} />
      <path d="M19 23 L19 26 L21 24" fill={c.teeth} />
      <path d="M22 22 L22 25 L24 23" fill={c.teeth} />
      <path d="M16 22 L16 19 L18 21" fill={c.teeth} />
      <path d="M19 21 L19 18 L21 20" fill={c.teeth} />
      <path d="M22 22 L22 19 L24 21" fill={c.teeth} />
      <path d="M6 19 Q8 23, 15 23" fill="none" stroke="#222" strokeWidth="0.8" />
      <path d="M25 23 Q32 23, 34 19" fill="none" stroke="#222" strokeWidth="0.8" />
      <ellipse cx="35" cy="20" rx="3" ry="2" fill={c.fin} />
      <ellipse cx="35" cy="21" rx="2" ry="1.5" fill={c.finHighlight} opacity="0.3" />
    </g>
  ),
  smileShark: (c) => (
    <g>
      <ellipse cx="20" cy="18" rx="15" ry="9" fill={c.body} />
      <ellipse cx="22" cy="18" rx="10" ry="6" fill={c.bodyHighlight} opacity="0.3" />
      <ellipse cx="14" cy="14" rx="4" ry="6" fill={c.fin} />
      <polygon points="14,14 12,8 16,12" fill={c.finHighlight} opacity="0.3" />
      <ellipse cx="20" cy="21" rx="8" ry="4" fill={c.belly} opacity="0.6" />
      <circle cx="12" cy="16" r="3" fill={c.eye} />
      <circle cx="12" cy="15" r="1.2" fill={c.eyeHighlight} opacity="0.8" />
      <circle cx="29" cy="16" r="3" fill={c.eye} />
      <circle cx="29" cy="15" r="1.2" fill={c.eyeHighlight} opacity="0.8" />
      <circle cx="7" cy="19" r="2" fill={c.blush} opacity="0.5" />
      <circle cx="33" cy="19" r="2" fill={c.blush} opacity="0.5" />
      <path d="M6 16 Q4 14 5 12" fill="none" stroke={c.gill} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 18 Q5 17 5.5 14" fill="none" stroke={c.gill} strokeWidth="1" strokeLinecap="round" />
      <polygon points="1,18 4,17 1,20" fill={c.body} />
      <polygon points="0.5,18 3.5,17.5 0.5,19.5" fill={c.bodyHighlight} opacity="0.3" />
      <path d="M14 22 Q20 28, 26 22" fill="none" stroke="#222" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M15 21 L15 24 L17 22" fill={c.teeth} />
      <path d="M18 22 L18 25 L20 23" fill={c.teeth} />
      <path d="M21 22 L21 25 L23 23" fill={c.teeth} />
      <path d="M23 21 L23 24 L25 22" fill={c.teeth} />
      <ellipse cx="35" cy="20" rx="3" ry="2" fill={c.fin} />
      <ellipse cx="35" cy="21" rx="2" ry="1.5" fill={c.finHighlight} opacity="0.3" />
      <path d="M14 19 L16 21" stroke="#222" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M26 19 L28 21" stroke="#222" strokeWidth="0.8" strokeLinecap="round" />
    </g>
  ),
  chinesePrincess: (c) => (
    <g>
      <ellipse cx="20" cy="6" rx="6" ry="5" fill={c.hair} />
      <ellipse cx="20" cy="4" rx="4" ry="3" fill={c.hairHighlight} opacity="0.3" />
      <circle cx="15" cy="4" r="1.5" fill={c.ornament} />
      <circle cx="25" cy="4" r="1.5" fill={c.ornament} />
      <circle cx="20" cy="2.5" r="2" fill={c.crown} />
      <circle cx="20" cy="2.5" r="1" fill={c.ornament} />
      <ellipse cx="12" cy="10" rx="4" ry="8" fill={c.hair} />
      <ellipse cx="28" cy="10" rx="4" ry="8" fill={c.hair} />
      <rect x="12" y="6" width="16" height="4" rx="2" fill={c.crown} />
      <rect x="12" y="6.5" width="16" height="1.5" fill="#fff" opacity="0.2" rx="0.8" />
      <polygon points="16,6 15,3 17,6" fill={c.crownGem} />
      <polygon points="20,6 19,2 21,6" fill={c.crownGem} />
      <polygon points="24,6 23,3 25,6" fill={c.crownGem} />
      <circle cx="20" cy="18" r="10" fill={c.skin} />
      <Cheeks c={c} x1={13} x2={27} />
      <Eyes c={c} x1={14} x2={26} r={2.2} />
      <circle cx="20" cy="22.5" r="1.5" fill={c.lip} opacity="0.3" />
      <path d="M17 23 Q20 25.5, 23 23" fill="none" stroke={c.lip} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M10 25 Q20 22, 30 25 L28 27 Q20 25, 12 27 Z" fill={c.collar} />
      <rect x="10" y="27" width="20" height="10" rx="2" fill={c.dress} />
      <rect x="10" y="27" width="20" height="2" fill={c.dressHighlight} opacity="0.3" />
      <rect x="6" y="28" width="6" height="5" rx="2" fill={c.sleeve} />
      <rect x="28" y="28" width="6" height="5" rx="2" fill={c.sleeve} />
      <circle cx="14" cy="32" r="1.5" fill={c.ornament} opacity="0.6" />
      <circle cx="20" cy="34" r="1.5" fill={c.ornament} opacity="0.6" />
      <circle cx="26" cy="32" r="1.5" fill={c.ornament} opacity="0.6" />
      <rect x="14" y="36" width="5" height="2" rx="1" fill={c.shoe} />
      <rect x="21" y="36" width="5" height="2" rx="1" fill={c.shoe} />
    </g>
  ),
  americanEagle: (c) => (
    <g>
      <ellipse cx="20" cy="26" rx="13" ry="10" fill={c.body} />
      <ellipse cx="20" cy="26" rx="9" ry="7" fill={c.bodyHighlight} opacity="0.2" />
      <ellipse cx="7" cy="24" rx="7" ry="5" fill={c.wing} transform="rotate(-15, 7, 24)" />
      <ellipse cx="33" cy="24" rx="7" ry="5" fill={c.wing} transform="rotate(15, 33, 24)" />
      <ellipse cx="7" cy="23" rx="5" ry="3" fill={c.wingHighlight} opacity="0.2" />
      <ellipse cx="33" cy="23" rx="5" ry="3" fill={c.wingHighlight} opacity="0.2" />
      <rect x="15" y="22" width="10" height="8" rx="2" fill={c.shield} />
      <rect x="17" y="24" width="6" height="4" fill={c.shieldStripe} />
      <rect x="17" y="26" width="6" height="1" fill="#fff" opacity="0.5" />
      <ellipse cx="20" cy="14" rx="10" ry="9" fill={c.head} />
      <polygon points="12,8 10,3 14,7" fill={c.head} />
      <polygon points="16,6 15,1 18,5" fill={c.head} />
      <polygon points="20,5 20,0 22,5" fill={c.head} />
      <polygon points="24,6 25,1 26,5" fill={c.head} />
      <polygon points="28,8 30,3 28,7" fill={c.head} />
      <circle cx="14" cy="14" r="3" fill={c.eye} />
      <circle cx="26" cy="14" r="3" fill={c.eye} />
      <circle cx="13.5" cy="13" r="1.2" fill={c.eyeHighlight} />
      <circle cx="25.5" cy="13" r="1.2" fill={c.eyeHighlight} />
      <polygon points="16,17 20,22 24,17 22,16 18,16" fill={c.beak} />
      <polygon points="18,16 20,20 22,16" fill={c.beakHighlight} opacity="0.4" />
      <path d="M13 10 Q16 8, 20 9" fill="none" stroke={c.feather} strokeWidth="0.8" opacity="0.3" />
      <path d="M20 9 Q24 8, 27 10" fill="none" stroke={c.feather} strokeWidth="0.8" opacity="0.3" />
    </g>
  ),
  mexican: (c) => (
    <g>
      <ellipse cx="20" cy="9" rx="6" ry="5" fill={c.hatTop} />
      <ellipse cx="20" cy="9" rx="5" ry="4" fill={c.hat} />
      <rect x="8" y="11" width="24" height="4" rx="2" fill={c.hat} />
      <rect x="8" y="11" width="24" height="2" fill={c.hatBand} />
      <rect x="8" y="13" width="24" height="1.5" rx="0.8" fill={c.hatTrim} />
      <ellipse cx="4" cy="13" rx="5" ry="3" fill={c.hat} />
      <ellipse cx="36" cy="13" rx="5" ry="3" fill={c.hat} />
      <ellipse cx="10" cy="11" rx="6" ry="2.5" fill={c.hat} />
      <ellipse cx="30" cy="11" rx="6" ry="2.5" fill={c.hat} />
      <ellipse cx="20" cy="13" rx="16" ry="2.5" fill={c.hat} opacity="0.8" />
      <rect x="7" y="13" width="4" height="2" rx="1" fill={c.hat} opacity="0.6" />
      <rect x="29" y="13" width="4" height="2" rx="1" fill={c.hat} opacity="0.6" />
      <ellipse cx="20" cy="13" rx="16" ry="2" fill={c.hat} />
      <ellipse cx="20" cy="13" rx="16" ry="1.2" fill={c.hatBand} />
      <ellipse cx="10" cy="7" rx="4" ry="3" fill={c.hatTop} opacity="0.5" />
      <ellipse cx="30" cy="7" rx="4" ry="3" fill={c.hatTop} opacity="0.5" />
      <circle cx="20" cy="20" r="10" fill={c.skin} />
      <circle cx="13" cy="18" r="1.8" fill={c.eye} />
      <circle cx="27" cy="18" r="1.8" fill={c.eye} />
      <circle cx="12.5" cy="17.2" r="0.7" fill="#fff" opacity="0.5" />
      <circle cx="26.5" cy="17.2" r="0.7" fill="#fff" opacity="0.5" />
      <circle cx="14" cy="23" r="2" fill={c.cheek} opacity="0.4" />
      <circle cx="26" cy="23" r="2" fill={c.cheek} opacity="0.4" />
      <ellipse cx="20" cy="22" rx="1.5" ry="1.2" fill={c.mustache} opacity="0.4" />
      <path d="M12 23 Q16 20, 18 22" fill="none" stroke={c.mustache} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 23 Q24 20, 22 22" fill="none" stroke={c.mustache} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 24 Q20 27, 26 24" fill="none" stroke={c.mustache} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="14" y="25" width="2" height="0.8" rx="0.4" fill={c.mustache} />
      <rect x="24" y="25" width="2" height="0.8" rx="0.4" fill={c.mustache} />
      <rect x="8" y="29" width="24" height="8" rx="3" fill={c.poncho} />
      <rect x="8" y="29" width="24" height="1.5" rx="0.8" fill={c.ponchoStripe2} />
      <rect x="8" y="31.5" width="24" height="1.5" rx="0.8" fill={c.ponchoStripe1} />
      <rect x="8" y="34" width="24" height="1.5" rx="0.8" fill={c.ponchoStripe2} />
      <circle cx="10" cy="36" r="1" fill={c.ponchoFringe} />
      <circle cx="14" cy="36" r="1" fill={c.ponchoFringe} />
      <circle cx="18" cy="36" r="1" fill={c.ponchoFringe} />
      <circle cx="22" cy="36" r="1" fill={c.ponchoFringe} />
      <circle cx="26" cy="36" r="1" fill={c.ponchoFringe} />
      <circle cx="30" cy="36" r="1" fill={c.ponchoFringe} />
      <rect x="4" y="30" width="5" height="5" rx="2" fill={c.arm} />
      <rect x="31" y="30" width="5" height="5" rx="2" fill={c.arm} />
      <rect x="12" y="36.5" width="5" height="2" rx="1" fill={c.shoe} />
      <rect x="23" y="36.5" width="5" height="2" rx="1" fill={c.shoe} />
      <rect x="12" y="37.5" width="5" height="1" rx="0.5" fill={c.shoeSole} />
      <rect x="23" y="37.5" width="5" height="1" rx="0.5" fill={c.shoeSole} />
    </g>
  ),
  realtor: (c) => (
    <g>
      <polygon points="20,2 2,14 38,14" fill={c.roof} />
      <polygon points="20,3 4,14 36,14" fill={c.roofHighlight} opacity="0.2" />
      <rect x="3" y="14" width="34" height="22" fill={c.wall} />
      <rect x="3" y="14" width="34" height="22" fill={c.wallShadow} opacity="0.05" />
      <rect x="3" y="14" width="34" height="1.5" fill={c.baseTop} />
      <rect x="3" y="34.5" width="34" height="1.5" fill={c.base} />
      <rect x="0" y="2" width="3" height="12" fill={c.chimney} />
      <rect x="0" y="2" width="3" height="3" fill={c.chimneyBrick} />
      <rect x="0" y="6" width="3" height="3" fill={c.chimneyBrick} opacity="0.6" />
      <rect x="0" y="10" width="3" height="3" fill={c.chimneyBrick} opacity="0.4" />
      <rect x="15" y="22" width="10" height="14" rx="2" fill={c.door} />
      <rect x="15" y="22" width="10" height="14" rx="2" fill="rgba(0,0,0,0.15)" />
      <rect x="15" y="23" width="10" height="3" rx="1" fill={c.door} opacity="0.8" />
      <circle cx="23" cy="30" r="1" fill={c.doorKnob} />
      <rect x="6" y="17" width="5" height="5" rx="1" fill={c.window} />
      <rect x="6" y="17" width="5" height="5" rx="1" fill="none" stroke={c.windowFrame} strokeWidth="0.8" />
      <line x1="8.5" y1="17" x2="8.5" y2="22" stroke={c.windowFrame} strokeWidth="0.5" />
      <line x1="6" y1="19.5" x2="11" y2="19.5" stroke={c.windowFrame} strokeWidth="0.5" />
      <rect x="29" y="17" width="5" height="5" rx="1" fill={c.window} />
      <rect x="29" y="17" width="5" height="5" rx="1" fill="none" stroke={c.windowFrame} strokeWidth="0.8" />
      <line x1="31.5" y1="17" x2="31.5" y2="22" stroke={c.windowFrame} strokeWidth="0.5" />
      <line x1="29" y1="19.5" x2="34" y2="19.5" stroke={c.windowFrame} strokeWidth="0.5" />
      <circle cx="20" cy="26" r="6" fill={c.roof} />
      <text x="20" y="28.5" fontFamily="Georgia,serif" fontSize="9" fontWeight="900" fill={c.ROutline} textAnchor="middle">R</text>
      <circle cx="20" cy="26" r="6" fill="none" stroke={c.roof} strokeWidth="0.8" />
    </g>
  ),
  sumo: (c) => (
    <g>
      <ellipse cx="20" cy="20" rx="14" ry="12" fill={c.skin} />
      <ellipse cx="20" cy="22" rx="12" ry="8" fill={c.skinShadow} opacity="0.2" />
      <circle cx="20" cy="3" r="3" fill={c.hair} />
      <ellipse cx="18" cy="1.5" rx="1.5" ry="1" fill={c.hair} opacity="0.6" />
      <ellipse cx="22" cy="1.5" rx="1.5" ry="1" fill={c.hair} opacity="0.6" />
      <circle cx="20" cy="5" r="5" fill={c.skin} />
      <ellipse cx="20" cy="5" rx="5" ry="3" fill={c.hair} />
      <path d="M16 3 L18 7 L20 4 L22 7 L24 3" fill={c.hair} />
      <circle cx="13" cy="10" r="2" fill={c.eye} />
      <circle cx="27" cy="10" r="2" fill={c.eye} />
      <circle cx="12.5" cy="9.5" r="0.7" fill={c.eyeHighlight} opacity="0.6" />
      <circle cx="26.5" cy="9.5" r="0.7" fill={c.eyeHighlight} opacity="0.6" />
      <line x1="8" y1="6" x2="16" y2="8.5" stroke={c.eyebrow} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="8.5" x2="32" y2="6" stroke={c.eyebrow} strokeWidth="2" strokeLinecap="round" />
      <circle cx="14" cy="14" r="2.5" fill={c.cheek} opacity="0.4" />
      <circle cx="26" cy="14" r="2.5" fill={c.cheek} opacity="0.4" />
      <circle cx="20" cy="13" r="2" fill={c.skinShadow} opacity="0.3" />
      <ellipse cx="20" cy="14.5" rx="1" ry="0.6" fill={c.hair} opacity="0.3" />
      <path d="M16 16 Q20 18 24 16" fill="none" stroke={c.hair} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <rect x="8" y="24" width="24" height="5" rx="2" fill={c.mawashi} />
      <rect x="8" y="24" width="24" height="1.5" fill={c.mawashiHighlight} opacity="0.3" />
      <rect x="10" y="25" width="20" height="0.8" rx="0.4" fill={c.beltLine} opacity="0.3" />
      <rect x="10" y="27" width="20" height="0.8" rx="0.4" fill={c.beltLine} opacity="0.3" />
      <rect x="15" y="28" width="10" height="2" rx="1" fill={c.mawashiKnot} />
      <rect x="17" y="24" width="6" height="3" rx="1" fill={c.mawashiKnot} opacity="0.6" />
      <rect x="7" y="28" width="4" height="4" rx="1" fill={c.loincloth} opacity="0.5" />
      <rect x="29" y="28" width="4" height="4" rx="1" fill={c.loincloth} opacity="0.5" />
      <rect x="3" y="23" width="6" height="8" rx="3" fill={c.arm} />
      <rect x="3" y="23" width="4" height="8" rx="2" fill={c.armShadow} opacity="0.3" />
      <rect x="31" y="23" width="6" height="8" rx="3" fill={c.arm} />
      <rect x="33" y="23" width="4" height="8" rx="2" fill={c.armShadow} opacity="0.3" />
      <rect x="11" y="31" width="7" height="7" rx="3" fill={c.leg} />
      <rect x="22" y="31" width="7" height="7" rx="3" fill={c.leg} />
      <rect x="11" y="31" width="4" height="7" rx="2" fill={c.legShadow} opacity="0.3" />
      <rect x="25" y="31" width="4" height="7" rx="2" fill={c.legShadow} opacity="0.3" />
      <rect x="12" y="37" width="5" height="1" rx="0.5" fill={c.toes} opacity="0.3" />
      <rect x="23" y="37" width="5" height="1" rx="0.5" fill={c.toes} opacity="0.3" />
      <ellipse cx="11" cy="20" rx="2" ry="3" fill={c.skinShadow} opacity="0.1" />
      <ellipse cx="29" cy="20" rx="2" ry="3" fill={c.skinShadow} opacity="0.1" />
    </g>
  ),
  mexicanWoman: (c) => (
    <g>
      <ellipse cx="20" cy="18" rx="12" ry="12" fill={c.skin} />
      <ellipse cx="20" cy="18" rx="10" ry="10" fill={c.skin} opacity="0.5" />
      <ellipse cx="12" cy="10" rx="5" ry="10" fill={c.hair} />
      <ellipse cx="28" cy="10" rx="5" ry="10" fill={c.hair} />
      <ellipse cx="20" cy="6" rx="8" ry="5" fill={c.hair} />
      <path d="M12 10 Q8 4, 10 2 Q12 0, 16 4" fill={c.hair} />
      <path d="M28 10 Q32 4, 30 2 Q28 0, 24 4" fill={c.hair} />
      <ellipse cx="13" cy="4" rx="3" ry="5" fill={c.hair} opacity="0.7" />
      <ellipse cx="27" cy="4" rx="3" ry="5" fill={c.hair} opacity="0.7" />
      <circle cx="13" cy="16" r="2.2" fill={c.eye} />
      <circle cx="27" cy="16" r="2.2" fill={c.eye} />
      <circle cx="12.3" cy="15.2" r="0.8" fill={c.eyeHighlight} opacity="0.6" />
      <circle cx="26.3" cy="15.2" r="0.8" fill={c.eyeHighlight} opacity="0.6" />
      <circle cx="12" cy="20" r="2.5" fill={c.cheek} opacity="0.4" />
      <circle cx="28" cy="20" r="2.5" fill={c.cheek} opacity="0.4" />
      <circle cx="20" cy="21" r="1.5" fill={c.lip} opacity="0.15" />
      <path d="M17 22 Q20 24.5 23 22" fill="none" stroke={c.lip} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="10" cy="13" r="3" fill={c.flower1} />
      <circle cx="10" cy="13" r="1.5" fill={c.flower2} />
      <circle cx="10" cy="13" r="0.8" fill={c.flowerCenter} />
      <circle cx="30" cy="11" r="2.5" fill={c.flower2} />
      <circle cx="30" cy="11" r="1.2" fill={c.flower1} />
      <circle cx="30" cy="11" r="0.7" fill={c.flowerCenter} />
      <path d="M14 26 L16 27" stroke={c.earring} strokeWidth="1" strokeLinecap="round" />
      <circle cx="14" cy="27.5" r="1.2" fill={c.earring} />
      <path d="M24 26 L26 27" stroke={c.earring} strokeWidth="1" strokeLinecap="round" />
      <circle cx="26" cy="27.5" r="1.2" fill={c.earring} />
      <rect x="9" y="28" width="22" height="8" rx="3" fill={c.dress} />
      <rect x="9" y="30" width="22" height="1.2" rx="0.6" fill={c.dressStripe2} />
      <rect x="9" y="32.5" width="22" height="1.2" rx="0.6" fill={c.dressStripe1} />
      <rect x="9" y="35" width="22" height="1.2" rx="0.6" fill={c.dressStripe2} />
      <circle cx="13" cy="29" r="0.8" fill={c.dressEmbellish} opacity="0.5" />
      <circle cx="17" cy="29" r="0.8" fill={c.dressEmbellish} opacity="0.5" />
      <circle cx="23" cy="29" r="0.8" fill={c.dressEmbellish} opacity="0.5" />
      <circle cx="27" cy="29" r="0.8" fill={c.dressEmbellish} opacity="0.5" />
      <path d="M7 27 Q10 24, 14 28" fill="none" stroke={c.rebozo} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 28 Q30 24, 33 27" fill="none" stroke={c.rebozo} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="4" y="27" width="6" height="1" rx="0.5" fill={c.rebozo} />
      <rect x="30" y="27" width="6" height="1" rx="0.5" fill={c.rebozo} />
      <circle cx="5" cy="28" r="0.6" fill={c.rebozoFringe} opacity="0.6" />
      <circle cx="7" cy="28" r="0.6" fill={c.rebozoFringe} opacity="0.6" />
      <circle cx="9" cy="28" r="0.6" fill={c.rebozoFringe} opacity="0.6" />
      <circle cx="31" cy="28" r="0.6" fill={c.rebozoFringe} opacity="0.6" />
      <circle cx="33" cy="28" r="0.6" fill={c.rebozoFringe} opacity="0.6" />
      <circle cx="35" cy="28" r="0.6" fill={c.rebozoFringe} opacity="0.6" />
      <rect x="13" y="36" width="5" height="2" rx="1" fill={c.shoe} />
      <rect x="22" y="36" width="5" height="2" rx="1" fill={c.shoe} />
    </g>
  ),
  colombia: (c) => (
    <g>
      <ellipse cx="20" cy="18" rx="12" ry="12" fill={c.skin} />
      <ellipse cx="20" cy="18" rx="6" ry="3" fill="none" stroke={c.hair} strokeWidth="0.5" opacity="0.1" />
      <ellipse cx="20" cy="8" rx="8" ry="4" fill={c.hair} />
      <ellipse cx="20" cy="7" rx="9" ry="3" fill={c.hat} />
      <ellipse cx="20" cy="8" rx="9" ry="3.5" fill="none" stroke={c.hatPattern} strokeWidth="0.6" strokeDasharray="1.5,1.5" opacity="0.5" />
      <ellipse cx="20" cy="7.5" rx="9" ry="3.2" fill="none" stroke={c.hatPattern} strokeWidth="0.6" strokeDasharray="1.5,1.5" opacity="0.3" />
      <rect x="11" y="8" width="18" height="2.5" rx="1" fill={c.hat} />
      <rect x="4" y="8" width="24" height="2" rx="1" fill={c.hatBand} />
      <rect x="11" y="10" width="18" height="1.5" rx="0.8" fill={c.hat} opacity="0.8" />
      <rect x="4" y="9.8" width="6" height="1.5" rx="0.8" fill={c.hat} />
      <rect x="30" y="9.8" width="6" height="1.5" rx="0.8" fill={c.hat} />
      <circle cx="13" cy="16" r="2.2" fill={c.eye} />
      <circle cx="27" cy="16" r="2.2" fill={c.eye} />
      <circle cx="12.3" cy="15.2" r="0.8" fill={c.eyeHighlight} opacity="0.6" />
      <circle cx="26.3" cy="15.2" r="0.8" fill={c.eyeHighlight} opacity="0.6" />
      <circle cx="13" cy="20" r="2.5" fill={c.cheek} opacity="0.4" />
      <circle cx="27" cy="20" r="2.5" fill={c.cheek} opacity="0.4" />
      <ellipse cx="20" cy="22" rx="1.5" ry="1" fill={c.mustache} opacity="0.15" />
      <path d="M15 22 Q20 25 25 22" fill="none" stroke={c.hair} strokeWidth="0.8" strokeLinecap="round" opacity="0.15" />
      <path d="M16 22.5 Q20 24 24 22.5" fill="none" stroke={c.mustache} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <rect x="10" y="27" width="20" height="4" rx="2" fill={c.ruana} />
      <rect x="10" y="27" width="20" height="1" rx="0.5" fill={c.ruanaStripe1} />
      <rect x="10" y="29" width="20" height="1" rx="0.5" fill={c.ruanaStripe2} />
      <rect x="10" y="31" width="20" height="1" rx="0.5" fill={c.ruanaStripe1} />
      <rect x="10" y="31" width="20" height="5" rx="2" fill={c.shirt} />
      <rect x="4" y="27" width="7" height="5" rx="2" fill={c.ruana} opacity="0.7" />
      <rect x="29" y="27" width="7" height="5" rx="2" fill={c.ruana} opacity="0.7" />
      <rect x="4" y="30" width="6" height="4" rx="2" fill={c.skin} />
      <rect x="30" y="30" width="6" height="4" rx="2" fill={c.skin} />
      <rect x="13" y="35" width="6" height="3" rx="1.5" fill={c.coffee} />
      <rect x="13" y="35" width="6" height="1" rx="0.5" fill={c.coffeeHighlight} opacity="0.3" />
      <rect x="21" y="35" width="6" height="3" rx="1.5" fill={c.coffee} />
      <rect x="21" y="35" width="6" height="1" rx="0.5" fill={c.coffeeHighlight} opacity="0.3" />
      <rect x="12" y="37.5" width="5" height="1" rx="0.5" fill={c.shoe} />
      <rect x="23" y="37.5" width="5" height="1" rx="0.5" fill={c.shoe} />
    </g>
  ),
  businessMan: (c) => (
    <g>
      <ellipse cx="20" cy="18" rx="12" ry="12" fill={c.skin} />
      <ellipse cx="20" cy="18" rx="10" ry="10" fill={c.skinShadow} opacity="0.15" />
      <ellipse cx="20" cy="7" rx="8" ry="6" fill={c.hair} />
      <rect x="12" y="5" width="16" height="5" rx="2" fill={c.hair} />
      <path d="M20 2 L20 7" stroke={c.hair} strokeWidth="1.5" opacity="0.4" />
      <path d="M14 4 Q20 1 26 4" fill="none" stroke={c.hair} strokeWidth="0.8" opacity="0.4" />
      <rect x="8" y="7" width="5" height="4" rx="2" fill={c.hair} />
      <rect x="27" y="7" width="5" height="4" rx="2" fill={c.hair} />
      <ellipse cx="9" cy="7" rx="2" ry="3" fill={c.hair} />
      <ellipse cx="31" cy="7" rx="2" ry="3" fill={c.hair} />
      <rect x="7" y="12" width="26" height="1.5" fill="none" stroke={c.glasses} strokeWidth="1" rx="2" />
      <circle cx="13" cy="13" r="4" fill="none" stroke={c.glasses} strokeWidth="1.2" />
      <circle cx="27" cy="13" r="4" fill="none" stroke={c.glasses} strokeWidth="1.2" />
      <circle cx="13" cy="13" r="4" fill={c.glassesHighlight} opacity="0.08" />
      <circle cx="27" cy="13" r="4" fill={c.glassesHighlight} opacity="0.08" />
      <circle cx="13" cy="16.5" r="2" fill={c.eye} />
      <circle cx="27" cy="16.5" r="2" fill={c.eye} />
      <circle cx="12.3" cy="15.7" r="0.8" fill={c.eyeHighlight} opacity="0.6" />
      <circle cx="26.3" cy="15.7" r="0.8" fill={c.eyeHighlight} opacity="0.6" />
      <circle cx="13" cy="21" r="2.5" fill={c.cheek} opacity="0.35" />
      <circle cx="27" cy="21" r="2.5" fill={c.cheek} opacity="0.35" />
      <circle cx="20" cy="22" r="1.5" fill={c.skinShadow} opacity="0.15" />
      <path d="M16 23 Q20 25 24 23" fill="none" stroke={c.skinShadow} strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
      <rect x="14" y="26" width="12" height="2" rx="1" fill={c.shirt} />
      <polygon points="16,26 14,28 20,29 26,28 24,26" fill={c.shirt} />
      <rect x="18" y="26" width="4" height="8" rx="1" fill={c.tie} />
      <rect x="18" y="26" width="4" height="8" rx="1" fill={c.tieHighlight} opacity="0.2" />
      <polygon points="18,26 22,26 21,24 19,24" fill={c.tie} />
      <rect x="19" y="30" width="2" height="1.5" rx="0.3" fill={c.tieClip} />
      <rect x="8" y="28" width="24" height="9" rx="3" fill={c.suit} />
      <rect x="8" y="28" width="24" height="2" rx="1" fill={c.suitHighlight} opacity="0.15" />
      <polygon points="8,28 14,26 20,29" fill={c.suit} />
      <polygon points="32,28 26,26 20,29" fill={c.suit} />
      <rect x="4" y="29" width="5" height="7" rx="2" fill={c.suit} />
      <rect x="31" y="29" width="5" height="7" rx="2" fill={c.suit} />
      <rect x="4" y="30" width="4" height="5" rx="1.5" fill={c.shirt} opacity="0.8" />
      <rect x="32" y="30" width="4" height="5" rx="1.5" fill={c.shirt} opacity="0.8" />
      <rect x="14" y="36.5" width="5" height="2" rx="1" fill={c.shoe} />
      <rect x="21" y="36.5" width="5" height="2" rx="1" fill={c.shoe} />
      <rect x="19" y="33" width="2" height="1.5" rx="0.3" fill={c.suitHighlight} opacity="0.1" />
    </g>
  ),
  chespirito: (c) => (
    <g>
      <path d="M20 37 C8 26 2 20 2 14 C2 8 7 3 13 3 C16 3 18 4.5 20 7 C22 4.5 24 3 27 3 C33 3 38 8 38 14 C38 20 32 26 20 37Z" fill={c.heart} />
      <path d="M20 35 C10 25 4 20 4 14 C4 9 8 5 13 5 C16 5 18.5 6.5 20 9 C21.5 6.5 24 5 27 5 C32 5 36 9 36 14 C36 20 30 25 20 35Z" fill={c.heartHighlight} opacity="0.35" />
      <path d="M13 3 C16 3 18 4.5 20 7 C22 4.5 24 3 27 3 C29 3 30.5 3.5 31.5 4.5 C27 1 22 3 20 7 C18 3 13 1 8.5 4.5 C9.5 3.5 11 3 13 3Z" fill={c.heartShadow} opacity="0.25" />
      <circle cx="20" cy="14" r="11" fill={c.heart} opacity="0.25" />
      <text x="20" y="16.5" fontFamily="Arial,Helvetica,sans-serif" fontSize="13" fontWeight="900" fill={c.letter} textAnchor="middle" dominantBaseline="central">CH</text>
      <text x="20" y="16.5" fontFamily="Arial,Helvetica,sans-serif" fontSize="13" fontWeight="900" fill="none" stroke={c.letterOutline} strokeWidth="0.3" textAnchor="middle" dominantBaseline="central" opacity="0.4" />
    </g>
  ),
  baby: (c) => (
    <g>
      <ellipse cx="20" cy="18" rx="11" ry="11" fill={c.skin} />
      <ellipse cx="20" cy="18" rx="9" ry="9" fill={c.skinShadow} opacity="0.1" />
      <ellipse cx="20" cy="6" rx="5" ry="3" fill={c.hair} />
      <ellipse cx="17" cy="5" rx="2.5" ry="2" fill={c.hair} opacity="0.7" />
      <ellipse cx="23" cy="5" rx="2.5" ry="2" fill={c.hair} opacity="0.7" />
      <circle cx="20" cy="4" r="1.5" fill={c.hair} />
      <circle cx="13" cy="16" r="3" fill={c.eye} />
      <circle cx="27" cy="16" r="3" fill={c.eye} />
      <circle cx="12" cy="15" r="1.2" fill={c.eyeHighlight} opacity="0.7" />
      <circle cx="26" cy="15" r="1.2" fill={c.eyeHighlight} opacity="0.7" />
      <circle cx="10" cy="15" r="0.5" fill={c.eyeHighlight} opacity="0.4" />
      <circle cx="24" cy="15" r="0.5" fill={c.eyeHighlight} opacity="0.4" />
      <circle cx="13" cy="21" r="2.5" fill={c.cheek} opacity="0.5" />
      <circle cx="27" cy="21" r="2.5" fill={c.cheek} opacity="0.5" />
      <path d="M17 20 Q20 22.5 23 20" fill="none" stroke={c.skinShadow} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <circle cx="20" cy="22" r="1.8" fill={c.pacifier} />
      <circle cx="20" cy="22" r="1.2" fill={c.pacifier} opacity="0.5" />
      <rect x="17" y="21.5" width="6" height="1.5" rx="0.5" fill={c.pacifierRing} />
      <rect x="9" y="27" width="22" height="7" rx="3" fill={c.bib} />
      <rect x="9" y="27" width="22" height="7" rx="3" fill={c.bibStripe} opacity="0.15" />
      <rect x="12" y="28" width="16" height="1.5" rx="0.8" fill={c.bibStripe} opacity="0.4" />
      <rect x="12" y="31" width="16" height="1.5" rx="0.8" fill={c.bibStripe} opacity="0.4" />
      <rect x="5" y="28" width="5" height="5" rx="2" fill={c.body} />
      <rect x="30" y="28" width="5" height="5" rx="2" fill={c.body} />
      <rect x="13" y="34" width="5" height="3" rx="1.5" fill={c.shoe} />
      <rect x="22" y="34" width="5" height="3" rx="1.5" fill={c.shoe} />
    </g>
  ),
};

export default function MarioAvatar({ character = 'mario', size = 40 }) {
  const c = charData[character];
  if (!c) return null;
  const render = renderers[character] || renderers.mario;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {render(c)}
    </svg>
  );
}

export { charData };