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

function ScoreBoard(x, y, ctx) {
    Drawable.call(this, x, y, ctx);
    this.score = INIT_VAL.SCORE;
    this.level = INIT_VAL.LEVEL;
    this.lives = INIT_VAL.LIVES;
    this.levelUp = false;

    this.addPoints = function(pts) {
        if (!isNaN(pts)) {
            this.score += pts;
            if (this.score > 10000) {
                this.score = 10000;
                return;
            }

            var nextLevel = parseInt(this.score / 1000, 10) + 1;
            if (nextLevel > this.level) {
                this.level = nextLevel;
                this.levelUp = true;
            }
        }
    }

    this.updateLives = function(lives) {
        if (!isNaN(lives)) {
            this.lives += lives;
            if (this.lives < 0) {
                this.lives = 0;
            }
        }
    }

    this.draw = function() {
        ctx.beginPath();
        ctx.font = "15px press_start";
        ctx.fillStyle = "white";
        ctx.fillText("SCORE " + this.score, 20, 25);
        ctx.fillText("LEVEL " + this.level, 190, 25);
        ctx.fillText("LIVES " + this.lives, 320, 25);
    }
    // na atualização do frame, jogamos os pontos acumulados para o placar
    this.update = function() {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.levelUp = false;
    }
}
ScoreBoard.prototype = new Drawable();


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


function Background(ctx, image) {
    Drawable.call(this, 0, 30, ctx);

    this.draw = function() {
        this.context.drawImage(image, this.pos.x, this.pos.y);
    }
}
Background.prototype = new Drawable();
