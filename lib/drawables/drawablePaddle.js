function Paddle(x, y, ctx, image) {
    Drawable.call(this, x, y, ctx);
    this.speed = INIT_VAL.PADDLE_SPEED;
    const BG_BORDER_H = 16;

    this.draw = function() {
        this.context.drawImage(image, this.pos.x, this.pos.y);
    }

    this.update = function() {
        // reagimos apenas para cima e para baixo
        if (KEY_STATUS.up || KEY_STATUS.down || KEY_STATUS.w || KEY_STATUS.s) {
            this.context.clearRect(this.pos.x, this.pos.y, this.width, this.height);
            if (KEY_STATUS.up || KEY_STATUS.w) {
                this.pos.y -= this.speed;
                if (this.pos.y <= BOUND.MIN_Y) {
                    this.pos.y = BOUND.MIN_Y;
                }
            } else {
                this.pos.y += this.speed;
                if ((this.pos.y + this.height) >= this.canvasHeight - BG_BORDER_H) {
                    this.pos.y = this.canvasHeight - this.height - BG_BORDER_H;
                }
            }
        }
    }
}
Paddle.prototype = new Drawable();
