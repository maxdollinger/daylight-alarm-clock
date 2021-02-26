let Gpio;
let led;

if (process.argv[2] === 'prod') {
    Gpio = require('pigpio').Gpio;
    led = new Gpio(13, { mode: Gpio.OUTPUT });

    led.pwmWrite(0);
} else {
    led = {
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

    const iv = setInterval(() => {
        if (data.pwm === pwm) {
            clearInterval(iv);
        } else {
            pwm > data.pwm ? data.pwm++ : data.pwm--;
            led.pwmWrite(data.pwm);
        }
    }, 5);

    return Math.round(pwm/255 * 100);
}

const update = () => data.pwm === 0 ? pwm(100) : pwm(0);

const get = () => ({
    brightness: Math.round(data.pwm / 255 * 100),
    status: data.pwm > 0 ? 'on' : 'off',
})

module.exports = {
    pwm,
    post: ({brightness}) => pwm(brightness),
    put: update,
    get,
}
