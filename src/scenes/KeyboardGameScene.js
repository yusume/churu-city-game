import Phaser from 'phaser';
import gameState from '../utils/GameState';

export default class KeyboardGameScene extends Phaser.Scene {
  constructor() {
    super('KeyboardGameScene');
  }

  create() {
    this.score = 0;
    this.timeLeft = 20;
    this.isGameOver = false;

    this.cameras.main.setBackgroundColor('#fef7f9');

    if (!gameState.consumeStamina(this, 1)) {
      this.scene.start('HomeScene');
      return;
    }

    this.add.text(195, 72, '키보드 방어전 🛡️', {
      fontSize: '32px',
      color: '#7a3650',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.hud = this.add.text(195, 120, '점수: 0 | 남은시간: 20', {
      fontSize: '22px',
      color: '#3a2f2f',
    }).setOrigin(0.5);

    this.defenseLineY = 680;
    this.add.rectangle(195, this.defenseLineY, 380, 12, 0xffc7d7, 0.75);
    this.add.text(195, this.defenseLineY - 20, '방어선', { fontSize: '16px', color: '#b04a6d' }).setOrigin(0.5);

    this.items = this.physics.add.group();

    this.spawnTimer = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: this.spawnPaw,
      callbackScope: this,
    });

    this.countdown = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.isGameOver) return;
        this.timeLeft -= 1;
        this.refresh();
        if (this.timeLeft <= 0) this.endGame();
      },
    });

    const back = this.add.rectangle(195, 800, 170, 50, 0xaed6ff).setStrokeStyle(2, 0x2d2d2d).setInteractive({ useHandCursor: true });
    this.add.text(195, 800, '뒤로', { fontSize: '22px', color: '#1f1f1f' }).setOrigin(0.5);
    back.on('pointerdown', () => this.scene.start('GameSelectScene'));

    this.events.once('shutdown', this.cleanup, this);
  }

  spawnPaw() {
    if (this.isGameOver) return;

    const item = this.add.circle(Phaser.Math.Between(30, 360), -20, 22, 0xf18faf)
      .setStrokeStyle(2, 0x7a3650)
      .setInteractive({ useHandCursor: true });

    this.physics.add.existing(item);
    item.body.setVelocityY(Phaser.Math.Between(240, 390));

    item.on('pointerdown', () => {
      if (this.isGameOver) return;
      this.score += 2;
      this.refresh();
      this.tweens.add({ targets: item, alpha: 0, scaleX: 0.2, scaleY: 0.2, duration: 120, onComplete: () => item.destroy() });
    });

    this.items.add(item);
  }

  update() {
    if (this.isGameOver) return;

    this.items.getChildren().forEach((item) => {
      if (item.y > this.defenseLineY) {
        this.score = Math.max(0, this.score - 1);
        this.refresh();
        item.destroy();
      }
    });
  }

  refresh() {
    this.hud.setText(`점수: ${this.score} | 남은시간: ${this.timeLeft}`);
  }

  cleanup() {
    if (this.spawnTimer) {
      this.spawnTimer.remove(false);
      this.spawnTimer = null;
    }

    if (this.countdown) {
      this.countdown.remove(false);
      this.countdown = null;
    }
  }

  endGame() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.cleanup();

    this.items.getChildren().forEach((item) => item.destroy());

    gameState.addCoins(this, this.score);

    const overlay = this.add.rectangle(195, 422, 330, 250, 0x000000, 0.75).setStrokeStyle(2, 0xffffff);
    this.add.text(195, 360, '방어 성공!', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(195, 430, `획득 코인: ${this.score}`, {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const home = this.add.rectangle(195, 500, 190, 50, 0xffd260).setStrokeStyle(2, 0x222222).setInteractive({ useHandCursor: true });
    this.add.text(195, 500, '게임 선택으로', { fontSize: '22px', color: '#222222', fontStyle: 'bold' }).setOrigin(0.5);

    home.on('pointerdown', () => {
      overlay.destroy();
      this.scene.start('GameSelectScene');
    });
  }
}
