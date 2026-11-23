import Phaser from 'phaser';
import {
  generateAllTextures,
  generateRunnerTexture,
  getRunnerTextureKey,
  getPaletteByAvatar,
  getEnemyTextureKey,
  getBossTextureKey,
} from './textures';
import {
  playEnemyStompSound,
  playQuestionHitSound,
  playQuestionRewardSound,
  playOneUpSound,
  playBossIntroSound,
  playBossHitSound,
  playBossDefeatSound,
  playBossShotSound,
  startBossMusic,
  stopBossMusic,
  playGameOverSound,
  playFireworkSound,
  playJumpSound,
} from '../utils/marioMusic';

const CANVAS_W = 960;
const CANVAS_H = 600;
const GROUND_Y = 520;
const PLAYER_W = 32;
const PLAYER_H = 44;

const DEFAULT_ZONES = [
  { id: 'grass', name: 'Mushroom Plains', start: 0, end: 2200 },
  { id: 'cave', name: 'Crystal Caverns', start: 2200, end: 4500 },
  { id: 'sky', name: 'Cloud Kingdom', start: 4500, end: 5800 },
  { id: 'castle', name: 'Celestial Citadel', start: 5800, end: 7000 },
];

let activeGameScene = null;

export function getActiveGameScene() {
  return activeGameScene;
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create(data) {
    this.levelData = data.level;
    this.player1Data = data.player1;
    this.player2Data = data.player2;
    this.myId = data.myId;
    this.isTraining = !!data.training;
    this.playerSprites = {};
    this.playerLabels = {};
    this.playerTargets = {};
    this.enemySprites = new Map();
    this.enemyTargets = new Map();
    this.questionSprites = new Map();
    this.prevQuestionHit = new Set();
    this.deathGhosts = {};
    this.prevPlayerState = {};
    this.prevCoins = new Set();
    this.bossSprite = null;
    this.bossTarget = null;
    this.bossProjectileSprites = new Map();
    this.bossProjectileTargets = new Map();
    this.enemyProjectileSprites = new Map();
    this.enemyProjectileTargets = new Map();
    this.bossGate = null;
    this.bossWall = null;
    this.bossWallActive = false;
    this.bossTelegraph = null;
    this.prevBlinkTelegraph = false;
    this.bossGateOpened = false;
    this.bossWasActive = false;
    this.bossWasDefeated = false;
    this.bossPrevHp = null;
    this.bossPrevPhase = 1;
    this.cameraFixedForBoss = false;
    this.gameOverShown = false;
    this.celebrateUntil = 0;
    this.levelWidth = this.levelData?.width || 7000;
    this.groundTop = this.levelData?.groundTop || GROUND_Y;
    this.zones = this.levelData?.zones || DEFAULT_ZONES;
    this.currentZone = null;

    this.avatars = {};
    if (this.player1Data) this.avatars[this.player1Data.id] = this.player1Data.avatar;
    if (this.player2Data) this.avatars[this.player2Data.id] = this.player2Data.avatar;
    activeGameScene = this;

    generateAllTextures(this, [this.player1Data?.avatar, this.player2Data?.avatar]);
    this.createBg();
    this.createAnimations();
    this.createLevel();
    this.createLevelOverlays();
    this.createPlayerSprites();
    this.setupCameras();
    this.createHUD();
    this.createZoneUI();
    this.applyZone(this.getZone(this.levelData?.startX ?? 60), true);
  }

  getZone(x) {
    return this.zones.find((z) => x >= z.start && x < z.end) || this.zones[this.zones.length - 1];
  }

  getZoneTint(zoneId) {
    return {
      grass: 0xffffff,
      cave: 0xcee2ff,
      sky: 0xffffff,
      castle: 0xffd0c0,
    }[zoneId] || 0xffffff;
  }

  getEnemyTint(type, zoneId) {
    const special = {
      blinky: 0xff4d4d,
      pinky: 0xff8fd1,
      inky: 0x63e6ff,
      clyde: 0xffa94d,
      fish: 0x9be7ff,
      jelly: 0xd18cff,
    };
    if (special[type] !== undefined) return special[type];
    if (type === 'fire' || type === 'spitter') return null;
    return this.getZoneTint(zoneId);
  }

  createZoneUI() {
    this.zoneLabel = this.add
      .text(CANVAS_W / 2, 12, '', {
        fontSize: '14px',
        fontFamily: 'Luckiest Guy, Arial Black, sans-serif',
        color: '#ffd700',
        stroke: '#1a2a52',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.zoneBanner = this.add
      .text(CANVAS_W / 2, 250, '', {
        fontSize: '46px',
        fontFamily: 'Luckiest Guy, Arial Black, sans-serif',
        color: '#ffffff',
        stroke: '#1a2a52',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(120)
      .setAlpha(0);
    this.zoneBanner.setShadow(0, 5, '#000000', 10);

    this.zoneFade = this.add
      .rectangle(0, 0, CANVAS_W, CANVAS_H, 0x000000, 0)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(95);
  }

  applyZone(zone, force = false) {
    if (!zone) return;
    if (!force && this.currentZone?.id === zone.id) return;
    this.currentZone = zone;

    this.bgSky.setTexture(`sky-${zone.id}`);
    this.bgClouds.setTexture(`clouds-${zone.id}`);
    this.bgMountains.setTexture(`mountains-${zone.id}`);
    this.bgBushes.setTexture(`bushes-${zone.id}`);

    if (this.zoneLabel) this.zoneLabel.setText(zone.name.toUpperCase());

    if (this.zoneBanner) {
      this.tweens.killTweensOf(this.zoneBanner);
      this.zoneBanner.setText(zone.name.toUpperCase()).setAlpha(1);
      this.tweens.add({
        targets: this.zoneBanner,
        alpha: 0,
        delay: 1300,
        duration: 650,
        ease: 'Power2',
      });
    }

    if (this.zoneFade) {
      this.tweens.killTweensOf(this.zoneFade);
      this.zoneFade.setAlpha(0.65);
      this.tweens.add({ targets: this.zoneFade, alpha: 0, duration: 550 });
    }
  }

  createBg() {
    this.bgSky = this.add.image(0, 0, 'sky-grass').setOrigin(0, 0).setScrollFactor(0).setDepth(-100);
    this.bgClouds = this.add
      .tileSprite(0, 26, CANVAS_W, 200, 'clouds-grass')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-90)
      .setAlpha(0.95);
    this.bgMountains = this.add
      .tileSprite(0, this.groundTop - 200, CANVAS_W, 200, 'mountains-grass')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-80);
    this.bgBushes = this.add
      .tileSprite(0, this.groundTop - 62, CANVAS_W, 62, 'bushes-grass')
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-70);
  }

  createLevel() {
    const level = this.levelData;
    const groundTop = this.groundTop;
    this.coinGroup = this.add.group();
    this.lavaTiles = [];
    this.iceTiles = [];

    for (const plat of level.platforms) {
      if (plat.h >= 40) {
        for (const zone of this.zones) {
          const start = Math.max(plat.x, zone.start);
          const end = Math.min(plat.x + plat.w, zone.end);
          if (end <= start) continue;
          const width = end - start;
          this.add.tileSprite(start, plat.y, width, 40, `ground-${zone.id}`).setOrigin(0, 0).setDepth(2);
          const dirtHeight = plat.h - 40;
          if (dirtHeight > 0) {
            this.add.tileSprite(start, plat.y + 40, width, dirtHeight, `dirt-${zone.id}`).setOrigin(0, 0).setDepth(2);
          }
        }
      } else {
        const zone = this.getZone(plat.x + plat.w / 2);
        this.add.tileSprite(plat.x, plat.y, plat.w, plat.h, `floating-${zone.id}`).setOrigin(0, 0).setDepth(3);
        const shade = { grass: 0x7a4210, cave: 0x1f1838, sky: 0x6fb3d1, castle: 0x221217 }[zone.id] || 0x000000;
        this.add.rectangle(plat.x, plat.y + plat.h, plat.w, 3, shade, 0.45).setOrigin(0, 0).setDepth(3);
      }
    }

    for (const pipe of level.pipes || []) {
      const zone = this.getZone(pipe.x + pipe.w / 2);
      this.add
        .image(pipe.x, pipe.y, `pipe-${zone.id}`)
        .setOrigin(0, 0)
        .setDisplaySize(pipe.w, pipe.h)
        .setDepth(4);
    }

    for (const hazard of level.hazards || []) {
      const lava = this.add
        .tileSprite(hazard.x, hazard.y, hazard.w, hazard.h, 'lava-tile')
        .setOrigin(0, 0)
        .setDepth(3)
        .setAlpha(0.96);
      this.lavaTiles.push(lava);
    }

    for (const patch of level.icePatches || []) {
      const ice = this.add
        .tileSprite(patch.x, patch.y, patch.w, patch.h, 'ice-tile')
        .setOrigin(0, 0)
        .setDepth(4)
        .setAlpha(0.9);
      this.iceTiles.push(ice);
    }

    for (const qb of level.questionBlocks || []) {
      const q = this.add
        .image(qb.x, qb.y, 'questionBlock', qb.hit ? 2 : 0)
        .setOrigin(0, 0)
        .setDisplaySize(qb.w, qb.h)
        .setDepth(4);
      const key = `${qb.x}_${qb.y}`;
      this.questionSprites.set(key, q);
      if (qb.hit) this.prevQuestionHit.add(key);
    }

    for (const coin of level.coins || []) {
      if (coin.collected) continue;
      const c = this.add.sprite(coin.x, coin.y, 'coin').setDisplaySize(16, 16).setDepth(5);
      c.play('coin_spin');
      this.coinGroup.add(c);
    }

    for (const enemy of level.enemies || []) {
      if (!enemy.alive) continue;
      const key = getEnemyTextureKey(enemy.type);
      const e = this.add
        .sprite(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, key)
        .setDisplaySize(enemy.w, enemy.h)
        .setDepth(6);
      const zone = this.getZone(enemy.x + enemy.w / 2);
      const tint = this.getEnemyTint(enemy.type, zone.id);
      if (tint === null) e.clearTint();
      else e.setTint(tint);
      e.play(`${key}_walk`);
      this.enemySprites.set(enemy.id, e);
      this.enemyTargets.set(enemy.id, { x: e.x, y: e.y });
    }

    const finishX = level.finishX || 6800;
    this.add.image(finishX, groundTop, 'flag').setOrigin(0.5, 1).setDepth(7);
    this.add.image(finishX, groundTop, 'finishLine').setOrigin(0.5, 1).setDepth(8);
    this.add
      .text(finishX, groundTop - 198, 'FINISH', {
        fontSize: '22px',
        fontFamily: 'Luckiest Guy, Arial Black, sans-serif',
        color: '#ffd700',
        stroke: '#1a2a52',
        strokeThickness: 5,
      })
      .setOrigin(0.5, 1)
      .setDepth(8);

    if (level.boss) this.createBossArena(level);
  }

  createLevelOverlays() {
    const level = this.levelData;
    this.waterBubbles = [];
    if (level.levelId === 'pac') {
      this.add
        .tileSprite(0, 0, level.width, CANVAS_H, 'neon-grid')
        .setOrigin(0, 0)
        .setDepth(-60)
        .setAlpha(0.75);
      this.add
        .rectangle(0, 0, CANVAS_W, CANVAS_H, 0x26004d, 0.16)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(-59);
    } else if (level.levelId === 'water') {
      this.add
        .rectangle(0, 0, CANVAS_W, CANVAS_H, 0x0a4f8a, 0.24)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(-59);
      for (let i = 0; i < 18; i++) {
        const bubble = this.add
          .circle(Phaser.Math.Between(0, CANVAS_W), Phaser.Math.Between(0, CANVAS_H), Phaser.Math.Between(2, 5), 0xbff4ff, 0.45)
          .setScrollFactor(0)
          .setDepth(-55);
        this.waterBubbles.push({ sprite: bubble, speed: Phaser.Math.Between(18, 42) });
      }
    }
  }

  createBossArena(level) {    const gateX = level.arena?.gateX ?? level.boss.gateX;
    this.bossGate = this.add
      .image(gateX, this.groundTop - 230, 'boss-gate')
      .setOrigin(0, 0)
      .setDisplaySize(30, 230)
      .setDepth(9)
      .setAlpha(0.95);
    this.tweens.add({
      targets: this.bossGate,
      alpha: 0.55,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.bossWall = this.add
      .image((level.arena?.start ?? 8200) + 16, this.groundTop, 'boss-wall')
      .setOrigin(0.5, 1)
      .setDisplaySize(32, 230)
      .setDepth(10)
      .setAlpha(0)
      .setVisible(false);

    const boss = level.boss;
    const key = getBossTextureKey(boss.theme);
    this.bossSprite = this.add
      .sprite(boss.x + boss.w / 2, boss.y + boss.h / 2, key)
      .setDisplaySize(boss.w, boss.h)
      .setDepth(16);
    this.bossSprite.play(`${key}_idle`);
    this.bossTarget = { x: boss.x + boss.w / 2, y: boss.y + boss.h / 2, teleport: true };
    this.bossPrevHp = boss.maxHp;

    this.bossTelegraph = this.add
      .image(0, 0, 'boss-telegraph')
      .setDisplaySize(50, 50)
      .setDepth(17)
      .setVisible(false);
    this.tweens.add({
      targets: this.bossTelegraph,
      angle: 360,
      duration: 1100,
      repeat: -1,
      ease: 'Linear',
    });
    this.tweens.add({
      targets: this.bossTelegraph,
      alpha: 0.35,
      scaleX: 0.72,
      scaleY: 0.72,
      duration: 230,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.bossTauntText = this.add
      .text(0, 0, '', {
        fontSize: '14px',
        fontFamily: 'Luckiest Guy, Arial Black, sans-serif',
        color: '#fff8d6',
        stroke: '#1a2a52',
        strokeThickness: 5,
        align: 'center',
      })
      .setOrigin(0.5, 1)
      .setDepth(60)
      .setVisible(false);
  }

  createAnimations() {
    for (const key of new Set(Object.values(this.avatars).map((a) => getRunnerTextureKey(a)))) {
      if (this.anims.exists(`${key}_walk`)) continue;
      this.anims.create({
        key: `${key}_walk`,
        frames: this.anims.generateFrameNumbers(key, { start: 0, end: 5 }),
        frameRate: 16,
        repeat: -1,
      });
      this.anims.create({ key: `${key}_jump`, frames: [{ key, frame: 6 }], frameRate: 1, repeat: 0 });
      this.anims.create({ key: `${key}_fall`, frames: [{ key, frame: 7 }], frameRate: 1, repeat: 0 });
      this.anims.create({ key: `${key}_idle`, frames: [{ key, frame: 8 }], frameRate: 1, repeat: 0 });
      this.anims.create({ key: `${key}_cheer`, frames: [{ key, frame: 11 }], frameRate: 1, repeat: 0 });
      this.anims.create({ key: `${key}_die`, frames: [{ key, frame: 10 }], frameRate: 1, repeat: 0 });
    }

    if (!this.anims.exists('coin_spin')) {
      this.anims.create({
        key: 'coin_spin',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
    }

    const enemyTypes = ['goomba', 'koopa', 'spiny', 'jumper', 'flyer', 'toad', 'fire', 'spitter', 'penguin', 'gust', 'ghost', 'fish', 'jelly'];
    for (const type of enemyTypes) {
      const key = getEnemyTextureKey(type);
      if (!this.anims.exists(`${key}_walk`)) {
        const fast = ['flyer', 'fire', 'gust', 'ghost'].includes(type);
        this.anims.create({
          key: `${key}_walk`,
          frames: this.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
          frameRate: fast ? 9 : 5,
          repeat: -1,
        });
      }
    }

    for (const theme of ['grass', 'cave', 'sky', 'castle', 'pac', 'koopa', 'water']) {
      const key = getBossTextureKey(theme);
      if (!this.anims.exists(`${key}_idle`)) {
        this.anims.create({
          key: `${key}_idle`,
          frames: this.anims.generateFrameNumbers(key, { start: 0, end: 1 }),
          frameRate: 3,
          repeat: -1,
        });
      }
    }
  }

  createPlayerSprites() {
    const startX = this.levelData?.startX ?? 60;
    for (const pData of [this.player1Data, this.player2Data]) {
      if (!pData) continue;
      const key = generateRunnerTexture(this, pData.avatar);
      const spawnX = startX + PLAYER_W / 2;
      const spawnY = this.groundTop - PLAYER_H + PLAYER_H / 2;
      const sprite = this.add.sprite(spawnX, spawnY, key).setDepth(20);
      sprite.play(`${key}_idle`);
      this.playerSprites[pData.id] = sprite;
      this.playerTargets[pData.id] = { x: spawnX, y: spawnY, teleport: true };

      const label = this.add
        .text(spawnX, spawnY - 28, pData.name || 'Player', {
          fontSize: '12px',
          fontFamily: 'Nunito, Segoe UI, sans-serif',
          color: '#ffffff',
          stroke: '#1a2a52',
          strokeThickness: 3,
        })
        .setOrigin(0.5, 1)
        .setDepth(21);
      this.playerLabels[pData.id] = label;
    }
  }

  setupCameras() {
    const isP2View = this.myId === this.player2Data?.id;
    this.cameraTargetId = isP2View ? this.player2Data?.id : this.player1Data?.id;

    this.cameras.main.setBounds(0, 0, this.levelWidth, CANVAS_H);
    this.cameras.main.setSize(CANVAS_W, CANVAS_H);
    this.updateCameraFollow();
  }

  updateCameraFollow() {
    if (this.cameraFixedForBoss) return;
    const target = this.playerSprites?.[this.cameraTargetId];
    if (target) {
      this.cameras.main.startFollow(target, true, 0.24, 0.24);
      this.cameras.main.setFollowOffset(90, 0);
    }
  }

  lockCameraForBoss() {
    if (this.cameraFixedForBoss) return;
    this.cameraFixedForBoss = true;
    const arenaStart = this.levelData?.arena?.start ?? 8200;
    const arenaEnd = this.levelData?.finishX ?? 8990;
    const centerX = (arenaStart + arenaEnd) / 2;
    const cam = this.cameras.main;
    cam.stopFollow();
    const targetScrollX = Phaser.Math.Clamp(
      centerX - CANVAS_W / 2,
      0,
      Math.max(0, this.levelWidth - CANVAS_W)
    );
    this.tweens.killTweensOf(cam);
    this.tweens.add({
      targets: cam,
      scrollX: targetScrollX,
      scrollY: 0,
      duration: 550,
      ease: 'Sine.easeInOut',
    });
  }

  setCameraTarget(playerId) {
    this.cameraTargetId = playerId;
    this.updateCameraFollow();
  }

  shutdown() {
    stopBossMusic(0.08);
    if (activeGameScene === this) activeGameScene = null;
  }

  update(time, delta) {
    const lerp = Math.min(1, delta / 35);

    const zoneTarget = this.playerTargets?.[this.cameraTargetId];
    if (zoneTarget) {
      const zone = this.getZone(zoneTarget.x);
      if (zone && zone.id !== this.currentZone?.id) this.applyZone(zone);
    }

    for (const [id, sprite] of Object.entries(this.playerSprites)) {
      const target = this.playerTargets[id];
      if (!target) continue;
      if (target.teleport) {
        sprite.setPosition(target.x, target.y);
        target.teleport = false;
        if (id === this.cameraTargetId && !this.cameraFixedForBoss) {
          this.cameras.main.centerOn(target.x, target.y);
        }
      } else {
        sprite.x = Phaser.Math.Linear(sprite.x, target.x, lerp);
        sprite.y = Phaser.Math.Linear(sprite.y, target.y, lerp);
      }
      const label = this.playerLabels[id];
      if (label) label.setPosition(sprite.x, sprite.y - 27);
    }

    for (const [id, sprite] of this.enemySprites) {
      const target = this.enemyTargets.get(id);
      if (!target) continue;
      sprite.x = Phaser.Math.Linear(sprite.x, target.x, lerp);
      sprite.y = Phaser.Math.Linear(sprite.y, target.y, lerp);
    }

    if (this.bossSprite && this.bossTarget) {
      if (this.bossTarget.teleport) {
        this.bossSprite.setPosition(this.bossTarget.x, this.bossTarget.y);
        this.bossTarget.teleport = false;
      } else {
        this.bossSprite.x = Phaser.Math.Linear(this.bossSprite.x, this.bossTarget.x, lerp);
        this.bossSprite.y = Phaser.Math.Linear(this.bossSprite.y, this.bossTarget.y, lerp);
      }
    }

    for (const [id, sprite] of this.bossProjectileSprites) {
      const target = this.bossProjectileTargets.get(id);
      if (!target) continue;
      if (target.teleport) {
        sprite.setPosition(target.x, target.y);
        target.teleport = false;
      } else {
        sprite.x = Phaser.Math.Linear(sprite.x, target.x, lerp);
        sprite.y = Phaser.Math.Linear(sprite.y, target.y, lerp);
      }
    }

    for (const [id, sprite] of this.enemyProjectileSprites) {
      const target = this.enemyProjectileTargets.get(id);
      if (!target) continue;
      if (target.teleport) {
        sprite.setPosition(target.x, target.y);
        target.teleport = false;
      } else {
        sprite.x = Phaser.Math.Linear(sprite.x, target.x, lerp);
        sprite.y = Phaser.Math.Linear(sprite.y, target.y, lerp);
      }
    }

    if (this.bossTauntText?.visible && this.bossSprite) {
      this.bossTauntText.setPosition(this.bossSprite.x, this.bossSprite.y - 28);
    }

    if (this.bgClouds) {
      const cam = this.cameras.main;
      this.bgClouds.tilePositionX = cam.scrollX * 0.08;
      this.bgMountains.tilePositionX = cam.scrollX * 0.18;
      this.bgBushes.tilePositionX = cam.scrollX * 0.35;
    }

    for (const lava of this.lavaTiles || []) {
      lava.tilePositionX += delta * 0.02;
    }

    for (const bubble of this.waterBubbles || []) {
      bubble.sprite.y -= bubble.speed * (delta / 1000);
      if (bubble.sprite.y < -10) {
        bubble.sprite.y = CANVAS_H + 10;
        bubble.sprite.x = Phaser.Math.Between(0, CANVAS_W);
      }
    }
  }

  createCoinCollectParticles(x, y) {
    const colors = [0xffd700, 0xffa500, 0xffff88];
    for (let i = 0; i < 6; i++) {
      const p = this.add.circle(x, y, 3, colors[i % colors.length]).setDepth(50);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-26, 26),
        y: y - Phaser.Math.Between(20, 50),
        alpha: 0,
        scale: 0,
        duration: 350 + i * 45,
        ease: 'Power2',
        onComplete: () => p.destroy(),
      });
    }
  }

  createDeathAnimation(sp, sprite) {
    const ghost = this.add
      .sprite(sprite.x, sprite.y, sprite.texture.key, 10)
      .setDepth(35)
      .setFlipX(sprite.flipX);
    this.deathGhosts[sp.id] = ghost;
    sprite.setVisible(false);

    const phrases = ['OOF!', 'OUCH!', 'WIPEOUT!', 'NOT AGAIN!', 'YIKES!'];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    const text = this.add
      .text(sprite.x, sprite.y - 36, phrase, {
        fontSize: '20px',
        fontFamily: 'Luckiest Guy, Arial Black, sans-serif',
        color: '#ffd700',
        stroke: '#1a2a52',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(36)
      .setScale(0.4)
      .setAlpha(0);

    this.tweens.add({
      targets: text,
      scale: 1.15,
      alpha: 1,
      y: text.y - 14,
      duration: 220,
      ease: 'Back.easeOut',
    });
    this.tweens.add({
      targets: text,
      alpha: 0,
      y: text.y - 36,
      delay: 720,
      duration: 360,
      onComplete: () => text.destroy(),
    });

    this.tweens.add({
      targets: ghost,
      y: ghost.y - 80,
      rotation: Math.PI * 2,
      duration: 360,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: ghost,
          y: ghost.y + 150,
          rotation: Math.PI * 4,
          alpha: 0,
          duration: 500,
          ease: 'Quad.easeIn',
          onComplete: () => ghost.destroy(),
        });
      },
    });

    for (let i = 0; i < 7; i++) {
      const star = this.add.circle(sprite.x, sprite.y, 3, i % 2 ? 0xffd700 : 0xffffff).setDepth(35);
      this.tweens.add({
        targets: star,
        x: sprite.x + Phaser.Math.Between(-55, 55),
        y: sprite.y - Phaser.Math.Between(20, 80),
        alpha: 0,
        duration: 480 + i * 45,
        onComplete: () => star.destroy(),
      });
    }
  }

  createLifeGainAnimation(sprite) {
    const x = sprite.x;
    const y = sprite.y - 12;
    const mushroom = this.add.image(x, y, 'oneup').setDepth(45).setScale(0.2).setAlpha(0);
    const label = this.add
      .text(x, y - 30, '+1 LIFE', {
        fontSize: '18px',
        fontFamily: 'Luckiest Guy, Arial Black, sans-serif',
        color: '#8aff8a',
        stroke: '#145a26',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(46)
      .setScale(0.4)
      .setAlpha(0);

    this.tweens.add({
      targets: [mushroom, label],
      scale: 1,
      alpha: 1,
      duration: 260,
      ease: 'Back.easeOut',
    });
    this.tweens.add({
      targets: [mushroom, label],
      y: y - 62,
      duration: 950,
      ease: 'Quad.easeOut',
    });
    this.tweens.add({
      targets: [mushroom, label],
      alpha: 0,
      delay: 1000,
      duration: 420,
      onComplete: () => {
        mushroom.destroy();
        label.destroy();
      },
    });

    for (let i = 0; i < 8; i++) {
      const spark = this.add.circle(x, y, 3, i % 2 ? 0x8aff8a : 0xffd166).setDepth(44);
      this.tweens.add({
        targets: spark,
        x: x + Phaser.Math.Between(-50, 50),
        y: y - Phaser.Math.Between(10, 70),
        alpha: 0,
        scale: 0,
        duration: 600 + i * 40,
        onComplete: () => spark.destroy(),
      });
    }

    playOneUpSound();
  }

  bossProjectileKey(type) {
    return {
      turnip: 'boss-turnip',
      crystal: 'boss-crystal',
      bolt: 'boss-bolt',
      ki: 'boss-ki',
      pellet: 'boss-pellet',
      ink: 'boss-ink',
      shockwave: 'boss-shockwave',
      beam: 'boss-beam',
      spirit: 'boss-spirit',
      fire: 'boss-fire',
    }[type] || 'boss-ki';
  }

  createBossIntroFx(boss) {
    playBossIntroSound();
    this.cameras.main.shake(420, 0.01);
    this.cameras.main.flash(300, 255, 176, 80, false);

    const overlay = this.add.container(0, 0).setScrollFactor(0).setDepth(150).setAlpha(0);
    const dim = this.add.rectangle(0, 0, CANVAS_W, CANVAS_H, 0x04060c, 0.4).setOrigin(0, 0);
    const topBar = this.add.rectangle(0, 0, CANVAS_W, 86, 0x05060a, 0.88).setOrigin(0, 0);
    const bottomBar = this.add.rectangle(0, CANVAS_H - 96, CANVAS_W, 96, 0x05060a, 0.88).setOrigin(0, 0);
    const lineTop = this.add.rectangle(CANVAS_W / 2, 86, 620, 3, 0xffd166, 0.9).setOrigin(0.5, 0);
    const lineBottom = this.add.rectangle(CANVAS_W / 2, CANVAS_H - 96, 620, 3, 0xffd166, 0.9).setOrigin(0.5, 0);

    const kicker = this.add
      .text(CANVAS_W / 2, 120, '⚠ BOSS FIGHT ⚠', {
        fontSize: '16px',
        fontFamily: 'Nunito, sans-serif',
        color: '#ff9f43',
        fontStyle: 'bold',
        letterSpacing: 3,
      })
      .setOrigin(0.5);
    const name = this.add
      .text(CANVAS_W / 2, 178, boss.name.toUpperCase(), {
        fontSize: '54px',
        fontFamily: 'Luckiest Guy, Arial Black, sans-serif',
        color: '#ffd700',
        stroke: '#1a2a52',
        strokeThickness: 9,
        align: 'center',
      })
      .setOrigin(0.5)
      .setScale(0.55);
    const title = this.add
      .text(CANVAS_W / 2, 235, `${boss.title.toUpperCase()} · ${boss.weapon.toUpperCase()}`, {
        fontSize: '15px',
        fontFamily: 'Nunito, sans-serif',
        color: '#ffffff',
        stroke: '#1a2a52',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5);
    const hint = this.add
      .text(CANVAS_W / 2, 272, 'NO RETREAT · DEFEAT THE BOSS BEFORE TIME RUNS OUT', {
        fontSize: '12px',
        fontFamily: 'Nunito, sans-serif',
        color: '#ffd166',
        fontStyle: 'bold',
        letterSpacing: 1.5,
      })
      .setOrigin(0.5);

    overlay.add([dim, topBar, bottomBar, lineTop, lineBottom, kicker, name, title, hint]);

    this.tweens.add({ targets: overlay, alpha: 1, duration: 260, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: name, scale: 1, duration: 420, ease: 'Back.easeOut' });
    this.tweens.add({
      targets: overlay,
      alpha: 0,
      delay: 2150,
      duration: 520,
      ease: 'Quad.easeIn',
      onComplete: () => overlay.destroy(),
    });
  }

  showBossHitPoints(x, y, points, byMe) {
    const label = this.add
      .text(x, y, `+${points}`, {
        fontSize: byMe ? '26px' : '20px',
        fontFamily: 'Luckiest Guy, Arial Black, sans-serif',
        color: byMe ? '#fff3a0' : '#ffd166',
        stroke: '#5a2b00',
        strokeThickness: 5,
      })
      .setOrigin(0.5, 1)
      .setDepth(66)
      .setScale(0.45)
      .setAlpha(0);
    this.tweens.add({
      targets: label,
      alpha: 1,
      scale: byMe ? 1.25 : 1,
      y: y - 18,
      duration: 180,
      ease: 'Back.easeOut',
    });
    this.tweens.add({
      targets: label,
      alpha: 0,
      y: y - 76,
      delay: 430,
      duration: 650,
      ease: 'Quad.easeOut',
      onComplete: () => label.destroy(),
    });
  }

  createBossHitFx(x, y, theme) {    playBossHitSound();
    this.cameras.main.shake(120, 0.004);
    const palettes = {
      grass: [0xff9ec7, 0xffd1e4, 0xffffff],
      cave: [0x7ef9ff, 0xb79cff, 0xffffff],
      sky: [0xfff36b, 0x7dd3fc, 0xffffff],
      castle: [0xffd166, 0x7ef9ff, 0xffffff],
    };
    const colors = palettes[theme] || palettes.grass;
    for (let i = 0; i < 12; i++) {
      const p = this.add.circle(x, y, 3, colors[i % colors.length]).setDepth(55);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-55, 55),
        y: y - Phaser.Math.Between(10, 80),
        alpha: 0,
        scale: 0,
        duration: 420 + i * 30,
        onComplete: () => p.destroy(),
      });
    }
  }

  createFireworkBurst(x, y) {
    playFireworkSound();
    const colors = [0xffd700, 0xff6b9d, 0x7ef9ff, 0x86efac, 0xffa94d, 0xffffff];
    const flash = this.add.circle(x, y, 5, 0xffffff, 0.95).setScrollFactor(0).setDepth(182);
    this.tweens.add({
      targets: flash,
      scale: 5,
      alpha: 0,
      duration: 320,
      ease: 'Quad.easeOut',
      onComplete: () => flash.destroy(),
    });
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const distance = Phaser.Math.Between(38, 95);
      const p = this.add
        .circle(x, y, Phaser.Math.Between(1.8, 3.4), colors[i % colors.length])
        .setScrollFactor(0)
        .setDepth(180);
      this.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance + 18,
        alpha: 0,
        scale: 0.15,
        duration: Phaser.Math.Between(520, 880),
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy(),
      });
    }
  }

  createCelebrationConfetti() {
    const colors = [0xffd700, 0xff6b9d, 0x7ef9ff, 0x86efac, 0xffa94d, 0xffffff, 0x9b7bff];
    for (let i = 0; i < 48; i++) {
      const x = Phaser.Math.Between(0, CANVAS_W);
      const w = Phaser.Math.Between(3, 6);
      const h = Phaser.Math.Between(6, 12);
      const piece = this.add
        .rectangle(x, Phaser.Math.Between(-80, -10), w, h, colors[i % colors.length], 0.95)
        .setScrollFactor(0)
        .setDepth(171);
      this.tweens.add({
        targets: piece,
        x: x + Phaser.Math.Between(-70, 70),
        y: CANVAS_H + 30,
        angle: Phaser.Math.Between(-360, 360),
        duration: Phaser.Math.Between(1500, 2500),
        delay: Phaser.Math.Between(0, 500),
        ease: 'Sine.easeIn',
        onComplete: () => piece.destroy(),
      });
    }
  }

  createCelebrationCoinRain() {
    for (let i = 0; i < 16; i++) {
      const coin = this.add
        .image(Phaser.Math.Between(0, CANVAS_W), Phaser.Math.Between(-60, -10), 'coin')
        .setDisplaySize(16, 16)
        .setScrollFactor(0)
        .setDepth(172);
      this.tweens.add({
        targets: coin,
        x: coin.x + Phaser.Math.Between(-45, 45),
        y: CANVAS_H + 20,
        angle: Phaser.Math.Between(-540, 540),
        duration: Phaser.Math.Between(1500, 2400),
        delay: Phaser.Math.Between(100, 600),
        ease: 'Sine.easeIn',
        onComplete: () => coin.destroy(),
      });
    }
  }

  createBossDefeatFx(boss, sprite) {
    playBossDefeatSound();
    const x = boss.x + boss.w / 2;
    const y = boss.y + boss.h / 2;
    this.cameras.main.shake(650, 0.014);
    this.cameras.main.flash(450, 255, 255, 255, false);
    this.time.delayedCall(220, () => this.cameras.main.flash(180, 255, 209, 102, false));

    if (sprite) {
      sprite.setTint(0xffffff);
      this.tweens.add({
        targets: sprite,
        y: sprite.y - 120,
        angle: 720,
        scaleX: 0.1,
        scaleY: 0.1,
        alpha: 0,
        duration: 1000,
        ease: 'Cubic.easeIn',
        onComplete: () => sprite.destroy(),
      });
    }

    for (let i = 0; i < 38; i++) {
      const colors = [0xffd700, 0xff8c1a, 0x7ef9ff, 0xff9ec7, 0x86efac, 0xffffff];
      const p = this.add.circle(x, y, Phaser.Math.Between(2, 6), colors[i % colors.length]).setDepth(70);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-180, 180),
        y: y + Phaser.Math.Between(-150, 100),
        alpha: 0,
        scale: 0.2,
        rotation: Phaser.Math.Between(-5, 5),
        duration: 700 + i * 22,
        ease: 'Power3',
        onComplete: () => p.destroy(),
      });
    }

    this.createCelebrationConfetti();
    this.createCelebrationCoinRain();
    const fireworkSpots = [
      [CANVAS_W * 0.22, 150], [CANVAS_W * 0.5, 110], [CANVAS_W * 0.78, 155],
      [CANVAS_W * 0.35, 210], [CANVAS_W * 0.65, 205],
    ];
    fireworkSpots.forEach(([fx, fy], i) => {
      this.time.delayedCall(i * 230, () => this.createFireworkBurst(fx, fy));
    });

    const banner = this.add.container(CANVAS_W / 2, CANVAS_H / 2 - 76).setScrollFactor(0).setDepth(160);
    const stars = this.add
      .text(0, -42, '★  ★  ★', {
        fontSize: '20px',
        fontFamily: 'Nunito, sans-serif',
        color: '#ffd166',
        stroke: '#5a2b00',
        strokeThickness: 3,
      })
      .setOrigin(0.5);
    const title = this.add
      .text(0, 6, 'BOSS DEFEATED!', {
        fontSize: '52px',
        fontFamily: 'Luckiest Guy, Arial Black, sans-serif',
        color: '#ffd700',
        stroke: '#1a2a52',
        strokeThickness: 9,
      })
      .setOrigin(0.5);
    const bossLine = this.add
      .text(0, 54, `${boss.name.toUpperCase()} IS DOWN!`, {
        fontSize: '17px',
        fontFamily: 'Nunito, sans-serif',
        color: '#ffffff',
        stroke: '#1a2a52',
        strokeThickness: 4,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    const rewardLine = this.add
      .text(0, 82, '+1000 BOSS BONUS  ·  GATE OPEN  ·  TIME BONUS UNLOCKED', {
        fontSize: '13px',
        fontFamily: 'Nunito, sans-serif',
        color: '#ffd166',
        stroke: '#1a2a52',
        strokeThickness: 4,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    banner.add([stars, title, bossLine, rewardLine]);
    banner.setAlpha(0).setScale(0.35);

    this.tweens.add({ targets: banner, alpha: 1, scale: 1, duration: 360, ease: 'Back.easeOut' });
    this.tweens.add({
      targets: stars,
      scale: 1.22,
      duration: 420,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: title,
      angle: { from: -1.5, to: 1.5 },
      duration: 500,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: banner,
      alpha: 0,
      y: banner.y - 42,
      delay: 2450,
      duration: 560,
      ease: 'Quad.easeIn',
      onComplete: () => banner.destroy(),
    });
  }

  createBossGateBurst(x, y) {
    for (let i = 0; i < 20; i++) {
      const p = this.add.circle(x, y, 3, i % 2 ? 0x7ef9ff : 0xffd166).setDepth(65);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-60, 60),
        y: y + Phaser.Math.Between(-120, 110),
        alpha: 0,
        scale: 0,
        duration: 500 + i * 25,
        onComplete: () => p.destroy(),
      });
    }
  }

  updateBossHud(boss, timeRemaining) {
    if (!this.bossHud) return;
    if (!boss || !boss.active || boss.defeated) {
      this.bossHud.setVisible(false);
      return;
    }
    this.bossHud.setVisible(true);
    const seconds = Math.max(0, Math.ceil((timeRemaining || 0) / 1000));
    const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    const ratio = Math.max(0, boss.hp / boss.maxHp);
    const color = boss.phase === 3 ? 0xff5d73 : boss.phase === 2 ? 0xffa94d : 0x63e6be;

    this.bossNameText.setText(boss.name.toUpperCase());
    this.bossPhaseText.setText(`PHASE ${boss.phase} · ${boss.hp}/${boss.maxHp} HP · ⏱ ${clock}`);
    this.bossTitleText.setText(`${boss.title} · ${boss.weapon}`);
    this.bossBarBack.clear();
    this.bossBarBack.fillStyle(0x1b2438, 0.95);
    this.bossBarBack.fillRoundedRect(CANVAS_W / 2 - 160, 51, 320, 9, 5);
    this.bossBarFill.clear();
    this.bossBarFill.fillStyle(color, 1);
    this.bossBarFill.fillRoundedRect(CANVAS_W / 2 - 160, 51, Math.max(0, 320 * ratio), 9, 5);
  }

  createQuestionParticles(x, y) {
    const colors = [0xffd700, 0xfff3a0, 0xff6f91, 0x4cc9f0];
    for (let i = 0; i < 10; i++) {
      const p = this.add.circle(x, y, 3, colors[i % colors.length]).setDepth(50);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-36, 36),
        y: y - Phaser.Math.Between(16, 58),
        alpha: 0,
        scale: 0,
        duration: 380 + i * 35,
        ease: 'Power2',
        onComplete: () => p.destroy(),
      });
    }
  }

  createEnemyPuff(x, y) {    for (let i = 0; i < 7; i++) {
      const p = this.add.circle(x, y, 3, i % 2 ? 0x8a4a2a : 0xf0c090).setDepth(50);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-24, 24),
        y: y + Phaser.Math.Between(-28, 8),
        alpha: 0,
        duration: 300 + i * 35,
        onComplete: () => p.destroy(),
      });
    }
  }

  createDeathParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const p = this.add.rectangle(x, y, 4, 4, color || 0xff4444).setDepth(50);
      this.tweens.add({
        targets: p,
        x: x + Phaser.Math.Between(-55, 55),
        y: y + Phaser.Math.Between(-70, 20),
        alpha: 0,
        rotation: Phaser.Math.Between(-3, 3),
        scale: 0.2,
        duration: 500 + i * 30,
        ease: 'Power4',
        onComplete: () => p.destroy(),
      });
    }
  }

  createHUD() {
    this.hudContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(100);

    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x000000, 0.65);
    panelBg.fillRoundedRect(CANVAS_W - 178, 8, 170, 86, 8);
    this.hudContainer.add(panelBg);

    this.add
      .text(CANVAS_W - 16, 14, 'RACE', {
        fontSize: '13px', fontFamily: 'monospace', color: '#ffd700', fontStyle: 'bold',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.standingsTexts = [];
    for (let i = 0; i < 3; i++) {
      const t1 = this.add
        .text(CANVAS_W - 16, 36 + i * 20, '', {
          fontSize: '12px', fontFamily: 'monospace', color: '#ccc',
        })
        .setOrigin(1, 0)
        .setScrollFactor(0)
        .setDepth(100);
      const t2 = this.add
        .text(CANVAS_W - 16, 46 + i * 20, '', {
          fontSize: '10px', fontFamily: 'monospace', color: '#999',
        })
        .setOrigin(1, 0)
        .setScrollFactor(0)
        .setDepth(100);
      this.standingsTexts.push([t1, t2]);
    }

    const timerBg = this.add.graphics();
    timerBg.fillStyle(0x000000, 0.65);
    timerBg.fillRoundedRect(8, 8, 148, 28, 6);
    this.hudContainer.add(timerBg);

    this.timerText = this.add
      .text(16, 12, '⏱ 2:00', {
        fontSize: '15px', fontFamily: 'monospace', color: '#fff', fontStyle: 'bold',
      })
      .setScrollFactor(0)
      .setDepth(100);

    this.bossHud = this.add.container(0, 0).setScrollFactor(0).setDepth(106).setVisible(false);
    const bossPanel = this.add.graphics();
    bossPanel.fillStyle(0x06090f, 0.82);
    bossPanel.fillRoundedRect(CANVAS_W / 2 - 200, 6, 400, 66, 10);
    bossPanel.lineStyle(2, 0xffd166, 0.5);
    bossPanel.strokeRoundedRect(CANVAS_W / 2 - 200, 6, 400, 66, 10);
    this.bossHud.add(bossPanel);
    this.bossNameText = this.add
      .text(CANVAS_W / 2 - 184, 11, '', {
        fontSize: '16px', fontFamily: 'Luckiest Guy, Arial Black, sans-serif', color: '#ffd166',
      })
      .setScrollFactor(0);
    this.bossPhaseText = this.add
      .text(CANVAS_W / 2 + 184, 12, '', {
        fontSize: '11px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0);
    this.bossTitleText = this.add
      .text(CANVAS_W / 2 - 184, 31, '', {
        fontSize: '10px', fontFamily: 'Nunito, sans-serif', color: '#cbd5e1', fontStyle: 'bold',
      })
      .setScrollFactor(0);
    this.bossHitBonusText = this.add
      .text(CANVAS_W / 2 + 184, 31, '+150/HIT', {
        fontSize: '10px', fontFamily: 'Nunito, sans-serif', color: '#ffd166', fontStyle: 'bold',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0);
    this.bossBarBack = this.add.graphics().setScrollFactor(0);
    this.bossBarFill = this.add.graphics().setScrollFactor(0);
    this.bossHud.add([
      this.bossNameText,
      this.bossPhaseText,
      this.bossTitleText,
      this.bossHitBonusText,
      this.bossBarBack,
      this.bossBarFill,
    ]);

    this.finishOverlay = this.add.container(0, 0).setScrollFactor(0).setDepth(200).setVisible(false);
    const dimBg = this.add.graphics();
    dimBg.fillStyle(0x000000, 0.75);
    dimBg.fillRect(0, 0, CANVAS_W, CANVAS_H);
    this.finishOverlay.add(dimBg);

    this.finishTitle = this.add
      .text(CANVAS_W / 2, CANVAS_H / 2 - 52, 'FINISH!', {
        fontSize: '52px',
        fontFamily: 'Luckiest Guy, Arial Black, sans-serif',
        color: '#ffd700',
        stroke: '#1a2a52',
        strokeThickness: 6,
      })
      .setOrigin(0.5);
    this.finishOverlay.add(this.finishTitle);

    this.finishResult1 = this.add
      .text(CANVAS_W / 2, CANVAS_H / 2 + 10, '', {
        fontSize: '22px', fontFamily: 'Nunito, sans-serif', color: '#fff',
      })
      .setOrigin(0.5);
    this.finishOverlay.add(this.finishResult1);

    this.finishResult2 = this.add
      .text(CANVAS_W / 2, CANVAS_H / 2 + 44, '', {
        fontSize: '20px', fontFamily: 'Nunito, sans-serif', color: '#cbd5e1',
      })
      .setOrigin(0.5);
    this.finishOverlay.add(this.finishResult2);

    this.finishBossText = this.add
      .text(CANVAS_W / 2, CANVAS_H / 2 + 82, '', {
        fontSize: '16px', fontFamily: 'Nunito, sans-serif', color: '#ffd166', fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.finishOverlay.add(this.finishBossText);
  }

  updateState(stateData) {
    if (!stateData || !this.playerSprites) return;
    if (!this.sys?.isActive?.()) return;

    for (const sp of stateData.players) {
      const sprite = this.playerSprites[sp.id];
      if (!sprite) continue;
      const prev = this.prevPlayerState[sp.id];
      const target = this.playerTargets[sp.id];
      target.x = sp.x + PLAYER_W / 2;
      target.y = sp.y + PLAYER_H / 2;
      if (!prev || sp.justDied || (sp.alive && !prev.alive)) target.teleport = true;
      if (sp.jumped && sp.id === this.myId) playJumpSound(sp.jumps === 2);

      if (sp.justDied && !this.deathGhosts[sp.id]) {
        this.createDeathAnimation(sp, sprite);
      }
      if (prev && sp.lives > prev.lives && !sp.dying) {
        this.createLifeGainAnimation(sprite);
      }
      if (sp.alive && prev && !prev.alive) {
        const ghost = this.deathGhosts[sp.id];
        if (ghost) ghost.destroy();
        this.deathGhosts[sp.id] = null;
        sprite.setVisible(true);
      }

      if (sp.justDied) {
        const palette = getPaletteByAvatar(this.avatars[sp.id]);
        this.createDeathParticles(sp.x + PLAYER_W / 2, sp.y + PLAYER_H / 2, parseInt(palette.hat.replace('#', ''), 16));
        this.cameras.main.shake(180, 0.006);
      }

      const key = getRunnerTextureKey(this.avatars[sp.id]);
      const cheering = sp.alive && !sp.dying && this.time.now < (this.celebrateUntil || 0);
      if (cheering) sprite.anims.play(`${key}_cheer`, true);
      else if (sp.dying || !sp.alive) sprite.anims.play(`${key}_die`, true);
      else if (!sp.onGround) sprite.anims.play(sp.vy < 0 ? `${key}_jump` : `${key}_fall`, true);
      else if (Math.abs(sp.vx) > 0.5) sprite.anims.play(`${key}_walk`, true);
      else sprite.anims.play(`${key}_idle`, true);

      sprite.setFlipX(sp.facing < 0);
      if (sp.starTicks > 0) sprite.setTint(0xffe066);
      else sprite.clearTint();
      if (sp.alive && !sp.dying && (sp.invulnTicks || 0) > 0) {
        const flicker = Math.abs(Math.sin((this.time.now || 0) / 85));
        sprite.setAlpha(0.35 + flicker * 0.6);
      } else {
        sprite.setAlpha(1);
      }
      if (sp.id === this.cameraTargetId && !this.cameraFixedForBoss) {
        this.cameras.main.setFollowOffset(sp.facing > 0 ? 90 : -90, 0);
      }

      this.prevPlayerState[sp.id] = sp;
    }

    const localPlayerState = stateData.players.find((p) => p.id === this.myId);
    if (localPlayerState?.gameOver && !this.gameOverShown) {
      this.gameOverShown = true;
      playGameOverSound();
      this.cameras.main.shake(550, 0.014);
      this.createDeathParticles(
        localPlayerState.x + PLAYER_W / 2,
        localPlayerState.y + PLAYER_H / 2,
        0xff5d73
      );
    }

    const newCoinPositions = new Set(
      stateData.coins.map((c) => `${Math.round(c.x)}_${Math.round(c.y)}`)
    );
    for (const key of this.prevCoins) {
      if (!newCoinPositions.has(key)) {
        const [cx, cy] = key.split('_').map(Number);
        this.createCoinCollectParticles(cx, cy);
      }
    }
    for (const coin of this.coinGroup.getChildren().slice()) {
      const key = `${Math.round(coin.x)}_${Math.round(coin.y)}`;
      if (!newCoinPositions.has(key)) coin.destroy();
    }
    this.prevCoins = newCoinPositions;

    for (const qb of stateData.questionBlocks || []) {
      const key = `${qb.x}_${qb.y}`;
      const img = this.questionSprites.get(key);
      if (!img) continue;
      img.setFrame(qb.hit ? 2 : 0);
      if (qb.hit && !this.prevQuestionHit.has(key)) {
        this.prevQuestionHit.add(key);
        this.createQuestionParticles(qb.x + qb.w / 2, qb.y + qb.h / 2);
        playQuestionHitSound();
        playQuestionRewardSound(qb.reward);
      }
    }

    const boss = stateData.boss;
    if (boss) {
      if (boss.active && !this.bossWasActive) {
        this.bossWasActive = true;
        startBossMusic(boss.theme);
        this.createBossIntroFx(boss);
      }
      if (boss.active && !boss.defeated) {
        const arenaStart = this.levelData?.arena?.start ?? 8200;
        const localState = stateData.players.find((p) => p.id === this.myId);
        const localInsideArena = !localState || localState.x >= arenaStart - 80;
        if (localInsideArena) this.lockCameraForBoss();
      }

      const wallShouldShow = !!(boss.active && !boss.defeated);
      if (this.bossWall && wallShouldShow !== this.bossWallActive) {
        this.bossWallActive = wallShouldShow;
        this.tweens.killTweensOf(this.bossWall);
        if (wallShouldShow) {
          this.bossWall.setVisible(true).setAlpha(0).setScale(1, 0.05);
          this.createBossGateBurst(this.bossWall.x, this.groundTop - 30);
          this.tweens.add({
            targets: this.bossWall,
            alpha: 1,
            scaleY: 1,
            duration: 520,
            ease: 'Back.easeOut',
          });
        } else {
          this.tweens.add({
            targets: this.bossWall,
            alpha: 0,
            scaleY: 0.05,
            duration: 360,
            onComplete: () => this.bossWall.setVisible(false),
          });
        }
      }
      if (this.bossTelegraph) {
        const showTelegraph = !!(boss.blinkTelegraph && !boss.defeated);
        this.bossTelegraph.setVisible(showTelegraph);
        if (showTelegraph) {
          this.bossTelegraph.setPosition(boss.blinkTargetX, boss.blinkTargetY);
          if (!this.prevBlinkTelegraph) playBossShotSound('bolt');
        }
        this.prevBlinkTelegraph = !!boss.blinkTelegraph;
      }

      if (this.bossSprite) {
        this.bossTarget = {
          x: boss.x + boss.w / 2,
          y: boss.y + boss.h / 2,
          teleport: !!boss.teleported,
        };
        this.bossSprite.setFlipX((boss.dir ?? 1) < 0);
        if (boss.hitFlash > 0) this.bossSprite.setTint(0xffffff);
        else if (boss.phase === 3) this.bossSprite.setTint(0xfff0b3);
        else this.bossSprite.clearTint();

        if (this.bossPrevHp != null && boss.hp < this.bossPrevHp) {
          this.createBossHitFx(boss.x + boss.w / 2, boss.y + boss.h / 2, boss.theme);
          this.showBossHitPoints(
            boss.x + boss.w / 2,
            boss.y - 4,
            boss.lastHitPoints || 150,
            boss.lastHitBy === this.myId
          );
        }
        this.bossPrevHp = boss.hp;

        if (this.bossTauntText) {
          if (boss.tauntTicks > 0 && boss.taunt) {
            this.bossTauntText.setText(boss.taunt).setVisible(true);
          } else {
            this.bossTauntText.setVisible(false);
          }
        }

        if (boss.defeated && !this.bossWasDefeated) {
          this.bossWasDefeated = true;
          this.celebrateUntil = (this.time.now || 0) + 2200;
          stopBossMusic(0.2);
          this.createBossDefeatFx(boss, this.bossSprite);
          this.cameraFixedForBoss = false;
          this.updateCameraFollow();
          if (this.bossTauntText) this.bossTauntText.setVisible(false);
          this.bossSprite = null;
          this.bossTarget = null;
        }
      }

      if (boss.gateOpen && this.bossGate && !this.bossGateOpened) {
        this.bossGateOpened = true;
        this.tweens.killTweensOf(this.bossGate);
        this.createBossGateBurst(this.bossGate.x + 15, this.bossGate.y + 115);
        this.tweens.add({
          targets: this.bossGate,
          alpha: 0,
          scaleY: 1.18,
          duration: 500,
          ease: 'Quad.easeOut',
          onComplete: () => {
            this.bossGate.destroy();
            this.bossGate = null;
          },
        });
      }

      const liveShots = new Map((boss.projectiles || []).map((shot) => [shot.id, shot]));
      for (const [id, sprite] of this.bossProjectileSprites) {
        if (!liveShots.has(id)) {
          sprite.destroy();
          this.bossProjectileSprites.delete(id);
          this.bossProjectileTargets.delete(id);
        }
      }
      for (const shot of boss.projectiles || []) {
        let sprite = this.bossProjectileSprites.get(shot.id);
        if (!sprite) {
          const key = this.bossProjectileKey(shot.type);
          sprite = this.add
            .sprite(shot.x + shot.w / 2, shot.y + shot.h / 2, key)
            .setDisplaySize(shot.w, shot.h)
            .setDepth(12);
          if (shot.type === 'beam') {
            sprite.setAlpha(0.3).setTint(0xff6b6b);
          } else if (shot.type === 'spirit') {
            sprite.setAlpha(0.95);
          }
          this.bossProjectileSprites.set(shot.id, sprite);
          this.bossProjectileTargets.set(shot.id, {
            x: shot.x + shot.w / 2,
            y: shot.y + shot.h / 2,
            teleport: true,
          });
          playBossShotSound(shot.type);
        }
        const target = this.bossProjectileTargets.get(shot.id);
        if (target) {
          target.x = shot.x + shot.w / 2;
          target.y = shot.y + shot.h / 2;
        }
        if (shot.type === 'beam') {
          sprite.setDisplaySize(shot.w, shot.h);
          if (shot.delay > 0) {
            sprite.setAlpha(0.28).setTint(0xff6b6b);
          } else {
            sprite.setAlpha(0.95).clearTint();
          }
        } else if (shot.type === 'crystal' || shot.type === 'turnip') {
          sprite.setRotation(Math.atan2(shot.vy, shot.vx));
        }
      }
    }
    this.updateBossHud(boss, stateData.timeRemaining);
    if (this.zoneLabel) {
      this.zoneLabel.setVisible(!(boss && boss.active && !boss.defeated));
    }

    const liveEnemyShots = new Map((stateData.enemyProjectiles || []).map((shot) => [shot.id, shot]));
    for (const [id, sprite] of this.enemyProjectileSprites) {
      if (!liveEnemyShots.has(id)) {
        sprite.destroy();
        this.enemyProjectileSprites.delete(id);
        this.enemyProjectileTargets.delete(id);
      }
    }
    for (const shot of stateData.enemyProjectiles || []) {
      let sprite = this.enemyProjectileSprites.get(shot.id);
      if (!sprite) {
        sprite = this.add
          .sprite(shot.x + shot.w / 2, shot.y + shot.h / 2, 'enemy-fireball')
          .setDisplaySize(shot.w, shot.h)
          .setDepth(13);
        this.enemyProjectileSprites.set(shot.id, sprite);
        this.enemyProjectileTargets.set(shot.id, {
          x: shot.x + shot.w / 2,
          y: shot.y + shot.h / 2,
          teleport: true,
        });
        playBossShotSound('fire');
      }
      const target = this.enemyProjectileTargets.get(shot.id);
      if (target) {
        target.x = shot.x + shot.w / 2;
        target.y = shot.y + shot.h / 2;
      }
      sprite.setRotation(Math.atan2(shot.vy, shot.vx));
    }

    const liveEnemies = new Map(stateData.enemies.map((e) => [e.id, e]));
    for (const [id, sprite] of this.enemySprites) {
      if (!liveEnemies.has(id)) {
        this.createEnemyPuff(sprite.x, sprite.y);
        playEnemyStompSound();
        sprite.destroy();
        this.enemySprites.delete(id);
        this.enemyTargets.delete(id);
      }
    }
    for (const enemy of stateData.enemies) {
      let sprite = this.enemySprites.get(enemy.id);
      if (!sprite) {
        const key = getEnemyTextureKey(enemy.type);
        sprite = this.add
          .sprite(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, key)
          .setDisplaySize(enemy.w, enemy.h)
          .setDepth(6);
        const zone = this.getZone(enemy.x + enemy.w / 2);
        const tint = this.getEnemyTint(enemy.type, zone.id);
        if (tint === null) sprite.clearTint();
        else sprite.setTint(tint);
        sprite.play(`${key}_walk`);
        this.enemySprites.set(enemy.id, sprite);
      }
      this.enemyTargets.set(enemy.id, { x: enemy.x + enemy.w / 2, y: enemy.y + enemy.h / 2 });
      if (enemy.type === 'spitter') {
        if (enemy.charging) sprite.setTint(0xffe066);
        else sprite.clearTint();
      }
    }

    const timeSec = Math.ceil((stateData.timeRemaining || 0) / 1000);
    const min = Math.floor(timeSec / 60);
    const sec = timeSec % 60;
    this.timerText.setText(`⏱ ${min}:${sec.toString().padStart(2, '0')}`);
    this.timerText.setColor(timeSec <= 30 ? '#ff6b6b' : '#ffffff');

    const sorted = [...stateData.players].sort((a, b) => {
      if (a.finished && b.finished) return (a.finishTime || 0) - (b.finishTime || 0);
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.distance - a.distance;
    });
    for (let i = 0; i < this.standingsTexts.length; i++) {
      const [t1, t2] = this.standingsTexts[i];
      const p = sorted[i];
      if (!p) {
        t1.setText('');
        t2.setText('');
        continue;
      }
      const isMe = p.id === this.myId;
      const name = p.id === this.player1Data?.id ? this.player1Data?.name : this.player2Data?.name;
      t1.setColor(isMe ? '#ffd700' : '#e5e7eb');
      t1.setText(`${i + 1}. ${name?.slice(0, 9) || '???'}${p.finished ? ' 🏁' : ''}`);
      t2.setColor(isMe ? '#ffd700' : '#94a3b8');
      t2.setText(`${p.distance}m`);
    }

    if (stateData.finished && this.player1Data) {
      stopBossMusic(0.3);
      const sortedLocal = sorted;
      this.finishOverlay.setVisible(true);
      if (stateData.endReason === 'gameover') {
        const localResult = sortedLocal.find((p) => p.id === this.myId) || sortedLocal[0];
        const localName = localResult?.id === this.player1Data?.id ? this.player1Data?.name : this.player2Data?.name;
        this.finishTitle.setText('GAME OVER!').setColor('#ff5d73');
        this.finishResult1.setText(
          localResult
            ? `💀 ${localName || 'Player'} — ${localResult.distance}m · ${localResult.points || 0} pts`
            : 'Out of lives'
        );
        this.finishResult2.setText('No more respawns');
        this.finishBossText.setText('The run is over');
      } else {
        this.finishTitle.setColor('#ffd700');
        if (stateData.endReason === 'timeout') this.finishTitle.setText('TIME UP!');
        else this.finishTitle.setText(this.isTraining ? 'TRAINING COMPLETE!' : 'FINISH!');
        if (sortedLocal[0]) {
          const wName = sortedLocal[0].id === this.player1Data?.id ? this.player1Data?.name : this.player2Data?.name;
          this.finishResult1.setText(`🥇 ${wName} — ${sortedLocal[0].distance}m · ${sortedLocal[0].points || 0} pts`);
        }
        if (this.player2Data && sortedLocal[1]) {
          const lName = sortedLocal[1].id === this.player1Data?.id ? this.player1Data?.name : this.player2Data?.name;
          this.finishResult2.setText(`🥈 ${lName} — ${sortedLocal[1].distance}m · ${sortedLocal[1].points || 0} pts`);
        } else {
          this.finishResult2.setText('');
        }
        const finishBoss = stateData.boss;
        if (finishBoss) {
          this.finishBossText.setText(
            finishBoss.defeated
              ? `👑 ${finishBoss.name} defeated — time bonus paid!`
              : `⏰ ${finishBoss.name} survived — no boss or time bonus`
          );
        } else {
          this.finishBossText.setText('');
        }
      }
    }
  }
}
