module.exports = function ({led, pigpio, store}) {
    const Gpio = pigpio.Gpio;
    const button = new Gpio(23, {
        mode: Gpio.INPUT,
        pullUpDown: Gpio.PUD_DOWN,
        edge: Gpio.EITHER_EDGE
      });

    const data = store.led;

    button.on("interupt", lvl => {
        if(lvl === 1) {
            console.log("Button pressed");
        }
    })

    return button;
}