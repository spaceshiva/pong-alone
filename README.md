# Pong Alone

Projeto de conclusão do curso HTML5 com Games da Linked Education.

A idéia é a criação de um game baseado no clássico _PONG_ em que uma barra deve estar posicionada à esquerda da tela e movimentar apenas no eixo Y. O jogador deve evitar que a bola passe para o lado esquerdo, executando manobras defensivas para evitar que isso ocorra.

O jogador inicia com três vidas e a cada bola que passar pela sua defesa, uma vida deve ser perdida. Quando acabar as vidas, o jogo termina. Cada rebatida com sucesso o jogador ganha 50 pontos. A cada 1000 pontos o jogador passa de nível, sendo o nível máximo o 9 e o limite de pontos 9.999. Ao atingir essa pontuação, o jogo termina.

A cada nível avançado a velocidade da bola deve aumentar proporcionalmente. A bola ao rebater nas extremidades da tela deve replicar o seu ângulo para a direção contrária. 

A barra controlada pelo jogador deverá direcionar o ângulo da bola: 

* Se a bola vier em linha reta e bater no centro da barra, a bola é devolvida em linha reta para a tela. O centro da barra deve ter o mesmo tamanho da bola  
* A partir do centro da barra para as extremidades, a direção do ângulo deve aumentar exponencialmente, causando alteração na trajetória da bola.