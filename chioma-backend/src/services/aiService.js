const { ai } = require('../config/gemini');

/**
 * Analizza l'immagine caricata per identificare:
 * - forma del viso
 * - tipo di capello
 * - densità e volume
 * - 3 tagli consigliati
 * - routine di cura
 * - prodotti consigliati
 * - scheda tecnica per il parrucchiere
 */
async function analizzaFotoCapelli(fileBuffer, mimeType) {
    if (!fileBuffer) {
        throw new Error('Nessun file immagine fornito per l\'analisi.');
    }

    const fotoBase64 = fileBuffer.toString('base64');

    const promptText = `
Sei un Hair Stylist professionista e Visagista esperto.

Analizza attentamente l'immagine fornita, concentrandoti esclusivamente sugli elementi visibili:
- forma del viso
- proporzioni del viso
- tipo e struttura dei capelli
- lunghezza attuale
- densità
- volume
- eventuale movimento, mosso, riccio o liscio
- caratteristiche utili alla scelta del taglio

Non inventare caratteristiche che non puoi osservare chiaramente.

Il tuo obiettivo è aiutare la persona a scegliere il taglio di capelli più adatto al proprio viso e alla propria struttura dei capelli.

Restituisci ESCLUSIVAMENTE un JSON valido.
NON usare markdown.
NON usare blocchi \`\`\`json.
NON aggiungere testo prima o dopo il JSON.

Il JSON deve avere ESATTAMENTE questa struttura:

{
    "forma_viso": "Nome della forma del viso",
    "forma_viso_descrizione": "Descrizione sintetica e precisa delle caratteristiche osservate",

    "tipo_capello": "Descrizione del tipo e della struttura dei capelli",

    "densita_volume": "Valutazione della densità e del volume percepito",

    "tagli_consigliati": [
        {
            "posizione": 1,
            "nome": "Nome preciso del taglio",
            "compatibilita": 95,
            "descrizione": "Descrizione precisa di come dovrebbe essere realizzato il taglio",
            "perche_adatto": "Spiegazione del motivo per cui questo taglio è particolarmente adatto alla persona",
            "styling_tip": "Consiglio pratico per ottenere e mantenere lo styling",
            "scheda_parrucchiere": "Frase tecnica e semplice da mostrare o dire al parrucchiere"
        },
        {
            "posizione": 2,
            "nome": "Nome preciso del secondo taglio",
            "compatibilita": 90,
            "descrizione": "Descrizione precisa del taglio",
            "perche_adatto": "Perché questo taglio è adatto",
            "styling_tip": "Consiglio pratico per lo styling",
            "scheda_parrucchiere": "Frase tecnica da mostrare al parrucchiere"
        },
        {
            "posizione": 3,
            "nome": "Nome preciso del terzo taglio",
            "compatibilita": 85,
            "descrizione": "Descrizione precisa del taglio",
            "perche_adatto": "Perché questo taglio è adatto",
            "styling_tip": "Consiglio pratico per lo styling",
            "scheda_parrucchiere": "Frase tecnica da mostrare al parrucchiere"
        }
    ],

    "routine_cura": {
        "lavaggio": "Frequenza e modalità di lavaggio consigliate",
        "asciugatura": "Tecnica di asciugatura consigliata",
        "trattamenti": "Consiglio su balsamo, maschera o altri trattamenti"
    },

    "prodotti_consigliati": [
        "Tipologia di prodotto 1",
        "Tipologia di prodotto 2",
        "Tipologia di prodotto 3"
    ],

    "ingredienti_da_evitare": [
        "Ingrediente o tipologia da evitare 1",
        "Ingrediente o tipologia da evitare 2"
    ]
}

REGOLE IMPORTANTI:

1. Devi fornire ESATTAMENTE 3 tagli.
2. Devono essere ordinati dal più adatto al meno adatto.
3. "posizione" deve essere 1, 2 e 3.
4. "compatibilita" deve essere un numero intero da 0 a 100.
5. Non assegnare percentuali casuali: la compatibilità deve riflettere realmente quanto il taglio valorizza la forma del viso e la struttura dei capelli osservate.
6. I tre tagli devono essere realmente differenti tra loro.
7. Evita consigli generici come "taglio corto" o "taglio moderno": usa nomi specifici.
8. Considera sia la forma del viso sia il tipo di capello.
9. Non consigliare un taglio soltanto perché è di moda.
10. Se una caratteristica dei capelli non è chiaramente visibile, non inventarla.
11. La "scheda_parrucchiere" deve essere concreta e utilizzabile dal cliente.
12. Mantieni un tono professionale, preciso ed elegante.
13. Non includere diagnosi mediche o dermatologiche.
`;

    try {
        const rispostaAI = await ai.models.generateContent({
            // Il precedente modello Flash non è più disponibile per le nuove chiavi.
            model: 'gemini-3.6-flash',

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

        if (!testoGrezzo) {
            throw new Error('Gemini non ha restituito alcun risultato.');
        }

        // Rimuove eventuali blocchi markdown nel caso Gemini li restituisca comunque
        const testoPulito = testoGrezzo
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();

        let datiJson;

        try {
            datiJson = JSON.parse(testoPulito);
        } catch (erroreJson) {
            console.error('❌ JSON restituito da Gemini non valido:');
            console.error(testoPulito);

            throw new Error('La risposta dell\'AI non è un JSON valido.');
        }

        // Controllo struttura minima
        if (!datiJson.tagli_consigliati) {
            throw new Error('La risposta AI non contiene i tagli consigliati.');
        }

        if (!Array.isArray(datiJson.tagli_consigliati)) {
            throw new Error('I tagli consigliati non sono in formato array.');
        }

        if (datiJson.tagli_consigliati.length !== 3) {
            throw new Error('L\'AI non ha restituito esattamente 3 tagli.');
        }

        // Riordina i tagli in base alla compatibilità
        datiJson.tagli_consigliati.sort(
            (a, b) => b.compatibilita - a.compatibilita
        );

        // Assicura posizione 1, 2, 3
        datiJson.tagli_consigliati.forEach((taglio, index) => {
            taglio.posizione = index + 1;
        });

        return datiJson;

    } catch (errore) {
        console.error('❌ Errore durante la chiamata Gemini AI:', errore);

        let messaggio = 'Impossibile completare l\'analisi AI dell\'immagine. ' +
            'Verifica che la foto mostri chiaramente il viso e i capelli.';

        if (errore.status === 429) {
            messaggio = 'Hai raggiunto il limite di richieste consentite per il piano Gemini attuale. Riprova più tardi.';
        } else if (errore.status === 503) {
            messaggio = 'Il servizio AI è momentaneamente sovraccarico. Riprova tra qualche secondo.';
        }

        const erroreDaLanciare = new Error(messaggio);
        // Conserva lo status originale (429, 503, ecc.) così il controller
        // e l'error handler finale possono rispondere con il codice HTTP corretto.
        erroreDaLanciare.status = errore.status || 500;

        throw erroreDaLanciare;
    }
}

/**
 * Genera un'immagine mostrando il taglio consigliato applicato alla foto originale.
 */
async function generaImmagineTaglio(fileBuffer, mimeType, nomeTaglio, descrizioneTaglio) {
    if (!fileBuffer) {
        throw new Error('Nessun file immagine fornito per la generazione.');
    }

    if (!nomeTaglio) {
        throw new Error('Nome del taglio mancante per la generazione dell\'immagine.');
    }

    const fotoBase64 = fileBuffer.toString('base64');

    const promptImmagine = `Modifica questa foto applicando il seguente taglio di capelli: "${nomeTaglio}".
Dettagli del taglio: ${descrizioneTaglio || 'non specificati'}.
Mantieni il viso della persona perfettamente riconoscibile, cambia solo l'acconciatura in modo realistico e naturale.`;

    try {
        const rispostaAI = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
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
                            text: promptImmagine
                        }
                    ]
                }
            ]
        });

        // Cerca la parte con i dati immagine nella risposta
        const parti = rispostaAI.candidates?.[0]?.content?.parts || [];
        const partImmagine = parti.find(p => p.inlineData);

        if (!partImmagine) {
            console.error('❌ Nessuna immagine trovata nella risposta:', JSON.stringify(rispostaAI, null, 2));
            throw new Error('Nessuna immagine generata nella risposta.');
        }

        return {
            immagineBase64: partImmagine.inlineData.data,
            mimeType: partImmagine.inlineData.mimeType || 'image/png'
        };

    } catch (errore) {
        console.error('❌ Errore durante la generazione immagine:', errore);

        let messaggio = 'Impossibile generare l\'immagine del taglio. Riprova con un\'altra foto o taglio.';

        if (errore.status === 429) {
            messaggio = 'Hai raggiunto il limite di richieste consentite per il piano Gemini attuale. Riprova più tardi.';
        } else if (errore.status === 503) {
            messaggio = 'Il servizio AI è momentaneamente sovraccarico. Riprova tra qualche secondo.';
        }

        const erroreDaLanciare = new Error(messaggio);
        erroreDaLanciare.status = errore.status || 500;

        throw erroreDaLanciare;
    }
}

module.exports = {
    analizzaFotoCapelli,
    generaImmagineTaglio
}