import { inviaFotoAnalisi, generaAnteprimaTaglio } from "./api.js";
import { eseguiConConsenso } from "./privacy.js";
import {
  salvaAnalisiInCronologia,
  copiaInAppunti,
  mostraToast,
} from "./storage.js";
let fotoAnalizzata = null;
export function inizializzaUI() {
  const fotoInput = document.getElementById("foto-input");
  const fotocameraInput = document.getElementById("fotocamera-input");
  const btnCaricaFoto = document.getElementById("btn-carica-foto");
  const btnScattaFoto = document.getElementById("btn-scatta-foto");
  const modalFotocamera = document.getElementById("modal-fotocamera");
  const videoFotocamera = document.getElementById("video-fotocamera");
  const btnCatturaFotocamera = document.getElementById(
    "btn-cattura-fotocamera",
  );
  const btnChiudiFotocamera = document.getElementById("btn-chiudi-fotocamera");
  const btnCambiaFoto = document.getElementById("btn-cambia-foto");
  const btnRimuoviFoto = document.getElementById("btn-rimuovi-foto");
  const gestioneFoto = document.getElementById("gestione-foto");
  const scannerWrap = document.querySelector(".scanner-wrap");
  const scannerCornice = document.getElementById("scanner-cornice");
  const uploadPlaceholder = document.getElementById("upload-placeholder");
  const anteprimaFoto = document.getElementById("anteprima-foto");
  const btnAnalizza = document.getElementById("btn-analizza");
  const cardRisultati = document.getElementById("card-risultati");
  let fileSelezionato = null;
  let urlAnteprima = null;
  let streamFotocamera = null;
  if (!fotoInput || !scannerCornice) {
    console.warn("Elementi UI Chioma AI non trovati.");
    return;
  }
  /* =====================================================
       UPLOAD FOTO
    ===================================================== */
  function apriSelettore(input) {
    eseguiConConsenso(() => input.click());
  }
  btnCaricaFoto?.addEventListener("click", () => apriSelettore(fotoInput));
  btnScattaFoto?.addEventListener("click", () => {
    eseguiConConsenso(apriFotocamera);
  });
  async function apriFotocamera() {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      mostraToast(
        "Per scattare dalla fotocamera apri l’app da un indirizzo HTTPS.",
      );
      return;
    }
    try {
      streamFotocamera = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1600 },
          height: { ideal: 1600 },
        },
        audio: false,
      });
      videoFotocamera.srcObject = streamFotocamera;
      modalFotocamera.classList.add("mostra");
      modalFotocamera.setAttribute("aria-hidden", "false");
    } catch (errore) {
      console.error("Fotocamera non disponibile:", errore);
      mostraToast(
        "Impossibile aprire la fotocamera. Controlla i permessi del browser.",
      );
    }
  }
  function chiudiFotocamera() {
    streamFotocamera?.getTracks().forEach((traccia) => traccia.stop());
    streamFotocamera = null;
    if (videoFotocamera) videoFotocamera.srcObject = null;
    modalFotocamera?.classList.remove("mostra");
    modalFotocamera?.setAttribute("aria-hidden", "true");
  }
  btnChiudiFotocamera?.addEventListener("click", chiudiFotocamera);
  btnCatturaFotocamera?.addEventListener("click", async () => {
    if (!videoFotocamera?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoFotocamera.videoWidth;
    canvas.height = videoFotocamera.videoHeight;
    canvas.getContext("2d").drawImage(videoFotocamera, 0, 0);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );
    chiudiFotocamera();
    if (blob)
      gestisciFileSelezionato(
        new File([blob], "foto-scattata.jpg", { type: "image/jpeg" }),
      );
  });
  btnCambiaFoto?.addEventListener("click", () => apriSelettore(fotoInput));
  scannerCornice.addEventListener("click", () => {
    if (!anteprimaFoto.src || anteprimaFoto.style.display === "none") {
      apriSelettore(fotoInput);
    }
  });
  [fotoInput, fotocameraInput].filter(Boolean).forEach((input) => {
    input.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) gestisciFileSelezionato(file);
    });
  });
  /* =====================================================
       DRAG & DROP
    ===================================================== */
  scannerCornice.addEventListener("dragover", (e) => {
    e.preventDefault();
    scannerWrap?.classList.add("dragover");
  });
  ["dragleave", "dragend"].forEach((tipo) => {
    scannerCornice.addEventListener(tipo, () => {
      scannerWrap?.classList.remove("dragover");
    });
  });
  scannerCornice.addEventListener("drop", (e) => {
    e.preventDefault();
    scannerWrap?.classList.remove("dragover");
    const file = e.dataTransfer.files?.[0];
    if (file) {
      gestisciFileSelezionato(file);
    }
  });
  /* =====================================================
       GESTIONE FILE
    ===================================================== */
  async function gestisciFileSelezionato(file) {
    if (!file.type.startsWith("image/")) {
      mostraToast("⚠️ Seleziona un file immagine valido (JPEG, PNG, WebP).");
      return;
    }
    try {
      fileSelezionato = await ottimizzaFotoPerAnalisi(file);
      if (urlAnteprima) URL.revokeObjectURL(urlAnteprima);
      urlAnteprima = URL.createObjectURL(fileSelezionato);
      anteprimaFoto.src = urlAnteprima;
      anteprimaFoto.style.display = "block";
      if (uploadPlaceholder) {
        uploadPlaceholder.style.display = "none";
      }
      if (btnCaricaFoto) {
        btnCaricaFoto.style.display = "none";
      }
      if (gestioneFoto) {
        gestioneFoto.style.display = "flex";
      }
      if (btnAnalizza) {
        btnAnalizza.style.display = "inline-flex";
      }
    } catch (errore) {
      console.error("Errore durante la preparazione della foto:", errore);
      mostraToast(
        "Impossibile leggere questa foto. Riprova con un file JPEG o PNG.",
      );
    }
  }
  async function ottimizzaFotoPerAnalisi(file) {
    // Le foto scattate dai telefoni possono superare facilmente i 10 MB.
    // Ridurle prima dell'upload evita refresh, rallentamenti e rifiuti del server.
    if (!file.type.startsWith("image/") || file.type === "image/gif")
      return file;
    const sorgente = URL.createObjectURL(file);
    try {
      const immagine = new Image();
      await new Promise((resolve, reject) => {
        immagine.onload = resolve;
        immagine.onerror = reject;
        immagine.src = sorgente;
      });
      const latoMassimo = 1600;
      const scala = Math.min(
        1,
        latoMassimo / Math.max(immagine.naturalWidth, immagine.naturalHeight),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(immagine.naturalWidth * scala));
      canvas.height = Math.max(1, Math.round(immagine.naturalHeight * scala));
      canvas
        .getContext("2d")
        .drawImage(immagine, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.88),
      );
      if (!blob) return file;
      return new File([blob], "foto-chioma.jpg", { type: "image/jpeg" });
    } finally {
      URL.revokeObjectURL(sorgente);
    }
  }
  /* =====================================================
       RIMUOVI FOTO
    ===================================================== */
  btnRimuoviFoto?.addEventListener("click", () => {
    fotoInput.value = "";
    if (fotocameraInput) fotocameraInput.value = "";
    fileSelezionato = null;
    if (urlAnteprima) {
      URL.revokeObjectURL(urlAnteprima);
      urlAnteprima = null;
    }
    anteprimaFoto.src = "";
    anteprimaFoto.style.display = "none";
    if (uploadPlaceholder) {
      uploadPlaceholder.style.display = "flex";
    }
    if (btnCaricaFoto) {
      btnCaricaFoto.style.display = "inline-flex";
    }
    if (gestioneFoto) {
      gestioneFoto.style.display = "none";
    }
    if (btnAnalizza) {
      btnAnalizza.style.display = "none";
    }
    if (cardRisultati) {
      cardRisultati.style.display = "none";
    }
  });
  /* =====================================================
       ANALISI AI
    ===================================================== */
  btnAnalizza?.addEventListener("click", async () => {
    const file = fileSelezionato;
    if (!file) {
      mostraToast("⚠️ Carica prima una foto!");
      return;
    }
    scannerWrap?.classList.add("scansione-attiva");
    btnAnalizza.disabled = true;
    const testoOriginale = btnAnalizza.innerHTML;
    btnAnalizza.innerHTML = "⚡ Scansione AI in corso...";
    try {
      const risposta = await inviaFotoAnalisi(file);
      if (risposta.success && risposta.data) {
        fotoAnalizzata = file;
        salvaAnalisiInCronologia(risposta.data);
        mostraRisultatiAnalisi(risposta.data);
        mostraToast("✨ Analisi completata con successo!");
      } else {
        throw new Error("Dati non validi ricevuti dal server.");
      }
    } catch (errore) {
      console.error(errore);
      mostraToast(`❌ Errore: ${errore.message}`);
    } finally {
      scannerWrap?.classList.remove("scansione-attiva");
      btnAnalizza.disabled = false;
      btnAnalizza.innerHTML = testoOriginale;
    }
  });
  avviaParolaRotante();
}
/* =========================================================
   PAROLE ROTANTI
========================================================= */
function avviaParolaRotante() {
  const elParola = document.getElementById("parola-rotante");
  if (!elParola) {
    return;
  }
  const parole = [
    "Forma del Viso",
    "Capelli Mossi",
    "Texture & Densità",
    "Ricci a Spirale",
    "Taglio Ideale",
  ];
  let indice = 0;
  setInterval(() => {
    indice = (indice + 1) % parole.length;
    elParola.style.opacity = "0";
    setTimeout(() => {
      elParola.textContent = parole[indice];
      elParola.style.opacity = "1";
    }, 200);
  }, 2000);
}
/* =========================================================
   NORMALIZZA NOME TAGLIO
   Serve per trovare automaticamente l'immagine.
========================================================= */
function normalizzaNomeTaglio(nome) {
  if (!nome) {
    return "";
  }
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/sfumatura/g, "")
    .replace(/sfumato/g, "")
    .replace(/fade/g, "")
    .replace(/taper/g, "taper")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
/* =========================================================
   OTTIENI IMMAGINE TAGLIO
========================================================= */
function ottieniImmagineTaglio() {
  // Le immagini dei singoli tagli non sono ancora nel progetto.
  // Un asset locale impedisce richieste 404 nelle card dei risultati.
  return "Copilot_20260728_144629.png";
}
/* =========================================================
   FALLBACK IMMAGINE
========================================================= */
function immagineFallback(img) {
  img.onerror = null;
  img.src = "/images/haircuts/placeholder.jpg";
}
/* =========================================================
   CREA CARD TAGLIO
========================================================= */
function creaCardTaglio(taglio, indice) {
  if (!taglio) {
    return "";
  }
  const nome = taglio.nome || "Taglio personalizzato";
  const compatibilita = Number(taglio.compatibilita) || 0;
  const descrizione = taglio.descrizione || "";
  const percheAdatto = taglio.perche_adatto || "";
  const stylingTip = taglio.styling_tip || "";
  const schedaParrucchiere = taglio.scheda_parrucchiere || nome;
  const immagine = ottieniImmagineTaglio(nome);
  const badge =
    indice === 0
      ? '<span class="taglio-badge-migliore">✨ MIGLIORE MATCH</span>'
      : `<span class="taglio-numero">#${indice + 1}</span>`;
  return `
        <article class="taglio-card" data-taglio-index="${indice}">
                <div class="taglio-compatibilita">
                    <strong>
                        ${compatibilita}%
                    </strong>
                    <span>
                        compatibile
                    </span>
                </div>
            </div>
            <div class="taglio-card-body">
                <h3 class="taglio-card-titolo">
                    ${nome}
                </h3>
                <p class="taglio-card-descrizione">
                    ${descrizione}
                </p>
                <div class="taglio-card-perche">
                    <strong>
                        💡 Perché ti sta bene
                    </strong>
                    <p>
                        ${percheAdatto}
                    </p>
                </div>
                ${
                  stylingTip
                    ? `
                        <div class="taglio-card-styling">
                            <strong>
                                ✨ Styling
                            </strong>
                            <p>
                                ${stylingTip}
                            </p>
                        </div>
                        `
                    : ""
                }
                <button type="button" class="btn-scopri-taglio" data-taglio-index="${indice}">
                    Scopri questo taglio
                    <span>→</span>
                </button>
            </div>
        </article>
    `;
}
/* =========================================================
   MOSTRA RISULTATI ANALISI
========================================================= */
export function mostraRisultatiAnalisi(dati) {
  const cardContainer = document.getElementById("card-risultati");
  if (!cardContainer) {
    return;
  }
  /* =====================================================
       DATI GENERALI
    ===================================================== */
  const formaViso = dati.forma_viso || "Ovale";
  const descViso = dati.forma_viso_descrizione || "";
  const tipoCapello = dati.tipo_capello || "Non specificato";
  const densita = dati.densita_volume || "Naturale";
  const routine = dati.routine_cura || {};
  const prodotti = dati.prodotti_consigliati || [];
  const daEvitare = dati.ingredienti_da_evitare || [];
  /* =====================================================
       NUOVI 3 TAGLI
    ===================================================== */
  let tagli = Array.isArray(dati.tagli_consigliati)
    ? dati.tagli_consigliati
    : [];
  /*
       Ordina dal più compatibile
       al meno compatibile
    */
  tagli = [...tagli]
    .sort((a, b) => Number(b.compatibilita || 0) - Number(a.compatibilita || 0))
    .slice(0, 3);
  /* =====================================================
       FALLBACK PER VECCHI RISULTATI
       Se hai analisi salvate nel vecchio formato,
       non si rompe tutto.
    ===================================================== */
  if (tagli.length === 0) {
    if (dati.taglio_principale) {
      tagli.push(dati.taglio_principale);
    }
    if (dati.alternativa_taglio) {
      tagli.push(dati.alternativa_taglio);
    }
  }
  /* =====================================================
       SCHEDE TAGLI
    ===================================================== */
  const cardsTagli = tagli
    .slice(0, 3)
    .map((taglio, indice) => creaCardTaglio(taglio, indice))
    .join("");
  /* =====================================================
       SCHEDA PARRUCCHIERE
       Prende il primo taglio
    ===================================================== */
  const primoTaglio = tagli[0] || {};
  const schedaParrucchiere =
    primoTaglio.scheda_parrucchiere ||
    primoTaglio.nome ||
    "Taglio personalizzato";
  /* =====================================================
       HTML
    ===================================================== */
  cardContainer.innerHTML = `
        <!-- =========================================
             HEADER
        ========================================== -->
        <div class="risultati-header">
            <span class="risultati-eyebrow">
                ✨ ANALISI COMPLETATA
            </span>
            <h2>
                I tuoi 3 tagli migliori
            </h2>
            <p>
                In base alla forma del tuo viso
                e alla struttura dei tuoi capelli.
            </p>
        </div>
        <!-- =========================================
             3 CARD TAGLI
        ========================================== -->
        <div class="tagli-grid">
            ${
              cardsTagli ||
              `
                <div class="nessun-risultato">
                    Non è stato possibile trovare
                    dei tagli consigliati.
                </div>
                `
            }
        </div>
        <!-- =========================================
             TAB (nascosto finché non scegli un taglio)
        ========================================== -->
        <div class="tabs-header" id="tabs-header" style="display:none;">
            <button class="tab-btn attivo" onclick="cambiaTab('tab-taglio')">
                ✂️ Dettaglio
            </button>
            <button class="tab-btn" onclick="cambiaTab('tab-visagismo')">
                👤 Visagismo
            </button>
            <button class="tab-btn" onclick="cambiaTab('tab-routine')">
                🧴 Routine & Cura
            </button>
            <button class="tab-btn" onclick="cambiaTab('tab-parrucchiere')">
                💈 Parrucchiere
            </button>
        </div>
        <!-- =========================================
             TAB 1 - DETTAGLIO TAGLIO
        ========================================== -->
        <div id="tab-taglio" class="tab-content attivo">
            <div id="dettaglio-taglio">
                ${creaDettaglioTaglio(primoTaglio)}
            </div>
        </div>
        <!-- =========================================
             TAB 2 - VISAGISMO
        ========================================== -->
        <div id="tab-visagismo" class="tab-content">
            <div class="diag-grid">
                <div class="diag-item">
                    <div class="diag-etichetta">
                        Forma del Viso
                    </div>
                    <div class="diag-valore">
                        ${formaViso}
                    </div>
                </div>
                <div class="diag-item">
                    <div class="diag-etichetta">
                        Tipo di Capello
                    </div>
                    <div class="diag-valore">
                        ${tipoCapello}
                    </div>
                </div>
                <div class="diag-item">
                    <div class="diag-etichetta">
                        Densità & Volume
                    </div>
                    <div class="diag-valore">
                        ${densita}
                    </div>
                </div>
            </div>
            ${
              descViso
                ? `
                    <p style="font-size:14px; color:var(--testo-secondario); line-height:1.6; margin-top:16px;">
                        ${descViso}
                    </p>
                    `
                : ""
            }
        </div>
        <!-- =========================================
             TAB 3 - ROUTINE
        ========================================== -->
        <div id="tab-routine" class="tab-content">
            <div style="display:flex; flex-direction:column; gap:14px;">
                <div class="diag-item">
                    <div class="diag-etichetta">
                        🧼 Lavaggio
                    </div>
                    <div style="font-size:14px; margin-top:4px;">
                        ${
                          routine.lavaggio || "Utilizzare uno shampoo delicato."
                        }
                    </div>
                </div>
                <div class="diag-item">
                    <div class="diag-etichetta">
                        💨 Asciugatura
                    </div>
                    <div style="font-size:14px; margin-top:4px;">
                        ${routine.asciugatura || "Asciugare con aria tiepida."}
                    </div>
                </div>
                <div class="diag-item">
                    <div class="diag-etichetta">
                        ✨ Trattamenti
                    </div>
                    <div style="font-size:14px; margin-top:4px;">
                        ${
                          routine.trattamenti ||
                          "Utilizzare un balsamo adatto alla propria struttura."
                        }
                    </div>
                </div>
            </div>
            ${
              primoTaglio.styling_tip
                ? `
                    <p style="font-size:13px; color:var(--oro); padding-top:16px; padding-bottom:16px;">
                        <strong>
                            Styling tip:
                        </strong>
                        ${primoTaglio.styling_tip}
                    </p>
                    `
                : ""
            }
            ${
              prodotti.length
                ? `
                    <div style="margin-top:18px;">
                        <strong style="font-size:13px; color:var(--salvia);">
                            Prodotti consigliati:
                        </strong>
                        <ul style="margin-top:8px; padding-left:20px; font-size:14px; color:var(--testo-secondario);">
                            ${prodotti
                              .map((prodotto) => `<li>${prodotto}</li>`)
                              .join("")}
                        </ul>
                    </div>
                    `
                : ""
            }
            ${
              daEvitare.length
                ? `
                    <div style="margin-top:14px;">
                        <strong style="font-size:13px; color:#FF6B6B;">
                            Ingredienti da evitare:
                        </strong>
                        <ul style="margin-top:8px; padding-left:20px; font-size:14px; color:var(--testo-secondario);">
                            ${daEvitare
                              .map((ingrediente) => `<li>${ingrediente}</li>`)
                              .join("")}
                        </ul>
                    </div>
                    `
                : ""
            }
        </div>
        <!-- =========================================
             TAB 4 - PARRUCCHIERE
        ========================================== -->
        <div id="tab-parrucchiere" class="tab-content">
            <p style="font-size:14px; color:var(--testo-secondario); margin-bottom:12px;">
                Mostra o leggi direttamente
                questo messaggio al tuo parrucchiere:
            </p>
            <div class="scheda-parrucchiere-box">
                <p id="testo-scheda-parrucchiere" style="font-size:15px; font-weight:600; color:var(--testo); line-height:1.5; padding-right:40px;">
                    "${schedaParrucchiere}"
                </p>
                <button type="button" class="bottone-secondario scheda-copia-btn" id="btn-copia-scheda">
                    📋 Copia
                </button>
            </div>
        </div>
        <!-- =========================================
             PARRUCCHIERE VICINO
        ========================================== -->
        <div class="trova-parrucchiere-section">
            <div class="trova-parrucchiere-content">
          
                <div>
                    <h3>
                        Vuoi fare questo taglio?
                    </h3>
                    <p>
                        Trova un parrucchiere vicino a te.
                    </p>
                </div>
            </div>
            <button type="button" class="btn-trova-parrucchiere" id="btn-trova-parrucchiere" style="padding-top:10px; padding-bottom:10px;">
                                    📍 Trova parrucchiere →
            </button>
        </div>
    `;
  /* =====================================================
       MOSTRA CONTAINER
    ===================================================== */
  cardContainer.style.display = "block";
  cardContainer.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
  /* =====================================================
       CLICK CARD
    ===================================================== */
  document.querySelectorAll(".btn-scopri-taglio").forEach((button) => {
    button.addEventListener("click", () => {
      const indice = Number(button.dataset.taglioIndex);
      const taglio = tagli[indice];
      if (!taglio) {
        return;
      }
      const dettaglio = document.getElementById("dettaglio-taglio");
      if (dettaglio) {
        dettaglio.innerHTML = creaDettaglioTaglio(taglio);
        collegaGenerazioneAnteprima();
      }
      // Rivela l'header delle tab solo ora, alla prima scelta di un taglio.
      const tabsHeader = document.getElementById("tabs-header");
      if (tabsHeader) {
        tabsHeader.style.removeProperty("display");
      }
      window.cambiaTab("tab-taglio");
      document.getElementById("tab-taglio")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
  /* =====================================================
       COPIA SCHEDA PARRUCCHIERE
    ===================================================== */
  document.getElementById("btn-copia-scheda")?.addEventListener("click", () => {
    copiaInAppunti(schedaParrucchiere);
    mostraToast("📋 Scheda copiata!");
  });
  document
    .getElementById("btn-trova-parrucchiere")
    ?.addEventListener("click", () => {
      trovaParrucchiere();
    });
  collegaGenerazioneAnteprima();
}
/* =========================================================
   DETTAGLIO SINGOLO TAGLIO
========================================================= */
function creaDettaglioTaglio(taglio) {
  if (!taglio) {
    return `
            <p>
                Nessun dettaglio disponibile.
            </p>
        `;
  }
  return `
        <div class="dettaglio-taglio-header">
            <span style="color:var(--oro); font-size:13px; padding-top:10px; padding-bottom:6px; font-weight:700;">
                TAGLIO CONSIGLIATO
            </span>
            <h2 class="titolo-sezione" style="color:var(--oro); margin-top:6px;">
                ${taglio.nome || "Taglio Personalizzato"}
            </h2>
            ${
              taglio.compatibilita
                ? `
                    <div style="margin-top:8px; font-size:14px;">
                        <strong>
                            ${taglio.compatibilita}%
                        </strong>
                        compatibilità stimata
                    </div>
                    `
                : ""
            }
        </div>
        ${
          taglio.perche_adatto
            ? `
                <div style="background:rgba(226,136,89,0.1); border-left:3px solid var(--oro); padding:12px 16px; border-radius:4px; margin-top:18px;">
                    <strong style="color:var(--oro); font-size:13px;">
                        💡 Perché ti valorizza
                    </strong>
                    <p style="font-size:14px; margin-top:4px; line-height:1.5;">
                        ${taglio.perche_adatto}
                    </p>
                </div>
                `
            : ""
        }
        ${
          taglio.styling_tip
            ? `
                <div style="margin-top:18px;">
                    <strong style="color:var(--oro); font-size:13px;">
                        ✨ Styling
                    </strong>
                    <p style="font-size:14px; margin-top:6px; line-height:1.5;">
                        ${taglio.styling_tip}
                    </p>
                </div>
                `
            : ""
        }
        <section class="anteprima-taglio" style="margin-top:24px;">
            <h3>Prova questo taglio</h3>
            <p style="font-size:14px; color:var(--testo-secondario); margin:8px 0 12px;">
                Genera una simulazione del taglio sulla foto che hai analizzato.
            </p>
            <button type="button" class="bottone" id="btn-genera-anteprima" data-nome-taglio="${taglio.nome || ""}" data-descrizione-taglio="${taglio.descrizione || ""}">
                Genera prova del taglio
            </button>
            <div id="risultato-anteprima-taglio" style="margin-top:16px;"></div>
        </section>
    `;
}
function collegaGenerazioneAnteprima() {
  const bottone = document.getElementById("btn-genera-anteprima");
  const risultato = document.getElementById("risultato-anteprima-taglio");
  if (!bottone || !risultato) return;
  bottone.addEventListener("click", async () => {
    if (!fotoAnalizzata) {
      mostraToast("Carica e analizza prima una foto.");
      return;
    }
    const testoOriginale = bottone.textContent;
    bottone.disabled = true;
    bottone.textContent = "Generazione della prova in corso...";
    try {
      const risposta = await generaAnteprimaTaglio(
        fotoAnalizzata,
        bottone.dataset.nomeTaglio,
        bottone.dataset.descrizioneTaglio,
      );
      const immagine = risposta.data?.immagineBase64;
      if (!risposta.success || !immagine) {
        throw new Error("Gemini non ha restituito un’immagine.");
      }
      const mimeType = risposta.data.mimeType || "image/png";
      risultato.innerHTML = `<img class="anteprima-taglio-generata" alt="Simulazione del taglio selezionato" src="data:${mimeType};base64,${immagine}">`;
    } catch (errore) {
      console.error(errore);
      mostraToast(`Impossibile generare la prova: ${errore.message}`);
    } finally {
      bottone.disabled = false;
      bottone.textContent = testoOriginale;
    }
  });
}
/* =========================================================
   TROVA PARRUCCHIERE
========================================================= */
function trovaParrucchiere() {
  /*
       Versione iniziale:
       apre Google Maps cercando parrucchieri
       nella posizione dell'utente.
       Successivamente puoi sostituire questa
       funzione con una vera integrazione Maps/API.
    */
  if (!navigator.geolocation) {
    window.open("https://www.google.com/maps/search/parrucchiere", "_blank");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://www.google.com/maps/search/parrucchiere/@${lat},${lon},14z`;
      window.open(url, "_blank");
    },
    () => {
      mostraToast(
        "📍 Posizione non disponibile. Apro i parrucchieri più vicini.",
      );
      window.open("https://www.google.com/maps/search/parrucchiere", "_blank");
    },
  );
}
/* =========================================================
   CAMBIO TAB
========================================================= */
window.cambiaTab = function (tabId) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("attivo");
  });
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("attivo");
  });
  const tabTarget = document.getElementById(tabId);
  if (tabTarget) {
    tabTarget.classList.add("attivo");
  }
  const activeBtn = Array.from(document.querySelectorAll(".tab-btn")).find(
    (button) => button.getAttribute("onclick")?.includes(tabId),
  );
  if (activeBtn) {
    activeBtn.classList.add("attivo");
  }
};
/* =========================================================
   TRANSIZIONI NAVIGAZIONE
========================================================= */
function inizializzaTransizioniNav() {
  const overlay = document.getElementById("overlay-transizione");
  const linkNav = document.querySelectorAll(".nav-link");
  if (!overlay || linkNav.length === 0) {
    console.warn("Transizioni nav: overlay o link non trovati", {
      overlay,
      numeroLink: linkNav.length,
    });
    return;
  }
  linkNav.forEach((link) => {
    link.addEventListener("click", (e) => {
      const destinazione = link.getAttribute("href");
      if (!destinazione || destinazione === "#") {
        return;
      }
      if (link.classList.contains("attivo")) {
        return;
      }
      e.preventDefault();
      overlay.classList.add("attiva");
      setTimeout(() => {
        window.location.href = destinazione;
      }, 350);
    });
  });
}
/* =========================================================
   DOM READY
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  inizializzaTransizioniNav();
});