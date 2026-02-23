import Phaser from 'phaser';
import gameState from '../utils/GameState';
import { createCatContainer } from '../utils/CatRenderer';

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene');
    this.uiTexts = {};
  }

  create() {
    this.cameras.main.setBackgroundColor('#f9f7ff');
    gameState.startGlobalTimers(this);

    this.add.text(195, 48, '츄르앤더시티', {
      fontSize: '28px',
      color: '#2c2c2c',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.uiTexts.coins = this.add.text(20, 90, '', { fontSize: '20px', color: '#46342f' });
    this.uiTexts.stamina = this.add.text(20, 120, '', { fontSize: '20px', color: '#46342f' });
    this.uiTexts.mood = this.add.text(20, 150, '', { fontSize: '20px', color: '#46342f' });

    createCatContainer(this, 195, 360, gameState.get(this, 'equipped'), 1.1);

    this.add.text(195, 530, 'Zero 😼  |  Suga 😺', { fontSize: '20px', color: '#5a5a5a' }).setOrigin(0.5);

    this.createButton(195, 650, '게임 시작', () => this.scene.start('GameSelectScene'));
    this.createButton(195, 730, '드레스룸', () => this.scene.start('DressRoomScene'));
    this.createButton(195, 800, '간식 주기 (-30 코인 / +20 기분)', () => {
      if (!gameState.feedSnack(this)) this.showToast('코인이 부족합니다 😿');
    }, 300, 44, '#f3c15f');

    this.updateHud();
    this.game.events.on('state:changed', this.updateHud, this);
    this.game.events.on('game:alert', this.showToast, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  updateHud() {
    this.uiTexts.coins.setText(`츄르값: ${gameState.get(this, 'coins')}`);
    this.uiTexts.stamina.setText(`집사 체력: ${gameState.get(this, 'stamina')} / 10`);
    this.uiTexts.mood.setText(`고양이 기분: ${gameState.get(this, 'catMood')} / 100`);
  }

  showToast(message) {
    const toast = this.add.text(195, 588, message, {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#333',
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5);

    this.tweens.add({ targets: toast, alpha: 0, y: 560, delay: 1200, duration: 500, onComplete: () => toast.destroy() });
  }

  createButton(x, y, label, callback, w = 220, h = 54, color = '#87b6ff') {
    const rect = this.add.rectangle(x, y, w, h, Phaser.Display.Color.HexStringToColor(color).color)
      .setStrokeStyle(2, 0x2a2a2a)
      .setInteractive({ useHandCursor: true });

    this.add.text(x, y, label, { fontSize: '20px', color: '#1b1b1b', fontStyle: 'bold' }).setOrigin(0.5);
    rect.on('pointerdown', callback);
  }

  shutdown() {
    this.game.events.off('state:changed', this.updateHud, this);
    this.game.events.off('game:alert', this.showToast, this);
  }
}
