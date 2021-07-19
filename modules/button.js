module.exports = function ({ pigpio, store }) {
    const Gpio = pigpio.Gpio;
    const button = new Gpio(process.env.BUTTON_GPIO, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_UP,
        alert: true,
    });

    button.glitchFilter(10000);

    let countUpwards = true;
    let clickCount = 0;
    let timeout;
    let interval;

    button.on("alert", (level) => {
        store.led.pwm === 0 && (countUpwards = true);
        store.led.pwm === 255 && (countUpwards = false);

        if (level === 0) {
            clickCount += 1;

            timeout = setTimeout(() => {
                if (clickCount === 1) {
                    interval = setInterval(() => {
                        countUpwards ? store.led.pwm += 1 : store.led.pwm -= 1;
                    }, 15);
                }

                clickCount = 0;
            }, 300);

            if (clickCount >= 2) {
                clearTimeout(timeout);
                clickCount = 0;

                store.led.pwm = store.led.pwm > 0 ? 0 : 255;
            }
        }

        if (level === 1) {
            countUpwards = !countUpwards;

            clearTimeout(timeout);
            clearInterval(interval);
        }
    });

    return button;
}