module.exports = function ({led, pigpio, store}) {
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

      button.on('alert', (level, tick) => {
        if (level === 0) {
            interval = setInterval(() => {
                if(direction === "up") {
                    count += 1;
                    if(count >= 255) direction = "down";
                } else {
                    count -= 1;
                    if(count <= 1) direction = "up";
                }
                console.log(count)
            }, 100)
        }
        if(level === 1) {
            clearInterval(interval);
        }
      });

    return button;
}