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
    UP_LEFT : 0, // y (-) x (-)
    UP_RIGHT : 1, // y (-) x (+)
    DOWN_LEFT : 2, // y (+) x (-)
    DOWN_RIGHT : 3 // y (+) x (+)
    /*UP: 0, // y (-)
    DOWN : 1, // y (+)
    LEFT : 2, // x (-)
    RIGHT : 3, // x (+)*/
}

const BALL_STATE = {
    INIT : 0,
    MOVING : 1,
    DEAD : 2,
}

const INIT_VAL = {
    BALL_SPEED : 3,
    PADDLE_SPEED : 7
}

const BOUND = {
    MAX_X : 480,
    MAX_Y : 320
}

// Estado atual do game
var GAME_STATE = STATES.INIT;
// Singleton do repositório
const IMAGE_REPO = new ImageRepository();
// elementos do game
var el = {};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Objetos
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/**
 * Classe do repositório de imagens.
 **/
function ImageRepository() {
    var self = this;
    // atributos
    this.ball = new Image();
    this.paddle = new Image();
    // inicializando
    this.init = function(callback) {
        console.log("Inicializando repositorio de imagens");

        /* array apontando para as imagens para aplicarmos
          a função onload em cada um deles. */
        var imgs = [
            self.ball,
            self.paddle
        ];
        var i = 0;
        var numLoaded = 0;

        //deve ser chamada quando uma imagem for carregada.
        function imageLoaded() {
            ++numLoaded;
            console.log("Images loaded: %d", numLoaded);
            if (numLoaded === imgs.length) {
                console.log("Repositorio de imagens inicializado. Game state: ASSETS_LOADED");
                callback();
            }
        }
        for (i = 0; i < imgs.length; i++) {
            imgs[i].onload = function() {
                imageLoaded();
            }
        }
        self.ball.src = "assets/ball.gif";
        self.paddle.src = "assets/paddle.png";
    }
}

function Drawable(x, y, ctx) {
    this.pos = new Vectors.Vector(x, y);
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.width = 0;
    this.height = 0;
    this.context = ctx;

    // funções abstratas que serão implementadas pelos elementos
    this.draw = function() {};
    this.move = function() {};
}

function Ball(x, y, ctx) {
  Drawable.call(this, x, y, ctx);
  this.speed = INIT_VAL.BALL_SPEED;
  this.state = BALL_STATE.INIT;
  this.draw = function(){
    this.context.drawImage(IMAGE_REPO.ball, this.pos.x, this.pos.y);
  }
  this.move = function(){
    this.context.clearRect(this.pos.x-1, this.pos.y-1, this.width+2, this.height+2);
    if(this.state === BALL_STATE.INIT || this.state === BALL_STATE.DEAD) {
      this.pos.y = getRandom(0, BOUND.MAX_Y);
      this.pos.x = getRandom(BOUND.MAX_X / 2, BOUND.MAX_X);
      this.direction = getRandom(BALL_DIRECTION.UP_LEFT, BALL_DIRECTION.DOWN_RIGHT);
      this.state = BALL_STATE.MOVING;
    }
    if(this.state === BALL_STATE.MOVING) {
      // check boundaries
      if(this.pos.x >= BOUND.MAX_X) {
        if(this.direction === BALL_DIRECTION.UP_RIGHT) {
          this.direction = BALL_DIRECTION.UP_LEFT;
        } else if (this.direction === BALL_DIRECTION.DOWN_RIGHT) {
          this.direction = BALL_DIRECTION.DOWN_LEFT;
        }
      }
      if(this.pos.y <= 0) {
        if(this.direction === BALL_DIRECTION.UP_LEFT) {
          this.direction = BALL_DIRECTION.DOWN_LEFT;
        } else if (this.direction === BALL_DIRECTION.UP_RIGHT) {
          this.direction = BALL_DIRECTION.DOWN_RIGHT;
        }
      }
      if(this.pos.y >= BOUND.MAX_Y) {
        if(this.direction === BALL_DIRECTION.DOWN_LEFT) {
          this.direction = BALL_DIRECTION.UP_LEFT;
        } else if(this.direction === BALL_DIRECTION.DOWN_RIGHT) {
          this.direction = BALL_DIRECTION.UP_RIGHT;
        }
      }
      if(this.pos.x <= 0) {
        this.state = BALL_STATE.DEAD;
      }
      // moving
      var v = Vectors.diagonal(45, this.speed);
      switch (this.direction) {
        case BALL_DIRECTION.UP_LEFT:
          this.pos.y -= v.y;
          this.pos.x -= v.x;
          break;
        case BALL_DIRECTION.UP_RIGHT:
          this.pos.y -= v.y;
          this.pos.x += v.x;
          break;
        case BALL_DIRECTION.DOWN_LEFT:
          this.pos.y += v.y;
          this.pos.x -= v.x;
          break;
        case BALL_DIRECTION.DOWN_RIGHT:
          this.pos.y += v.y;
          this.pos.x += v.x;
          break;
      }
    }
  }
}
Ball.prototype = new Drawable();

function Paddle(x, y, ctx) {
  Drawable.call(this, x, y, ctx);
  this.speed = INIT_VAL.PADDLE_SPEED;

  this.draw = function(){
    this.context.drawImage(IMAGE_REPO.paddle, this.pos.x, this.pos.y);
  }

  this.move = function(){
    // reagimos apenas para cima e para baixo
    if (KEY_STATUS.up || KEY_STATUS.down) {
      this.context.clearRect(this.pos.x, this.pos.y, this.width, this.height);
      if(KEY_STATUS.up) {
        this.pos.y -= this.speed;
        if(this.pos.y <= 0) {
          this.pos.y = 0;
        }
      } else {
        this.pos.y += this.speed;
        if((this.pos.y + this.height) >= this.canvasHeight) {
          this.pos.y = this.canvasHeight - this.height;
        }
      }
    }
  }
}
Paddle.prototype = new Drawable();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Controle do Game
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function update() {
  el.paddle.move();
  el.ball.move();
}

function draw() {
  el.paddle.draw();
  el.ball.draw();
}

function the_loop() {
    GAME_STATE = STATES.PLAYING;
    update();
    draw();
    requestAnimFrame(the_loop);
}

function init() {
    var paddleCanvas = document.getElementById("paddle");
    var mainCanvas = document.getElementById("main");
    var bgCanvas = document.getElementById("background");
    if(!bgCanvas.getContext) {
      console.warn("O navegador não suporta canvas, desculpe");
      return false;
    }

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
      mainCanvas.getContext('2d'));
    ball.width = IMAGE_REPO.ball.width;
    ball.height = IMAGE_REPO.ball.height;
    ball.canvasWidth = mainCanvas.width;
    ball.canvasHeight = mainCanvas.height;

    el = {paddle : paddle, ball : ball};
    return true;
}

function loadGame() {
    //http://stackoverflow.com/questions/221539/what-does-the-plus-sign-do-in-new-date
    // converte para um numero, em millis.
    var now = +new Date;
    GAME_STATE = STATES.INIT;
    console.log("Inicializando o game");
    IMAGE_REPO.init(function() {
        console.log("Game inicializado: %d ms", +new Date - now);
        GAME_STATE = STATES.ASSETS_LOADED;
        if (init()) {
            the_loop();
        }
    });
}
window.onload = loadGame;
