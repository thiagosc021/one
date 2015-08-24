var game = new Phaser.Game(400, 490, Phaser.AUTO, 'oneHundred');
var startedFly = false;
var mainState = {
	startfly: function(){
        if (!startedFly){
             game.physics.arcade.enable(this.asaDelta);
        	this.asaDelta.body.gravity.y = 1000;
            this.timer = this.game.time.events.loop(1500, this.addRowOfevilBird, this);
			music.play('',0,1,true);
            
        }
        startedFly = true;
    },
	
	preload: function() { 
        game.load.image('asaDelta', 'assets/images/asaDelta.png');  
        game.load.image('evilBird', 'assets/images/evilBird.png'); 
        game.load.image('background', 'assets/images/nuvens.png');
        game.load.audio('jump', 'assets/audio/jump.wav'); 
		game.load.audio('music', 'assets/audio/bgSound.mp3');
		game.load.audio('loose', 'assets/audio/loose.wav');
		music = game.add.audio('music',1,true);
    },

    create: function() { 
        game.physics.startSystem(Phaser.Physics.ARCADE);
		this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        this.background.autoScroll(-20, 0);
        this.evilBird = game.add.group();
        this.evilBird.enableBody = true;
        this.evilBird.createMultiple(20, 'evilBird');  
        this.asaDelta = this.game.add.sprite(100, 245, 'asaDelta');
        this.asaDelta.anchor.setTo(-0.2, 0.5); 
 		var presstart = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
		presstart.onDown.add(this.startfly, this);
		var upkey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upkey.onDown.add(this.jump, this); 
		this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#fff" });  
		this.jumpSound = this.game.add.audio('jump');
		this.loose = this.game.add.audio('loose');
		
	},

    update: function() {
        if (this.asaDelta.inWorld == false)
            this.restartGame(); 

        game.physics.arcade.overlap(this.asaDelta, this.evilBird, this.crashevilBird, null, this); 

        if (this.asaDelta.angle < 20)
            this.asaDelta.angle += 1;     
    },

    jump: function() {
        if (this.asaDelta.alive == false)
            return; 
		this.asaDelta.body.velocity.y = -350;
		game.add.tween(this.asaDelta).to({angle: -20}, 100).start();
		this.jumpSound.play();
    },

    crashevilBird: function() {
        if (this.asaDelta.alive == false)
			return;
		this.asaDelta.alive = false;
		this.loose.play();
		this.game.time.events.remove(this.timer);
    	this.evilBird.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    restartGame: function() {
        game.state.start('main');
		music.play('',0,0,false);
		startedFly = false;
    },

    addOneevilBird: function(x, y) {
        var evilBird = this.evilBird.getFirstDead();
		evilBird.reset(x, y);
        evilBird.body.velocity.x = -200;  
        evilBird.checkWorldBounds = true;
        evilBird.outOfBoundsKill = true;
    },

    addRowOfevilBird: function() {
        var hole = Math.floor(Math.random()*5)+1;
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOneevilBird(400, i*60+10);   
    
        this.score += 1;
        this.labelScore.text = this.score;  
    },
};
  
game.state.add('main', mainState);
game.state.start('main');