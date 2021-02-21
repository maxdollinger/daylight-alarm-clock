const led = require('../gpio/ledpwm');

exports.getLED = (req, res, next) => {
    res.json({status: 'success', data: led.brightness})
}

exports.postLED = (req, res, next) => {
    const {brightness} = req.body;
    if(brightness !== undefined) {
        led.brightness = brightness;
        res.status(200).json({
            status: 'success',
            msg: `LED set to ${brightness}%`,
            data: led.brightness})
    } else {
        res.status(500).json({status: 'error'})
    }
}