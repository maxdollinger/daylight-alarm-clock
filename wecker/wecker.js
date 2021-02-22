const alarmDB = require('../db/alarmModel');
const led = require('../gpio/ledpwm');

const fade = minutes => {
     const iv = setInterval(() => {
          led.brightness++;

          if (led.brightness >= 100) {
               clearInterval(iv);
          }
     }, (minutes * 600))
}

const clock = setInterval(() => {
     if (alarmDB.shouldFadingStart()) fade(alarmDB.fading);
}, 5000);

module.exports = clock;
