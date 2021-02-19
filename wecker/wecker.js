const { currentTimeString} = require('../utils/utils');

const alarmClock = alarm => {
     const alarmTime = new Date(...alarm).getTime();
     const interval = setInterval(() => {
          if (Date.now() >= alarmTime) {
               console.log(currentTimeString());
          }
          if(Date.now() >= alarmTime + 2000) {
               clearInterval(interval);
          }
     }, 1000);
}

module.exports = alarmClock;