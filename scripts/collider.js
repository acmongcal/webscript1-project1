
export default class Collider {
    constructor(position, w, h) {
        this.position = position;
        this.w = w;
        this.h = h;
        this.pointSFX = new Audio("audio/point-sfx.mp3");
        this.gameOverSFX = new Audio("audio/game-over-sfx.mp3");
    }

    // A method that can be used to check if the
    // collider overlaps with another collider.
    overlaps(other) {
        return this.position.x < other.position.x + other.w
            && this.position.x + this.w > other.position.x
            && this.position.y < other.position.y + other.h
            && this.position.y + this.h > other.position.y;
    }

    // A method that returns true if the collider 
    // overlaps with one in the list of colliders.
    overlapsWithOthers(others) {
        let gameOver = false;
        others.forEach(other => {
            if(this.overlaps(other)){
                if(other.constructor.name == "Point"){
                    this.pointSFX.play();
                    window.earnedPoints++;
                    others.splice(other,1);
                    gameOver = false;
                }
                else{
                    this.gameOverSFX.play();
                    gameOver = true;
                }
            }
        })
        
        return gameOver;
    }
}