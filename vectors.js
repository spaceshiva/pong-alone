window.Vectors = {
    Vector: function(x, y) {
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
    checkCollision: function(minVA, maxVA, minVB, maxVB) {
        if ((maxVA.x < minVB.x) || (minVA.x > maxVB.x)) return false;
        if ((maxVA.y < minVB.y) || (minVA.y > maxVB.y)) return false;

        return true;
    },
    toRadians: function(angle) {
        return angle * (Math.PI / 180);
    },
    radiansSin: function(angle) {
        return Math.sin(this.toRadians(angle));
    },
    radiansCos: function(angle) {
        return Math.cos(this.toRadians(angle));
    },
    diagonal: function(angle, speed) {
        var radiansX = this.radiansCos(angle) * speed; //this.radiansSin(angle) * speed;
        var radiansY = this.radiansSin(angle) * speed; //this.radiansCos(angle) * speed;
        var v = new this.Vector(radiansX, radiansY);
        v.normalize();
        v.x = v.x * speed;
        v.y = v.y * speed;
        return v;
    }
};
