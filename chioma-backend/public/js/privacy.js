const fotoInput = document.getElementById('foto-input');
const card = document.getElementById('card-privacy');
const backdrop = document.getElementById('backdrop-privacy');

localStorage.removeItem('chiomaAiConsenso')
card.innerHTML = `
    <h3 style="margin-bottom: 12px;">Prima di continuare</h3>
    <p style="font-size: 14px; color: var(--testo-secondario); line-height: 1.6; margin-bottom: 20px;">
1. Accettazione dei Termini  
Utilizzando Chioma AI, l’utente accetta integralmente i presenti Termini e Condizioni. Se non accetta una o più parti del documento, deve interrompere l’utilizzo dell’app.

2. Descrizione del Servizio  
Chioma AI è un’applicazione che analizza immagini di tagli di capelli e fornisce suggerimenti estetici basati su forma del viso, stile e preferenze dell’utente. Il servizio ha finalità informative e non sostituisce consulenze professionali.

3. Uso Consentito  
L’utente si impegna a utilizzare l’app in modo lecito e conforme ai presenti Termini. È vietato:

caricare immagini non proprie o senza autorizzazione;

utilizzare l’app per scopi commerciali non autorizzati;

tentare di alterare, copiare o distribuire parti dell’app senza permesso.

4. Contenuti dell’Utente  
L’utente mantiene la proprietà delle immagini caricate. Caricando contenuti, concede a Chioma AI una licenza limitata, non esclusiva e revocabile per elaborare tali immagini al solo scopo di fornire il servizio.

5. Limitazione di Responsabilità  
Chioma AI fornisce suggerimenti estetici basati su algoritmi. L’app non garantisce risultati, non è responsabile di decisioni prese dall’utente e non risponde di eventuali danni derivanti dall’uso del servizio.

6. Modifiche ai Termini  
I presenti Termini possono essere aggiornati. Le modifiche saranno comunicate tramite app o sito web. L’uso continuato del servizio implica accettazione delle modifiche.

7. Legge Applicabile  
I presenti Termini sono regolati dalla legge italiana. Per eventuali controversie è competente il foro di residenza dell’utente.

🔐 Informativa sulla Privacy — Chioma AI
1. Titolare del Trattamento  
Il titolare del trattamento dei dati è lo sviluppatore dell’app Chioma AI. Per richieste o chiarimenti è possibile contattare: lorenzorum09@gmail.com

2. Dati Raccolti  
L’app può raccogliere:

immagini caricate dall’utente (solo per analisi temporanea);

dati tecnici del dispositivo (sistema operativo, errori, log);

preferenze di utilizzo (stili salvati, funzioni usate).

3. Finalità del Trattamento  
I dati vengono utilizzati esclusivamente per:

analizzare le immagini e generare suggerimenti;

migliorare il funzionamento dell’app;

garantire sicurezza e prevenzione di abusi.

4. Conservazione dei Dati  
Le immagini caricate vengono elaborate e poi eliminate automaticamente. Nessuna foto viene conservata a lungo termine, condivisa o utilizzata per addestrare modelli esterni.

5. Condivisione dei Dati  
I dati non vengono condivisi con terze parti, salvo obblighi di legge o servizi tecnici necessari al funzionamento dell’app (hosting, sicurezza).

6. Diritti dell’Utente  
L’utente può richiedere la cancellazione dei propri dati, ottenere informazioni sul trattamento o revocare il consenso in qualsiasi momento.

7. Sicurezza  
L’app utilizza misure tecniche per proteggere i dati da accessi non autorizzati, perdita o alterazione.

8. Aggiornamenti della Privacy Policy  
La presente informativa può essere aggiornata. Le modifiche saranno comunicate tramite app o sito web.    </p>
    <div style="display: flex; gap: 12px;">
        <button type="button" class="bottone" id="btn-privacy-accetta">Accetto</button>
        <button type="button" class="bottone-secondario" id="btn-privacy-annulla">Annulla</button>
    </div>
`;
let consensoDato = localStorage.getItem('chiomaAiConsenso') === 'true';

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

// Intercettiamo TUTTI i punti che aprono il file picker
const triggerDaIntercettare = [
    document.getElementById('btn-carica-foto'),
    document.getElementById('btn-cambia-foto'),
    document.getElementById('scanner-cornice')
];

triggerDaIntercettare.forEach((elemento) => {
    if (!elemento) return;
    elemento.addEventListener('click', (e) => {
        if (consensoDato) return; // già accettato: lascia fare a ui.js normalmente
        e.stopImmediatePropagation(); // blocca il listener di ui.js su QUESTO click
        mostraModalPrivacy();
    });
});

btnAccetta.addEventListener('click', () => {
    consensoDato = true;
    localStorage.setItem('chiomaAiConsenso', 'true'); // scrivi SOLO qui
    nascondiModalPrivacy();
    fotoInput.click();
});

btnAnnulla.addEventListener('click', nascondiModalPrivacy);

// Chiudi cliccando sul backdrop
backdrop.addEventListener('click', nascondiModalPrivacy);