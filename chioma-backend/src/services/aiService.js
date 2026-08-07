const { ai } = require('../config/gemini');

/**
 * Analizza l'immagine caricata per identificare la forma del viso, il tipo di capello,
 * i tagli consigliati e una routine di cura personalizzata.
 */
async function analizzaFotoCapelli(fileBuffer, mimeType) {
    if (!fileBuffer) {
        throw new Error('Nessun file immagine fornito per l\'analisi.');
    }

    const fotoBase64 = fileBuffer.toString('base64');

    const promptText = `
Sei un Hair Stylist professionista ed Visagista esperto. 
Analizza l'immagine fornita (viso e capelli della persona) e fornisci una diagnosi personalizzata dettagliata ed elegante.

Rispondi ESCLUSIVAMENTE in formato JSON valido, senza markdown né testo aggiuntivo prima o dopo. 
Il JSON deve avere la seguente struttura esatta:

{
  "forma_viso": "Nome della forma (es. Ovale, Squadrata, Rotonda, A Cuore, A Diamante, Allungata)",
  "forma_viso_descrizione": "Spiegazione sintetica delle caratteristiche visive notate sul viso",
  "tipo_capello": "Descrizione tipo capello (es. Mossi fini, Ricci definiti spessi, Lisci a piombo, Corposi con tendenza al crespo)",
  "densita_volume": "Valutazione sintetica su densità e volume percepito",
  "taglio_principale": {
    "nome": "Nome preciso del taglio ideale (es. Textured Crop con sfumatura, Long Bob scalato, Curtain Bangs Shag)",
    "descrizione": "Dettaglio di come deve essere eseguito il taglio",
    "perche_adatto": "Perché questo taglio valorizza la forma del viso e la struttura dei capelli notata",
    "styling_tip": "Consiglio pratico per lo styling quotidiano a casa"
  },
  "alternativa_taglio": {
    "nome": "Nome di un'alternativa valida",
    "descrizione": "Descrizione dell'alternativa",
    "perche_adatto": "Spiegazione per cui può essere un'ottima alternativa"
  },
  "routine_cura": {
    "lavaggio": "Frequenza ideale e modalità di lavaggio",
    "asciugatura": "Tecnica consigliata (diffusore, aria tiepida, phon con beccuccio)",
    "trattamenti": "Consiglio su balsamo, maschera o siero nutrizionale"
  },
  "prodotti_consigliati": [
    "Tipologia prodotto 1",
    "Tipologia prodotto 2",
    "Tipologia prodotto 3"
  ],
  "ingredienti_da_evitare": [
    "Ingrediente o tipologia da evitare 1",
    "Ingrediente o tipologia da evitare 2"
  ],
  "scheda_parrucchiere": "Frase sintetica e tecnica pronta da mostrare o dire direttamente al parrucchiere per richiedere esattamente questo lavoro."
}
`;

    try {
        const rispostaAI = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            inlineData: {
                                mimeType: mimeType || 'image/jpeg',
                                data: fotoBase64
                            }
                        },
                        {
                            text: promptText
                        }
                    ]
                }
            ]
        });

        const testoGrezzo = rispostaAI.text || '';
        // Pulizia da blocchi markdown ```json ``` o ```
        const testoPulito = testoGrezzo
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();

        const datiJson = JSON.parse(testoPulito);
        return datiJson;

    } catch (errore) {
        console.error('❌ Errore durante la chiamata Gemini AI:', errore);
        throw new Error('Impossibile completare l\'analisi AI dell\'immagine. Verifica che la foto mostri chiaramente il viso e i capelli.');
    }
}

module.exports = {
    analizzaFotoCapelli
};
