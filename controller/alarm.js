const alarm = require('../db/alarmModel');

exports.getAlarm = (req, res, next) => {
    res.json(alarm.get());
}

exports.updateAlarm = (req, res, next) => {
    const {status, fading} = req.body;

    if(status === 'on') alarm.on();
    if(status === 'off') alarm.off();
    alarm.fading = fading;
    
    console.log(alarm.get());
    res.status(200).json({status: 'success'})
}

exports.postAlarm = (req, res, next) => {
    const {time} = req.body;
    console.log(time);
    alarm.time = time;

    console.log(alarm.get());
    res.status(200).json({status: 'success'})
}