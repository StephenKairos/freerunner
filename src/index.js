import 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-app',
    width: 1600,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [BootScene, GameScene]
};

var game = new Phaser.Game(config);

game.scene.start('BootScene');