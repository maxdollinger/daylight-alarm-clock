const alarmDB = require('../db/alarmDeff');
const { get } = require('./factory');

exports.getAlarm = get(alarmDB);

exports.updateAlarm = (req, res, next) => {
    const {status} = req.body;
    alarmDB.status = status
    
    res.msg = `status set to: ${alarmDB.status}`;
    res.data = alarmDB.status;

    next();
}

exports.postAlarm = (req, res, next) => {
    const {time} = req.body;
    alarmDB.time = time;

    res.msg = `Alarm set to: ${alarmDB.getTimeString()}`
    console.log(alarmDB.time);
    res.data = alarmDB.time;

    next();
}