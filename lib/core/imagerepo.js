/**
 * Classe do repositório de imagens.
 **/
function ImageRepository() {
    var self = this;
    // atributos
    this.ball = new Image();
    this.paddle = new Image();
    this.bg = new Image();
    // inicializando
    this.init = function(callback) {
        console.log("Inicializando repositorio de imagens");

        /* array apontando para as imagens para aplicarmos
          a função onload em cada um deles. */
        var imgs = [
            self.ball,
            self.paddle,
            self.bg
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
        self.bg.src = "assets/background.png"
    }
}
