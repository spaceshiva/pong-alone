/**
* Funções que "deveriam" estar disponíveis no sistema. :D
*/

// Keycode mapeados quando o jogador pressionar uma tecla.
KEY_CODES = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    27: 'esc',
    87: 'w',
    83: 's',
    13: 'enter'
}

/**
 * Array com o status de cada keycode suportado pelo game. Verificar se o keycode do
 * array foi pressionado ou não via true/false é a maneira mais rápida de determinar o
 * status da tecla.
 */
KEY_STATUS = {};

for (code in KEY_CODES) {
    KEY_STATUS[KEY_CODES[code]] = false;
}


/**
 * Adiciona ao document o evento de keydown para mudar o status das teclas pressionadas pelo
 * jogador ao nosso array global. Keydown: tecla pressionada = true.
 */
document.onkeydown = function(e) {
    // Firefox and opera use charCode instead of keyCode to
    // return which key was pressed.
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
}

/**
 * Adiciona ao document o evento de keyup para mudar o status das teclas pressionadas pelo
 * jogador ao nosso array global. Keyup: tecla pressionada = false.
 */
document.onkeyup = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
}

window.getRandom = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Função para recuperar o frame de animação utilizada durante o loop do game.
 * É compatível com qualquer navegador, dado que cada um implementa de uma maneira.
 * Comentários originais preservados.
 *
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
