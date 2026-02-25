import Phaser from 'phaser';

const LAYER_ORDER = ['background', 'tail', 'body', 'coat', 'clothes', 'accessories', 'expression'];

export function createCatContainer(scene, x, y, equipped, scale = 1) {
  const container = scene.add.container(x, y);

  LAYER_ORDER.forEach((layer) => {
    const textureKey = equipped[layer];
    if (!textureKey || !scene.textures.exists(textureKey)) return;
    container.add(scene.add.image(0, 0, textureKey).setOrigin(0.5));
  });

  container.setScale(scale);
  return container;
}

// 둥글둥글하고 귀여운 '플랫 디자인' 스타일로 텍스처 업그레이드!
export function createPlaceholderTextures(scene) {
  const has = (key) => scene.textures.exists(key);

  // 1. 따뜻한 느낌의 사무실 배경
  if (!has('bg_office')) {
    const g = scene.add.graphics();
    g.fillStyle(0xfff0f5, 1).fillRoundedRect(0, 0, 240, 260, 24); // 연분홍 벽지
    g.fillStyle(0xffd1dc, 1).fillRect(0, 195, 240, 65); // 분홍 바닥
    g.fillStyle(0xffffff, 0.5).fillRect(20, 20, 80, 100); // 창문 느낌
    g.generateTexture('bg_office', 240, 260);
    g.destroy();
  }

  // 2. 통통하고 둥근 꼬리
  if (!has('tail_default')) {
    const g = scene.add.graphics();
    g.fillStyle(0x2b2b2b, 1).fillRoundedRect(160, 170, 60, 25, 12);
    g.generateTexture('tail_default', 240, 260);
    g.destroy();
  }

  // 3. 턱시도 고양이 베이스 (얼굴+몸통을 귀엽게 융합)
  if (!has('body_tuxedo')) {
    const g = scene.add.graphics();
    // 둥글둥글한 귀
    g.fillStyle(0x2b2b2b, 1);
    g.fillTriangle(75, 90, 100, 50, 115, 80); // 왼쪽 귀
    g.fillTriangle(165, 90, 140, 50, 125, 80); // 오른쪽 귀
    g.fillStyle(0xffb6c1, 1); // 핑크색 귓속
    g.fillTriangle(82, 85, 100, 60, 110, 80);
    g.fillTriangle(158, 85, 140, 60, 130, 80);
    
    // 식빵 굽는 듯한 둥근 몸통 + 머리 (일체형)
    g.fillStyle(0x2b2b2b, 1).fillRoundedRect(60, 70, 120, 130, 60);
    g.generateTexture('body_tuxedo', 240, 260);
    g.destroy();
  }

  // 4. 턱시도 하얀 코트 (둥근 뱃살과 주둥이)
  if (!has('coat_white_chest')) {
    const g = scene.add.graphics();
    // 하얀 주둥이 쪽
    g.fillStyle(0xffffff, 1).fillEllipse(120, 120, 60, 40);
    // 하얀 뱃살
    g.fillStyle(0xffffff, 1).fillEllipse(120, 165, 55, 60);
    // 하얀 찹쌀떡 발 두 개
    g.fillEllipse(95, 195, 25, 15);
    g.fillEllipse(145, 195, 25, 15);
    g.generateTexture('coat_white_chest', 240, 260);
    g.destroy();
  }

  // 빈 레이어 (옷, 악세사리 없는 상태)
  ['clothes_none', 'acc_none'].forEach((key) => {
    if (!has(key)) {
      const g = scene.add.graphics();
      g.fillStyle(0x000000, 0.001).fillRect(0, 0, 240, 260);
      g.generateTexture(key, 240, 260);
      g.destroy();
    }
  });

  // 5. 시크하면서도 귀여운 표정 (제로 느낌)
  if (!has('exp_neutral')) {
    const g = scene.add.graphics();
    // 반쯤 감은 시크한 눈 (노란색 베이스)
    g.fillStyle(0xffd700, 1).fillEllipse(95, 105, 16, 16);
    g.fillStyle(0xffd700, 1).fillEllipse(145, 105, 16, 16);
    // 검은 동공
    g.fillStyle(0x111111, 1).fillEllipse(95, 105, 8, 12);
    g.fillStyle(0x111111, 1).fillEllipse(145, 105, 8, 12);
    // 시크한 눈꺼풀 (검은색으로 윗부분 덮기)
    g.fillStyle(0x2b2b2b, 1).fillRect(80, 95, 30, 8);
    g.fillStyle(0x2b2b2b, 1).fillRect(130, 95, 30, 8);
    
    // 핑크색 작은 코
    g.fillStyle(0xff8899, 1).fillTriangle(115, 115, 125, 115, 120, 120);
    
    // 뚱한 입시옷 (ㅅ 모양)
    g.lineStyle(2, 0x444444, 1);
    g.beginPath(); g.moveTo(120, 120); g.lineTo(112, 126); g.strokePath();
    g.beginPath(); g.moveTo(120, 120); g.lineTo(128, 126); g.strokePath();

    g.generateTexture('exp_neutral', 240, 260);
    g.destroy();
  }

  // 미니게임용 아이템들 (좀 더 통통하게)
  if (!has('item_fish')) {
    const g = scene.add.graphics();
    g.fillStyle(0x88ccff, 1).fillEllipse(24, 15, 32, 18).fillTriangle(8, 15, 0, 6, 0, 24);
    g.fillStyle(0xffffff, 1).fillCircle(32, 12, 3); // 생선 눈
    g.generateTexture('item_fish', 48, 30);
    g.destroy();
  }

  if (!has('item_rat')) {
    const g = scene.add.graphics();
    g.fillStyle(0xa09ba8, 1).fillEllipse(18, 16, 28, 18).fillCircle(32, 14, 6);
    g.fillStyle(0xffaaaa, 1).fillCircle(35, 12, 2); // 쥐 눈
    g.lineStyle(2, 0xddbbcc, 1).strokeLineShape(new Phaser.Geom.Line(4, 16, 0, 24)); // 꼬리
    g.generateTexture('item_rat', 36, 28);
    g.destroy();
  }
}