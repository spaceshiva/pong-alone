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
GameOverScene.prototype = new BaseScene();
