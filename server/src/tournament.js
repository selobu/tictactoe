let matchIdCounter = 0;

function pairKey(a, b) {
  return a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`;
}

export function createTournament(players) {
  return {
    players: players.map((p) => ({ ...p, coins: 0, bracket: 'winners' })),
    matches: [],
    playedPairs: new Set(),
    currentMatch: null,
    champion: null,
    phase: 'pairing',
    round: 1,
  };
}

export function getNextMatch(tournament) {
  const available = tournament.players.filter(
    (p) => !p.eliminated && !p.inMatch
  );
  if (available.length < 2) {
    if (available.length === 1) {
      tournament.champion = available[0];
      tournament.phase = 'finished';
    }
    return null;
  }

  const shuffled = [...available].sort(() => Math.random() - 0.5);

  let p1, p2;
  const unplayed = [];
  for (let i = 0; i < shuffled.length; i++) {
    for (let j = i + 1; j < shuffled.length; j++) {
      if (!tournament.playedPairs.has(pairKey(shuffled[i], shuffled[j]))) {
        unplayed.push([shuffled[i], shuffled[j]]);
      }
    }
  }

  if (unplayed.length > 0) {
    const pair = unplayed[Math.floor(Math.random() * unplayed.length)];
    p1 = pair[0];
    p2 = pair[1];
  } else {
    p1 = shuffled[0];
    p2 = shuffled[1];
  }

  p1.inMatch = true;
  p2.inMatch = true;

  const match = {
    id: ++matchIdCounter,
    player1: { ...p1 },
    player2: { ...p2 },
    board: Array(9).fill(null),
    currentTurn: p1.id,
    moves: [],
    status: 'playing',
    winner: null,
    round: tournament.round,
  };

  tournament.playedPairs.add(pairKey(p1, p2));
  tournament.currentMatch = match;
  tournament.matches.push(match);
  tournament.phase = 'playing';
  return match;
}

export function applyMatchResult(tournament, winnerId, loserId) {
  const winner = tournament.players.find((p) => p.id === winnerId);
  const loser = tournament.players.find((p) => p.id === loserId);
  if (!winner || !loser) return;

  winner.inMatch = false;
  loser.inMatch = false;
  loser.eliminated = true;

  tournament.currentMatch = null;
  tournament.phase = 'pairing';

  const remaining = tournament.players.filter((p) => !p.eliminated);
  if (remaining.length === 1) {
    tournament.champion = remaining[0];
    tournament.phase = 'finished';
  } else {
    tournament.round++;
  }
}

export function addCoins(tournament, playerId, amount) {
  const player = tournament.players.find((p) => p.id === playerId);
  if (player) player.coins = (player.coins || 0) + amount;
}

export function penalizeDraw(tournament, p1Id, p2Id) {
  const a = tournament.players.find((p) => p.id === p1Id);
  const b = tournament.players.find((p) => p.id === p2Id);
  if (a) a.coins = Math.max(0, (a.coins || 0) - 100);
  if (b) b.coins = Math.max(0, (b.coins || 0) - 100);
}

export function releasePlayers(tournament, p1Id, p2Id) {
  const a = tournament.players.find((p) => p.id === p1Id);
  const b = tournament.players.find((p) => p.id === p2Id);
  if (a) a.inMatch = false;
  if (b) b.inMatch = false;
}
