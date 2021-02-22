const Gpio = require('pigpio').Gpio;
const led = new Gpio(13, { mode: Gpio.OUTPUT });

led.pwmWrite(0);

const settings = {
    brightness: 0,
};

const pwmToPercent = value => Math.round(value / 255 * 100);
const percentToPwm = value => Math.round(255 * (value / 100));

const handler = {
    get: (obj, prop) => {
        if (prop === 'brightness') {
            return pwmToPercent(obj[prop]);
        }
    },
    set: (obj, prop, value) => {
        let changed = false;

        if (prop === 'brightness') {
            if (value < 0 || value > 100) return false;

            const brightness = percentToPwm(value);
            changed = brightness !== obj.brightness;

            if (changed) {
                    let cB = obj.brightness;
                    const iv = setInterval(() => {
                        cB < brightness ?  cB++ : cB--;

                        led.pwmWrite(cB);
                        if (cB === brightness) {
                            obj.brightness = brightness;
                            console.log(`Brightness set to: ${brightness}`);
                            clearInterval(iv);
                        }
                    }, 5);
                }
        }

        return changed;
    }
}

const proxy = new Proxy(settings, handler);

module.exports = proxy;