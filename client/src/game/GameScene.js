import Phaser from 'phaser';
import { generateAllTextures, getPaletteByAvatar } from './textures';

const CANVAS_W = 960;
const CANVAS_H = 600;
const GROUND_Y = 520;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create(data) {
    this.levelData = data.level;
    this.player1Data = data.player1;
    this.player2Data = data.player2;
    this.myId = data.myId;

    generateAllTextures(this);

    this.createBg();
    this.createLevel();
    this.createAnimations();
    this.createPlayerSprites();
    this.setupCameras();
    this.setupCollisions();
    this.createHUD();

    this.prevPlayerState = {};
    this.prevCoins = new Set();
  }

  createBg() {
    this.parallaxContainer = this.add.container(0, 0);

    for (let i = 0; i < 8; i++) {
      this.parallaxContainer.add(
        this.add.image(i * 300, CANVAS_H - 60, 'mountain').setOrigin(0.5, 1).setAlpha(0.5)
      );
    }
    for (let i = 0; i < 6; i++) {
      this.parallaxContainer.add(
        this.add.image(100 + i * 200, CANVAS_H - 20, 'bush').setOrigin(0.5, 1).setAlpha(0.6)
      );
    }
    for (let i = 0; i < 10; i++) {
      this.parallaxContainer.add(
        this.add.image(60 + i * 250, 50 + Math.random() * 60, 'cloud').setOrigin(0.5, 0.5).setAlpha(0.8)
      );
    }
  }

  createLevel() {
    const level = this.levelData;
    this.platformGroup = this.physics.add.staticGroup();
    this.pipeGroup = this.physics.add.staticGroup();
    this.questionGroup = this.physics.add.staticGroup();
    this.coinGroup = this.physics.add.group();
    this.enemySprites = [];

    for (const plat of level.platforms) {
      if (plat.h >= 40) {
        const tilesX = Math.ceil(plat.w / 40);
        for (let tx = 0; tx < tilesX; tx++) {
          const tile = this.platformGroup.create(plat.x + tx * 40 + 20, plat.y - plat.h / 2, 'ground');
          tile.setDisplaySize(40, plat.h);
          tile.refreshBody();
        }
      } else {
        const tile = this.platformGroup.create(plat.x + plat.w / 2, plat.y + plat.h / 2, 'floating');
        tile.setDisplaySize(plat.w, plat.h);
        tile.refreshBody();
      }
    }

    for (const pipe of level.pipes || []) {
      const p = this.pipeGroup.create(pipe.x + pipe.w / 2, pipe.y + pipe.h / 2, 'pipe');
      p.setDisplaySize(pipe.w, pipe.h);
      p.refreshBody();
    }

    for (const qb of level.questionBlocks || []) {
      const q = this.questionGroup.create(qb.x + qb.w / 2, qb.y + qb.h / 2, 'questionBlock', qb.hit ? 2 : 0);
      q.setDisplaySize(qb.w, qb.h);
      q.refreshBody();
    }

    for (const coin of level.coins || []) {
      if (coin.collected) continue;
      const c = this.physics.add.sprite(coin.x, coin.y, 'coin');
      c.setDisplaySize(16, 16);
      c.play('coin_spin');
      this.coinGroup.add(c);
    }

    for (const enemy of level.enemies || []) {
      const e = this.physics.add.sprite(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, 'goomba');
      e.setDisplaySize(enemy.w, enemy.h);
      e.body.setSize(enemy.w, enemy.h);
      e.play('goomba_walk');
      this.enemySprites.push(e);
    }

    this.add.image(12000 - 85, GROUND_Y - 80, 'flag').setOrigin(0.5, 0.5);
  }

  createAnimations() {
    const avatars = ['mario', 'luigi', 'peach', 'bowser', 'toad', 'yoshi', 'boo', 'koopa', 'daisy', 'rosalina', 'wario', 'waluigi'];
    for (const name of avatars) {
      if (!this.anims.exists(`${name}_walk`)) {
        this.anims.create({
          key: `${name}_walk`,
          frames: this.anims.generateFrameNumbers(name, { start: 0, end: 3 }),
          frameRate: 8,
          repeat: -1,
        });
        this.anims.create({
          key: `${name}_jump`,
          frames: [{ key: name, frame: 5 }],
          frameRate: 1,
          repeat: 0,
        });
        this.anims.create({
          key: `${name}_die`,
          frames: [{ key: name, frame: 10 }],
          frameRate: 1,
          repeat: 0,
        });
      }
    }

    if (!this.anims.exists('coin_spin')) {
      this.anims.create({
        key: 'coin_spin',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }

    if (!this.anims.exists('goomba_walk')) {
      this.anims.create({
        key: 'goomba_walk',
        frames: this.anims.generateFrameNumbers('goomba', { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1,
      });
    }
  }

  createPlayerSprites() {
    this.playerSprites = {};
    for (const pData of [this.player1Data, this.player2Data]) {
      if (!pData) continue;
      const sprite = this.physics.add.sprite(pData.x || 60, (pData.y || GROUND_Y - 36) + 18, pData.avatar);
      sprite.setDisplaySize(26, 36);
      sprite.body.setSize(26, 36);
      sprite.body.setAllowGravity(false);
      this.playerSprites[pData.id] = sprite;
    }
  }

  setupCameras() {
    const isP2View = this.myId === this.player2Data?.id;

    this.cameraTargetId = isP2View
      ? this.player2Data?.id
      : this.player1Data?.id;

    this.cameras.main.setViewport(0, 0, CANVAS_W, CANVAS_H);
    this.cameras.main.setSize(CANVAS_W, CANVAS_H);
    this.cameras.main.setBounds(0, 0, 12000, CANVAS_H);

    this.updateCameraFollow();
  }

  updateCameraFollow() {
    const target = this.playerSprites?.[this.cameraTargetId];
    if (target) {
      this.cameras.main.startFollow(target, true, 0.15, 0.15);
      this.cameras.main.setFollowOffset(0, -50);
    }
  }

  setCameraTarget(playerId) {
    this.cameraTargetId = playerId;
    this.updateCameraFollow();
  }

  createCoinCollectParticles(x, y) {
    const colors = [0xffd700, 0xffa500, 0xffff00];
    for (let i = 0; i < 6; i++) {
      const p = this.add.circle(x, y, 3, colors[i % colors.length]);
      p.setDepth(50);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-30, 30),
        y: y - Phaser.Math.Between(20, 50),
        alpha: 0,
        scale: 0,
        duration: 400 + i * 50,
        ease: 'Power2',
        onComplete: () => p.destroy(),
      });
    }
  }

  createDeathParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const p = this.add.rectangle(x, y, 4, 4, color || 0xff4444);
      p.setDepth(50);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-60, 60),
        y: y + Phaser.Math.Between(-80, 20),
        alpha: 0,
        rotation: Phaser.Math.Between(-3, 3),
        scale: 0.2,
        duration: 600 + i * 30,
        ease: 'Power4',
        onComplete: () => p.destroy(),
      });
    }
  }

  createHUD() {
    this.hudContainer = this.add.container(CANVAS_W, 0).setScrollFactor(0).setDepth(100);

    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x000000, 0.75);
    panelBg.fillRoundedRect(-168, 8, 160, 4 * 24 + 30, 8);
    this.hudContainer.add(panelBg);

    this.standingsTitle = this.add.text(CANVAS_W - 16, 14, 'STANDINGS', {
      fontSize: '13px', fontFamily: 'monospace', color: '#ffd700', fontStyle: 'bold',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);
    this.standingsTexts = [];
    for (let i = 0; i < 4; i++) {
      const t1 = this.add.text(CANVAS_W - 16, 38 + i * 24, '', {
        fontSize: '12px', fontFamily: 'monospace', color: '#ccc',
      }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);
      const t2 = this.add.text(CANVAS_W - 16, 38 + i * 24 + 12, '', {
        fontSize: '11px', fontFamily: 'monospace', color: '#999',
      }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);
      this.standingsTexts.push([t1, t2]);
    }

    const timerBg = this.add.graphics();
    timerBg.fillStyle(0x000000, 0.7);
    timerBg.fillRoundedRect(8, 8, 150, 28, 6);
    this.hudContainer.add(timerBg);

    this.timerText = this.add.text(16, 12, '⏱ 2:00', {
      fontSize: '15px', fontFamily: 'monospace', color: '#fff', fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(100);

    this.finishOverlay = this.add.container(0, 0).setScrollFactor(0).setDepth(200).setVisible(false);
    const dimBg = this.add.graphics();
    dimBg.fillStyle(0x000000, 0.78);
    dimBg.fillRect(0, 0, CANVAS_W, CANVAS_H);
    this.finishOverlay.add(dimBg);

    this.finishTitle = this.add.text(CANVAS_W / 2, CANVAS_H / 2 - 50, 'FINISH!', {
      fontSize: '48px', fontFamily: 'sans-serif', color: '#ffd700', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.finishOverlay.add(this.finishTitle);

    this.finishResult1 = this.add.text(CANVAS_W / 2, CANVAS_H / 2 + 10, '', {
      fontSize: '22px', fontFamily: 'monospace', color: '#fff',
    }).setOrigin(0.5);
    this.finishOverlay.add(this.finishResult1);

    this.finishResult2 = this.add.text(CANVAS_W / 2, CANVAS_H / 2 + 45, '', {
      fontSize: '22px', fontFamily: 'monospace', color: '#fff',
    }).setOrigin(0.5);
    this.finishOverlay.add(this.finishResult2);
  }

  setupCollisions() {
    const allPlayers = Object.values(this.playerSprites);
    if (allPlayers.length === 0) return;
    this.physics.add.collider(allPlayers, this.platformGroup);
    this.physics.add.collider(allPlayers, this.pipeGroup);
    this.physics.add.collider(allPlayers, this.questionGroup);
    this.physics.add.overlap(allPlayers, this.coinGroup, (player, coin) => {
      coin.destroy();
    });
  }

  updateState(stateData) {
    if (!stateData || !this.playerSprites) return;

    for (const sp of stateData.players) {
      const sprite = this.playerSprites[sp.id];
      if (!sprite) continue;

      const prev = this.prevPlayerState[sp.id];

      if (sp.justDied && (!prev || !prev.dying)) {
        const palette = getPaletteByAvatar(
          sp.id === this.player1Data?.id ? this.player1Data?.avatar
            : (sp.id === this.player2Data?.id ? this.player2Data?.avatar : 'mario')
        );
        this.createDeathParticles(sp.x + 13, sp.y + 18, parseInt(palette.body.replace('#', ''), 16));
        this.cameras.main.shake(200, 0.008);
      }

      sprite.setPosition(sp.x + 13, sp.y + 18);

      const avatar = sp.id === this.player1Data?.id ? this.player1Data?.avatar
        : (sp.id === this.player2Data?.id ? this.player2Data?.avatar : 'mario');

      if (sp.dying || !sp.alive) {
        sprite.anims.play(`${avatar}_die`, true);
      } else if (!sp.onGround) {
        sprite.anims.play(`${avatar}_jump`, true);
      } else if (Math.abs(sp.vx) > 0.5) {
        sprite.anims.play(`${avatar}_walk`, true);
      } else {
        sprite.anims.stop();
      }

      sprite.setFlipX(sp.facing < 0);

      this.prevPlayerState[sp.id] = sp;
    }

    const newCoinPositions = new Set(
      stateData.coins.map(c => `${Math.round(c.x)}_${Math.round(c.y)}`)
    );
    const prevCoinPositions = this.prevCoins;

    for (const key of prevCoinPositions) {
      if (!newCoinPositions.has(key)) {
        const [cx, cy] = key.split('_').map(Number);
        this.createCoinCollectParticles(cx, cy);
      }
    }

    const coins = this.coinGroup.getChildren().slice();
    for (const coin of coins) {
      const key = `${Math.round(coin.x)}_${Math.round(coin.y)}`;
      if (!newCoinPositions.has(key)) {
        coin.destroy();
      }
    }
    this.prevCoins = newCoinPositions;

    const liveEnemyData = stateData.enemies;
    for (const e of liveEnemyData) {
      const match = this.enemySprites.find(s => {
        const dx = s.x - (e.x + e.w / 2);
        const dy = s.y - (e.y + e.h / 2);
        return dx * dx + dy * dy < 100;
      });
      if (match) {
        match.setPosition(e.x + e.w / 2, e.y + e.h / 2);
      } else {
        const ns = this.physics.add.sprite(e.x + e.w / 2, e.y + e.h / 2, 'goomba');
        ns.setDisplaySize(e.w, e.h);
        ns.body.setSize(e.w, e.h);
        ns.play('goomba_walk');
        this.enemySprites.push(ns);
      }
    }
    const deadSprites = this.enemySprites.filter(s => {
      return !liveEnemyData.some(e => {
        const dx = s.x - (e.x + e.w / 2);
        const dy = s.y - (e.y + e.h / 2);
        return dx * dx + dy * dy < 100;
      });
    });
    for (const s of deadSprites) {
      s.destroy();
    }
    this.enemySprites = this.enemySprites.filter(s => s.active);

    const timeSec = Math.ceil((stateData.timeRemaining || 0) / 1000);
    const min = Math.floor(timeSec / 60);
    const sec = timeSec % 60;
    this.timerText.setText(`⏱ ${min}:${sec.toString().padStart(2, '0')}`);

    const sorted = [...stateData.players].sort((a, b) => b.distance - a.distance);
    for (let i = 0; i < this.standingsTexts.length; i++) {
      const [t1, t2] = this.standingsTexts[i];
      if (i < sorted.length) {
        const p = sorted[i];
        const isMe = p.id === this.myId;
        const name = p.id === this.player1Data?.id ? this.player1Data?.name
          : (p.id === this.player2Data?.id ? this.player2Data?.name : '???');
        t1.setColor(isMe ? '#ffd700' : '#ccc');
        t1.setText(`${i + 1}. ${name?.slice(0, 8) || '??'}`);
        t2.setColor(isMe ? '#ffd700' : '#999');
        t2.setText(`${p.distance}m`);
      } else {
        t1.setText('');
        t2.setText('');
      }
    }

    if (stateData.finished && this.player1Data && this.player2Data) {
      const sortedLocal = [...stateData.players].sort((a, b) => b.distance - a.distance);
      this.finishOverlay.setVisible(true);
      if (sortedLocal[0]) {
        const wName = sortedLocal[0].id === this.player1Data?.id ? this.player1Data?.name
          : (sortedLocal[0].id === this.player2Data?.id ? this.player2Data?.name : '???');
        this.finishResult1.setText(`🥇 ${wName}: ${sortedLocal[0].distance}m`);
      }
      if (sortedLocal[1]) {
        const lName = sortedLocal[1].id === this.player1Data?.id ? this.player1Data?.name
          : (sortedLocal[1].id === this.player2Data?.id ? this.player2Data?.name : '???');
        this.finishResult2.setText(`🥈 ${lName}: ${sortedLocal[1].distance}m`);
      }
    }

    if (this.parallaxContainer) {
      const cam = this.cameras.main;
      this.parallaxContainer.setX(cam.scrollX * -0.15);
    }
  }
}
