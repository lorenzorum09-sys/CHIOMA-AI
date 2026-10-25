// src/services/replicateService.js

require("dotenv").config();
const Replicate = require("replicate");

if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN non trovato nel file .env");
}

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

/**
 * Converte un Buffer immagine in Data URI base64,
 * formato richiesto da Replicate per "input_image".
 */
function bufferToDataUri(buffer, mimetype) {
    const base64 = buffer.toString("base64");
    return `data:${mimetype};base64,${base64}`;
}

/**
 * Genera un try-on virtuale del taglio richiesto.
 *
 * @param {Buffer} fotoBuffer - buffer della foto originale dell'utente
 * @param {string} mimetype - mimetype della foto (es. 'image/jpeg')
 * @param {string} nomeTaglio - nome del taglio scelto
 * @param {string} descrizioneTaglio - descrizione aggiuntiva del taglio (opzionale)
 * @returns {Promise<Object>} { immagineUrl } - Data URI base64 dell'immagine generata
 */
async function generaTryOnCapelli(fotoBuffer, mimetype, nomeTaglio, descrizioneTaglio) {
    if (!fotoBuffer) {
        throw new Error("Foto mancante.");
    }
    if (!nomeTaglio) {
        throw new Error("Nome del taglio mancante.");
    }

    const imageDataUri = bufferToDataUri(fotoBuffer, mimetype);

    const prompt = `Change only this person's hairstyle to a ${nomeTaglio}. ${descrizioneTaglio || ""} Keep the face, skin tone, expression, body, clothing and background exactly the same. Realistic photo, natural lighting.`;

    console.log(`\nGenerazione try-on: ${nomeTaglio}`);
    console.log("Invio immagine a Replicate...");

    const output = await replicate.run(
        "black-forest-labs/flux-kontext-pro",
        {
            input: {
                prompt: prompt,
                input_image: imageDataUri
            }
        }
    );

    console.log("Generazione completata.");

    let fileOutput = output;

    // Alcuni modelli possono restituire un array di output.
    if (Array.isArray(output)) {
        fileOutput = output[0];
    }

    if (!fileOutput) {
        throw new Error("Replicate non ha restituito alcun output.");
    }

    // Raccogliamo i byte dell'immagine in memoria (invece che su disco)
    let bufferGenerato;

    if (typeof fileOutput[Symbol.asyncIterator] === "function") {
        // Caso: FileOutput / ReadableStream
        const chunks = [];
        for await (const chunk of fileOutput) {
            chunks.push(chunk);
        }
        bufferGenerato = Buffer.concat(chunks);

    } else if (typeof fileOutput === "string") {
        // Caso: URL restituito direttamente
        const response = await fetch(fileOutput);
        if (!response.ok) {
            throw new Error(`Errore download immagine: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        bufferGenerato = Buffer.from(arrayBuffer);

    } else {
        throw new Error("Formato output Replicate non riconosciuto.");
    }

    // Convertiamo il risultato in Data URI da rimandare al frontend
    const immagineBase64 = bufferGenerato.toString("base64");
    const immagineUrl = `data:image/png;base64,${immagineBase64}`;

    return {
        immagineUrl,
        taglio: nomeTaglio
    };
}

module.exports = {
    generaTryOnCapelli
};