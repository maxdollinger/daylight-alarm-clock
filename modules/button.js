module.exports = function ({ pigpio, store: { led } }) {
    const Gpio = pigpio.Gpio;
    const button = new Gpio(process.env.BUTTON_GPIO, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_UP,
        alert: true,
    });

    button.glitchFilter(10000);

    let countUpwards = true;
    let clickCount = 0;
    let interval;

    button.on("alert", (level) => {
        led.pwm === 0 && (countUpwards = true);
        led.pwm === 255 && (countUpwards = false);

        if (level === 0) {
            interval = setInterval(() => countUpwards ? led.pwm += 1 : led.pwm -= 1, 15);

            clickCount += 1;
            setTimeout(() => clickCount = 0, 450);
        };

        if (level === 1) {
            clickCount >= 2 && (led.pwm = 0);
            countUpwards = !countUpwards;

            clearInterval(interval);
        }
    });

    return button;
}