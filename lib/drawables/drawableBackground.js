function Background(ctx, image) {
    Drawable.call(this, 0, 30, ctx);

    this.draw = function() {
        this.context.drawImage(image, this.pos.x, this.pos.y);
    }
}
Background.prototype = new Drawable();
