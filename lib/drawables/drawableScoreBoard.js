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
