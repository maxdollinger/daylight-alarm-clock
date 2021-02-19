const express = require('express');

const { getLED, postLED } = require('../controller/led'); 
const router = express();

router.get('/led', getLED);
router.post('/led', postLED);

module.exports = router;