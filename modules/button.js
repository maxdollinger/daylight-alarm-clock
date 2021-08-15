module.exports = function ({ pigpio, store: { led }, led }) {
    const Gpio = pigpio.Gpio;
    const button = new Gpio(process.env.BUTTON_GPIO, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_UP,
        alert: true,
    });

    button.glitchFilter(10000);

    let countUpwards = true;
    // let clickCount = 0;
    // let timeout;
    let interval;

    button.on("alert", (level) => {
        led.pwm === 0 && (countUpwards = true);
        led.pwm === 255 && (countUpwards = false);

        if (level === 0) {
            interval = setInterval(() => countUpwards ? led.pwm += 1 : led.pwm -= 1, 15);
        };

        if (level === 1) {
            countUpwards = !countUpwards;

            clearInterval(interval);
        }
    });

    return button;
}