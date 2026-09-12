const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
console.log(accountController);

router.post('/registrazione', accountController.registrazione);

module.exports = router;