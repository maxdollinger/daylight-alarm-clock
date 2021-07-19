module.exports = ({ store, pigpio }) => {
    const Gpio = pigpio.Gpio;
    const led = new Gpio(process.env.LED_GPIO, { mode: Gpio.OUTPUT });
    led.pwmWrite(0);

    store.led.subscribe((prop, value, obj) => {
        console.log(prop, value);
        
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
        store.led.pwm = pwm;
    }

    const toggle = () => {
        store.led.pwm === 0 ? pwm(255) : pwm(0)
        return store.led;
    };

    return {
        pwm,
        get: () => store.led,
        post: ({ brightness }) => {
            pwm(brightness);
            return store.led;
        },
        put: toggle,
    }
}