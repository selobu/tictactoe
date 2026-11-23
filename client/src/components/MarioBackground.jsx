import Turtle from './Turtle';

export default function MarioBackground() {
  return (
    <div className="mario-bg">
      <div className="mario-sky">
        <div className="sky-glow-left" />
        <div className="sky-glow-right" />
        <div className="sky-rainbow" />
      </div>

      <div className="sun-flare" />

      <div className="mario-sun">
        <div className="sun-core">
          <div className="sun-face">
            <span className="sun-eye sun-eye-l"><span className="sun-pupil" /></span>
            <span className="sun-eye sun-eye-r"><span className="sun-pupil" /></span>
            <span className="sun-brow sun-brow-l" />
            <span className="sun-brow sun-brow-r" />
            <svg className="sun-mouth" viewBox="0 0 32 18" aria-hidden="true" focusable="false">
              <path d="M4 5.5 Q16 20 28 5.5" fill="none" stroke="#7a4500" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
            <span className="sun-cheek sun-cheek-l" />
            <span className="sun-cheek sun-cheek-r" />
          </div>
        </div>
        <div className="sun-ray ray-1" />
        <div className="sun-ray ray-2" />
        <div className="sun-ray ray-3" />
        <div className="sun-ray ray-4" />
        <div className="sun-ray ray-5" />
        <div className="sun-ray ray-6" />
        <div className="sun-ray ray-7" />
        <div className="sun-ray ray-8" />
      </div>

      <div className="mario-clouds-layer">
        <div className="mario-cloud cloud-1">
          <div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" />
        </div>
        <div className="mario-cloud cloud-2">
          <div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" />
        </div>
        <div className="mario-cloud cloud-3">
          <div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" />
        </div>
        <div className="mario-cloud cloud-4">
          <div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" />
        </div>
        <div className="mario-cloud cloud-5">
          <div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" />
        </div>
        <div className="mario-cloud cloud-6">
          <div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" />
        </div>
        <div className="mario-cloud cloud-7">
          <div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" />
        </div>
        <div className="mario-cloud cloud-8">
          <div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" /><div className="cloud-circle" />
        </div>
      </div>

      <div className="floating-islands-layer">
        <div className="floating-island island-1">
          <div className="island-grass"><span /><span /><span /></div>
          <div className="island-rock" />
          <div className="island-waterfall" />
          <div className="island-mist" />
        </div>
        <div className="floating-island island-2">
          <div className="island-grass"><span /><span /></div>
          <div className="island-rock" />
          <div className="island-waterfall" />
          <div className="island-mist" />
        </div>
        <div className="floating-island island-3">
          <div className="island-grass"><span /></div>
          <div className="island-rock" />
          <div className="island-waterfall" />
        </div>
      </div>

      <div className="distant-hills-layer">
        <div className="distant-mountain dm-1" />
        <div className="distant-mountain dm-2" />
        <div className="dhill dhill-1" />
        <div className="dhill dhill-2" />
        <div className="dhill dhill-3" />
        <div className="dhill dhill-4" />
      </div>

      <div className="tree-layer">
        <div className="tree tree-1">
          <div className="tree-trunk" />
          <div className="tree-top" />
          <div className="tree-leaf l1" /><div className="tree-leaf l2" /><div className="tree-leaf l3" /><div className="tree-leaf l4" />
        </div>
        <div className="tree tree-2">
          <div className="tree-trunk" />
          <div className="tree-top" />
          <div className="tree-leaf l1" /><div className="tree-leaf l2" /><div className="tree-leaf l3" />
        </div>
        <div className="tree tree-3">
          <div className="tree-trunk" />
          <div className="tree-top" />
          <div className="tree-leaf l1" /><div className="tree-leaf l2" /><div className="tree-leaf l3" /><div className="tree-leaf l4" /><div className="tree-leaf l5" />
        </div>
      </div>

      <div className="floating-elements">
        <div className="question-block qb-1" />
        <div className="question-block qb-2" />
        <div className="float-coin coin-f1" />
        <div className="float-coin coin-f2" />
        <div className="float-coin coin-f3" />
        <div className="float-coin coin-f4" />
        <div className="float-coin coin-f5" />
      </div>

      <div className="flagpole-area">
        <div className="flagpole-pole" />
        <div className="flagpole-ball" />
        <div className="flagpole-flag">
          <div className="flag-inner">
            <div className="flag-emblem">
              <span className="flag-letter">S</span>
            </div>
          </div>
        </div>
        <div className="flagpole-base" />
      </div>

      <div className="mario-hills">
        <div className="hill hill-1">
          <div className="hill-stripe" /><div className="hill-stripe" />
        </div>
        <div className="hill hill-2">
          <div className="hill-stripe" /><div className="hill-stripe" />
        </div>
        <div className="hill hill-3">
          <div className="hill-stripe" /><div className="hill-stripe" />
        </div>
      </div>

      <div className="castle-layer">
        <div className="castle-glow" />
        <svg className="castle" viewBox="0 0 220 200" role="presentation" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="castle-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fffdf8" />
              <stop offset="0.62" stopColor="#f3e9ff" />
              <stop offset="1" stopColor="#d7c4ec" />
            </linearGradient>
            <linearGradient id="castle-roof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffc0d9" />
              <stop offset="0.5" stopColor="#f25c9b" />
              <stop offset="1" stopColor="#c02667" />
            </linearGradient>
            <linearGradient id="castle-door" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#563672" />
              <stop offset="1" stopColor="#241533" />
            </linearGradient>
            <linearGradient id="castle-window" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c9f5ff" />
              <stop offset="1" stopColor="#67c9f2" />
            </linearGradient>
          </defs>

          <ellipse cx="110" cy="190" rx="100" ry="10" fill="#1e5a20" opacity="0.28" />

          <rect x="20" y="96" width="42" height="92" rx="3" fill="url(#castle-wall)" stroke="#b9a6d6" strokeWidth="1.2" />
          <path d="M12 100 L41 48 L70 100 Z" fill="url(#castle-roof)" stroke="#a32760" strokeWidth="1.2" />
          <path d="M12 100 L41 48 L70 100" fill="none" stroke="#ffd6e6" strokeWidth="1" opacity="0.55" />
          <rect x="31" y="116" width="18" height="26" rx="9" fill="url(#castle-window)" stroke="#4a9bc9" strokeWidth="1.2" />
          <rect x="31" y="156" width="18" height="20" rx="3" fill="#f8f3ff" opacity="0.75" />

          <rect x="158" y="96" width="42" height="92" rx="3" fill="url(#castle-wall)" stroke="#b9a6d6" strokeWidth="1.2" />
          <path d="M150 100 L179 48 L208 100 Z" fill="url(#castle-roof)" stroke="#a32760" strokeWidth="1.2" />
          <path d="M150 100 L179 48 L208 100" fill="none" stroke="#ffd6e6" strokeWidth="1" opacity="0.55" />
          <rect x="171" y="116" width="18" height="26" rx="9" fill="url(#castle-window)" stroke="#4a9bc9" strokeWidth="1.2" />
          <rect x="171" y="156" width="18" height="20" rx="3" fill="#f8f3ff" opacity="0.75" />

          <rect x="60" y="122" width="100" height="66" rx="3" fill="url(#castle-wall)" stroke="#b9a6d6" strokeWidth="1.2" />
          <path d="M52 126 L110 74 L168 126 Z" fill="url(#castle-roof)" stroke="#a32760" strokeWidth="1.2" />
          <path d="M52 126 L110 74 L168 126" fill="none" stroke="#ffd6e6" strokeWidth="1" opacity="0.5" />

          <rect x="89" y="66" width="42" height="64" rx="3" fill="url(#castle-wall)" stroke="#b9a6d6" strokeWidth="1.2" />
          <path d="M80 70 L110 14 L140 70 Z" fill="url(#castle-roof)" stroke="#a32760" strokeWidth="1.2" />
          <path d="M80 70 L110 14 L140 70" fill="none" stroke="#ffd6e6" strokeWidth="1" opacity="0.55" />
          <rect x="102" y="82" width="16" height="24" rx="8" fill="url(#castle-window)" stroke="#4a9bc9" strokeWidth="1.2" />

          <path d="M94 188 L94 150 Q110 132 126 150 L126 188 Z" fill="url(#castle-door)" stroke="#1b1026" strokeWidth="1.2" />
          <path d="M101 188 L101 154 Q110 143 119 154 L119 188 Z" fill="#8a5fae" opacity="0.5" />

          <path d="M110 14 L110 0 L134 7 L110 14 Z" fill="#ffd200" stroke="#d19a00" strokeWidth="1" />
          <path d="M41 48 L41 35 L61 41 L41 47 Z" fill="#ffd200" stroke="#d19a00" strokeWidth="1" />
          <path d="M179 48 L179 35 L199 41 L179 47 Z" fill="#ffd200" stroke="#d19a00" strokeWidth="1" />
        </svg>
      </div>

      <div className="pipe-layer">
        <div className="pipe pipe-1">
          <div className="pipe-rim" />
          <div className="pipe-body" />
          <div className="pipe-glow" />
        </div>
        <div className="pipe pipe-2">
          <div className="pipe-rim" />
          <div className="pipe-body" />
          <div className="pipe-glow" />
        </div>
      </div>

      <div className="mario-bushes">
        <div className="bush bush-1">
          <div className="bush-circle" /><div className="bush-circle" /><div className="bush-circle" />
        </div>
        <div className="bush bush-2">
          <div className="bush-circle" /><div className="bush-circle" /><div className="bush-circle" />
        </div>
        <div className="bush bush-3">
          <div className="bush-circle" /><div className="bush-circle" />
        </div>
        <div className="bush bush-4">
          <div className="bush-circle" /><div className="bush-circle" /><div className="bush-circle" /><div className="bush-circle" />
        </div>
      </div>

      <div className="fire-flower-layer">
        <div className="fire-flower ff-1">
          <div className="ff-stem" />
          <div className="ff-leaf ff-leaf-l" />
          <div className="ff-leaf ff-leaf-r" />
          <div className="ff-head">
            <div className="ff-glow" />
            <div className="ff-petal p1" /><div className="ff-petal p2" /><div className="ff-petal p3" />
            <div className="ff-petal p4" /><div className="ff-petal p5" /><div className="ff-petal p6" />
            <div className="ff-center" />
            <div className="ff-face">
              <div className="ff-eye el" /><div className="ff-eye er" />
              <div className="ff-mouth" />
            </div>
          </div>
        </div>
        <div className="fire-flower ff-2">
          <div className="ff-stem" />
          <div className="ff-leaf ff-leaf-l" />
          <div className="ff-leaf ff-leaf-r" />
          <div className="ff-head">
            <div className="ff-glow" />
            <div className="ff-petal p1" /><div className="ff-petal p2" /><div className="ff-petal p3" />
            <div className="ff-petal p4" /><div className="ff-petal p5" /><div className="ff-petal p6" />
            <div className="ff-center" />
            <div className="ff-face">
              <div className="ff-eye el" /><div className="ff-eye er" />
              <div className="ff-mouth" />
            </div>
          </div>
        </div>
        <div className="fire-flower ff-3">
          <div className="ff-stem" />
          <div className="ff-leaf ff-leaf-l" />
          <div className="ff-leaf ff-leaf-r" />
          <div className="ff-head">
            <div className="ff-glow" />
            <div className="ff-petal p1" /><div className="ff-petal p2" /><div className="ff-petal p3" />
            <div className="ff-petal p4" /><div className="ff-petal p5" /><div className="ff-petal p6" />
            <div className="ff-center" />
            <div className="ff-face">
              <div className="ff-eye el" /><div className="ff-eye er" />
              <div className="ff-mouth" />
            </div>
          </div>
        </div>
      </div>

      <div className="mario-ground">
        <div className="ground-top" />
        <div className="ground-body">
          <div className="brick-row">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="brick" />
            ))}
          </div>
          <div className="brick-row">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className={`brick ${i % 2 === 0 ? 'offset' : ''}`} />
            ))}
          </div>
          <div className="brick-row">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="brick" />
            ))}
          </div>
          <div className="brick-row">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className={`brick ${i % 2 === 1 ? 'offset' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="turtle-layer" aria-hidden="true">
        <div className="walking-turtle turtle-3">
          <div className="turtle-bob"><Turtle /></div>
        </div>
        <div className="walking-turtle turtle-2">
          <div className="turtle-bob"><Turtle /></div>
        </div>
        <div className="walking-turtle turtle-5">
          <div className="turtle-bob"><Turtle /></div>
        </div>
        <div className="walking-turtle turtle-4">
          <div className="turtle-bob"><Turtle /></div>
        </div>
        <div className="walking-turtle turtle-1">
          <div className="turtle-bob"><Turtle /></div>
        </div>
      </div>
    </div>
  );
}
