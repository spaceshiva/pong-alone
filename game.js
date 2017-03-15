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
    OVER: 4
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
    MAX_X: 480,
    MAX_Y: 320
}

// Singleton do repositório
const IMAGE_REPO = new ImageRepository();

const GAME = {
    scenes: [],
    state: STATES.INIT
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Controle do Game
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function the_loop() {
    if (GAME.state === STATES.PLAYING ||
        GAME.state === STATES.PAUSE) {
        GAME.scenes.mainScene.update();
        GAME.scenes.mainScene.draw();
    }

    requestAnimFrame(the_loop);
}

function init() {
    var paddleCanvas = document.getElementById("paddle");
    var mainCanvas = document.getElementById("main");
    var bgCanvas = document.getElementById("background");
    if (!bgCanvas.getContext) {
        console.warn("O navegador não suporta canvas, desculpe");
        return false;
    }

    var mainContext = mainCanvas.getContext('2d');

    var paddle = new Paddle(
        IMAGE_REPO.paddle.width * 3,
        (mainCanvas.height / 2) - (IMAGE_REPO.paddle.height / 2),
        paddleCanvas.getContext('2d'));
    paddle.width = IMAGE_REPO.paddle.width;
    paddle.height = IMAGE_REPO.paddle.height;
    paddle.canvasWidth = paddleCanvas.width;
    paddle.canvasHeight = paddleCanvas.height;

    var ball = new Ball(
        paddle.pos.x + IMAGE_REPO.ball.height,
        (mainCanvas.height / 2) - (IMAGE_REPO.ball.height / 2),
        mainContext,
        paddle);
    ball.width = IMAGE_REPO.ball.width;
    ball.height = IMAGE_REPO.ball.height;
    ball.canvasWidth = mainCanvas.width;
    ball.canvasHeight = mainCanvas.height;

    var scoreBoard = new ScoreBoard(0, 0, mainContext);
    scoreBoard.width = mainCanvas.width;
    scoreBoard.height = 100;
    scoreBoard.canvasWidth = mainCanvas.width;
    scoreBoard.canvasHeight = mainCanvas.height;

    var mainScene = new MainScene(ball, paddle, scoreBoard);
    mainScene.state = STATES.PLAYING;

    GAME.scenes = {
        mainScene: mainScene
    }

    return true;
}

function loadGame() {
    //http://stackoverflow.com/questions/221539/what-does-the-plus-sign-do-in-new-date
    // converte para um numero, em millis.
    var now = +new Date;
    GAME.state = STATES.INIT;
    console.log("Inicializando o game");

    IMAGE_REPO.init(function() {
        console.log("Game inicializado: %d ms", +new Date - now);
        GAME.state = STATES.ASSETS_LOADED;
        if (init()) {
            GAME.state = STATES.PLAYING;
            the_loop();
        }
    });
}
window.onload = loadGame;
