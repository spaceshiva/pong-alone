function Scene() {
    this.state = null;
    this.draw = function() {}
    this.update = function() {}
}

function MainScene(ball, paddle, scoreBoard) {
    this.ball = ball;
    this.paddle = paddle;
    this.scoreBoard = scoreBoard;

    this.update = function() {
        if (KEY_STATUS.pause) {
            console.log("pause");
            if (this.state === STATES.PLAYING) {
                this.state = STATES.PAUSE;
            } else if (this.state === STATES.PAUSE) {
                this.state = STATES.PLAYING;
            }
        }

        if (this.state === STATES.PLAYING) {
            this.ball.update();
            this.paddle.update();
            this.scoreBoard.update();

            if (this.ball.paddleCollision) {
                this.scoreBoard.addPoints(INIT_VAL.PADDLE_SCORE);
            }

            if (this.ball.state === BALL_STATE.DEAD) {
                this.scoreBoard.updateLives(-1);
            }

            if (this.scoreBoard.levelUp) {
                this.ball.speed += 1;
                console.log("Level Up! Level now is %d", this.scoreBoard.level);
                console.log("Ball speed is now at %d", this.ball.speed);
            }
        }

    }

    this.draw = function() {
        if(this.state === STATES.PLAYING) {
          this.ball.draw();
          this.paddle.draw();
          this.scoreBoard.draw();
        }
    }
}
MainScene.prototype = new Scene();
