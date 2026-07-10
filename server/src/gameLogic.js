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

/* ========== MINE FINDER ========== */

export function createMineBoard(rows = 10, cols = 10, mineCount = 16) {
  const total = rows * cols;
  const cells = Array.from({ length: total }, () => ({
    revealed: false,
    mine: false,
    flag: false,
    adjacent: 0,
  }));

  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let k = 0; k < mineCount; k++) {
    cells[indices[k]].mine = true;
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const idx = i * cols + j;
      if (cells[idx].mine) continue;
      let count = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) continue;
          const ni = i + di, nj = j + dj;
          if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
            if (cells[ni * cols + nj].mine) count++;
          }
        }
      }
      cells[idx].adjacent = count;
    }
  }

  return { cells, rows, cols, mineCount, totalSafe: total - mineCount };
}

export function revealMineCell(game, cellIndex) {
  const { cells } = game.board;
  const cell = cells[cellIndex];
  if (!cell || cell.revealed) return { valid: false };

  cell.revealed = true;

  return {
    valid: true,
    mine: cell.mine,
    cellIndex,
  };
}

export function revealAllMines(board) {
  const { cells } = board;
  const mineIndices = [];
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].mine) {
      cells[i].revealed = true;
      mineIndices.push(i);
    }
  }
  return mineIndices;
}

/* ========== PENALTY SHOOTOUT ========== */

const PENALTY_ROUNDS = 5;

export function createPenaltyState() {
  return {
    currentKicker: null,
    round: 0,
    choices: {},
    results: [],
    scores: {},
    phase: 'kicking',
    totalRounds: PENALTY_ROUNDS,
    lastResult: null,
  };
}

export function submitPenaltyChoice(game, playerId, direction) {
  const state = game.penalty;
  if (state.phase !== 'kicking') return { valid: false, reason: 'Not in kicking phase' };
  if (state.choices[playerId]) return { valid: false, reason: 'Already submitted' };
  if (direction < 1 || direction > 3) return { valid: false, reason: 'Invalid direction' };

  state.choices[playerId] = direction;

  const kickerId = state.currentKicker;
  const keeperId = kickerId === game.player1.id ? game.player2.id : game.player1.id;

  if (state.choices[kickerId] && state.choices[keeperId]) {
    const kickerDir = state.choices[kickerId];
    const keeperDir = state.choices[keeperId];
    const isGoal = kickerDir !== keeperDir;

    state.round++;
    if (isGoal) state.scores[kickerId] = (state.scores[kickerId] || 0) + 1;

    state.results.push({
      round: state.round,
      kicker: kickerId,
      kickerDir,
      keeperDir,
      isGoal,
    });
    state.lastResult = {
      kicker: kickerId,
      kickerDir,
      keeperDir,
      isGoal,
    };
    state.choices = {};
    state.phase = 'reveal';

    const allDone = state.round >= PENALTY_ROUNDS * 2;
    if (allDone) state.phase = 'finished';

    return {
      valid: true,
      result: state.lastResult,
      scores: { ...state.scores },
      round: state.round,
      phase: state.phase,
      allDone,
    };
  }

  return { valid: true, waiting: true };
}

export function startNextPenaltyKick(game) {
  const state = game.penalty;
  if (state.phase === 'finished') return { valid: false };
  if (state.phase === 'kicking') return { valid: false, reason: 'Still waiting for choices' };

  const p1Id = game.player1.id;
  const p2Id = game.player2.id;
  const lastKicker = state.lastResult?.kicker;
  const nextKicker = lastKicker === p1Id ? p2Id : p1Id;

  state.currentKicker = nextKicker;
  state.choices = {};
  state.phase = 'kicking';
  state.lastResult = null;

  return { valid: true, currentKicker: nextKicker };
}
