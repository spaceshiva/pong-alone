function PauseScene(ctx, mainCanvas) {
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
PauseScene.prototype = new BaseScene();
