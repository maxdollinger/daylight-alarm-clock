const createDeffinition = require("./maxState");
const Gpio = require('pigpio').Gpio;
const led = new Gpio(13, { mode: Gpio.OUTPUT });

led.pwmWrite(0);

// const led = {
//     pwmWrite: val => console.log(val)
// }

const deff = {
    brightness: {
        default: 0,
        validate: val => (val <= 255 && val >= 0),
    },
    status: {
        default: 'off',
        validate: val => ['on', 'off'].includes(val),
    }
}

const ledDeff = createDeffinition('led', deff);

ledDeff.createListener('brightness', (newVal, oldVal) => {
    const iv = setInterval(() => {
        if (oldVal === newVal) {
            clearInterval(iv);
        } else {
            oldVal < newVal ? oldVal++ : oldVal--;
            led.pwmWrite(oldVal);
        }
    }, 5);
});
ledDeff.createListener('brightness', (val, _, proxy) => proxy.status = val <= 0 ? 'off' : 'on');

ledDeff.createHandler('getBrightness', (val, led) => Math.round(led.brightness / 255 * 100));
ledDeff.createHandler('setBrightness', (value, state) => {
    value > 100 && (value = 100);
    value < 0 && (value = 0);

    const brightness = Math.round(255 * (value / 100));
    state.brightness = brightness;

    return value;
});

module.exports = ledDeff;