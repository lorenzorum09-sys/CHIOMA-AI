const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error('GEMINI_API_KEY non è configurata. Impostala nelle variabili d’ambiente di Render.');
}

const client = new GoogleGenAI({ apiKey });

const attesa = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const tentativiMassimi = 3;

async function generaContenutoConRetry(richiesta) {
    for (let tentativo = 1; ; tentativo++) {
        try {
            return await client.models.generateContent(richiesta);
        } catch (errore) {
            const status = errore.status ?? errore.statusCode ?? errore.code;
            const ultimoTentativo = tentativo >= tentativiMassimi;

            // 503 indica indisponibilità temporanea del modello/servizio.
            // Non ripetere 429: in genere indica quota o rate limit e ritentare
            // subito può aggravare il limite.
            if (Number(status) !== 503 || ultimoTentativo) {
                throw errore;
            }

            const ritardoMs = 1000 * (2 ** (tentativo - 1));
            console.warn(`Gemini ha risposto 503; nuovo tentativo ${tentativo + 1}/${tentativiMassimi} tra ${ritardoMs} ms.`);
            await attesa(ritardoMs);
        }
    }
}

// Mantiene l’interfaccia usata dai servizi, aggiungendo retry per errori 503 transitori.
const ai = {
    models: {
        generateContent: generaContenutoConRetry
    }
};

module.exports = { ai };
