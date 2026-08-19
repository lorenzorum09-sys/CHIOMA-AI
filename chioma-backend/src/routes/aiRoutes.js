const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const aiController = require('../controllers/aiController');

router.get('/health', aiController.healthCheck);
router.post('/analizza', upload.single('foto'), aiController.analizzaFoto);
router.post('/genera-immagine', upload.single('foto'), aiController.generaImmagineTaglio);

module.exports = router
