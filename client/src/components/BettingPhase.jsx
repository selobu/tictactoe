import { useState, useEffect, useRef } from 'react';
import AvatarDisplay from './AvatarDisplay';
import { playCountdownTick } from '../utils/marioMusic';

export default function BettingPhase({
  match, player1, player2, playerId, players,
  bettingEndAt, bets, onPlaceBet, tournament,
}) {
  const [remaining, setRemaining] = useState(() => Math.max(0, bettingEndAt - Date.now()));
  const [betAmount, setBetAmount] = useState(100);
  const [placed, setPlaced] = useState(false);
  const [coinFx, setCoinFx] = useState(false);
  const [totalTime, setTotalTime] = useState(() => Math.max(1, bettingEndAt - Date.now()));
  const [betOn, setBetOn] = useState(null);

  const currentPlayer = tournament?.players?.find((p) => p.id === playerId)
    || players?.find((p) => p.id === playerId);
  const maxBet = currentPlayer?.coins ??
    (player1.id === playerId ? player1.coins : player2.id === playerId ? player2.coins : 0) ?? 0;
  const myBetObj = bets?.[playerId] ?? null;
  const myBet = myBetObj ? (typeof myBetObj === 'number' ? myBetObj : myBetObj.amount) : null;
  const isParticipant = player1.id === playerId || player2.id === playerId;
  const allEntries = Object.entries(bets || {});
  const pot = Math.floor(allEntries.reduce((s, [_, b]) => s + (typeof b === 'number' ? b : (b.amount || 0)), 0) * 1.3);

  const p1BetObj = bets?.[player1.id];
  const p1BetAmount = p1BetObj ? (typeof p1BetObj === 'number' ? p1BetObj : p1BetObj.amount) : null;
  const p2BetObj = bets?.[player2.id];
  const p2BetAmount = p2BetObj ? (typeof p2BetObj === 'number' ? p2BetObj : p2BetObj.amount) : null;

  const p1Coins = tournament?.players?.find((p) => p.id === player1.id)?.coins ?? player1.coins;
  const p2Coins = tournament?.players?.find((p) => p.id === player2.id)?.coins ?? player2.coins;

  const sortedBets = [...allEntries].sort((a, b) => {
    const aAmt = typeof a[1] === 'number' ? a[1] : a[1].amount;
    const bAmt = typeof b[1] === 'number' ? b[1] : b[1].amount;
    return bAmt - aAmt;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, bettingEndAt - Date.now());
      setRemaining(left);
    }, 100);
    return () => clearInterval(interval);
  }, [bettingEndAt]);

  useEffect(() => {
    if (myBet !== null && !placed) {
      setPlaced(true);
      setCoinFx(true);
      setTimeout(() => setCoinFx(false), 800);
    }
  }, [myBet, placed]);

  useEffect(() => {
    if (remaining <= 0 && isParticipant && myBet === null) {
      handlePlaceBet();
    }
  }, [remaining]);

  useEffect(() => {
    if (remaining <= 0 || remaining > 5000) return;
    const tick = setTimeout(() => playCountdownTick(), 0);
    return () => clearTimeout(tick);
  }, [Math.floor(remaining / 1000)]);

  const seconds = Math.ceil(remaining / 1000);
  const timerPct = totalTime > 0 ? (remaining / totalTime) * 100 : 0;
  const maxSafeBet = maxBet;

  function handlePlaceBet(skipOn) {
    if (placed) return;
    const target = skipOn || betOn || player1.id;
    const amount = Math.min(Math.max(0, betAmount), maxBet);
    onPlaceBet(match.id, amount, target);
  }

  return (
    <div className="betting-phase">
      <div className="betting-bg-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="bg-coin" style={{
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}>🪙</span>
        ))}
      </div>

      <div className="betting-header">
        <h2>⚔️ Place Your Bets!</h2>
        <div className={`betting-timer ${seconds <= 10 ? 'critical' : seconds <= 15 ? 'low' : ''}`}>
          <svg className="timer-svg" viewBox="0 0 56 56" width="56" height="56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4"
              strokeLinecap="round" strokeDasharray="150.8" strokeDashoffset={150.8 * (1 - timerPct / 100)}
              transform="rotate(-90 28 28)"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }}
            />
          </svg>
          <span className="timer-text">{seconds}</span>
        </div>
      </div>

      <p className="betting-desc">
        Everyone can bet on who will win. Pick a side and wager your 🪙 coins!
      </p>

      <div className="bettors-row">
        <div className={`bettor-card ${player1.id === playerId ? 'is-me' : ''} ${p1BetAmount != null ? 'has-bet' : ''}`}>
          <span className="bettor-avatar"><AvatarDisplay character={player1.avatar} size={36} /></span>
          <span className="bettor-name">{player1.name}</span>
          <span className="bettor-coins">🪙 {p1Coins}</span>
          <div className="bettor-bet-display">
            {p1BetAmount != null ? (
              <span className="bet-amount-placed">{p1BetAmount} 🪙</span>
            ) : (
              <span className="bet-waiting">Waiting...</span>
            )}
          </div>
        </div>

        <div className="vs-badge">VS</div>

        <div className={`bettor-card ${player2.id === playerId ? 'is-me' : ''} ${p2BetAmount != null ? 'has-bet' : ''}`}>
          <span className="bettor-avatar"><AvatarDisplay character={player2.avatar} size={36} /></span>
          <span className="bettor-name">{player2.name}</span>
          <span className="bettor-coins">🪙 {p2Coins}</span>
          <div className="bettor-bet-display">
            {p2BetAmount != null ? (
              <span className="bet-amount-placed">{p2BetAmount} 🪙</span>
            ) : (
              <span className="bet-waiting">Waiting...</span>
            )}
          </div>
        </div>
      </div>

      <div className="bets-list">
        <h3 className="bets-list-title">Bets</h3>
        {sortedBets.length === 0 && <p className="bets-empty">No bets yet...</p>}
        {sortedBets.map(([bid, b]) => {
          const betOnName = b.on === player1.id ? player1.name : player2.name;
          const betAmt = typeof b === 'number' ? b : b.amount;
          const bettor = players?.find(p => p.id === bid) || tournament?.players?.find(p => p.id === bid);
          return (
            <div key={bid} className={`bet-item ${bid === playerId ? 'my-bet' : ''}`}>
              <span className="bet-item-avatar"><AvatarDisplay character={bettor?.avatar} size={20} /></span>
              <span className="bet-item-name">{bettor?.name || '???'}</span>
              <span className="bet-item-arrow">→</span>
              <span className="bet-item-target">{betOnName}</span>
              <span className="bet-item-amount">{betAmt} 🪙</span>
            </div>
          );
        })}
      </div>

      <div className="pot-display">
        <span className="pot-label">🏆 Total Pot</span>
        <span className={`pot-amount ${coinFx ? 'coin-bounce' : ''}`}>🪙 {pot}</span>
      </div>

      {isParticipant && myBet === null && (
        <div className="bet-controls">
          <div className="bet-side-picker">
            <span className="bet-side-label">You're playing — bet on yourself!</span>
          </div>
          <div className="bet-input-group">
            <label>Your wager (max: {maxBet} 🪙)</label>
            <div className="bet-input-row">
              <input
                type="number"
                className="bet-input"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.min(Math.max(0, Number(e.target.value)), maxBet))}
                min={0} max={maxBet}
              />
              <button className="bet-shortcut" onClick={() => setBetAmount(Math.min(100, maxBet))}>100</button>
              <button className="bet-shortcut" onClick={() => setBetAmount(Math.min(500, maxBet))}>500</button>
              <button className="bet-shortcut" onClick={() => setBetAmount(Math.min(1000, maxBet))}>1k</button>
              <button className="bet-shortcut all-in" onClick={() => setBetAmount(maxBet)}>MAX</button>
            </div>
          </div>
          <button className="place-bet-btn" onClick={() => handlePlaceBet(player1.id === playerId ? player1.id : player2.id)} disabled={placed}>
            🪙 Bet {betAmount}
          </button>
          <p className="bet-auto-note">Auto-bet on yourself if time runs out</p>
        </div>
      )}

      {isParticipant && myBet !== null && (
        <div className="bet-confirmed">
          <span className="bet-check">✓</span> You bet <strong>{myBet} 🪙</strong> on yourself!
        </div>
      )}

      {!isParticipant && myBet === null && (
        <div className="bet-controls">
          <div className="bet-side-picker">
            <span className="bet-side-label">Who will win?</span>
            <div className="bet-side-buttons">
              <button
                className={`bet-side-btn ${betOn === player1.id ? 'selected p1' : ''}`}
                onClick={() => setBetOn(player1.id)}
              >
                <AvatarDisplay character={player1.avatar} size={24} /> {player1.name}
              </button>
              <button
                className={`bet-side-btn ${betOn === player2.id ? 'selected p2' : ''}`}
                onClick={() => setBetOn(player2.id)}
              >
                <AvatarDisplay character={player2.avatar} size={24} /> {player2.name}
              </button>
            </div>
          </div>
          {betOn && (
            <>
              <div className="bet-input-group">
                <label>Your wager (max: {maxBet} 🪙)</label>
                <div className="bet-input-row">
                  <input
                    type="number"
                    className="bet-input"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.min(Math.max(0, Number(e.target.value)), maxBet))}
                    min={0} max={maxBet}
                  />
                  <button className="bet-shortcut" onClick={() => setBetAmount(Math.min(100, maxBet))}>100</button>
                  <button className="bet-shortcut" onClick={() => setBetAmount(Math.min(500, maxBet))}>500</button>
                  <button className="bet-shortcut" onClick={() => setBetAmount(Math.min(1000, maxBet))}>1k</button>
                  <button className="bet-shortcut all-in" onClick={() => setBetAmount(maxBet)}>MAX</button>
                </div>
              </div>
              <button className="place-bet-btn" onClick={() => handlePlaceBet()} disabled={placed}>
                🪙 Bet {betAmount} on {betOn === player1.id ? player1.name : player2.name}
              </button>
            </>
          )}
        </div>
      )}

      {!isParticipant && myBet !== null && (
        <div className="bet-confirmed">
          <span className="bet-check">✓</span> Bet of <strong>{myBet} 🪙</strong> placed on {myBetObj?.on === player1.id ? player1.name : player2.name}!
        </div>
      )}

      {remaining <= 5000 && myBet === null && (
        <div className="bet-hurry">⏰ Hurry! Time is running out!</div>
      )}
    </div>
  );
}