function Ball(x, y, ctx, image, paddle) {
    Drawable.call(this, x, y, ctx);

    var factorY = 1;
    var factorX = 1;
    var angle = 0;

    // angulos confortáveis
    const ANGLES = [40, 45, 50, 55,
        125, 130, 135, 140, 145,
        215, 220, 225, 230, 235,
        305, 310, 315, 320, 325
    ];

    this.paddleCollision = false;
    this.paddle = paddle;
    this.speed = INIT_VAL.BALL_SPEED;
    this.state = BALL_STATE.INIT;

    function genNewAngle() {
        angle = ANGLES[getRandom(0, ANGLES.length - 1)];
        console.log("The Angle is %d", angle);
    }

    genNewAngle();

    this.draw = function() {
        this.context.drawImage(image, this.pos.x, this.pos.y);
    }

    this.update = function() {
        this.context.clearRect(this.pos.x - 1, this.pos.y - 1, this.width + 2, this.height + 2);
        if (this.state === BALL_STATE.INIT || this.state === BALL_STATE.DEAD) {
            this.pos.y = getRandom(BOUND.MIN_Y + this.height, BOUND.MAX_Y - this.height);
            this.pos.x = getRandom(BOUND.MAX_X / 2, BOUND.MAX_X - this.width);
            this.state = BALL_STATE.MOVING;
        }
        if (this.state === BALL_STATE.MOVING) {
            // moving
            var v = Vectors.diagonal(angle, this.speed);
            this.paddleCollision = false;
            this.pos.y += v.y * factorY;
            this.pos.x += v.x * factorX;

            // check boundaries
            if (this.pos.x <= 0) {
                this.state = BALL_STATE.DEAD;
                return;
            }
            if (this.pos.x >= (BOUND.MAX_X - this.width)) {
                factorX = (factorX < 0) ? 1 : -1;
                return;
            }
            if (this.pos.y <= BOUND.MIN_Y || this.pos.y >= BOUND.MAX_Y - this.height) {
                factorY = (factorY < 0) ? 1 : -1;
                return;
            }
            // a checagem mais complicada no fim
            if (this.checkCollision(this.paddle)) {
                this.paddleCollision = true;
                genNewAngle();
                if (Vectors.radiansCos(angle) < 0) {
                    factorX = -1;
                } else {
                    factorX = 1;
                }
                return;
            }
        }
    }
}
Ball.prototype = new Drawable();
