const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcrypt');

const PERCORSO_DB = path.join(__dirname, '..', '..', 'data', 'utenti.json');
const SALT_ROUNDS = 10; // costo computazionale dell'hashing: più alto = più sicuro ma più lento

/**
 * Legge tutti gli utenti dal file JSON.
 * Se il file non esiste ancora, lo considera vuoto invece di andare in errore.
 */
async function leggiUtenti() {
    try {
        const contenuto = await fs.readFile(PERCORSO_DB, 'utf-8');
        return JSON.parse(contenuto);
    } catch (errore) {
        if (errore.code === 'ENOENT') {
            return [];
        }
        throw errore;
    }
}

/**
 * Scrive l'array utenti aggiornato nel file JSON.
 */
async function scriviUtenti(utenti) {
    await fs.writeFile(PERCORSO_DB, JSON.stringify(utenti, null, 2));
}

/**
 * Registra un nuovo utente: controlla duplicati, hasha la password, salva su file.
 */
async function registraUtente(email, password) {
    const utenti = await leggiUtenti();

    const emailNormalizzata = email.trim().toLowerCase();
    const emailGiaEsistente = utenti.some(u => u.email === emailNormalizzata);

    if (emailGiaEsistente) {
        const errore = new Error('Questa email è già registrata.');
        errore.status = 409; // Conflict
        throw errore;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const nuovoUtente = {
        id: Date.now().toString(),
        email: emailNormalizzata,
        passwordHash,
        creatoIl: new Date().toISOString()
    };

    utenti.push(nuovoUtente);
    await scriviUtenti(utenti);

    // Non restituire mai passwordHash al chiamante
    return { id: nuovoUtente.id, email: nuovoUtente.email };
}

module.exports = {
    registraUtente
};