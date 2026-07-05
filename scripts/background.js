
export default class Background { // Credits to TK: https://www.youtube.com/watch?v=4wz1zrbTAo0
    constructor(image, w, h){
        this.x=0;
        this.y=0;
        this.w = w;
        this.h = h;
        this.x2 = w;
        this.image = image
        
    }
    draw(ctx){
        ctx.beginPath();
        ctx.drawImage(this.image,this.x,0, this.w, this.h);
        ctx.drawImage(this.image,this.x2,0, this.w, this.h);
        ctx.closePath();
        
    }
    update(speed){
        if(this.x < -this.w){
            this.x= this.w - speed + this.x2;
        }
        else{
            this.x-=(speed-3);
        }
        if(this.x2 < -this.w){
            this.x2= this.w - speed + this.x;
        }
        else{
            this.x2-=(speed-3);
        }
    }
}
