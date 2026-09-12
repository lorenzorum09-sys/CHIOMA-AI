import { inizializzaUI } from './js/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    inizializzaUI();
    inizializzaTransizioniNav();
});

function inizializzaTransizioniNav() {
  const overlay = document.getElementById('overlay-transizione');
  const linkNav = document.querySelectorAll('.nav-link');

  if (!overlay || linkNav.length === 0) return;

  linkNav.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('attivo')) return;

      e.preventDefault();
      overlay.classList.add('attiva');

      setTimeout(() => {
        window.location.href = link.getAttribute('href');
      }, 350);
    });
  });
}
document.getElementById('questionario').addEventListener('submit', async (e) => {
    e.preventDefault(); // blocca il comportamento di default (reload della pagina)

    const form = e.target;
    const stato = document.getElementById('stato-invio');

    // FormData legge automaticamente tutti i campi con "name" dentro il form
    const formData = new FormData(form);
    const dati = Object.fromEntries(formData.entries());
    // Object.fromEntries trasforma le coppie [chiave, valore] di FormData
    // in un oggetto normale: { nome: "...", eta: "...", sesso: "...", conoscenza: "..." }

    try {
        const risposta = await fetch('/api/questionario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dati)
        });

        if (!risposta.ok) {
            throw new Error('Errore del server');
        }

        stato.textContent = 'Dati salvati, grazie!';
        stato.className = 'successo';

        // qui puoi reindirizzare alla pagina successiva, es:
        // window.location.href = 'analizza.html';

    } catch (errore) {
        console.error(errore);
        stato.textContent = 'Qualcosa è andato storto, riprova.';
        stato.className = 'errore';
    }
});