const createDB = require('./createDB');

const alarmScheme = {
    time: {
        default: (() => {
            const current = Date.now()
            const remaining5min = current % (5*60*1000);
            return current - remaining5min;
        })(),
        type: 'number',
    },
    fading: {
        type: 'number',
        default: 20*60*1000,
        min: 5*60*1000,
        max: 30*60*1000,
    },
    status: {
        type: 'string',
        values: ['on', 'off'],
        default: 'off',
    }
}

const Alarm = createDB('alarm', alarmScheme);

const isTimeInPast = (time) => {
    return (time - Alarm.fading) < Date.now()
}

Alarm.getTimeString = function() {
    return (new Date(this.time)).toLocaleTimeString("de-DE");
}

Alarm.setTime = function(time) {
    if(isTimeInPast(time)) {
        time += 1000*60*60*24;
    }
    time -= time % (1000*60);
    this.time = time;
    this.status = 'on';
}

Alarm.shouldFadingStart = function() {
    if (this.status === "on" && isTimeInPast(this.time)) {
        this.status = 'off';
        return true;
    } else {
        return false;
    }
}

Alarm.on = function() {
    this.setTime(this.time);
    this.status = 'on';
    return this.status;
}

Alarm.off = function() {
    this.status = 'off';
    return this.status;
}

module.exports = Alarm;