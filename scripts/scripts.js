const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");

//Global variables

//SFX
let scoreSFX = new Audio("https://archive.org/download/classiccoin/classiccoin.wav");
let gameOverSFX = new Audio("https://archive.org/download/smb_gameover/smb_gameover.wav");
let jumpSFX = new Audio("https://archive.org/download/jump_20210424/jump.wav");



//Global Functions

let player = null;
let score = 0;
//Used to see if user has scored another 10 points or not
let scoreIncrement = 0;
let arrayBlocks = [];
//Enemy can speed up when player has scored points at intervals of 10
let enemySpeed = 5;
//So ball doesn't score more then one point at a time
let canScore = true;
//Used for 'setInterval'
let presetTime = 1000;

function startGame() {
    player = new Player(150,350,50,"black");
    arrayBlocks = [];
    score = 0;
    scoreIncrement = 0;
    enemySpeed = 5;
    presetTime = 1000;
}

function getRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

//Returns true of colliding
function squaresColliding(player,block){
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);
    //Don't need pixel perfect collision detection
    s2.size = s2.size - 10;
    s2.x = s2.x + 10;
    s2.y = s2.y + 10;
    return !(
        s1.x>s2.x+s2.size || //R1 is to the right of R2
        s1.x+s1.size<s2.x || //R1 to the left of R2
        s1.y>s2.y+s2.size || //R1 is below R2
        s1.y+s1.size<s2.y //R1 is above R2
    )
}


class Player {
    constructor(x,y,size,color){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.jumpHeight = 12;
        //These 3 are used for jump configuration
        this.shouldJump = false;
        this.jumpCounter = 0;
        this.jumpUp = true; 
    }

    draw() {
        this.jump();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }

    jump() {
        if(this.shouldJump){
            this.jumpCounter++;
            if(this.jumpCounter < 15){
                //Go up
                this.y -= this.jumpHeight;
            }else if(this.jumpCounter > 14 && this.jumpCounter < 19){
                this.y += 0;
            }else if(this.jumpCounter < 33){
                //Come back down
                this.y += this.jumpHeight;
            }
            //End the cycle
            if(this.jumpCounter >= 32){
                this.shouldJump = false;
            }
        }    
    }
}

class AvoidBlock {
    constructor(size, speed){
        this.x = canvas.width + size;
        this.y = 400 - size;
        this.size = size;
        this.color = "red";
        this.slideSpeed = speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size);
    }

    slide() {
        this.draw();
        this.x -= this.slideSpeed;
    }
    
}



//Auto generate blocks
function generateBlocks() {


    let timeDelay = randomInterval(presetTime);
    arrayBlocks.push(new AvoidBlock(50, enemySpeed));


    setTimeout(generateBlocks, timeDelay);
}

function randomInterval(timeInterval) {
    let returnTime = timeInterval;
    if(Math.random() < 0.5){
        returnTime += getRandomNumber(presetTime / 3, presetTime * 1.5);
    }else{
        returnTime -= getRandomNumber(presetTime / 5, presetTime / 2);
    }
    return returnTime;
}

function drawBackgroundLine() {
    ctx.beginPath();
    ctx.moveTo(0,400);
    ctx.lineTo(600,400);
    ctx.lineWidth = 1.9;
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function drawScore() {
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    let scoreString = score.toString();
    let xOffset = ((scoreString.length - 1) * 20);
    ctx.fillText(scoreString, 280 - xOffset, 100);
}

function shouldIncreaseSpeed() {
    //Check to see if game speed should be increased
        if(scoreIncrement + 10 === score){
            scoreIncrement = score;
            enemySpeed++;
            presetTime >= 100 ? presetTime -= 100 : presetTime = presetTime / 2;
            //Update speed of existing blocks
            arrayBlocks.forEach(block => {
                block.slideSpeed = enemySpeed;
            });
            console.log("Speed increased");
        }
}


let animationId = null;
function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //Canvas Logic
    drawBackgroundLine();
    drawScore();
    //Foreground
    player.draw();

    //Check to see if game speed should be increased
    shouldIncreaseSpeed();

    arrayBlocks.forEach((arrayBlock, index) => {
        arrayBlock.slide();
        //End game as player and enemy have collided
        if(squaresColliding(player, arrayBlock)){
            gameOverSFX.play();
            cardScore.textContent = score;
            card.style.display = "block";
            cancelAnimationFrame(animationId);
        }

        //Delete block that has left the screen
        if((arrayBlock.x + arrayBlock.size) <= 0){
            setTimeout(() => {
                arrayBlocks.splice(index, 1);
            }, 0)
        }
    });
    
}

//Call first time on document load
startGame();
animate();
setTimeout(() => {
    generateBlocks();
}, randomInterval(presetTime))








//Restart game
function restartGame(button) {
    card.style.display = "none";
    button.blur();
    startGame();
    requestAnimationFrame(animate);
}


//User Controls
addEventListener("keydown", e => {
    if(e.code === 'Space'){
        if(!player.shouldJump){
            jumpSFX.play();
            player.jumpCounter = 0;
            player.shouldJump = true;
        }
    }
});

addEventListener('mousedown', e => {
  if(!player.shouldJump){
            jumpSFX.play();
            player.jumpCounter = 0;
            player.shouldJump = true;
  }
});

