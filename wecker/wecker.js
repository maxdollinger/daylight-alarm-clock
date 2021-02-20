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

const alarm = () => {
     const fadeTime = alarmDB.getAlarmTime() - (1000 * 60 * 20);
     if (alarmDB.status === 'on' && fadeTime <= Date.now()) {
          alarmDB.status = 'off';
          return true;
     } else {
          return false;
     }
}

const clock = setInterval(() => {
     if(alarm()) fade(1);
}, 5000);

module.exports = clock;
