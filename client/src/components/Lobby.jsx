import { useState, useEffect, useRef } from 'react';
import { AVATARS as CUSTOM_AVATARS } from '../utils/customAvatars';
import AvatarDisplay from './AvatarDisplay';

const ALL_AVATARS = CUSTOM_AVATARS.map((avatar) => ({ key: avatar.id, name: avatar.name }));

const GAME_TYPES = {
  tictactoe: { icon: '❌⭕', name: 'Tic-Tac-Toe' },
  minefinder: { icon: '💣💥', name: 'Mine Finder' },
  penalty: { icon: '⚽🥅', name: 'Penalty Shootout' },
  platformer: { icon: '🏃🍄', name: 'Mario Runner' },
};

const TRAINING_LEVELS = [
  { id: 'grass', label: 'Mushroom Plains' },
  { id: 'cave', label: 'Crystal Caverns' },
  { id: 'sky', label: 'Cloud Kingdom' },
  { id: 'castle', label: 'Celestial Citadel' },
  { id: 'pac', label: 'Neon Labyrinth' },
  { id: 'koopa', label: "Kuppa's Lava Keep" },
  { id: 'water', label: 'Sunken Ruins' },
];

export default function Lobby({ onJoin, joining, error, rooms = [], onRefreshRooms, onTrain, trainingStarting = false }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [hint, setHint] = useState('');
  const [startLevel, setStartLevel] = useState('grass');
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const dragCleanupRef = useRef(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) setRoom(roomParam);
    const savedName = localStorage.getItem('ttt-player-name');
    if (savedName) setName(savedName);
    const savedAvatar = localStorage.getItem('ttt-player-avatar');
    if (savedAvatar !== null) {
      const index = Number(savedAvatar);
      if (Number.isInteger(index) && index >= 0 && index < ALL_AVATARS.length) {
        setSelectedAvatar(index);
      }
    }
  }, []);

  useEffect(() => {
    onRefreshRooms?.();
    const interval = setInterval(() => onRefreshRooms?.(), 4000);
    return () => clearInterval(interval);
  }, [onRefreshRooms]);

  useEffect(() => () => dragCleanupRef.current?.(), []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !room.trim()) return;
    localStorage.setItem('ttt-player-name', name.trim());
    localStorage.setItem('ttt-player-avatar', String(selectedAvatar));
    const chosen = ALL_AVATARS[selectedAvatar] || ALL_AVATARS[0];
    onJoin(name.trim(), room.trim(), chosen.key);
  }

  function generateRoom() {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoom(id);
  }

  function handleGridPointerDown(e) {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const grid = e.currentTarget;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScroll: grid.scrollLeft,
      moved: false,
    };

    const handleMove = (ev) => {
      const drag = dragState.current;
      if (!drag.active) return;
      const dx = ev.clientX - drag.startX;
      if (Math.abs(dx) > 4) drag.moved = true;
      grid.scrollLeft = drag.startScroll - dx;
    };

    const previousUserSelect = document.body.style.userSelect;

    const finishDrag = () => {
      dragState.current.active = false;
      setIsDragging(false);
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
      dragCleanupRef.current = null;
    };

    if (dragCleanupRef.current) dragCleanupRef.current();
    dragCleanupRef.current = finishDrag;
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    setIsDragging(true);
  }

  function suppressClickAfterDrag(e) {
    if (!dragState.current.moved) return;
    dragState.current.moved = false;
    e.preventDefault();
    e.stopPropagation();
  }

  function handleQuickJoin(gameRoom) {
    if (joining || gameRoom.playerCount >= gameRoom.maxPlayers) return;
    if (!name.trim()) {
      setRoom(gameRoom.id);
      setHint('Enter your name above to join this game.');
      nameInputRef.current?.focus();
      return;
    }
    setHint('');
    const chosen = ALL_AVATARS[selectedAvatar] || ALL_AVATARS[0];
    localStorage.setItem('ttt-player-name', name.trim());
    localStorage.setItem('ttt-player-avatar', String(selectedAvatar));
    onJoin(name.trim(), gameRoom.id, chosen.key);
  }

  function handleTraining() {
    if (joining || trainingStarting) return;
    const chosen = ALL_AVATARS[selectedAvatar] || ALL_AVATARS[0];
    const playerName = name.trim() || 'Player';
    localStorage.setItem('ttt-player-name', playerName);
    localStorage.setItem('ttt-player-avatar', String(selectedAvatar));
    setHint('');
    onTrain?.(playerName, chosen.key, startLevel);
  }

  return (
    <div className="lobby">
      <div className="lobby-decoration">
        <span className="deco-x">X</span>
        <span className="deco-o">O</span>
      </div>
      <div className="lobby-card">
        <div className="lobby-icon">🎮</div>
        <h2>Join a Game</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              required
              disabled={joining}
            />
          </div>
          <div className="form-group">
            <label>Pick Your Character</label>
            <div
              className={`avatar-grid ${isDragging ? 'dragging' : ''}`}
              onPointerDown={handleGridPointerDown}
              onClickCapture={suppressClickAfterDrag}
              onDragStart={(e) => e.preventDefault()}
            >
              {ALL_AVATARS.map((avatar, index) => (
                <button
                  key={avatar.key}
                  type="button"
                  className={`avatar-option ${selectedAvatar === index ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(index)}
                  disabled={joining}
                  title={avatar.name}
                >
                  <AvatarDisplay character={avatar.key} size={48} />
                  <span className="avatar-name">{avatar.name}</span>
                </button>
              ))}
            </div>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="join-btn" disabled={joining}>
            {joining ? <span className="btn-loading">Joining...</span> : <span>Join Room</span>}
          </button>
          <div className="form-group">
            <label>Room Code</label>
            <div className="room-input-group">
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value.toUpperCase())}
                placeholder="Room code"
                maxLength={8}
                required
                disabled={joining}
              />
              <button type="button" className="generate-btn" onClick={generateRoom} disabled={joining}>
                Generate
              </button>
            </div>
          </div>
        </form>
      </div>

      <section className="training-card" aria-label="Training run">
        <div className="training-icon">🏁</div>
        <div className="training-copy">
          <h3>Training Run</h3>
          <p>Practice a level solo — longer, harder, and independent. Choose a scenario and start.</p>
        </div>
        <div className="training-actions">
          <select
            className="training-zone-select"
            value={startLevel}
            onChange={(e) => setStartLevel(e.target.value)}
            disabled={joining || trainingStarting}
            aria-label="Training level"
          >
            {TRAINING_LEVELS.map((level) => (
              <option key={level.id} value={level.id}>{level.label}</option>
            ))}
          </select>
          <button
            type="button"
            className="training-btn"
            onClick={handleTraining}
            disabled={joining || trainingStarting}
          >
            {trainingStarting ? 'Starting...' : 'Start Training'}
          </button>
        </div>
      </section>

      <section className="lobby-rooms" aria-label="Games available now">
        <div className="rooms-header">
          <h3>
            <span className="rooms-live-dot" />
            Live Games
            <span className="rooms-count">{rooms.length}</span>
          </h3>
          <button
            type="button"
            className="rooms-refresh"
            onClick={() => onRefreshRooms?.()}
            aria-label="Refresh games"
            title="Refresh games"
          >
            ↻
          </button>
        </div>
        {hint && <div className="rooms-hint">{hint}</div>}
        {rooms.length === 0 ? (
          <div className="rooms-empty">
            No games right now. Generate a room code above to start one.
          </div>
        ) : (
          <ul className="rooms-list">
            {rooms.map((gameRoom) => {
              const meta = GAME_TYPES[gameRoom.gameType] || { icon: '🎲', name: 'Mode pending' };
              const full = gameRoom.playerCount >= gameRoom.maxPlayers;
              return (
                <li key={gameRoom.id} className={`room-row ${gameRoom.status}`}>
                  <span className="room-mode" title={meta.name}>{meta.icon}</span>
                  <div className="room-main">
                    <div className="room-title">
                      <code className="room-code">{gameRoom.id}</code>
                      <span className={`room-status ${gameRoom.status}`}>
                        {gameRoom.status === 'waiting' ? 'Waiting' : `Round ${gameRoom.round || 1}`}
                      </span>
                    </div>
                    <div className="room-sub">
                      <span className="room-game">{meta.name}</span>
                      <span className="room-dot">•</span>
                      <span className="room-host">Host: {gameRoom.hostName}</span>
                    </div>
                  </div>
                  <div className="room-players" title={`${gameRoom.playerCount}/${gameRoom.maxPlayers} players`}>
                    <span className="room-avatars">
                      {(gameRoom.players || []).slice(0, 3).map((p) => (
                        <span key={p.id} className="room-player-avatar" title={p.name}>
                          <AvatarDisplay character={p.avatar} size={22} />
                        </span>
                      ))}
                    </span>
                    <span className="room-player-count">
                      {gameRoom.playerCount}/{gameRoom.maxPlayers}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="room-join-btn"
                    onClick={() => handleQuickJoin(gameRoom)}
                    disabled={joining || full}
                  >
                    {full ? 'Full' : gameRoom.status === 'waiting' ? 'Join' : 'Watch'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
