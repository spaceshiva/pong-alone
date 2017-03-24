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
