/*****************************************
* Enemy class: 
******************************************/
const Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position.
// Parameter: dt, a time delta between ticks.
Enemy.prototype.update = function(dt) {
    this.x += (this.speed * dt);
};

// Draw the enemy on the screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if (this.x > 500) {
        this.x -= 600;
    }
};

/*****************************************
* Player class: 
******************************************/
const Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.hearts = 3;
    this.character = 1;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.collisionBetween = function (player, enemy) {
    if (this.y === enemy.y) {
        if ((enemy.x + 30 >= this.x - 25) && (enemy.x - 30 <= this.x + 25)) {
            return true;
        } else {
            return false;
        }
    }
};

Player.prototype.findingKey = function (player, key) {
    if (this.y === (key.y - 69)) {
        if ((key.x + 30 >= this.x - 25) && (key.x - 30 <= this.x + 25)) {
            return true;
        } else {
            return false;
        }
    }
};

Player.prototype.looseHearts = function() {
    if (this.hearts === 3) {
        this.hearts = 2;
        $("#heart3").remove();
    }
    else if (this.hearts === 2) {
        this.hearts = 1;
        $("#heart2").remove();
    }
    else if (this.hearts === 1) {
        this.hearts = 0;
        $("#heart1").remove();
        player.x = 205;
        arcade.startMenu("Game over!", undefined, "Play again?");
    }
    arcade.gameStats = gameConsole.html();
};

// Row needed for engine.js to work..
Player.prototype.update = function() {
    //Function "handleInput" does the work.
};

// Draw the player on the screen.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player movement.
Player.prototype.handleInput = function(input) {
    switch (input) {
      case 'up': {
        (this.y-83>-15) ? (this.y -= 83) && (controller.sound === "on") ? moveAudio.play() : false : (key.found) ? arcade.finnishGame() : false;
        break;
      }
      case  'down': {
        (this.y+83<=400) ? (this.y += 83) && (controller.sound === "on") ? moveAudio.play() : false : false;
        break;
      }
      case 'left': {
        (this.x-100>=5) ? (this.x -= 100) && (controller.sound === "on") ? moveAudio.play() : false : false;
        break;
      }
      case 'right': {
        (this.x+100<=405) ? (this.x +=100) && (controller.sound === "on") ? moveAudio.play() : false : false;
        break;
      }
    }
};

// Change player character.
Player.prototype.changeCharacter = function(value) {
    if (value === "next") {
        if (this.character === 5) {
            this.character = 1;
        }
        else {
            this.character += 1;
        }
    }
    else if (value === "back") {
        if (this.character === 1) {
            this.character = 5;
        }
        else {
            this.character -= 1;
        }
    }
    var allCharacters = {
        1: 'images/char-boy.png',
        2: 'images/char-cat-girl.png',
        3: 'images/char-horn-girl.png',
        4: 'images/char-pink-girl.png',
        5: 'images/char-princess-girl.png'
    };
    this.sprite = allCharacters[this.character];
    $("#gameChar").attr("src", allCharacters[this.character]);
};

/*****************************************
* Key class: 
******************************************/
const Key = function() {
    this.sprite = 'images/Key.png';
    this.x = 230;
    this.y = 210; // player 141.
    this.found = false;
};

Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*****************************************
* Rock class: 
******************************************/
const Rock = function(x, y) {
    this.sprite = 'images/Rock.png';
    this.x = x;
    this.y = y;
};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*****************************************
* Game class: 
******************************************/
const Game = function() {
    this.state = "off";
    this.gameStats = "";
};

Game.prototype.startMenu = function (h1 = "Arcade Game", charText = "Select character", startBtn = "START GAME", selected = false) {
    gameConsole.text("- Game menu -");
    (arcade.state === "running") ? $(".screen").fadeIn() && $("#startMenu").fadeIn() : $("#startMenu").fadeIn();
    arcade.state = "paused";
    $("#menu-h1").text(h1);
    $("#char-text").text(charText);
    $(".gameStartBtn").text(startBtn);
    if (selected) {
        $(".gameStartBtn").addClass("hidden");
        $("#gameContinueBtn").removeClass("hidden");
        $("#soundOption").removeClass("hidden");
    }
};

Game.prototype.resetGame = function () {
    player.hearts = 3;
    let charHearts = "";
    for (let i = 1; i <= 3; i++) {
        let heart = "<img src=\"images/Heart.png\" id=\"heart" + i + "\" alt=\"heart\" height=\"30px\" width=\"30px\">";
        charHearts += heart;
    }
    arcade.gameStats = charHearts;
    gameConsole.html(arcade.gameStats);
};

Game.prototype.startGame = function () {
    $(".screen").fadeOut();
    (arcade.state === "win") ? $("#finnishMenu").fadeOut() : $("#startMenu").fadeOut();
    arcade.state = "running";
    arcade.resetGame();
    arcade.createGameEntities();
};

Game.prototype.continueGame = function () {
    $(".screen").fadeOut();
    $("#startMenu").fadeOut();
    arcade.state = "running";
    gameConsole.html(arcade.gameStats);
    $("#soundOption").addClass("hidden");
    $("#gameContinueBtn").addClass("hidden");
    $(".gameStartBtn").removeClass("hidden");
};

Game.prototype.finnishGame = function () {
    player.y = 390;
    player.x = 205;
    gameConsole.text("- Finnish modal -");
    arcade.state = "win";
    (controller.sound === "on") ? victoryAudio.play() : false;
    $(".gameStartBtn").text("Play again?");
    $(".screen").fadeIn();
    $("#finnishMenu").fadeIn();
};

Game.prototype.createGameEntities = function () {
    const bug1 = new Enemy(0, 58, 200);
    const bug2 = new Enemy(-200, 141, 150);
    const bug3 = new Enemy(0, 224, 180);
    const bug4 = new Enemy(-350, 307, 140);
    const bug5 = new Enemy(-200, 224, 250);
    const bug6 = new Enemy(-200, 58, 90);

    allEnemies.splice(0);
    allEnemies.push(bug1, bug2, bug3, bug4, bug5, bug6);

    const stone1 = new Rock(0, -15);
    const stone2 = new Rock(100, -15);
    const stone3 = new Rock(200, -15);
    const stone4 = new Rock(300, -15);
    const stone5 = new Rock(400, -15);

    allRocks.splice(0);
    allRocks.push(stone1, stone2, stone3, stone4, stone5);

    const varX = Math.floor((Math.random() * 5) + 1);

    key.y = 210;

    switch (varX) {
      case 1: {
        key.x = 30;
        break;
      }
      case 2: {
        key.x = 130;
        break;
      }
      case 3: {
        key.x = 230;
        break;
      }
      case 4: {
        key.x = 330;
        break;
      }
      case 5: {
        key.x = 430;
        break;
      }
    }
};

Game.prototype.handleInput = function(key) {
    switch (key) {
      case 'space': {
        console.log("space key clicked");
        break;
      }
      case  'enter': {
        console.log("enter key clicked");
        break;
      }
      case 'backspace': {
        console.log("backspace key clicked");
        break;
      }
    }
};

/*****************************************
* Controller class: 
******************************************/
const Controller = function() {
    this.sound = "on";
};

Controller.prototype.handleInput = function(key) {
    if (key === "space") {
        this.startingUp();
    }
};

Controller.prototype.startingUp = function() {
    console.log("Controller started.");
    $(".gameConsole").text("Starting up..");
    $(".screen").addClass("screenLive");
    $(".powerLight").css("background-color", "lightgreen");
    setTimeout(function() {
        arcade.startMenu(); 
    }, 3000);
    (controller.sound === "on") ? startAudio.play() : false;
};

/*****************************************
* Game/Controller setup: 
******************************************/
/* Global varibles: */
let controller = new Controller();
let player = new Player(205,390);
let allEnemies = [];
let allRocks = [];
let key = new Key();
let arcade = new Game();
let gameConsole = $(".gameConsole");
/********************/

/* Sounds: */
const startAudio = new Audio('audio/start-up.wav');
const hitAudio = new Audio('audio/hit.wav');
const moveAudio = new Audio('audio/move.wav');
const keyAudio = new Audio('audio/find-key.wav');
const victoryAudio = new Audio('audio/applause.wav');
/***********/

/* buttons */
const startControllerButton = $("#controllerStartBtn");
startControllerButton.on("click", function() {
    (arcade.state === "running" || arcade.state === "paused" || arcade.state === "win") ? console.log("Controller already on") : controller.startingUp();
});

const selectControllerButton = $("#controllerSelectBtn");
selectControllerButton.on("click", function() {
    (arcade.state === "off" || arcade.state === "paused" || arcade.state === "win") ? console.log("already in menu") : arcade.startMenu(undefined, "Change character?", "Continue", true);
});

const startGameButton = $(".gameStartBtn");
startGameButton.on("click", function() {
    arcade.startGame();
});

const continueGameButton = $("#gameContinueBtn");
continueGameButton.on("click", function() {
    arcade.continueGame();
});

const soundOption = $("#soundOption");
soundOption.on("click", function() {
    (controller.sound === "on") ? (controller.sound = "off") && $("#sound").text("off") : (controller.sound = "on") && $("#sound").text("on");
});

$("#char-left").on("click", function() {player.changeCharacter("back")});
$("#char-right").on("click", function() {player.changeCharacter("next")});
/**********/

/* Controller steering */
$("#c-Btn-up").on("click", function() { if (arcade.state === "running") {player.handleInput("up")} });
$("#c-Btn-left").on("click", function() { if (arcade.state === "running") {player.handleInput("left")} });
$("#c-Btn-right").on("click", function() { if (arcade.state === "running") {player.handleInput("right")} });
$("#c-Btn-down").on("click", function() { if (arcade.state === "running") {player.handleInput("down")} });
/***********************/

// This listens for key presses.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',

        32: 'space',
        13: 'enter',
        8: 'backspace',
        
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down'
    };

    if (arcade.state === "running") {
        player.handleInput(allowedKeys[e.keyCode]);
    }
    else if (arcade.state === "paused" || arcade.state === "win") {
        arcade.handleInput(allowedKeys[e.keyCode]);
    }
    else if (arcade.state === "off"){
        controller.handleInput(allowedKeys[e.keyCode]);
    }
});
