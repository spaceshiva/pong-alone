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
            this.scoreBoard.levelUp = false;
            this.ball.speed += 1;
            console.log("Level Up! Level now is %d", this.scoreBoard.level);
            console.log("Ball speed is now at %d", this.ball.speed);
        }
    }

    this.draw = function() {
          this.ball.draw();
          this.paddle.draw();
          this.scoreBoard.draw();
    }
}
MainScene.prototype = new Scene();
