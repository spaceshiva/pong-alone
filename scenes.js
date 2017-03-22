function Scene() {
    this.state = null;
    this.draw = function() {}
    this.update = function() {}
}

function MainScene(elements) {
    this.ball = elements.ball;
    this.paddle = elements.paddle;
    this.scoreBoard = elements.scoreBoard;
    this.bg = elements.bg;

    this.update = function() {
        if (this.state !== STATES.PLAYING) {
            return;
        }

        this.ball.update();
        this.paddle.update();
        this.scoreBoard.update();
        this.bg.update();

        if (this.ball.paddleCollision) {
            this.scoreBoard.addPoints(INIT_VAL.PADDLE_SCORE);
        }

        if (this.ball.state === BALL_STATE.DEAD) {
            this.scoreBoard.updateLives(-1);
        }

        if (this.scoreBoard.levelUp) {
            this.scoreBoard.levelUp = false;
            this.ball.speed += 1;
            console.log("Level Up! Level now is %d", this.scoreBoard.level);
            console.log("Ball speed is now at %d", this.ball.speed);
        }
    }

    this.draw = function() {
        if (this.state !== STATES.PLAYING) {
            return;
        }
        this.ball.draw();
        this.paddle.draw();
        this.scoreBoard.draw();
        this.bg.draw();
    }
}
MainScene.prototype = new Scene();

function PauseScene(ctx, mainCanvas) {
    this.mainCanvas = mainCanvas;
    this.ctx = ctx;
    var x = (mainCanvas.width / 2) - (8 * 7);
    var y = (mainCanvas.height / 2) + 15;
    var paused = false;

    function clear() {
        ctx.clearRect(x - 1, y - 15, 105, 15);
    }

    this.update = function() {
        if (this.state === STATES.PAUSE) {
            clear();
            paused = true;
        } else if (this.state === STATES.PLAYING && paused) {
            clear();
            paused = false;
        }
    }

    this.draw = function() {
        if (this.state === STATES.PAUSE) {
            ctx.beginPath();
            ctx.font = "15px press_start";
            ctx.fillStyle = "white";
            ctx.fillText("PAUSED!", x, y);
        }
    }
}
PauseScene.prototype = new Scene();

function GameOverScene(ctx, mainCanvas) {
    var mainCanvas = mainCanvas;
    var ctx = ctx;

    this.continue = false;

    function clear() {
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    }

    this.update = function() {
        // no frame de continue, zeramos a tela e retornamos o handler
        if (this.state === STATES.CONTINUE) {
            this.continue = false;
            clear();
            return;
        } else if (this.state !== STATES.OVER) { // nao me interesso por outro status
            return;
        }
        // continua?
        if (KEY_STATUS.esc) {
            this.continue = true;
        }

        clear();
    }

    this.draw = function() {
        if (this.state !== STATES.OVER) {
            return;
        }
        ctx.beginPath();
        ctx.font = "20px press_start";
        ctx.fillStyle = "white";
        ctx.fillText("GAME OVER!", (mainCanvas.width / 2) - (10 * 10), mainCanvas.height / 2);
    }
}
GameOverScene.prototype = new Scene();
