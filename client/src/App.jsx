import { useState, useEffect, useCallback } from 'react';
import { socket } from './socket';
import Lobby from './components/Lobby';
import WaitingRoom from './components/WaitingRoom';
import GameBoard from './components/GameBoard';
import ChampionScreen from './components/ChampionScreen';
import TimerClock from './components/TimerClock';
import './App.css';

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

  useEffect(() => {
    socket.on('room-update', (data) => {
      setPlayers(data.players);
      if (data.tournament) setTournament(data.tournament);
      animateIn();
    });

    socket.on('tournament-start', (data) => {
      setTournament(data.tournament);
      transitionTo('waiting');
      setMessage('Tournament started!');
    });

    socket.on('match-start', (data) => {
      setWinCombo(null);
      setCurrentMatch(data.match);
      setTheme(data.match.theme || null);
      setTimer(null);
      transitionTo('game');
      setMessage('');
    });

    socket.on('board-update', (data) => {
      setCurrentMatch((prev) => {
        if (!prev || prev.id !== data.matchId) return prev;
        return { ...prev, board: data.board, currentTurn: data.currentTurn };
      });
    });

    socket.on('timer-update', (data) => {
      setTimer(data);
    });

    socket.on('match-result', (data) => {
      setCurrentMatch(data.match);
      setTournament(data.tournament);
      if (data.winCombo) setWinCombo(data.winCombo);
      if (data.winner) {
        setMessage(`${data.winner.name} wins!`);
      } else if (data.draw) {
        setMessage("It's a draw!");
      }
    });

    socket.on('tournament-end', (data) => {
      setChampion(data.champion);
      transitionTo('champion');
    });

    socket.on('tournament-cancelled', (data) => {
      setMessage(data.reason);
      setTimeout(() => {
        setTournament(null);
        setCurrentMatch(null);
      }, 500);
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

  const handleJoinRoom = useCallback((name, room) => {
    setPlayerName(name);
    setRoomId(room);
    setJoining(true);
    setError('');

    const doEmit = () => {
      socket.emit('join-room', { roomId: room, playerName: name }, (res) => {
        setJoining(false);
        if (res.success) {
          setPlayerId(res.playerId);
          setScreen('waiting');
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

  const handleStartTournament = useCallback(() => {
    socket.emit('start-tournament');
  }, []);

  const handleMakeMove = useCallback((cellIndex) => {
    if (currentMatch) {
      socket.emit('make-move', { matchId: currentMatch.id, cellIndex });
    }
  }, [currentMatch]);

  const handlePlayAgain = useCallback(() => {
    setChampion(null);
    setTournament(null);
    setCurrentMatch(null);
    setMessage('');
    setTimer(null);
    setTheme(null);
    setScreen('waiting');
  }, []);

  const isMyTurn = currentMatch?.currentTurn === playerId;

  const themeVars = theme ? {
    '--color-x': theme.x,
    '--color-o': theme.o,
    '--color-glow': theme.glow,
    '--bg-1': theme.bg1,
    '--bg-2': theme.bg2,
  } : {};

  return (
    <div className="app" style={themeVars}>
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
                <span className={`player-tag ${currentMatch.currentTurn === currentMatch.player1.id ? 'active-turn' : ''} ${currentMatch.player1.id === playerId ? 'is-me' : ''}`}>
                  <span className="player-tag-avatar">{currentMatch.player1.avatar}</span>
                  <span className="player-tag-name">{currentMatch.player1.name}</span>
                  <span className="player-tag-mark mark-x">X</span>
                </span>
                <span className="vs">⚔️</span>
                <span className={`player-tag ${currentMatch.currentTurn === currentMatch.player2.id ? 'active-turn' : ''} ${currentMatch.player2.id === playerId ? 'is-me' : ''}`}>
                  <span className="player-tag-avatar">{currentMatch.player2.avatar}</span>
                  <span className="player-tag-name">{currentMatch.player2.name}</span>
                  <span className="player-tag-mark mark-o">O</span>
                </span>
                <TimerClock
                  remaining={timer ? timer.p2 : null}
                  isActive={currentMatch.currentTurn === currentMatch.player2.id}
                  side="right"
                />
              </div>
              {message && <div className="message">{message}</div>}
            </div>
            <GameBoard
              board={currentMatch.board}
              onCellClick={handleMakeMove}
              disabled={!isMyTurn || currentMatch.status !== 'playing'}
              myMark={currentMatch.player1.id === playerId ? 'X' : 'O'}
              isMyTurn={isMyTurn}
              winCombo={winCombo}
            />
            <div className="players-sidebar">
              <h3>Players <span className="player-count">{players.filter(p => p.connected).length}/{players.length}</span></h3>
              <ul className="player-list">
                {players.map((p, i) => (
                  <li
                    key={p.id}
                    className={`player-item ${!p.connected ? 'disconnected' : ''} ${p.inMatch ? 'in-match' : ''} ${p.eliminated ? 'eliminated' : ''}`}
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <span className="player-avatar">{p.avatar}</span>
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

        {screen === 'champion' && champion && (
          <ChampionScreen champion={champion} onPlayAgain={handlePlayAgain} />
        )}
      </main>
    </div>
  );
}
