const express = require('express');
const path = require('path');
require('dotenv').config();

const aiRoutes = require('./src/routes/aiRoutes');
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

// Gestione rotte non trovate per API (Express 5 compatible)
app.use('/api', (req, res) => {
    res.status(404).json({ errore: 'Endpoint API non trovato.' });
});

// Middleware centralizzato degli errori
app.use(errorHandler);

// Avvio Server
app.listen(PORT, () => {
    console.log(`✨ Server Chioma AI attivo ed in ascolto su http://localhost:${PORT}`);
});