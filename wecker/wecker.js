const alarmDB = require('../db/alarmModel');
const led = require('../gpio/ledpwm');

const fade = (minutes) => {
     console.log('===== started fade =====');

     return new Promise(resolve => {
          const iv = setInterval(() => {
               led.brightness++;

               if (led.brightness >= 100) {
                    clearInterval(iv);
                    console.log('===== finished fade =====');
                    resolve(true);
               }
          }, (minutes * 60 * 10))
     })
}

const clock = setInterval(() => {
     if(alarmDB.shouldFadingStart()) fade(1);
}, 5000);

module.exports = clock;
