import { useMemo } from 'react';
import AvatarDisplay from './AvatarDisplay';

const COLORS = ['#f7971e', '#ffd200', '#ff6b6b', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#01a3a4', '#f368e0', '#ff9f43'];
const SHAPES = ['●', '■', '▲', '★', '♦', '♥'];

export default function ChampionScreen({ champion, players, onPlayAgain, runnerUp, mostCoins }) {
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

  const isSame = (a, b) => a?.id === b?.id;

  const sortedPlayers = useMemo(() => {
    return [...(players || [])]
      .sort((a, b) => (b.coins ?? 0) - (a.coins ?? 0));
  }, [players, champion]);

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
      <div className="champion-content">
        <div className="champion-card">
          <div className="trophy">🏆</div>
          <div className="champion-avatar"><AvatarDisplay character={champion.avatar} size={64} /></div>
          <h2>{champion.name}</h2>
          <p className="champion-coins">{champion.coins ?? 0} 🪙 coins</p>
          <p className="champion-title">Champion!</p>
          <button className="play-again-btn" onClick={onPlayAgain}>
            Play Again
          </button>
        </div>
        {runnerUp && !isSame(runnerUp, champion) && (
          <div className="runnerup-card">
            <div className="runnerup-badge">🥈</div>
            <div className="runnerup-avatar"><AvatarDisplay character={runnerUp.avatar} size={40} /></div>
            <h4>{runnerUp.name}</h4>
            <p className="runnerup-label">Runner-up</p>
          </div>
        )}
        {mostCoins && !isSame(mostCoins, champion) && (
          <div className="richest-card">
            <div className="richest-badge">💰</div>
            <div className="richest-avatar"><AvatarDisplay character={mostCoins.avatar} size={40} /></div>
            <h4>{mostCoins.name}</h4>
            <p className="richest-coins">{mostCoins.coins ?? 0} 🪙</p>
            <p className="richest-label">Richest Player</p>
          </div>
        )}
        <div className="leaderboard-card">
          <h3>Leaderboard</h3>
          <ul className="leaderboard-list">
            {sortedPlayers.map((p, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              const rank = i + 1;
              return (
                <li key={p.id} className={`leaderboard-item ${p.id === champion?.id ? 'is-champion' : ''}`}>
                  <span className="leaderboard-rank">{medals[i] || `#${rank}`}</span>
                  <span className="leaderboard-avatar"><AvatarDisplay character={p.avatar} size={24} /></span>
                  <span className="leaderboard-name">{p.name}</span>
                  <span className="leaderboard-coins">{p.coins ?? 0} 🪙</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}