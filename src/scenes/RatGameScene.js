import Phaser from 'phaser';
import gameState from '../utils/GameState';

export default class RatGameScene extends Phaser.Scene {
  constructor() {
    super('RatGameScene');
  }

  create() {
    this.kills = 0;
    this.timeLeft = 20;

    this.cameras.main.setBackgroundColor('#fff3f3');

    if (!gameState.consumeStamina(this, 1)) {
      this.scene.start('HomeScene');
      return;
    }

    this.add.text(195, 70, '쥐 단속 🐀', { fontSize: '34px', color: '#7a2f2f', fontStyle: 'bold' }).setOrigin(0.5);
    this.hud = this.add.text(195, 120, '처치: 0 | 남은시간: 20', { fontSize: '22px', color: '#333' }).setOrigin(0.5);

    this.rat = this.add.image(195, 420, 'item_rat').setScale(2).setInteractive({ useHandCursor: true });
    this.rat.on('pointerdown', () => {
      this.kills += 1;
      this.rat.setPosition(Phaser.Math.Between(40, 350), Phaser.Math.Between(190, 720));
      this.refresh();
    });

    this.timer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.timeLeft -= 1;
        this.refresh();
        if (this.timeLeft <= 0) {
          this.endGame();
        }
      },
    });

    this.events.once('shutdown', this.cleanup, this);
  }

  cleanup() {
    if (this.timer) {
      this.timer.remove(false);
      this.timer = null;
    }
  }

  endGame() {
    this.cleanup();
    const reward = this.kills * 3;
    gameState.addCoins(this, reward);
    this.scene.start('GameSelectScene');
  }

  refresh() {
    this.hud.setText(`처치: ${this.kills} | 남은시간: ${this.timeLeft}`);
  }
}
