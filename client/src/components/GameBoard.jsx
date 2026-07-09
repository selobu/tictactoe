import AvatarDisplay from './AvatarDisplay';

export default function GameBoard({ board, onCellClick, disabled, myMark, isMyTurn, winCombo, showWait, player1, player2, currentTurn, myId }) {
  const currentPlayer = currentTurn === player1?.id ? player1 : player2;
  const isOpponent = currentPlayer?.id === myId ? false : currentTurn === player2?.id || currentTurn === player1?.id;
  return (
    <div className="game-board-wrapper">
      <div className="turn-indicator-wrapper">
        {showWait && (
          <div className="turn-indicator your-turn cooldown">Get ready...</div>
        )}
        {!showWait && disabled && !isMyTurn && currentPlayer && (
          <div className="turn-indicator opponent-turn">
            <span className="turn-player-avatar"><AvatarDisplay character={currentPlayer.avatar} size={22} /></span>
            <span>{currentPlayer.name}'s turn ({myMark === 'X' ? 'O' : 'X'})</span>
          </div>
        )}
        {!showWait && isMyTurn && (
          <div className="turn-indicator your-turn">
            <span className="turn-player-avatar"><AvatarDisplay character={player1?.id === myId ? player1?.avatar : player2?.avatar} size={22} /></span>
            <span>Your turn ({myMark})</span>
          </div>
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
