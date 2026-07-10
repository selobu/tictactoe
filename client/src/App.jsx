import { useState, useEffect, useCallback } from 'react';
import { socket } from './socket';
import Lobby from './components/Lobby';
import WaitingRoom from './components/WaitingRoom';
import GameBoard from './components/GameBoard';
import MineBoard from './components/MineBoard';
import ChampionScreen from './components/ChampionScreen';
import RoundResults from './components/RoundResults';
import TimerClock from './components/TimerClock';
import BettingPhase from './components/BettingPhase';
import AvatarDisplay from './components/AvatarDisplay';
import MarioBackground from './components/MarioBackground';
import { playMarioTheme, playMatchStartJingle, playMoveSound, playSafePressSound, playExplosionSound } from './utils/marioMusic';
import './App.css';

function findPlayer(players, id) {
  return players?.find(p => p.id === id);
}

export default function App() {
  const [screen, setScreen] = useState('lobby');
  const [playerId, setPlayerId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [champion, setChampion] = useState(null);
  const [message, setMessage] = useState('');
  const [winCombo, setWinCombo] = useState(null);
  const [screenTransition, setScreenTransition] = useState('');
  const [timer, setTimer] = useState(null);
  const [theme, setTheme] = useState(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [winner, setWinner] = useState(null);
  const [bettingMatch, setBettingMatch] = useState(null);
  const [bettingPlayer1, setBettingPlayer1] = useState(null);
  const [bettingPlayer2, setBettingPlayer2] = useState(null);
  const [bettingEndAt, setBettingEndAt] = useState(0);
  const [bets, setBets] = useState({});
  const [abandonToast, setAbandonToast] = useState(null);
  const [roundResults, setRoundResults] = useState(null);
  const [gameType, setGameType] = useState('tictactoe');
  const [mineScores, setMineScores] = useState(null);
  const [mineHitIndex, setMineHitIndex] = useState(-1);
  const [safePressIndex, setSafePressIndex] = useState(-1);
  const [boardVersion, setBoardVersion] = useState(0);
  const [mineHitLock, setMineHitLock] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      socket.emit('leave-room');
      socket.disconnect();
    });
  }, []);

  useEffect(() => {
    socket.on('room-update', (data) => {
      setPlayers(data.players);
      if (data.tournament) setTournament(data.tournament);
      if (data.gameType) setGameType(data.gameType);
      animateIn();
    });

    socket.on('tournament-start', (data) => {
      setTournament(data.tournament);
      setGameType(data.gameType || 'tictactoe');
      setMineScores(null);
      setMineHitIndex(-1);
      transitionTo('waiting');
      setMessage('Tournament started!');
    });

    socket.on('match-start', (data) => {
      setWinCombo(null);
      setWinner(null);
      setAbandonToast(null);
      setCurrentMatch(data.match);
      setGameType(data.match.type || 'tictactoe');
      if (data.match.type === 'minefinder') {
        setMineScores(data.match.scores || null);
        setMineHitIndex(-1);
        setMineHitLock(false);
      } else {
        setMineScores(null);
        setMineHitIndex(-1);
      }
      setBoardVersion(0);
      transitionTo('game');
      setMessage('');
      setTimeout(() => playMatchStartJingle(), 400);
    });

    socket.on('board-update', (data) => {
      setCurrentMatch((prev) => {
        if (!prev || prev.id !== data.matchId) return prev;
        if (data.turnSwitch) {
          return { ...prev, currentTurn: data.currentTurn, moveCooldownUntil: data.moveCooldownUntil };
        }
        return { ...prev, board: data.board, currentTurn: data.currentTurn, moveCooldownUntil: data.moveCooldownUntil };
      });
      playMoveSound();
    });

    socket.on('mine-board-update', (data) => {
      if (data.scores) setMineScores(data.scores);
      setCurrentMatch((prev) => {
        if (!prev || prev.id !== data.matchId) return prev;
        return { ...prev, board: data.board, currentTurn: data.currentTurn, moveCooldownUntil: data.moveCooldownUntil };
      });
      if (data.cellIndex >= 0) {
        setSafePressIndex(data.cellIndex);
        setTimeout(() => setSafePressIndex(-1), 400);
        playSafePressSound();
      }
    });

    socket.on('mine-hit', (data) => {
      setMineHitLock(true);
      if (data.scores) setMineScores(data.scores);
      setCurrentMatch((prev) => {
        if (!prev || prev.id !== data.matchId) return prev;
        return { ...prev, board: data.board, currentTurn: data.currentTurn, moveCooldownUntil: data.moveCooldownUntil };
      });
      if (data.cellIndex >= 0) {
        setMineHitIndex(data.cellIndex);
        setTimeout(() => setMineHitIndex(-1), 2500);
        playExplosionSound();
      }
    });

    socket.on('mine-turn-start', (data) => {
      setCurrentMatch((prev) => {
        if (!prev || prev.id !== data.matchId) return prev;
        return { ...prev, board: data.board, currentTurn: data.currentTurn, moveCooldownUntil: data.moveCooldownUntil };
      });
      if (data.scores) setMineScores(data.scores);
      setMineHitIndex(-1);
      setMineHitLock(false);
      setSafePressIndex(-1);
      setBoardVersion(v => v + 1);
    });

    socket.on('timer-update', (data) => {
      setTimer(data);
    });

    socket.on('match-result', (data) => {
      setCurrentMatch(data.match);
      setTournament(data.tournament);
      if (data.winCombo) setWinCombo(data.winCombo);
      if (data.winner) {
        setWinner(data.winner);
        setMessage(`${data.winner.name} wins!`);
      } else if (data.draw) {
        setWinner(null);
        setMessage("It's a draw!");
      }
    });

    socket.on('tournament-end', (data) => {
      setChampion(data.champion);
      setTournament(prev => ({
        ...prev,
        runnerUp: data.runnerUp,
        mostCoins: data.mostCoins,
        champion: data.champion,
      }));
      transitionTo('champion');
    });

    socket.on('tournament-cancelled', (data) => {
      setMessage(data.reason);
      setTimeout(() => {
        setTournament(null);
        setCurrentMatch(null);
      }, 500);
    });

    socket.on('betting-start', (data) => {
      setBettingMatch(data.matchId);
      setBettingPlayer1(data.player1);
      setBettingPlayer2(data.player2);
      setBettingEndAt(data.bettingEndAt);
      setBets({});
      setMessage(data.round ? `Round ${data.round} Betting` : 'Betting open!');
      transitionTo('betting');
    });

    socket.on('bet-update', (data) => {
      setBets((prev) => ({ ...prev, [data.bettorId]: { on: data.on, amount: data.amount } }));
    });

    socket.on('betting-timer', (data) => {
      setBettingEndAt(Date.now() + data.remaining);
    });

    socket.on('betting-finished', (data) => {
      setBets(data.bets);
    });

    socket.on('round-start', (data) => {
      setMessage(data.message || `Round ${data.round} starting!`);
    });

    socket.on('game-end', (data) => {
      setMessage(data.message || 'Next game starting...');
    });

    socket.on('series-result', (data) => {
      setPlayers(prev => {
        const winner = prev.find(p => p.id === data.winner?.id);
        const name = winner?.name || data.winner?.name || 'Someone';
        const score = `${data.p1wins} - ${data.p2wins}`;
        setMessage(`${name} wins the series ${score}!`);
        return prev;
      });
    });

    socket.on('tournament-update', (data) => {
      setTournament(data.tournament);
    });

    socket.on('round-results', (data) => {
      setRoundResults(data);
      transitionTo('round-results');
      setMessage('');
    });

    socket.on('player-abandoned', (data) => {
      setAbandonToast({ playerName: data.playerName, playerId: data.playerId });
      setTimeout(() => setAbandonToast(null), 4000);
    });

    return () => {
      socket.off('room-update');
      socket.off('tournament-start');
      socket.off('match-start');
      socket.off('board-update');
      socket.off('timer-update');
      socket.off('match-result');
      socket.off('tournament-end');
      socket.off('tournament-cancelled');
      socket.off('betting-start');
      socket.off('bet-update');
      socket.off('betting-timer');
      socket.off('betting-finished');
      socket.off('round-start');
      socket.off('game-end');
      socket.off('series-result');
      socket.off('tournament-update');
      socket.off('round-results');
      socket.off('mine-board-update');
      socket.off('mine-hit');
      socket.off('player-abandoned');
    };
  }, []);

  function transitionTo(newScreen) {
    setScreenTransition('fade-out');
    setTimeout(() => {
      setScreen(newScreen);
      setScreenTransition('fade-in');
      setTimeout(() => setScreenTransition(''), 500);
    }, 300);
  }

  function animateIn() {
    setScreenTransition('fade-in');
    setTimeout(() => setScreenTransition(''), 500);
  }

  const handleJoinRoom = useCallback((name, room, avatar) => {
    setPlayerName(name);
    setRoomId(room);
    setJoining(true);
    setError('');

    const doEmit = () => {
      socket.emit('join-room', { roomId: room, playerName: name, avatar }, (res) => {
        setJoining(false);
        if (res.success) {
          setPlayerId(res.playerId);
          setScreen('waiting');
          playMarioTheme();
        } else if (res.error) {
          setError(res.error);
        }
      });
    };

    if (socket.connected) {
      doEmit();
    } else {
      socket.once('connect', doEmit);
      socket.once('connect_error', (err) => {
        setJoining(false);
        setError(`Connection failed: ${err.message}`);
      });
      socket.connect();
    }
  }, []);

  const handleStartTournament = useCallback((selectedGameType) => {
    socket.emit('start-tournament', { gameType: selectedGameType || 'tictactoe' });
  }, []);

  const handleMakeMove = useCallback((cellIndex) => {
    if (currentMatch) {
      socket.emit('make-move', { matchId: currentMatch.id, cellIndex });
    }
  }, [currentMatch]);

  const handlePlaceBet = useCallback((matchId, amount, on) => {
    socket.emit('place-bet', { matchId, amount, on });
  }, []);

  const handlePlayAgain = useCallback(() => {
    socket.emit('new-tournament');
    setChampion(null);
    setTournament(null);
    setRoundResults(null);
    setCurrentMatch(null);
    setMessage('');
    setTimer(null);
    setTheme(null);
    setBettingMatch(null);
    setBettingPlayer1(null);
    setBettingPlayer2(null);
    setBets({});
    setScreen('waiting');
  }, []);

  const isMyTurn = currentMatch?.currentTurn === playerId && (!currentMatch?.moveCooldownUntil || Date.now() >= currentMatch.moveCooldownUntil);
  const [isMyTurnReady, setIsMyTurnReady] = useState(false);

  useEffect(() => {
    if (currentMatch?.moveCooldownUntil && currentMatch.currentTurn === playerId) {
      const remaining = currentMatch.moveCooldownUntil - Date.now();
      if (remaining > 0) {
        const timer = setTimeout(() => setIsMyTurnReady(true), remaining + 50);
        setIsMyTurnReady(false);
        return () => clearTimeout(timer);
      }
    }
    setIsMyTurnReady(true);
  }, [currentMatch?.currentTurn, currentMatch?.moveCooldownUntil, playerId]);

  const themeVars = theme ? {
    '--color-x': theme.x,
    '--color-o': theme.o,
    '--color-glow': theme.glow,
    '--bg-1': theme.bg1,
    '--bg-2': theme.bg2,
  } : {};

  return (
    <div className="app" style={themeVars}>
      <MarioBackground />
      <header className="header">
        <h1>Tic Tac Tournament</h1>
        {roomId && (
          <div className="room-info">
            Room: <code>{roomId}</code>
            <button
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(
                `${window.location.origin}?room=${roomId}`
              )}
            >
              Copy Link
            </button>
          </div>
        )}
      </header>

      <main className={`main ${screenTransition}`}>
        {screen === 'lobby' && <Lobby onJoin={handleJoinRoom} joining={joining} error={error} />}

        {screen === 'waiting' && (
          <WaitingRoom
            players={players}
            playerId={playerId}
            tournament={tournament}
            onStart={handleStartTournament}
          />
        )}

        {screen === 'game' && currentMatch && (
          <div className="game-container">
            <div className="match-info">
              <div className="players-turn">
                <TimerClock
                  remaining={timer ? timer.p1 : null}
                  isActive={currentMatch.currentTurn === currentMatch.player1.id}
                  side="left"
                />
                <span className={`player-tag ${currentMatch.currentTurn === currentMatch.player1.id ? 'active-turn' : ''} ${currentMatch.player1.id === playerId ? 'is-me' : ''} ${winner?.id === currentMatch.player1.id ? 'is-winner' : ''}`}>
                  <span className="player-tag-avatar"><AvatarDisplay character={currentMatch.player1.avatar} size={36} /></span>
                  <span className="player-tag-info">
                    <span className="player-tag-name">{currentMatch.player1.name}</span>
                    <span className="player-tag-label">{currentMatch.player1.id === playerId ? '(you)' : '(opponent)'}</span>
                  </span>
                  {gameType !== 'minefinder' && <span className="player-tag-mark mark-x">X</span>}
                  {winner?.id === currentMatch.player1.id && <span className="grey-cup">🏆</span>}
                </span>
                {!winner && <span className="vs">⚔️</span>}
                {winner && <span className="vs winner-announce">🏆</span>}
                <span className={`player-tag ${currentMatch.currentTurn === currentMatch.player2.id ? 'active-turn' : ''} ${currentMatch.player2.id === playerId ? 'is-me' : ''} ${winner?.id === currentMatch.player2.id ? 'is-winner' : ''}`}>
                  <span className="player-tag-avatar"><AvatarDisplay character={currentMatch.player2.avatar} size={36} /></span>
                  <span className="player-tag-info">
                    <span className="player-tag-name">{currentMatch.player2.name}</span>
                    <span className="player-tag-label">{currentMatch.player2.id === playerId ? '(you)' : '(opponent)'}</span>
                  </span>
                  {gameType !== 'minefinder' && <span className="player-tag-mark mark-o">O</span>}
                  {winner?.id === currentMatch.player2.id && <span className="grey-cup">🏆</span>}
                </span>
                <TimerClock
                  remaining={timer ? timer.p2 : null}
                  isActive={currentMatch.currentTurn === currentMatch.player2.id}
                  side="right"
                />
              </div>
              {message && <div className="message">{message}</div>}
            </div>
            {!isMyTurnReady && currentMatch.currentTurn === playerId && (
              <div className="cooldown-bar">
                <div className="cooldown-fill" style={{ animationDuration: `${Math.max(0, currentMatch.moveCooldownUntil - Date.now())}ms` }} />
              </div>
            )}
            {(gameType === 'minefinder' && currentMatch.type !== 'tictactoe') ? (
              <MineBoard key={`${currentMatch.id}-v${boardVersion}`}
                board={currentMatch.board}
                onCellClick={handleMakeMove}
                disabled={mineHitLock || !isMyTurn || currentMatch.status !== 'playing'}
                isMyTurn={isMyTurn}
                showWait={!isMyTurnReady && currentMatch.currentTurn === playerId}
                player1={currentMatch.player1}
                player2={currentMatch.player2}
                currentTurn={currentMatch.currentTurn}
                myId={playerId}
                scores={mineScores}
                mineHitIndex={mineHitIndex}
                safePressIndex={safePressIndex}
              />
            ) : (
              <GameBoard
                board={currentMatch.board}
                onCellClick={handleMakeMove}
                disabled={!isMyTurn || currentMatch.status !== 'playing'}
                myMark={currentMatch.player1.id === playerId ? 'X' : 'O'}
                isMyTurn={isMyTurn}
                winCombo={winCombo}
                showWait={!isMyTurnReady && currentMatch.currentTurn === playerId}
                player1={currentMatch.player1}
                player2={currentMatch.player2}
                currentTurn={currentMatch.currentTurn}
                myId={playerId}
              />
            )}
            <div className="players-sidebar">
              <h3>Players <span className="player-count">{players.filter(p => p.connected).length}/{players.length}</span></h3>
              <ul className="player-list">
                {players.map((p, i) => (
                  <li
                    key={p.id}
                    className={`player-item ${!p.connected ? 'disconnected' : ''} ${p.inMatch ? 'in-match' : ''} ${p.eliminated ? 'eliminated' : ''}`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <span className="player-avatar"><AvatarDisplay character={p.avatar} size={32} /></span>
                    <span className="player-name">{p.name}</span>
                    <span className="player-coins">{p.coins ?? 0} 🪙</span>
                    <span className="player-status">
                      {!p.connected ? '❌' : p.inMatch ? '🎮' : '✅'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {screen === 'betting' && bettingPlayer1 && bettingPlayer2 && (
          <BettingPhase
            match={{ id: bettingMatch }}
            player1={bettingPlayer1}
            player2={bettingPlayer2}
            playerId={playerId}
            players={players}
            bettingEndAt={bettingEndAt}
            bets={bets}
            onPlaceBet={handlePlaceBet}
            tournament={tournament}
          />
        )}

        {screen === 'round-results' && roundResults && (
          <RoundResults
            round={roundResults.round}
            pairs={roundResults.pairs}
            advanced={roundResults.advanced}
            players={players}
          />
        )}

        {screen === 'champion' && champion && (
          <ChampionScreen
            champion={champion}
            players={tournament?.players || players}
            onPlayAgain={handlePlayAgain}
            runnerUp={tournament?.runnerUp}
            mostCoins={tournament?.mostCoins}
          />
        )}

        {abandonToast && (
          <div className="abandon-toast">
            <span className="abandon-icon">🚪</span>
            <span className="abandon-text">{abandonToast.playerName} abandoned the competition</span>
          </div>
        )}
      </main>
    </div>
  );
}
