module.exports = function ({ led, pigpio, store }) {
    const Gpio = pigpio.Gpio;
    const button = new Gpio(process.env.BUTTON_GPIO, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_UP,
        alert: true,
    });

    button.glitchFilter(5000);

    let pwm = 0;
    let interval;
    let countUpwards = true;
    let clickCount = 0;

    button.on("alert", (level) => {
        pwm = store.led.pwm;
        pwm === 0 && (countUpwards = true);
        pwm === 255 && (countUpwards = false);

        if (level === 0) {
            clickCount += 1;

            setTimeout(() => {
                if (clickCount === 1) {
                    interval = setInterval(() => {
                        countUpwards ? pwm += 1 : (pwm = pwm < 10 ? 10 : pwm -= 1)
                        led.pwm(pwm);
                    }, 15);
                }

                clickCount = 0;
            }, 250);

            if (clickCount === 2) {
                led.pwm(pwm > 0 ? 0 : 255);
            }
        }

        if (level === 1) {
            countUpwards = !countUpwards;

            clearInterval(interval);
        }
    });

    return button;
}