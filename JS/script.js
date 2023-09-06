var bonusApagar = document.querySelector("#bonus");

const personagem = document.getElementById('personagem');
const step = 10; // Define o tamanho do passo de movimento

// Obtém as dimensões do personagem
const personagemWidth = personagem.clientWidth;
const personagemHeight = personagem.clientHeight;

// Calculo posição vertical e horizontal do personagem
let posicaoHorizontal = (window.innerWidth - personagemWidth) / 2;
let posicaoVertical = window.innerHeight - personagemHeight;

// Remove o movimento (EventListener movePersonagem) temporariamente
// document.removeEventListener('keydown', movePersonagem);

// Atualiza a posição do personagem no DOM
function updatePersonagemPosition() {
  personagem.style.left = posicaoHorizontal + 'px';
  personagem.style.top = posicaoVertical + 'px';
}

// movimentação personagem ////////////
function movePersonagem(event) {
  switch (event.key) {

    case 'ArrowUp':
      posicaoVertical -= step;

      if (posicaoVertical < 0) {
        posicaoVertical = 0;
      }
      posicaoParaCima();    
      break;

    case 'ArrowDown':
      const maxHeight = window.innerHeight - personagemHeight;
      posicaoVertical += step;
      if (posicaoVertical > maxHeight) {
        posicaoVertical = maxHeight;
      }
      posicaoParaBaixo();
      break;

    case 'ArrowLeft':
      posicaoHorizontal -= step;
      if (posicaoHorizontal < 0) {
        posicaoHorizontal = 0;
      }
      posicaoParaEsquerda();
      break;

    case 'ArrowRight':
      const maxWidth = window.innerWidth - personagemWidth;
      posicaoHorizontal += step;
      if (posicaoHorizontal > maxWidth) {
        posicaoHorizontal = maxWidth;
      }
      posicaoParaDireita();
      break;
      
    case ' ':
      atirar();
      break;
  }

  updatePersonagemPosition();
  checkCollision();
  checkCollisionBonus()
}

updatePersonagemPosition();  // Define a posição inicial do personagem (n entendi muito)

// INIMIGO ////////////
const inimigo = document.getElementById('inimigo');
let inimigoPositionY = 0; // Inimigo começa no topo

function moverInimigo() {
  inimigo.style.top = inimigoPositionY + 'px';
  inimigoPositionY += 1; // Movimento para baixo

  // Reposicionar o inimigo quando ele sair da tela
  if (inimigoPositionY > window.innerHeight) {
    inimigoPositionY = 0;
    inimigo.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Posição horizontal aleatória
  }

  checkCollision(); // Chama a função para verificar a colisão
}

// colisão do personagem com o inimigo ////////////
function checkCollision() {
  const personagemRect = personagem.getBoundingClientRect();
  const inimigoRect = inimigo.getBoundingClientRect();
  
  if (
    personagemRect.left -10 <= inimigoRect.right-10 &&
    personagemRect.right -10 >= inimigoRect.left-10 &&
    personagemRect.top -10 <= inimigoRect.bottom-10 &&
    personagemRect.bottom -10 >= inimigoRect.top-10
  ) {
    alert('Você perdeu uma vida');
    vidaP--;
    contagemVida()
    reposicionarInimigo()
    document.getElementById('vidaCount').innerHTML=vidaP;
  }
}

function reposicionarInimigo() {
  inimigoPositionY = 0;
  inimigo.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Posição horizontal aleatória
  if(vidaI== 0){
    inimigo.style.display = 'none'; // Oculta o bloco inimigo
    //contagemVida()
  }
}

// FUNÇÕES VIDA ////////////
let vidaP= 3;
let vidaI= 3;

function contagemVida(){
  if(vidaP == 0){
    alert('Vidas zeradas, você perdeu');
    inimigo.style.display = 'none';
    window.location.href='perdeu.html'

  } if( vidaP >= 4){
    somarVida = null;
  }
}

function contagemVidaB(){
  if(vidaI == 0){
    alert('Você venceu');
    window.location.href='ganhou.html'
  } 
}

function somarVida(){
  vidaP++;
}

// vida na tela = personagem ///
const vidaPElement = document.getElementById('vidaCount');

function updatevidaP() {
  vidaPElement.textContent = vidaP;
}

function addVida() {
  vidaP++;
  updatevidaP();
}

// vida na tela = inimigo ///
const vidaIElement = document.getElementById('vidaCountInimigo');

function updatevidaI() {
  vidaIElement.textContent = vidaI;
}

// TIRO //////////////////
const tiroSpeed = 5; // Velocidade do tiro

function atirar() {
  const tiro = document.createElement('div');
  tiro.className = 'tiro'; // criar estilo com a classe 'tiro' 
  tiro.style.left = posicaoHorizontal + personagemWidth / 2 - 5 + 'px'; // Ajusta a posição inicial do tiro
  tiro.style.top = posicaoVertical + 'px';
  document.body.appendChild(tiro);
  backgroundTiro.play();

  moverTiro(tiro); // Inicia o movimento do tiro imediatamente
}

// movimentação do tiro
function moverTiro(tiro) {
  const tiroPositionY = parseFloat(tiro.style.top);
  tiro.style.top = tiroPositionY - tiroSpeed + 'px';

  // Remove o tiro se ele sair da tela
  if (tiroPositionY < 0) {
    tiro.remove();
  } else {
    requestAnimationFrame(() => moverTiro(tiro)); // "desparo" do tiro
    checkTiroCollision(tiro);
  }
}

// colisão do tiro com o obstáculo
function checkTiroCollision(tiro) {
  const tiroRect = tiro.getBoundingClientRect();
  const inimigoRect = inimigo.getBoundingClientRect();

  if (
    tiroRect.left < inimigoRect.right &&
    tiroRect.right > inimigoRect.left &&
    tiroRect.top < inimigoRect.bottom &&
    tiroRect.bottom > inimigoRect.top
  ) {
    alert('Inimigo atingido!');
    // inimigo.style.display = 'none';  Oculta o bloco inimigo
    tiro.remove();
    vidaI--;
    contagemVidaB();
    reposicionarInimigo();
    updatevidaI()
  }
}

// INICIALIZAÇÃO /////////////////////////////////////////////////////
let jogoIniciado = false;

function iniciarJogo() {
  // mensagemElement.style.display = 'none';  Remova a mensagem da tela
  jogoIniciado = true;

  // Adicione o evento de movimento do personagem somente após o início do jogo
  document.addEventListener('keydown', movePersonagem);

  setInterval(moverInimigo, 0);// Inicie o movimento do inimigo 
}

updatePersonagemPosition(); // Chame a função para atualizar a posição inicial do personagem

// ESTILO - PERSONAGEM e INIMIGO /////////////////////////////////////
function posicaoA(){
  const estilopersonagem = document.getElementById('personagem');
  const imagem = document.createElement('img');
  imagem.src = 'IMG/Urucum/sprite_parado_baixo.png';
  imagem.classList.add('posicaoA')
  estilopersonagem.appendChild(imagem);
}

const estilopersonagem = document.getElementById('personagem');
const imagem = document.createElement('img');

function posicaoParaCima(){
  imagem.src = 'IMG/Urucum/sprite_andando_cima.gif';
  imagem.classList.add('posicaoA')
  estilopersonagem.appendChild(imagem);
}

function posicaoParaBaixo(){
  imagem.src = 'IMG/Urucum/sprite_andando_baixo.gif';
  imagem.classList.add('posicaoA')
  estilopersonagem.appendChild(imagem);
}

function posicaoParaDireita(){
  imagem.src = 'IMG/Urucum/sprite_andando_direita.gif';
  imagem.classList.add('posicaoA')
  estilopersonagem.appendChild(imagem);
}

function posicaoParaEsquerda(){
  imagem.src = 'IMG/Urucum/sprite_andando_esquerda.gif';
  imagem.classList.add('posicaoA')
  estilopersonagem.appendChild(imagem);
}

imagem.src = 'IMG/Urucum/sprite_parado_baixo.png';
imagem.classList.add('posicaoA')
estilopersonagem.appendChild(imagem);

/// SOM DE FUNDO /////
const backgroundAudio = new Audio('musicaDeFundo.mp3');
backgroundAudio.play();

const backgroundTiro = new Audio('MUSICAS/tiro.mp3');
const backgroundVenceu = new Audio('musicaDeFundo.mp3');
const backgroundPerdeu = new Audio('musicaDeFundo.mp3');
const backgroundDano = new Audio('musicaDeFundo.mp3');


//// nova mensagem /////
var isOnDialog = false;
var cutsceneStep = 0;

const mensagemContainer = document.getElementById("msgContainer");
const mensagemText = document.createElement("mensagemText")
const ladoDireitoText = document.getElementById("ladoDireitoContainerMSG");

sequenciaDialogos()

function mostrarCaixaTexto(personagemSelecDialogo, mensagem){
    // * Alterar texto do novo elemento
        mensagemText.textContent = mensagem;
        mensagemText.className = "textMensagem";

    // * Alterar Fundo do container
        mensagemContainer.className = "mensagemContainer";

        if(personagemSelecDialogo == "urucum"){
            mensagemContainer.classList.add("backgroundMensagemUrucum");
        }else if(personagemSelecDialogo == "caronte"){
            mensagemContainer.classList.add("backgroundMensagemCaronte");
        }

        ladoDireitoText.appendChild(mensagemText);
}

function esconderCaixaTexto(){
    mensagemContainer.className = "hiddenMessage";
    ladoDireitoText.removeChild(mensagemText);
}

function sequenciaDialogos(){
  isOnDialog = true;
  mostrarCaixaTexto("caronte", "Essa é a oportunidade de vencer o seu medo. Enfrente-o e não o ignore. Ele pode ser vencido com ataques precisos ou consentindo com ele.");

  document.addEventListener('keypress', (event) => {
    if(isOnDialog){
      switch(cutsceneStep){
        case 0:
          mostrarCaixaTexto("urucum", " Medo? Consentir com ele, como assim? ");
          cutsceneStep++;
          break;

        case 1:
          mostrarCaixaTexto("caronte", "Resistir à realidade de que pessoas que costumavam sustentar sua jornada desapareceram aos poucos deixando um vazio, é doloroso e assustador. Mas você precisa aceitar, é isso que esta te prendendo aqui");
          cutsceneStep++;
          break;

        case 2:
          mostrarCaixaTexto("caronte", "Para derrota-lo você pode disparar contra ele (Enter) ou consentir com ele. Aceitar que há existência dele traz consequência e que elas são inevitáveis.");
          cutsceneStep++;
          break;

        case 3:
          mostrarCaixaTexto("caronte", "DICA: Bater de frentes com os desafios pode nos levar ao sucesso.");
          cutsceneStep++;
          break;

        default:
          isOnDialog = false;
          esconderCaixaTexto();
          cutsceneStep++;
          iniciarJogo()
          break;
      }
    }
  })
}

//////////////////////////

const bonus = document.getElementById('bonus');


function checkCollisionBonus() {
  const personagemRect = personagem.getBoundingClientRect();
  const bonusRect = bonus.getBoundingClientRect();

  if (
    personagemRect.left < bonusRect.right &&
    personagemRect.right > bonusRect.left &&
    personagemRect.top < bonusRect.bottom &&
    personagemRect.bottom > bonusRect.top
  ) {
    alert('Voce ganhou uma vida!');
    vidaP= vidaP + 1;
    bonusApagar.parentNode.removeChild(bonusApagar);
    updatevidaP()

  }
}
///////////////
// Referência ao elemento do modal