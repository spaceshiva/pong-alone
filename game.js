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

function Vector(x, y) {
    this.x = x;
    this.y = y;

    this.magnitude = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    this.normalize = function() {
        var mag = this.magnitude();
        this.x = this.x / mag;
        this.y = this.y / mag;
    }
}

function Drawable(x, y, ctx) {
    this.pos = new Vector(x, y);
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
  this.draw = function(){}
  this.move = function(){}
}
Ball.prototype = new Drawable();

function Paddle(x, y, ctx) {
  this.draw = function(){}
  this.move = function(){}
}
Paddle.prototype = new Drawable();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Controle do Game
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function the_loop() {
    GAME_STATE = STATES.PLAYING;
    console.log("elements", el);
    el.ball.move();
    el.paddle.move();
    el.ball.draw();
    el.paddle.draw();
}

function init() {
    var paddleCanvas = document.getElementById("paddle");
    var mainCanvas = document.getElementById("main");
    var bgCanvas = document.getElementById("background");
    if(!bgCanvas.getContext) {
      console.warn("O navegador não suporta canvas, desculpe");
      return false;
    }

    var paddle = new Paddle(0, 0, paddleCanvas.getContext('2d'));
    var ball = new Ball(0, 0, mainCanvas.getContext('2d'));

    el = {paddle : paddle, ball : ball};
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
