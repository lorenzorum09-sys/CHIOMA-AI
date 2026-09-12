const fs = require('fs');
const path = require('path');

const PATH_FILE = path.join(__dirname, '..', '..', 'data', 'risposte.json');

exports.salvaRisposta = (req, res) => {
    const { nome, eta, sesso, conoscenza } = req.body;

    if (!nome || !eta || !sesso || !conoscenza) {
        return res.status(400).json({ errore: 'Dati mancanti' });
    }

    const nuovaRisposta = {
        nome,
        eta: Number(eta),
        sesso,
        conoscenza,
        data: new Date().toISOString()
    };

    let risposte = [];
    if (fs.existsSync(PATH_FILE)) {
        const contenuto = fs.readFileSync(PATH_FILE, 'utf-8');
        risposte = contenuto ? JSON.parse(contenuto) : [];
    }

    risposte.push(nuovaRisposta);

    fs.writeFileSync(PATH_FILE, JSON.stringify(risposte, null, 2));

    res.status(201).json({ messaggio: 'Risposta salvata' });
};