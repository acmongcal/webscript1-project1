//Credits to Nicolai Andersen:  https://medium.com/better-programming/how-to-build-a-2d-endless-runner-game-with-javascript-and-html-11940ab797bf

import Animator from '/scripts/animator.js';
import Background from '/scripts/background.js';
import Collider from '/scripts/collider.js';
import Movement from '/scripts/movement.js';
import Player from '/scripts/player.js';
import Point2D from '/scripts/point2d.js';
import Point from '/scripts/point.js';
import Spawner from '/scripts/spawner.js';
import Enemy from '/scripts/enemy.js';


const canvas = document.getElementById("canvas");
const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");
const cardPts = document.getElementById("card-points");
const overlay = document.getElementById("overlay");
//menu elements
const menu = document.getElementById("menu");
const homeBG = document.getElementById("bg");
const help = document.getElementById("help");
const credit = document.getElementById("credits");
const lobby = document.getElementById("game-lobby");
const intro = document.getElementById("intro");
const trailer = document.getElementById("trailer");
const trailerVid = document.getElementById("trailer-vid");
const skipBtn = document.getElementById("skip");
let intervalId = null;
let noticeTimer = null;
let trailerTimer = null;
//Global variables
window.totalPoints = 0;
window.earnedPoints = 0;





class EndlessRunnerGame {
    constructor(canvas, frameRate, groundOffset, playerOptions, spawnerOptions, difficulty) {
        this.canvas =canvas;
        this.ctx = this.canvas.getContext("2d");
        this.frameRate = frameRate;
        this.groundY = this.canvas.height - groundOffset;
        this.playerOptions = playerOptions;
        this.spawnerOptions = spawnerOptions;
        this.difficulty = difficulty;
        this.initialize();
    }

    // A method used to initialize the game.
    initialize() {
        
        this.background = new Background(bgImg, this.canvas.width, this.canvas.height);
        this.player = Player.create(playerOptions, this.groundY);
        this.spawner = Spawner.create(spawnerOptions, this.canvas.width, this.groundY);
        this.speed = 0;
        this.score = 0;
        this.gameOver = false;
        earnedPoints = 0;
    }

    // A method used to start the game.
    start() {
        document.addEventListener('keydown', this.keydown.bind(this));
        addEventListener('mousedown', e => {
            if(!this.gameOver){
                this.player.jump();
            }
        });
        intervalId =  setInterval(this.loop.bind(this), this.frameRate);
        
    }

    // A method used to execute the game's keydown events.
    keydown(event) {
        if (event.code == 'Space') {
            if (!this.gameOver)
                this.player.jump();
        }
    }

    // A method used to execute the game's continuous behaviour.
    loop() {
        // Clear the canvas.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw game objects
        this.background.draw(this.ctx);
        this.drawGround();
        this.drawScore();
        this.player.draw(this.ctx);
        this.spawner.draw(this.ctx);

        // If the game is ended.
        if (this.gameOver) {
            // Draw game over elements.
            this.drawGameOver();

            // otherwise, execute game behaviour.
        } else {
            // Increase difficulty.
            this.increaseDifficulty();

            // Execute update.
            this.background.update(this.spawner.speed);
            this.player.update();
            this.spawner.update();
            
            // Check for collisions.

            this.gameOver = this.player.overlapsWithOthers(this.spawner.activeObstacles);
            
            // Increase score.
            this.score++;
        }
    }

    // A method used to increase the game's difficulty.
    increaseDifficulty() {
        if (this.speed < this.difficulty.maxIncreasement) {
            this.speed += this.difficulty.speedIncreasement;
            this.player.movement.jumpPower += this.difficulty.speedIncreasement;
            this.player.movement.gravity += this.difficulty.speedIncreasement;
            this.spawner.speed += this.difficulty.speedIncreasement;
        }
    }

    // A method used to draw the game over text
    // if the game ends.
    drawGameOver() {
        cardScore.textContent = this.score;
        cardPts.textContent = earnedPoints;
        window.totalPoints += earnedPoints;
        overlay.style.display ="flex";
        card.style.display = "block";
        
    }

    // A method used to draw the game's score.
    drawScore() {
        this.ctx.beginPath();
        this.ctx.fillText("score: " + this.score, 10, 20);
        this.ctx.closePath();
    }

    // A method used to draw the scene's ground.
    drawGround() {
        this.ctx.beginPath();
        this.ctx.rect(0, this.groundY, this.canvas.width, 3);
        this.ctx.fillStyle = "blue";
        this.ctx.fill();
        this.ctx.closePath();
    }
}



var bgImg = new Image();
bgImg.src = "images/page_bg_raw.jpg";
var pointImg = new Image();
pointImg.src = "images/point.png";
var enemyImg = new Image();
enemyImg.src = "images/enemy.png";
// Define player parameters.
const playerOptions = {
    width: 30,
    height: 50,
    startX: 40,
    jumpPower: 15,
    jumpHeight: 220,
    gravity: 12,
    playSpeed: 2,
    showTime: 5,
    imageSources: [
        "images/player1.png",
        "images/player2.png",
        "images/player3.png",
        "images/player4.png"
    ]
}

// Define spawner parameters.
const spawnerOptions = {
    width: 30,
    height: 50,
    minLength: 180,
    maxlength: 220,
    speed: 5,
    obstacles: [
        Enemy.create(-130, 0, enemyImg, 30, 50),
        Enemy.create(-130, 0, enemyImg, 30, 50),
        Enemy.create(-130, 0, enemyImg, 30, 50),
        Enemy.create(-130, 0, enemyImg, 30, 50),
        Enemy.create(-130, 0, enemyImg, 30, 50),
        Enemy.create(-130, 0, enemyImg, 30, 50)
    ]
}

// Define difficulty.
const difficulty = {
    speedIncreasement: .01,
    maxIncreasement: 5
}

// Create an instance of the game.
const frameRate = 30;
const groundOffset = 20;
const endlessRunnerGame = new EndlessRunnerGame(canvas, frameRate, groundOffset, playerOptions, spawnerOptions, difficulty);

function startGame() {
    endlessRunnerGame.start();
    endlessRunnerGame.initialize();
}



//Menu Functions
//Display the element on the second parameter
function swapMenu(menu1, menu2){
    menu1.style.display = "none";
    menu2.style.display = "flex";
}


document.getElementById("start-btn").addEventListener('click', function(){
    swapMenu(menu, intro);
    homeBG.style.display="none";
    intro.classList.add("hideElement");
    skipBtn.style.display = "block";
    noticeTimer = setTimeout(function(){
        intro.style.display ="none";
        intro.classList.remove("hideElement");
        trailer.style.display = "flex";
        trailer.classList.add("showElement");
        trailerVid.play();
        trailerVid.addEventListener('ended', function() {
            trailer.classList.add("hideVid");
            trailerTimer = setTimeout(function(){
                trailer.style.display = "none";
                skipBtn.style.display = "none";
            },2000)
            trailer.classList.remove("showElement");
            trailer.classList.remove("hideElement");
            lobby.style.display = "flex";
        })
    }, 7000);
});

skipBtn.addEventListener('click',function(){
    clearTimeout(noticeTimer);
    clearTimeout(trailerTimer);
    intro.style.display ="none";
    intro.classList.remove("hideElement");
    trailer.style.display = "none";
    trailer.classList.remove("showElement");
    trailer.classList.remove("hideElement");
    trailerVid.pause();
    trailerVid.currentTime = 0;
    skipBtn.style.display = "none";
    lobby.style.display = "flex";
});




document.getElementById("help-btn").addEventListener('click', function(){
    swapMenu(menu,help);
});
document.getElementById("credits-btn").addEventListener('click', function(){
    swapMenu(menu,credit);
});
document.getElementById("help-btn-home").addEventListener('click', function(){
    swapMenu(help,menu);
});
document.getElementById("credit-btn-home").addEventListener('click', function(){
    swapMenu(credit,menu);
});







//Lobby Event Listeners
document.getElementById("expedition-btn").addEventListener('click',function(){
    lobby.style.display="none";
    canvas.style.display="block";
    startGame();
});


//Expedition listeners
document.getElementById("return-lobby-btn").addEventListener('click', function(){
    lobby.style.display="block";
    overlay.style.display ="none";
    canvas.style.display="none";
    clearInterval(intervalId);
    intervalId = null;
});

//Restart game
document.getElementById("play-again-btn").addEventListener('click', function(){
    card.style.display = "none";
    // button.blur();
    endlessRunnerGame.initialize();
});
