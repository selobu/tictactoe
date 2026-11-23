import { useId } from 'react';

export default function Turtle() {
  const uid = useId().replace(/:/g, '');
  const shellId = `turtle-shell-${uid}`;
  const skinId = `turtle-skin-${uid}`;
  const shoeId = `turtle-shoe-${uid}`;

  const backLeg = (
    <g className="turtle-leg-back">
      <path d="M98 106 q8 12 6 22" stroke="#8a5a00" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M98 106 q8 12 6 22" stroke={`url(#${skinId})`} strokeWidth="11" strokeLinecap="round" fill="none" />
      <ellipse cx="106" cy="136" rx="21" ry="9" fill={`url(#${shoeId})`} stroke="#16652a" strokeWidth="2.5" />
      <path d="M87 140 h37" stroke="#f3f0dc" strokeWidth="4" strokeLinecap="round" />
    </g>
  );

  const frontLeg = (
    <g className="turtle-leg-front">
      <path d="M74 108 q-8 12 -12 20" stroke="#8a5a00" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M74 108 q-8 12 -12 20" stroke={`url(#${skinId})`} strokeWidth="11" strokeLinecap="round" fill="none" />
      <ellipse cx="54" cy="137" rx="23" ry="9" fill={`url(#${shoeId})`} stroke="#16652a" strokeWidth="2.5" />
      <path d="M33 141 h39" stroke="#f3f0dc" strokeWidth="4" strokeLinecap="round" />
    </g>
  );

  return (
    <svg
      className="turtle-svg"
      viewBox="0 0 140 150"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={shellId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8be86a" />
          <stop offset="0.55" stopColor="#43b44e" />
          <stop offset="1" stopColor="#1f7a34" />
        </linearGradient>
        <linearGradient id={skinId} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#ffe982" />
          <stop offset="0.5" stopColor="#ffc93c" />
          <stop offset="1" stopColor="#e89a12" />
        </linearGradient>
        <linearGradient id={shoeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#79e86f" />
          <stop offset="0.55" stopColor="#3fbf4f" />
          <stop offset="1" stopColor="#1f8a38" />
        </linearGradient>
      </defs>

      <ellipse cx="72" cy="145" rx="50" ry="5" fill="rgba(20,50,20,.22)" />

      <path
        d="M116 104 q16 -2 16 10 q-10 3 -18 -4 z"
        fill={`url(#${skinId})`}
        stroke="#8a5a00"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      <ellipse cx="90" cy="88" rx="41" ry="37" fill="#f7f0d8" stroke="#5a3a00" strokeWidth="3" />

      <g className="turtle-shell">
        <ellipse cx="90" cy="88" rx="35" ry="31" fill={`url(#${shellId})`} stroke="#145a26" strokeWidth="3" />
        <path
          d="M90 61 L107 73 L107 102 L90 114 L73 102 L73 73 Z"
          fill="none"
          stroke="#1c6b30"
          strokeWidth="2.4"
          opacity="0.85"
        />
        <path d="M90 61 L90 114 M73 73 L107 102 M107 73 L73 102" stroke="#1c6b30" strokeWidth="1.6" opacity="0.45" />
        <path
          d="M66 76 q10 -13 26 -14"
          stroke="rgba(255,255,255,.55)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      <path
        d="M55 105 q16 20 35 20 q20 0 35 -20"
        fill="none"
        stroke="#f9f4e2"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.85"
      />

      <path
        d="M62 70 q18 0 24 14 q-8 12 -24 10 z"
        fill={`url(#${skinId})`}
        stroke="#8a5a00"
        strokeWidth="2.5"
      />

      <g className="turtle-head">
        <path
          d="M66 22 Q42 10 24 26 Q8 42 14 60 Q20 78 40 80 Q60 82 70 64 Q76 48 70 32 Q69 26 66 22 Z"
          fill={`url(#${skinId})`}
          stroke="#8a5a00"
          strokeWidth="3"
        />
        <path
          d="M15 56 q-7 3 -4 10 q3 6 12 5"
          fill={`url(#${skinId})`}
          stroke="#8a5a00"
          strokeWidth="2.5"
        />
        <path d="M12 64 q7 4 15 1" fill="none" stroke="#8a5a00" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="20" cy="68" r="1.5" fill="#8a5a00" opacity="0.5" />
        <g className="turtle-eye">
          <ellipse cx="40" cy="40" rx="11" ry="15" transform="rotate(-8 40 40)" fill="#fff" stroke="#5a3a00" strokeWidth="2.5" />
          <g className="turtle-pupil">
            <ellipse cx="36" cy="43" rx="5" ry="7" fill="#2a1a10" />
            <circle cx="34" cy="40" r="1.8" fill="#fff" />
          </g>
        </g>
        <path d="M29 26 q11 -7 22 0" fill="none" stroke="#8a5a00" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      <g className="turtle-arm">
        <path d="M58 80 q-14 4 -24 16" stroke="#8a5a00" strokeWidth="16" strokeLinecap="round" fill="none" />
        <path d="M58 80 q-14 4 -24 16" stroke={`url(#${skinId})`} strokeWidth="11" strokeLinecap="round" fill="none" />
        <circle cx="34" cy="99" r="9" fill={`url(#${skinId})`} stroke="#8a5a00" strokeWidth="2.5" />
        <path d="M29 97 q4 3 8 1" fill="none" stroke="#8a5a00" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      </g>

      <g className="legs-layer">
        <g className="leg-pair leg-pair-a">
          {backLeg}
          {frontLeg}
        </g>
        <g className="leg-pair leg-pair-b">
          {frontLeg}
          {backLeg}
        </g>
      </g>
    </svg>
  );
}
