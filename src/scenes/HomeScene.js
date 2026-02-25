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

    // 1. 따뜻하고 귀여운 파스텔톤 배경
    this.cameras.main.setBackgroundColor('#fffdf8');

    // 2. 상단 HUD (스테미나, 돈) - 둥근 알약 모양으로 예쁘게!
    this.createHudBar(20, 20, 130, 45, 0xffffff);
    this.uiTexts.stamina = this.add.text(85, 42, '', { 
      fontSize: '18px', color: '#4a3b32', fontStyle: 'bold', fontFamily: 'sans-serif' 
    }).setOrigin(0.5);
    
    this.createHudBar(W - 160, 20, 140, 45, 0xffffff);
    this.uiTexts.coins = this.add.text(W - 90, 42, '', { 
      fontSize: '18px', color: '#f5b041', fontStyle: 'bold', fontFamily: 'sans-serif' 
    }).setOrigin(0.5);

    // 3. 중앙 정보 (집사 & 고양이 이름)
    const bName = gameState.get(this, 'butlerName');
    const cName = gameState.get(this, 'catName');
    
    this.add.text(W/2, 130, `✨ ${bName} 집사님의 ✨`, { fontSize: '16px', color: '#887b73' }).setOrigin(0.5);
    this.add.text(W/2, 165, cName, { fontSize: '38px', color: '#4a3b32', fontStyle: 'bold' }).setOrigin(0.5);

    // 기분 상태창 (말풍선 느낌)
    const moodBg = this.add.graphics();
    moodBg.fillStyle(0xffffff, 1).fillRoundedRect(W/2 - 80, 210, 160, 40, 20);
    moodBg.lineStyle(2, 0xe0d6d0, 1).strokeRoundedRect(W/2 - 80, 210, 160, 40, 20);
    this.uiTexts.mood = this.add.text(W/2, 230, '', { fontSize: '18px', color: '#4a3b32' }).setOrigin(0.5);

    // 4. 고양이 렌더링 (살짝 더 크게)
    this.catContainer = createCatContainer(this, W/2, 480, gameState.get(this, 'equipped'), 1.6);

    // 5. 하단 메뉴 버튼 3개 (귀여운 둥근 버튼 + 그림자)
    this.createBottomMenu();

    this.updateHud();
    this.game.events.on('state:changed', this.updateHud, this);
    this.events.once('shutdown', this.shutdown, this);
  }

  // 상단 바 그리는 유틸
  createHudBar(x, y, w, h, color) {
    const g = this.add.graphics();
    g.fillStyle(color, 1).fillRoundedRect(x, y, w, h, 22);
    g.lineStyle(2, 0xe0d6d0, 1).strokeRoundedRect(x, y, w, h, 22);
  }

  createBottomMenu() {
    const yPos = H - 120;

    // 간식주기 (분홍빛)
    this.createCuteBtn(65, yPos, 90, 90, 0xffd1dc, '🍗', '간식주기\n(-30)', () => {
      if (!gameState.feedSnack(this)) {
        this.showToast('코인이 부족하다냥!');
      } else {
        this.showToast('기분 좋아졌다냥! 💖');
      }
    });

    // 돈벌러가기 (노란빛, 살짝 더 큼)
    this.createCuteBtn(195, yPos, 120, 100, 0xffe785, '💰', '돈벌러가기', () => {
      this.scene.start('GameSelectScene');
    });

    // 드레스룸 (하늘빛)
    this.createCuteBtn(325, yPos, 90, 90, 0xd4ecff, '👗', '드레스룸', () => {
      this.scene.start('DressRoomScene');
    });
  }

  // 예쁘고 둥근 버튼을 그려주는 마법의 함수!
  createCuteBtn(x, y, w, h, color, icon, text, onClick) {
    const g = this.add.graphics();
    
    // 그림자 (버튼 아래에 살짝 깔림)
    g.fillStyle(0x000000, 0.08).fillRoundedRect(x - w/2, y - h/2 + 6, w, h, 24);
    
    // 버튼 본체
    g.fillStyle(color, 1).fillRoundedRect(x - w/2, y - h/2, w, h, 24);
    // 버튼 테두리 (진한 갈색으로 귀엽게)
    g.lineStyle(3, 0x4a3b32, 1).strokeRoundedRect(x - w/2, y - h/2, w, h, 24);

    // 아이콘과 텍스트
    this.add.text(x, y - 10, icon, { fontSize: '32px' }).setOrigin(0.5);
    this.add.text(x, y + 22, text, { fontSize: '15px', color: '#4a3b32', fontStyle: 'bold', align: 'center' }).setOrigin(0.5);

    // 클릭 영역
    const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => {
      // 눌렸을 때 살짝 줄어드는 귀여운 애니메이션
      this.tweens.add({ targets: [g], y: '+=4', duration: 50, yoyo: true });
      this.time.delayedCall(100, onClick);
    });
  }

  updateHud() {
    if (!this.uiTexts.coins) return;
    this.uiTexts.coins.setText(`💰 ${gameState.get(this, 'coins')} C`);
    this.uiTexts.stamina.setText(`⚡ ${gameState.get(this, 'stamina')} / 10`);
    
    const mood = gameState.get(this, 'catMood');
    const moodStr = mood > 70 ? '기분 최고 😸' : mood > 30 ? '그저 그럼 😐' : '우울함 😿';
    this.uiTexts.mood.setText(moodStr);
  }

  showToast(msg) {
    const toast = this.add.text(W/2, H/2 + 100, msg, {
      fontSize: '16px', color: '#fff', backgroundColor: '#4a3b32', padding: { x: 16, y: 10 }
    }).setOrigin(0.5);
    
    this.tweens.add({ targets: toast, y: '-=30', alpha: 0, duration: 1500, delay: 500, onComplete: () => toast.destroy() });
  }

  shutdown() {
    this.game.events.off('state:changed', this.updateHud, this);
  }
}