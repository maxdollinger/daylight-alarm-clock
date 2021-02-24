const ledDB = require('../db/ledDeff');
const { routErr } = require('../utils/utils');

exports.getLED = (req, res, next) => {
    const data = {
        brightness: ledDB.getBrightness(),
        status: ledDB.status,
    }

    res.data = data;
    next();
};

exports.postLED = routErr((req, res, next) => {
    const { brightness } = req.body;
    const newBrighntess = ledDB.setBrightness(brightness);
    res.msg = `LED set to ${newBrighntess}%`;
    res.data = newBrighntess;

    next();
})

exports.updateLED = (req, res, next) => {
    const {status} = req.body;
    ledDB.status = status;
    
    res.msg = `status set to: ${ledDB.status}`;
    res.data = ledDB.status;

    next();
}