import Phaser from 'phaser';
import gameState from '../utils/GameState';

const OUTCOMES = [
  { mult: 0, weight: 30 },
  { mult: 1, weight: 35 },
  { mult: 2, weight: 20 },
  { mult: 3, weight: 12 },
  { mult: 5, weight: 3 },
];

function pickWeightedOutcome() {
  const total = OUTCOMES.reduce((sum, o) => sum + o.weight, 0);
  let roll = Math.random() * total;

  for (const outcome of OUTCOMES) {
    roll -= outcome.weight;
    if (roll <= 0) {
      return outcome.mult;
    }
  }

  return OUTCOMES[OUTCOMES.length - 1].mult;
}

export default class SlotGameScene extends Phaser.Scene {
  constructor() {
    super('SlotGameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#f5f1ff');
    this.add.text(195, 70, '츄르 복권 🎰', { fontSize: '34px', color: '#3d2f7a', fontStyle: 'bold' }).setOrigin(0.5);

    const quit = this.add.rectangle(320, 70, 120, 42, 0xffb3b3).setStrokeStyle(2, 0x2d2d2d).setInteractive({ useHandCursor: true });
    this.add.text(320, 70, '게임 종료', { fontSize: '18px', color: '#2d2d2d', fontStyle: 'bold' }).setOrigin(0.5);
    quit.on('pointerdown', () => this.scene.start('GameSelectScene'));

    this.result = this.add.text(195, 350, '코인 10을 내고 레버를 당기세요!', { fontSize: '22px', color: '#2d2d2d', align: 'center' }).setOrigin(0.5);

    const spinBtn = this.add.rectangle(195, 430, 220, 60, 0xffdf71).setStrokeStyle(2, 0x2d2d2d).setInteractive({ useHandCursor: true });
    this.add.text(195, 430, '복권 돌리기 (-10)', { fontSize: '24px', color: '#2d2d2d' }).setOrigin(0.5);

    spinBtn.on('pointerdown', () => {
      if (!gameState.spendCoins(this, 10)) {
        this.result.setText('코인이 부족합니다 😿');
        return;
      }

      const multiplier = pickWeightedOutcome();
      const reward = 10 * multiplier;
      gameState.addCoins(this, reward);
      this.result.setText(`배율 x${multiplier}!\n보상 코인 +${reward}`);
    });

    const back = this.add.rectangle(195, 800, 170, 50, 0xaed6ff).setStrokeStyle(2, 0x2d2d2d).setInteractive({ useHandCursor: true });
    this.add.text(195, 800, '뒤로', { fontSize: '22px', color: '#1f1f1f' }).setOrigin(0.5);
    back.on('pointerdown', () => this.scene.start('GameSelectScene'));
  }
}

export { OUTCOMES, pickWeightedOutcome };
