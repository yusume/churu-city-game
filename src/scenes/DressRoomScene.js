import Phaser from 'phaser';
import gameState from '../utils/GameState';
import { createCatContainer } from '../utils/CatRenderer';

const ITEMS = {
  모자: [{ name: '기본', key: 'acc_none' }],
  의상: [{ name: '기본', key: 'clothes_none' }],
  악세사리: [{ name: '기본', key: 'acc_none' }],
  배경: [{ name: '사무실', key: 'bg_office' }],
  표정: [{ name: '무표정', key: 'exp_neutral' }],
};

export default class DressRoomScene extends Phaser.Scene {
  constructor() {
    super('DressRoomScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#f4efff');
    this.add.text(195, 60, '드레스룸', { fontSize: '34px', color: '#2e2355', fontStyle: 'bold' }).setOrigin(0.5);

    createCatContainer(this, 195, 360, gameState.get(this, 'equipped'), 1.25);

    this.add.rectangle(195, 740, 380, 180, 0xffffff, 0.7).setStrokeStyle(2, 0x2a2450);

    Object.keys(ITEMS).forEach((category, idx) => {
      const x = 45 + idx * 75;
      const tab = this.add.rectangle(x, 680, 68, 38, 0xcbbaf8).setStrokeStyle(1, 0x2a2450).setInteractive({ useHandCursor: true });
      this.add.text(x, 680, category, { fontSize: '14px', color: '#2a2450' }).setOrigin(0.5);
      tab.on('pointerdown', () => this.showCategory(category));
    });

    this.itemList = this.add.text(195, 752, '카테고리를 눌러 아이템 리스트를 확인하세요.', {
      fontSize: '16px', color: '#2a2450', align: 'center', wordWrap: { width: 340 },
    }).setOrigin(0.5);

    const back = this.add.rectangle(195, 810, 170, 50, 0xaed6ff).setStrokeStyle(2, 0x2a2450).setInteractive({ useHandCursor: true });
    this.add.text(195, 810, '홈으로', { fontSize: '22px', color: '#1f1f1f' }).setOrigin(0.5);
    back.on('pointerdown', () => this.scene.start('HomeScene'));
  }

  showCategory(category) {
    const list = ITEMS[category].map((item) => `- ${item.name} (${item.key})`).join('\n');
    this.itemList.setText(`[${category}] 아이템 목록\n${list}`);
  }
}

export { ITEMS };
