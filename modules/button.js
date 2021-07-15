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

    button.on('alert', (level, tick) => {
        if (level === 0) {
            doubleClick += 1;
            setTimeout(() => doubleClick = 0, 500);

            if (doubleClick < 2) {
                console.log("light on");

                interval = setInterval(() => {
                    if (direction === "up") {
                        count += 1;
                        if (count >= 255) direction = "down";
                    } else {
                        count -= 1;
                        if (count <= 1) direction = "up";
                    }
                    led.pwm(count);
                }, 30);
            } else {
                count = 0;
                console.log("light off");
            }

        }
        if (level === 1) {
            clearInterval(interval);
            console.log(count);
        }
    });

    return button;
}