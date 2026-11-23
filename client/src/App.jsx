import { useState, useEffect, useCallback, useRef } from 'react';
import { socket } from './socket';
import Lobby from './components/Lobby';
import WaitingRoom from './components/WaitingRoom';
import GameBoard from './components/GameBoard';
import MineBoard from './components/MineBoard';
import PenaltyBoard from './components/PenaltyBoard';
import PlatformerBoard from './components/PlatformerBoard';
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

function getPersistentId() {
  let id = localStorage.getItem('ttt-player-id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('ttt-player-id', id);
  }
  return id;
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
  const transitionTimerRef = useRef(null);
  const trainingWantedRef = useRef(false);
  const [timer, setTimer] = useState(null);
  const [theme, setTheme] = useState(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const roomsConnectPending = useRef(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStarting, setTrainingStarting] = useState(false);
  const [winner, setWinner] = useState(null);
  const [bettingMatch, setBettingMatch] = useState(null);
  const [bettingPlayer1, setBettingPlayer1] = useState(null);
  const [bettingPlayer2, setBettingPlayer2] = useState(null);
  const [bettingEndAt, setBettingEndAt] = useState(0);
  const [bets, setBets] = useState({});
  const [abandonToast, setAbandonToast] = useState(null);
  const [showEndMatchConfirm, setShowEndMatchConfirm] = useState(false);
  const [roundResults, setRoundResults] = useState(null);
  const [gameType, setGameType] = useState('tictactoe');
  const [mineScores, setMineScores] = useState(null);
  const [mineHitIndex, setMineHitIndex] = useState(-1);
  const [safePressIndex, setSafePressIndex] = useState(-1);
  const [boardVersion, setBoardVersion] = useState(0);
  const [mineHitLock, setMineHitLock] = useState(false);
  const [penaltyLastResult, setPenaltyLastResult] = useState(null);
  const [penaltyPhase, setPenaltyPhase] = useState('kicking');
  const [penaltyRound, setPenaltyRound] = useState(0);
  const [penaltyKickIndex, setPenaltyKickIndex] = useState(0);
  const [platformerState, setPlatformerState] = useState(null);
  const [platformerFinished, setPlatformerFinished] = useState(false);
  const [platformerResults, setPlatformerResults] = useState(null);
  const [platformerLevel, setPlatformerLevel] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      socket.disconnect();
    });
  }, []);

  // Auto-rejoin on mount if we have a saved session
  useEffect(() => {
    const savedRoomId = localStorage.getItem('ttt-room-id');
    const persistentId = getPersistentId();
    if (savedRoomId && persistentId) {
      setJoining(true);
      if (!socket.connected) {
        socket.once('connect_error', () => { setJoining(false); setScreen('lobby'); });
        socket.connect();
      }
    }
  }, []);

  useEffect(() => {
    socket.on('room-update', (data) => {
      setPlayers(data.players);
      if (data.tournament) setTournament(data.tournament);
      if (data.gameType) setGameType(data.gameType);
      animateIn();
    });

    socket.on('rooms-update', (list) => {
      setAvailableRooms(Array.isArray(list) ? list : []);
    });

    socket.on('connect', () => {
      const savedRoomId = localStorage.getItem('ttt-room-id');
      const persistentId = getPersistentId();
      if (savedRoomId && persistentId) {
        socket.emit('rejoin-room', { roomId: savedRoomId, persistentId }, (res) => {
          setJoining(false);
          if (res.success) {
            setPlayerId(res.playerId);
            setRoomId(res.roomId);
            setPlayers(res.players || []);
            setTournament(res.tournament);
            setGameType(res.gameType || 'tictactoe');
            if (res.currentMatch) {
              setCurrentMatch(res.currentMatch);
              // ... platformer/minefinder state reset handled inline below
              if (res.currentMatch.type === 'platformer') {
                setPlatformerState(null);
                setPlatformerFinished(false);
                setPlatformerResults(null);
                setPlatformerLevel(res.currentMatch.platformerLevel || null);
              } else if (res.currentMatch.type === 'minefinder') {
                setMineScores(res.currentMatch.scores || null);
                setMineHitIndex(-1);
                setMineHitLock(false);
              }
              setBoardVersion(0);
              transitionTo('game');
            } else if (res.currentSeries?.status === 'betting') {
              setBettingMatch(res.currentSeries.id);
              setBettingPlayer1(res.currentSeries.player1);
              setBettingPlayer2(res.currentSeries.player2);
              setBettingEndAt(res.bettingEndAt || 0);
              setBets(res.bets || {});
              setMessage(res.tournament ? `Round ${res.tournament.round} Betting` : 'Betting open!');
              transitionTo('betting');
            } else if (res.tournament?.champion) {
              setChampion(res.tournament.champion);
              setTournament(prev => ({
                ...prev,
                champion: res.tournament.champion,
                coChampion: res.tournament.coChampion,
                players: res.players || prev.players,
              }));
              transitionTo('champion');
            } else {
              setScreen('waiting');
              animateIn();
            }
          } else {
            localStorage.removeItem('ttt-room-id');
            setError(res.error || 'Session expired');
            setScreen('lobby');
          }
        });
      }
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
      setIsTraining(false);
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
      if (data.match.type === 'platformer') {
        setPlatformerState(null);
        setPlatformerFinished(false);
        setPlatformerResults(null);
        setPlatformerLevel(data.platformerLevel || null);
      }
      setBoardVersion(0);
      transitionTo('game');
      setMessage('');
      setTimeout(() => playMatchStartJingle(), 400);
    });

    socket.on('training-start', (data) => {
      if (!trainingWantedRef.current) return;
      setTrainingStarting(false);
      setIsTraining(true);
      setError('');
      setPlayerId(data.player.id);
      setPlayerName(data.player.name);
      setCurrentMatch(data.match);
      setPlatformerLevel(data.level);
      setPlatformerState(null);
      setPlatformerFinished(false);
      setPlatformerResults(null);
      setGameType('platformer');
      setRoomId(null);
      setPlayers([]);
      setTournament(null);
      setWinner(null);
      setMessage('');
      setBoardVersion(0);
      transitionTo('game');
      setTimeout(() => playMatchStartJingle(), 400);
    });

    socket.on('training-end', (data) => {
      if (!trainingWantedRef.current) return;
      setPlatformerFinished(true);
      if (data?.results) setPlatformerResults(data.results);
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

    socket.on('penalty-result', (data) => {
      setCurrentMatch((prev) => {
        if (!prev || prev.id !== data.matchId) return prev;
        return { ...prev, penalty: { ...prev.penalty, lastResult: data.result, phase: data.phase, round: data.round } };
      });
      if (data.scores) setMineScores(data.scores);
      setPenaltyLastResult(data.result);
      setPenaltyPhase(data.phase);
      setPenaltyRound(data.round);
      if (data.result?.isGoal) {
        playSafePressSound();
        setTimeout(() => playSafePressSound(), 200);
      } else {
        playExplosionSound();
      }
    });

    socket.on('penalty-next', (data) => {
      setCurrentMatch((prev) => {
        if (!prev || prev.id !== data.matchId) return prev;
        return { ...prev, currentTurn: data.currentKicker };
      });
      setPenaltyLastResult(null);
      setPenaltyKickIndex(k => k + 1);
    });

    socket.on('penalty-waiting', () => {
      // choice submitted, waiting for opponent
    });

    socket.on('timer-update', (data) => {
      setTimer(data);
    });

    socket.on('platformer-state', (data) => {
      setPlatformerState(data);
      if (data.finished) setPlatformerFinished(true);
    });

    socket.on('match-result', (data) => {
      setCurrentMatch(data.match);
      setTournament(data.tournament);
      if (data.platformerResults) {
        setPlatformerResults(data.platformerResults);
        setPlatformerFinished(true);
      }
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
        bestBettor: data.bestBettor,
        champion: data.champion,
        coChampion: data.coChampion,
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
      if (data.players) setPlayers(data.players);
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
        if (data.isDraw) {
          setMessage(`Series draw! ${data.p1wins} - ${data.p2wins}`);
        } else {
          const winner = prev.find(p => p.id === data.winner?.id);
          const name = winner?.name || data.winner?.name || 'Someone';
          setMessage(`${name} wins the series ${data.p1wins} - ${data.p2wins}!`);
        }
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
      setAbandonToast({ playerName: data.playerName, playerId: data.playerId, avatar: data.avatar || 'mario' });
      import('./utils/marioMusic').then(({ playMarioDeathSound }) => playMarioDeathSound());
      setTimeout(() => setAbandonToast(null), 6000);
    });

    return () => {
      socket.off('room-update');
      socket.off('rooms-update');
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
      socket.off('penalty-result');
      socket.off('penalty-next');
      socket.off('penalty-waiting');
      socket.off('player-abandoned');
      socket.off('platformer-state');
      socket.off('training-start');
      socket.off('training-end');
    };
  }, []);

  function transitionTo(newScreen) {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setScreenTransition('fade-out');
    transitionTimerRef.current = setTimeout(() => {
      transitionTimerRef.current = null;
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
    const persistentId = getPersistentId();
    setPlayerName(name);
    setRoomId(room);
    setJoining(true);
    setError('');

    const doEmit = () => {
      socket.emit('join-room', { roomId: room, playerName: name, avatar, persistentId }, (res) => {
        setJoining(false);
        if (res.success) {
          setPlayerId(res.playerId);
          localStorage.setItem('ttt-room-id', room);
          localStorage.setItem('ttt-player-name', name);
          if (res.reconnected) {
            setPlayers(res.players || []);
            setTournament(res.tournament);
            setGameType(res.gameType || 'tictactoe');
            if (res.currentMatch) {
              setCurrentMatch(res.currentMatch);
              if (res.currentMatch.type === 'platformer') {
                setPlatformerState(null);
                setPlatformerFinished(false);
                setPlatformerResults(null);
                setPlatformerLevel(res.currentMatch.platformerLevel || null);
              } else if (res.currentMatch.type === 'minefinder') {
                setMineScores(res.currentMatch.scores || null);
                setMineHitIndex(-1);
                setMineHitLock(false);
              }
              setBoardVersion(0);
              transitionTo('game');
            } else if (res.currentSeries?.status === 'betting') {
              setBettingMatch(res.currentSeries.id);
              setBettingPlayer1(res.currentSeries.player1);
              setBettingPlayer2(res.currentSeries.player2);
              setBettingEndAt(res.bettingEndAt || 0);
              setBets(res.bets || {});
              setMessage(res.tournament ? `Round ${res.tournament.round} Betting` : 'Betting open!');
              transitionTo('betting');
            } else {
              setScreen('waiting');
              animateIn();
            }
          } else {
            setScreen('waiting');
          }
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

  const requestRooms = useCallback(() => {
    socket.emit('list-rooms', (res) => {
      if (res && Array.isArray(res.rooms)) setAvailableRooms(res.rooms);
    });
  }, []);

  const refreshRooms = useCallback(() => {
    if (socket.connected) {
      requestRooms();
      return;
    }
    if (roomsConnectPending.current) return;
    roomsConnectPending.current = true;
    const onConnect = () => {
      roomsConnectPending.current = false;
      socket.off('connect_error', onError);
      requestRooms();
    };
    const onError = () => {
      roomsConnectPending.current = false;
    };
    socket.once('connect', onConnect);
    socket.once('connect_error', onError);
    socket.connect();
  }, [requestRooms]);

  const handleStartTraining = useCallback((name, avatar, startLevel) => {
    const persistentId = getPersistentId();
    const playerName = (name || 'Player').trim().slice(0, 20) || 'Player';
    trainingWantedRef.current = true;
    setTrainingStarting(true);
    setError('');
    const doEmit = () => {
      if (!trainingWantedRef.current) return;
      socket.emit('start-training', {
        playerName,
        avatar: avatar || 'plumber-01',
        persistentId,
        startLevel: startLevel || 'grass',
      });
    };
    if (socket.connected) {
      doEmit();
    } else {
      socket.once('connect', doEmit);
      socket.once('connect_error', (err) => {
        setTrainingStarting(false);
        setError(`Connection failed: ${err.message}`);
      });
      socket.connect();
    }
  }, []);

  const handleExitTraining = useCallback(() => {
    trainingWantedRef.current = false;
    socket.emit('stop-training');
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    setIsTraining(false);
    setTrainingStarting(false);
    setCurrentMatch(null);
    setPlatformerLevel(null);
    setPlatformerState(null);
    setPlatformerFinished(false);
    setPlatformerResults(null);
    setPlayerId(null);
    setPlayers([]);
    setRoomId(null);
    setGameType('tictactoe');
    setMessage('');
    setError('');
    setScreen('lobby');
    animateIn();
  }, []);

  const handleRestartTraining = useCallback(() => {
    if (!currentMatch?.player1) return;
    handleStartTraining(
      currentMatch.player1.name,
      currentMatch.player1.avatar,
      platformerLevel?.levelId || 'grass'
    );
  }, [currentMatch, platformerLevel, handleStartTraining]);

  const handleStartTournament = useCallback((selectedGameType) => {
    socket.emit('start-tournament', { gameType: selectedGameType || 'tictactoe' });
  }, []);

  const handleMakeMove = useCallback((cellIndex) => {
    if (currentMatch) {
      socket.emit('make-move', { matchId: currentMatch.id, cellIndex });
    }
  }, [currentMatch]);

  const handlePenaltyChoice = useCallback((direction) => {
    if (currentMatch) {
      socket.emit('penalty-choice', { matchId: currentMatch.id, direction });
    }
  }, [currentMatch]);

  const handlePlaceBet = useCallback((matchId, amount, on) => {
    socket.emit('place-bet', { matchId, amount, on });
  }, []);

  const handleEndMatch = useCallback(() => {
    socket.emit('host-end-match', { confirm: true });
    setShowEndMatchConfirm(false);
  }, []);

  const handleLeaveRoom = useCallback(() => {
    socket.emit('leave-room');
    localStorage.removeItem('ttt-room-id');
    localStorage.removeItem('ttt-player-name');
    setPlayerId(null);
    setRoomId(null);
    setPlayers([]);
    setTournament(null);
    setChampion(null);
    setCurrentMatch(null);
    setMessage('');
    setTimer(null);
    setTheme(null);
    setBettingMatch(null);
    setBettingPlayer1(null);
    setBettingPlayer2(null);
    setBets({});
    setRoundResults(null);
    setScreen('lobby');
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
        <h1 className="game-title">
          <span className="title-word title-tic">Tic</span>
          <span className="title-word title-tac">Tac</span>
          <span className="title-word title-tournament">Tournament</span>
        </h1>
        <p className="title-sub">Mario Edition</p>
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
        {screen === 'lobby' && <Lobby onJoin={handleJoinRoom} joining={joining} error={error} rooms={availableRooms} onRefreshRooms={refreshRooms} onTrain={handleStartTraining} trainingStarting={trainingStarting} />}

        {screen === 'waiting' && (
          <WaitingRoom
            players={players}
            playerId={playerId}
            tournament={tournament}
            onStart={handleStartTournament}
            onLeave={handleLeaveRoom}
          />
        )}

        {screen === 'game' && currentMatch && (
          <div className="game-container">
            {gameType !== 'platformer' && (
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
            )}
            {gameType !== 'platformer' && !isMyTurnReady && currentMatch.currentTurn === playerId && (
              <div className="cooldown-bar">
                <div className="cooldown-fill" style={{ animationDuration: `${Math.max(0, currentMatch.moveCooldownUntil - Date.now())}ms` }} />
              </div>
            )}
            {(gameType === 'penalty') ? (
              <PenaltyBoard
                player1={currentMatch.player1}
                player2={currentMatch.player2}
                currentTurn={currentMatch.currentTurn}
                myId={playerId}
                isMyTurn={currentMatch.status === 'playing'}
                disabled={currentMatch.status !== 'playing'}
                onChoice={handlePenaltyChoice}
                lastResult={penaltyLastResult}
                showWait={!isMyTurnReady && currentMatch.currentTurn === playerId}
                scores={mineScores}
                round={penaltyRound}
                phase={penaltyPhase}
                kickIndex={penaltyKickIndex}
              />
            ) : (gameType === 'platformer') ? (
              <PlatformerBoard
                key={`${isTraining ? 'train' : 'match'}-${currentMatch.id}`}
                platformerState={platformerState}
                platformerLevel={platformerLevel}
                player1={currentMatch.player1}
                player2={currentMatch.player2}
                myId={playerId}
                finished={platformerFinished}
                results={platformerResults}
                training={isTraining}
                onExitTraining={handleExitTraining}
                onRestartTraining={handleRestartTraining}
              />
            ) : (gameType === 'minefinder' && currentMatch.type !== 'tictactoe') ? (
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
            {gameType !== 'platformer' && (
            <div className="players-sidebar">
              {players.find(p => p.id === playerId)?.isHost && currentMatch && players.some(p => !p.connected && (p.id === currentMatch.player1.id || p.id === currentMatch.player2.id)) && (
                <>
                  <button className="end-match-btn" onClick={() => setShowEndMatchConfirm(true)}>End Match</button>
                  {showEndMatchConfirm && (
                    <div className="confirm-overlay" onClick={() => setShowEndMatchConfirm(false)}>
                      <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
                        <h3>End Match?</h3>
                        <p>A player has disconnected. Ending the match will award the win to the remaining player.</p>
                        <div className="confirm-actions">
                          <button className="confirm-cancel" onClick={() => setShowEndMatchConfirm(false)}>Cancel</button>
                          <button className="confirm-yes" onClick={handleEndMatch}>Yes, End Match</button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
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
            )}
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
            bestBettor={tournament?.bestBettor}
            coChampion={tournament?.coChampion}
          />
        )}

        {abandonToast && (
          <div className="abandon-toast">
            <span className="abandon-avatar"><AvatarDisplay character={abandonToast.avatar} size={36} /></span>
            <span className="abandon-icon">😢</span>
            <span className="abandon-text">{abandonToast.playerName} abandoned the competition</span>
          </div>
        )}
      </main>
    </div>
  );
}
