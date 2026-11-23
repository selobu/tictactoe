import { useRef, useEffect, useState, useCallback } from 'react';
import Phaser from 'phaser';
import GameScene, { getActiveGameScene } from './GameScene';
import { socket } from '../socket';
import { playCoinSound, playMarioDeathSound } from '../utils/marioMusic';

export default function PhaserBoard({
  platformerState, platformerLevel, player1, player2, myId, finished, results,
  training = false, onExitTraining, onRestartTraining,
}) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const sceneRef = useRef(null);
  const keysRef = useRef({ left: false, right: false, jump: false });
  const lastJumpEventStampRef = useRef(-1);
  const lastJumpSentAtRef = useRef(0);
  const matchIdRef = useRef(null);
  const prevCoinsRef = useRef({});
  const wasDeadRef = useRef({});

  matchIdRef.current = platformerState?.matchId || null;

  const isSpectator = myId !== player1?.id && myId !== player2?.id;
  const localGameOver = !!(
    platformerState?.players?.find((p) => p.id === myId)?.gameOver ||
    platformerState?.endReason === 'gameover'
  );
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

    const game = gameRef.current;
    let scene = game.scene.keys?.GameScene ? game.scene.getScene('GameScene') : null;

    if (!scene) {
      scene = game.scene.add('GameScene', GameScene, true, {
        level: platformerLevel,
        player1,
        player2,
        myId,
        training,
      }) || game.scene.getScene('GameScene');
    }
    sceneRef.current = scene;
    if (scene?.setLocalInput) scene.setLocalInput(keysRef.current);

    if (scene && isSpectator) {
      scene.setCameraTarget(spectatorView || player1?.id);
    }
  }, [platformerLevel, player1, player2, myId, training]);

  useEffect(() => {
    let scene = sceneRef.current;
    if (scene && scene.game !== gameRef.current) scene = null;
    if (!scene && gameRef.current) {
      scene = gameRef.current.scene.keys?.GameScene
        ? gameRef.current.scene.getScene('GameScene')
        : null;
    }
    if (!scene) {
      const activeScene = getActiveGameScene();
      if (activeScene && activeScene.game === gameRef.current) scene = activeScene;
    }
    if (scene) sceneRef.current = scene;
    if (!scene || !scene.updateState) return;
    try {
      scene.updateState(platformerState);
    } catch (err) {
      console.error('Platformer state update failed:', err);
    }
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
    if (matchIdRef.current) {
      socket.emit('platform-input', { matchId: matchIdRef.current, keys: keysRef.current });
    }
  }, [platformerState?.matchId]);

  const handleKey = useCallback((e, pressed) => {
    const key = e.key.toLowerCase();
    const isSpace = e.key === ' ';
    const isArrow = e.key === 'ArrowLeft' || e.key === 'ArrowRight';
    const isLetter = key === 'a' || key === 'd' || key === 'w';
    if (!isSpace && !isArrow && !isLetter) return;
    e.preventDefault();
    if (e.repeat && pressed) return;
    const action = isSpace || key === 'w'
      ? 'jump'
      : (e.key === 'ArrowLeft' || key === 'a' ? 'left' : 'right');
    if (action === 'jump' && pressed) {
      // Ignore the same physical key event reaching us twice and ultra-fast duplicates.
      if (e.timeStamp === lastJumpEventStampRef.current) return;
      lastJumpEventStampRef.current = e.timeStamp;
      const now = performance.now();
      if (now - lastJumpSentAtRef.current < 70) return;
      lastJumpSentAtRef.current = now;
    }
    const next = { ...keysRef.current, [action]: pressed };
    keysRef.current = next;
    sceneRef.current?.setLocalInput?.(next);
    if (matchIdRef.current) {
      socket.emit('platform-input', { matchId: matchIdRef.current, keys: next });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', e => handleKey(e, true));
    window.addEventListener('keyup', e => handleKey(e, false));
    return () => {
      window.removeEventListener('keydown', e => handleKey(e, true));
      window.removeEventListener('keyup', e => handleKey(e, false));
    };
  }, [handleKey]);

  useEffect(() => {
    if (!training) return;
    const onShortcut = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onExitTraining?.();
      } else if ((finished || localGameOver) && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        onRestartTraining?.();
      }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, [training, finished, localGameOver, onExitTraining, onRestartTraining]);

  const state = platformerState;
  const p1 = state?.players?.find(p => p.id === player1?.id);
  const p2 = state?.players?.find(p => p.id === player2?.id);
  const boss = state?.boss;
  const localPlayer = myId === player1?.id ? player1 : player2;
  const localState = myId === player1?.id ? p1 : p2;
  const resultPlayer = localState || p1;
  const bestKey = `ttt-runner-best-${localPlayer?.avatar || 'runner'}-${platformerLevel?.levelId || 'level'}`;
  const [bestPoints, setBestPoints] = useState(0);

  useEffect(() => {
    setBestPoints(Number(localStorage.getItem(bestKey) || 0));
  }, [bestKey]);

  useEffect(() => {
    const pts = localState?.points || 0;
    if (pts > bestPoints) {
      setBestPoints(pts);
      localStorage.setItem(bestKey, String(pts));
    }
  }, [localState?.points, bestPoints, bestKey]);

  return (
    <div className="platformer-wrapper">
      <div className={`platformer-hud ${training ? 'is-training' : ''}`}>
        <div className={`platformer-player-hud ${!p1?.alive || p1?.dying ? 'dead' : ''}`}>
          <span className="platformer-hud-name">{player1?.name}</span>
          <span className="platformer-hud-dist">{p1?.distance || 0}m</span>
          <span className="platformer-hud-points" key={`p1-points-${p1?.points || 0}`}>⭐{p1?.points || 0}</span>
          <span className="platformer-lives" key={`p1-lives-${p1?.lives ?? 3}`} title={`${p1?.lives ?? 3} lives`}>
            {Array.from({ length: p1?.lives ?? 3 }).map((_, i) => (
              <span key={i} className="life-heart">❤️</span>
            ))}
            {(p1?.lives ?? 3) === 0 && <span className="life-empty">💀</span>}
            {(p1?.invulnTicks || 0) > 0 && <span className="life-shield" title="Invulnerable">🛡️</span>}
          </span>
          <span className="platformer-hud-coins">🪙{p1?.coins || 0}</span>
        </div>
        {training ? (
          <div className="training-badge">TRAINING</div>
        ) : (
          <>
            <div className="platformer-vs">⚔️</div>
            <div className={`platformer-player-hud ${!p2?.alive || p2?.dying ? 'dead' : ''}`}>
              <span className="platformer-hud-name">{player2?.name}</span>
              <span className="platformer-hud-dist">{p2?.distance || 0}m</span>
              <span className="platformer-hud-points" key={`p2-points-${p2?.points || 0}`}>⭐{p2?.points || 0}</span>
              <span className="platformer-lives" key={`p2-lives-${p2?.lives ?? 3}`} title={`${p2?.lives ?? 3} lives`}>
                {Array.from({ length: p2?.lives ?? 3 }).map((_, i) => (
                  <span key={i} className="life-heart">❤️</span>
                ))}
                {(p2?.lives ?? 3) === 0 && <span className="life-empty">💀</span>}
                {(p2?.invulnTicks || 0) > 0 && <span className="life-shield" title="Invulnerable">🛡️</span>}
              </span>
              <span className="platformer-hud-coins">🪙{p2?.coins || 0}</span>
            </div>
          </>
        )}
        <div className="platformer-best-chip">BEST {bestPoints} pts</div>
        {training && (
          <div className="training-hud-actions">
            <button type="button" className="training-restart-btn" onClick={onRestartTraining}>
              ↻ Restart
            </button>
            <button type="button" className="training-home-btn" onClick={onExitTraining}>
              🏠 Home
            </button>
          </div>
        )}
      </div>
      {training && finished && state?.endReason !== 'gameover' && (
        <div className="training-complete-overlay">
          <div className="training-complete-card">
            <div className="training-complete-trophy">{state?.endReason === 'timeout' ? '⏰' : '🏁'}</div>
            <div className="training-complete-text">
              <strong>{state?.endReason === 'timeout' ? 'TIME UP!' : 'LEVEL COMPLETE!'}</strong>
              <span>
                {platformerLevel?.name || 'Mario Runner'} · {p1?.points || 0} pts · BEST {bestPoints} pts
              </span>
              {boss && (
                <span className={`training-complete-boss ${boss.defeated ? 'victory' : 'failed'}`}>
                  {boss.defeated
                    ? `👑 ${boss.name} defeated · +${p1?.bossBonus || 0} boss · +${p1?.timeBonus || 0} time`
                    : `⏰ ${boss.name} survived — no boss or time bonus`}
                </span>
              )}
              <span className="training-complete-hint">Press R to restart · Esc for lobby</span>
            </div>
            <div className="training-complete-actions">
              <button type="button" className="training-restart-btn" onClick={onRestartTraining}>
                ↻ Restart Level
              </button>
              <button type="button" className="training-home-btn" onClick={onExitTraining}>
                🏠 Back to Lobby
              </button>
            </div>
          </div>
        </div>
      )}
      {localGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-card">
            <div className="game-over-skull">💀</div>
            <div className="game-over-title" data-text="GAME OVER">GAME OVER</div>
            <div className="game-over-sub">OUT OF LIVES</div>
            <div className="game-over-stats">
              {platformerLevel?.name || 'Mario Runner'} · {resultPlayer?.distance || 0}m · {resultPlayer?.points || 0} pts
            </div>
            <div className="game-over-actions">
              {training ? (
                <>
                  <button type="button" className="training-restart-btn" onClick={onRestartTraining}>
                    ↻ Try Again
                  </button>
                  <button type="button" className="training-home-btn" onClick={onExitTraining}>
                    🏠 Back to Lobby
                  </button>
                </>
              ) : (
                <span className="game-over-wait">Eliminated from this run — match results coming up…</span>
              )}
            </div>
            {training && <div className="game-over-hint">Press R to retry · Esc for lobby</div>}
          </div>
        </div>
      )}
      <div ref={containerRef} className="platformer-canvas" />
      <div className="platformer-controls-hint">
        {isSpectator ? (
          <span>
            Viewing: <button onClick={() => setSpectatorView(player1?.id)} style={{ fontWeight: spectatorView === player1?.id ? 'bold' : 'normal' }}>{player1?.name}</button>
            {' | '}
            <button onClick={() => setSpectatorView(player2?.id)} style={{ fontWeight: spectatorView === player2?.id ? 'bold' : 'normal' }}>{player2?.name}</button>
          </span>
        ) : (
          <span>← → / A D Move &nbsp;|&nbsp; Space / W Jump &nbsp;|&nbsp; Jump again in air to double jump &nbsp;|&nbsp; First to the flag wins</span>
        )}
      </div>
    </div>
  );
}
