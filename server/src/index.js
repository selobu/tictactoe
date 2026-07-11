import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createBoard, makeMove, createMineBoard, revealMineCell, revealAllMines, submitPenaltyChoice, startNextPenaltyKick } from './gameLogic.js';
import { initPlatformerGame, tickPlatformerGame, getPlatformerDynamicState, getPlatformerLevelData, getPlatformerResults } from './platformerLogic.js';
import {
  createTournament, startRound, createGameForSeries, finalizeSeries,
  checkRoundComplete, addCoins, penalizeDraw, getMostCoinsPlayer, getRoundResults,
} from './tournament.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());

const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/socket.io')) {
    res.sendFile(path.join(clientDist, 'index.html'));
  }
});
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const rooms = new Map();
const timerIntervals = new Map();
const bettingIntervals = new Map();
const platformerIntervals = new Map();

const TIME_LIMIT = 30000;
const MOVE_COOLDOWN = 800;
const MAX_SPEED_POINTS = 50;
const INITIAL_COINS = 1000;
const BET_TIME_LIMIT = 40000;

const THEMES = [
  { x: '#f7971e', o: '#00b09b', bg1: '#0f0c29', bg2: '#302b63', glow: '#ffd200' },
  { x: '#ff6b6b', o: '#48dbfb', bg1: '#1a0a2e', bg2: '#2d1b69', glow: '#ff9ff3' },
  { x: '#a29bfe', o: '#55efc4', bg1: '#0c0c1d', bg2: '#1a1a3e', glow: '#81ecec' },
  { x: '#fd79a8', o: '#74b9ff', bg1: '#2d0a1a', bg2: '#4a1a3a', glow: '#fdcb6e' },
  { x: '#e17055', o: '#00cec9', bg1: '#1e1a0f', bg2: '#3e3520', glow: '#fab1a0' },
  { x: '#6c5ce7', o: '#fdcb6e', bg1: '#1a0a2e', bg2: '#2a1a4e', glow: '#e84393' },
  { x: '#00b894', o: '#e84393', bg1: '#0a1a1a', bg2: '#1a2a2a', glow: '#55efc4' },
  { x: '#f0932b', o: '#22a6b3', bg1: '#1a140a', bg2: '#2a2010', glow: '#f9ca24' },
];

let themeIdx = 0;
function getNextTheme() {
  const t = THEMES[themeIdx % THEMES.length];
  themeIdx++;
  return { ...t, index: (themeIdx - 1) % THEMES.length };
}

const AVATARS = [
  'mario', 'luigi', 'peach', 'bowser', 'toad', 'yoshi',
  'boo', 'star', 'fireflower', 'koopa', 'daisy', 'rosalina',
  'wario', 'waluigi', 'shark', 'smileShark',
  'chinesePrincess', 'americanEagle', 'mexican', 'realtor', 'sumo', 'mexicanWoman', 'colombia', 'businessMan', 'chespirito', 'baby',
];

let avatarIndex = 0;
function getNextAvatar() {
  const av = AVATARS[avatarIndex % AVATARS.length];
  avatarIndex++;
  return av;
}

function getPlayerCoins(tournament, playerId) {
  if (!tournament) return null;
  const p = tournament.players.find((pl) => pl.id === playerId);
  return p ? (p.coins || 0) : null;
}

function emitRoomUpdate(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  io.to(roomId).emit('room-update', {
    players: room.players.map((p) => {
      const tCoins = getPlayerCoins(room.tournament, p.id);
      return {
        id: p.id, name: p.name, avatar: p.avatar,
        connected: p.connected, inMatch: p.inMatch,
        eliminated: p.eliminated, isHost: p.isHost,
        coins: tCoins !== null ? tCoins : (p.coins || 0),
      };
    }),
    tournament: room.tournament,
    gameType: room.gameType || 'tictactoe',
  });
}

function initMatchTimer(game) {
  const limit = game.type === 'minefinder' ? 60000 : TIME_LIMIT;
  game.timeP1 = limit;
  game.timeP2 = limit;
  game.turnStartedAt = Date.now();
  game.moveCooldownUntil = Date.now() + MOVE_COOLDOWN;
  game.theme = getNextTheme();
}

function getTimerState(game) {
  if (!game || game.status !== 'playing') return null;
  const now = Date.now();
  const elapsed = now - game.turnStartedAt;
  const p1 = Math.max(0, game.timeP1 - (game.currentTurn === game.player1.id ? elapsed : 0));
  const p2 = Math.max(0, game.timeP2 - (game.currentTurn === game.player2.id ? elapsed : 0));
  return { p1, p2, currentTurn: game.currentTurn };
}

function switchTurn(game) {
  const now = Date.now();
  const elapsed = now - game.turnStartedAt;
  if (game.currentTurn === game.player1.id) {
    game.timeP1 = Math.max(0, game.timeP1 - elapsed);
  } else {
    game.timeP2 = Math.max(0, game.timeP2 - elapsed);
  }
  game.currentTurn = game.currentTurn === game.player1.id ? game.player2.id : game.player1.id;
  game.turnStartedAt = Date.now();
  game.moveCooldownUntil = Date.now() + MOVE_COOLDOWN;
}

function calcSpeedPoints(game) {
  const elapsed = Date.now() - game.turnStartedAt;
  return Math.max(0, Math.round(MAX_SPEED_POINTS * (1 - elapsed / TIME_LIMIT)));
}

function broadcastBetTimer(roomId) {
  if (bettingIntervals.has(roomId)) return;
  const interval = setInterval(() => {
    const room = rooms.get(roomId);
    if (!room || !room.tournament) {
      clearInterval(interval); bettingIntervals.delete(roomId); return;
    }
    const series = room.tournament.currentSeries;
    if (!series || series.status !== 'betting') {
      clearInterval(interval); bettingIntervals.delete(roomId); return;
    }
    const remaining = Math.max(0, series.bettingEndAt - Date.now());
    io.to(roomId).emit('betting-timer', { remaining });
  }, 250);
  bettingIntervals.set(roomId, interval);
}

function startBettingPhase(roomId, series) {
  const room = rooms.get(roomId);
  if (!room || !room.tournament) return;

  series.bets = {};
  series.bettingEndAt = Date.now() + BET_TIME_LIMIT;
  series.status = 'betting';

  const p1Info = {
    id: series.player1.id, name: series.player1.name,
    avatar: series.player1.avatar, coins: getPlayerCoins(room.tournament, series.player1.id),
  };
  const p2Info = {
    id: series.player2.id, name: series.player2.name,
    avatar: series.player2.avatar, coins: getPlayerCoins(room.tournament, series.player2.id),
  };
  const roomPlayers = room.players.filter(p => p.connected).map(p => ({
    id: p.id, name: p.name, avatar: p.avatar,
    eliminated: p.eliminated,
    coins: getPlayerCoins(room.tournament, p.id) || 0,
  }));

  io.to(roomId).emit('betting-start', {
    matchId: series.id,
    player1: p1Info, player2: p2Info,
    players: roomPlayers,
    bettingEndAt: series.bettingEndAt,
    round: room.tournament.round,
    seriesId: series.id,
  });

  broadcastBetTimer(roomId);

  series.bettingTimer = setTimeout(() => {
    finalizeBetting(roomId, series);
  }, BET_TIME_LIMIT);
}

function finalizeBetting(roomId, series) {
  const room = rooms.get(roomId);
  if (!room || !room.tournament || series.status !== 'betting') return;

  if (series.bettingTimer) { clearTimeout(series.bettingTimer); series.bettingTimer = null; }
  const interval = bettingIntervals.get(roomId);
  if (interval) { clearInterval(interval); bettingIntervals.delete(roomId); }

  const tPlayers = room.tournament.players;
  for (const pId of [series.player1.id, series.player2.id]) {
    if (!series.bets[pId]) {
      const tp = tPlayers.find(p => p.id === pId);
      series.bets[pId] = { on: pId, amount: tp ? Math.min(100, tp.coins) : 0 };
    }
  }
  for (const [bettorId, bet] of Object.entries(series.bets)) {
    const tp = tPlayers.find(p => p.id === bettorId);
    if (tp) tp.coins = Math.max(0, tp.coins - bet.amount);
  }
  series.totalPot = Object.values(series.bets).reduce((sum, b) => sum + b.amount, 0);
  series.status = 'playing';

  io.to(roomId).emit('betting-finished', {
    matchId: series.id, bets: series.bets, totalPot: series.totalPot,
  });

  setTimeout(() => startGame(roomId), 3000);
}

function startGame(roomId) {
  const room = rooms.get(roomId);
  if (!room || !room.tournament) return;
  const series = room.tournament.currentSeries;
  if (!series) return;

  const game = createGameForSeries(room.tournament, series, room.gameType || 'tictactoe');
  if (!game) return;

  if (game.type === 'platformer') {
    initPlatformerGame(game.platformerSetup);
    startPlatformerLoop(roomId, game);
    game.currentTurn = null;
    const levelData = getPlatformerLevelData(game.platformerSetup);
    io.to(roomId).emit('match-start', { match: game, series, platformerLevel: levelData });
    return;
  }

  if (game.type !== 'penalty') {
    initMatchTimer(game);
    startTimerInterval(roomId);
  }
  io.to(roomId).emit('match-start', { match: game, series });
  scheduleBotMove(room, roomId, game);
}

function launchNextSeries(roomId) {
  const room = rooms.get(roomId);
  if (!room || !room.tournament) return;

  while (room.tournament.seriesIndex < room.tournament.seriesQueue.length) {
    const pair = room.tournament.seriesQueue[room.tournament.seriesIndex];
    const p1 = room.tournament.players.find(p => p.id === pair[0].id);
    const p2 = room.tournament.players.find(p => p.id === pair[1].id);
    if (!p1 || !p2 || p1.eliminated || p2.eliminated) {
      room.tournament.seriesIndex++;
      continue;
    }

    p1.inMatch = true;
    p2.inMatch = true;

    const series = {
      id: Date.now(),
      player1: { id: p1.id, name: p1.name, avatar: p1.avatar },
      player2: { id: p2.id, name: p2.name, avatar: p2.avatar },
      games: [],
      p1wins: 0, p2wins: 0,
      status: 'betting', winner: null,
    };
    room.tournament.currentSeries = series;
    room.tournament.currentGame = null;
    startBettingPhase(roomId, series);
    return;
  }

  checkAndAdvance(roomId);
}

function checkAndAdvance(roomId) {
  const room = rooms.get(roomId);
  if (!room || !room.tournament) return;

  const status = checkRoundComplete(room.tournament);
  if (!status) return;
  if (status.finished) {
    finishTournament(roomId);
    return;
  }
  if (status.advance) {
    const results = getRoundResults(room.tournament, room.tournament.round);
    io.to(roomId).emit('round-results', results);

    setTimeout(() => {
      room.tournament.round++;
      const info = startRound(room.tournament);
      if (!info) {
        finishTournament(roomId);
        return;
      }
      io.to(roomId).emit('round-start', {
        round: room.tournament.round,
        message: `Round ${room.tournament.round} starting!`,
      });
      setTimeout(() => launchNextSeries(roomId), 4000);
    }, 8000);
    return;
  }
}

function finishTournament(roomId) {
  const room = rooms.get(roomId);
  if (!room || !room.tournament) return;

  if (!room.tournament.champion && room.tournament.currentSeries && room.tournament.currentSeries.winner) {
    const winnerId = room.tournament.currentSeries.winner;
    room.tournament.champion = room.tournament.players.find(p => p.id === winnerId);
  }

  const champ = room.tournament.champion;
  let runnerUp = null;
  if (room.tournament.players) {
    const notChamp = room.tournament.players.filter(p => !champ || p.id !== champ.id);
    runnerUp = notChamp.length > 0 ? notChamp[0] : null;
  }
  const richest = getMostCoinsPlayer(room.tournament);

  io.to(roomId).emit('tournament-end', {
    champion: champ,
    runnerUp,
    mostCoins: richest,
    tournament: room.tournament,
  });
}

function distributePot(tournament, series, winnerId) {
  if (!series.totalPot || !series.bets) return;
  const winningBets = Object.entries(series.bets).filter(([_, b]) => b.on === winnerId);
  const winningTotal = winningBets.reduce((s, [_, b]) => s + b.amount, 0);
  if (winningTotal <= 0) return;
  const boostedPot = Math.floor(series.totalPot * 1.3);
  for (const [bettorId, bet] of winningBets) {
    const tp = tournament.players.find(p => p.id === bettorId);
    if (tp) {
      tp.coins += Math.floor(boostedPot * bet.amount / winningTotal);
    }
  }
}

function refundBets(tournament, series) {
  if (!series.totalPot || !series.bets) return;
  for (const [bettorId, bet] of Object.entries(series.bets)) {
    const tp = tournament.players.find(p => p.id === bettorId);
    if (tp) tp.coins += bet.amount;
  }
  series.totalPot = 0;
}

function handleAfterGame(roomId, game, winnerId, loserId, isDraw) {
  const room = rooms.get(roomId);
  if (!room || !room.tournament) return;
  const series = room.tournament.currentSeries;
  if (!series) return;

  if (isDraw) {
    const gamesPlayed = series.games.length;
    if (gamesPlayed < 2) {
      stopTimerInterval(roomId);
      io.to(roomId).emit('game-end', {
        gameIndex: game.gameIndex,
        message: 'Draw! One more game...',
      });
      scheduleNextGame(roomId);
      return;
    }
  } else {
    if (winnerId === series.player1.id) series.p1wins++;
    else if (winnerId === series.player2.id) series.p2wins++;

    const gamesPlayed = series.games.length;
    if (gamesPlayed < 2) {
      stopTimerInterval(roomId);
      io.to(roomId).emit('game-end', {
        gameIndex: game.gameIndex,
        message: `Game ${game.gameIndex + 1} complete! Rematch starting...`,
      });
      scheduleNextGame(roomId);
      return;
    }
  }

  const result = finalizeSeries(room.tournament, series);
  stopTimerInterval(roomId);

  if (result.winner) {
    distributePot(room.tournament, series, result.winner.id);
  } else {
    refundBets(room.tournament, series);
  }

  io.to(roomId).emit('series-result', {
    seriesId: series.id,
    winner: result.winner,
    loserId: result.loserId,
    p1wins: series.p1wins,
    p2wins: series.p2wins,
  });

  setTimeout(() => {
    io.to(roomId).emit('tournament-update', { tournament: room.tournament });
    launchNextSeries(roomId);
  }, 6000);
}

function scheduleNextGame(roomId) {
  setTimeout(() => startGame(roomId), 4000);
}

function isBotPlayer(playerId) {
  return typeof playerId === 'string' && playerId.startsWith('bot_');
}

function scheduleBotMove(room, roomId, game) {
  if (!isBotPlayer(game.currentTurn)) return;
  const delay = game.type === 'minefinder' ? 1500 : 800;
  setTimeout(() => {
    const r = rooms.get(roomId);
    if (!r || !r.tournament || r.tournament.currentGame?.id !== game.id || game.status !== 'playing') return;
    if (game.currentTurn !== game.player1.id && game.currentTurn !== game.player2.id) return;
    if (!isBotPlayer(game.currentTurn)) return;

    if (game.type === 'minefinder') {
      const { cells } = game.board;
      const unrevealed = [];
      for (let i = 0; i < cells.length; i++) {
        if (!cells[i].revealed) unrevealed.push(i);
      }
      if (unrevealed.length === 0) return;
      const pick = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      const result = revealMineCell(game, pick);
      if (!result.valid) return;

      game.moves.push({ playerId: game.currentTurn, cellIndex: pick });

      if (result.mine) {
        revealAllMines(game.board);
        io.to(roomId).emit('mine-hit', {
          matchId: game.id, board: game.board, cellIndex: pick,
          scores: game.scores, currentTurn: game.currentTurn, moveCooldownUntil: game.moveCooldownUntil,
        });
        setTimeout(() => endMineTurn(room, roomId, game, 'mine'), 2500);
        return;
      }

      game.turnScores[game.currentTurn] = (game.turnScores[game.currentTurn] || 0) + 1;
      game.scores[game.currentTurn] = (game.scores[game.currentTurn] || 0) + 1;

      io.to(roomId).emit('mine-board-update', {
        matchId: game.id, board: game.board, cellIndex: pick,
        scores: game.scores, currentTurn: game.currentTurn, moveCooldownUntil: game.moveCooldownUntil,
      });
      scheduleBotMove(room, roomId, game);
    } else {
      const board = game.board;
      const avail = [];
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) avail.push(i);
      }
      if (avail.length === 0) return;
      const pick = avail[Math.floor(Math.random() * avail.length)];
      const botMark = game.player1.id === game.currentTurn ? 'X' : 'O';
      const result = makeMove(board, pick, botMark);
      if (!result.valid) return;

      game.board = result.board;
      game.moves.push({ playerId: game.currentTurn, cellIndex: pick, mark: botMark, speedPoints: 0 });

      if (result.win || result.draw) {
        game.status = 'finished';
        stopTimerInterval(roomId);
        switchTurn(game);

        const winnerPlayer = result.win ? room.tournament.players.find((p) => p.id === game.currentTurn) : null;
        io.to(roomId).emit('match-result', {
          match: game, winner: winnerPlayer, draw: result.draw,
          winCombo: result.winCombo, tournament: room.tournament,
        });

        if (result.win) {
          const loserId = game.player1.id === game.currentTurn ? game.player2.id : game.player1.id;
          handleAfterGame(roomId, game, game.currentTurn, loserId, false);
        } else {
          penalizeDraw(room.tournament, game.player1.id, game.player2.id);
          handleAfterGame(roomId, game, null, null, true);
        }
        return;
      }

      switchTurn(game);
      io.to(roomId).emit('board-update', {
        matchId: game.id, board: game.board,
        currentTurn: game.currentTurn, moveCooldownUntil: game.moveCooldownUntil,
      });
      scheduleBotMove(room, roomId, game);
    }
  }, delay);
}

function endMineTurn(room, roomId, game, reason) {
  const currentPlayerId = game.currentTurn;
  const opponentId = game.player1.id === currentPlayerId ? game.player2.id : game.player1.id;

  game.playerTurns[currentPlayerId] = (game.playerTurns[currentPlayerId] || 0) + 1;
  game.lastOpponentScore = game.turnScores[currentPlayerId] || 0;
  game.turnIndex++;

  const p1Turns = game.playerTurns[game.player1.id] || 0;
  const p2Turns = game.playerTurns[game.player2.id] || 0;

  if (p1Turns >= 2 && p2Turns >= 2) {
    endMineFinderGame(room, roomId, game);
    return;
  }

  game.board = createMineBoard(10, 10, 16);
  game.turnScores = { [game.player1.id]: 0, [game.player2.id]: 0 };
  game.currentTurn = opponentId;
  game.turnStartedAt = Date.now();
  game.moveCooldownUntil = Date.now() + MOVE_COOLDOWN;

  io.to(roomId).emit('mine-turn-start', {
    matchId: game.id,
    board: game.board,
    currentTurn: game.currentTurn,
    moveCooldownUntil: game.moveCooldownUntil,
    scores: game.scores,
    turnIndex: game.turnIndex,
    playerTurns: game.playerTurns,
    lastOpponentScore: game.lastOpponentScore,
    reason,
  });
  scheduleBotMove(room, roomId, game);
}

function endMineFinderGame(room, roomId, game) {
  game.status = 'finished';
  stopTimerInterval(roomId);
  const p1Score = game.scores[game.player1.id] || 0;
  const p2Score = game.scores[game.player2.id] || 0;
  const winnerId = p1Score > p2Score ? game.player1.id : (p2Score > p1Score ? game.player2.id : null);
  const winnerPlayer = winnerId ? room.tournament.players.find((p) => p.id === winnerId) : null;
  const draw = !winnerId;

  io.to(roomId).emit('match-result', {
    match: game, winner: winnerPlayer, draw,
    winCombo: null, scores: game.scores, tournament: room.tournament,
  });

  const series = room.tournament.currentSeries;
  if (series) {
    if (winnerId) {
      if (winnerId === series.player1.id) series.p1wins++;
      else series.p2wins++;
    } else {
      penalizeDraw(room.tournament, game.player1.id, game.player2.id);
    }
    const result = finalizeSeries(room.tournament, series);
    if (result.winner) {
      distributePot(room.tournament, series, result.winner.id);
    } else {
      refundBets(room.tournament, series);
    }
    io.to(roomId).emit('series-result', {
      seriesId: series.id,
      winner: result.winner,
      loserId: result.loserId,
      p1wins: series.p1wins,
      p2wins: series.p2wins,
    });
    setTimeout(() => {
      io.to(roomId).emit('tournament-update', { tournament: room.tournament });
      launchNextSeries(roomId);
    }, 3000);
  }
}

function startTimerInterval(roomId) {
  if (timerIntervals.has(roomId)) return;
  const interval = setInterval(() => {
    const room = rooms.get(roomId);
    if (!room || !room.tournament || !room.tournament.currentGame) {
      clearInterval(interval); timerIntervals.delete(roomId); return;
    }
    const game = room.tournament.currentGame;
    if (game.status !== 'playing') return;

    const state = getTimerState(game);
    io.to(roomId).emit('timer-update', state);

    const remaining = game.currentTurn === game.player1.id ? state.p1 : state.p2;
    if (remaining <= 0) {
      if (game.type === 'minefinder') {
        addCoins(room.tournament, game.currentTurn, -200);
        endMineTurn(room, roomId, game, 'timeout');
      } else {
        const loserId = game.currentTurn;
        const winnerId = loserId === game.player1.id ? game.player2.id : game.player1.id;
        const winnerPlayer = room.players.find((p) => p.id === winnerId);
        game.status = 'finished';
        game.winner = winnerId;

        io.to(roomId).emit('match-result', {
          match: game, winner: winnerPlayer, draw: false,
          winCombo: null, byTimeout: true, tournament: room.tournament,
        });

        handleAfterGame(roomId, game, winnerId, loserId, false);
      }
    }
  }, 250);
  timerIntervals.set(roomId, interval);
}

function stopTimerInterval(roomId) {
  const interval = timerIntervals.get(roomId);
  if (interval) { clearInterval(interval); timerIntervals.delete(roomId); }
}

const platformerInputs = new Map();

function startPlatformerLoop(roomId, game) {
  if (platformerIntervals.has(roomId)) return;
  const interval = setInterval(() => {
    const room = rooms.get(roomId);
    if (!room || !room.tournament || !room.tournament.currentGame) {
      clearInterval(interval); platformerIntervals.delete(roomId); return;
    }
    const g = room.tournament.currentGame;
    if (g.id !== game.id || !g.platformerSetup) {
      clearInterval(interval); platformerIntervals.delete(roomId); return;
    }
    const setup = g.platformerSetup;
    if (setup.finished) {
      clearInterval(interval); platformerIntervals.delete(roomId);
      handlePlatformerEnd(roomId, g);
      return;
    }
    const inputs = platformerInputs.get(roomId) || {};
    tickPlatformerGame(setup, inputs);
    const state = getPlatformerDynamicState(setup);
    state.matchId = game.id;
    io.to(roomId).emit('platformer-state', state);
  }, 50);
  platformerIntervals.set(roomId, interval);
}

function handlePlatformerEnd(roomId, game) {
  const room = rooms.get(roomId);
  if (!room || !room.tournament) return;
  const setup = game.platformerSetup;
  const results = getPlatformerResults(setup);
  const series = room.tournament.currentSeries;
  if (!series) return;

  game.status = 'finished';
  const winnerPlayer = results.winner ? room.tournament.players.find(p => p.id === results.winner.id) : null;
  const loserId = results.winner?.id === series.player1.id ? series.player2.id : series.player1.id;

  game.scores = {};
  for (const p of results.sorted) {
    game.scores[p.id] = p.distance;
  }

  io.to(roomId).emit('match-result', {
    match: game, winner: winnerPlayer, draw: !results.winner,
    platformerResults: results.sorted, tournament: room.tournament,
  });

  if (results.winner) {
    if (results.winner.id === series.player1.id) series.p1wins++;
    else series.p2wins++;
    const fsResult = finalizeSeries(room.tournament, series);
    if (fsResult.winner) {
      distributePot(room.tournament, series, fsResult.winner.id);
    }
    io.to(roomId).emit('series-result', {
      seriesId: series.id,
      winner: fsResult.winner,
      loserId: fsResult.loserId,
      p1wins: series.p1wins,
      p2wins: series.p2wins,
    });
  } else {
    penalizeDraw(room.tournament, game.player1.id, game.player2.id);
    refundBets(room.tournament, series);
    const fsResult = finalizeSeries(room.tournament, series);
    io.to(roomId).emit('series-result', {
      seriesId: series.id,
      winner: null,
      loserId: null,
      p1wins: series.p1wins,
      p2wins: series.p2wins,
    });
  }

  setTimeout(() => {
    io.to(roomId).emit('tournament-update', { tournament: room.tournament });
    launchNextSeries(roomId);
  }, 4000);
}

function stopPlatformerLoop(roomId) {
  const interval = platformerIntervals.get(roomId);
  if (interval) { clearInterval(interval); platformerIntervals.delete(roomId); }
  platformerInputs.delete(roomId);
}

function handleDisconnectMatch(room, roomId, socket) {
  const tournament = room.tournament;
  if (!tournament) return;
  const series = tournament.currentSeries;
  const game = tournament.currentGame;

  if (series && series.status === 'betting') {
    if (series.bettingTimer) clearTimeout(series.bettingTimer);
    series.status = 'playing';
  }

  if (game && game.status === 'playing') {
    if (game.type === 'platformer') {
      stopPlatformerLoop(roomId);
      const setup = game.platformerSetup;
      if (setup) {
        const deadPlayer = setup.players.find(p => p.id === socket.id);
        if (deadPlayer) deadPlayer.alive = false;
        setup.timeRemaining = 0;
        setup.finished = true;
      }
      return;
    }
    stopTimerInterval(roomId);
    const otherId = game.player1.id === socket.id ? game.player2.id : game.player1.id;
    game.status = 'finished';
    game.winner = otherId;
    const otherPlayer = room.players.find((p) => p.id === otherId);

    io.to(roomId).emit('match-result', {
      match: game, winner: otherPlayer, draw: false,
      byDisconnect: true, tournament,
    });

    handleAfterGame(roomId, game, otherId, socket.id, false);
  }
}

io.on('connection', (socket) => {
  let currentRoom = null;
  let currentPlayer = null;

  socket.on('join-room', ({ roomId, playerName, avatar }, callback) => {
    let room = rooms.get(roomId);
    if (!room) {
      room = { id: roomId, players: [], tournament: null, hostId: socket.id };
      rooms.set(roomId, room);
    }
    if (room.players.length >= 16) return callback({ error: 'Room is full (max 16 players)' });
    if (room.tournament && (room.tournament.phase === 'finished' || room.tournament.phase === 'cancelled')) {
      room.tournament = null;
    }
    if (!avatar || room.players.some((p) => p.avatar === avatar)) avatar = getNextAvatar();

    const sanitized = playerName
      .replace(/[<>&"']/g, '')
      .replace(/[\x00-\x1f]/g, '')
      .trim()
      .slice(0, 20);

    const player = {
      id: socket.id, name: sanitized || 'Player', avatar, connected: true,
      inMatch: false, eliminated: false,
      isHost: room.players.length === 0, coins: INITIAL_COINS,
    };
    room.players.push(player);
    currentRoom = roomId;
    currentPlayer = player;
    socket.join(roomId);
    emitRoomUpdate(roomId);
    callback({ success: true, playerId: socket.id, roomId });
  });

  socket.on('new-tournament', () => {
    const room = rooms.get(currentRoom);
    if (!room) return;
    room.tournament = null;
    room.gameType = undefined;
    for (const p of room.players) {
      p.inMatch = false;
      p.eliminated = false;
    }
    emitRoomUpdate(currentRoom);
  });

  socket.on('start-tournament', ({ gameType = 'tictactoe' } = {}) => {
    const room = rooms.get(currentRoom);
    if (!room || room.hostId !== socket.id || room.players.length < 2) return;

    room.gameType = gameType;
    room.tournament = createTournament(room.players);
    io.to(currentRoom).emit('tournament-start', { tournament: room.tournament, gameType });

    const info = startRound(room.tournament);
    if (info) {
      setTimeout(() => {
        io.to(currentRoom).emit('round-start', {
          round: room.tournament.round,
          message: `Round ${room.tournament.round} starting!`,
        });
        setTimeout(() => launchNextSeries(currentRoom), 2000);
      }, 1000);
    } else if (room.tournament.phase === 'finished') {
      finishTournament(currentRoom);
    }
  });

  socket.on('place-bet', ({ matchId, amount, on }) => {
    const room = rooms.get(currentRoom);
    if (!room || !room.tournament || !room.tournament.currentSeries) return;
    const series = room.tournament.currentSeries;
    if (series.status !== 'betting') return;
    const roomPlayer = room.players.find(p => p.id === socket.id);
    if (!roomPlayer || !roomPlayer.connected || roomPlayer.eliminated) return;
    if (on !== series.player1.id && on !== series.player2.id) return;
    const tPlayer = room.tournament.players.find((p) => p.id === socket.id);
    if (!tPlayer || series.bets[socket.id]) return;
    const betAmount = Math.max(0, Math.min(Math.floor(amount), tPlayer.coins));
    series.bets[socket.id] = { on, amount: betAmount };
    io.to(currentRoom).emit('bet-update', {
      matchId, bettorId: socket.id, on, amount: betAmount,
    });
  });

  socket.on('make-move', ({ matchId, cellIndex }) => {
    const room = rooms.get(currentRoom);
    if (!room || !room.tournament) return;
    const game = room.tournament.currentGame;
    if (!game || game.id !== matchId || game.status !== 'playing') return;
    if (game.currentTurn !== socket.id) return;
    if (game.moveCooldownUntil && Date.now() < game.moveCooldownUntil) return;

    const speedPoints = calcSpeedPoints(game);
    addCoins(room.tournament, socket.id, speedPoints);

    for (const tp of room.tournament.players) {
      tp.coins = (tp.coins || 0) + 100;
    }

    if (game.type === 'minefinder') {
      const result = revealMineCell(game, cellIndex);
      if (!result.valid) return;

      game.moves.push({ playerId: socket.id, cellIndex });

      if (result.mine) {
        revealAllMines(game.board);
        io.to(currentRoom).emit('mine-hit', {
          matchId: game.id,
          board: game.board,
          cellIndex: result.cellIndex,
          scores: game.scores,
          currentTurn: game.currentTurn,
          moveCooldownUntil: game.moveCooldownUntil,
        });
        setTimeout(() => endMineTurn(room, currentRoom, game, 'mine'), 2500);
        return;
      }

      game.turnScores[socket.id] = (game.turnScores[socket.id] || 0) + 1;
      game.scores[socket.id] = (game.scores[socket.id] || 0) + 1;

      io.to(currentRoom).emit('mine-board-update', {
        matchId: game.id,
        board: game.board,
        cellIndex: result.cellIndex,
        scores: game.scores,
        currentTurn: game.currentTurn,
        moveCooldownUntil: game.moveCooldownUntil,
      });
      return;
    }

    const playerMark = game.player1.id === socket.id ? 'X' : 'O';
    const result = makeMove(game.board, cellIndex, playerMark);
    if (!result.valid) return;

    game.board = result.board;
    game.moves.push({ playerId: socket.id, cellIndex, mark: playerMark, speedPoints });

    if (result.win || result.draw) {
      game.status = 'finished';
      stopTimerInterval(currentRoom);
      switchTurn(game);

      const winnerPlayer = result.win
        ? room.tournament.players.find((p) => p.id === socket.id)
        : null;
      io.to(currentRoom).emit('match-result', {
        match: game, winner: winnerPlayer, draw: result.draw,
        winCombo: result.winCombo, tournament: room.tournament,
      });

      if (result.win) {
        const loserId = game.player1.id === socket.id ? game.player2.id : game.player1.id;
        handleAfterGame(currentRoom, game, socket.id, loserId, false);
      } else {
        penalizeDraw(room.tournament, game.player1.id, game.player2.id);
        handleAfterGame(currentRoom, game, null, null, true);
      }
      return;
    }

    switchTurn(game);
    io.to(currentRoom).emit('board-update', {
      matchId: game.id, board: game.board,
      currentTurn: game.currentTurn,
      moveCooldownUntil: game.moveCooldownUntil,
    });
    scheduleBotMove(room, currentRoom, game);
  });

  socket.on('penalty-choice', ({ matchId, direction }) => {
    const room = rooms.get(currentRoom);
    if (!room || !room.tournament) return;
    const game = room.tournament.currentGame;
    if (!game || game.id !== matchId || game.status !== 'playing' || game.type !== 'penalty') return;

    if (direction !== 1 && direction !== 2 && direction !== 3) return;
    const result = submitPenaltyChoice(game, socket.id, direction);
    if (!result.valid) return;

    if (result.waiting) {
      socket.emit('penalty-waiting', { matchId: game.id });
      return;
    }

    io.to(currentRoom).emit('penalty-result', {
      matchId: game.id,
      result: result.result,
      scores: result.scores,
      round: result.round,
      phase: result.phase,
      allDone: result.allDone,
    });

    if (result.allDone) {
      game.status = 'finished';
      stopTimerInterval(currentRoom);
      const p1Score = result.scores[game.player1.id] || 0;
      const p2Score = result.scores[game.player2.id] || 0;
      const winnerId = p1Score > p2Score ? game.player1.id : (p2Score > p1Score ? game.player2.id : null);
      const winnerPlayer = winnerId ? room.tournament.players.find((p) => p.id === winnerId) : null;
      const draw = !winnerId;

      io.to(currentRoom).emit('match-result', {
        match: game, winner: winnerPlayer, draw,
        winCombo: null, scores: result.scores, tournament: room.tournament,
      });

      const series = room.tournament.currentSeries;
      if (series) {
        if (winnerId) {
          if (winnerId === series.player1.id) series.p1wins++;
          else series.p2wins++;
        } else {
          penalizeDraw(room.tournament, game.player1.id, game.player2.id);
        }
        const fsResult = finalizeSeries(room.tournament, series);
        if (fsResult.winner) {
          distributePot(room.tournament, series, fsResult.winner.id);
        } else {
          refundBets(room.tournament, series);
        }
        io.to(currentRoom).emit('series-result', {
          seriesId: series.id,
          winner: fsResult.winner,
          loserId: fsResult.loserId,
          p1wins: series.p1wins,
          p2wins: series.p2wins,
        });
        setTimeout(() => {
          io.to(currentRoom).emit('tournament-update', { tournament: room.tournament });
          launchNextSeries(currentRoom);
        }, 3000);
      }
    } else {
      setTimeout(() => {
        startNextPenaltyKick(game);
        if (game.penalty.phase === 'kicking') {
          io.to(currentRoom).emit('penalty-next', {
            matchId: game.id,
            currentKicker: game.penalty.currentKicker,
          });
        }
      }, 2500);
    }
  });

  socket.on('platform-input', ({ matchId, keys }) => {
    const room = rooms.get(currentRoom);
    if (!room || !room.tournament) return;
    const game = room.tournament.currentGame;
    if (!game || game.id !== matchId || game.type !== 'platformer') return;
    if (!platformerInputs.has(currentRoom)) {
      platformerInputs.set(currentRoom, {});
    }
    const inputs = platformerInputs.get(currentRoom);
    inputs[socket.id] = { left: keys.left, right: keys.right, jump: keys.jump };
  });

  socket.on('leave-room', () => {
    const room = rooms.get(currentRoom);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    socket.leave(currentRoom);
    if (player) {
      player.connected = false;
      io.to(currentRoom).emit('player-abandoned', { playerName: player.name, playerId: player.id });
    }
    if (room.tournament && room.tournament.currentGame &&
        (room.tournament.currentGame.player1.id === socket.id ||
         room.tournament.currentGame.player2.id === socket.id)) {
      handleDisconnectMatch(room, currentRoom, socket);
      return;
    }
    emitRoomUpdate(currentRoom);
  });

  socket.on('disconnect', () => {
    const room = rooms.get(currentRoom);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (player) player.connected = false;

    if (room.tournament) {
      const activePlayers = room.players.filter((p) => p.connected && !p.eliminated);
      if (activePlayers.length < 2 && room.tournament.phase !== 'finished' && room.tournament.phase !== 'cancelled') {
        room.tournament.phase = 'cancelled';
        stopTimerInterval(currentRoom);
        io.to(currentRoom).emit('tournament-cancelled', { reason: 'Too many players disconnected' });
      }
      if (room.tournament.currentGame &&
          (room.tournament.currentGame.player1.id === socket.id ||
           room.tournament.currentGame.player2.id === socket.id)) {
        if (player) io.to(currentRoom).emit('player-abandoned', { playerName: player.name, playerId: player.id });
        handleDisconnectMatch(room, currentRoom, socket);
      }
    }
    emitRoomUpdate(currentRoom);
    if (room.players.every((p) => !p.connected)) {
      stopTimerInterval(currentRoom);
      rooms.delete(currentRoom);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
