import Phaser from 'phaser';
import gameState from '../utils/GameState';
import { createCatContainer } from '../utils/CatRenderer';

const W = 390;
const H = 844;

export default class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene');
    this.uiTexts = {};
  }

  create() {
    gameState.startGlobalTimers(this);

    this.cameras.main.setBackgroundColor('#f8f9fa'); // 심플한 배경

    // 1. 상단 HUD (스테미나, 돈)
    const hudBg = this.add.rectangle(W/2, 40, W-40, 60, 0xffffff).setStrokeStyle(2, 0x111);
    this.uiTexts.stamina = this.add.text(40, 40, '', { fontSize: '20px', color: '#111', fontStyle: 'bold' }).setOrigin(0, 0.5);
    this.uiTexts.coins = this.add.text(W-40, 40, '', { fontSize: '20px', color: '#f5d060', fontStyle: 'bold' }).setOrigin(1, 0.5);

    // 2. 중앙 고양이 & 정보
    const bName = gameState.get(this, 'butlerName');
    const cName = gameState.get(this, 'catName');
    
    this.add.text(W/2, 140, `${bName} 집사님의`, { fontSize: '18px', color: '#666' }).setOrigin(0.5);
    this.add.text(W/2, 170, cName, { fontSize: '36px', color: '#111', fontStyle: 'bold' }).setOrigin(0.5);

    // 기분 상태창
    this.moodBox = this.add.rectangle(W/2, 230, 160, 40, 0xffffff).setStrokeStyle(2, 0x111);
    this.uiTexts.mood = this.add.text(W/2, 230, '', { fontSize: '18px', color: '#111' }).setOrigin(0.5);

    // 고양이 렌더링 (임시로 기존 CatRenderer 사용, 가운데 크게 배치)
    this.catContainer = createCatContainer(this, W/2, 450, gameState.get(this, 'equipped'), 1.5);

    // 3. 하단 메뉴 버튼 3개
    this.createBottomMenu();

    this.updateHud();
    this.game.events.on('state:changed', this.updateHud, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  createBottomMenu() {
    const btnW = 100;
    const btnH = 80;
    const yPos = H - 100;

    // 간식주기
    const snackBtn = this.add.rectangle(65, yPos, btnW, btnH, 0xffffff).setStrokeStyle(2, 0x111).setInteractive();
    this.add.text(65, yPos, '🍗\n간식주기\n(-30)', { align: 'center', color: '#111' }).setOrigin(0.5);
    snackBtn.on('pointerdown', () => {
      if (!gameState.feedSnack(this)) alert('코인이 부족합니다!');
    });

    // 돈벌러가기
    const workBtn = this.add.rectangle(195, yPos, btnW + 20, btnH + 10, 0xffdf71).setStrokeStyle(2, 0x111).setInteractive();
    this.add.text(195, yPos, '💰\n돈벌러가기', { align: 'center', color: '#111', fontStyle: 'bold' }).setOrigin(0.5);
    workBtn.on('pointerdown', () => this.scene.start('GameSelectScene'));

    // 드레스룸
    const dressBtn = this.add.rectangle(325, yPos, btnW, btnH, 0xffffff).setStrokeStyle(2, 0x111).setInteractive();
    this.add.text(325, yPos, '👗\n드레스룸', { align: 'center', color: '#111' }).setOrigin(0.5);
    dressBtn.on('pointerdown', () => this.scene.start('DressRoomScene'));
  }

  updateHud() {
    if (!this.uiTexts.coins) return;
    this.uiTexts.coins.setText(`💰 ${gameState.get(this, 'coins')} C`);
    this.uiTexts.stamina.setText(`⚡ ${gameState.get(this, 'stamina')} / 10`);
    
    const mood = gameState.get(this, 'catMood');
    const moodStr = mood > 70 ? '기분 최고 😸' : mood > 30 ? '그저 그럼 😐' : '우울함 😿';
    this.uiTexts.mood.setText(moodStr);
  }

  shutdown() {
    this.game.events.off('state:changed', this.updateHud, this);
  }
}