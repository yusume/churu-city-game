import Phaser from 'phaser';
import gameState from '../utils/GameState';

export default class ChuruSqueezeGameScene extends Phaser.Scene {
  constructor() {
    super('ChuruSqueezeGameScene');
  }

  create() {
    this.score = 0;
    this.timeLeft = 15;
    this.isGameOver = false;
    this.startY = 0;

    this.cameras.main.setBackgroundColor('#fff8f0');

    if (!gameState.consumeStamina(this, 1)) {
      this.scene.start('HomeScene');
      return;
    }

    this.add.text(195, 70, '츄르 짜기 👆', {
      fontSize: '34px',
      color: '#9a5c2f',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.hud = this.add.text(195, 118, '스와이프: 0 | 남은시간: 15', {
      fontSize: '22px',
      color: '#3a2f2f',
    }).setOrigin(0.5);

    this.add.text(195, 160, '아래에서 위로 빠르게 올리세요!', {
      fontSize: '20px',
      color: '#7a6a58',
    }).setOrigin(0.5);

    this.tube = this.add.rectangle(195, 500, 90, 320, 0xff9a68).setStrokeStyle(4, 0xbf4f2c);
    this.add.text(195, 500, 'CHURU', {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAngle(-90);

    this.input.on('pointerdown', (pointer) => {
      this.startY = pointer.y;
    });

    this.input.on('pointerup', (pointer) => {
      if (this.isGameOver) return;
      if (this.startY - pointer.y < 45) return;

      this.score += 1;
      this.refresh();

      this.tweens.add({ targets: this.tube, y: 506, duration: 60, yoyo: true });

      const drop = this.add.circle(195, 342, 12, 0xffd869);
      this.tweens.add({
        targets: drop,
        x: 195 + Phaser.Math.Between(-24, 24),
        y: 230,
        alpha: 0,
        scale: 0.25,
        duration: 380,
        onComplete: () => drop.destroy(),
      });
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

    const quit = this.add.rectangle(320, 70, 120, 42, 0xffb3b3).setStrokeStyle(2, 0x2d2d2d).setInteractive({ useHandCursor: true });
    this.add.text(320, 70, '게임 종료', { fontSize: '18px', color: '#2d2d2d', fontStyle: 'bold' }).setOrigin(0.5);
    quit.on('pointerdown', () => this.quitGame());

    this.events.once('shutdown', this.cleanup, this);
  }

  refresh() {
    this.hud.setText(`스와이프: ${this.score} | 남은시간: ${this.timeLeft}`);
  }

  cleanup() {
    if (this.countdown) {
      this.countdown.remove(false);
      this.countdown = null;
    }
  }

  quitGame() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.cleanup();
    this.scene.start('GameSelectScene');
  }

  endGame() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.cleanup();

    const reward = Math.floor(this.score / 2);
    gameState.addCoins(this, reward);

    const overlay = this.add.rectangle(195, 422, 330, 250, 0x000000, 0.75).setStrokeStyle(2, 0xffffff);
    this.add.text(195, 360, '짜기 완료!', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(195, 430, `스와이프 ${this.score}회\n획득 코인: ${reward}`, {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    const home = this.add.rectangle(195, 510, 190, 50, 0xffd260).setStrokeStyle(2, 0x222222).setInteractive({ useHandCursor: true });
    this.add.text(195, 510, '게임 선택으로', { fontSize: '22px', color: '#222222', fontStyle: 'bold' }).setOrigin(0.5);

    home.on('pointerdown', () => {
      overlay.destroy();
      this.scene.start('GameSelectScene');
    });
  }
}
