const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const aiRoutes = require('./src/routes/aiRoutes');
const accountRoutes = require('./src/routes/accountRoutes'); // ← nuovo
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware di decodifica
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serviamo la cartella dei file statici frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rotte API
app.use('/api', aiRoutes);
app.use('/api/account', accountRoutes); // ← nuovo

// Gestione rotte non trovate per API (Express 5 compatible)
app.use('/api', (req, res) => {
    res.status(404).json({ errore: 'Endpoint API non trovato.' });
});

// Middleware centralizzato degli errori
app.use(errorHandler);

// In produzione imposta HTTPS_KEY_PATH e HTTPS_CERT_PATH con un certificato valido.
const keyPath = process.env.HTTPS_KEY_PATH;
const certPath = process.env.HTTPS_CERT_PATH;
const usaHttps = keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath);
const server = usaHttps
    ? https.createServer({ key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }, app)
    : app;

// Avvio Server
server.listen(PORT, () => {
    console.log(`✨ Server Chioma AI attivo ed in ascolto su http://localhost:${PORT}`);
});