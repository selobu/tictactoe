import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createBoard, makeMove } from './gameLogic.js';
import {
  createTournament, getNextMatch, applyMatchResult,
  addCoins, penalizeDraw, releasePlayers,
} from './tournament.js';

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const rooms = new Map();
const timerIntervals = new Map();

const TIME_LIMIT = 30000;
const MAX_SPEED_POINTS = 50;
const DRAW_PENALTY = 100;

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
  '😂', '🤣', '😊', '🥰', '😎', '🤩',
  '😜', '🥳', '😏', '🤪', '😭', '😤',
  '🫡', '😈', '🤡', '👽', '🤖', '🎃',
];

let avatarIndex = 0;
function getNextAvatar() {
  const av = AVATARS[avatarIndex % AVATARS.length];
  avatarIndex++;
  return av;
}

function emitRoomUpdate(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;
  io.to(roomId).emit('room-update', {
    players: room.players.map((p) => ({
      id: p.id, name: p.name, avatar: p.avatar,
      connected: p.connected, inMatch: p.inMatch,
      eliminated: p.eliminated, isHost: p.isHost,
      coins: p.coins || 0,
    })),
    tournament: room.tournament,
  });
}

function initMatchTimer(match) {
  match.timeP1 = TIME_LIMIT;
  match.timeP2 = TIME_LIMIT;
  match.turnStartedAt = Date.now();
  match.theme = getNextTheme();
}

function getTimerState(match) {
  if (!match || match.status !== 'playing') return null;
  const now = Date.now();
  const elapsed = now - match.turnStartedAt;
  const p1 = Math.max(0, match.timeP1 - (match.currentTurn === match.player1.id ? elapsed : 0));
  const p2 = Math.max(0, match.timeP2 - (match.currentTurn === match.player2.id ? elapsed : 0));
  return { p1, p2, currentTurn: match.currentTurn };
}

function switchTurn(match) {
  const now = Date.now();
  const elapsed = now - match.turnStartedAt;
  if (match.currentTurn === match.player1.id) {
    match.timeP1 = Math.max(0, match.timeP1 - elapsed);
  } else {
    match.timeP2 = Math.max(0, match.timeP2 - elapsed);
  }
  match.currentTurn =
    match.currentTurn === match.player1.id ? match.player2.id : match.player1.id;
  match.turnStartedAt = Date.now();
}

function calcSpeedPoints(match) {
  const elapsed = Date.now() - match.turnStartedAt;
  return Math.max(0, Math.round(MAX_SPEED_POINTS * (1 - elapsed / TIME_LIMIT)));
}

function scheduleNextMatch(roomId) {
  const room = rooms.get(roomId);
  if (!room || !room.tournament) return;
  const nextMatch = getNextMatch(room.tournament);
  if (nextMatch) {
    setTimeout(() => {
      initMatchTimer(nextMatch);
      io.to(roomId).emit('match-start', { match: nextMatch });
      startTimerInterval(roomId);
    }, 2000);
  }
}

function handleTournamentEnd(roomId) {
  const room = rooms.get(roomId);
  if (!room || !room.tournament) return;
  if (room.tournament.phase === 'finished') {
    io.to(roomId).emit('tournament-end', { champion: room.tournament.champion });
  } else if (room.tournament.phase === 'pairing') {
    scheduleNextMatch(roomId);
  }
}

function startTimerInterval(roomId) {
  if (timerIntervals.has(roomId)) return;
  const interval = setInterval(() => {
    const room = rooms.get(roomId);
    if (!room || !room.tournament || !room.tournament.currentMatch) {
      clearInterval(interval);
      timerIntervals.delete(roomId);
      return;
    }
    const match = room.tournament.currentMatch;
    if (match.status !== 'playing') return;

    const state = getTimerState(match);
    io.to(roomId).emit('timer-update', state);

    const remaining = match.currentTurn === match.player1.id ? state.p1 : state.p2;
    if (remaining <= 0) {
      const loserId = match.currentTurn;
      const winnerId = loserId === match.player1.id ? match.player2.id : match.player1.id;
      const winnerPlayer = room.players.find((p) => p.id === winnerId);

      match.status = 'finished';
      match.winner = winnerId;
      applyMatchResult(room.tournament, winnerId, loserId);

      io.to(roomId).emit('match-result', {
        match,
        winner: winnerPlayer,
        draw: false,
        winCombo: null,
        byTimeout: true,
        tournament: room.tournament,
      });

      handleTournamentEnd(roomId);
    }
  }, 250);
  timerIntervals.set(roomId, interval);
}

function stopTimerInterval(roomId) {
  const interval = timerIntervals.get(roomId);
  if (interval) {
    clearInterval(interval);
    timerIntervals.delete(roomId);
  }
}

io.on('connection', (socket) => {
  let currentRoom = null;
  let currentPlayer = null;

  socket.on('join-room', ({ roomId, playerName }, callback) => {
    let room = rooms.get(roomId);
    if (!room) {
      room = {
        id: roomId,
        players: [],
        tournament: null,
        hostId: socket.id,
      };
      rooms.set(roomId, room);
    }
    if (room.players.length >= 12) {
      return callback({ error: 'Room is full (max 12 players)' });
    }
    if (room.tournament && room.tournament.phase === 'finished') {
      room.tournament = null;
    }

    const player = {
      id: socket.id,
      name: playerName,
      avatar: getNextAvatar(),
      connected: true,
      inMatch: false,
      eliminated: false,
      isHost: room.players.length === 0,
      coins: 0,
    };
    room.players.push(player);
    currentRoom = roomId;
    currentPlayer = player;

    socket.join(roomId);
    emitRoomUpdate(roomId);
    callback({ success: true, playerId: socket.id, roomId });
  });

  socket.on('start-tournament', () => {
    const room = rooms.get(currentRoom);
    if (!room || room.hostId !== socket.id) return;
    if (room.players.length < 2) return;

    room.tournament = createTournament(room.players);
    const match = getNextMatch(room.tournament);
    if (match) initMatchTimer(match);

    io.to(currentRoom).emit('tournament-start', { tournament: room.tournament });
    if (match) {
      io.to(currentRoom).emit('match-start', { match });
      startTimerInterval(currentRoom);
    }
  });

  socket.on('make-move', ({ matchId, cellIndex }) => {
    const room = rooms.get(currentRoom);
    if (!room || !room.tournament) return;

    const match = room.tournament.currentMatch;
    if (!match || match.id !== matchId) return;
    if (match.status !== 'playing') return;
    if (match.currentTurn !== socket.id) return;

    const speedPoints = calcSpeedPoints(match);
    addCoins(room.tournament, socket.id, speedPoints);

    const playerMark = match.player1.id === socket.id ? 'X' : 'O';
    const result = makeMove(match.board, cellIndex, playerMark);
    if (!result.valid) return;

    match.board = result.board;
    match.moves.push({ playerId: socket.id, cellIndex, mark: playerMark, speedPoints });

    if (result.win || result.draw) {
      match.status = 'finished';
      stopTimerInterval(currentRoom);
      switchTurn(match);

      if (result.win) {
        match.winner = socket.id;
        const loserId = match.player1.id === socket.id ? match.player2.id : match.player1.id;
        applyMatchResult(room.tournament, socket.id, loserId);
      } else {
        match.winner = null;
        releasePlayers(room.tournament, match.player1.id, match.player2.id);
        penalizeDraw(room.tournament, match.player1.id, match.player2.id);
        room.tournament.currentMatch = null;
        room.tournament.phase = 'pairing';
        const remaining = room.tournament.players.filter((p) => !p.eliminated);
        if (remaining.length === 1) {
          room.tournament.champion = remaining[0];
          room.tournament.phase = 'finished';
        } else {
          room.tournament.round++;
        }
      }

      io.to(currentRoom).emit('match-result', {
        match,
        winner: result.winner ? room.tournament.players.find((p) => p.id === socket.id) : null,
        draw: result.draw,
        winCombo: result.winCombo,
        tournament: room.tournament,
      });

      handleTournamentEnd(currentRoom);
      return;
    }

    switchTurn(match);
    io.to(currentRoom).emit('board-update', {
      matchId: match.id,
      board: match.board,
      currentTurn: match.currentTurn,
    });
  });

  socket.on('disconnect', () => {
    const room = rooms.get(currentRoom);
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (player) player.connected = false;

    if (room.tournament) {
      const activePlayers = room.players.filter((p) => p.connected && !p.eliminated);
      if (activePlayers.length < 2 && room.tournament.phase !== 'finished') {
        room.tournament.phase = 'cancelled';
        stopTimerInterval(currentRoom);
        io.to(currentRoom).emit('tournament-cancelled', { reason: 'Too many players disconnected' });
      }

      if (room.tournament.currentMatch &&
          (room.tournament.currentMatch.player1.id === socket.id ||
           room.tournament.currentMatch.player2.id === socket.id)) {
        stopTimerInterval(currentRoom);
        const otherId = room.tournament.currentMatch.player1.id === socket.id
          ? room.tournament.currentMatch.player2.id
          : room.tournament.currentMatch.player1.id;

        room.tournament.currentMatch.status = 'finished';
        room.tournament.currentMatch.winner = otherId;
        const otherPlayer = room.players.find((p) => p.id === otherId);
        applyMatchResult(room.tournament, otherId, socket.id);

        io.to(currentRoom).emit('match-result', {
          match: room.tournament.currentMatch,
          winner: otherPlayer,
          draw: false,
          byDisconnect: true,
          tournament: room.tournament,
        });

        handleTournamentEnd(currentRoom);
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
