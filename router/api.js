const express = require('express');

const { getLED, postLED } = require('../controller/led'); 
const { getAlarm, postAlarm, updateAlarm } = require('../controller/alarm')
const router = express();

//LED Controll
router.get('/led', getLED);
router.post('/led', postLED);

//Alarm
router.get('/alarm' , getAlarm);
router.post('/alarm', postAlarm);
router.put('/alarm', updateAlarm);

module.exports = router;