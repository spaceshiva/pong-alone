function Drawable(x, y, ctx) {
    var self = this;
    this.pos = new Vectors.Vector(x, y);
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.width = 0;
    this.height = 0;
    this.context = ctx;

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
            if(this.score > 10000) {
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
            if(this.lives < 0) {
              this.lives = 0;
            }
        }
    }

    this.draw = function() {
        ctx.beginPath();
        ctx.font = "15px press_start";
        ctx.fillStyle = "white";
        ctx.fillText("SCORE " + this.score, 20, 20);
        ctx.fillText("LEVEL " + this.level, 190, 20);
        ctx.fillText("LIVES " + this.lives, 320, 20);
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
    this.paddleCollision = false;
    this.paddle = paddle;
    this.speed = INIT_VAL.BALL_SPEED;
    this.state = BALL_STATE.INIT;
    this.draw = function() {
        this.context.drawImage(image, this.pos.x, this.pos.y);
    }
    this.update = function() {
        this.context.clearRect(this.pos.x - 1, this.pos.y - 1, this.width + 2, this.height + 2);
        if (this.state === BALL_STATE.INIT || this.state === BALL_STATE.DEAD) {
            this.pos.y = getRandom(BOUND.MIN_Y, BOUND.MAX_Y);
            this.pos.x = getRandom(BOUND.MAX_X / 2, BOUND.MAX_X);
            this.direction = getRandom(BALL_DIRECTION.UP_LEFT, BALL_DIRECTION.DOWN_RIGHT);
            this.state = BALL_STATE.MOVING;
        }
        if (this.state === BALL_STATE.MOVING) {
            // moving
            var v = Vectors.diagonal(45, this.speed);
            this.paddleCollision = false;

            switch (this.direction) {
                case BALL_DIRECTION.UP_LEFT:
                    this.pos.y -= v.y;
                    this.pos.x -= v.x;
                    break;
                case BALL_DIRECTION.UP_RIGHT:
                    this.pos.y -= v.y;
                    this.pos.x += v.x;
                    break;
                case BALL_DIRECTION.DOWN_LEFT:
                    this.pos.y += v.y;
                    this.pos.x -= v.x;
                    break;
                case BALL_DIRECTION.DOWN_RIGHT:
                    this.pos.y += v.y;
                    this.pos.x += v.x;
                    break;
            }
            // check boundaries
            if (this.pos.x <= 0) {
                this.state = BALL_STATE.DEAD;
                return;
            }
            if (this.pos.x >= BOUND.MAX_X) {
                if (this.direction === BALL_DIRECTION.UP_RIGHT) {
                    this.direction = BALL_DIRECTION.UP_LEFT;
                } else if (this.direction === BALL_DIRECTION.DOWN_RIGHT) {
                    this.direction = BALL_DIRECTION.DOWN_LEFT;
                }
                return;
            }
            if (this.pos.y <= BOUND.MIN_Y) {
                if (this.direction === BALL_DIRECTION.UP_LEFT) {
                    this.direction = BALL_DIRECTION.DOWN_LEFT;
                } else if (this.direction === BALL_DIRECTION.UP_RIGHT) {
                    this.direction = BALL_DIRECTION.DOWN_RIGHT;
                }
                return;
            }
            if (this.pos.y >= BOUND.MAX_Y) {
                if (this.direction === BALL_DIRECTION.DOWN_LEFT) {
                    this.direction = BALL_DIRECTION.UP_LEFT;
                } else if (this.direction === BALL_DIRECTION.DOWN_RIGHT) {
                    this.direction = BALL_DIRECTION.UP_RIGHT;
                }
                return;
            }
            // a checagem mais complicada no fim
            if (Vectors.checkCollision(this.paddle.pos, this.paddle.maxPos(), this.pos, this.maxPos())) {
                this.paddleCollision = true;
                if (this.direction === BALL_DIRECTION.DOWN_LEFT) {
                    this.direction = BALL_DIRECTION.DOWN_RIGHT;
                } else if (this.direction === BALL_DIRECTION.UP_LEFT) {
                    this.direction = BALL_DIRECTION.UP_RIGHT;
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

    this.draw = function() {
        this.context.drawImage(image, this.pos.x, this.pos.y);
    }

    this.update = function() {
        // reagimos apenas para cima e para baixo
        if (KEY_STATUS.up || KEY_STATUS.down) {
            this.context.clearRect(this.pos.x, this.pos.y, this.width, this.height);
            if (KEY_STATUS.up) {
                this.pos.y -= this.speed;
                if (this.pos.y <= BOUND.MIN_Y) {
                    this.pos.y = BOUND.MIN_Y;
                }
            } else {
                this.pos.y += this.speed;
                if ((this.pos.y + this.height) >= this.canvasHeight) {
                    this.pos.y = this.canvasHeight - this.height;
                }
            }
        }
    }
}
Paddle.prototype = new Drawable();
