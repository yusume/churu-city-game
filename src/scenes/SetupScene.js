import Phaser from 'phaser';
import gameState from '../utils/GameState';

export default class SetupScene extends Phaser.Scene {
  constructor() {
    super('SetupScene');
    this.tempData = {
      butlerName: '무명집사',
      catName: '이름없는냥',
      catType: 'zero', // 'zero' (슬림) or 'suga' (복슬)
      catColor: 'black'
    };
  }

  create() {
    const W = 390;

    // 1. 따뜻하고 귀여운 파스텔톤 배경
    this.cameras.main.setBackgroundColor('#fffdf8');
    
    // 타이틀
    this.add.text(W/2, 60, '✨ 새로운 집사 등록 ✨', { 
        fontSize: '26px', color: '#4a3b32', fontStyle: 'bold', fontFamily: 'sans-serif' 
    }).setOrigin(0.5);

    // 2. 이름 입력부 (상단에 아담하게 배치)
    const nameBtnBg = this.add.graphics();
    nameBtnBg.fillStyle(0x000000, 0.04).fillRoundedRect(W/2 - 140, 100 + 5, 280, 50, 16);
    nameBtnBg.fillStyle(0xffffff, 1).fillRoundedRect(W/2 - 140, 100, 280, 50, 16);
    nameBtnBg.lineStyle(2, 0xe0d6d0, 1).strokeRoundedRect(W/2 - 140, 100, 280, 50, 16);
    
    this.nameText = this.add.text(W/2, 125, '📝 이름 설정하기 (터치)', { 
        fontSize: '16px', color: '#887b73', fontStyle: 'bold', fontFamily: 'sans-serif' 
    }).setOrigin(0.5);
    
    const nameZone = this.add.zone(W/2, 125, 280, 50).setInteractive({ useHandCursor: true });
    nameZone.on('pointerdown', () => {
      this.tweens.add({ targets: this.nameText, scale: 0.95, duration: 50, yoyo: true });
      const bName = window.prompt('집사님의 이름을 입력해주세요.', this.tempData.butlerName);
      if(bName) this.tempData.butlerName = bName;
      const cName = window.prompt('고양이의 이름을 입력해주세요.', this.tempData.catName);
      if(cName) this.tempData.catName = cName;
      
      this.nameText.setText(`${this.tempData.butlerName} 집사 / ${this.tempData.catName}`);
      this.nameText.setColor('#4a3b32'); 
    });

    // ==========================================
    // 3. ⭐️ 실시간 고양이 미리보기 영역 ⭐️
    // ==========================================
    this.catPreviewGraphics = this.add.graphics();
    this.drawPreviewCat(); // 최초 1회 그리기

    // 4. 체형 선택 (슬림 / 복슬)
    this.add.text(W/2, 470, '체형 선택', { fontSize: '18px', color: '#887b73', fontStyle: 'bold' }).setOrigin(0.5);
    
    this.typeBtnZero = this.createTypeColorBtn(120, 520, 130, 50, '🐱 슬림형 (제로)', () => {
        this.tempData.catType = 'zero';
        this.updateButtons();
        this.drawPreviewCat(); // 그림 즉시 업데이트!
    });
    this.typeBtnSuga = this.createTypeColorBtn(270, 520, 130, 50, '☁️ 복슬형 (슈가)', () => {
        this.tempData.catType = 'suga';
        this.updateButtons();
        this.drawPreviewCat(); // 그림 즉시 업데이트!
    });

    // 5. 털 색상 선택 (동글동글 팔레트)
    this.add.text(W/2, 590, '털 색상', { fontSize: '18px', color: '#887b73', fontStyle: 'bold' }).setOrigin(0.5);
    
    this.colorCircles = [];
    const colors = [ { key: 'black', hex: 0x2b2b2b }, { key: 'cheese', hex: 0xf5b041 }, { key: 'white', hex: 0xffffff } ];
    
    colors.forEach((col, idx) => {
      const cx = 110 + (idx * 85);
      const cObj = this.add.graphics();
      cObj.fillStyle(0x000000, 0.1).fillCircle(cx, 640 + 4, 25);
      cObj.fillStyle(col.hex, 1).fillCircle(cx, 640, 25);
      cObj.lineStyle(2, 0xe0d6d0, 1).strokeCircle(cx, 640, 25);
      
      const highlight = this.add.graphics(); // 선택 하이라이트용
      
      const zone = this.add.zone(cx, 640, 60, 60).setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => {
         this.tweens.add({ targets: cObj, y: -4, duration: 80, yoyo: true });
         this.tempData.catColor = col.key;
         this.updateButtons();
         this.drawPreviewCat(); // 색상 즉시 업데이트!
      });
      this.colorCircles.push({ key: col.key, highlight, cx });
    });

    // 최초 버튼 상태 업데이트
    this.updateButtons();

    // 6. 완료 버튼
    this.createCuteBtn(W/2, 760, 260, 65, 0x5cd88a, '🎉 입양 완료! 🎉', () => {
      gameState.set(this, 'butlerName', this.tempData.butlerName);
      gameState.set(this, 'catName', this.tempData.catName);
      gameState.set(this, 'catType', this.tempData.catType);
      gameState.set(this, 'catColor', this.tempData.catColor);
      
      this.cameras.main.fadeOut(300, 255, 255, 255);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('HomeScene'));
    });
  }

  // ==========================================
  // 마법의 실시간 렌더링 함수
  // ==========================================
  drawPreviewCat() {
    const type = this.tempData.catType;
    const colorKey = this.tempData.catColor;
    const hex = colorKey === 'black' ? 0x2b2b2b : colorKey === 'cheese' ? 0xf5b041 : 0xffffff;
    const lineStr = 0x4a3b32;
    const g = this.catPreviewGraphics;
    
    g.clear();
    
    // 그림자
    g.fillStyle(0x000000, 0.05).fillEllipse(195, 410, 160, 24);
    
    g.lineStyle(4, lineStr, 1);
    g.fillStyle(hex, 1);
    
    if (type === 'zero') {
        // [슬림형 - 제로]
        // 1. 귀
        g.fillTriangle(145, 250, 115, 170, 185, 220); g.strokeTriangle(145, 250, 115, 170, 185, 220);
        g.fillTriangle(245, 250, 275, 170, 205, 220); g.strokeTriangle(245, 250, 275, 170, 205, 220);
        // 귀 안쪽 핑크
        g.fillStyle(0xffb6c1, 1); g.lineStyle(0);
        g.fillTriangle(145, 240, 125, 190, 170, 220);
        g.fillTriangle(245, 240, 265, 190, 220, 220);
        
        // 2. 몸통 (슬림한 식빵)
        g.fillStyle(hex, 1); g.lineStyle(4, lineStr, 1);
        g.fillRoundedRect(125, 200, 140, 200, 60); g.strokeRoundedRect(125, 200, 140, 200, 60);
        
        // 3. 꼬리 (뾰족)
        g.fillRoundedRect(250, 360, 60, 24, 12); g.strokeRoundedRect(250, 360, 60, 24, 12);
    } else {
        // [복슬형 - 슈가]
        // 1. 귀 (조금 더 둥글고 작게)
        g.fillTriangle(135, 250, 110, 190, 175, 230); g.strokeTriangle(135, 250, 110, 190, 175, 230);
        g.fillTriangle(255, 250, 280, 190, 215, 230); g.strokeTriangle(255, 250, 280, 190, 215, 230);
        g.fillStyle(0xffb6c1, 1); g.lineStyle(0);
        g.fillTriangle(140, 245, 120, 205, 165, 230);
        g.fillTriangle(250, 245, 270, 205, 225, 230);
        
        // 2. 몸통 (구름처럼 복슬복슬하게 원 겹치기)
        g.fillStyle(hex, 1); g.lineStyle(4, lineStr, 1);
        const fluffs = [
            {x: 130, y: 240, r: 40}, {x: 260, y: 240, r: 40}, {x: 115, y: 300, r: 45}, 
            {x: 275, y: 300, r: 45}, {x: 130, y: 360, r: 50}, {x: 260, y: 360, r: 50},
            {x: 195, y: 210, r: 55}, {x: 195, y: 370, r: 50}, {x: 195, y: 290, r: 60}
        ];
        fluffs.forEach(f => { g.fillCircle(f.x, f.y, f.r); g.strokeCircle(f.x, f.y, f.r); });
        // 내부 겹치는 테두리 지우기
        g.lineStyle(0);
        fluffs.forEach(f => { g.fillCircle(f.x, f.y, f.r - 2); });
        
        // 3. 꼬리 (복슬)
        g.fillStyle(hex, 1); g.lineStyle(4, lineStr, 1);
        g.fillCircle(280, 370, 25); g.strokeCircle(280, 370, 25);
        g.fillCircle(310, 350, 30); g.strokeCircle(310, 350, 30);
        g.fillCircle(330, 310, 25); g.strokeCircle(330, 310, 25);
        g.lineStyle(0);
        g.fillCircle(280, 370, 23); g.fillCircle(310, 350, 28); g.fillCircle(330, 310, 23);
    }
    
    // [공통 얼굴 그리기]
    g.lineStyle(4, lineStr, 1);
    g.fillStyle(0xffffff, 1);
    
    // 하얀 가슴 & 하얀 주둥이
    g.fillEllipse(195, 340, 70, 80);
    if (colorKey !== 'white') g.strokeEllipse(195, 340, 70, 80);
    g.fillEllipse(195, 270, 80, 50);
    if (colorKey !== 'white') g.strokeEllipse(195, 270, 80, 50);
    
    // 눈 베이스 (노란색)
    g.fillStyle(0xffd700, 1); g.lineStyle(3, lineStr, 1);
    g.fillCircle(165, 250, 13); g.strokeCircle(165, 250, 13);
    g.fillCircle(225, 250, 13); g.strokeCircle(225, 250, 13);
    
    // 동공
    g.fillStyle(0x111111, 1);
    if (type === 'zero') {
        // 시크한 눈 (반쯤 감김)
        g.fillEllipse(165, 250, 6, 12); g.fillEllipse(225, 250, 6, 12);
        g.fillStyle(hex, 1); // 눈꺼풀 덮기
        g.fillRect(150, 233, 30, 12); g.fillRect(210, 233, 30, 12);
        g.lineStyle(4, lineStr, 1);
        g.beginPath(); g.moveTo(148, 245); g.lineTo(182, 245); g.strokePath();
        g.beginPath(); g.moveTo(208, 245); g.lineTo(242, 245); g.strokePath();
    } else {
        // 해맑은 동그란 눈
        g.fillCircle(165, 250, 7); g.fillCircle(225, 250, 7);
        g.fillStyle(0xffffff, 1); // 눈동자 반짝이
        g.fillCircle(168, 247, 2.5); g.fillCircle(228, 247, 2.5);
    }
    
    // 코와 입
    g.fillStyle(0xff8899, 1); g.lineStyle(3, lineStr, 1);
    g.fillTriangle(188, 265, 202, 265, 195, 272);
    g.beginPath(); g.moveTo(195, 272); g.lineTo(188, 280); g.strokePath();
    g.beginPath(); g.moveTo(195, 272); g.lineTo(202, 280); g.strokePath();
    
    // 하얀 찹쌀떡 앞발
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(170, 395, 25, 20); g.strokeEllipse(170, 395, 25, 20);
    g.fillEllipse(220, 395, 25, 20); g.strokeEllipse(220, 395, 25, 20);
  }

  // 버튼들 상태 업데이트 유틸
  updateButtons() {
    // 1. 체형 버튼 색상 변경
    const updateTBtn = (btnObj, isSelected) => {
        btnObj.bg.clear();
        btnObj.bg.fillStyle(isSelected ? 0xffa07a : 0xffffff, 1).fillRoundedRect(btnObj.x - 65, btnObj.y - 25, 130, 50, 16);
        btnObj.bg.lineStyle(isSelected ? 3 : 2, isSelected ? 0xffa07a : 0xe0d6d0, 1).strokeRoundedRect(btnObj.x - 65, btnObj.y - 25, 130, 50, 16);
        btnObj.txt.setColor(isSelected ? '#ffffff' : '#887b73');
    };
    updateTBtn(this.typeBtnZero, this.tempData.catType === 'zero');
    updateTBtn(this.typeBtnSuga, this.tempData.catType === 'suga');

    // 2. 색상 팔레트 하이라이트
    this.colorCircles.forEach(c => c.highlight.clear());
    const activeColor = this.colorCircles.find(c => c.key === this.tempData.catColor);
    if (activeColor) {
        activeColor.highlight.lineStyle(4, 0xffa07a, 1).strokeCircle(activeColor.cx, 640, 32);
    }
  }

  createTypeColorBtn(x, y, w, h, text, onClick) {
    const bg = this.add.graphics();
    const txt = this.add.text(x, y, text, { fontSize: '15px', fontStyle: 'bold' }).setOrigin(0.5);
    const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', onClick);
    return { bg, txt, x, y };
  }

  createCuteBtn(x, y, w, h, color, text, onClick) {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.15).fillRoundedRect(x - w/2, y - h/2 + 6, w, h, 30);
    g.fillStyle(color, 1).fillRoundedRect(x - w/2, y - h/2, w, h, 30);
    g.lineStyle(3, 0x3cb96a, 1).strokeRoundedRect(x - w/2, y - h/2, w, h, 30);

    const txt = this.add.text(x, y, text, { fontSize: '24px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => {
      this.tweens.add({ targets: [g, txt], y: '+=4', duration: 50, yoyo: true });
      this.time.delayedCall(100, onClick);
    });
  }
}