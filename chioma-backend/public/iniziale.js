const CHIAVE = 'chioma-ai-iniziale';

// Ogni domanda ha un "tipo": determina cosa disegna renderCampo().
const DOMANDE = [
  {
    id: 'nome',
    tipo: 'testo',
    titolo: 'Allora partiamo! Come ti chiami?',
    placeholder: 'Il tuo nome',
  },
  {
    id: 'eta',
    tipo: 'scelta',
    titolo: (risposte) => `Ciao ${risposte.nome || 'amico'}! Quanti anni hai?`,
    opzioni: [
      { valore: 'sotto18', etichetta: 'Sotto i 18' },
      { valore: '18-23', etichetta: '18 - 23' },
      { valore: '23-30', etichetta: '23 - 30' },
      { valore: '30-40', etichetta: '30 - 40' },
      { valore: 'oltre40', etichetta: 'Oltre i 40' },
    ],
  },
  {
    id: 'sesso',
    tipo: 'scelta',
    titolo: 'Sei uomo o donna?',
    opzioni: [
      { valore: 'uomo', etichetta: 'Uomo', icona: '🙋‍♂️' },
      { valore: 'donna', etichetta: 'Donna', icona: '🙋‍♀️' },
    ],
  },
  {
    id: 'conoscenza',
    tipo: 'scelta',
    titolo: 'Come hai conosciuto Chioma AI?',
    opzioni: [
      { valore: 'social', etichetta: 'Social media (Instagram, TikTok...)', icona: '📱' },
      { valore: 'amico', etichetta: 'Passaparola / Amico', icona: '🗣️' },
      { valore: 'google', etichetta: 'Ricerca su Google', icona: '🔎' },
      { valore: 'altro', etichetta: 'Altro', icona: '✨' },
    ],
  },
];

const app = document.getElementById('app');
let state = { risposte: {}, step: 0 };

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Dice se la domanda corrente ha una risposta valida (serve per abilitare "Continua")
function isValido(domanda) {
  const valore = state.risposte[domanda.id];
  if (domanda.tipo === 'testo') return typeof valore === 'string' && valore.trim().length > 0;
  if (domanda.tipo === 'numero') {
    const n = Number(valore);
    return valore !== undefined && valore !== '' && !isNaN(n) && n >= domanda.min && n <= domanda.max;
  }
  if (domanda.tipo === 'scelta') return !!valore;
  return false;
}

function render() {
  const domanda = DOMANDE[state.step];
  const progresso = Math.round((state.step / DOMANDE.length) * 100);
  const ultima = state.step === DOMANDE.length - 1;

  // Calcola il titolo: se è una funzione, la eseguo passandole le risposte finora
  const titoloTesto = typeof domanda.titolo === 'function'
    ? domanda.titolo(state.risposte)
    : domanda.titolo;

  app.innerHTML = `
    <div class="container">
      <div class="progress"><div class="progress-bar" style="width: ${Math.max(progresso, 6)}%"></div></div>
      <p class="counter">Domanda ${state.step + 1} di ${DOMANDE.length}</p>

      <div class="question anim-fade-up">
        <h1>${escapeHtml(titoloTesto)}</h1>
        ${domanda.sottotitolo ? `<p class="subtitle">${escapeHtml(domanda.sottotitolo)}</p>` : ''}
        <div id="campo"></div>
      </div>

     <div class="nav">
  <button id="btn-back" ${state.step === 0 ? 'disabled' : ''}>← Indietro</button>
  ${ultima
    ? `<a id="btn-next" class="button-primario" href="domande.html">Invia →</a>`
    : `<button id="btn-next" ${isValido(domanda) ? '' : 'disabled'}>Continua →</button>`
  }
</div>

      <p id="stato-invio" class="subtitle" style="margin-top:16px; text-align:center;"></p>
    </div>
  `;

  renderCampo(domanda);

  document.getElementById('btn-back').onclick = () => {
    if (state.step > 0) { state.step--; render(); }
  };
  document.getElementById('btn-next').onclick = () => {
    if (ultima) finisci();
    else { state.step++; render(); }
  };
}

// Parte "dinamica": in base al tipo disegna un input oppure delle card cliccabili
function renderCampo(domanda) {
  const contenitore = document.getElementById('campo');

  if (domanda.tipo === 'testo' || domanda.tipo === 'numero') {
    contenitore.innerHTML = `
      <div class="campo-input">
        <input
          type="${domanda.tipo === 'numero' ? 'number' : 'text'}"
          id="input-risposta"
          placeholder="${escapeHtml(domanda.placeholder || '')}"
          value="${state.risposte[domanda.id] || ''}"
          ${domanda.tipo === 'numero' ? `min="${domanda.min}" max="${domanda.max}"` : ''}
        >
      </div>
    `;
    const input = document.getElementById('input-risposta');
    input.focus();
    input.oninput = (e) => {
      state.risposte = { ...state.risposte, [domanda.id]: e.target.value };
      document.getElementById('btn-next').disabled = !isValido(domanda);
    };
    input.onkeydown = (e) => {
      if (e.key === 'Enter' && isValido(domanda)) document.getElementById('btn-next').click();
    };
  }

  if (domanda.tipo === 'scelta') {
    contenitore.innerHTML = `<div class="options" id="options"></div>`;
    const optionsEl = document.getElementById('options');
    domanda.opzioni.forEach(o => {
      const attiva = state.risposte[domanda.id] === o.valore;
      const btn = document.createElement('button');
      btn.className = 'option' + (attiva ? ' active' : '');
      btn.type = 'button';
      btn.innerHTML = `
        ${o.icona ? `<span class="icon">${o.icona}</span>` : ''}
        <span class="label">${escapeHtml(o.etichetta)}</span>
        <span class="check">✓</span>
      `;
      btn.onclick = () => {
        state.risposte = { ...state.risposte, [domanda.id]: o.valore };
        render();
      };
      optionsEl.appendChild(btn);
    });
  }
}

async function finisci() {
  try { localStorage.setItem(CHIAVE, JSON.stringify(state.risposte)); } catch (e) {}

  const stato = document.getElementById('stato-invio');
  const btnNext = document.getElementById('btn-next');

  stato.textContent = 'Salvataggio in corso...';
  stato.className = 'subtitle';
  btnNext.disabled = true;

  try {
    const risposta = await fetch('/api/questionario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.risposte)
    });

    if (!risposta.ok) {
      throw new Error('Errore del server');
    }

    stato.textContent = 'Dati salvati, grazie!';
    stato.className = 'successo';

    setTimeout(() => {
      window.location.href = 'domande.html';
    }, 800);

  } catch (errore) {
    console.error(errore);
    stato.textContent = 'Qualcosa è andato storto, riprova.';
    stato.className = 'errore';
    btnNext.disabled = false;
  }
}

render();