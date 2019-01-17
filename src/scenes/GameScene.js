import 'phaser';

// Put any Global Variables Here. Syntax:

/*
** var varName = ...;
*/

var player;
var stars;
var bombs;

var platforms;
var movingPlatforms;
var platformLevel;

var cursors;
var score = 0;
var gameOver = false;
var scoreText;

// 

export class GameScene extends Phaser.Scene {
    
    constructor () {
        super('GameScene');
    }

    preload () {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create () {
        //  A simple background for our game
        this.add.image(400, 300, 'sky');
        this.add.image(1200, 300, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        // platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        // platforms.create(400, 600, 'ground').setScale(2).refreshBody();
        // platforms.create(1200, 600, 'ground').setScale(2).refreshBody();

        //  The platforms group contains the ground and the 2 ledges we can jump on
        movingPlatforms = this.physics.add.staticGroup();
        platformLevel = 450;
    
        //  We will enable physics for any object that is created in this group
        // this.movingPlatforms.enableBody = true;

        movingPlatforms.create(1400, platformLevel, 'ground').setScale(1).refreshBody();
        movingPlatforms.create(800, platformLevel, 'ground').setScale(1).refreshBody();
        movingPlatforms.create(400, platformLevel, 'ground').setScale(1).refreshBody();
        // movingPlatforms.setVelocityX(-100);

        // The player and its settings
        player = this.physics.add.sprite(100, 150, 'dude');

        //  Player physics properties. Give the little guy a slight bounce.
        player.setBounce(0);
        player.setCollideWorldBounds(true);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        bombs = this.physics.add.group();

        for(var i = 0; i < 3; i++) {
            var start = Phaser.Math.Between(100, 1500);
            var bomb = bombs.create(start, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-500, 500), 100);
            bomb.allowGravity = true;
        }

        //  The score
        score = 0;
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();

        //  Collide the player and the stars with the platforms
        // this.physics.add.collider(player, platforms);
        this.physics.add.collider(player, movingPlatforms);
        this.physics.add.collider(bombs, movingPlatforms);
        // this.physics.add.collider(movingPlatforms, platforms);

        this.physics.add.collider(player, bombs, hitBomb, null, this);
    }

    update () {

        if (gameOver) {
            gameOver = false;
            this.scene.start('BootScene');
        }

        if (cursors.left.isDown) {
            player.setVelocityX(-200);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(200);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-600);
        }

        movingPlatforms.getChildren().forEach(function(element) {
          element.x += -5;
          element.refreshBody();

          if(element.x < -400) {
            movingPlatforms.killAndHide(element);
            movingPlatforms.remove(element);
          }
        });

        if(movingPlatforms.getChildren()[movingPlatforms.getLength() - 1].x < (1400 + Phaser.Math.RND.between(-200, 0))) {
            //  Add and update the score
            score += 1;
            scoreText.setText('Score: ' + score);

            platformLevel += Phaser.Math.Between(-100, 100);

            if(platformLevel > 550) { platformLevel = 450; }
            else if(platformLevel < 200) { platformLevel = 300; }

            movingPlatforms.create(2000, platformLevel, 'ground').setScale(1).refreshBody().setBounce(1);
        }
    }
}

// Put and additional functions here. Syntax: 

/*
** function functionName(params) {
**      // Code Here...
** }
**
*/

function hitBomb (player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}