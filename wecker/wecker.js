const alarmDB = require('../db/alarmModel');
const led = require('../gpio/ledpwm');

const fade = fadingTime => {
     const iv = setInterval(() => {
          led.brightness++;

          if (led.brightness >= 100) {
               clearInterval(iv);
          }
     }, (fadingTime / 100))
}

const clock = setInterval(() => {
     if (alarmDB.shouldFadingStart()){
          console.log(`wake up squence started: ${alarmDB.getTimeString()}`);
          fade(alarmDB.fading);}

}, 5000);

module.exports = clock;
