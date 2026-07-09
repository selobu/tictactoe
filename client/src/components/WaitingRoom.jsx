import { useState } from 'react';
import AvatarDisplay from './AvatarDisplay';

export default function WaitingRoom({ players, playerId, tournament, onStart }) {
  const [gameType, setGameType] = useState('tictactoe');
  const currentPlayer = players.find((p) => p.id === playerId);
  const isHost = currentPlayer?.isHost;
  const canStart = players.filter((p) => p.connected).length >= 2 && !tournament;

  return (
    <div className="waiting-room">
      <div className="players-card">
        <div className="players-header">
          <h2>Players</h2>
          <span className="players-badge">{players.length}/16</span>
        </div>
        <ul className="player-list">
          {players.map((p, i) => (
            <li
              key={p.id}
              className={`player-item ${!p.connected ? 'disconnected' : ''} ${p.eliminated ? 'eliminated' : ''}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="player-avatar"><AvatarDisplay character={p.avatar} size={32} /></span>
              <span className="player-name">
                {p.name}
                {p.isHost && <span className="host-badge">Host</span>}
              </span>
              <span className="player-coins">{p.coins ?? 0} 🪙</span>
              <span className="player-status">
                {p.connected ? (
                  <span className="status-dot online" />
                ) : (
                  <span className="status-dot offline" />
                )}
              </span>
            </li>
          ))}
        </ul>
        {players.length === 0 && (
          <div className="empty-state">Waiting for players...</div>
        )}
        {isHost && !tournament && (
          <div className="game-type-selector">
            <label className="game-type-label">Game Mode</label>
            <div className="game-type-options">
              <button
                className={`game-type-btn ${gameType === 'tictactoe' ? 'selected' : ''}`}
                onClick={() => setGameType('tictactoe')}
              >
                <span className="game-type-icon">❌⭕</span>
                <span className="game-type-name">Tic-Tac-Toe</span>
                <span className="game-type-desc">Classic 3x3</span>
              </button>
              <button
                className={`game-type-btn ${gameType === 'minefinder' ? 'selected' : ''}`}
                onClick={() => setGameType('minefinder')}
              >
                <span className="game-type-icon">💣💥</span>
                <span className="game-type-name">Mine Finder</span>
                <span className="game-type-desc">10x10 — 2 turns per pair</span>
              </button>
            </div>
          </div>
        )}
        {isHost && (
          <button
            className="start-btn"
            onClick={() => onStart(gameType)}
            disabled={!canStart}
          >
            {tournament ? 'Tournament in progress...' : 'Start Tournament'}
          </button>
        )}
        {!isHost && (
          <p className="waiting-msg">Waiting for host to start the tournament...</p>
        )}
        {tournament && tournament.phase === 'pairing' && (
          <div className="pairing-animation">
            <span className="pairing-dot" />
            <span className="pairing-dot" />
            <span className="pairing-dot" />
            <span>Pairing next players...</span>
          </div>
        )}
      </div>
    </div>
  );
}
