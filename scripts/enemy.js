import Point2D from '/scripts/point2d.js';



export default class Enemy {
    constructor(position, image, w, h) {
        this.position = position;
        this.w = w;
        this.h = h;
        let enemyImg = new Image();
        enemyImg.src = image;
        this.image = enemyImg;
    }

    // A method that can be used to draw the point.
    draw(ctx) {
        ctx.beginPath();
        ctx.drawImage(this.image,this.position.x,this.position.y, this.w, this.h)
        ctx.closePath();
    }

    // A method that can be used to create a point
    // without passing a point2D.
    static create(x, y, image, w, h) {
        const position = new Point2D(x, y);
        return new Enemy(position, image, w, h);
    }
}
