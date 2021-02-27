let Gpio;
let pin13;

if (process.argv[2] === 'prod') {
    Gpio = require('pigpio').Gpio;
    pin13 = new Gpio(13, { mode: Gpio.OUTPUT });

    pin13.pwmWrite(0);
} else {
    pin13 = {
        pwmWrite: val => console.log(val)
    }
}

const data = {
    pwm: 0,
}

const pwm = (val) => {
    let pwm;

    if(val instanceof Function) {
        pwm = val(data.pwm);
    } else {
        pwm = Math.round(val/100*255);
    }
    pwm > 255 && (pwm = 255);
    pwm < 0 && (pwm = 0);
    let cPwm = data.pwm;
    data.pwm = pwm

    const iv = setInterval(() => {
        if (cPwm === pwm) {
            clearInterval(iv);
        } else {
            pwm > cPwm ? ++cPwm : --cPwm;
            pin13.pwmWrite(cPwm);
        }
    }, 5);

    return Math.round(pwm/255 * 100);
}

const toggle = () => data.pwm === 0 ? pwm(100) : pwm(0);

const get = () => ({
    brightness: Math.round(data.pwm / 255 * 100),
    status: data.pwm > 0 ? 'on' : 'off',
})

module.exports = {
    name: 'led',
    pwm,
    get,
    post: ({brightness}) => pwm(brightness),
    put: toggle,
}