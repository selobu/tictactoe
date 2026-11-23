import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createBoard, makeMove, createMineBoard, revealMineCell, revealAllMines, submitPenaltyChoice, startNextPenaltyKick } from './gameLogic.js';
import { initPlatformerGame, tickPlatformerGame, getPlatformerDynamicState, getPlatformerLevelData, getPlatformerResults, createPlatformerGameSetup, PLATFORMER_LEVEL_IDS } from './platformerLogic.js';
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
const trainingSessions = new Map();

const reconnectTimers = new Map();
const activePersistentIds = new Set();
const RECONNECT_GRACE_MS = 10000;

function findPlayerBySocket(room, socketId) {
  return room?.players?.find(p => p.socketId === socketId) || null;
}

function getPid(room, socketId) {
  const p = findPlayerBySocket(room, socketId);
  return p ? p.id : null;
}

function stopTraining(socketId) {
  const session = trainingSessions.get(socketId);
  if (!session) return;
  if (session.interval) clearInterval(session.interval);
  trainingSessions.delete(socketId);
}

const TIME_LIMIT = 30000;
const MOVE_COOLDOWN = 800;
const FIRST_MOVE_COOLDOWN = 3000;
const MAX_SPEED_POINTS = 50;
const INITIAL_COINS = 1000;
const BET_TIME_LIMIT = 40000;
const MAX_PLAYERS = 16;

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
  // Custom animated characters
  'plumber-01', 'plumber-02', 'plumber-03', 'plumber-04',
  'plumber-05', 'plumber-06', 'plumber-07', 'plumber-08',
  'plumber-09', 'plumber-10', 'plumber-11', 'plumber-12',
  'flower-01', 'pine-01', 'cloud-01', 'rocket-01',
  'mushroom-01', 'cactus-01', 'planet-01', 'robot-01',
  'coffee-01', 'eagle-01', 'axolotl-01', 'house-01', 'catrina-01',
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

function getRoomSummaries() {
  const summaries = [];
  for (const [id, room] of rooms) {
    const connected = room.players.filter((p) => p.connected);
    if (connected.length === 0) continue;

    const tournament = room.tournament;
    if (tournament && (tournament.phase === 'finished' || tournament.phase === 'cancelled')) continue;

    const host = room.players.find((p) => p.id === room.hostId) || connected[0];
    summaries.push({
      id,
      hostName: host?.name || 'Unknown',
      playerCount: connected.length,
      maxPlayers: MAX_PLAYERS,
      gameType: room.gameType || null,
      status: tournament ? 'playing' : 'waiting',
      round: tournament?.round || 0,
      players: connected.slice(0, 4).map((p) => ({ id: p.id, name: p.name, avatar: p.avatar })),
    });
  }

  const statusRank = { waiting: 0, playing: 1 };
  return summaries.sort((a, b) =>
    (statusRank[a.status] - statusRank[b.status]) ||
    (b.playerCount - a.playerCount) ||
    a.id.localeCompare(b.id)
  );
}

function broadcastRooms() {
  io.emit('rooms-update', getRoomSummaries());
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
  broadcastRooms();
}

function initMatchTimer(game) {
  const limit = game.type === 'minefinder' ? 60000 : TIME_LIMIT;
  game.timeP1 = limit;
  game.timeP2 = limit;
  game.turnStartedAt = Date.now();
  game.moveCooldownUntil = Date.now() + (game.type === 'tictactoe' ? FIRST_MOVE_COOLDOWN : MOVE_COOLDOWN);
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
  const isFirstMove = !game.firstMovesDone?.includes(game.currentTurn);
  game.moveCooldownUntil = Date.now() + (isFirstMove ? FIRST_MOVE_COOLDOWN : MOVE_COOLDOWN);
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
    if (tp) {
      tp.coins = Math.max(0, tp.coins - bet.amount);
      tp.totalWagered = (tp.totalWagered || 0) + bet.amount;
    }
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
  if (!game) {
    setTimeout(() => startGame(roomId), 3000);
    return;
  }

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
  const coChamp = room.tournament.coChampion;
  let runnerUp = null;
  if (room.tournament.players) {
    const champIds = [champ?.id, coChamp?.id].filter(Boolean);
    const notChamp = room.tournament.players.filter(p => !champIds.includes(p.id));
    runnerUp = notChamp.length > 0 ? notChamp[0] : null;
  }
  const richest = getMostCoinsPlayer(room.tournament);

  const bestBettor = [...(room.tournament.players || [])]
    .filter(p => (p.bettingProfit || 0) > 0)
    .sort((a, b) => (b.bettingProfit || 0) - (a.bettingProfit || 0))
    .slice(0, 2);

  io.to(roomId).emit('tournament-end', {
    champion: champ,
    coChampion: coChamp,
    runnerUp,
    mostCoins: richest,
    bestBettor: bestBettor.length > 0 ? bestBettor : null,
    tournament: room.tournament,
  });
  broadcastRooms();
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
      const winnings = Math.floor(boostedPot * bet.amount / winningTotal);
      tp.coins += winnings;
      tp.bettingProfit = (tp.bettingProfit || 0) + winnings - bet.amount;
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

function distributePotToAll(tournament, series) {
  if (!series.totalPot || !series.bets) return;
  const allEntries = Object.entries(series.bets);
  const totalBets = allEntries.reduce((s, [_, b]) => s + b.amount, 0);
  if (totalBets <= 0) return;
  const boostedPot = Math.floor(series.totalPot * 1.3);
  for (const [bettorId, bet] of allEntries) {
    const tp = tournament.players.find(p => p.id === bettorId);
    if (tp) {
      const share = Math.floor(boostedPot * bet.amount / totalBets);
      tp.coins += share;
      tp.bettingProfit = (tp.bettingProfit || 0) + share - bet.amount;
    }
  }
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

  if (result.isDraw) {
    distributePotToAll(room.tournament, series);
  } else if (result.winner) {
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
    isDraw: !!result.isDraw,
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

function handleDisconnectMatch(room, roomId, playerId) {
  const tournament = room.tournament;
  if (!tournament) return;
  const series = tournament.currentSeries;
  const game = tournament.currentGame;

  if (series && series.status === 'betting') {
    if (series.bettingTimer) clearTimeout(series.bettingTimer);
    finalizeBetting(roomId, series);
  }

  if (game && game.status === 'playing') {
    if (game.type === 'platformer') {
      stopPlatformerLoop(roomId);
    }
    stopTimerInterval(roomId);
    const otherId = game.player1.id === playerId ? game.player2.id : game.player1.id;
    game.status = 'finished';
    game.winner = otherId;
    const otherPlayer = room.players.find((p) => p.id === otherId);

    io.to(roomId).emit('match-result', {
      match: game, winner: otherPlayer, draw: false,
      byDisconnect: true, tournament,
    });

    handleAfterGame(roomId, game, otherId, playerId, false);
  }
}

io.on('connection', (socket) => {
  let currentRoom = null;
  let currentPlayer = null;

  socket.on('list-rooms', (callback) => {
    const payload = { rooms: getRoomSummaries() };
    if (typeof callback === 'function') callback(payload);
    else socket.emit('rooms-update', payload.rooms);
  });

  socket.on('start-training', (payload = {}) => {
    stopTraining(socket.id);

    const persistentId = payload.persistentId || `train-${socket.id}`;
    const playerName = String(payload.playerName || 'Player')
      .replace(/[<>&"']/g, '')
      .replace(/[\x00-\x1f]/g, '')
      .trim()
      .slice(0, 20) || 'Player';
    const avatar = AVATARS.includes(payload.avatar) ? payload.avatar : AVATARS[0];
    const playerInfo = { id: persistentId, name: playerName, avatar };

    const setup = createPlatformerGameSetup(
      [playerInfo],
      PLATFORMER_LEVEL_IDS.includes(payload.startLevel) ? payload.startLevel : 'grass'
    );
    initPlatformerGame(setup);
    const game = {
      id: Date.now(),
      type: 'platformer',
      status: 'playing',
      player1: playerInfo,
      player2: null,
      platformerSetup: setup,
    };
    const inputs = {
      [playerInfo.id]: { left: false, right: false, jump: false, jumpQueued: false },
    };
    const session = {
      socketId: socket.id,
      player: playerInfo,
      setup,
      game,
      inputs,
      interval: null,
    };
    trainingSessions.set(socket.id, session);

    const { platformerSetup, ...safeMatch } = game;
    socket.emit('training-start', {
      match: safeMatch,
      level: getPlatformerLevelData(setup),
      player: playerInfo,
    });

    session.interval = setInterval(() => {
      const current = trainingSessions.get(socket.id);
      if (!current) return;
      tickPlatformerGame(current.setup, current.inputs);
      const state = getPlatformerDynamicState(current.setup);
      state.matchId = current.game.id;
      socket.emit('platformer-state', state);
      if (current.setup.finished) {
        clearInterval(current.interval);
        current.interval = null;
        socket.emit('training-end', { results: getPlatformerResults(current.setup) });
      }
    }, 50);
  });

  socket.on('stop-training', () => {
    stopTraining(socket.id);
  });

  socket.on('join-room', ({ roomId, playerName, avatar, persistentId }, callback) => {
    let room = rooms.get(roomId);
    if (!room) {
      room = { id: roomId, players: [], tournament: null, hostId: null };
      rooms.set(roomId, room);
    }

    const existing = persistentId ? room.players.find(p => p.id === persistentId) : null;
    if (existing) {
      const timerKey = `${roomId}_${persistentId}`;
      if (reconnectTimers.has(timerKey)) {
        clearTimeout(reconnectTimers.get(timerKey));
        reconnectTimers.delete(timerKey);
      }
      existing.socketId = socket.id;
      existing.connected = true;
      if (!activePersistentIds.has(persistentId)) activePersistentIds.add(persistentId);
      if (room.tournament?.currentGame?.type === 'platformer') {
        const setup = room.tournament.currentGame.platformerSetup;
        if (setup && setup.paused) {
          setup.paused = false;
          startPlatformerLoop(roomId, room.tournament.currentGame);
        }
      }
      currentRoom = roomId;
      currentPlayer = existing;
      socket.join(roomId);

      const rg = room.tournament?.currentGame || null;
      const rs = room.tournament?.currentSeries || null;
      const rPL = rg?.type === 'platformer' && rg.platformerSetup ? getPlatformerLevelData(rg.platformerSetup) : null;

      callback({
        success: true, playerId: existing.id, roomId, reconnected: true,
        tournament: room.tournament, gameType: room.gameType || 'tictactoe',
        currentMatch: rg ? { ...rg, platformerLevel: rPL } : null,
        currentSeries: rs,
        bettingEndAt: rs?.bettingEndAt || null,
        bets: rs?.bets || {},
        players: room.players.map(p => ({
          id: p.id, name: p.name, avatar: p.avatar,
          connected: p.connected, inMatch: p.inMatch,
          eliminated: p.eliminated, isHost: p.isHost,
          coins: getPlayerCoins(room.tournament, p.id) ?? p.coins ?? 0,
        })),
      });
      emitRoomUpdate(roomId);
      return;
    }

    if (persistentId && activePersistentIds.has(persistentId)) {
      return callback({ error: 'Already connected from another tab. Please close the other tab first.' });
    }

    if (room.players.length >= 16) return callback({ error: 'Room is full (max 16 players)' });
    if (room.tournament && (room.tournament.phase === 'finished' || room.tournament.phase === 'cancelled')) {
      room.tournament = null;
    }
    if (!avatar || !AVATARS.includes(avatar) || room.players.some((p) => p.avatar === avatar)) avatar = getNextAvatar();

    const sanitized = playerName
      .replace(/[<>&"']/g, '')
      .replace(/[\x00-\x1f]/g, '')
      .trim()
      .slice(0, 20);

    const player = {
      id: persistentId || socket.id, name: sanitized || 'Player', avatar, connected: true,
      socketId: socket.id, inMatch: false, eliminated: false,
      isHost: room.players.length === 0, coins: INITIAL_COINS,
    };
    room.players.push(player);
    if (!room.hostId) room.hostId = player.id;
    if (persistentId) activePersistentIds.add(persistentId);
    currentRoom = roomId;
    currentPlayer = player;
    socket.join(roomId);
    emitRoomUpdate(roomId);
    callback({ success: true, playerId: player.id, roomId });
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
    const hPid = getPid(room, socket.id);
    if (!room || room.hostId !== hPid || room.players.length < 2) return;

    room.gameType = gameType;
    room.tournament = createTournament(room.players);
    io.to(currentRoom).emit('tournament-start', { tournament: room.tournament, gameType });
    broadcastRooms();

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
    const pid = getPid(room, socket.id);
    if (!pid) return;
    const roomPlayer = findPlayerBySocket(room, socket.id);
    if (!roomPlayer || !roomPlayer.connected || roomPlayer.eliminated) return;
    if (on !== series.player1.id && on !== series.player2.id) return;
    const tPlayer = room.tournament.players.find((p) => p.id === pid);
    if (!tPlayer || series.bets[pid]) return;
    const betAmount = Math.max(0, Math.min(Math.floor(amount), tPlayer.coins));
    series.bets[pid] = { on, amount: betAmount };
    io.to(currentRoom).emit('bet-update', {
      matchId, bettorId: pid, on, amount: betAmount,
    });
    if (series.bets[series.player1.id] && series.bets[series.player2.id]) {
      if (series.bettingTimer) clearTimeout(series.bettingTimer);
      series.bettingTimer = null;
      finalizeBetting(currentRoom, series);
    }
  });

  socket.on('make-move', ({ matchId, cellIndex }) => {
    const room = rooms.get(currentRoom);
    if (!room || !room.tournament) return;
    const game = room.tournament.currentGame;
    if (!game || game.id !== matchId || game.status !== 'playing') return;
    const pid = getPid(room, socket.id);
    if (!pid || game.currentTurn !== pid) return;
    if (game.moveCooldownUntil && Date.now() < game.moveCooldownUntil) return;

    const speedPoints = calcSpeedPoints(game);
    addCoins(room.tournament, pid, speedPoints);

    for (const tp of room.tournament.players) {
      tp.coins = (tp.coins || 0) + 100;
    }

    if (game.type === 'minefinder') {
      const result = revealMineCell(game, cellIndex);
      if (!result.valid) return;

      game.moves.push({ playerId: pid, cellIndex });

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

      game.turnScores[pid] = (game.turnScores[pid] || 0) + 1;
      game.scores[pid] = (game.scores[pid] || 0) + 1;

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

    const playerMark = game.player1.id === pid ? 'X' : 'O';
    const result = makeMove(game.board, cellIndex, playerMark);
    if (!result.valid) return;

    game.board = result.board;
    game.moves.push({ playerId: pid, cellIndex, mark: playerMark, speedPoints });
    if (game.firstMovesDone && !game.firstMovesDone.includes(pid)) {
      game.firstMovesDone.push(pid);
    }

    if (result.win || result.draw) {
      game.status = 'finished';
      stopTimerInterval(currentRoom);
      switchTurn(game);

      const winnerPlayer = result.win
        ? room.tournament.players.find((p) => p.id === pid)
        : null;
      io.to(currentRoom).emit('match-result', {
        match: game, winner: winnerPlayer, draw: result.draw,
        winCombo: result.winCombo, tournament: room.tournament,
      });

      if (result.win) {
        const loserId = game.player1.id === pid ? game.player2.id : game.player1.id;
        handleAfterGame(currentRoom, game, pid, loserId, false);
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
    const pid = getPid(room, socket.id);
    if (!pid) return;

    if (direction !== 1 && direction !== 2 && direction !== 3) return;
    const result = submitPenaltyChoice(game, pid, direction);
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

  socket.on('platform-input', ({ matchId, keys } = {}) => {
    const training = trainingSessions.get(socket.id);
    if (training && training.game.id === matchId) {
      const k = keys || {};
      const prev = training.inputs[training.player.id] || { jump: false, jumpQueued: false };
      const now = Date.now();
      const risingJump = !!k.jump && !prev.jump;
      const canQueueJump = risingJump && (!prev.lastJumpPressAt || now - prev.lastJumpPressAt > 90);
      training.inputs[training.player.id] = {
        left: !!k.left,
        right: !!k.right,
        jump: !!k.jump,
        jumpQueued: !!prev.jumpQueued || canQueueJump,
        lastJumpPressAt: canQueueJump ? now : (prev.lastJumpPressAt || 0),
      };
      return;
    }

    const room = rooms.get(currentRoom);
    if (!room || !room.tournament) return;
    const game = room.tournament.currentGame;
    if (!game || game.id !== matchId || game.type !== 'platformer') return;
    const pid = getPid(room, socket.id);
    if (!pid) return;
    if (!platformerInputs.has(currentRoom)) {
      platformerInputs.set(currentRoom, {});
    }
    const inputs = platformerInputs.get(currentRoom);
    const prev = inputs[pid] || { jump: false, jumpQueued: false };
    const now = Date.now();
    const risingJump = !!keys.jump && !prev.jump;
    const canQueueJump = risingJump && (!prev.lastJumpPressAt || now - prev.lastJumpPressAt > 90);
    inputs[pid] = {
      left: !!keys.left,
      right: !!keys.right,
      jump: !!keys.jump,
      // Preserve a quick tap until the next simulation tick consumes it.
      jumpQueued: !!prev.jumpQueued || canQueueJump,
      lastJumpPressAt: canQueueJump ? now : (prev.lastJumpPressAt || 0),
    };
  });

  socket.on('leave-room', () => {
    const room = rooms.get(currentRoom);
    if (!room) return;
    const player = findPlayerBySocket(room, socket.id);
    const pid = player?.id;
    if (pid) activePersistentIds.delete(pid);
    socket.leave(currentRoom);
    if (player) {
      player.connected = false;
      io.to(currentRoom).emit('player-abandoned', { playerName: player.name, playerId: player.id, avatar: player.avatar });
      handleDisconnectMatch(room, currentRoom, pid);
      broadcastRooms();
      return;
    }
    emitRoomUpdate(currentRoom);
  });

  socket.on('host-end-match', ({ confirm } = {}) => {
    const room = rooms.get(currentRoom);
    const hPid = getPid(room, socket.id);
    if (!room || !hPid || room.hostId !== hPid) return;
    if (!room.tournament?.currentGame || room.tournament.currentGame.status !== 'playing') return;
    const game = room.tournament.currentGame;
    const p1 = room.players.find(p => p.id === game.player1.id);
    const p2 = room.players.find(p => p.id === game.player2.id);
    let loserId = null;
    if (p1 && !p1.connected) loserId = p1.id;
    else if (p2 && !p2.connected) loserId = p2.id;
    if (!loserId) loserId = hPid;
    const timerKey = `${currentRoom}_${loserId}`;
    if (reconnectTimers.has(timerKey)) {
      clearTimeout(reconnectTimers.get(timerKey));
      reconnectTimers.delete(timerKey);
    }
    handleDisconnectMatch(room, currentRoom, loserId);
    emitRoomUpdate(currentRoom);
  });

  socket.on('rejoin-room', ({ roomId, persistentId }, callback) => {
    const room = rooms.get(roomId);
    if (!room) return callback({ success: false, error: 'Room not found' });
    const player = room.players.find(p => p.id === persistentId);
    if (!player) return callback({ success: false, error: 'Player not found in room' });

    const timerKey = `${roomId}_${persistentId}`;
    if (reconnectTimers.has(timerKey)) {
      clearTimeout(reconnectTimers.get(timerKey));
      reconnectTimers.delete(timerKey);
    }

    player.socketId = socket.id;
    player.connected = true;
    socket.join(roomId);
    currentRoom = roomId;
    currentPlayer = player;

    const game = room.tournament?.currentGame || null;
    const series = room.tournament?.currentSeries || null;

    if (game?.type === 'platformer') {
      const setup = game.platformerSetup;
      if (setup && setup.paused && !setup.finished) {
        setup.paused = false;
        startPlatformerLoop(roomId, game);
      }
    }

    const platformerLevel = game?.type === 'platformer' && game.platformerSetup
      ? getPlatformerLevelData(game.platformerSetup) : null;

    callback({
      success: true, playerId: player.id, roomId,
      tournament: room.tournament,
      currentMatch: game ? { ...game, platformerLevel } : null,
      currentSeries: series,
      gameType: room.gameType || 'tictactoe',
      bettingEndAt: series?.bettingEndAt || null,
      bets: series?.bets || {},
      totalPot: series?.totalPot || 0,
      players: room.players.map(p => ({
        id: p.id, name: p.name, avatar: p.avatar,
        connected: p.connected, inMatch: p.inMatch,
        eliminated: p.eliminated, isHost: p.isHost,
        coins: getPlayerCoins(room.tournament, p.id) ?? p.coins ?? 0,
      })),
    });
    emitRoomUpdate(roomId);
  });

  socket.on('disconnect', () => {
    stopTraining(socket.id);
    const room = rooms.get(currentRoom);
    const pid = currentPlayer?.id || (room ? findPlayerBySocket(room, socket.id)?.id : null);
    if (pid) activePersistentIds.delete(pid);
    if (!room) return;
    const player = findPlayerBySocket(room, socket.id);
    if (!player) return;
    player.connected = false;

    if (room.tournament) {
      const activePlayers = room.players.filter((p) => p.connected && !p.eliminated);
      if (activePlayers.length === 0 && room.tournament.phase !== 'finished' && room.tournament.phase !== 'cancelled') {
        room.tournament.phase = 'cancelled';
        stopTimerInterval(currentRoom);
        io.to(currentRoom).emit('tournament-cancelled', { reason: 'Too many players disconnected' });
        rooms.delete(currentRoom);
        broadcastRooms();
        return;
      }

      const game = room.tournament.currentGame;
      if (game &&
          (game.player1.id === pid ||
           game.player2.id === pid)) {
        io.to(currentRoom).emit('player-abandoned', { playerName: player.name, playerId: pid, avatar: player.avatar });

        const timerKey = `${currentRoom}_${pid}`;
        if (game.type === 'platformer') {
          const setup = game.platformerSetup;
          if (setup && !setup.finished) {
            setup.paused = true;
            stopPlatformerLoop(currentRoom);
          }
        }

        if (!reconnectTimers.has(timerKey)) {
          reconnectTimers.set(timerKey, setTimeout(() => {
            reconnectTimers.delete(timerKey);
            const r = rooms.get(currentRoom);
            if (r && r.tournament?.currentGame?.status === 'playing') {
              handleDisconnectMatch(r, currentRoom, pid);
              emitRoomUpdate(currentRoom);
            } else if (r) {
              emitRoomUpdate(currentRoom);
            }
          }, RECONNECT_GRACE_MS));
        }
      }
    }
    emitRoomUpdate(currentRoom);
    if (room.players.every((p) => !p.connected)) {
      stopTimerInterval(currentRoom);
      rooms.delete(currentRoom);
      broadcastRooms();
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
