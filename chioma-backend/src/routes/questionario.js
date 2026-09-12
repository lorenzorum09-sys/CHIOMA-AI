const express = require('express');
const router = express.Router();
const questionarioController = require('../controllers/questionarioController');

router.post('/questionario', questionarioController.salvaRisposta);

module.exports = router;