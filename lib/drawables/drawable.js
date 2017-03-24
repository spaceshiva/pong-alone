function Drawable(x, y, ctx) {
    var self = this;
    this.pos = new Vectors.Vector(x, y);
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.width = 0;
    this.height = 0;
    this.context = ctx;

    this.checkCollision = function(theOther) {
        return Vectors.checkCollision(this.pos, this.maxPos(), theOther.pos, theOther.maxPos());
    }

    this.maxPos = function() {
        return new Vectors.Vector(self.pos.x + self.width, self.pos.y + self.height);
    }

    // funções abstratas que serão implementadas pelos elementos
    this.draw = function() {};
    this.update = function() {};
}
