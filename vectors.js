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
  checkCollision : function (minVA, maxVA, minVB, maxVB) {
    //console.log(minVA, maxVA, minVB, maxVB);
    if((maxVA.x < minVB.x) || (minVA.x > maxVB.x)) return false;
    if((maxVA.y < minVB.y) || (minVA.y > maxVB.y)) return false;

    return true;
  },
  toRadians : function(angle) {
    return angle * (Math.PI / 180);
  },
  diagonal : function(angle, speed) {
    var radiansX = Math.sin(this.toRadians(angle)) * speed;
    var radiansY = Math.cos(this.toRadians(angle)) * speed;
    var v = new this.Vector(radiansX, radiansY);
    v.normalize();
    v.x = v.x * speed;
    v.y = v.y * speed;
    return v;
  }
};
