module.exports = function ({ pigpio, store }) {
    const Gpio = pigpio.Gpio;
    const button = new Gpio(process.env.BUTTON_GPIO, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_UP,
        alert: true,
    });

    button.glitchFilter(10000);

    const led = store.led;
    let pwm = 0;
    let countUpwards = true;
    let clickCount = 0;
    let timeout;
    let interval;

    button.on("alert", (level) => {
        pwm = led.pwm;

        if (level === 0) {
            clickCount += 1;
            pwm === 0 && (countUpwards = true);
            pwm === 255 && (countUpwards = false);

            timeout = setTimeout(() => {
                if (clickCount === 1) {
                    interval = setInterval(() => {
                        led.pwm = countUpwards ? pwm += 1 : pwm -= 1;
                    }, 15);
                }

                clickCount = 0;
            }, 250);

            if (clickCount === 2) {
                clearTimeout(timeout);
                clickCount = 0;

                led.pwm = pwm > 0 ? 0 : 255;
            }
        }

        if (level === 1) {
            countUpwards = !countUpwards;

            clearInterval(interval);
        }
    });

    return button;
}