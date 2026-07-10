import { useState, useEffect } from 'react';
import AvatarDisplay from './AvatarDisplay';

const DIRS = [
  { key: 1, label: '↙️ Left', anim: 'left' },
  { key: 2, label: '⬆️ Center', anim: 'center' },
  { key: 3, label: '↗️ Right', anim: 'right' },
];

export default function PenaltyBoard({
  player1, player2, currentTurn, myId, isMyTurn, disabled,
  onChoice, lastResult, showWait, scores, round, phase, kickIndex,
}) {
  const [chosen, setChosen] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [animState, setAnimState] = useState(null);

  useEffect(() => {
    setChosen(null);
    setSubmitted(false);
    setAnimState(null);
  }, [kickIndex]);

  useEffect(() => {
    if (lastResult) {
      setAnimState(lastResult);
    } else {
      setAnimState(null);
    }
  }, [lastResult]);

  const myScore = scores ? scores[myId] ?? 0 : 0;
  const oppId = player1?.id === myId ? player2?.id : player1?.id;
  const oppScore = scores && oppId ? scores[oppId] ?? 0 : 0;
  const isKicker = currentTurn === myId;
  const isKeeper = !isKicker && isMyTurn;

  function handleChoice(dir) {
    if (submitted || disabled) return;
    setChosen(dir);
    setSubmitted(true);
    onChoice(dir);
  }

  const goalKeeper = currentTurn === player1?.id ? player2 : player1;
  const shooter = currentTurn === player1?.id ? player1 : player2;

  return (
    <div className={`penalty-wrapper ${animState ? 'penalty-result-shown' : ''}`}>
      <div className="penalty-scores">
        <div className={`penalty-score ${currentTurn === player1?.id ? 'kicking' : ''}`}>
          <AvatarDisplay character={player1?.avatar} size={22} />
          <span className="penalty-score-name">{player1?.name}</span>
          <span className="penalty-score-value">{player1?.id === myId ? myScore : (player1?.id === oppId ? oppScore : 0)}</span>
        </div>
        <span className="penalty-score-vs">⚽</span>
        <div className={`penalty-score ${currentTurn === player2?.id ? 'kicking' : ''}`}>
          <AvatarDisplay character={player2?.avatar} size={22} />
          <span className="penalty-score-name">{player2?.name}</span>
          <span className="penalty-score-value">{player2?.id === myId ? myScore : (player2?.id === oppId ? oppScore : 0)}</span>
        </div>
      </div>

      <div className="penalty-round-info">
        Round {Math.floor(((round || 0) + 1) / 2)} of 5
      </div>

      <div className="penalty-field">
        <div className="penalty-goal-frame">
          <div className="penalty-goal-bg" />

          <div className="penalty-keeper-area">
            <div className={`penalty-keeper ${animState ? `dive-${animState.keeperDir === 1 ? 'left' : animState.keeperDir === 3 ? 'right' : 'center'}` : ''}`}>
              <AvatarDisplay character={goalKeeper?.avatar} size={40} />
            </div>
          </div>

          <div className={`penalty-ball ${animState ? (animState.isGoal ? 'goal-score' : 'saved') : ''}`}
            style={animState ? {
              '--ball-x': animState.kickerDir === 1 ? '-40px' : animState.kickerDir === 3 ? '40px' : '0px',
              '--ball-y': animState.isGoal ? '-60px' : '10px',
            } : {}}
          >
            ⚽
          </div>

          {animState && (
            <div className={`penalty-result-overlay ${animState.isGoal ? 'goal' : 'saved'}`}>
              {animState.isGoal ? '⚡ GOAL! ⚡' : '🧤 SAVED! 🧤'}
            </div>
          )}

          <div className="penalty-goal-posts" />
          <div className="penalty-net" />
        </div>
      </div>

      <div className="penalty-turn-info">
        {showWait && <span>Get ready...</span>}
        {!showWait && submitted && !animState && <span>Waiting for opponent...</span>}
        {!showWait && !submitted && isKicker && <span>You're kicking — pick a direction!</span>}
        {!showWait && !submitted && isKeeper && <span>You're the keeper — pick a side!</span>}
        {!showWait && !submitted && !isMyTurn && (
          <span><AvatarDisplay character={shooter?.avatar} size={18} /> {shooter?.name} is kicking</span>
        )}
      </div>

      {!submitted && !animState && !showWait && (
        <div className="penalty-choices">
          <p className="penalty-choices-label">
            {isKicker ? 'Aim your shot:' : 'Dive to:'}
          </p>
          <div className="penalty-buttons">
            {DIRS.map((d) => (
              <button
                key={d.key}
                className={`penalty-btn ${chosen === d.key ? 'chosen' : ''}`}
                onClick={() => handleChoice(d.key)}
                disabled={disabled || !isMyTurn}
              >
                <span className="penalty-btn-icon">{d.label.split(' ')[0]}</span>
                <span className="penalty-btn-label">{d.label.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}