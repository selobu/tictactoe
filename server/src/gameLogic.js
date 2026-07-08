const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function createBoard() {
  return Array(9).fill(null);
}

export function makeMove(board, index, mark) {
  if (board[index] !== null) return { board, valid: false };
  const newBoard = [...board];
  newBoard[index] = mark;
  const winResult = checkWin(newBoard);
  const draw = !winResult && newBoard.every((c) => c !== null);
  return {
    board: newBoard,
    valid: true,
    win: !!winResult,
    draw,
    winner: winResult ? mark : null,
    winCombo: winResult ? winResult.combo : null,
  };
}

export function checkWin(board) {
  for (const combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], combo };
    }
  }
  return null;
}

export { WIN_COMBOS };
