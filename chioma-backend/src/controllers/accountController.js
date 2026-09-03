const accountService = require('../services/accountService');

async function registrazione(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ errore: 'Email e password sono obbligatorie.' });
        }

        const emailValida = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailValida) {
            return res.status(400).json({ errore: 'Formato email non valido.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ errore: 'La password deve avere almeno 8 caratteri.' });
        }

        const utenteCreato = await accountService.registraUtente(email, password);

        return res.status(201).json({
            success: true,
            timestamp: new Date().toISOString(),
            data: utenteCreato
        });

    } catch (errore) {
        next(errore);
    }
}

module.exports = {
    registrazione
};