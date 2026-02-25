import Phaser from 'phaser';
import gameState from '../utils/GameState';
import { createPlaceholderTextures } from '../utils/CatRenderer';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // PNG 에셋 추가 예시
    // this.load.image('body_tuxedo', 'assets/cat/body_tuxedo.png');
    // this.load.image('coat_black', 'assets/cat/coat_black.png');
    // this.load.image('hat_crown', 'assets/items/hat_crown.png');
    // this.load.image('bg_office', 'assets/backgrounds/bg_office.png');
  }

  create() {
   gameState.initRegistry(this);
    createPlaceholderTextures(this);
    this.scene.start('TitleScene');
  }
}
