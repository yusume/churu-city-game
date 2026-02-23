import Phaser from 'phaser';
import gameState from '../utils/GameState';

export default class SlotGameScene extends Phaser.Scene {
  constructor() {
    super('SlotGameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#f5f1ff');
    this.add.text(195, 70, '츄르 복권 🎰', { fontSize: '34px', color: '#3d2f7a', fontStyle: 'bold' }).setOrigin(0.5);

    this.result = this.add.text(195, 350, '코인 10을 내고 레버를 당기세요!', { fontSize: '22px', color: '#2d2d2d', align: 'center' }).setOrigin(0.5);

    const spinBtn = this.add.rectangle(195, 430, 220, 60, 0xffdf71).setStrokeStyle(2, 0x2d2d2d).setInteractive({ useHandCursor: true });
    this.add.text(195, 430, '복권 돌리기 (-10)', { fontSize: '24px', color: '#2d2d2d' }).setOrigin(0.5);

    spinBtn.on('pointerdown', () => {
      if (!gameState.spendCoins(this, 10)) {
        this.result.setText('코인이 부족합니다 😿');
        return;
      }
      const multipliers = [0, 1, 2, 3, 5];
      const m = Phaser.Utils.Array.GetRandom(multipliers);
      const reward = 10 * m;
      gameState.addCoins(this, reward);
      this.result.setText(`배율 x${m}!\n보상 코인 +${reward}`);
    });

    const back = this.add.rectangle(195, 800, 170, 50, 0xaed6ff).setStrokeStyle(2, 0x2d2d2d).setInteractive({ useHandCursor: true });
    this.add.text(195, 800, '뒤로', { fontSize: '22px', color: '#1f1f1f' }).setOrigin(0.5);
    back.on('pointerdown', () => this.scene.start('GameSelectScene'));
  }
}
