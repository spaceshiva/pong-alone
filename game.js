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

const BALL_DIRECTION = {
    UP_LEFT: 0, // y (-) x (-)
    UP_RIGHT: 1, // y (-) x (+)
    DOWN_LEFT: 2, // y (+) x (-)
    DOWN_RIGHT: 3 // y (+) x (+)
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

function Game(imageRepo) {
    var assets = imageRepo;
    var self = this;
    var dtLastFrame;

    self.scenes = {
        titleScene: null,
        mainScene: null,
        pauseScene: null,
        gameOverScene: null
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
        });

        self.scenes = {
            mainScene: mainScene,
            pauseScene: new PauseScene(mainContext, mainCanvas),
            gameOverScene: new GameOverScene(mainContext, mainCanvas)
        }

        reset();
        updateGameState(STATES.PLAYING);
        addPauseHandler();

        return true;
    }

    self.theLoop = function() {
        var msLastFrame = +new Date - dtLastFrame;

        update(msLastFrame);
        draw();

        if (self.state === STATES.CONTINUE) {
            updateGameState(STATES.PLAYING);
        }

        if (self.scenes.mainScene.scoreBoard.lives === 0) {
            updateGameState(STATES.OVER);
        }

        if (self.scenes.gameOverScene.continue) {
            updateGameState(STATES.CONTINUE);
            reset();
        }

        dtLastFrame = +new Date;
        requestAnimFrame(self.theLoop);
    }

    function update(msLastFrame) {
        for (var scene in self.scenes) {
            self.scenes[scene].update(msLastFrame);
        }
    }

    function draw() {
        for (var scene in self.scenes) {
            self.scenes[scene].draw();
        }
    }

    function reset() {
        self.scenes.mainScene.scoreBoard.lives = INIT_VAL.LIVES;
        self.scenes.mainScene.scoreBoard.score = INIT_VAL.SCORE;
        self.scenes.mainScene.scoreBoard.level = INIT_VAL.LEVEL;
        self.scenes.mainScene.ball.speed = INIT_VAL.BALL_SPEED;
    }

    // uma forma de "avisar" as cenas de que o estado mudou
    // a forma "correta" seria a implementação dos listeners de eventos dentro das cenas.
    function updateGameState(state) {
        self.state = state;
        self.scenes.mainScene.state = state;
        self.scenes.pauseScene.state = state;
        self.scenes.gameOverScene.state = state;
    }

    /**
     * O tratamento do pause deve ser feito de maneira diferenciada do KEY_STATUS
     */
    function addPauseHandler() {
        window.addEventListener('keyup', function(e) {
            var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
            if (keyCode === 80) {
                if (self.state === STATES.PAUSE) {
                    updateGameState(STATES.PLAYING);
                    console.log("unpause");
                } else if (self.state === STATES.PLAYING) {
                    updateGameState(STATES.PAUSE);
                    console.log("pause");
                }
            }
        }, false);
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
            game.state = STATES.PLAYING;
            game.theLoop();
        } else {
            game = null;
        }
    });
}
window.onload = loadGame;
