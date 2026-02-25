import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import TitleScene from './scenes/TitleScene';
import HomeScene from './scenes/HomeScene';
import GameSelectScene from './scenes/GameSelectScene';
import FishGameScene from './scenes/FishGameScene';
import SlotGameScene from './scenes/SlotGameScene';
import RatGameScene from './scenes/RatGameScene';
import DressRoomScene from './scenes/DressRoomScene';

const config = {
  type: Phaser.AUTO,
  width: 390,
  height: 844,
  parent: 'app',
  backgroundColor: '#111111',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,
    height: 844,
  },
  scene: [
    PreloadScene,
    TitleScene,
    HomeScene,
    GameSelectScene,
    FishGameScene,
    SlotGameScene,
    RatGameScene,
    DressRoomScene,
  ],
};

new Phaser.Game(config);
