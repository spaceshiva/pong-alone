function Scene() {
    this.state = null;
    this.draw = function() {}
    this.update = function() {}
}

function TitleScene(ctx, mainCanvas) {
    const TITLE_X = (mainCanvas.width / 2) - (LETTER_W._20 * 10);
    const TITLE_Y = (mainCanvas.height / 3);

    const TITLE_LINES = {
        font: '20px press_start',
        color: 'white',
        lines: ["PONG ALONE"],
        x: TITLE_X,
        y: TITLE_Y,
        lineSpace: 20
    }

    const HOW_TO_LINES = {
        font: '10px press_start',
        color: 'white',
        lines: [
          "---- HOW TO PLAY ----",
          "arrows or \"W/S\" to go up or down",
          "space bar or \"P\" to pause",
          "Press \"Enter\" to start ponging!"
        ],
        x: 10,
        y: TITLE_Y + 80,
        lineSpace: 16
    }

    const LICENSE_LINES = {
      font: '8px press_start',
      color: 'white',
      lines: [
        "\"PONG ALONE\" is a Linked Education game",
        "made for educational porposes only.",
        "Please do not copy, distribute or modify it",
        "without permission."
      ],
      x: 10,
      y: TITLE_Y + 180,
      lineSpace: 10
    }

    function drawLines(ls) {
        ctx.font = ls.font;
        ctx.fillStyle = ls.color;
        ls.lines.forEach(function(line, idx) {
            ctx.fillText(line, ls.x, (ls.y + (ls.lineSpace * idx)));
        });
    }

    this.draw = function() {
        if (this.state === STATES.INIT) {
            ctx.beginPath();
            drawLines(TITLE_LINES);
            drawLines(HOW_TO_LINES);
            drawLines(LICENSE_LINES);
        }
    }

    this.update = function() {
        if (this.state === STATES.INIT) {
            ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            if(KEY_STATUS.enter) {
              this.state = STATES.PLAYING;
            }
        }
    }
}
TitleScene.prototype = new Scene();

function MainScene(elements) {
    this.ball = elements.ball;
    this.paddle = elements.paddle;
    this.scoreBoard = elements.scoreBoard;
    this.bg = elements.bg;

    this.update = function(msLastFrame) {
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
