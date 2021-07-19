module.exports = ({ store, pigpio }) => {
    const Gpio = pigpio.Gpio;
    const led = new Gpio(process.env.LED_GPIO, { mode: Gpio.OUTPUT });
    led.pwmWrite(0);

    store.led.subscribe((prop, value, obj) => {
        if (prop === "pwm") {
            led.pwmWrite(value);
        }
    })

    const pwm = (val) => {
        let pwm = val instanceof Function ? val(store.led.pwm) : Math.round(val);

        pwm > 255 && (pwm = 255);
        pwm < 0 && (pwm = 0);

        const iv = setInterval(() => {
            if (store.led.pwm === pwm) {
                clearInterval(iv);
            } else {
                store.led.pwm < pwm ? store.led.pwm += 1 : store.led.pwm -= 1;
            }
        }, 5);
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