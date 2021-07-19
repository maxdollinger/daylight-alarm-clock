module.exports = ({ store: { led }, pigpio }) => {
    const Gpio = pigpio.Gpio;
    const ledControll = new Gpio(process.env.LED_GPIO, { mode: Gpio.OUTPUT });
    ledControll.pwmWrite(0);

    led.subscribe(({ prop, obj }) => prop === "pwm" && ledControll.pwmWrite(obj[prop]));
    led.register(({ current: pwm, prop }) => {
        if (prop === "pwm") {
            pwm > 255 && (pwm = 255);
            pwm < 0 && (pwm = 0);

            return pwm;
        }
    })

    const pwm = (val) => {
        const pwm = val instanceof Function ? val(led.pwm) : Math.round(val);

        const iv = setInterval(() => {
            if (led.pwm === pwm) {
                clearInterval(iv);
            } else {
                led.pwm < pwm ? led.pwm += 1 : led.pwm -= 1;
            }
        }, 4);

        return led;
    }

    const toggle = () => {
        led.pwm === 0 ? pwm(255) : pwm(0)

        return led;
    };

    return {
        pwm,
        get: () => led,
        post: ({ brightness }) => pwm(brightness),
        put: toggle,
    }
}