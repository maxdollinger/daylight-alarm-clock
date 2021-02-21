const alarm = require('../db/alarmModel');

exports.getAlarm = (req, res, next) => {
    res.json({data: alarm.get()});
}

exports.updateAlarm = (req, res, next) => {
    const {status} = req.body;
    console.log(status);
    if(status === 'on') alarm.on();
    if(status === 'off') alarm.off();
    
    console.log(`status set to: ${alarm.status}`);
    res.status(200).json({status: 'success', data: alarm.status})
}

exports.postAlarm = (req, res, next) => {
    const {time} = req.body;
    alarm.setTime(time);

    console.log(`Alarm set to: ${(new Date(alarm.time).toString())}`);
    res.status(200).json({status: 'success', data: alarm.time})
}