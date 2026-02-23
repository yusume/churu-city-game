import Phaser from 'phaser';
import gameState from '../utils/GameState';
import { createCatContainer } from '../utils/CatRenderer';

const CATEGORY_TO_LAYER = {
  모자: 'accessories',
  의상: 'clothes',
  악세사리: 'accessories',
  배경: 'background',
  표정: 'expression',
};

const ITEMS = {
  모자: [
    { name: '없음', key: 'acc_none' },
  ],
  의상: [
    { name: '기본', key: 'clothes_none' },
  ],
  악세사리: [
    { name: '기본', key: 'acc_none' },
  ],
  배경: [
    { name: '사무실', key: 'bg_office' },
  ],
  표정: [
    { name: '무표정', key: 'exp_neutral' },
  ],
};

export default class DressRoomScene extends Phaser.Scene {
  constructor() {
    super('DressRoomScene');
    this.itemButtons = [];
    this.catContainer = null;
  }

  create() {
    this.cameras.main.setBackgroundColor('#f4efff');
    this.add.text(195, 60, '드레스룸', { fontSize: '34px', color: '#2e2355', fontStyle: 'bold' }).setOrigin(0.5);

    this.renderCat();

    this.add.rectangle(195, 740, 380, 180, 0xffffff, 0.7).setStrokeStyle(2, 0x2a2450);

    Object.keys(ITEMS).forEach((category, idx) => {
      const x = 45 + idx * 75;
      const tab = this.add.rectangle(x, 680, 68, 38, 0xcbbaf8).setStrokeStyle(1, 0x2a2450).setInteractive({ useHandCursor: true });
      this.add.text(x, 680, category, { fontSize: '14px', color: '#2a2450' }).setOrigin(0.5);
      tab.on('pointerdown', () => this.showCategory(category));
    });

    this.itemList = this.add.text(195, 742, '카테고리를 눌러 아이템 리스트를 확인하세요.', {
      fontSize: '16px', color: '#2a2450', align: 'center', wordWrap: { width: 340 },
    }).setOrigin(0.5);

    const back = this.add.rectangle(195, 810, 170, 50, 0xaed6ff).setStrokeStyle(2, 0x2a2450).setInteractive({ useHandCursor: true });
    this.add.text(195, 810, '홈으로', { fontSize: '22px', color: '#1f1f1f' }).setOrigin(0.5);
    back.on('pointerdown', () => this.scene.start('HomeScene'));

    this.showCategory('의상');
  }

  renderCat() {
    if (this.catContainer) {
      this.catContainer.destroy();
    }
    this.catContainer = createCatContainer(this, 195, 360, gameState.get(this, 'equipped'), 1.25);
  }

  clearItemButtons() {
    this.itemButtons.forEach((item) => {
      item.button.destroy();
      item.label.destroy();
    });
    this.itemButtons = [];
  }

  equipItem(category, itemKey) {
    const layer = CATEGORY_TO_LAYER[category];
    if (!layer) return;

    const current = gameState.get(this, 'equipped');
    const next = { ...current, [layer]: itemKey };
    gameState.set(this, 'equipped', next);
    this.renderCat();
  }

  showCategory(category) {
    this.clearItemButtons();

    const list = ITEMS[category] || [];
    this.itemList.setText(`[${category}] 아이템 선택`);

    list.forEach((item, idx) => {
      const x = 85 + (idx % 3) * 110;
      const y = 772 + Math.floor(idx / 3) * 48;

      const btn = this.add.rectangle(x, y, 98, 36, 0xe0d4ff)
        .setStrokeStyle(1, 0x2a2450)
        .setInteractive({ useHandCursor: true });
      const label = this.add.text(x, y, item.name, { fontSize: '13px', color: '#2a2450' }).setOrigin(0.5);

      btn.on('pointerdown', () => this.equipItem(category, item.key));
      this.itemButtons.push({ button: btn, label });
    });
  }
}

export { ITEMS, CATEGORY_TO_LAYER };
