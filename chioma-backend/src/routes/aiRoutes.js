const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const aiController = require('../controllers/aiController');

// Rotta per verificare lo stato dell'API
router.get('/health', aiController.healthCheck);

// Rotta principale per l'analisi foto con l'AI
router.post('/analizza', upload.single('foto'), aiController.analizzaFoto);

module.exports = router;
