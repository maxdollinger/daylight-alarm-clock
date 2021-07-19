module.exports = ({ store, pigpio }) => {
    const Gpio = pigpio.Gpio;
    const led = new Gpio(process.env.LED_GPIO, { mode: Gpio.OUTPUT });
    led.pwmWrite(0);

    const data = store.led;
    data.subscribe((prop, value, obj) => {
        if (prop === "pwm") {
            value > 255 && (value = 255);
            value < 0 && (value = 0);

            const iv = setInterval(() => {
                if (value === obj[prop]) {
                    clearInterval(iv);
                } else {
                    value > obj[prop] ? obj[prop] += 1 : obj[prop] -= 1;
                    led.pwmWrite(obj[prop]);
                }
            }, 5);
        }
    })

    const pwm = (val) => {
        const pwm = val instanceof Function ? val(data.pwm) : Math.round(val);
        data.pwm = pwm;
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