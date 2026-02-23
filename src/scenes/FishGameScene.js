import Phaser from 'phaser';
import gameState from '../utils/GameState';

export default class FishGameScene extends Phaser.Scene {
  constructor() {
    super('FishGameScene');
  }

  create() {
    this.score = 0;
    this.gainedCoins = 0;
    this.timeLeft = 60;
    this.items = this.physics.add.group();
    this.ended = false;

    this.cameras.main.setBackgroundColor('#e6f6ff');

    if (!gameState.consumeStamina(this, 1)) {
      this.scene.start('HomeScene');
      return;
    }

    this.add.text(195, 38, '생선 세금 징수', {
      fontSize: '30px',
      fontStyle: 'bold',
      color: '#14425e',
    }).setOrigin(0.5);

    this.scoreText = this.add.text(20, 86, '점수: 0', { fontSize: '22px', color: '#143648' });
    this.coinText = this.add.text(20, 118, '획득 코인: 0', { fontSize: '22px', color: '#143648' });
    this.timerText = this.add.text(20, 150, '남은 시간: 60', { fontSize: '22px', color: '#143648' });

    this.spawnTimer = this.time.addEvent({
      delay: 550,
      callback: this.spawnItem,
      callbackScope: this,
      loop: true,
    });

    this.countdown = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.timeLeft -= 1;
        this.timerText.setText(`남은 시간: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
          this.endGame();
        }
      },
    });

    this.events.once('shutdown', this.cleanupTimers, this);
  }

  spawnItem() {
    const isFish = Math.random() > 0.35;
    const texture = isFish ? 'item_fish' : 'item_rat';
    const x = Phaser.Math.Between(30, 360);

    const item = this.physics.add.image(x, -20, texture)
      .setInteractive({ useHandCursor: true })
      .setData('isFish', isFish);

    item.body.setVelocityY(Phaser.Math.Between(180, 300));

    item.on('pointerdown', () => {
      if (item.getData('isFish')) {
        this.score += 1;
        this.gainedCoins += 2;
      } else {
        this.score -= 2;
      }
      this.refreshUi();
      item.destroy();
    });

    this.items.add(item);
  }

  refreshUi() {
    this.scoreText.setText(`점수: ${this.score}`);
    this.coinText.setText(`획득 코인: ${this.gainedCoins}`);
  }

  update() {
    this.items.getChildren().forEach((item) => {
      if (item.y > 900) {
        item.destroy();
      }
    });
  }

  cleanupTimers() {
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
    if (this.ended) return;
    this.ended = true;

    this.cleanupTimers();
    this.items.getChildren().forEach((item) => item.destroy());

    if (this.gainedCoins > 0) {
      gameState.addCoins(this, this.gainedCoins);
    }

    const overlay = this.add.rectangle(195, 422, 330, 260, 0x000000, 0.74)
      .setStrokeStyle(2, 0xffffff);

    this.add.text(195, 350, '노동 종료!', {
      fontSize: '30px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(195, 410, `최종 점수: ${this.score}\n획득 코인: ${this.gainedCoins}`, {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);

    const backBtn = this.add.rectangle(195, 500, 180, 50, 0xffd260, 1)
      .setStrokeStyle(2, 0x222222)
      .setInteractive({ useHandCursor: true });

    this.add.text(195, 500, '홈으로 복귀', {
      fontSize: '22px',
      color: '#222222',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    backBtn.on('pointerdown', () => {
      overlay.destroy();
      this.scene.start('HomeScene');
    });
  }
}
