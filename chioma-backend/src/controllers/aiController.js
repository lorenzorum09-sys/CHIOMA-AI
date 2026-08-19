const aiService = require('../services/aiService');

async function analizzaFoto(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ errore: 'Nessuna foto selezionata. Seleziona o scatta una foto per procedere.' });
        }

        const risultatoAnalisi = await aiService.analizzaFotoCapelli(
            req.file.buffer,
            req.file.mimetype
        );

        return res.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: risultatoAnalisi
        });

    } catch (errore) {
        next(errore);
    }
}

function healthCheck(req, res) {
    return res.json({
        status: 'online',
        service: 'Chioma AI Backend',
        timestamp: new Date().toISOString()
    });
}

async function generaImmagineTaglio(req, res, next) {
    try {
        if (!req.file) {
            return res.status(400).json({ errore: 'Nessuna foto selezionata.' });
        }

        const risultato = await aiService.generaImmagineTaglio(
            req.file.buffer,
            req.file.mimetype,
            req.body.nomeTaglio,
            req.body.descrizioneTaglio
        );

        return res.json({ success: true, data: risultato });
    } catch (errore) {
        next(errore);
    }
}

module.exports = {
    analizzaFoto,
    healthCheck,
    generaImmagineTaglio
};
