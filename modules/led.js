module.exports = ({ store, pigpio }) => {
    const Gpio = pigpio.Gpio;
    const led = new Gpio(process.env.LED_GPIO, { mode: Gpio.OUTPUT });
    led.pwmWrite(0);

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