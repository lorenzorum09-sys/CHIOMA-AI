import { inviaFotoAnalisi } from './api.js';
import { salvaAnalisiInCronologia, copiaInAppunti, mostraToast } from './storage.js';

export function inizializzaUI() {
    const fotoInput = document.getElementById('foto-input');
    const btnCaricaFoto = document.getElementById('btn-carica-foto');
    const btnCambiaFoto = document.getElementById('btn-cambia-foto');
    const btnRimuoviFoto = document.getElementById('btn-rimuovi-foto');
    const gestioneFoto = document.getElementById('gestione-foto');
    const scannerWrap = document.querySelector('.scanner-wrap');
    const scannerCornice = document.getElementById('scanner-cornice');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const anteprimaFoto = document.getElementById('anteprima-foto');
    const btnAnalizza = document.getElementById('btn-analizza');
    const cardRisultati = document.getElementById('card-risultati');

    if (!fotoInput || !scannerCornice) return;

    // Trigger upload
    btnCaricaFoto?.addEventListener('click', () => fotoInput.click());
    btnCambiaFoto?.addEventListener('click', () => fotoInput.click());
    scannerCornice.addEventListener('click', () => {
        if (!anteprimaFoto.src || anteprimaFoto.style.display === 'none') {
            fotoInput.click();
        }
    });

    fotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) gestisciFileSelezionato(file);
    });

    // Drag & Drop
    scannerCornice.addEventListener('dragover', (e) => {
        e.preventDefault();
        scannerWrap?.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(tipo => {
        scannerCornice.addEventListener(tipo, () => {
            scannerWrap?.classList.remove('dragover');
        });
    });

    scannerCornice.addEventListener('drop', (e) => {
        e.preventDefault();
        scannerWrap?.classList.remove('dragover');
        if (e.dataTransfer.files?.[0]) {
            gestisciFileSelezionato(e.dataTransfer.files[0]);
        }
    });

    function gestisciFileSelezionato(file) {
        if (!file.type.startsWith('image/')) {
            mostraToast('⚠️ Seleziona un file immagine valido (JPEG, PNG, WebP).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            anteprimaFoto.src = e.target.result;
            anteprimaFoto.style.display = 'block';
            uploadPlaceholder.style.display = 'none';

            if (btnCaricaFoto) btnCaricaFoto.style.display = 'none';
            if (gestioneFoto) gestioneFoto.style.display = 'flex';
            if (btnAnalizza) btnAnalizza.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
    }

    btnRimuoviFoto?.addEventListener('click', () => {
        fotoInput.value = '';
        anteprimaFoto.src = '';
        anteprimaFoto.style.display = 'none';
        uploadPlaceholder.style.display = 'flex';

        if (btnCaricaFoto) btnCaricaFoto.style.display = 'inline-flex';
        if (gestioneFoto) gestioneFoto.style.display = 'none';
        if (btnAnalizza) btnAnalizza.style.display = 'none';
        if (cardRisultati) cardRisultati.style.display = 'none';
    });

    btnAnalizza?.addEventListener('click', async () => {
        const file = fotoInput.files[0];
        if (!file) {
            mostraToast('⚠️ Carica prima una foto!');
            return;
        }

        scannerWrap?.classList.add('scansione-attiva');
        btnAnalizza.disabled = true;
        const testoOriginale = btnAnalizza.innerHTML;
        btnAnalizza.innerHTML = '⚡ Scansione AI in corso...';

        try {
            const risposta = await inviaFotoAnalisi(file);

            if (risposta.success && risposta.data) {
                salvaAnalisiInCronologia(risposta.data);
                mostraRisultatiAnalisi(risposta.data);
                mostraToast('✨ Analisi completata con successo!');
            } else {
                throw new Error('Dati non validi ricevuti dal server.');
            }
        } catch (errore) {
            console.error(errore);
            mostraToast(`❌ Error: ${errore.message}`);
        } finally {
            scannerWrap?.classList.remove('scansione-attiva');
            btnAnalizza.disabled = false;
            btnAnalizza.innerHTML = testoOriginale;
        }
    });

    avviaParolaRotante();
}

function avviaParolaRotante() {
    const elParola = document.getElementById('parola-rotante');
    if (!elParola) return;

    const parole = ["Forma del Viso", "Capelli Mossi", "Texture & Densità", "Ricci a Spirale", "Taglio Ideale"];
    let indice = 0;

    setInterval(() => {
        indice = (indice + 1) % parole.length;
        elParola.style.opacity = '0';
        setTimeout(() => {
            elParola.textContent = parole[indice];
            elParola.style.opacity = '1';
        }, 200);
    }, 2000);
}

export function mostraRisultatiAnalisi(dati) {
    const cardContainer = document.getElementById('card-risultati');
    if (!cardContainer) return;

    const formaViso = dati.forma_viso || 'Ovale';
    const descViso = dati.forma_viso_descrizione || '';
    const tipoCapello = dati.tipo_capello || 'Non specificato';
    const densita = dati.densita_volume || 'Naturale';

    const taglioPrinc = dati.taglio_principale || {};
    const taglioAlt = dati.alternativa_taglio || {};
    const routine = dati.routine_cura || {};
    const prodotti = dati.prodotti_consigliati || [];
    const daEvitare = dati.ingredienti_da_evitare || [];
    const schedaParrucchiere = dati.scheda_parrucchiere || `${taglioPrinc.nome || 'Taglio sfumato'}`;

    cardContainer.innerHTML = `
        <div class="tabs-header">
            <button class="tab-btn attivo" onclick="cambiaTab('tab-taglio')">✂️ Taglio Ideale</button>
            <button class="tab-btn" onclick="cambiaTab('tab-visagismo')">👤 Visagismo</button>
            <button class="tab-btn" onclick="cambiaTab('tab-routine')">🧴 Routine & Cura</button>
            <button class="tab-btn" onclick="cambiaTab('tab-parrucchiere')">💈 Scheda Parrucchiere</button>
            <button class="tab-btn" onclick="cambiaTab('tab-preferenze')">💡 Preferenze</button>
        </div>
        
        <!-- TAB 1: TAGLIO -->
        <div id="tab-taglio" class="tab-content attivo">
            <h2 class="titolo-sezione" style="color: var(--oro);">${taglioPrinc.nome || 'Taglio Personalizzato'}</h2>
            <p style="margin-bottom: 12px; font-size: 15px; line-height: 1.6;">${taglioPrinc.descrizione || ''}</p>
            <p style="font-size: 14px; color: var(--testo-secondario); padding-bottom:12px;"> <strong>Questo testo è stato generato da un'intelligenza artificiale</strong></p>
            <div style="background: rgba(226, 136, 89, 0.1); border-left: 3px solid var(--oro); padding: 12px 16px; border-radius: 4px; margin-bottom: 16px;">
                <strong style="color: var(--oro); font-size: 13px;">💡 Perché ti valorizza:</strong>
                <p style="font-size: 14px; margin-top: 4px;">${taglioPrinc.perche_adatto || ''}</p>
            </div>

         

            ${taglioAlt.nome ? `
            <div class="divisore" style="margin: 20px 0;"></div>
            <h3 style="font-size: 16px; color: var(--oro); margin-bottom: 6px;">Alternativa Consigliata: ${taglioAlt.nome}</h3>
            <p style="font-size: 14px; color: var(--testo-secondario);">${taglioAlt.descrizione || ''}</p>
            ` : ''}
        </div>
      
        <!-- TAB 2: VISAGISMO -->
        <div id="tab-visagismo" class="tab-content">
            <div class="diag-grid">
                <div class="diag-item">
                    <div class="diag-etichetta">Forma del Viso</div>
                    <div class="diag-valore">${formaViso}</div>
                </div>
                <div class="diag-item">
                    <div class="diag-etichetta">Tipo di Capello</div>
                    <div class="diag-valore">${tipoCapello}</div>
                </div>
                <div class="diag-item">
                    <div class="diag-etichetta">Densità & Volume</div>
                    <div class="diag-valore">${densita}</div>
                </div>
            </div>
            ${descViso ? `<p style="font-size: 14px; color: var(--testo-secondario); line-height: 1.6;">${descViso}</p>` : ''}
        </div>

        <!-- TAB 3: ROUTINE -->
        <div id="tab-routine" class="tab-content">
            <div style="display: flex; flex-direction: column; gap: 14px;">
                <div class="diag-item">
                    <div class="diag-etichetta">🧼 Lavaggio</div>
                    <div style="font-size: 14px; margin-top: 4px;">${routine.lavaggio || 'Utilizzare uno shampoo delicato idratante.'}</div>
                </div>
                <div class="diag-item">
                    <div class="diag-etichetta">💨 Asciugatura</div>
                    <div style="font-size: 14px; margin-top: 4px;">${routine.asciugatura || 'Asciugare con aria tiepida.'}</div>
                </div>
                <div class="diag-item">
                    <div class="diag-etichetta">✨ Trattamenti</div>
                    <div style="font-size: 14px; margin-top: 4px;">${routine.trattamenti || 'Balsamo districante dopo ogni lavaggio.'}</div>
                </div>
            </div>
   ${taglioPrinc.styling_tip ? `
            <p style="font-size: 13px; color: var(--oro); padding-top: 16px; padding-bottom:16px;">
                <strong>Styling tip:</strong> ${taglioPrinc.styling_tip}
            </p>` : ''}
            
            ${prodotti.length ? `
            <div style="margin-top: 18px;">
                <strong style="font-size: 13px; color: var(--salvia);">Prodotti consigliati:</strong>
                <ul style="margin-top: 8px; padding-left: 20px; font-size: 14px; color: var(--testo-secondario);">
                    ${prodotti.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>` : ''}

            ${daEvitare.length ? `
            <div style="margin-top: 14px;">
                <strong style="font-size: 13px; color: #FF6B6B;">Ingredienti da evitare:</strong>
                <ul style="margin-top: 8px; padding-left: 20px; font-size: 14px; color: var(--testo-secondario);">
                    ${daEvitare.map(e => `<li>${e}</li>`).join('')}
                </ul>
            </div>` : ''}
        </div>

        <!-- TAB 4: PARRUCCHIERE -->
        <div id="tab-parrucchiere" class="tab-content">
            <p style="font-size: 14px; color: var(--testo-secondario); margin-bottom: 12px;">
                Mostra o leggi direttamente questo messaggio al tuo parrucchiere/a quando ti siedi sulla poltrona:
            </p>
            <div class="scheda-parrucchiere-box">
                <p id="testo-scheda-parrucchiere" style="font-size: 15px; font-weight: 600; color: var(--testo); line-height: 1.5; padding-right: 40px;">
                    "${schedaParrucchiere}"
                </p>
                <button type="button" class="bottone-secondario scheda-copia-btn" id="btn-copia-scheda">
                    📋 Copia
                </button>
            </div>
        </div>
    `;

    cardContainer.style.display = 'block';
    cardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Listener pulsante copia
    document.getElementById('btn-copia-scheda')?.addEventListener('click', () => {
        copiaInAppunti(schedaParrucchiere);
    });
}

// Funzione globale per il cambio Tab
window.cambiaTab = function (tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('attivo'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('attivo'));

    const tabTarget = document.getElementById(tabId);
    if (tabTarget) {
        tabTarget.classList.add('attivo');
    }

    const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick')?.includes(tabId));
    if (activeBtn) {
        activeBtn.classList.add('attivo');
    }
};

function inizializzaTransizioniNav() {
  const overlay = document.getElementById('overlay-transizione');
  const linkNav = document.querySelectorAll('.nav-link');

  if (!overlay || linkNav.length === 0) {
    console.warn('Transizioni nav: overlay o link non trovati', { overlay, numeroLink: linkNav.length });
    return;
  }

  linkNav.forEach((link) => {
    link.addEventListener('click', (e) => {
      const destinazione = link.getAttribute('href');

      if (!destinazione || destinazione === '#') return;

      if (link.classList.contains('attivo')) return;

      e.preventDefault();
      overlay.classList.add('attiva');

      setTimeout(() => {
        window.location.href = destinazione;
      }, 350);
    });
  });
}

document.addEventListener('DOMContentLoaded', inizializzaTransizioniNav);