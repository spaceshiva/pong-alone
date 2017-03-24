function MainScene(elements, ctx, canvas) {
    var self = this;
    this.ball = elements.ball;
    this.paddle = elements.paddle;
    this.scoreBoard = elements.scoreBoard;
    this.bg = elements.bg;

    var gameOverScene = null;
    var pauseScene = null;

    /**
     * O tratamento do pause deve ser feito de maneira diferenciada do KEY_STATUS
     */
    function addPauseHandler() {
        window.addEventListener('keyup', function(e) {
            var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
            // p || space
            if (keyCode === 80 || keyCode == 32) {
                if (self.state === STATES.PAUSE) {
                    self.updateState(STATES.PLAYING);
                    console.log("unpause");
                } else if (self.state === STATES.PLAYING) {
                    self.updateState(STATES.PAUSE);
                    console.log("pause");
                }
            }
        }, false);
    }

    function reset() {
        self.scoreBoard.lives = INIT_VAL.LIVES;
        self.scoreBoard.score = INIT_VAL.SCORE;
        self.scoreBoard.level = INIT_VAL.LEVEL;
        self.ball.speed = INIT_VAL.BALL_SPEED;
    }

    this.updateState = function(newState) {
        console.log("update mainScene state");
        this.state = newState;
        self.subScenes.forEach(function(scene) {
            scene.updateState(newState);
        });
    }

    function initialize() {
        pauseScene = new PauseScene(ctx, canvas);
        gameOverScene = new GameOverScene(ctx, canvas);
        self.subScenes.push(pauseScene, gameOverScene);
        addPauseHandler();
        reset();
    }

    initialize();

    this.update = function(msLastFrame) {
        if (self.state === STATES.PLAYING) {
            self.ball.update();
            self.paddle.update();
            self.scoreBoard.update();
            self.bg.update();

            if (self.ball.paddleCollision) {
                self.scoreBoard.addPoints(INIT_VAL.PADDLE_SCORE);
            }

            if (self.ball.state === BALL_STATE.DEAD) {
                self.scoreBoard.updateLives(-1);
            }

            if (self.scoreBoard.levelUp) {
                self.scoreBoard.levelUp = false;
                self.ball.speed += 1;
                console.log("Level Up! Level now is %d", self.scoreBoard.level);
                console.log("Ball speed is now at %d", self.ball.speed);
            }

            if (self.scoreBoard.lives === 0) {
                this.updateState(STATES.OVER);
            }
        }

        if (self.state === STATES.CONTINUE) {
            this.updateState(STATES.PLAYING);
        }

        if (gameOverScene.continue) {
            this.updateState(STATES.CONTINUE);
            reset();
        }

        self.subScenes.forEach(function(scene) {
          scene.update(msLastFrame);
        });
    }

    this.draw = function() {
        if (this.state === STATES.PLAYING) {
          this.ball.draw();
          this.paddle.draw();
          this.scoreBoard.draw();
          this.bg.draw();
        }
        self.subScenes.forEach(function(scene) {
          scene.draw();
        });

    }
}
MainScene.prototype = new Scene();
