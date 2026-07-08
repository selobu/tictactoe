import { useMemo } from 'react';

const COLORS = ['#f7971e', '#ffd200', '#ff6b6b', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#01a3a4', '#f368e0', '#ff9f43'];
const SHAPES = ['●', '■', '▲', '★', '♦', '♥'];

export default function ChampionScreen({ champion, onPlayAgain }) {
  const particles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      size: 8 + Math.random() * 16,
      rotation: Math.random() * 360,
    })),
  []);

  return (
    <div className="champion-screen">
      <div className="confetti-container">
        {particles.map((p) => (
          <span
            key={p.id}
            className="confetti-particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              color: p.color,
              fontSize: `${p.size}px`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          >
            {p.shape}
          </span>
        ))}
      </div>
      <div className="champion-card">
        <div className="trophy">🏆</div>
        <div className="champion-avatar">{champion.avatar}</div>
        <h2>{champion.name}</h2>
        <p className="champion-coins">{champion.coins ?? 0} 🪙 coins</p>
        <p className="champion-title">Champion!</p>
        <button className="play-again-btn" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
}
