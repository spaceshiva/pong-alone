window.Vectors = {
  Vector : function (x, y) {
      this.x = x;
      this.y = y;

      this.magnitude = function() {
          return Math.sqrt(this.x * this.x + this.y * this.y);
      }

      this.normalize = function() {
          var mag = this.magnitude();
          this.x = this.x / mag;
          this.y = this.y / mag;
      }
  },
  toRadians : function(angle) {
    return angle * (Math.PI / 180);
  },
  diagonal : function(angle, speed) {
    var radiansX = Math.sin(this.toRadians(angle)) * speed;
    var radiansY = Math.cos(this.toRadians(angle)) * speed;
    var v = new Vectors.Vector(radiansX, radiansY);
    v.normalize();
    v.x = v.x * speed;
    v.y = v.y * speed;
    return v;
  }
};
