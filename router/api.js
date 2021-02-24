const express = require('express');

const { getLED, postLED, updateLED } = require('../controller/led'); 
const { getAlarm, postAlarm, updateAlarm } = require('../controller/alarm')
const { getTimer, updateTimer, postTimer} = require('../controller/timer');
const router = express();
const { sendJSON } = require('../controller/factory');

//LED Controll
router.get('/led', getLED);
router.post('/led', postLED);
router.put('/led', updateLED);

//Alarm
router.get('/alarm' , getAlarm);
router.post('/alarm', postAlarm);
router.put('/alarm', updateAlarm);

//Timer
router.get('/timer' , getTimer);
router.post('/timer', postTimer);
router.put('/timer', updateTimer);

router.use(sendJSON)

module.exports = router;