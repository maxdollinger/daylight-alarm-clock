let Gpio;
let pin13 = {
    pwmWrite: val => process.stdout.write(`${val},`),
}

if (process.env.NODE_ENV === 'production') {
    Gpio = require('pigpio').Gpio;
    pin13 = new Gpio(13, { mode: Gpio.OUTPUT });
    pin13.pwmWrite(0);
}

const led = ({ store }) => {

    const data = store.led;

    const pwm = (val) => {
        let pwm = val instanceof Function ? val(data.pwm) : Math.round(val);

        pwm > 255 && (pwm = 255);
        pwm < 0 && (pwm = 0);
        let cPwm = data.pwm;
        data.pwm = pwm;

        const iv = setInterval(() => {
            if (cPwm === pwm) {
                clearInterval(iv);
            } else {
                pwm > cPwm ? ++cPwm : --cPwm;
                pin13.pwmWrite(cPwm);
            }
        }, 5);

        return pwm;
    }

    const toggle = () => {
        data.pwm === 0 ? pwm(255) : pwm(0)
        return data;
    };

    return {
        pwm,
        get: () => data,
        post: ({ brightness }) => {
            pwm(brightness);
            return data;
        },
        put: toggle,
    }
}


module.exports = led;