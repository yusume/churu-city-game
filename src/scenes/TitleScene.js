import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  preload() {
    // 방금 다운로드한 메인 이미지 불러오기!
    this.load.image('title_bg', 'assets/images/title_bg.jpg');
  }

  create() {
    const { width, height } = this.scale;

    // 배경 이미지 추가 및 화면 비율에 꽉 차게 맞추기
    const bg = this.add.image(width / 2, height / 2, 'title_bg');
    const scale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(scale);

    // 하단 '게임 시작' 버튼 위치쯤에 투명 클릭 영역 만들기 (높이 85% 지점)
    const startZone = this.add.zone(width / 2, height * 0.88, width * 0.8, height * 0.1)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);

    // 터치 시 화면이 살짝 깜빡이며 HomeScene(본부)으로 이동!
    startZone.on('pointerdown', () => {
      bg.setAlpha(0.7);
      this.time.delayedCall(150, () => {
        bg.setAlpha(1);
        this.scene.start('HomeScene');
      });
    });
  }
}