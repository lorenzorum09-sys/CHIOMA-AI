document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     DIZIONARIO TRADUZIONI
     Aggiungi qui ogni nuova chiave data-i18n che usi nell'HTML,
     ripetendola per tutte e 3 le lingue.
  ========================================================= */
  const traduzioni = {
    it: {
      menu_lingua: "Lingua",

      eyebrow: "Capelli, finalmente capiti",
      titolo_home: "Il taglio giusto <em>parte da una foto</em>",
      descrizione_home: "Carica uno scatto, scopri la forma del tuo viso e ricevi l'analisi visagistica AI con i consigli da mostrare direttamente al parrucchiere.",
      titolo_cta: "Trova il tuo stile ideale",
      descrizione_cta: "Zero dubbi prima di sederti sulla poltrona del barbiere o parrucchiere.",
      btn_scansiona: "✨ Scansiona la tua foto ora",
      link_privacy: "Privacy & Termini d'uso",
      nav_home: "Home",
      nav_scansiona: "Scansiona AI",
      nav_guida: "Guida Cura",

      istr_come_titolo: "Tre passaggi, zero incertezze",
      istr_come_eyebrow: "Come funziona l'AI",
      istr_step1_titolo: "Scatta una foto nitida",
      istr_step1_testo: "Viso e capelli ben visibili e ben illuminati, al naturale.",
      istr_step2_titolo: "Elaborazione Visagistica",
      istr_step2_testo: "L'AI individua le proporzioni del viso, il tipo di capello e il volume.",
      istr_step3_titolo: "Verdetto & Scheda Parrucchiere",
      istr_step3_testo: "Ricevi i consigli sul taglio perfetto ed il messaggio pronto per il barbiere.",
      istr_perche_eyebrow: "Perché scegliere Chioma AI",
      istr_perche1_titolo: "Analisi Visagistica AI",
      istr_perche1_testo: "Riconosce la forma esatta del viso (Ovale, Squadrato, Cuore, ecc.) e la natura dei tuoi capelli.",
      istr_perche2_titolo: "Scheda per il Parrucchiere",
      istr_perche2_testo: "Genera una spiegazione tecnica e precisa pronta da dire o mostrare al parrucchiere durante il taglio.",
      istr_perche3_titolo: "Routine & Cura Personalizzata",
      istr_perche3_testo: "Frequenza di lavaggio, asciugatura, prodotti ideali ed ingredienti da evitare per mantenere il taglio perfetto.",
      istr_impari_eyebrow: "Cosa impari",
      istr_impari1_titolo: "Lavaggio",
      istr_impari1_testo: "Frequenza giusta, temperatura dell'acqua e tecnica per il tuo tipo di capello.",
      istr_impari2_titolo: "Prodotti",
      istr_impari2_testo: "Cosa ti serve davvero e cosa puoi tranquillamente evitare di comprare.",
      istr_impari3_titolo: "Asciugatura",
      istr_impari3_testo: "Phon, diffusore o aria naturale: impari a scegliere in base al risultato che vuoi.",

      badge_scanner: "Scanner AI",
      analizza_titolo_upload: "Carica o scatta una foto",
      analizza_sub_upload: "Clicca o trascina qui l'immagine",
      btn_seleziona_foto: "📷 Seleziona una Foto",
      btn_scatta_foto: "Scatta una foto",
      btn_cambia_foto: "Cambia Foto",
      btn_rimuovi_foto: "Rimuovi",
      btn_analizza: "✨ Analizza Viso e Taglio con l'AI",
      modal_annulla: "Annulla",
      modal_scatta: "Scatta",
    },

    en: {
      menu_lingua: "Language",

      eyebrow: "Hair, finally understood",
      titolo_home: "The right cut <em>starts from a photo</em>",
      descrizione_home: "Upload a photo, discover your face shape and get an AI visagism analysis with tips to show directly to your hairdresser.",
      titolo_cta: "Find your ideal style",
      descrizione_cta: "No more doubts before sitting in the barber's or hairdresser's chair.",
      btn_scansiona: "✨ Scan your photo now",
      link_privacy: "Privacy & Terms of use",
      nav_home: "Home",
      nav_scansiona: "AI Scan",
      nav_guida: "Care Guide",

      istr_come_titolo: "Three steps, zero doubts",
      istr_come_eyebrow: "How the AI works",
      istr_step1_titolo: "Take a clear photo",
      istr_step1_testo: "Face and hair clearly visible and well lit, no filters.",
      istr_step2_titolo: "Visagism processing",
      istr_step2_testo: "The AI identifies your facial proportions, hair type and volume.",
      istr_step3_titolo: "Verdict & Hairdresser card",
      istr_step3_testo: "Get the perfect cut recommendation and a ready-to-show message for your barber.",
      istr_perche_eyebrow: "Why choose Chioma AI",
      istr_perche1_titolo: "AI Visagism Analysis",
      istr_perche1_testo: "Recognizes your exact face shape (Oval, Square, Heart, etc.) and hair type.",
      istr_perche2_titolo: "Hairdresser Card",
      istr_perche2_testo: "Generates a precise technical explanation ready to say or show to your hairdresser.",
      istr_perche3_titolo: "Personalized Routine & Care",
      istr_perche3_testo: "Washing frequency, drying, ideal products and ingredients to avoid to keep your cut perfect.",
      istr_impari_eyebrow: "What you'll learn",
      istr_impari1_titolo: "Washing",
      istr_impari1_testo: "The right frequency, water temperature and technique for your hair type.",
      istr_impari2_titolo: "Products",
      istr_impari2_testo: "What you really need and what you can safely skip buying.",
      istr_impari3_titolo: "Drying",
      istr_impari3_testo: "Blow-dryer, diffuser or air-dry: learn to choose based on the result you want.",

      badge_scanner: "AI Scanner",
      analizza_titolo_upload: "Upload or take a photo",
      analizza_sub_upload: "Click or drag the image here",
      btn_seleziona_foto: "📷 Select a Photo",
      btn_scatta_foto: "Take a photo",
      btn_cambia_foto: "Change Photo",
      btn_rimuovi_foto: "Remove",
      btn_analizza: "✨ Analyze Face and Cut with AI",
      modal_annulla: "Cancel",
      modal_scatta: "Capture",
    },

    fr: {
      menu_lingua: "Langue",

      eyebrow: "Les cheveux, enfin compris",
      titolo_home: "La bonne coupe <em>part d'une photo</em>",
      descrizione_home: "Téléchargez une photo, découvrez la forme de votre visage et recevez l'analyse visagiste IA avec des conseils à montrer directement à votre coiffeur.",
      titolo_cta: "Trouvez votre style idéal",
      descrizione_cta: "Plus aucun doute avant de vous asseoir sur le fauteuil du coiffeur.",
      btn_scansiona: "✨ Scannez votre photo maintenant",
      link_privacy: "Confidentialité & Conditions",
      nav_home: "Accueil",
      nav_scansiona: "Scan IA",
      nav_guida: "Guide Soins",

      istr_come_titolo: "Trois étapes, zéro doute",
      istr_come_eyebrow: "Comment fonctionne l'IA",
      istr_step1_titolo: "Prenez une photo nette",
      istr_step1_testo: "Visage et cheveux bien visibles et bien éclairés, au naturel.",
      istr_step2_titolo: "Traitement visagiste",
      istr_step2_testo: "L'IA identifie les proportions du visage, le type de cheveux et le volume.",
      istr_step3_titolo: "Verdict & Fiche Coiffeur",
      istr_step3_testo: "Recevez les conseils sur la coupe parfaite et le message prêt à montrer au coiffeur.",
      istr_perche_eyebrow: "Pourquoi choisir Chioma AI",
      istr_perche1_titolo: "Analyse visagiste IA",
      istr_perche1_testo: "Reconnaît la forme exacte du visage (Ovale, Carré, Cœur, etc.) et la nature de vos cheveux.",
      istr_perche2_titolo: "Fiche pour le coiffeur",
      istr_perche2_testo: "Génère une explication technique précise, prête à dire ou montrer au coiffeur.",
      istr_perche3_titolo: "Routine & Soins personnalisés",
      istr_perche3_testo: "Fréquence de lavage, séchage, produits idéaux et ingrédients à éviter pour garder la coupe parfaite.",
      istr_impari_eyebrow: "Ce que vous apprendrez",
      istr_impari1_titolo: "Lavage",
      istr_impari1_testo: "La bonne fréquence, la température de l'eau et la technique pour votre type de cheveux.",
      istr_impari2_titolo: "Produits",
      istr_impari2_testo: "Ce dont vous avez vraiment besoin et ce que vous pouvez éviter d'acheter.",
      istr_impari3_titolo: "Séchage",
      istr_impari3_testo: "Sèche-cheveux, diffuseur ou air libre : apprenez à choisir selon le résultat voulu.",

      badge_scanner: "Scanner IA",
      analizza_titolo_upload: "Téléchargez ou prenez une photo",
      analizza_sub_upload: "Cliquez ou glissez l'image ici",
      btn_seleziona_foto: "📷 Sélectionner une photo",
      btn_scatta_foto: "Prendre une photo",
      btn_cambia_foto: "Changer de photo",
      btn_rimuovi_foto: "Supprimer",
      btn_analizza: "✨ Analyser visage et coupe avec l'IA",
      modal_annulla: "Annuler",
      modal_scatta: "Capturer",
    },
  };

  /* =========================================================
     APPLICA LA LINGUA A TUTTA LA PAGINA
  ========================================================= */
  function applicaLingua(lingua) {
    const dizionario = traduzioni[lingua];

    if (!dizionario) return;

    document.querySelectorAll("[data-i18n]").forEach((elemento) => {
      const chiave = elemento.dataset.i18n;

      if (dizionario[chiave]) {
        elemento.textContent = dizionario[chiave];
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((elemento) => {
      const chiave = elemento.dataset.i18nHtml;

      if (dizionario[chiave]) {
        elemento.innerHTML = dizionario[chiave];
      }
    });

    document.documentElement.lang = lingua;

    localStorage.setItem("linguaSelezionata", lingua);
  }

  /* =========================================================
     MENU HAMBURGER PRINCIPALE
  ========================================================= */
  const btnHamburger = document.getElementById("btn-hamburger");
  const menuHamburger = document.getElementById("menu-hamburger");

  btnHamburger?.addEventListener("click", () => {
    const ora_aperto = menuHamburger.classList.toggle("aperto");

    btnHamburger.setAttribute("aria-expanded", ora_aperto ? "true" : "false");
  });

  // Chiude il menu se clicco fuori
  document.addEventListener("click", (e) => {
    if (!menuHamburger || !menuHamburger.classList.contains("aperto")) return;

    const cliccoDentro =
      menuHamburger.contains(e.target) || btnHamburger?.contains(e.target);

    if (!cliccoDentro) {
      menuHamburger.classList.remove("aperto");
      btnHamburger?.setAttribute("aria-expanded", "false");
    }
  });

  /* =========================================================
     VOCI DEL MENU CON PANNELLO ESPANDIBILE
     (Lingua oggi, Impostazioni domani: stesso codice per tutte)
  ========================================================= */
  document.querySelectorAll("[data-menu-toggle]").forEach((bottone) => {
    bottone.addEventListener("click", () => {
      const pannello = document.getElementById(bottone.dataset.menuToggle);

      if (!pannello) return;

      const ora_aperto = pannello.classList.toggle("aperto");

      bottone.setAttribute("aria-expanded", ora_aperto ? "true" : "false");
    });
  });

  /* =========================================================
     CAMBIO LINGUA
  ========================================================= */
  document.querySelectorAll('input[name="lingua"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      applicaLingua(e.target.value);
    });
  });

  /* =========================================================
     ALL'AVVIO: applica la lingua salvata (o italiano di default)
  ========================================================= */
  const linguaSalvata = localStorage.getItem("linguaSelezionata") || "it";

  applicaLingua(linguaSalvata);

  document.querySelectorAll('input[name="lingua"]').forEach((radio) => {
    radio.checked = radio.value === linguaSalvata;
  });

});