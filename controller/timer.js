const timerDB = require('../db/timerDeff');
const { get } = require('./factory');

exports.getTimer = get(timerDB);

exports.updateTimer = (req, res, next) => {
    const {status} = req.body;
    timerDB.status = status;
    console.log(`Sleep timer: ${status}`);
    if(status === 'on')
        console.log(`Sleep timer set to: ${(new Date(timerDB.startTime).toString())}`);
    
    res.data = timerDB.status;
    next();
}

exports.postTimer = (req, res, next) => {
    const {time} = req.body;
    timerDB.time = time;
    console.log(`Sleep timer set to: ${(new Date(timerDB.startTime).toString())}`);
    res.data =  timerDB.time;
    next();
}