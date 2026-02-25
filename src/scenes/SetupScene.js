import Phaser from 'phaser';
import gameState from '../utils/GameState';

export default class SetupScene extends Phaser.Scene {
  constructor() {
    super('SetupScene');
    this.tempData = {
      butlerName: '무명집사',
      catName: '이름없는냥',
      catType: 'zero', // 'zero' or 'suga'
      catColor: 'black'
    };
  }

  create() {
    this.cameras.main.setBackgroundColor('#f8f9fa');
    
    // 타이틀
    this.add.text(195, 80, '새로운 집사 등록', { fontSize: '28px', color: '#111', fontStyle: 'bold' }).setOrigin(0.5);

    // 1. 이름 입력부
    const nameBtn = this.add.rectangle(195, 180, 300, 60, 0xffffff).setStrokeStyle(2, 0x333).setInteractive();
    this.nameText = this.add.text(195, 180, '📝 이름 설정하기 (클릭)', { fontSize: '20px', color: '#333' }).setOrigin(0.5);
    
    nameBtn.on('pointerdown', () => {
      const bName = window.prompt('집사님의 이름을 입력해주세요.', this.tempData.butlerName);
      if(bName) this.tempData.butlerName = bName;
      
      const cName = window.prompt('고양이의 이름을 입력해주세요.', this.tempData.catName);
      if(cName) this.tempData.catName = cName;
      
      this.nameText.setText(`집사: ${this.tempData.butlerName} / 냥이: ${this.tempData.catName}`);
    });

    // 2. 고양이 선택부
    this.add.text(195, 280, '어떤 고양이를 모실까요?', { fontSize: '20px', color: '#111' }).setOrigin(0.5);

    this.zeroBtn = this.add.rectangle(110, 380, 140, 140, 0xffffff).setStrokeStyle(4, 0x000000).setInteractive();
    this.add.text(110, 380, '시크한 턱시도\n(제로형)', { align: 'center', color: '#111' }).setOrigin(0.5);
    
    this.sugaBtn = this.add.rectangle(280, 380, 140, 140, 0xffffff).setStrokeStyle(4, 0xdddddd).setInteractive();
    this.add.text(280, 380, '복슬 복슬\n(슈가형)', { align: 'center', color: '#111' }).setOrigin(0.5);

    this.zeroBtn.on('pointerdown', () => this.selectCat('zero'));
    this.sugaBtn.on('pointerdown', () => this.selectCat('suga'));

    // 3. 색상 선택부
    this.add.text(195, 520, '색상 선택', { fontSize: '20px', color: '#111' }).setOrigin(0.5);
    const colors = ['black', 'cheese', 'white'];
    colors.forEach((col, idx) => {
      const cx = 110 + (idx * 85);
      const cBtn = this.add.rectangle(cx, 580, 60, 40, col==='black'?0x333:col==='cheese'?0xffa500:0xffffff)
        .setStrokeStyle(2, 0x111).setInteractive();
      cBtn.on('pointerdown', () => { this.tempData.catColor = col; });
    });

    // 4. 완료 버튼
    const completeBtn = this.add.rectangle(195, 750, 240, 60, 0x3cb96a).setStrokeStyle(2, 0x111).setInteractive();
    this.add.text(195, 750, '입양 완료!', { fontSize: '24px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

    completeBtn.on('pointerdown', () => {
      // 전역 상태에 저장
      gameState.set(this, 'butlerName', this.tempData.butlerName);
      gameState.set(this, 'catName', this.tempData.catName);
      gameState.set(this, 'catType', this.tempData.catType);
      gameState.set(this, 'catColor', this.tempData.catColor);
      
      this.scene.start('HomeScene');
    });
  }

  selectCat(type) {
    this.tempData.catType = type;
    this.zeroBtn.setStrokeStyle(4, type === 'zero' ? 0x000000 : 0xdddddd);
    this.sugaBtn.setStrokeStyle(4, type === 'suga' ? 0x000000 : 0xdddddd);
  }
}