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

export function createPlaceholderTextures(scene) {
  const has = (key) => scene.textures.exists(key);

  if (!has('bg_office')) {
    const g = scene.add.graphics();
    g.fillStyle(0xe8eefc, 1).fillRoundedRect(0, 0, 240, 260, 24);
    g.fillStyle(0xd5def7, 1).fillRect(0, 195, 240, 65);
    g.generateTexture('bg_office', 240, 260);
    g.destroy();
  }

  if (!has('tail_default')) {
    const g = scene.add.graphics();
    g.fillStyle(0x222222, 1).fillEllipse(80, 155, 70, 36);
    g.generateTexture('tail_default', 240, 260);
    g.destroy();
  }

  if (!has('body_tuxedo')) {
    const g = scene.add.graphics();
    g.fillStyle(0x1f1f1f, 1).fillRoundedRect(70, 70, 100, 130, 40).fillCircle(120, 70, 45);
    g.generateTexture('body_tuxedo', 240, 260);
    g.destroy();
  }

  if (!has('coat_white_chest')) {
    const g = scene.add.graphics();
    g.fillStyle(0xffffff, 1).fillTriangle(120, 108, 95, 185, 145, 185);
    g.generateTexture('coat_white_chest', 240, 260);
    g.destroy();
  }

  ['clothes_none', 'acc_none'].forEach((key) => {
    if (!has(key)) {
      const g = scene.add.graphics();
      g.fillStyle(0x000000, 0.001).fillRect(0, 0, 240, 260);
      g.generateTexture(key, 240, 260);
      g.destroy();
    }
  });

  if (!has('exp_neutral')) {
    const g = scene.add.graphics();
    g.fillStyle(0xffffff, 1).fillCircle(103, 66, 5).fillCircle(137, 66, 5).fillRoundedRect(110, 84, 20, 4, 2);
    g.generateTexture('exp_neutral', 240, 260);
    g.destroy();
  }

  if (!has('item_fish')) {
    const g = scene.add.graphics();
    g.fillStyle(0x6cc2ff, 1).fillEllipse(24, 15, 30, 16).fillTriangle(8, 15, 0, 8, 0, 22);
    g.generateTexture('item_fish', 48, 30);
    g.destroy();
  }

  if (!has('item_rat')) {
    const g = scene.add.graphics();
    g.fillStyle(0x807b88, 1).fillEllipse(18, 16, 26, 16).fillCircle(30, 12, 5);
    g.lineStyle(2, 0xc2a2b3, 1).strokeLineShape(new Phaser.Geom.Line(4, 16, 0, 22));
    g.generateTexture('item_rat', 36, 28);
    g.destroy();
  }
}
