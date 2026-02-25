import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  preload() {
    // 새로운 심플 디자인 이미지 로드 (확장자가 jpg면 jpg로 변경!)
    this.load.image('title_simple', 'assets/images/title_bg.jpg');
  }

  create() {
    const { width, height } = this.scale;

    // 1. 배경을 하얀색으로 쫙 깔아주기
    this.cameras.main.setBackgroundColor('#ffffff');

    // 2. 심플 이미지 중앙 배치 (버튼 들어갈 자리 마련을 위해 살짝 위로 배치)
    const bg = this.add.image(width / 2, height / 2 - 40, 'title_simple');
    
    // 이미지가 화면에 예쁘게 담기도록 비율 조정
    const scale = Math.min(width / bg.width, height / bg.height) * 0.95;
    bg.setScale(scale);

    // 3. 심플한 '게임 시작' 버튼 코드로 그리기
    const btnY = height * 0.85;
    const btnW = 200;
    const btnH = 55;

    // 흰색 바탕에 검은색 테두리 버튼
    const startBtn = this.add.rectangle(width / 2, btnY, btnW, btnH, 0xffffff)
      .setStrokeStyle(3, 0x111111)
      .setInteractive({ useHandCursor: true });

    // 버튼 텍스트
    const startText = this.add.text(width / 2, btnY, 'Tap to Start', {
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#111111',
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif"
    }).setOrigin(0.5);

    // 텍스트가 살짝살짝 깜빡이는 애니메이션 (게임 감성 추가)
    this.tweens.add({
      targets: startText,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // 4. 터치 시 부드럽게 HomeScene으로 넘어가기
    // startBtn.on('pointerdown', ...) 내부를 이렇게 변경!
    startBtn.on('pointerdown', () => {
      this.tweens.add({ targets: [startBtn, startText], scaleX: 0.95, scaleY: 0.95, duration: 100, yoyo: true });
      
      this.cameras.main.fadeOut(400, 255, 255, 255);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        // import('../utils/GameState').then(({ default: gameState }) => {
        //   // 이름이 없으면 가입 화면, 있으면 홈 화면
        //   if (!gameState.get(this, 'butlerName')) {
        //     this.scene.start('SetupScene');
        //   } else {
        //     this.scene.start('HomeScene');
        //   }
        // });
        this.scene.start('SetupScene');
      });
    });
    
  }
}