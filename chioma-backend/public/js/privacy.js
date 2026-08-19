const card = document.getElementById('card-privacy');
const backdrop = document.getElementById('backdrop-privacy');

// Il consenso è richiesto per ogni nuova apertura della pagina, su PC e mobile.
let consensoDato = false;
let azioneInAttesa = null;

card.innerHTML = `
  <h3 style="margin-bottom: 12px;">Prima di continuare</h3>
  <p style="font-size: 14px; color: var(--testo-secondario); line-height: 1.6; margin-bottom: 20px;">
    <strong>Accettazione dei Termini.</strong> Utilizzando Chioma AI, l'utente accetta
    integralmente i presenti Termini e Condizioni. Se non accetta le condizioni,
    non sarà possibile utilizzare la web app.<br><br>
    <strong>Descrizione del servizio.</strong> Chioma AI analizza immagini di tagli di
    capelli e fornisce suggerimenti estetici basati su forma del viso e stile. Il servizio
    ha finalità informative e non sostituisce consulenze professionali.<br><br>
    <strong>Uso consentito.</strong> L'utente si impegna a utilizzare la web app in modo
    lecito. È vietato caricare immagini non proprie o senza autorizzazione, usare l'app
    per scopi commerciali non autorizzati o alterare, copiare e distribuire parti dell'app
    senza permesso.<br><br>
    <strong>Elaborazione tramite Intelligenza Artificiale.</strong> Le immagini caricate
    vengono inviate a Google Gemini (Google LLC) al solo scopo di generare l'analisi e la
    simulazione del taglio. Google può elaborare i dati anche fuori dallo Spazio Economico
    Europeo. L'utente mantiene la proprietà delle immagini e concede una licenza limitata,
    non esclusiva e revocabile per elaborarle esclusivamente per fornire il servizio.<br><br>
    <strong>Conservazione dei dati.</strong> Le immagini vengono elaborate e poi eliminate
    automaticamente. Chioma AI non le conserva a lungo termine, non le condivide e non le
    utilizza per addestrare modelli di IA.<br><br>
    <strong>Limitazione di responsabilità.</strong> I suggerimenti sono basati su algoritmi;
    Chioma AI non garantisce risultati e non risponde di decisioni o danni derivanti dall'uso
    del servizio. I Termini e l'informativa privacy possono essere aggiornati tramite app.
    Per richieste o per esercitare i tuoi diritti: lorenzorum09@gmail.com.
  </p>
  <div style="display: flex; gap: 12px;">
    <button type="button" class="bottone" id="btn-privacy-accetta">Accetto</button>
    <button type="button" class="bottone-secondario" id="btn-privacy-annulla">Annulla</button>
  </div>
`;

const btnAccetta = document.getElementById('btn-privacy-accetta');
const btnAnnulla = document.getElementById('btn-privacy-annulla');

function mostraModalPrivacy() {
  card.classList.add('mostra');
  backdrop.classList.add('mostra');
}

function nascondiModalPrivacy() {
  card.classList.remove('mostra');
  backdrop.classList.remove('mostra');
}

export function eseguiConConsenso(azione) {
  if (consensoDato) {
    azione();
    return;
  }

  // L'apertura del picker avviene nel click su "Accetto", richiesto dai browser mobile.
  azioneInAttesa = azione;
  mostraModalPrivacy();
}

export function consensoGiaDato() {
  return consensoDato;
}

btnAccetta.addEventListener('click', () => {
  consensoDato = true;
  nascondiModalPrivacy();
  const azione = azioneInAttesa;
  azioneInAttesa = null;
  azione?.();
});

function annulla() {
  azioneInAttesa = null;
  nascondiModalPrivacy();
}

btnAnnulla.addEventListener('click', annulla);
backdrop.addEventListener('click', annulla);

// Mostra sempre i Termini appena si apre la pagina: in questo modo il tap
// successivo sulla fotocamera è un gesto nativo, affidabile su Android e iPhone.
mostraModalPrivacy();
