const createDB = require('./createDB');

const alarmScheme = {
    time: {
        default: [ 8, 0],
        type: 'array',
        size: 2,
    },
    fading: {
        type: 'number',
        default: 20,
        min: 5,
        max: 30,
    },
    status: {
        type: 'string',
        values: ['on', 'off'],
        default: 'off',
    }
}

const Alarm = createDB('alarm', alarmScheme);

Alarm.getAlarmTime = function() {
    return (new Date()).setHours(...this.time, 00)
};

Alarm.on = function() {
    this.status = 'on';
    return this.status;
}

Alarm.off = function() {
    this.status = 'off';
    return this.status;
}

module.exports = Alarm;