const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const aiRoutes = require('./src/routes/aiRoutes');
const accountRoutes = require('./src/routes/accountRoutes');
const questionarioRoutes = require('./src/routes/questionario'); 
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', aiRoutes);
app.use('/api/account', accountRoutes);
app.use('/api', questionarioRoutes); // ← spostato qui

app.use('/api', (req, res) => {
    res.status(404).json({ errore: 'Endpoint API non trovato.' });
});

app.use(errorHandler);

const keyPath = process.env.HTTPS_KEY_PATH;
const certPath = process.env.HTTPS_CERT_PATH;
const usaHttps = keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath);
const server = usaHttps
    ? https.createServer({ key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }, app)
    : app;

server.listen(PORT, () => {
    console.log(`✨ Server Chioma AI attivo ed in ascolto su http://localhost:${PORT}`);
});