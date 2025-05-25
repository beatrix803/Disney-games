const teclaSom = new Audio('audio/tecla.mp3');
const somAcerto = new Audio('audio/acerto.mp3');  // Som de acerto
const somErro = new Audio('audio/erro.mp3');  // Som de erro

const palavras = [
  { texto: 'rapunzel', dica: 'Princesa com cabelos mágicos e longos' },
  { texto: 'pascal', dica: 'O camaleão de Rapunzel' },
  { texto: 'lanternas', dica: 'Lanternas flutuando no céu para Rapunzel' },
  { texto: 'torre', dica: 'Onde Rapunzel foi mantida em cativeiro' },
  { texto: 'pincel', dica: 'Rapunzel adora pintar com ele' },
  { texto: 'flynn', dica: 'O aventureiro que Rapunzel conhece' }
];

let palavraAtual = {};
let letrasCorretas = [];
let tentativasRestantes = 6;  // Garantindo que o número de tentativas comece como 6
let erros = 0;
let dicasUsadas = 0;
let palavrasUsadas = [];
let jogoFinalizado = false;

const palavraEl = document.getElementById('palavra');
const letrasEl = document.getElementById('letras');
const dicaEl = document.getElementById('dica');
const errosEl = document.getElementById('erros');
const tentativasEl = document.getElementById('tentativas');
const imgStatus = document.getElementById('imgStatus');
const feedback = document.getElementById('feedback');
const btnContinuar = document.getElementById('continuar');
const btnRecomecar = document.getElementById('recomecar');
const btnDica = document.getElementById('btnDica');
const bannerVitoria = document.getElementById('vitoria-banner');

function iniciarJogo() {
  if (palavrasUsadas.length === palavras.length) {
    mostrarMensagemFinal();
    return;
  }

  let disponiveis = palavras.filter(p => !palavrasUsadas.includes(p.texto));
  palavraAtual = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  palavrasUsadas.push(palavraAtual.texto);

  letrasCorretas = [];
  tentativasRestantes = 6;  // Garantindo que sempre que iniciar o jogo, as tentativas sejam 6
  erros = 0;
  dicasUsadas = 0;
  jogoFinalizado = false;

  atualizarJogo();
  criarBotoes();
  feedback.textContent = '';
  bannerVitoria.style.display = 'none';
  btnContinuar.style.display = 'none';
  btnRecomecar.style.display = 'none';  // Não exibe o botão de recomeçar no começo
  btnDica.disabled = false;
  imgStatus.src = 'img/Rfeliz.png';
}

function atualizarJogo() {
  dicaEl.textContent = palavraAtual.dica;
  errosEl.textContent = erros;
  tentativasEl.textContent = tentativasRestantes;

  palavraEl.textContent = palavraAtual.texto.split('').map(letra =>
    letrasCorretas.includes(letra) ? letra.toUpperCase() : '_'
  ).join(' ');
}

function criarBotoes() {
  letrasEl.innerHTML = '';
  for (let i = 65; i <= 90; i++) {
    const letra = String.fromCharCode(i);
    const btn = document.createElement('button');
    btn.textContent = letra;
    btn.addEventListener('click', () => {
      if (!jogoFinalizado) {
        teclaSom.play();
        verificarLetra(letra);
      }
    });
    letrasEl.appendChild(btn);
  }
}

function verificarLetra(letra) {
  const letraMin = letra.toLowerCase();
  const botoes = letrasEl.querySelectorAll('button');
  botoes.forEach(btn => {
    if (btn.textContent === letra) btn.disabled = true;
  });

  if (palavraAtual.texto.includes(letraMin)) {
    if (!letrasCorretas.includes(letraMin)) {
      letrasCorretas.push(letraMin);
    }
    feedback.textContent = `Acertou a letra ${letra}! 🌼`;
    feedback.className = 'feedback acerto';
    imgStatus.src = 'img/Rfeliz.png';
  } else {
    tentativasRestantes--;  // Decrementa o número de tentativas
    erros++;
    feedback.textContent = `Ops! A letra ${letra} não está na palavra. 😕`;
    feedback.className = 'feedback erro';
    imgStatus.src = 'img/Rtriste.png';
  }

  atualizarJogo();
  checarFimDeJogo();
}

function checarFimDeJogo() {
  const palavraCompleta = palavraAtual.texto.split('').every(letra => letrasCorretas.includes(letra));
  
  if (palavraCompleta) {
    if (palavrasUsadas.length === palavras.length) {
      setTimeout(mostrarMensagemFinal, 1200);
    } else {
      bannerVitoria.style.display = 'block';
      btnContinuar.style.display = 'block';  // Exibe o botão de continuar
      btnRecomecar.style.display = 'none';  // Não exibe o botão de recomeçar
      btnDica.disabled = true;
      somAcerto.play();  // Toca o som de acerto ao final da fase
      const botoes = letrasEl.querySelectorAll('button');
      botoes.forEach(btn => {
        btn.disabled = true;
      });
      jogoFinalizado = true;
    }
  } else if (erros === 6) {  // Aqui a pessoa perde quando fizer 6 erros
    feedback.textContent = 'Você perdeu! Cometeu 6 erros. Tente novamente! 💔';
    feedback.className = 'feedback erro';
    btnRecomecar.style.display = 'block';  // Exibe o botão de recomeçar
    jogoFinalizado = true;
    const botoes = letrasEl.querySelectorAll('button');
    botoes.forEach(btn => {
      btn.disabled = true;
    });
    somErro.play();  // Toca o som de erro ao final da fase
  }
}


function usarDica() {
  if (dicasUsadas < 2) {
    const letrasNaoReveladas = palavraAtual.texto.split('').filter(letra => !letrasCorretas.includes(letra));
    const letraAleatoria = letrasNaoReveladas[Math.floor(Math.random() * letrasNaoReveladas.length)];
    letrasCorretas.push(letraAleatoria);
    dicasUsadas++;
    atualizarJogo();
  } else {
    feedback.textContent = 'Você já usou todas as dicas disponíveis! 😅';
    feedback.className = 'feedback erro';
  }
}

function mostrarMensagemFinal() {
  document.body.innerHTML = `
    <div class="final-msg">
      🎉 Parabéns! Você completou todos os desafios da torre da Rapunzel! 🌸<br><br>
      Obrigado por jogar!
    </div>
  `;
}

btnDica.addEventListener('click', usarDica);
btnRecomecar.addEventListener('click', () => {
  if (jogoFinalizado) {
    // Mantém a mesma palavra ao clicar em "Recomeçar"
    letrasCorretas = [];
    tentativasRestantes = 6;  // Restabelece o número de tentativas para 6
    erros = 0;
    dicasUsadas = 0;
    jogoFinalizado = false;
    feedback.textContent = '';
    bannerVitoria.style.display = 'none';
    btnContinuar.style.display = 'none';
    btnRecomecar.style.display = 'none';
    btnDica.disabled = false;
    imgStatus.src = 'img/Rfeliz.png';
    atualizarJogo();
    criarBotoes();
  }
});
btnContinuar.addEventListener('click', iniciarJogo);

iniciarJogo();

document.addEventListener('keydown', function(event) {
  const tecla = event.key.toUpperCase();
  if (tecla.match(/[A-Z]/)) {
    if (!jogoFinalizado) {
      teclaSom.play();
      verificarLetra(tecla);
    }
  }
});
