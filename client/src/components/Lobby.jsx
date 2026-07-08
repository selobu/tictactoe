import { useState, useEffect } from 'react';

export default function Lobby({ onJoin, joining, error }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) setRoom(roomParam);
    const savedName = localStorage.getItem('ttt-player-name');
    if (savedName) setName(savedName);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !room.trim()) return;
    localStorage.setItem('ttt-player-name', name.trim());
    onJoin(name.trim(), room.trim());
  }

  function generateRoom() {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoom(id);
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
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="join-btn" disabled={joining}>
            {joining ? <span className="btn-loading">Joining...</span> : <span>Join Room</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
