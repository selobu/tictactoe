let matchIdCounter = 0;
let botIdCounter = 0;

import { createMineBoard as createMineBoardData, createPenaltyState } from './gameLogic.js';

const BOT_AVATARS = ['boo', 'shark', 'koopa'];

function createBotPlayer() {
  botIdCounter++;
  const avatar = BOT_AVATARS[(botIdCounter - 1) % BOT_AVATARS.length];
  return {
    id: `bot_${botIdCounter}`,
    name: `Bot ${botIdCounter}`,
    avatar,
    coins: 500,
    eliminated: false,
    inMatch: false,
    isBot: true,
  };
}

export function createTournament(players) {
  return {
    players: players.map((p) => ({ ...p, eliminated: false, inMatch: false })),
    matches: [],
    phase: 'pairing',
    round: 1,
    currentSeries: null,
    currentGame: null,
    seriesQueue: [],
    seriesIndex: 0,
    completedSeries: [],
    champion: null,
    runnerUp: null,
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function startRound(tournament) {
  const active = tournament.players.filter((p) => !p.eliminated && !p.isBot);
  if (active.length <= 1) {
    if (active.length === 1) {
      tournament.champion = active[0];
    }
    tournament.phase = 'finished';
    return null;
  }

  const shuffled = shuffle(active);
  const pairs = [];
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    pairs.push([shuffled[i], shuffled[i + 1]]);
  }
  if (shuffled.length % 2 !== 0) {
    const bot = createBotPlayer();
    tournament.players.push(bot);
    pairs.push([shuffled[shuffled.length - 1], bot]);
  }

  tournament.seriesQueue = pairs;
  tournament.seriesIndex = 0;

  return { round: tournament.round, pairs: pairs.length };
}

export function createGameForSeries(tournament, series, gameType = 'tictactoe') {
  const p1 = tournament.players.find((p) => p.id === series.player1.id);
  const p2 = tournament.players.find((p) => p.id === series.player2.id);
  if (!p1 || !p2) return null;

  p1.inMatch = true;
  p2.inMatch = true;

  const game = {
    id: ++matchIdCounter,
    type: gameType,
    player1: { id: p1.id, name: p1.name, avatar: p1.avatar },
    player2: { id: p2.id, name: p2.name, avatar: p2.avatar },
    seriesId: series.id,
    gameIndex: series.games.length,
    round: tournament.round,
    status: 'playing',
    winner: null,
  };

  if (gameType === 'minefinder') {
    game.board = createMineBoardData(10, 10, 16);
    game.currentTurn = p1.id;
    game.scores = { [p1.id]: 0, [p2.id]: 0 };
    game.turnScores = { [p1.id]: 0, [p2.id]: 0 };
    game.playerTurns = { [p1.id]: 0, [p2.id]: 0 };
    game.turnIndex = 0;
    game.lastOpponentScore = 0;
    game.moves = [];
  } else if (gameType === 'penalty') {
    game.penalty = createPenaltyState();
    game.penalty.currentKicker = p1.id;
    game.penalty.scores = { [p1.id]: 0, [p2.id]: 0 };
    game.scores = { [p1.id]: 0, [p2.id]: 0 };
    game.currentTurn = p1.id;
  } else {
    game.board = Array(9).fill(null);
    game.currentTurn = p1.id;
    game.moves = [];
  }

  tournament.matches.push(game);
  series.games.push(game);
  tournament.currentGame = game;
  return game;
}

export function finalizeSeries(tournament, series) {
  let seriesWinnerId;
  if (series.p1wins > series.p2wins) {
    seriesWinnerId = series.player1.id;
  } else if (series.p2wins > series.p1wins) {
    seriesWinnerId = series.player2.id;
  } else {
    const tp1 = tournament.players.find((p) => p.id === series.player1.id);
    const tp2 = tournament.players.find((p) => p.id === series.player2.id);
    seriesWinnerId = (tp1.coins || 0) >= (tp2.coins || 0) ? series.player1.id : series.player2.id;
  }

  series.winner = seriesWinnerId;
  series.status = 'finished';

  const p1 = tournament.players.find((p) => p.id === series.player1.id);
  const p2 = tournament.players.find((p) => p.id === series.player2.id);
  if (p1) p1.inMatch = false;
  if (p2) p2.inMatch = false;

  const seriesLoserId = series.player1.id === seriesWinnerId ? series.player2.id : series.player1.id;
  const loser = tournament.players.find((p) => p.id === seriesLoserId);
  if (loser) loser.eliminated = true;

  const winner = tournament.players.find((p) => p.id === seriesWinnerId);

  tournament.currentGame = null;
  tournament.completedSeries.push({
    round: tournament.round,
    player1: { id: series.player1.id, name: series.player1.name, avatar: series.player1.avatar },
    player2: { id: series.player2.id, name: series.player2.name, avatar: series.player2.avatar },
    p1wins: series.p1wins,
    p2wins: series.p2wins,
    winnerId: seriesWinnerId,
    seriesId: series.id,
  });
  tournament.seriesIndex++;

  return { winner, loserId: seriesLoserId };
}

export function checkRoundComplete(tournament) {
  if (tournament.seriesIndex >= tournament.seriesQueue.length) {
    const remaining = tournament.players.filter((p) => !p.eliminated);
    tournament.currentSeries = null;

    if (remaining.length <= 1) {
      if (remaining.length === 1) tournament.champion = remaining[0];
      tournament.phase = 'finished';
      return { finished: true };
    }

    return { advance: true };
  }
  return { moreSeries: true };
}

export function getRunnerUp(tournament) {
  if (!tournament.players) return null;
  let runnerUp = null;
  let runnerUpRound = -1;
  const matches = tournament.matches || [];
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    if (m.round === tournament.round && m.winner) {
      const loserId = m.player1.id === m.winner ? m.player2.id : m.player1.id;
      const lp = tournament.players.find((p) => p.id === loserId);
      if (lp && !lp.eliminated) {
        return lp;
      }
    }
  }
  return runnerUp;
}

export function addCoins(tournament, playerId, amount) {
  const player = tournament.players.find((p) => p.id === playerId);
  if (player) player.coins = Math.max(0, (player.coins || 0) + amount);
}

export function penalizeDraw(tournament, p1Id, p2Id) {
  const a = tournament.players.find((p) => p.id === p1Id);
  const b = tournament.players.find((p) => p.id === p2Id);
  if (a) a.coins = Math.max(0, (a.coins || 0) - 100);
  if (b) b.coins = Math.max(0, (b.coins || 0) - 100);
}

export function getRoundResults(tournament, round) {
  const series = tournament.completedSeries.filter(s => s.round === round);
  const participants = new Set();
  for (const s of series) {
    participants.add(s.player1.id);
    participants.add(s.player2.id);
  }
  const pairs = tournament.seriesQueue.map(pair => {
    const p1 = pair[0];
    const p2 = pair[1];
    if (!p1 || !p2) {
      return { player1: p1 || null, player2: null, p1wins: 0, p2wins: 0, winnerId: p1 ? p1.id : null, bye: true };
    }
    const found = series.find(s =>
      (s.player1.id === p1.id && s.player2.id === p2.id) ||
      (s.player1.id === p2.id && s.player2.id === p1.id)
    );
    return found || { player1: p1, player2: p2, p1wins: 0, p2wins: 0, winnerId: null };
  });
  const advanced = tournament.players.filter(p => !p.eliminated);
  return { round, pairs, advanced };
}

export function getMostCoinsPlayer(tournament) {
  if (!tournament || !tournament.players || tournament.players.length === 0) return null;
  return [...tournament.players].sort((a, b) => (b.coins || 0) - (a.coins || 0))[0];
}
