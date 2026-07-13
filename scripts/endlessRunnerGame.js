//Credits to Nicolai Andersen:  https://medium.com/better-programming/how-to-build-a-2d-endless-runner-game-with-javascript-and-html-11940ab797bf

import Animator from './animator.js';
import Background from './background.js';
import Collider from './collider.js';
import Movement from './movement.js';
import Player from './player.js';
import Point2D from './point2d.js';
import Point from './point.js';
import Spawner from './spawner.js';
import Enemy from './enemy.js';


const canvas = document.getElementById("canvas");
const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");
const cardPts = document.getElementById("card-points");
const overlay = document.getElementById("overlay");
const citizenOverlay = document.getElementById("citizen-overlay");
const citizenInfo = document.getElementById("citizen-card");

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
const welcome = document.getElementById("welcome");
const lobbyUI = document.getElementById("lobby");
const bgImgLobby = document.getElementById("bg-img");
const gameStats = document.getElementById("game-stats");
const gameDistanceTravelled = document.getElementById("distance");
const gamePointsEarned = document.getElementById("points");
const totalGamePoints = document.getElementById("total-points");
const citizensLobby = document.getElementById("citizens");
const gameClear = document.getElementById("game-clear");
const supported = document.getElementById("supported");
let intervalId = null;
let noticeTimer = null;
let trailerTimer = null;
let citizensSaved = 0;
//Global variables
window.totalPoints = 0;
window.earnedPoints = 0;

var expeditionBgm = new Audio("audio/expedition-bgm.mp3");
var lobbyBgm = new Audio("audio/lobby-bgm.mp3");
var menuBgm = new Audio("audio/menu-bgm.mp3");
var jumpSFX = new Audio("audio/jump-sfx.mp3");
var clickSFX = new Audio("audio/button-click.mp3");
var hoverSFX = new Audio("audio/hover-sfx.mp3");
var buttonHoverSFX = new Audio("audio/button-hover.mp3");
let introSkip = false;

expeditionBgm.volume= 0.1;
lobbyBgm.volume= 0.1;
menuBgm.volume= 0.1;
expeditionBgm.loop = true;
lobbyBgm.loop = true;
menuBgm.loop = true;




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
                jumpSFX.play();
                this.player.jump();
                
            }
        });
        intervalId =  setInterval(this.loop.bind(this), this.frameRate);
        
    }

    // A method used to execute the game's keydown events.
    keydown(event) {
        if (event.code == 'Space') {
            if (!this.gameOver)
                jumpSFX.play();
                this.player.jump();
        }
    }

    // A method used to execute the game's continuous behaviour.
    loop() {
        // Clear the canvas.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw game objects
        this.background.draw(this.ctx);
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
            this.updateStats()
            
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
        overlay.style.display ="flex";
        card.style.display = "block";
        
    }
    updateStats(){
        gameDistanceTravelled.textContent = this.score;
        gamePointsEarned.textContent = earnedPoints;
    }


}
const citizens = {
    ariyori:25,
    oruyanke:30,
    fubuchun:35,
    miteiru: 40,
    nejima: 45,
    fubuzilla: 50
}
const enemies=[
        "images/poyoyo.png",
        "images/onigirya.png",
        "images/pebble.png"];

var bgImg = new Image();
bgImg.src = "images/bg.png";

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
        "images/sukonbu-1.png",
        "images/sukonbu-2.png",
        "images/sukonbu-3.png",
        "images/sukonbu-4.png"
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
        Enemy.create(-130, 0, enemies[randomize(enemies)], 40, 40),
        Enemy.create(-130, 0, enemies[0], 40, 40),
        Enemy.create(-130, 0, enemies[randomize(enemies)], 40, 40),
        Enemy.create(-130, 0, enemies[1], 40, 40),
        Enemy.create(-130, 0, enemies[randomize(enemies)], 40, 40),
        Enemy.create(-130, 0, enemies[2], 40, 40)
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

function randomize(array){
    return Math.floor(Math.random() * array.length);
}

//Menu Functions
//Display the element on the second parameter
function swapMenu(menu1, menu2){
    menu1.style.display = "none";
    menu2.style.display = "flex";
    menu2.classList.add("show-menu");
}


document.getElementById("start-btn").addEventListener('click', function(){
    document.getElementById("start-btn").textContent = "Continue";
    supported.style.display = "none";
    if(introSkip){
        swapMenu(menu, lobby);
        menuBgm.pause();
        supported.style.display = "none";
        homeBG.style.display="none";
        lobbyBgm.play();
    }
    else if(!introSkip){
        introSkip=true;
        clickSFX.play();
        menuBgm.pause();
        swapMenu(menu, intro);
        homeBG.style.display="none";
        intro.classList.add("hide-notice");
        skipBtn.style.display = "block";
        noticeTimer = setTimeout(function(){
            intro.style.display ="none";
            intro.classList.remove("hide-notice");
            trailer.style.display = "flex";
            trailer.classList.add("show-element");
            trailerVid.play();
            trailerVid.addEventListener('ended', function() {
                trailer.classList.add("hide-element");
                trailerTimer = setTimeout(function(){
                    trailer.style.display = "none";
                    skipBtn.style.display = "none";
                },1000)
                trailer.classList.remove("show-element");
                trailer.classList.remove("hide-element");
                lobby.style.display = "flex";
            })
        }, 7000);
    }
});

skipBtn.addEventListener('click',function(){
    clickSFX.play();
    clearTimeout(noticeTimer);
    clearTimeout(trailerTimer);
    intro.style.display ="none";
    intro.classList.remove("hide-element");
    trailer.style.display = "none";
    trailer.classList.remove("show-element");
    trailer.classList.remove("hide-element");
    trailerVid.pause();
    trailerVid.currentTime = 0;
    skipBtn.style.display = "none";
    lobby.style.display = "flex";
});


document.getElementById("lobby-btn").addEventListener('click', function(e){
    clickSFX.play();
    e.target.style.display = "none";
    welcome.classList.add("hide-element");
    setTimeout(function(){
        lobbyBgm.play();
        welcome.style.display = "none";
        lobbyUI.style.display = "flex";
        lobbyUI.classList.add("show-element");
        bgImgLobby.getElementsByTagName("img")[0].src = "images/fbkingdom-lobby.png"
        bgImgLobby.classList.add("show-element");
    },1000);
});

document.getElementById("help-btn").addEventListener('click', function(){
    clickSFX.play();
    swapMenu(menu,help);
    menuBgm.play();
});
document.getElementById("credits-btn").addEventListener('click', function(){
    clickSFX.play();
    swapMenu(menu,credit);
    menuBgm.play();
});
document.getElementById("help-btn-home").addEventListener('click', function(){
    clickSFX.play();
    swapMenu(help,menu);
});
document.getElementById("credit-btn-home").addEventListener('click', function(){
    clickSFX.play();
    swapMenu(credit,menu);
});







//Lobby Event Listeners
document.getElementById("expedition-btn").addEventListener('click',function(){
    clickSFX.play();
    lobbyBgm.pause();
    lobby.style.display="none";
    canvas.style.display="block";
    gameStats.style.display="flex";
    expeditionBgm.play();
    startGame();
});

document.getElementById("lobby-btn-home").addEventListener('click',function(){
    clickSFX.play();
    lobbyBgm.pause();
    swapMenu(lobby, menu);
    supported.style.display= "block";
    homeBG.style.display="flex";
    menuBgm.play();
    
})


//Expedition listeners
document.getElementById("return-lobby-btn").addEventListener('click', function(){
    clickSFX.play();
    expeditionBgm.pause();
    lobbyBgm.play();
    lobby.style.display="block";
    overlay.style.display ="none";
    canvas.style.display="none";
    gameStats.style.display="none";
    clearInterval(intervalId);
    intervalId = null;
    window.totalPoints += earnedPoints;
    totalGamePoints.getElementsByTagName("p")[0].textContent = window.totalPoints;
});

//Restart game
document.getElementById("play-again-btn").addEventListener('click', function(){
    clickSFX.play();
    card.style.display = "none";
    endlessRunnerGame.initialize();
});


citizensLobby.querySelectorAll(".locked").forEach(citizen => {
    citizen.addEventListener("mouseover",function(){
        citizenOverlay.style.display="flex";
        hoverSFX.play();
        if(citizen.classList.contains("locked")){
            citizenInfo.getElementsByTagName("p")[0].textContent = citizens[citizen.id] +  " pts to unlock ????" ;
        }
        
    });

    citizen.addEventListener("mouseout",function(){
        citizenOverlay.style.display="none";
    });

    citizen.addEventListener("click",function(){
        clickSFX.play();
        citizenOverlay.style.display="flex";
        if(citizen.classList.contains("locked") && totalPoints < citizens[citizen.id]){
            citizenInfo.getElementsByTagName("p")[0].textContent = "You dont have enough points";
        }
        else if(citizen.classList.contains("locked") && totalPoints >= citizens[citizen.id]){
            totalPoints -= citizens[citizen.id];
            totalGamePoints.getElementsByTagName("p")[0].textContent = window.totalPoints;
            citizensSaved++;
            citizenInfo.getElementsByTagName("p")[0].textContent = "You have saved " + [citizen.id];
            citizen.classList.remove("locked");
            citizen.classList.add("unlocked");
            citizen.addEventListener("mouseover",function(){
                hoverSFX.play();
                citizenOverlay.style.display="flex";
                citizenInfo.getElementsByTagName("p")[0].textContent = "Citizen: " + citizen.id;
            });

            if(citizensSaved==6){
                gameClear.classList.add("show-element");
                setTimeout(function(){
                    gameClear.style.display = "flex";
                }, 8000);
                
            }
        }
        
    });
});

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("mouseover",function(){
    buttonHoverSFX.play();
    });
});
