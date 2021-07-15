module.exports = function ({ led, pigpio, store }) {
    const Gpio = pigpio.Gpio;
    const button = new Gpio(23, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_UP,
        alert: true,
    });

    // Level must be stable for 10 ms before an alert event is emitted.
    button.glitchFilter(10000);

    let count = 0;
    let interval;
    let direction = "up";
    let doubleClick = 0;

    button.on("alert", (level) => {
        count = store.led.pwm;

        if (level === 0) {
            doubleClick += 1;
            setTimeout(() => doubleClick = 0, 500);

            if (doubleClick > 1) {
                count = 0;
                led.pwm(0);
            } else {
                interval = setInterval(() => {
                    if (direction === "up") {
                        count += 1;
                        if (count >= 255) direction = "down";
                    }
                    if (direction === "down") {
                        count -= 1;
                        if (count <= 1) direction = "up";
                    }

                    led.pwm(count);
                }, 15);
            }

        }

        if (level === 1) {
            clearInterval(interval);
        }
    });

    return button;
}