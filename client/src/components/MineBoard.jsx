import { useMemo, useState } from 'react';
import AvatarDisplay from './AvatarDisplay';

export default function MineBoard({
  board, onCellClick, disabled, isMyTurn, showWait,
  player1, player2, currentTurn, myId, scores,
  mineHitIndex, safePressIndex,
}) {
  const [pressedCells, setPressedCells] = useState(new Set());
  const currentPlayer = currentTurn === player1?.id ? player1 : player2;

  const cells = useMemo(() => {
    if (!board?.cells) return [];
    return board.cells.map((cell, i) => {
      const row = Math.floor(i / board.cols);
      const col = i % board.cols;
      return { ...cell, index: i, row, col };
    });
  }, [board?.cells]);

  const myScore = scores ? scores[myId] ?? 0 : 0;
  const oppId = player1?.id === myId ? player2?.id : player1?.id;
  const oppScore = scores && oppId ? scores[oppId] ?? 0 : 0;

  function handleClick(index) {
    if (disabled || pressedCells.has(index)) return;
    setPressedCells(prev => { const next = new Set(prev); next.add(index); return next; });
    onCellClick(index);
  }

  return (
    <div className={`mine-board-wrapper${mineHitIndex >= 0 ? ' shake' : ''}`}>
      <div className="mine-scores">
        <div className={`mine-score mine-score-left ${currentTurn === player1?.id ? 'active' : ''}`}>
          <AvatarDisplay character={player1?.avatar} size={22} />
          <span className="mine-score-name">{player1?.name}</span>
          <span className="mine-score-value">{player1?.id === myId ? myScore : (player1?.id === oppId ? oppScore : 0)}</span>
        </div>
        <span className="mine-score-vs">⚔️</span>
        <div className={`mine-score mine-score-right ${currentTurn === player2?.id ? 'active' : ''}`}>
          <AvatarDisplay character={player2?.avatar} size={22} />
          <span className="mine-score-name">{player2?.name}</span>
          <span className="mine-score-value">{player2?.id === myId ? myScore : (player2?.id === oppId ? oppScore : 0)}</span>
        </div>
      </div>

      <div className="turn-indicator-wrapper">
        {showWait && (
          <div className="turn-indicator your-turn cooldown">Get ready...</div>
        )}
        {!showWait && disabled && !isMyTurn && currentPlayer && (
          <div className="turn-indicator opponent-turn">
            <span className="turn-player-avatar"><AvatarDisplay character={currentPlayer.avatar} size={20} /></span>
            <span>{currentPlayer.name}'s turn</span>
          </div>
        )}
        {!showWait && isMyTurn && (
          <div className="turn-indicator your-turn">
            <span className="turn-player-avatar"><AvatarDisplay character={player1?.id === myId ? player1?.avatar : player2?.avatar} size={20} /></span>
            <span>Pick a cell blindly — avoid 💣</span>
          </div>
        )}
      </div>

      <div
        className="mine-grid"
        style={{
          gridTemplateColumns: `repeat(${board?.cols || 10}, 1fr)`,
        }}
      >
        {cells.map((cell) => {
          let cls = 'mine-cell hidden';
          if (mineHitIndex === cell.index) {
            cls += ' mine-explode';
          } else if (safePressIndex === cell.index) {
            cls += ' safe-press';
          } else if (pressedCells.has(cell.index) || cell.revealed) {
            cls += ' pressed';
          }
          return (
            <button
              key={cell.index}
              className={cls}
              onClick={() => handleClick(cell.index)}
              disabled={disabled || pressedCells.has(cell.index)}
            />
          );
        })}
      </div>
    </div>
  );
}
