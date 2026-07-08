export default function GameBoard({ board, onCellClick, disabled, myMark, isMyTurn, winCombo }) {
  return (
    <div className="game-board-wrapper">
      <div className="turn-indicator-wrapper">
        {disabled && !isMyTurn && (
          <div className="turn-indicator">Waiting for opponent's move...</div>
        )}
        {isMyTurn && (
          <div className="turn-indicator your-turn">Your turn ({myMark})</div>
        )}
      </div>
      <div className="board">
        {board.map((cell, i) => {
          const isWinCell = winCombo?.includes(i);
          return (
            <button
              key={i}
              className={`cell ${cell ? 'taken' : ''} ${!disabled && !cell ? 'available' : ''} ${isWinCell ? 'win-cell' : ''}`}
              onClick={() => onCellClick(i)}
              disabled={disabled || cell !== null}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {cell === 'X' && <span className="mark-x">X</span>}
              {cell === 'O' && <span className="mark-o">O</span>}
              {isWinCell && <span className="win-glow" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
