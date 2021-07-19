module.exports = ({ store, pigpio }) => {
    const Gpio = pigpio.Gpio;
    const led = new Gpio(process.env.LED_GPIO, { mode: Gpio.OUTPUT });
    led.pwmWrite(0);

    store.led.subscribe((prop, value, obj) => {
        if (prop === "pwm") {
            led.pwmWrite(value);
        }
    })

    store.led.register(({ current: pwm, prop }) => {
        if (prop === "pwm") {
            pwm > 255 && (pwm = 255);
            pwm < 0 && (pwm = 0);
            return pwm;
        }
    })

    const pwm = (val) => {
        const pwm = val instanceof Function ? val(store.led.pwm) : Math.round(val);

        const iv = setInterval(() => {
            if (store.led.pwm === pwm) {
                clearInterval(iv);
            } else {
                store.led.pwm < pwm ? store.led.pwm += 1 : store.led.pwm -= 1;
            }
        }, 4);

        return store.led;
    }

    const toggle = () => {
        store.led.pwm === 0 ? pwm(255) : pwm(0)

        return store.led;
    };

    return {
        pwm,
        get: () => store.led,
        post: ({ brightness }) => pwm(brightness),
        put: toggle,
    }
}