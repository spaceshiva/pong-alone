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
    GAME.scenes.mainScene.update();
    GAME.scenes.pauseScene.update();
    GAME.scenes.gameOverScene.update();

    GAME.scenes.mainScene.draw();
    GAME.scenes.pauseScene.draw();
    GAME.scenes.gameOverScene.draw();

    if(GAME.state === STATES.CONTINUE) {
      update_game_state(STATES.PLAYING);
    }

    if(GAME.scenes.mainScene.scoreBoard.lives === 0) {
      update_game_state(STATES.OVER);
    }

    if(GAME.scenes.gameOverScene.continue) {
      update_game_state(STATES.CONTINUE);
      reset();
    }

    requestAnimFrame(the_loop);
}

function reset() {
    GAME.scenes.mainScene.scoreBoard.lives = INIT_VAL.LIVES;
    GAME.scenes.mainScene.scoreBoard.score = INIT_VAL.SCORE;
    GAME.scenes.mainScene.scoreBoard.level = INIT_VAL.LEVEL;
    GAME.scenes.mainScene.ball.speed = INIT_VAL.BALL_SPEED;
}

// uma forma de "avisar" as cenas de que o estado mudou
// a forma "correta" seria a implementação dos listeners de eventos dentro das cenas.
function update_game_state(state) {
    GAME.state = state;
    GAME.scenes.mainScene.state = state;
    GAME.scenes.pauseScene.state = state;
    GAME.scenes.gameOverScene.state = state;
}

/**
* O tratamento do pause deve ser feito de maneira diferenciada do KEY_STATUS
*/
function add_pause_handler() {
    window.addEventListener('keyup', function(e) {
        var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
        if (keyCode === 80) {
            if (GAME.state === STATES.PAUSE) {
                update_game_state(STATES.PLAYING);
                console.log("unpause");
            } else if (GAME.state === STATES.PLAYING) {
                update_game_state(STATES.PAUSE);
                console.log("pause");
            }
        }
    }, false);
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

    GAME.scenes = {
        mainScene: mainScene,
        pauseScene: new PauseScene(mainContext, mainCanvas),
        gameOverScene: new GameOverScene(mainContext, mainCanvas)
    }

    reset();
    update_game_state(STATES.PLAYING);
    add_pause_handler();

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
