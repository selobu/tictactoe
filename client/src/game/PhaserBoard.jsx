import { useRef, useEffect, useState, useCallback } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene';
import { socket } from '../socket';
import { playCoinSound, playMarioDeathSound } from '../utils/marioMusic';

export default function PhaserBoard({
  platformerState, platformerLevel, player1, player2, myId, finished, results,
}) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const sceneRef = useRef(null);
  const [keys, setKeys] = useState({ left: false, right: false, jump: false });
  const lastEmitRef = useRef('');
  const prevCoinsRef = useRef({});
  const wasDeadRef = useRef({});

  const isSpectator = myId !== player1?.id && myId !== player2?.id;
  const [spectatorView, setSpectatorView] = useState(player1?.id || null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 960,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#5c94fc',
      scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
        autoCenter: Phaser.Scale.Center.NO_CENTER,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: [],
      input: {
        keyboard: false,
      },
      audio: {
        noAudio: true,
      },
      banner: false,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!platformerLevel || !gameRef.current) return;
    if (sceneRef.current) return;

    const game = gameRef.current;
    const added = game.scene.add('GameScene', GameScene, true, {
      level: platformerLevel,
      player1,
      player2,
      myId,
    });

    const scene = added || game.scene.getScene('GameScene');
    sceneRef.current = scene;

    if (scene && isSpectator) {
      scene.setCameraTarget(spectatorView || player1?.id);
    }
  }, [platformerLevel, player1, player2, myId]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !scene.updateState) return;
    scene.updateState(platformerState);
  }, [platformerState]);

  useEffect(() => {
    if (!isSpectator || !sceneRef.current || !sceneRef.current.setCameraTarget) return;
    sceneRef.current.setCameraTarget(spectatorView);
  }, [spectatorView, isSpectator]);

  useEffect(() => {
    if (!platformerState?.players) return;
    for (const p of platformerState.players) {
      if (p.coinCollected && p.coins > (prevCoinsRef.current[p.id] || 0)) {
        playCoinSound();
      }
      if (p.justDied && !wasDeadRef.current[p.id]) {
        playMarioDeathSound();
      }
      prevCoinsRef.current[p.id] = p.coins;
      wasDeadRef.current[p.id] = !p.alive || p.dying;
    }
  }, [platformerState]);

  useEffect(() => {
    const s = JSON.stringify(keys);
    if (s !== lastEmitRef.current) {
      lastEmitRef.current = s;
      socket.emit('platform-input', { matchId: platformerState?.matchId, keys });
    }
  }, [keys, platformerState?.matchId]);

  const handleKey = useCallback((e, pressed) => {
    const isSpace = e.key === ' ';
    const isArrow = e.key === 'ArrowLeft' || e.key === 'ArrowRight';
    if (!isSpace && !isArrow) return;
    e.preventDefault();
    if (e.repeat && pressed) return;
    setKeys(prev => ({
      ...prev,
      [isSpace ? 'jump' : e.key === 'ArrowLeft' ? 'left' : 'right']: pressed,
    }));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', e => handleKey(e, true));
    window.addEventListener('keyup', e => handleKey(e, false));
    return () => {
      window.removeEventListener('keydown', e => handleKey(e, true));
      window.removeEventListener('keyup', e => handleKey(e, false));
    };
  }, [handleKey]);

  const state = platformerState;
  const p1 = state?.players?.find(p => p.id === player1?.id);
  const p2 = state?.players?.find(p => p.id === player2?.id);

  return (
    <div className="platformer-wrapper">
      <div className="platformer-hud">
        <div className={`platformer-player-hud ${!p1?.alive || p1?.dying ? 'dead' : ''}`}>
          <span className="platformer-hud-name">{player1?.name}</span>
          <span className="platformer-hud-dist">{p1?.distance || 0}m</span>
          <span className="platformer-hud-coins">🪙{p1?.coins || 0}</span>
        </div>
        <div className="platformer-vs">⚔️</div>
        <div className={`platformer-player-hud ${!p2?.alive || p2?.dying ? 'dead' : ''}`}>
          <span className="platformer-hud-name">{player2?.name}</span>
          <span className="platformer-hud-dist">{p2?.distance || 0}m</span>
          <span className="platformer-hud-coins">🪙{p2?.coins || 0}</span>
        </div>
      </div>
      <div ref={containerRef} className="platformer-canvas" />
      <div className="platformer-controls-hint">
        {isSpectator ? (
          <span>
            Viewing: <button onClick={() => setSpectatorView(player1?.id)} style={{ fontWeight: spectatorView === player1?.id ? 'bold' : 'normal' }}>{player1?.name}</button>
            {' | '}
            <button onClick={() => setSpectatorView(player2?.id)} style={{ fontWeight: spectatorView === player2?.id ? 'bold' : 'normal' }}>{player2?.name}</button>
          </span>
        ) : (
          <span>← → Move &nbsp;|&nbsp; Space Jump &nbsp;|&nbsp; Space (mid-air) Double Jump</span>
        )}
      </div>
    </div>
  );
}
