const alarm = require('../db/alarmDeff');
const timer = require('../db/timerDeff');
const led = require('../db/ledDeff');

const clock = setInterval(() => {
     alarm.alarmTimer(led);
     timer.sleepTimer(led);
}, 5000);

module.exports = clock;
