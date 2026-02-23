import Phaser from 'phaser';

const GAMES = [
  { label: '생선 세금 징수', scene: 'FishGameScene' },
  { label: '츄르 복권', scene: 'SlotGameScene' },
  { label: '쥐 단속', scene: 'RatGameScene' },
  { label: '준비 중', scene: null },
];

export default class GameSelectScene extends Phaser.Scene {
  constructor() {
    super('GameSelectScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#fff7ef');
    this.add.text(195, 70, '미니게임 선택', { fontSize: '32px', color: '#3d2f2f', fontStyle: 'bold' }).setOrigin(0.5);

    GAMES.forEach((game, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 105 + col * 180;
      const y = 250 + row * 160;
      const card = this.add.rectangle(x, y, 150, 120, 0xffd9a8).setStrokeStyle(2, 0x3a2f2f).setInteractive({ useHandCursor: true });
      this.add.text(x, y, game.label, { fontSize: '20px', color: '#2d2d2d', align: 'center', wordWrap: { width: 128 } }).setOrigin(0.5);

      card.on('pointerdown', () => {
        if (game.scene) this.scene.start(game.scene);
      });
    });

    const home = this.add.rectangle(195, 780, 170, 50, 0xa2c7ff).setStrokeStyle(2, 0x2d2d2d).setInteractive({ useHandCursor: true });
    this.add.text(195, 780, '홈', { fontSize: '24px', color: '#1f1f1f' }).setOrigin(0.5);
    home.on('pointerdown', () => this.scene.start('HomeScene'));
  }
}

export { GAMES };
