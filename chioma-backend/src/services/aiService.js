const { ai } = require('../config/gemini');

/**
 * Ritorna il prompt in base alla lingua richiesta
 */
function getPromptForLanguage(lingua) {
    const prompts = {
        'it': `
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
`,
        'en': `
You are a professional Hair Stylist and Expert Visagist.

Carefully analyze the provided image, focusing exclusively on visible elements:
- face shape
- face proportions
- hair type and structure
- current length
- density
- volume
- any movement, waves, curls or straightness
- characteristics useful for choosing the right cut

Do not invent characteristics you cannot clearly observe.

Your goal is to help the person choose the haircut most suitable for their face shape and hair structure.

Return EXCLUSIVELY valid JSON.
Do NOT use markdown.
Do NOT use \`\`\`json blocks.
Do NOT add any text before or after the JSON.

The JSON must have EXACTLY this structure:

{
    "face_shape": "Name of the face shape",
    "face_shape_description": "Concise and precise description of observed characteristics",
    "hair_type": "Description of hair type and structure",
    "density_volume": "Assessment of perceived density and volume",
    "recommended_cuts": [
        {
            "position": 1,
            "name": "Precise name of the cut",
            "compatibility": 95,
            "description": "Precise description of how the cut should be realized",
            "why_suitable": "Explanation of why this cut is particularly suitable for this person",
            "styling_tip": "Practical advice to achieve and maintain styling",
            "barber_notes": "Technical phrase simple to show or tell the barber"
        },
        {
            "position": 2,
            "name": "Precise name of the second cut",
            "compatibility": 90,
            "description": "Precise description of the cut",
            "why_suitable": "Why this cut is suitable",
            "styling_tip": "Practical advice for styling",
            "barber_notes": "Technical phrase to show the barber"
        },
        {
            "position": 3,
            "name": "Precise name of the third cut",
            "compatibility": 85,
            "description": "Precise description of the cut",
            "why_suitable": "Why this cut is suitable",
            "styling_tip": "Practical advice for styling",
            "barber_notes": "Technical phrase to show the barber"
        }
    ],
    "care_routine": {
        "washing": "Recommended washing frequency and method",
        "drying": "Recommended drying technique",
        "treatments": "Advice on conditioner, mask or other treatments"
    },
    "recommended_products": [
        "Product type 1",
        "Product type 2",
        "Product type 3"
    ],
    "ingredients_to_avoid": [
        "Ingredient or type to avoid 1",
        "Ingredient or type to avoid 2"
    ]
}

IMPORTANT RULES:
1. You must provide EXACTLY 3 cuts.
2. They must be ordered from most to least suitable.
3. "position" must be 1, 2, and 3.
4. "compatibility" must be an integer from 0 to 100.
5. Do not assign random percentages: compatibility must truly reflect how well the cut enhances the observed face shape and hair structure.
6. The three cuts must be truly different from each other.
7. Avoid generic advice like "short cut" or "modern cut": use specific names.
8. Consider both face shape and hair type.
9. Do not recommend a cut just because it is trendy.
10. If a hair characteristic is not clearly visible, do not invent it.
11. The "barber_notes" must be concrete and usable by the client.
12. Maintain a professional, precise and elegant tone.
13. Do not include medical or dermatological diagnoses.
`,
        'es': `
Eres un Estilista Capilar profesional y Visagista experto.

Analiza cuidadosamente la imagen proporcionada, concentrándote exclusivamente en elementos visibles:
- forma del rostro
- proporciones del rostro
- tipo y estructura del cabello
- largo actual
- densidad
- volumen
- cualquier movimiento, ondas, rizos o liso
- características útiles para elegir el corte correcto

No inventes características que no puedas observar claramente.

Tu objetivo es ayudar a la persona a elegir el corte de cabello más adecuado para su forma de rostro y estructura de cabello.

Devuelve EXCLUSIVAMENTE JSON válido.
No uses markdown.
No uses bloques \`\`\`json.
No agregues texto antes o después del JSON.

El JSON debe tener EXACTAMENTE esta estructura:

{
    "forma_rostro": "Nombre de la forma del rostro",
    "forma_rostro_descripcion": "Descripción concisa y precisa de características observadas",
    "tipo_cabello": "Descripción del tipo y estructura del cabello",
    "densidad_volumen": "Evaluación de densidad y volumen percibido",
    "cortes_recomendados": [
        {
            "posicion": 1,
            "nombre": "Nombre preciso del corte",
            "compatibilidad": 95,
            "descripcion": "Descripción precisa de cómo debe realizarse el corte",
            "porque_adecuado": "Explicación de por qué este corte es particularmente adecuado",
            "consejo_styling": "Consejo práctico para lograr y mantener el peinado",
            "notas_peluqueria": "Frase técnica simple para mostrar o decir al peluquero"
        },
        {
            "posicion": 2,
            "nombre": "Nombre preciso del segundo corte",
            "compatibilidad": 90,
            "descripcion": "Descripción precisa del corte",
            "porque_adecuado": "Por qué este corte es adecuado",
            "consejo_styling": "Consejo práctico para el peinado",
            "notas_peluqueria": "Frase técnica para mostrar al peluquero"
        },
        {
            "posicion": 3,
            "nombre": "Nombre preciso del tercer corte",
            "compatibilidad": 85,
            "descripcion": "Descripción precisa del corte",
            "porque_adecuado": "Por qué este corte es adecuado",
            "consejo_styling": "Consejo práctico para el peinado",
            "notas_peluqueria": "Frase técnica para mostrar al peluquero"
        }
    ],
    "rutina_cuidado": {
        "lavado": "Frecuencia y método de lavado recomendado",
        "secado": "Técnica de secado recomendada",
        "tratamientos": "Consejo sobre acondicionador, mascarilla u otros tratamientos"
    },
    "productos_recomendados": [
        "Tipo de producto 1",
        "Tipo de producto 2",
        "Tipo de producto 3"
    ],
    "ingredientes_a_evitar": [
        "Ingrediente o tipo a evitar 1",
        "Ingrediente o tipo a evitar 2"
    ]
}

REGLAS IMPORTANTES:
1. Debes proporcionar EXACTAMENTE 3 cortes.
2. Deben ordenarse de más a menos adecuado.
3. "posicion" debe ser 1, 2 y 3.
4. "compatibilidad" debe ser un número entero de 0 a 100.
5. No asignes porcentajes aleatorios: la compatibilidad debe reflejar realmente cuán bien el corte realza la forma del rostro y estructura del cabello observados.
6. Los tres cortes deben ser realmente diferentes entre sí.
7. Evita consejos genéricos como "corte corto" o "corte moderno": usa nombres específicos.
8. Considera tanto la forma del rostro como el tipo de cabello.
9. No recomiendes un corte solo porque es tendencia.
10. Si una característica del cabello no es claramente visible, no la inventes.
11. Las "notas_peluqueria" deben ser concretas y útiles para el cliente.
12. Mantén un tono profesional, preciso y elegante.
13. No incluyas diagnósticos médicos o dermatológicos.
`,
        'fr': `
Vous êtes un Coiffeur professionnel et Visagiste expert.

Analysez attentivement l'image fournie, en vous concentrant exclusivement sur les éléments visibles:
- forme du visage
- proportions du visage
- type et structure des cheveux
- longueur actuelle
- densité
- volume
- tout mouvement, ondulation, boucles ou lissé
- caractéristiques utiles pour choisir la bonne coupe

N'inventez pas de caractéristiques que vous ne pouvez pas observer clairement.

Votre objectif est d'aider la personne à choisir la coupe de cheveux la plus adaptée à la forme de son visage et à sa structure capillaire.

Retournez EXCLUSIVEMENT du JSON valide.
N'utilisez pas markdown.
N'utilisez pas de blocs \`\`\`json.
N'ajoutez pas de texte avant ou après le JSON.

Le JSON doit avoir EXACTEMENT cette structure:

{
    "forme_visage": "Nom de la forme du visage",
    "forme_visage_description": "Description succincte et précise des caractéristiques observées",
    "type_cheveux": "Description du type et de la structure des cheveux",
    "densite_volume": "Évaluation de la densité et du volume perçu",
    "coupes_recommandees": [
        {
            "position": 1,
            "nom": "Nom précis de la coupe",
            "compatibilite": 95,
            "description": "Description précise de la réalisation de la coupe",
            "pourquoi_adapte": "Explication de pourquoi cette coupe est particulièrement adaptée",
            "conseil_coiffage": "Conseil pratique pour obtenir et maintenir le style",
            "notes_coiffeur": "Phrase technique simple à montrer ou dire au coiffeur"
        },
        {
            "position": 2,
            "nom": "Nom précis de la deuxième coupe",
            "compatibilite": 90,
            "description": "Description précise de la coupe",
            "pourquoi_adapte": "Pourquoi cette coupe est adaptée",
            "conseil_coiffage": "Conseil pratique pour le coiffage",
            "notes_coiffeur": "Phrase technique à montrer au coiffeur"
        },
        {
            "position": 3,
            "nom": "Nom précis de la troisième coupe",
            "compatibilite": 85,
            "description": "Description précise de la coupe",
            "pourquoi_adapte": "Pourquoi cette coupe est adaptée",
            "conseil_coiffage": "Conseil pratique pour le coiffage",
            "notes_coiffeur": "Phrase technique à montrer au coiffeur"
        }
    ],
    "routine_soin": {
        "lavage": "Fréquence et méthode de lavage recommandée",
        "sechage": "Technique de séchage recommandée",
        "traitements": "Conseils sur l'après-shampooing, le masque ou autres soins"
    },
    "produits_recommandes": [
        "Type de produit 1",
        "Type de produit 2",
        "Type de produit 3"
    ],
    "ingredients_a_eviter": [
        "Ingrédient ou type à éviter 1",
        "Ingrédient ou type à éviter 2"
    ]
}

RÈGLES IMPORTANTES:
1. Vous devez fournir EXACTEMENT 3 coupes.
2. Elles doivent être ordonnées de la plus à la moins adaptée.
3. "position" doit être 1, 2 et 3.
4. "compatibilite" doit être un nombre entier de 0 à 100.
5. N'assignez pas de pourcentages aléatoires: la compatibilité doit vraiment refléter à quel point la coupe met en valeur la forme du visage et la structure capillaire observées.
6. Les trois coupes doivent être vraiment différentes les unes des autres.
7. Évitez les conseils génériques comme "coupe courte" ou "coupe moderne": utilisez des noms spécifiques.
8. Considérez à la fois la forme du visage et le type de cheveux.
9. Ne recommandez pas une coupe juste parce qu'elle est tendance.
10. Si une caractéristique des cheveux n'est pas clairement visible, ne l'inventez pas.
11. Les "notes_coiffeur" doivent être concrètes et utilisables par le client.
12. Maintenez un ton professionnel, précis et élégant.
13. N'incluez pas de diagnostics médicaux ou dermatologiques.
`,
        'de': `
Sie sind ein professioneller Haarstylist und Visagist-Experte.

Analysieren Sie das bereitgestellte Bild sorgfältig und konzentrieren Sie sich ausschließlich auf sichtbare Elemente:
- Gesichtsform
- Gesichtsproportionen
- Haartyp und Struktur
- aktuelle Länge
- Dichte
- Volumen
- eventuelle Bewegung, Wellen, Locken oder glattes Haar
- Merkmale, die bei der Wahl des richtigen Schnitts hilfreich sind

Erfinden Sie keine Eigenschaften, die Sie nicht deutlich beobachten können.

Ihr Ziel ist es, der Person zu helfen, den Haarschnitt zu wählen, der am besten zu ihrer Gesichtsform und Haarstruktur passt.

Geben Sie AUSSCHLIESSLICH gültiges JSON zurück.
Verwenden Sie NICHT markdown.
Verwenden Sie NICHT \`\`\`json Blöcke.
Fügen Sie KEINEN Text vor oder nach dem JSON hinzu.

Das JSON muss GENAU diese Struktur haben:

{
    "gesichtsform": "Name der Gesichtsform",
    "gesichtsform_beschreibung": "Knappe und genaue Beschreibung der beobachteten Merkmale",
    "haartyp": "Beschreibung des Haartyps und der Struktur",
    "dichte_volumen": "Bewertung der Dichte und des wahrgenommenen Volumens",
    "empfohlene_schnitte": [
        {
            "position": 1,
            "name": "Genaue Bezeichnung des Schnitts",
            "kompatibilitat": 95,
            "beschreibung": "Genaue Beschreibung, wie der Schnitt durchgeführt werden sollte",
            "warum_geeignet": "Erklärung, warum dieser Schnitt besonders geeignet ist",
            "styling_tipp": "Praktischer Rat zum Erreichen und Beibehalten der Frisur",
            "friseur_notizen": "Technische Aussage zum Zeigen oder Sagen an den Friseur"
        },
        {
            "position": 2,
            "name": "Genaue Bezeichnung des zweiten Schnitts",
            "kompatibilitat": 90,
            "beschreibung": "Genaue Beschreibung des Schnitts",
            "warum_geeignet": "Warum dieser Schnitt geeignet ist",
            "styling_tipp": "Praktischer Rat zum Stylen",
            "friseur_notizen": "Technische Aussage zum Zeigen an den Friseur"
        },
        {
            "position": 3,
            "name": "Genaue Bezeichnung des dritten Schnitts",
            "kompatibilitat": 85,
            "beschreibung": "Genaue Beschreibung des Schnitts",
            "warum_geeignet": "Warum dieser Schnitt geeignet ist",
            "styling_tipp": "Praktischer Rat zum Stylen",
            "friseur_notizen": "Technische Aussage zum Zeigen an den Friseur"
        }
    ],
    "pflegeroutine": {
        "waschen": "Empfohlene Waschfrequenz und Methode",
        "trocknen": "Empfohlene Trocknungstechnik",
        "behandlungen": "Ratschlag zu Conditioner, Maske oder anderen Behandlungen"
    },
    "empfohlene_produkte": [
        "Produkttyp 1",
        "Produkttyp 2",
        "Produkttyp 3"
    ],
    "zu_vermeidende_inhaltsstoffe": [
        "Inhaltsstoff oder Typ zu vermeiden 1",
        "Inhaltsstoff oder Typ zu vermeiden 2"
    ]
}

WICHTIGE REGELN:
1. Sie müssen GENAU 3 Schnitte bereitstellen.
2. Sie müssen vom am besten bis zum am wenigsten geeigneten geordnet sein.
3. "position" muss 1, 2 und 3 sein.
4. "kompatibilitat" muss eine ganze Zahl von 0 bis 100 sein.
5. Vergeben Sie nicht zufällig Prozentsätze: die Kompatibilität muss wirklich widerspiegeln, wie gut der Schnitt die beobachtete Gesichtsform und Haarstruktur zur Geltung bringt.
6. Die drei Schnitte müssen wirklich unterschiedlich voneinander sein.
7. Vermeiden Sie generische Ratschläge wie "kurzer Schnitt" oder "moderner Schnitt": verwenden Sie spezifische Namen.
8. Berücksichtigen Sie sowohl die Gesichtsform als auch den Haartyp.
9. Empfehlen Sie einen Schnitt nicht nur, weil er gerade trendy ist.
10. Wenn ein Haarmerkmal nicht deutlich sichtbar ist, erfinden Sie es nicht.
11. Die "friseur_notizen" müssen konkret und für den Kunden nutzbar sein.
12. Behalten Sie einen professionellen, präzisen und eleganten Ton bei.
13. Fügen Sie keine medizinischen oder dermatologischen Diagnosen ein.
`
    };
    
    return prompts[lingua] || prompts['it']; // Default to Italian
}

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
async function analizzaFotoCapelli(fileBuffer, mimeType, lingua = 'it') {
    if (!fileBuffer) {
        throw new Error('Nessun file immagine fornito per l\'analisi.');
    }

    const fotoBase64 = fileBuffer.toString('base64');
    const promptText = getPromptForLanguage(lingua);

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

        // Controllo struttura minima (supporta sia la struttura italiana che inglese)
        const tagliFieled = datiJson.tagli_consigliati || datiJson.recommended_cuts;
        
        if (!tagliFieled) {
            throw new Error('La risposta AI non contiene i tagli consigliati.');
        }

        if (!Array.isArray(tagliFieled)) {
            throw new Error('I tagli consigliati non sono in formato array.');
        }

        if (tagliFieled.length !== 3) {
            throw new Error('L\'AI non ha restituito esattamente 3 tagli.');
        }

        // Riordina i tagli in base alla compatibilità
        const compatField = tagliFieled[0].compatibilita !== undefined ? 'compatibilita' : 'compatibility';
        const posField = 'posizione' in tagliFieled[0] ? 'posizione' : 'position';
        
        tagliFieled.sort((a, b) => b[compatField] - a[compatField]);

        // Assicura posizione 1, 2, 3
        tagliFieled.forEach((taglio, index) => {
            taglio[posField] = index + 1;
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
async function generaImmagineTaglio(fileBuffer, mimeType, nomeTaglio, descrizioneTaglio, lingua = 'it') {
    if (!fileBuffer) {
        throw new Error('Nessun file immagine fornito per la generazione.');
    }

    if (!nomeTaglio) {
        throw new Error('Nome del taglio mancante per la generazione dell\'immagine.');
    }

    const fotoBase64 = fileBuffer.toString('base64');

    // Prompt adattato alla lingua
    const prompts = {
        'it': `Modifica questa foto applicando il seguente taglio di capelli: "${nomeTaglio}".
Dettagli del taglio: ${descrizioneTaglio || 'non specificati'}.
Mantieni il viso della persona perfettamente riconoscibile, cambia solo l'acconciatura in modo realistico e naturale.`,
        'en': `Edit this photo by applying the following haircut: "${nomeTaglio}".
Cut details: ${descrizioneTaglio || 'not specified'}.
Keep the person's face perfectly recognizable, change only the hairstyle in a realistic and natural way.`,
        'es': `Edita esta foto aplicando el siguiente corte de cabello: "${nomeTaglio}".
Detalles del corte: ${descrizioneTaglio || 'no especificado'}.
Mantén el rostro de la persona perfectamente reconocible, cambia solo el peinado de manera realista y natural.`,
        'fr': `Modifiez cette photo en appliquant la coupe de cheveux suivante: "${nomeTaglio}".
Détails de la coupe: ${descrizioneTaglio || 'non spécifiés'}.
Gardez le visage de la personne parfaitement reconnaissable, ne modifiez que la coiffure de manière réaliste et naturelle.`,
        'de': `Bearbeiten Sie dieses Foto durch die Anwendung des folgenden Haarschnitts: "${nomeTaglio}".
Schnittdetails: ${descrizioneTaglio || 'nicht angegeben'}.
Halten Sie das Gesicht der Person perfekt erkennbar, ändern Sie nur die Frisur auf realistische und natürliche Weise.`
    };

    const promptImmagine = prompts[lingua] || prompts['it'];

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