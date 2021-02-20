const alarm = require('../db/alarmModel');

const createAlarm = (timeArr, fade) => {
     alarm.time = timeArr;
     alarm.fade = fade || 20;
     alarm.status = 'on';
     console.log(alarm);
};

const deactivateAlarm = () => {
     alarm.status = 'off';
     console.log(alarm);
};

const activateAlarm = () => {
     alarm.status = 'on';
     console.log(alarm);
}

module.exports = {
     set: createAlarm,
     on: activateAlarm,
     off: deactivateAlarm,
     getAlarm: () => ({ ...alarm }),
     getAlarmTime: () => (new Date()).setHours(...alarm.time)
};



