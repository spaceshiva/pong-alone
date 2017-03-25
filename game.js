//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Globais
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/**
 * Possíveis estados do game
 */
const STATES = {
    INIT: 0,
    ASSETS_LOADED: 1,
    PLAYING: 2,
    PAUSE: 3,
    OVER: 4,
    CONTINUE: 5
}

const BALL_STATE = {
    INIT: 0,
    MOVING: 1,
    DEAD: 2,
}

const INIT_VAL = {
    BALL_SPEED: 5,
    PADDLE_SPEED: 7,
    PADDLE_SCORE: 100,
    LIVES: 3,
    SCORE: 0,
    LEVEL: 1
}

const BOUND = {
    MAX_X: 464,
    MAX_Y: 304,
    MIN_Y: 46
}

// comprimento da letra true type -> pixels na tela
const LETTER_W = {
    "_15" : 8,
    "_20" : 10
}

function Game(imageRepo) {
    var assets = imageRepo;
    var self = this;
    var tsLastFrame;

    self.scenes = {
        titleScene: null,
        mainScene: null
    }

    self.state = STATES.INIT;

    self.init = function() {
        var paddleCanvas = document.getElementById("paddle");
        var mainCanvas = document.getElementById("main");
        var bgCanvas = document.getElementById("background");
        var scoreCanvas = document.getElementById("score");

        if (!bgCanvas.getContext) {
            console.warn("O navegador não suporta canvas, desculpe");
            return false;
        }

        var mainContext = mainCanvas.getContext('2d');
        var scoreContext = scoreCanvas.getContext('2d');
        var bgContext = bgCanvas.getContext('2d');

        var paddle = new Paddle(
            assets.paddle.width * 3,
            (mainCanvas.height / 2) - (assets.paddle.height / 2),
            paddleCanvas.getContext('2d'),
            assets.paddle);
        paddle.width = assets.paddle.width;
        paddle.height = assets.paddle.height;
        paddle.canvasWidth = paddleCanvas.width;
        paddle.canvasHeight = paddleCanvas.height;

        var ball = new Ball(
            paddle.pos.x + assets.ball.height,
            (mainCanvas.height / 2) - (assets.ball.height / 2),
            mainContext,
            assets.ball,
            paddle);
        ball.width = assets.ball.width;
        ball.height = assets.ball.height;
        ball.canvasWidth = mainCanvas.width;
        ball.canvasHeight = mainCanvas.height;

        var scoreBoard = new ScoreBoard(0, 0, scoreContext);
        scoreBoard.width = scoreCanvas.width;
        scoreBoard.height = scoreCanvas.height;
        scoreBoard.canvasWidth = scoreCanvas.width;
        scoreBoard.canvasHeight = scoreCanvas.height;

        var background = new Background(bgContext, assets.bg);
        background.width = assets.bg.width;
        background.height = assets.bg.height;
        background.canvasWidth = bgCanvas.width;
        background.canvasHeight = bgCanvas.height;

        var mainScene = new MainScene({
            ball: ball,
            paddle: paddle,
            scoreBoard: scoreBoard,
            bg: background
        }, mainContext, mainCanvas);

        self.scenes = {
            mainScene: mainScene,
            //pauseScene: new PauseScene(mainContext, mainCanvas),
            //gameOverScene: new GameOverScene(mainContext, mainCanvas),
            titleScene: new TitleScene(mainContext, mainCanvas)
        }
        updateGameState(STATES.INIT);
        return true;
    }

    self.theLoop = function() {
        var msLastFrame = +new Date - tsLastFrame;

        update(msLastFrame);
        draw();

        tsLastFrame = +new Date;
        requestAnimFrame(self.theLoop);
    }

    function update(msLastFrame) {
        var lastState = self.state;
        for (var scene in self.scenes) {
            self.scenes[scene].update(msLastFrame);
            if(self.scenes[scene].state !== lastState) {
                updateGameState(self.scenes[scene].state);
            }
        }
    }

    function draw() {
        for (var scene in self.scenes) {
            self.scenes[scene].draw();
        }
    }

    // uma forma de "avisar" as cenas de que o estado mudou
    // a forma "correta" seria a implementação dos listeners de eventos dentro das cenas.
    function updateGameState(state) {
        self.state = state;
        console.log("Update game state to %d", state);
        for (var scene in self.scenes) {
            console.log("Update scene %s state to %d", scene, state);
            self.scenes[scene].updateState(state);
        }
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Inicia aqui
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function loadGame() {
    //http://stackoverflow.com/questions/221539/what-does-the-plus-sign-do-in-new-date
    // converte para um numero, em millis.
    var now = +new Date;
    console.log("Inicializando o game");
    var imageRepo = new ImageRepository();
    imageRepo.init(function() {
        var game = new Game(imageRepo);
        console.log("Game inicializado: %d ms", +new Date - now);
        if (game.init()) {
            game.theLoop();
        } else {
            game = null;
        }
    });
}
window.onload = loadGame;
