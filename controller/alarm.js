const alarmDB = require('../db/alarmDeff');
const { get } = require('./factory');

exports.getAlarm = get(alarmDB);

exports.updateAlarm = (req, res, next) => {
    const {status} = req.body;
    alarmDB.status = status
    
    console.log(`Alarm: ${status}`);
    if(status === 'on')
        console.log(`Alarm set to: ${alarmDB.getTimeString()}`);
        
    res.msg = `status set to: ${alarmDB.status}`;
    res.data = alarmDB.status;

    next();
}

exports.postAlarm = (req, res, next) => {
    const {time} = req.body;
    alarmDB.time = time;

    console.log(`Alarm set to: ${alarmDB.getTimeString()}`);

    res.msg = `Alarm set to: ${alarmDB.getTimeString()}`
    res.data = alarmDB.time;

    next();
}