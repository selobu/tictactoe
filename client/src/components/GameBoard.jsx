import AvatarDisplay from './AvatarDisplay';

export default function GameBoard({ board, onCellClick, disabled, myMark, isMyTurn, winCombo, showWait, player1, player2, currentTurn, myId }) {
  const currentPlayer = currentTurn === player1?.id ? player1 : player2;
  const isOpponent = currentPlayer?.id === myId ? false : currentTurn === player2?.id || currentTurn === player1?.id;
  const sameAvatar = player1?.avatar && player2?.avatar && player1.avatar === player2.avatar;
  return (
    <div className="game-board-wrapper">
      <div className="turn-indicator-wrapper">
        {showWait && (
          <div className="turn-indicator your-turn cooldown">Get ready...</div>
        )}
        {!showWait && disabled && !isMyTurn && currentPlayer && (
          <div className="turn-indicator opponent-turn">
            <span className="turn-player-avatar"><AvatarDisplay character={currentPlayer.avatar} size={22} /></span>
            <span>{currentPlayer.name}'s turn</span>
          </div>
        )}
        {!showWait && isMyTurn && (
          <div className="turn-indicator your-turn">
            <span className="turn-player-avatar"><AvatarDisplay character={player1?.id === myId ? player1?.avatar : player2?.avatar} size={22} /></span>
            <span>Your turn</span>
          </div>
        )}
      </div>
      <div className="board">
        {board.map((cell, i) => {
          const isWinCell = winCombo?.includes(i);
          const isP1 = cell === 'X';
          const isP2 = cell === 'O';
          return (
            <button
              key={i}
              className={`cell ${cell ? 'taken' : ''} ${!disabled && !cell ? 'available' : ''} ${isWinCell ? 'win-cell' : ''} ${isP1 ? 'cell-p1' : ''} ${isP2 ? 'cell-p2' : ''}`}
              onClick={() => onCellClick(i)}
              disabled={disabled || cell !== null}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {isP1 && <span className="cell-mark"><AvatarDisplay character={player1?.avatar} size={28} />{sameAvatar && <span className="mark-badge mark-x-badge">X</span>}</span>}
              {isP2 && <span className="cell-mark"><AvatarDisplay character={player2?.avatar} size={28} />{sameAvatar && <span className="mark-badge mark-o-badge">O</span>}</span>}
              {isWinCell && <span className="win-glow" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
