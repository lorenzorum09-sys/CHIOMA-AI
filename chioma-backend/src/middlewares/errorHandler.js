const multer = require('multer');

function errorHandler(err, req, res, next) {
    console.error('❌ Errore Backend:', err.message || err);

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ errore: 'La dimensione del file supera il limite massimo di 10MB.' });
        }
        return res.status(400).json({ errore: `Errore caricamento file: ${err.message}` });
    }

    if (err.message && err.message.includes('non è un\'immagine valida')) {
        return res.status(400).json({ errore: err.message });
    }

    // Se l'errore arriva già con uno status specifico (es. 429 quota
    // esaurita, 503 servizio AI sovraccarico, allegato in aiService.js),
    // lo rispettiamo invece di rispondere sempre 500.
    if (err.status && err.status !== 500) {
        return res.status(err.status).json({
            errore: err.message || 'Errore durante la richiesta.'
        });
    }

    res.status(500).json({
        errore: err.message || 'Errore interno del server durante l\'analisi.'
    });
}

module.exports = errorHandler;